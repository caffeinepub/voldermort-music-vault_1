import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import BackToTop from "./components/BackToTop";
import Navigation from "./components/Navigation";
import AdminPage from "./pages/AdminPage";
import ArtistPage from "./pages/ArtistPage";
import CategoryPage from "./pages/CategoryPage";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";

export type Route =
  | { page: "home" }
  | { page: "category"; name: string }
  | { page: "artist"; name: string }
  | { page: "search"; query: string }
  | { page: "admin" };

function parseHash(hash: string): Route {
  const raw = hash.replace(/^#/, "");
  const path = raw.startsWith("/") ? raw : `/${raw}`;

  if (!path || path === "/") return { page: "home" };

  if (path.startsWith("/category/")) {
    const name = decodeURIComponent(path.replace("/category/", ""));
    return { page: "category", name };
  }

  if (path.startsWith("/artist/")) {
    const name = decodeURIComponent(path.replace("/artist/", ""));
    return { page: "artist", name };
  }

  if (path.startsWith("/search")) {
    const qIndex = path.indexOf("?q=");
    const query = qIndex >= 0 ? decodeURIComponent(path.slice(qIndex + 3)) : "";
    return { page: "search", query };
  }

  if (path === "/admin") return { page: "admin" };

  return { page: "home" };
}

export function navigate(path: string) {
  window.location.hash = path;
}

export default function App() {
  const [route, setRoute] = useState<Route>(() =>
    parseHash(window.location.hash),
  );

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const renderPage = () => {
    switch (route.page) {
      case "home":
        return <HomePage />;
      case "category":
        return <CategoryPage name={route.name} />;
      case "artist":
        return <ArtistPage name={route.name} />;
      case "search":
        return <SearchPage query={route.query} />;
      case "admin":
        return <AdminPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation currentPage={route.page} />
      <main className="flex-1">{renderPage()}</main>
      <footer className="border-t border-border/50 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>
            © {new Date().getFullYear()}. Built with{" "}
            <span className="text-accent">♥</span> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-accent transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
      <BackToTop />
      <Toaster />
    </div>
  );
}
