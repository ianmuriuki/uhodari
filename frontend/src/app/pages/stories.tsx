import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";
import { Search, Loader2, Play, ArrowRight } from "lucide-react";
import { getStories, Story } from "../lib/api";

const COVER_IMAGES: Record<string, string> = {
  Swahili: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80",
  Kikuyu: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=80",
  Luo: "https://images.unsplash.com/photo-1504432842672-1a79f78e4084?w=600&q=80",
  Kamba: "https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=600&q=80",
  Kalenjin: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=600&q=80",
  Maasai: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80",
  Luhya: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=600&q=80",
  English: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80",
  default: "https://images.unsplash.com/photo-1551009175-8a68da93d5f9?w=600&q=80",
};

function getCoverImage(story: Story): string {
  if (story.image_url) return story.image_url;
  return COVER_IMAGES[story.language] || COVER_IMAGES.default;
}

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

  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-4"
      >
        <h1 className="text-4xl font-bold mb-4">Cultural Stories</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explore preserved stories, traditions, and languages from communities across
          Kenya, Africa, and the world
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 md:grid-cols-3"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger><SelectValue placeholder="All Languages" /></SelectTrigger>
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
        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger><SelectValue placeholder="All Regions" /></SelectTrigger>
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
      </motion.div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredStories.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
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
            const isVideo = story.media_type?.startsWith("video/");
            const coverImage = getCoverImage(story);

            return (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/stories/${story.id}`}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 280 }}
                    className="group h-full rounded-2xl overflow-hidden cursor-pointer flex flex-col"
                    style={{ backgroundColor: "#EFEFEA" }}
                  >
                    {/* Cover Image */}
                    <div className="relative w-full overflow-hidden" style={{ height: "220px" }}>
                      <img
                        src={coverImage}
                        alt={story.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = COVER_IMAGES.default;
                        }}
                      />
                      {/* Overlay always present, stronger on hover */}
                      <div
                        className="absolute inset-0 transition-opacity duration-300"
                        style={{ backgroundColor: "rgba(0,0,0,0.25)" }}
                      />

                      {/* Video play button */}
                      {isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                            style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
                          >
                            <Play className="h-6 w-6 ml-1" style={{ color: "#2D5016" }} />
                          </div>
                        </div>
                      )}

                      {/* Language tag on image */}
                      <div className="absolute top-3 left-3">
                        <span
                          className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                          style={{ backgroundColor: "rgba(45,80,22,0.9)" }}
                        >
                          {story.language}
                        </span>
                      </div>

                      {/* Category tag */}
                      {story.category && (
                        <div className="absolute top-3 right-3">
                          <span
                            className="text-xs px-2.5 py-1 rounded-full font-medium"
                            style={{ backgroundColor: "rgba(255,255,255,0.85)", color: "#1A1A1A" }}
                          >
                            {story.category}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-bold text-base text-foreground mb-2 line-clamp-2 leading-snug">
                        {story.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed flex-1">
                        {story.summary && !story.summary.startsWith("API Error") ? story.summary : story.description}
                      </p>

                      <div className="flex items-center justify-between mt-auto pt-4" style={{ borderTop: "1px solid #E0DDD6" }}>
                        <div>
                          <p className="text-xs text-muted-foreground">{story.region}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{formatDate(story.created_at)}</p>
                        </div>
                        <div
                          className="flex items-center gap-1.5 text-xs font-semibold transition-colors group-hover:gap-2.5"
                          style={{ color: "#2D5016" }}
                        >
                          Explore Story
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {!loading && filteredStories.length > 0 && filteredStories.length % 20 === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <Button variant="outline" onClick={loadStories}>Load More Stories</Button>
        </motion.div>
      )}
    </div>
  );
}
