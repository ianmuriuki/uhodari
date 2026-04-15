import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMicrophone, FaRobot, FaShieldAlt, FaArrowRight } from 'react-icons/fa';
import { StoryGrid } from '../components/Stories/StoryGrid';
import { useStories } from '../hooks/useStories';

export const Home = () => {
  const { data: featuredStories, isLoading } = useStories({ limit: 6 });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="/kenyan-pattern.png" 
            alt="Kenyan pattern" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-display">
              Preserving Kenya's
              <span className="text-yellow-300"> Cultural Heritage</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Uhodari uses AI to record, preserve, and share Kenyan oral traditions,
              stories, and wisdom for future generations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/upload" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3">
                Share a Story
                <FaMicrophone className="inline ml-2" />
              </Link>
              <Link to="/explore" className="btn-secondary bg-transparent border-2 border-white hover:bg-white/10 text-lg px-8 py-3">
                Explore Stories
                <FaArrowRight className="inline ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">How Uhodari Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Combining cutting-edge AI with blockchain technology to protect cultural heritage
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card p-8 text-center"
            >
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaMicrophone className="text-3xl text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">1. Record Stories</h3>
              <p className="text-gray-600">
                Upload audio or video recordings of folktales, proverbs, and oral traditions in any Kenyan language
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card p-8 text-center"
            >
              <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaRobot className="text-3xl text-secondary-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">2. AI Processing</h3>
              <p className="text-gray-600">
                Automatic transcription, translation to English, and intelligent summarization
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="card p-8 text-center"
            >
              <div className="w-20 h-20 bg-earth-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShieldAlt className="text-3xl text-earth-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">3. Blockchain Proof</h3>
              <p className="text-gray-600">
                Immutable proof of ownership and preservation on the Base blockchain
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Stories</h2>
            <Link to="/explore" className="text-primary-600 hover:text-primary-700 font-semibold">
              View All →
            </Link>
          </div>
          <StoryGrid stories={featuredStories?.data || []} isLoading={isLoading} />
        </div>
      </section>

      {/* Chatbot CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold mb-4">Chat with Our Digital Historian</h2>
            <p className="text-xl mb-8 opacity-90">
              Ask questions about Kenyan culture, folklore, and traditions
            </p>
            <Link to="/chatbot" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3">
              Start Chatting
              <FaRobot className="inline ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};