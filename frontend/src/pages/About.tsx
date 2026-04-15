import { motion } from 'framer-motion';
import { FaMicrophone, FaRobot, FaShieldAlt, FaUsers } from 'react-icons/fa';

export const About = () => {
  const stats = [
    { icon: FaMicrophone, value: '100+', label: 'Stories Preserved' },
    { icon: FaUsers, value: '15+', label: 'Languages' },
    { icon: FaRobot, value: '24/7', label: 'AI Assistant' },
    { icon: FaShieldAlt, value: '100%', label: 'Blockchain Verified' },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">About Uhodari</h1>
          <p className="text-xl text-gray-600">
            Preserving Kenya's rich oral heritage for future generations
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="card p-6 text-center"
              >
                <Icon className="text-3xl text-primary-600 mx-auto mb-3" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        <div className="space-y-8">
          <section className="card p-8">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              Uhodari (meaning "unity" in Swahili) is dedicated to preserving Kenya's
              diverse cultural heritage through modern technology. We believe that every
              story, proverb, and tradition holds value and deserves to be protected for
              future generations.
            </p>
          </section>

          <section className="card p-8">
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">1. Record & Share</h3>
                <p className="text-gray-600">
                  Community members record and upload oral stories, folktales, and traditions
                  in their native languages.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">2. AI Processing</h3>
                <p className="text-gray-600">
                  Our AI transcribes, translates, and summarizes each story, making it
                  accessible to a global audience while preserving the original.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">3. Blockchain Protection</h3>
                <p className="text-gray-600">
                  Each story receives an immutable proof of authenticity and ownership
                  on the Base blockchain.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">4. Interactive Learning</h3>
                <p className="text-gray-600">
                  Anyone can explore the collection or chat with our AI historian to learn
                  about Kenyan culture.
                </p>
              </div>
            </div>
          </section>

          <section className="card p-8">
            <h2 className="text-2xl font-bold mb-4">Join the Movement</h2>
            <p className="text-gray-700 mb-6">
              Whether you're a storyteller, cultural practitioner, or heritage enthusiast,
              your contribution matters. Together, we can ensure Kenya's rich oral traditions
              live on forever.
            </p>
            <div className="flex gap-4 justify-center">
              <a href="/upload" className="btn-primary">
                Share a Story
              </a>
              <a href="/explore" className="btn-secondary">
                Explore Stories
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};