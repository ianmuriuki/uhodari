import { useParams } from 'react-router-dom';
import { useStory } from '../hooks/useStories';
import { AudioPlayer } from '../components/Stories/AudioPlayer';
import { TranscriptViewer } from '../components/Stories/TranscriptViewer';
import { ProofBadge } from '../components/Blockchain/ProofBadge';
import { VerifyButton } from '../components/Blockchain/VerifyButton';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';
import { FaCalendar, FaMapMarker, FaLanguage, FaTag } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

export const StoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: story, isLoading } = useStory(parseInt(id!));

  if (isLoading) return <LoadingSpinner />;
  if (!story) return <div>Story not found</div>;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="card p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl md:text-4xl font-bold">{story.title}</h1>
              {story.blockchain_tx_hash && (
                <ProofBadge verified={true} txHash={story.blockchain_tx_hash} />
              )}
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <FaLanguage />
                <span>{story.language}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarker />
                <span>{story.region}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaTag />
                <span>{story.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendar />
                <span>{formatDistanceToNow(new Date(story.created_at), { addSuffix: true })}</span>
              </div>
            </div>
            
            <p className="text-gray-700 leading-relaxed">{story.description}</p>
          </div>

          {/* Audio/Video Player */}
          {story.media_url && (
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Listen to the Story</h2>
              <AudioPlayer src={story.media_url} duration={story.duration} />
            </div>
          )}

          {/* Summary */}
          {story.summary && (
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Summary</h2>
              <p className="text-gray-700 leading-relaxed">{story.summary}</p>
            </div>
          )}

          {/* Transcript */}
          {story.transcript && (
            <TranscriptViewer transcript={story.transcript} />
          )}

          {/* Blockchain Verification */}
          {!story.blockchain_tx_hash && (
            <div className="card p-6 text-center">
              <h2 className="text-xl font-bold mb-4">Verify on Blockchain</h2>
              <p className="text-gray-600 mb-4">
                Get this story verified on the Base blockchain for permanent proof of authenticity
              </p>
              <VerifyButton storyId={story.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};