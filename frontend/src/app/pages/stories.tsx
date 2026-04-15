import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Search, Filter, Calendar, MapPin, Languages, Loader2, Play, FileText } from "lucide-react";
import { getStories, Story } from "../lib/api";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function Stories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  useEffect(() => {
    loadStories();
  }, [selectedLanguage, selectedRegion]);

  const loadStories = async () => {
    setLoading(true);
    try {
      const data = await getStories(
        selectedLanguage === "all" ? undefined : selectedLanguage,
        selectedRegion === "all" ? undefined : selectedRegion
      );
      setStories(data);
    } catch (error) {
      console.error("Failed to load stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStories = stories.filter(
    (story) =>
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getMediaIcon = (mediaType?: string) => {
    if (!mediaType) return FileText;
    if (mediaType.startsWith("audio/")) return Play;
    if (mediaType.startsWith("video/")) return Play;
    return FileText;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4">Cultural Stories</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explore preserved stories, traditions, and languages from communities across Kenya,
          Africa, and the world
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search stories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Language Filter */}
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    <SelectValue placeholder="All Languages" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="Swahili">Swahili</SelectItem>
                  <SelectItem value="Kikuyu">Kikuyu</SelectItem>
                  <SelectItem value="Luo">Luo</SelectItem>
                  <SelectItem value="Kamba">Kamba</SelectItem>
                  <SelectItem value="Kalenjin">Kalenjin</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                </SelectContent>
              </Select>

              {/* Region Filter */}
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <SelectValue placeholder="All Regions" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="Nairobi">Nairobi</SelectItem>
                  <SelectItem value="Central Kenya">Central Kenya</SelectItem>
                  <SelectItem value="Coast">Coast</SelectItem>
                  <SelectItem value="Nyanza">Nyanza</SelectItem>
                  <SelectItem value="Rift Valley">Rift Valley</SelectItem>
                  <SelectItem value="Western">Western</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stories Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredStories.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Filter className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-xl font-semibold mb-2">No stories found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredStories.map((story, index) => {
            const MediaIcon = getMediaIcon(story.media_type);
            return (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/stories/${story.id}`}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50">
                      {story.image_url ? (
                        <div className="relative w-full h-48 bg-muted overflow-hidden">
                          <ImageWithFallback
                            src={story.image_url}
                            alt={story.title}
                            className="w-full h-full object-cover"
                          />
                          {story.media_type && (
                            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
                              <MediaIcon className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                      ) : story.media_url && story.media_type?.startsWith("video/") ? (
                        <div className="relative w-full h-48 bg-muted overflow-hidden">
                          <ImageWithFallback
                            src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&q=80"
                            alt={story.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <div className="h-12 w-12 rounded-full bg-primary/90 flex items-center justify-center">
                              <Play className="h-6 w-6 text-primary-foreground ml-0.5" />
                            </div>
                          </div>
                        </div>
                      ) : null}
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <CardTitle className="line-clamp-2">{story.title}</CardTitle>
                          <MediaIcon className="h-5 w-5 text-primary flex-shrink-0" />
                        </div>
                        <CardDescription className="line-clamp-3">
                          {story.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="gap-1">
                              <Languages className="h-3 w-3" />
                              {story.language}
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                              <MapPin className="h-3 w-3" />
                              {story.region}
                            </Badge>
                          </div>
                          {story.tags && story.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {story.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                            <Calendar className="h-3 w-3" />
                            {formatDate(story.created_at)}
                            {story.creator && (
                              <>
                                <span>•</span>
                                <span className="truncate">{story.creator}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Load More */}
      {!loading && filteredStories.length > 0 && filteredStories.length % 20 === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Button variant="outline" onClick={loadStories}>
            Load More Stories
          </Button>
        </motion.div>
      )}
    </div>
  );
}