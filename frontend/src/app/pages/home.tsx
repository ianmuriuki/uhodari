import { motion } from "motion/react";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Upload, MessageCircle } from "lucide-react";
import { getStats, Stats } from "../lib/api";

export function Home() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    getStats().then(setStats).catch(console.error);
  }, []);

  const features = [
    {
      step: "01",
      title: "Record & Upload",
      description: "Share audio, video, or written stories from your community in any language.",
    },
    {
      step: "02",
      title: "AI Processing",
      description: "Automatic transcription, translation into English, and intelligent summarization.",
    },
    {
      step: "03",
      title: "Blockchain Protection",
      description: "Permanent proof of origin and creator ownership rights recorded on Base.",
    },
    {
      step: "04",
      title: "AI Historian",
      description: "Interactive chatbot preserving and sharing cultural knowledge from the archive.",
    },
  ];

  return (
    <div>
      {/* Hero — truly full width */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-full min-h-[92vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1920&q=85')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.48)" }} />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto py-24">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 uppercase tracking-[0.2em] text-xs font-medium mb-8"
          >
            Preserving Culture · Empowering Communities
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Your Stories,
            <br />
            <span style={{ color: "#a8d598" }}>Forever Preserved</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
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
              <Button
                size="lg"
                className="gap-2 text-white font-semibold px-8"
                style={{ backgroundColor: "#2D5016", border: "none" }}
              >
                <Upload className="h-5 w-5" />
                Share Your Story
              </Button>
            </Link>
            <Link to="/chat">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 bg-transparent text-white px-8"
                style={{ borderColor: "rgba(255,255,255,0.6)", color: "white" }}
              >
                <MessageCircle className="h-5 w-5" />
                Talk to AI Historian
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Rest of page — back inside container */}
      <div className="container mx-auto px-4 lg:px-8 space-y-24 py-20">

        {/* Stats */}
        {stats && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { label: "Stories Preserved", value: stats.total_stories },
              { label: "Languages", value: stats.total_languages },
              { label: "Regions", value: stats.total_regions ?? "—" },
              { label: "Active Contributors", value: stats.recent_uploads ?? "—" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-2xl p-8 text-center"
                style={{ backgroundColor: "#EFEFEA" }}
              >
                <div className="text-4xl font-bold mb-2 text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.section>
        )}

        {/* How It Works */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Uhodari Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A complete platform combining modern technology with respect for tradition
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl p-8"
                style={{ backgroundColor: "#EFEFEA" }}
              >
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#2D5016" }}>
                  {feature.step}
                </p>
                <h3 className="text-base font-semibold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Impact */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Protecting What Matters Most</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Languages and traditions are disappearing at an alarming rate. Uhodari
                provides a secure, permanent home for cultural knowledge, ensuring that
                future generations can access and learn from these invaluable stories.
              </p>
              <ul className="space-y-4">
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
                    className="pl-4 text-sm text-muted-foreground leading-relaxed"
                    style={{ borderLeft: "2px solid #2D5016" }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
              <Link to="/about" className="inline-block mt-8">
                <Button variant="outline">Learn More</Button>
              </Link>
            </div>
            <div
              className="rounded-2xl overflow-hidden"
              style={{ aspectRatio: "4/3" }}
            >
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80"
                alt="Cultural preservation"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl p-16 text-center text-white"
          style={{ backgroundColor: "#2D5016" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Preserving Your Heritage Today
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8 leading-relaxed">
            Join our community of storytellers and cultural guardians. Your voice matters,
            your stories matter.
          </p>
          <Link to="/upload">
            <Button
              size="lg"
              className="gap-2 font-semibold px-8"
              style={{ backgroundColor: "white", color: "#2D5016" }}
            >
              <Upload className="h-5 w-5" />
              Upload Your First Story
            </Button>
          </Link>
        </motion.section>

      </div>
    </div>
  );
}
