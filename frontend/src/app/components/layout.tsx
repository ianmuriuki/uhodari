import { Outlet, Link, useLocation } from "react-router";
import { motion } from "motion/react";
import { Book, Upload, MessageCircle, Info, BookOpen, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

export function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/", icon: BookOpen },
    { name: "Stories", href: "/stories", icon: Book },
    { name: "Upload", href: "/upload", icon: Upload },
    { name: "Chat", href: "/chat", icon: MessageCircle },
    { name: "About", href: "/about", icon: Info },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary"
              >
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold leading-none text-foreground">Uhodari</h1>
                <p className="text-xs text-muted-foreground">Cultural Preservation</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link key={item.name} to={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant={active ? "default" : "ghost"}
                        className="gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        {item.name}
                      </Button>
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border md:hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={active ? "default" : "ghost"}
                      className="w-full justify-start gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 mt-20">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4">About Uhodari</h3>
              <p className="text-sm text-muted-foreground">
                Preserving cultural heritage through AI and blockchain technology.
                Protecting stories, languages, and traditions for future generations.
              </p>
            </div>
            <div>
              <h3 className="mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/stories" className="text-muted-foreground hover:text-primary transition-colors">
                    Browse Stories
                  </Link>
                </li>
                <li>
                  <Link to="/upload" className="text-muted-foreground hover:text-primary transition-colors">
                    Share Your Story
                  </Link>
                </li>
                <li>
                  <Link to="/chat" className="text-muted-foreground hover:text-primary transition-colors">
                    AI Historian
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4">Regions</h3>
              <p className="text-sm text-muted-foreground">
                Serving Kenya, East Africa, and communities worldwide in preserving
                their cultural narratives.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Uhodari Cultural Preservation. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
