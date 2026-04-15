import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useParams, Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Languages,
  User,
  FileText,
  Globe,
  Sparkles,
  Loader2,
  Play,
  Pause,
} from "lucide-react";
import { getStory, Story } from "../lib/api";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function StoryDetail() {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [audioPlaying, setAudioPlaying] = useState(false);

  useEffect(() => {
    if (id) {
      loadStory(id);
    }
  }, [id]);

  const loadStory = async (storyId: string) => {
    setLoading(true);
    try {
      const data = await getStory(storyId);
      setStory(data);
    } catch (error) {
      console.error("Failed to load story:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Story not found</h2>
        <Link to="/stories">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Stories
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <Link to="/stories">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Stories
          </Button>
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{story.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(story.created_at)}</span>
          </div>
          {story.creator && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{story.creator}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        <Badge variant="default" className="gap-1">
          <Languages className="h-3 w-3" />
          {story.language}
        </Badge>
        <Badge variant="secondary" className="gap-1">
          <MapPin className="h-3 w-3" />
          {story.region}
        </Badge>
        {story.tags?.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </motion.div>

      {/* Hero Image */}
      {story.image_url && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl overflow-hidden shadow-xl"
        >
          <ImageWithFallback
            src={story.image_url}
            alt={story.title}
            className="w-full h-auto max-h-[500px] object-cover"
          />
        </motion.div>
      )}

      {/* Media Player */}
      {story.media_url && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              {story.media_type?.startsWith("audio/") && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Button
                      size="lg"
                      className="gap-2"
                      onClick={() => setAudioPlaying(!audioPlaying)}
                    >
                      {audioPlaying ? (
                        <>
                          <Pause className="h-5 w-5" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5" />
                          Play Audio
                        </>
                      )}
                    </Button>
                    <div className="flex-1 text-sm text-muted-foreground">
                      Original recording
                    </div>
                  </div>
                  <audio
                    controls
                    className="w-full"
                    onPlay={() => setAudioPlaying(true)}
                    onPause={() => setAudioPlaying(false)}
                  >
                    <source src={story.media_url} type={story.media_type} />
                  </audio>
                </div>
              )}
              {story.media_type?.startsWith("video/") && (
                <div className="space-y-4">
                  <video controls className="w-full rounded-lg">
                    <source src={story.media_url} type={story.media_type} />
                  </video>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">{story.description}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Processing Results */}
      {(story.transcription || story.translation || story.summary) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>AI Processing Results</CardTitle>
              <CardDescription>
                Automatically generated transcription, translation, and summary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="transcription" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  {story.transcription && (
                    <TabsTrigger value="transcription">Transcription</TabsTrigger>
                  )}
                  {story.translation && (
                    <TabsTrigger value="translation">Translation</TabsTrigger>
                  )}
                  {story.summary && <TabsTrigger value="summary">Summary</TabsTrigger>}
                </TabsList>
                {story.transcription && (
                  <TabsContent value="transcription" className="mt-4">
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap">{story.transcription}</p>
                    </div>
                  </TabsContent>
                )}
                {story.translation && (
                  <TabsContent value="translation" className="mt-4">
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap">{story.translation}</p>
                    </div>
                  </TabsContent>
                )}
                {story.summary && (
                  <TabsContent value="summary" className="mt-4">
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap">{story.summary}</p>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Blockchain Protection Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div>
                <h4 className="font-semibold mb-1">Blockchain Protected</h4>
                <p className="text-sm text-muted-foreground">
                  This story's origin and creator rights are permanently recorded on the blockchain,
                  ensuring proper attribution and royalty distribution. The cultural contribution is
                  preserved for future generations.
                </p>
              </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Share/Explore More */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-4 pt-4"
      >
        <Link to="/stories" className="flex-1">
          <Button variant="outline" className="w-full">
            Explore More Stories
          </Button>
        </Link>
        <Link to="/chat" className="flex-1">
          <Button className="w-full">Ask AI Historian</Button>
        </Link>
      </motion.div>
    </div>
  );
}