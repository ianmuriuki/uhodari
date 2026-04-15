import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { MediaUploader } from '../components/Upload/MediaUploader';
import { StoryForm } from '../components/Upload/StoryForm';
import { storyAPI } from '../services/api';
import { UploadStoryData } from '../types';

export const Upload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<UploadStoryData>();

  const onSubmit = async (data: UploadStoryData) => {
    if (!file) {
      toast.error('Please select a media file');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    Object.keys(data).forEach(key => {
      formData.append(key, data[key as keyof UploadStoryData] as string);
    });

    try {
      const response = await storyAPI.upload(formData);
      toast.success('Story uploaded successfully! AI processing has started.');
      navigate(`/story/${response.story_id}`);
    } catch (error) {
      toast.error('Failed to upload story');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Share Your Story</h1>
          <p className="text-gray-600">
            Record and preserve Kenyan oral traditions for future generations
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <MediaUploader onFileSelect={setFile} />
          <StoryForm register={register} errors={errors} />
          
          <button
            type="submit"
            disabled={isUploading || !file}
            className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading and Processing...' : 'Preserve Story'}
          </button>
        </form>
      </div>
    </div>
  );
};