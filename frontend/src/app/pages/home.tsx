import { motion } from "motion/react";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import {
  Upload,
  MessageCircle,
  Globe,
  Shield,
  Sparkles,
  BookOpen,
  Languages,
  Users,
  TrendingUp,
} from "lucide-react";
import { getStats, Stats } from "../lib/api";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function Home() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(console.error);
  }, []);

  const features = [
    {
      icon: Upload,
      title: "Record & Upload",
      description: "Share audio, video, or written stories from your community",
      color: "text-primary",
    },
    {
      icon: Sparkles,
      title: "AI Processing",
      description: "Automatic transcription, translation, and summarization",
      color: "text-secondary",
    },
    {
      icon: Shield,
      title: "Blockchain Protection",
      description: "Secure proof of origin and creator ownership rights",
      color: "text-chart-3",
    },
    {
      icon: MessageCircle,
      title: "AI Historian",
      description: "Interactive chatbot preserving and sharing cultural knowledge",
      color: "text-chart-4",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-12"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 text-accent-foreground mb-6">
            <Globe className="h-4 w-4" />
            <span className="text-sm font-medium">Preserving Culture, Empowering Communities</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
        >
          Your Stories,
          <br />
          <span className="text-primary">Forever Preserved</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
        >
          Uhodari uses AI and blockchain to preserve languages, stories, and traditions
          from Kenya, Africa, and the world. Record your heritage, protect your rights.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/upload">
            <Button size="lg" className="gap-2">
              <Upload className="h-5 w-5" />
              Share Your Story
            </Button>
          </Link>
          <Link to="/chat">
            <Button size="lg" variant="outline" className="gap-2">
              <MessageCircle className="h-5 w-5" />
              Talk to AI Historian
            </Button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      {stats && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
        >
          {[
            { label: "Stories Preserved", value: stats.total_stories, icon: BookOpen },
            { label: "Languages", value: stats.total_languages, icon: Languages },
            { label: "Regions", value: stats.total_regions, icon: Globe },
            { label: "Active Contributors", value: stats.recent_uploads, icon: Users },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center">
                <CardContent className="pt-6">
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.section>
      )}

      {/* Features Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How Uhodari Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A complete platform for cultural preservation combining modern technology
            with respect for tradition
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <motion.div whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="h-full border-2 hover:border-primary/50 transition-all">
                  <CardHeader>
                    <div className={`mb-4 ${feature.color}`}>
                      <feature.icon className="h-12 w-12" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Impact Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-8 md:p-12"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Protecting What Matters Most
            </h2>
            <p className="text-muted-foreground mb-6">
              Languages and traditions are disappearing at an alarming rate. Uhodari
              provides a secure, permanent home for cultural knowledge, ensuring that
              future generations can access and learn from these invaluable stories.
            </p>
            <ul className="space-y-3">
              {[
                "Secure blockchain-based ownership verification",
                "AI-powered transcription in multiple languages",
                "Creator royalty splits tracked on-chain",
                "Community-driven cultural preservation",
              ].map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
            <Link to="/about" className="inline-block mt-6">
              <Button variant="outline" className="gap-2">
                Learn More
                <TrendingUp className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl overflow-hidden shadow-2xl"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80"
                alt="Cultural preservation and community storytelling"
                className="w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center bg-primary text-primary-foreground rounded-3xl p-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Start Preserving Your Heritage Today
        </h2>
        <p className="text-primary-foreground/90 max-w-2xl mx-auto mb-8">
          Join our community of storytellers and cultural guardians. Your voice matters,
          your stories matter.
        </p>
        <Link to="/upload">
          <Button size="lg" variant="secondary" className="gap-2">
            <Upload className="h-5 w-5" />
            Upload Your First Story
          </Button>
        </Link>
      </motion.section>
    </div>
  );
}
