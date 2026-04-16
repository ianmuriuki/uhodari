import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function About() {
  const features = [
    {
      title: "Cultural Preservation",
      description:
        "Record, transcribe, and preserve stories, languages, and traditions before they disappear. Our archive serves as a permanent cultural memory.",
    },
    {
      title: "AI Processing",
      description:
        "Advanced AI automatically transcribes audio and video, translates between languages, and creates searchable summaries of cultural content.",
    },
    {
      title: "Blockchain Protection",
      description:
        "Every story is recorded on the blockchain with proof of origin, ensuring creators maintain ownership rights and proper attribution.",
    },
    {
      title: "Creator Royalties",
      description:
        "Smart contracts manage royalty splits on-chain, ensuring fair compensation when cultural content is used or shared.",
    },
    {
      title: "AI Historian Chatbot",
      description:
        "An intelligent chatbot that can answer questions, share stories, and explain traditions using preserved cultural data.",
    },
    {
      title: "Community-Driven",
      description:
        "Built for and by communities in Kenya, Africa, and worldwide. Everyone can contribute to preserving their cultural heritage.",
    },
  ];

  const stats = [
    { value: "100+", label: "Languages Supported" },
    { value: "24/7", label: "AI Processing" },
    { value: "∞", label: "Storage Capacity" },
    { value: "100%", label: "Ownership Rights" },
  ];

  return (
    <div className="space-y-24">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-4 max-w-3xl mx-auto"
      >
        <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: "#2D5016" }}>
          Our Mission
        </p>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">About Uhodari</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Uhodari — Swahili for "excellence" — is a platform dedicated to preserving cultural
          heritage through the power of AI and blockchain technology. We protect what matters most:
          your stories, your languages, your traditions.
        </p>
      </motion.section>

      {/* The Problem */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 rounded-2xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80"
              alt="Cultural storytelling and heritage"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">The Problem</h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                Every two weeks, a language dies. With it, centuries of stories, knowledge, and
                cultural wisdom disappear forever.
              </p>
              <p>
                Indigenous communities, especially in Kenya and across Africa, face the loss of
                oral traditions as elders pass away and younger generations move to urban centers.
              </p>
              <p>
                Traditional cultural knowledge is not protected, not documented, and often exploited
                without proper attribution or compensation to its creators.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* The Solution */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Solution</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A comprehensive platform combining modern technology with respect for tradition
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-xl p-6"
              style={{ backgroundColor: "#EFEFEA" }}
            >
              <h3 className="font-semibold text-base mb-3 text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground">Simple steps to preserve your heritage</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              step: "01",
              title: "Record",
              description: "Upload audio, video, or written stories from your community",
            },
            {
              step: "02",
              title: "AI Process",
              description: "Our AI transcribes, translates, and summarizes your content",
            },
            {
              step: "03",
              title: "Blockchain",
              description: "Proof of origin and ownership rights recorded permanently",
            },
            {
              step: "04",
              title: "Share",
              description: "Your story becomes part of our searchable cultural archive",
            },
          ].map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <p
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "#2D5016" }}
              >
                {item.step}
              </p>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl p-8"
        style={{ backgroundColor: "#EFEFEA" }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: "#2D5016" }}>
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Our Commitment */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Commitment</h2>
            <div className="space-y-6">
              {[
                {
                  title: "Respect & Authenticity",
                  description:
                    "We treat all cultural content with the utmost respect and ensure authentic representation.",
                },
                {
                  title: "Community Ownership",
                  description:
                    "Communities and creators maintain full ownership and control over their cultural content.",
                },
                {
                  title: "Accessibility",
                  description:
                    "Cultural knowledge should be accessible to all, especially to the communities it comes from.",
                },
                {
                  title: "Future Generations",
                  description:
                    "We're building a permanent archive that will serve humanity for centuries to come.",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="pl-4"
                  style={{ borderLeft: "2px solid #2D5016" }}
                >
                  <h3 className="font-semibold mb-1 text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80"
              alt="Community and cultural connection"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </motion.section>

      {/* Regional Focus */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center rounded-2xl p-12"
        style={{ backgroundColor: "#2D5016" }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Kenya, Africa & The World
        </h2>
        <p className="text-white/80 text-lg max-w-3xl mx-auto leading-relaxed">
          While our roots are in Kenya, Uhodari serves cultural communities across Africa and
          around the world. Every culture, every language, every story deserves to be preserved
          with dignity and protected for future generations.
        </p>
      </motion.section>
    </div>
  );
}
