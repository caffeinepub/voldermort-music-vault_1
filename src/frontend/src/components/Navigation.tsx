import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, Menu, Music2, Search, Shield, X } from "lucide-react";
import { useState } from "react";
import { navigate } from "../App";

interface NavigationProps {
  currentPage: string;
}

export default function Navigation({ currentPage }: NavigationProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <button
            type="button"
            data-ocid="nav.home_link"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 flex-shrink-0 group"
          >
            <Music2 className="w-6 h-6 text-primary neon-pulse-icon" />
            <span className="font-display font-bold text-lg text-gradient neon-pulse-text hidden sm:block">
              Voldermort Music Vault
            </span>
            <span className="font-display font-bold text-lg text-gradient neon-pulse-text sm:hidden">
              VMV
            </span>
          </button>

          {/* Search bar - desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                data-ocid="search.input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search songs, artists, genres..."
                className="pl-9 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
              />
            </div>
            <Button
              data-ocid="search.submit_button"
              type="submit"
              size="sm"
              className="bg-primary hover:bg-primary/80"
            >
              Search
            </Button>
          </form>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-2">
            <Button
              data-ocid="nav.home_link"
              variant={currentPage === "home" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
            <Button
              data-ocid="nav.admin_link"
              variant={currentPage === "admin" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => navigate("/admin")}
              className="gap-2"
            >
              <Shield className="w-4 h-4" />
              Admin
            </Button>
          </nav>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 space-y-3">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  data-ocid="search.input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="pl-9 bg-secondary/50"
                />
              </div>
              <Button
                data-ocid="search.submit_button"
                type="submit"
                size="sm"
                className="bg-primary"
              >
                Go
              </Button>
            </form>
            <div className="flex gap-2">
              <Button
                data-ocid="nav.home_link"
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => {
                  navigate("/");
                  setMenuOpen(false);
                }}
              >
                <Home className="w-4 h-4" /> Home
              </Button>
              <Button
                data-ocid="nav.admin_link"
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => {
                  navigate("/admin");
                  setMenuOpen(false);
                }}
              >
                <Shield className="w-4 h-4" /> Admin
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
