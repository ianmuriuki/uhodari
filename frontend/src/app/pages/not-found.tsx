import { motion } from "motion/react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Home, Search } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-9xl font-bold text-primary/20"
        >
          404
        </motion.div>
        <h1 className="text-3xl font-bold">Page Not Found</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          The story you're looking for doesn't exist in our archive. Perhaps it's waiting to be
          written?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link to="/">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Link to="/stories">
            <Button variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              Browse Stories
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
