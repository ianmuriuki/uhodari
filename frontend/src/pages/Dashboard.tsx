import { useAuth } from '../hooks/useAuth';
import { useUserStories } from '../hooks/useStories';
import { StoryCard } from '../components/Stories/StoryCard';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';
import { Link } from 'react-router-dom';
import { FaUpload, FaShieldAlt, FaMicrophone } from 'react-icons/fa';

export const Dashboard = () => {
  const { user } = useAuth();
  const { data: stories, isLoading } = useUserStories();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.full_name}!</h1>
          <p className="opacity-90">
            You've preserved {stories?.length || 0} stories for future generations
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 text-center">
            <FaMicrophone className="text-3xl text-primary-600 mx-auto mb-3" />
            <div className="text-2xl font-bold">{stories?.length || 0}</div>
            <div className="text-gray-600">Stories Shared</div>
          </div>
          <div className="card p-6 text-center">
            <FaShieldAlt className="text-3xl text-primary-600 mx-auto mb-3" />
            <div className="text-2xl font-bold">
              {stories?.filter(s => s.blockchain_tx_hash).length || 0}
            </div>
            <div className="text-gray-600">Verified on Blockchain</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-primary-600">
              {stories?.reduce((sum, s) => sum + (s.view_count || 0), 0) || 0}
            </div>
            <div className="text-gray-600">Total Views</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Stories</h2>
          <Link to="/upload" className="btn-primary flex items-center gap-2">
            <FaUpload />
            Share New Story
          </Link>
        </div>

        {/* Stories Grid */}
        {stories && stories.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story: any) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">You haven't shared any stories yet</p>
            <Link to="/upload" className="btn-primary">
              Share Your First Story
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};