import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Upload as UploadIcon, Loader2, CheckCircle2, FileAudio, FileVideo, FileText } from "lucide-react";
import { uploadStory } from "../lib/api";
import { toast } from "sonner";

export function Upload() {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    language: "",
    region: "",
    creator: "",
    tags: "",
  });

  const languages = [
    "Swahili",
    "Kikuyu",
    "Luo",
    "Kamba",
    "Kalenjin",
    "Luhya",
    "Kisii",
    "Meru",
    "Somali",
    "Maasai",
    "English",
    "Other",
  ];

  const regions = [
    "Nairobi",
    "Central Kenya",
    "Coast",
    "Eastern",
    "North Eastern",
    "Nyanza",
    "Rift Valley",
    "Western",
    "Other Africa",
    "Diaspora",
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setUploading(true);

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("language", formData.language);
      data.append("region", formData.region);
      data.append("category", "Folktale");
      if (formData.creator) data.append("creator", formData.creator);
      if (formData.tags) data.append("tags", formData.tags);

      const result = await uploadStory(data);
      
      toast.success("Story uploaded successfully!", {
        description: "AI is processing your story for transcription and translation.",
      });

      setTimeout(() => {
        navigate(`/stories/${result.id}`);
      }, 1500);
    } catch (error) {
      toast.error("Failed to upload story", {
        description: error instanceof Error ? error.message : "Please try again later",
      });
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = () => {
    if (!file) return FileText;
    const type = file.type;
    if (type.startsWith("audio/")) return FileAudio;
    if (type.startsWith("video/")) return FileVideo;
    return FileText;
  };

  const FileIcon = getFileIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Share Your Story</h1>
        <p className="text-muted-foreground text-lg">
          Preserve your cultural heritage for future generations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Cultural Content</CardTitle>
          <CardDescription>
            Share audio, video, or written stories. Our AI will transcribe, translate,
            and preserve your contribution on the blockchain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="file">Media File *</Label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    id="file"
                    type="file"
                    accept="audio/*,video/*,.txt,.pdf"
                    onChange={handleFileChange}
                    required
                    className="cursor-pointer"
                  />
                </div>
                {file && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <FileIcon className="h-4 w-4 text-primary" />
                    <span className="max-w-[200px] truncate">{file.name}</span>
                  </motion.div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Supported: Audio (MP3, WAV), Video (MP4, MOV), Text (TXT, PDF)
              </p>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., The Tale of Mount Kenya"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide context about this story, its cultural significance, and any important details..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
              />
            </div>

            {/* Language */}
            <div className="space-y-2">
              <Label htmlFor="language">Language *</Label>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData({ ...formData, language: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Region */}
            <div className="space-y-2">
              <Label htmlFor="region">Region *</Label>
              <Select
                value={formData.region}
                onValueChange={(value) => setFormData({ ...formData, region: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Creator */}
            <div className="space-y-2">
              <Label htmlFor="creator">Creator/Storyteller Name</Label>
              <Input
                id="creator"
                placeholder="Your name or community name"
                value={formData.creator}
                onChange={(e) => setFormData({ ...formData, creator: e.target.value })}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="e.g., folklore, tradition, history (comma-separated)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Add tags to help others discover your story
              </p>
            </div>

            {/* Submit Button */}
            <motion.div
              whileHover={{ scale: uploading ? 1 : 1.02 }}
              whileTap={{ scale: uploading ? 1 : 0.98 }}
            >
              <Button
                type="submit"
                className="w-full gap-2"
                size="lg"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing Upload...
                  </>
                ) : (
                  <>
                    <UploadIcon className="h-5 w-5" />
                    Upload Story
                  </>
                )}
              </Button>
            </motion.div>

            {/* Info Box */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">What happens next?</p>
                  <ul className="mt-2 space-y-1 text-muted-foreground">
                    <li>• AI transcribes and translates your content</li>
                    <li>• Blockchain records proof of origin and ownership</li>
                    <li>• Your story becomes searchable by our AI historian</li>
                    <li>• Creator rights and royalty splits are protected</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
