import { Outlet, Link, useLocation } from "react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";

export function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Stories", href: "/stories" },
    { name: "Upload", href: "/upload" },
    { name: "Chat", href: "/chat" },
    { name: "About", href: "/about" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90"
        style={{ borderBottom: "1px solid #E0DDD6" }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{ backgroundColor: "#2D5016" }}
              >
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <div>
                <h1 className="text-lg font-bold leading-none text-foreground">Uhodari</h1>
                <p className="text-xs text-muted-foreground">Cultural Preservation</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link key={item.name} to={item.href}>
                    <span
                      className="relative px-4 py-2 text-sm font-medium transition-colors cursor-pointer block"
                      style={{ color: active ? "#2D5016" : "#4A4A4A" }}
                    >
                      {item.name}
                      {active && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                          style={{ backgroundColor: "#2D5016" }}
                        />
                      )}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ borderTop: "1px solid #E0DDD6" }}
            className="md:hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors"
                    style={{
                      color: active ? "#2D5016" : "#4A4A4A",
                      backgroundColor: active ? "#E8E5DF" : "transparent",
                    }}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </motion.header>

      {/* Main Content — no horizontal padding on home so hero bleeds full width */}
      <main className={isHome ? "" : "container mx-auto px-4 lg:px-8 py-8"}>
        <Outlet />
      </main>

      <footer className="mt-20" style={{ borderTop: "1px solid #E0DDD6", backgroundColor: "#EFEFEA" }}>
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold mb-4 text-foreground">About Uhodari</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Preserving cultural heritage through AI and blockchain technology.
                Protecting stories, languages, and traditions for future generations.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4 text-foreground">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/stories" className="text-muted-foreground hover:text-primary transition-colors">Browse Stories</Link></li>
                <li><Link to="/upload" className="text-muted-foreground hover:text-primary transition-colors">Share Your Story</Link></li>
                <li><Link to="/chat" className="text-muted-foreground hover:text-primary transition-colors">AI Historian</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4 text-foreground">Regions</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Serving Kenya, East Africa, and communities worldwide in preserving their cultural narratives.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 text-center text-xs text-muted-foreground" style={{ borderTop: "1px solid #E0DDD6" }}>
            © {new Date().getFullYear()} Uhodari Cultural Preservation. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
