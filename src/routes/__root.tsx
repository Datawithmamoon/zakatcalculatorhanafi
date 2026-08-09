import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#0f5132" },
      { name: "author", content: "Hanafi Zakat Calculator" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { name: "google-site-verification", content: "uQNYxnpnkIgOO8jIgO5UY6v61PmsD4RD29NLFjLkN5g" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Hanafi Zakat Calculator" },
      { property: "og:locale", content: "en" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "apple-mobile-web-app-title", content: "Zakat" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { title: "Hanafi Zakat Calculator" },
      { property: "og:title", content: "Hanafi Zakat Calculator" },
      { name: "twitter:title", content: "Hanafi Zakat Calculator" },
      { name: "description", content: "An Islamic Zakat calculator for Muslims to accurately determine Zakat obligations based on Hanafi Fiqh." },
      { property: "og:description", content: "An Islamic Zakat calculator for Muslims to accurately determine Zakat obligations based on Hanafi Fiqh." },
      { name: "twitter:description", content: "An Islamic Zakat calculator for Muslims to accurately determine Zakat obligations based on Hanafi Fiqh." },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/icon-192.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Noto+Nastaliq+Urdu:wght@400;600;700&display=swap",
      },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://zakatcalculatorhanafi.lovable.app/#organization",
              name: "Hanafi Zakat Calculator",
              url: "https://zakatcalculatorhanafi.lovable.app/",
              logo: "https://zakatcalculatorhanafi.lovable.app/icon-512.png",
            },
            {
              "@type": "WebSite",
              "@id": "https://zakatcalculatorhanafi.lovable.app/#website",
              name: "Hanafi Zakat Calculator",
              url: "https://zakatcalculatorhanafi.lovable.app/",
              inLanguage: ["en", "ur"],
              publisher: { "@id": "https://zakatcalculatorhanafi.lovable.app/#organization" },
            },
          ],
        }),
      },
    ],
  }),


  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

// Applies saved language/direction/theme before first paint to avoid an LTR
// flash for Urdu readers (and a light flash in dark mode).
const PREFS_BOOTSTRAP = `(function(){try{var s=localStorage.getItem("hanafi-zakat-state-v1");if(!s)return;var p=(JSON.parse(s)||{}).prefs||{};var e=document.documentElement;if(p.lang){e.lang=p.lang;e.dir=p.lang==="ur"?"rtl":"ltr";}if(p.dark)e.classList.add("dark");if(p.highContrast)e.classList.add("hc");}catch(_){}})();`;

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: PREFS_BOOTSTRAP }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
