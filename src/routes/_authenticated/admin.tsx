import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, LogOut, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { claimFirstAdmin } from "@/lib/admin.functions";
import { PricesTab } from "@/components/admin/PricesTab";
import { CurrenciesTab } from "@/components/admin/CurrenciesTab";
import { FaqTab } from "@/components/admin/FaqTab";
import { ContentTab } from "@/components/admin/ContentTab";
import { MembersTab } from "@/components/admin/MembersTab";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const title = "Admin Panel — Hanafi Zakat Calculator";
const description =
  "Manage gold and silver prices, currency exchange rates, Nisab thresholds, FAQs and educational content for the Hanafi Zakat Calculator.";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { user, isAdmin, loading, refetchRoles } = useAuth();
  const claim = useServerFn(claimFirstAdmin);
  const navigate = useNavigate();
  const [claiming, setClaiming] = useState(false);
  const [setupToken, setSetupToken] = useState("");

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const claimAdmin = async () => {
    setClaiming(true);
    try {
      const res = await claim({ data: { token: setupToken } });
      if (res.granted) {
        toast.success("You are now the administrator");
        await refetchRoles();
      } else if (res.reason === "admin_exists") {
        toast.error("An administrator already exists. Ask them for access.");
      } else {
        toast.error("Invalid setup token.");
      }
    } catch {
      toast.error("Could not claim admin access");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="surface-pattern min-h-screen bg-background">
      <header className="gradient-emerald text-primary-foreground">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <h1 className="text-base font-semibold">Admin panel</h1>
            <p className="text-xs opacity-85">{user?.email}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" asChild>
              <Link to="/">
                <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden /> Calculator
              </Link>
            </Button>
            <Button size="sm" variant="secondary" onClick={signOut}>
              <LogOut className="size-4" aria-hidden /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {loading ? (
          <p className="text-sm text-muted-foreground">Checking access…</p>
        ) : !isAdmin ? (
          <div className="space-y-4 rounded-2xl border bg-card p-6 text-center shadow-soft">
            <ShieldCheck className="mx-auto size-8 text-primary" aria-hidden />
            <h2 className="text-lg font-semibold">Administrator access required</h2>
            <p className="text-sm text-muted-foreground">
              Your account does not have the admin role yet. If this installation has no
              administrator, enter the one-time setup token (stored as the
              <code className="mx-1 rounded bg-muted px-1">ADMIN_SETUP_TOKEN</code> secret in your
              backend settings) to claim it.
            </p>
            <div className="mx-auto max-w-sm space-y-2 text-start">
              <Label htmlFor="setup-token">Setup token</Label>
              <Input
                id="setup-token"
                type="password"
                autoComplete="off"
                value={setupToken}
                onChange={(e) => setSetupToken(e.target.value)}
                placeholder="Paste ADMIN_SETUP_TOKEN"
                className="min-h-11"
              />
            </div>
            <Button className="min-h-11" onClick={claimAdmin} disabled={claiming || !setupToken.trim()}>
              Claim admin access
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="prices" className="space-y-6">
            <TabsList className="flex-wrap">
              <TabsTrigger value="prices">Prices &amp; Nisab</TabsTrigger>
              <TabsTrigger value="currencies">Currencies</TabsTrigger>
              <TabsTrigger value="faqs">FAQs</TabsTrigger>
              <TabsTrigger value="content">Education</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
            </TabsList>
            <TabsContent value="prices">
              <PricesTab />
            </TabsContent>
            <TabsContent value="currencies">
              <CurrenciesTab />
            </TabsContent>
            <TabsContent value="faqs">
              <FaqTab />
            </TabsContent>
            <TabsContent value="content">
              <ContentTab />
            </TabsContent>
            <TabsContent value="members">
              <MembersTab />
            </TabsContent>
          </Tabs>
        )}
      </main>
      <Toaster />
    </div>
  );
}
