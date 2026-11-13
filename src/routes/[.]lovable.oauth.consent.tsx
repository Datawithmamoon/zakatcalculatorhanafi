import { useState } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

type ClientInfo = {
  name?: string | null;
  client_name?: string | null;
  redirect_uri?: string | null;
  redirect_uris?: string[] | null;
};

type AuthorizationDetails = {
  client?: ClientInfo | null;
  scope?: string | null;
  scopes?: string[] | null;
  redirect_url?: string | null;
  redirect_to?: string | null;
};

type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: unknown; error: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data: unknown; error: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data: unknown; error: { message: string } | null }>;
};

const oauth = (supabase.auth as typeof supabase.auth & { oauth: OAuthApi }).oauth;
const title = "Connect an assistant — Zakat Pro";
const description = "Review and approve an assistant's access to Zakat Pro tools.";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" ? value as Record<string, unknown> : null;
}

function normalizeDetails(value: unknown): AuthorizationDetails | null {
  const raw = asRecord(value);
  if (!raw) return null;
  const client = asRecord(raw["client"]);
  const name = typeof client?.["name"] === "string"
    ? client["name"]
    : typeof client?.["client_name"] === "string" ? client["client_name"] : null;
  const redirectUri = typeof client?.["redirect_uri"] === "string" ? client["redirect_uri"] : null;
  const redirectUris = Array.isArray(client?.["redirect_uris"])
    ? client["redirect_uris"].filter((entry): entry is string => typeof entry === "string")
    : null;
  const rawScopes = raw["scopes"] ?? raw["requested_scopes"];
  return {
    client: client ? { name, client_name: name, redirect_uri: redirectUri, redirect_uris: redirectUris } : null,
    scope: typeof raw["scope"] === "string" ? raw["scope"] : null,
    scopes: Array.isArray(rawScopes) ? rawScopes.filter((scope): scope is string => typeof scope === "string") : null,
    redirect_url: typeof raw["redirect_url"] === "string" ? raw["redirect_url"] : null,
    redirect_to: typeof raw["redirect_to"] === "string" ? raw["redirect_to"] : null,
  };
}

function redirectDestination(value: unknown): string | null {
  const raw = asRecord(value);
  return typeof raw?.["redirect_url"] === "string"
    ? raw["redirect_url"]
    : typeof raw?.["redirect_to"] === "string" ? raw["redirect_to"] : null;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    authorization_id: typeof search["authorization_id"] === "string" ? search["authorization_id"] : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("This authorization request is invalid or expired.");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({
        to: "/auth",
        search: { next: location.pathname + location.searchStr },
      });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id");
    if (!authorizationId) throw new Error("This authorization request is invalid or expired.");
    const [{ data, error }, { data: userData }] = await Promise.all([
      oauth.getAuthorizationDetails(authorizationId),
      supabase.auth.getUser(),
    ]);
    const details = normalizeDetails(data);
    if (error || !details) throw new Error("This authorization request is invalid or expired.");
    const immediate = redirectDestination(data);
    if (immediate && !details.client) throw redirect({ href: immediate });
    return { details, email: userData.user?.email ?? "Signed-in account" };
  },
  component: ConsentPage,
  errorComponent: ConsentError,
});

function ConsentPage() {
  const { details, email } = Route.useLoaderData();
  const { authorization_id: authorizationId } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientName = details.client?.name ?? details.client?.client_name ?? "An assistant";
  const redirectUri = details.client?.redirect_uri ?? details.client?.redirect_uris?.[0] ?? "Not provided";
  const scopes = (details.scope ?? details.scopes?.join(" ") ?? "openid email profile")
    .split(/\s+/)
    .filter(Boolean);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    try {
      const { data, error: actionError } = approve
        ? await oauth.approveAuthorization(authorizationId)
        : await oauth.denyAuthorization(authorizationId);
      if (actionError || !data) throw new Error("The decision could not be completed.");
      const destination = redirectDestination(data);
      if (!destination) throw new Error("The authorization service did not provide a return address.");
      window.location.assign(destination);
    } catch {
      setError(approve ? "Approval failed. Please try again." : "Cancellation failed. Please try again.");
      setBusy(false);
    }
  }

  return (
    <main className="surface-pattern flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Connect {clientName} to Zakat Pro</CardTitle>
          <CardDescription>This lets {clientName} use this app’s enabled tools while you are signed in.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <section className="space-y-1 text-sm">
            <h2 className="font-medium">Signed in as</h2>
            <p className="break-all text-muted-foreground">{email}</p>
          </section>
          <section className="space-y-1 text-sm">
            <h2 className="font-medium">Assistant destination</h2>
            <p className="break-all text-muted-foreground">{redirectUri}</p>
          </section>
          <section className="space-y-2 text-sm">
            <h2 className="font-medium">Requested account details</h2>
            <ul className="list-inside list-disc text-muted-foreground">
              {scopes.map((scope) => (
                <li key={scope}>{scope === "email" ? "Share your email address" : scope === "profile" ? "Share your basic profile" : scope === "openid" ? "Confirm your account identity" : `Additional permission requested: ${scope}`}</li>
              ))}
            </ul>
          </section>
          <p className="text-sm text-muted-foreground">
            Available tools provide Zakat calculations, metal prices, Nisab values, and published guidance. This does not bypass app permissions or database policies.
          </p>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" disabled={busy} onClick={() => void decide(false)}>Cancel connection</Button>
            <Button disabled={busy} onClick={() => void decide(true)}>{busy ? "Please wait…" : "Approve"}</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

function ConsentError() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Authorization unavailable</CardTitle>
          <CardDescription>This request is invalid, expired, or could not be loaded. Return to the assistant and try connecting again.</CardDescription>
        </CardHeader>
      </Card>
    </main>
  );
}