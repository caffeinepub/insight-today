import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Menu, Search, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ArticleCategory } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { CATEGORY_LABELS } from "./CategoryBadge";

const NAV_ITEMS: { label: string; category?: ArticleCategory; href: string }[] =
  [
    { label: "Home", href: "/" },
    {
      label: "World",
      href: "/category/worldNews",
      category: ArticleCategory.worldNews,
    },
    {
      label: "Technology",
      href: "/category/technology",
      category: ArticleCategory.technology,
    },
    {
      label: "Finance",
      href: "/category/finance",
      category: ArticleCategory.finance,
    },
    {
      label: "Lifestyle",
      href: "/category/lifestyle",
      category: ArticleCategory.lifestyle,
    },
  ];

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { login, clear, loginStatus, identity } = useInternetIdentity();

  const isLoggedIn = loginStatus === "success" && !!identity;
  const { actor } = useActor();

  // Auto-register as user on login
  useEffect(() => {
    if (isLoggedIn && actor) {
      actor.registerUser().catch(() => {});
    }
  }, [isLoggedIn, actor]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/search", search: { q: searchQuery.trim() } });
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Main header bar */}
      <div className="bg-navy">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <Link to="/" className="flex-shrink-0" data-ocid="header.link">
              <div className="leading-none">
                <div className="font-display font-bold text-white text-xl tracking-widest uppercase">
                  Insight
                </div>
                <div className="font-display font-bold text-primary text-xl tracking-widest uppercase -mt-1">
                  Today
                </div>
              </div>
            </Link>

            {/* Desktop utilities */}
            <div className="hidden md:flex items-center gap-2">
              {searchOpen ? (
                <form
                  onSubmit={handleSearch}
                  className="flex items-center gap-2"
                >
                  <Input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles..."
                    className="w-56 bg-white/10 border-white/20 text-white placeholder:text-white/50 h-8 text-sm"
                    data-ocid="header.search_input"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    variant="ghost"
                    className="text-white hover:text-white hover:bg-white/20 h-8 w-8 p-0"
                  >
                    <Search size={16} />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-white hover:text-white hover:bg-white/20 h-8 w-8 p-0"
                    onClick={() => setSearchOpen(false)}
                  >
                    <X size={16} />
                  </Button>
                </form>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-white hover:bg-white/20 h-8 w-8 p-0"
                  onClick={() => setSearchOpen(true)}
                  data-ocid="header.search_input"
                >
                  <Search size={18} />
                </Button>
              )}

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-white hover:text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <Bell size={18} />
              </Button>

              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <Link to="/admin" data-ocid="header.link">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-white hover:bg-white/20 h-8 w-8 p-0"
                    >
                      <User size={18} />
                    </Button>
                  </Link>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 bg-transparent text-xs font-bold uppercase tracking-wider"
                    onClick={() => clear()}
                    data-ocid="header.secondary_button"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold uppercase tracking-wider"
                  onClick={() => login()}
                  data-ocid="header.primary_button"
                >
                  Sign In
                </Button>
              )}

              <Button
                type="button"
                size="sm"
                className="bg-white text-navy hover:bg-white/90 text-xs font-bold uppercase tracking-wider"
                data-ocid="header.subscribe_button"
              >
                Subscribe
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-ocid="header.toggle"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Category nav */}
      <nav
        className="bg-navy/95 border-t border-white/10"
        data-ocid="nav.panel"
      >
        <div className="container mx-auto px-4">
          <div className="hidden md:flex items-center gap-0 overflow-x-auto">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap border-b-2 border-transparent [&.active]:border-primary [&.active]:text-white"
                data-ocid="nav.link"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/admin"
              className="ml-auto px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white/80 transition-colors"
              data-ocid="nav.link"
            >
              Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden bg-navy border-t border-white/10"
          data-ocid="nav.panel"
        >
          <div className="container mx-auto px-4 py-2">
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2 mb-3"
            >
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 h-8 text-sm"
                data-ocid="header.search_input"
              />
              <Button
                type="submit"
                size="sm"
                className="bg-primary text-primary-foreground h-8 px-3"
              >
                <Search size={14} />
              </Button>
            </form>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="block px-2 py-2 text-sm font-semibold text-white/80 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
                data-ocid="nav.link"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex gap-2">
              {isLoggedIn ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="border-white/30 text-white bg-transparent text-xs"
                  onClick={() => clear()}
                  data-ocid="header.secondary_button"
                >
                  Sign Out
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  className="bg-primary text-primary-foreground text-xs"
                  onClick={() => login()}
                  data-ocid="header.primary_button"
                >
                  Sign In
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                className="bg-white text-navy text-xs font-bold"
                data-ocid="header.subscribe_button"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export { CATEGORY_LABELS };
