import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import {
  Shield,
  Sparkles,
  Globe,
  Users,
  BookOpen,
  TrendingUp,
  Heart,
  Coins,
  Lock,
  Languages,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function About() {
  const features = [
    {
      icon: BookOpen,
      title: "Cultural Preservation",
      description:
        "Record, transcribe, and preserve stories, languages, and traditions before they disappear. Our archive serves as a permanent cultural memory.",
    },
    {
      icon: Sparkles,
      title: "AI Processing",
      description:
        "Advanced AI automatically transcribes audio/video, translates between languages, and creates searchable summaries of cultural content.",
    },
    {
      icon: Shield,
      title: "Blockchain Protection",
      description:
        "Every story is recorded on the blockchain with proof of origin, ensuring creators maintain ownership rights and proper attribution.",
    },
    {
      icon: Coins,
      title: "Creator Royalties",
      description:
        "Smart contracts manage royalty splits on-chain, ensuring fair compensation when cultural content is used or shared.",
    },
    {
      icon: Languages,
      title: "AI Historian Chatbot",
      description:
        "An intelligent chatbot that can answer questions, share stories, and explain traditions using preserved cultural data.",
    },
    {
      icon: Users,
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
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
          <Heart className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">About Uhodari</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Uhodari (Swahili for "excellence") is a platform dedicated to preserving cultural
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
          <div className="order-2 md:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80"
                alt="Cultural storytelling and heritage"
                className="w-full h-auto"
              />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">The Problem</h2>
            <div className="space-y-4 text-lg text-muted-foreground">
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
        className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-8 md:p-12"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Solution</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A comprehensive platform that combines modern technology with respect for tradition
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="h-full hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
                <CardHeader>
                  <div className="mb-4 text-primary">
                    <feature.icon className="h-10 w-10" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg">Simple steps to preserve your heritage</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              step: "01",
              title: "Record",
              description: "Upload audio, video, or written stories from your community",
              icon: BookOpen,
            },
            {
              step: "02",
              title: "AI Process",
              description: "Our AI transcribes, translates, and summarizes your content",
              icon: Sparkles,
            },
            {
              step: "03",
              title: "Blockchain",
              description: "Proof of origin and ownership rights recorded permanently",
              icon: Lock,
            },
            {
              step: "04",
              title: "Share",
              description: "Your story becomes part of our searchable cultural archive",
              icon: Globe,
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
              <div className="relative mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground">
                  <item.icon className="h-8 w-8" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-sm">
                  {item.step}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Card className="border-2">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Our Commitment */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Commitment</h2>
            <div className="space-y-4">
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
                  className="flex gap-4"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80"
                alt="Community and cultural connection"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Regional Focus */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center bg-muted/30 rounded-3xl p-12"
      >
        <Globe className="h-16 w-16 mx-auto mb-6 text-primary" />
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Kenya, Africa & The World
        </h2>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          While our roots are in Kenya, Uhodari serves cultural communities across Africa and
          around the world. Every culture, every language, every story deserves to be preserved
          with dignity and protected for future generations. From Nairobi to the diaspora, we're
          building a global archive of human cultural heritage.
        </p>
      </motion.section>
    </div>
  );
}
