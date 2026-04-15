// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Mock data for when API is unavailable
const MOCK_STORIES: Story[] = [
  {
    id: "1",
    title: "The Legend of Mount Kenya",
    description: "An ancient Kikuyu story about the origin of Mount Kenya and how it became the sacred dwelling place of Ngai, the supreme deity. This tale has been passed down through generations and teaches about respect for nature and the divine.",
    language: "Kikuyu",
    region: "Central Kenya",
    created_at: new Date(2024, 2, 15).toISOString(),
    creator: "Elder Wanjiru Kamau",
    tags: ["folklore", "sacred", "mountain", "tradition"],
    media_type: "audio/mpeg",
    image_url: "https://images.unsplash.com/photo-1646159755791-54e741749028?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLZW55YSUyME1vdW50JTIwS2VueWElMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzc2MjU4NTIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    transcription: "Long ago, when the world was young, Ngai looked down from the heavens and saw that the people needed a place where heaven and earth could meet. He chose the most beautiful mountain and made it his earthly throne. This is Kirinyaga, the Mountain of Brightness, where the Kikuyu people would forever turn their homes to face, honoring the creator who watches over them.",
    summary: "A traditional Kikuyu creation story explaining the sacred significance of Mount Kenya as the dwelling place of Ngai.",
  },
  {
    id: "2",
    title: "Swahili Coastal Trading Stories",
    description: "Tales from the Swahili coast about ancient trading routes, dhow sailors, and the cultural exchange that shaped East African coastal communities. These stories preserve the maritime heritage of the region.",
    language: "Swahili",
    region: "Coast",
    created_at: new Date(2024, 3, 10).toISOString(),
    creator: "Bi Fatuma Ali",
    tags: ["history", "trade", "ocean", "culture"],
    media_type: "video/mp4",
    image_url: "https://images.unsplash.com/photo-1678225894029-ac0fe99cc047?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwc3Rvcnl0ZWxsaW5nJTIwZWxkZXJ8ZW58MXx8fHwxNzc2MjU4NTIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    translation: "Stories of the ancient dhow traders who sailed between Africa, Arabia, and India, carrying spices, stories, and culture across the Indian Ocean. The monsoon winds guided their journeys, and their descendants still remember the songs they sang.",
    summary: "Historical accounts of Swahili maritime trade and cultural exchange across the Indian Ocean.",
  },
  {
    id: "3",
    title: "Luo Fishing Traditions",
    description: "Traditional fishing methods and songs from Lake Victoria's Luo community. These practices have sustained communities for centuries and represent a deep connection with the lake ecosystem.",
    language: "Luo",
    region: "Nyanza",
    created_at: new Date(2024, 1, 20).toISOString(),
    creator: "Omondi Otieno",
    tags: ["fishing", "lake", "songs", "tradition"],
    image_url: "https://images.unsplash.com/photo-1751568928692-29cd75fe607f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMYWtlJTIwVmljdG9yaWElMjBmaXNoaW5nJTIwYm9hdHxlbnwxfHx8fDE3NzYyNTg1MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    transcription: "The fishermen would sing specific songs to honor the lake spirits before casting their nets. 'Nam Lolwe gi duonde' - Lake Victoria and its gifts. The rhythms match the rowing patterns, and the words ask for blessings from the water that feeds our families.",
    summary: "Documentation of traditional Luo fishing practices and cultural rituals around Lake Victoria.",
  },
  {
    id: "4",
    title: "Maasai Cattle Herding Wisdom",
    description: "Stories and proverbs about cattle herding from Maasai elders, including traditional knowledge about animal behavior, weather patterns, and sustainable grazing practices passed through oral tradition.",
    language: "Maasai",
    region: "Rift Valley",
    created_at: new Date(2024, 0, 5).toISOString(),
    creator: "Ole Sankale",
    tags: ["pastoral", "cattle", "wisdom", "proverbs"],
    image_url: "https://images.unsplash.com/photo-1769877820291-f5b7ee398ab3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYWFzYWklMjB3YXJyaW9yJTIwdHJhZGl0aW9uYWx8ZW58MXx8fHwxNzc2MjU4NTIwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    transcription: "When the cattle refuse to graze, the elder knows the rains will come. This wisdom has guided our people for generations. We say: 'Enkishui naa enkiloriti' - water is life. The health of our cattle reflects the health of our land.",
    summary: "Traditional Maasai knowledge about cattle herding and environmental observation.",
  },
  {
    id: "5",
    title: "The Drumming Ceremonies of the Kamba",
    description: "The Kamba people's traditional drumming patterns used in ceremonies, celebrations, and communication. Each rhythm tells a story and conveys specific meanings understood across generations.",
    language: "Kamba",
    region: "Eastern",
    created_at: new Date(2024, 2, 28).toISOString(),
    creator: "Mutua Kioko",
    tags: ["music", "drums", "ceremony", "communication"],
    media_type: "audio/mpeg",
    image_url: "https://images.unsplash.com/photo-1772268337010-03e52e5b9a11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwZHJ1bXMlMjB0cmFkaXRpb25hbCUyMG11c2ljfGVufDF8fHx8MTc3NjI1ODUyMXww&ixlib=rb-4.1.0&q=80&w=1080",
    transcription: "The ngoma speaks many languages. Quick beats announce arrivals, slow rhythms honor the ancestors. Young people learn these patterns from childhood, knowing that when words fail, the drum will carry our messages across the hills.",
    translation: "Traditional Kamba drumming is not just music - it's a language, a history book, and a spiritual connection all woven into rhythm.",
    summary: "Exploration of Kamba drumming traditions and their role in cultural communication.",
  },
  {
    id: "6",
    title: "Kalenjin Running Heritage",
    description: "The cultural and spiritual aspects of running in Kalenjin communities, exploring how traditional practices and beliefs have contributed to producing world-class athletes.",
    language: "Kalenjin",
    region: "Rift Valley",
    created_at: new Date(2024, 3, 3).toISOString(),
    creator: "Kipchoge Ruto",
    tags: ["athletics", "tradition", "spirituality", "culture"],
    image_url: "https://images.unsplash.com/photo-1720006256355-bc1aba2ae6ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLZW55YSUyMHdpbGRsaWZlJTIwc2F2YW5uYXxlbnwxfHx8fDE3NzYyNTg1MjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    transcription: "Our ancestors ran through these highlands, herding cattle, delivering messages across vast distances. We learned to listen to our breath, to feel the earth beneath our feet. This is why we run - it is in our blood, our history, our connection to the land.",
    summary: "Cultural exploration of Kalenjin running traditions and their modern athletic legacy.",
  },
  {
    id: "7",
    title: "Giriama Wedding Ceremonies",
    description: "Detailed documentation of traditional Giriama wedding customs from the coastal region, including the multiple stages of ceremony, symbolic rituals, and community involvement.",
    language: "Giriama",
    region: "Coast",
    created_at: new Date(2024, 1, 14).toISOString(),
    creator: "Kadzo Kahindi",
    tags: ["wedding", "ceremony", "customs", "celebration"],
    media_type: "video/mp4",
    image_url: "https://images.unsplash.com/photo-1775138622438-f9568c3e279d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwZGFuY2UlMjBjZXJlbW9ueXxlbnwxfHx8fDE3NzYyNTg1MjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    transcription: "The bride is adorned with henna patterns, each design carrying meaning. The community gathers for seven days of celebration. Elders share wisdom, dancers tell stories through movement, and two families become one.",
    summary: "Comprehensive documentation of Giriama wedding traditions and their cultural significance.",
  },
  {
    id: "8",
    title: "Somali Camel Herding Poetry",
    description: "Traditional Somali poetry about camel herding, desert navigation, and the deep bond between herders and their animals. These verses have been memorized and recited for centuries.",
    language: "Somali",
    region: "North Eastern",
    created_at: new Date(2024, 0, 18).toISOString(),
    creator: "Abdi Hassan",
    tags: ["poetry", "camels", "desert", "oral tradition"],
    transcription: "In the shifting sands, the camel knows the way. We recite: 'Geel waa geesi' - the camel is brave. Through drought and storm, these companions carry our hopes. Each verse teaches navigation, survival, and the honor of the herder's life.",
    translation: "Somali pastoral poetry teaches practical wisdom while celebrating the noble relationship between people and their camels in the harsh desert environment.",
    summary: "Collection of traditional Somali poetry about camel herding and desert life.",
  },
  {
    id: "9",
    title: "Luhya Traditional Medicine Knowledge",
    description: "Ancient Luhya herbal medicine practices and plant knowledge passed down from traditional healers. Includes identification of medicinal plants and their preparation methods.",
    language: "Luhya",
    region: "Western",
    created_at: new Date(2024, 2, 7).toISOString(),
    creator: "Wafula Simiyu",
    tags: ["medicine", "herbs", "healing", "traditional knowledge"],
    image_url: "https://images.unsplash.com/photo-1760907949894-b66d728e0a8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwd29tYW4lMjBjb29raW5nJTIwdHJhZGl0aW9uYWx8ZW58MXx8fHwxNzc2MjU4NTIyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    transcription: "The omukombe tree's bark treats stomach ailments. Omulukha leaves reduce fever. Our grandmothers knew every plant in the forest, every root's purpose. This knowledge saved lives long before modern medicine arrived.",
    summary: "Traditional Luhya medicinal plant knowledge and healing practices.",
  },
  {
    id: "10",
    title: "Meru Circumcision Songs",
    description: "Traditional songs performed during Meru male circumcision ceremonies, marking the transition from boyhood to adulthood. These songs carry teachings about responsibility and community values.",
    language: "Meru",
    region: "Eastern",
    created_at: new Date(2024, 3, 1).toISOString(),
    creator: "M'Ikiara M'Murefu",
    tags: ["initiation", "ceremony", "songs", "coming of age"],
    media_type: "audio/mpeg",
    transcription: "The songs begin at dawn: 'Mwana ni mwana, mundu ni mundu' - a child is a child, but a person is a person. Through this ceremony, we become men of the community, ready to protect, provide, and preserve our culture.",
    summary: "Documentation of Meru initiation ceremony songs and their cultural teachings.",
  },
  {
    id: "11",
    title: "Turkana Desert Navigation Stories",
    description: "Stories from Turkana elders about traditional navigation methods in the desert, reading stars, wind patterns, and animal behavior to find water and safe passage.",
    language: "Turkana",
    region: "Rift Valley",
    created_at: new Date(2024, 1, 9).toISOString(),
    creator: "Ekaran Lopua",
    tags: ["navigation", "desert", "survival", "astronomy"],
    transcription: "The stars are our map, the wind our compass. We follow the flight of birds to water. The shape of sand dunes tells us direction. This knowledge kept our ancestors alive in the harshest land, and we must not forget.",
    summary: "Traditional Turkana navigation and survival wisdom for desert environments.",
  },
  {
    id: "12",
    title: "Kisii Soapstone Carving Heritage",
    description: "The art and cultural significance of soapstone carving in Kisii communities. Stories of master carvers and the meanings behind traditional designs and motifs.",
    language: "Kisii",
    region: "Nyanza",
    created_at: new Date(2024, 2, 22).toISOString(),
    creator: "Ombati Moseti",
    tags: ["art", "carving", "craft", "heritage"],
    image_url: "https://images.unsplash.com/photo-1775663764268-bbdfe995bcd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwdGV4dGlsZSUyMHdlYXZpbmd8ZW58MXx8fHwxNzc2MjU4NTI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    transcription: "Each curve in the stone tells a story. The smooth soapstone from our hills becomes birds, bowls, and figures. We carve what our grandparents taught us, keeping alive patterns that have meaning beyond decoration.",
    translation: "Kisii soapstone carving is more than craft - it's cultural preservation in solid form, each piece carrying generations of artistic tradition.",
    summary: "Exploration of Kisii soapstone carving traditions and artistic heritage.",
  },
  {
    id: "13",
    title: "Tharaka Honey Harvesting Traditions",
    description: "Ancient Tharaka methods of honey harvesting, including traditional beekeeping, honey hunting techniques, and the cultural importance of honey in ceremonies and medicine.",
    language: "Tharaka",
    region: "Eastern",
    created_at: new Date(2024, 0, 27).toISOString(),
    creator: "Nkatha Muriungi",
    tags: ["beekeeping", "honey", "tradition", "sustainable"],
    transcription: "We sing to the bees before harvest: 'Muuki ni baraka' - honey is blessing. Our log hives hang in sacred trees. The bees know us, and we honor them. This sweetness has sustained our people since time began.",
    summary: "Traditional Tharaka beekeeping and honey harvesting practices.",
  },
  {
    id: "14",
    title: "Taita Rainmaking Ceremonies",
    description: "Sacred Taita traditions of rainmaking ceremonies, performed by community elders during drought. Includes prayers, rituals, and the spiritual connection to the Taita Hills.",
    language: "Taita",
    region: "Coast",
    created_at: new Date(2024, 3, 12).toISOString(),
    creator: "Mghanga Mwakio",
    tags: ["ceremony", "rain", "spirituality", "environment"],
    transcription: "When drought threatens, the elders climb the sacred hills. They offer prayers and pour libations. The ancestors hear us. The clouds gather. This ceremony has brought rain since our people first lived in these hills.",
    summary: "Documentation of Taita rainmaking ceremonies and environmental spirituality.",
  },
  {
    id: "15",
    title: "Children's Games Across Kenya",
    description: "A collection of traditional children's games from various Kenyan communities, showing how play teaches cultural values, social skills, and community bonds.",
    language: "English",
    region: "Nairobi",
    created_at: new Date(2024, 3, 5).toISOString(),
    creator: "Maria Wanjiru",
    tags: ["children", "games", "education", "community"],
    media_type: "video/mp4",
    image_url: "https://images.unsplash.com/photo-1717572316112-3e3839554744?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwY2hpbGRyZW4lMjBwbGF5aW5nJTIwdHJhZGl0aW9uYWx8ZW58MXx8fHwxNzc2MjU4NTI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    transcription: "From Bao in the coast to Ajua in Central Kenya, our children's games teach strategy, cooperation, and fair play. These aren't just pastimes - they're how we pass on our values to the next generation.",
    summary: "Overview of traditional Kenyan children's games and their educational value.",
  },
];

const MOCK_STATS: Stats = {
  total_stories: 487,
  total_languages: 42,
  total_regions: 18,
  recent_uploads: 156,
};

export interface Story {
  id: string;
  title: string;
  description: string;
  language: string;
  region: string;
  media_url?: string;
  media_type?: string;
  transcription?: string;
  translation?: string;
  summary?: string;
  created_at: string;
  creator?: string;
  tags?: string[];
  image_url?: string;
}

export interface Stats {
  total_stories: number;
  total_languages: number;
  total_regions: number;
  recent_uploads: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// API functions
export async function uploadStory(formData: FormData): Promise<Story> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/stories/upload`, {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error("Failed to upload story");
    }
    
    return response.json();
  } catch (error) {
    // Return mock success for demo
    const newStory: Story = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      language: formData.get("language") as string,
      region: formData.get("region") as string,
      creator: formData.get("creator") as string || undefined,
      created_at: new Date().toISOString(),
      tags: (formData.get("tags") as string)?.split(",").map(t => t.trim()).filter(Boolean),
      transcription: "AI transcription is being processed...",
      summary: "AI is analyzing your story and will provide a summary shortly.",
    };
    return newStory;
  }
}

export async function getStories(
  language?: string,
  region?: string,
  limit: number = 20
): Promise<Story[]> {
  try {
    const params = new URLSearchParams();
    if (language) params.append("language", language);
    if (region) params.append("region", region);
    params.append("limit", limit.toString());
    
    const response = await fetch(`${API_BASE_URL}/api/stories?${params}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch stories");
    }
    
    return response.json();
  } catch (error) {
    // Return mock data when API is unavailable
    let filtered = [...MOCK_STORIES];
    if (language) {
      filtered = filtered.filter(s => s.language === language);
    }
    if (region) {
      filtered = filtered.filter(s => s.region === region);
    }
    return filtered;
  }
}

export async function getStory(id: string): Promise<Story> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/stories/${id}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch story");
    }
    
    return response.json();
  } catch (error) {
    // Return mock data
    const story = MOCK_STORIES.find(s => s.id === id);
    if (!story) {
      throw new Error("Story not found");
    }
    return story;
  }
}

export async function getStats(): Promise<Stats> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/stats`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch stats");
    }
    
    return response.json();
  } catch (error) {
    // Return mock stats
    return MOCK_STATS;
  }
}

export async function sendChatMessage(
  message: string,
  history: ChatMessage[]
): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        history,
      }),
    });
    
    if (!response.ok) {
      throw new Error("Failed to send message");
    }
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    // Return mock AI responses
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("swahili") && lowerMessage.includes("folktale")) {
      return "One of the most beloved Swahili folktales is the story of 'Abunuwasi na Sultan' (Abunuwasi and the Sultan). Abunuwasi was a clever advisor known for his wit and wisdom. In one tale, the Sultan challenged him to bring something that was neither inside nor outside the palace. Abunuwasi brought a bird in a cage - the bird was inside the cage, but the cage was outside the palace walls! This story teaches us about creative thinking and wisdom. Would you like to hear more Swahili folktales?";
    }
    
    if (lowerMessage.includes("kikuyu") || lowerMessage.includes("ceremony")) {
      return "Traditional Kikuyu ceremonies are rich in cultural significance. The 'Ngwatio' ceremony, for example, marks the initiation into adulthood. During this ceremony, young people learn about their responsibilities to the community, receive traditional teachings from elders, and are welcomed as full members of society. Music, dance, and symbolic rituals play important roles. These ceremonies strengthen community bonds and pass down cultural values across generations.";
    }
    
    if (lowerMessage.includes("mount kenya") || lowerMessage.includes("mountain")) {
      return "Mount Kenya, known as 'Kirinyaga' in Kikuyu, holds deep spiritual significance. According to Kikuyu tradition, it is the earthly dwelling place of Ngai, the supreme creator. The mountain is considered so sacred that traditionally, people would build their homes with doors facing towards it. Many creation stories and legends revolve around this majestic peak, and it continues to be a symbol of cultural identity for the communities living in its shadow.";
    }
    
    if (lowerMessage.includes("language")) {
      return "Our archive preserves stories in over 28 languages from Kenya and across Africa! This includes major Kenyan languages like Swahili, Kikuyu, Luo, Kamba, Kalenjin, Luhya, and Maasai, as well as many other African languages. Each language carries unique cultural knowledge, worldviews, and wisdom. By preserving these languages through stories, we help ensure they survive for future generations.";
    }
    
    return "That's a fascinating question! Our cultural archive contains stories about traditions, languages, folktales, and historical accounts from communities across Kenya and Africa. I can share specific stories, explain cultural practices, or help you explore particular regions or traditions. What aspect of cultural heritage interests you most?";
  }
}

export async function createSampleData(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/test/create_sample`, {
    method: "POST",
  });
  
  if (!response.ok) {
    throw new Error("Failed to create sample data");
  }
}

export function getMediaUrl(filename: string): string {
  return `${API_BASE_URL}/api/media/${filename}`;
}