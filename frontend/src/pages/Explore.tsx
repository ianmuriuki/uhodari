import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StoryGrid } from '../components/Stories/StoryGrid';
import { storyAPI } from '../services/api';
import { LANGUAGES, REGIONS, CATEGORIES } from '../utils/constants';

export const Explore = () => {
  const [filters, setFilters] = useState({
    language: '',
    region: '',
    category: '',
    search: '',
  });

  const { data: stories, isLoading } = useQuery({
    queryKey: ['stories', filters],
    queryFn: () => storyAPI.getAll(filters),
  });

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Explore Stories</h1>
          <p className="text-gray-600">Discover Kenya's rich oral heritage</p>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search stories..."
              className="input-field"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <select
              className="input-field"
              value={filters.language}
              onChange={(e) => setFilters({ ...filters, language: e.target.value })}
            >
              <option value="">All Languages</option>
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <select
              className="input-field"
              value={filters.region}
              onChange={(e) => setFilters({ ...filters, region: e.target.value })}
            >
              <option value="">All Regions</option>
              {REGIONS.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
            <select
              className="input-field"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <StoryGrid stories={stories?.data || []} isLoading={isLoading} />
      </div>
    </div>
  );
};