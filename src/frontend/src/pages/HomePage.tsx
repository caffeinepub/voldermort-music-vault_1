import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music2, Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { navigate } from "../App";
import SkeletonCard from "../components/SkeletonCard";
import VideoCard from "../components/VideoCard";
import { useAllCategories, useFeaturedVideos } from "../hooks/useQueries";

const CATEGORY_ICONS: Record<string, string> = {
  "80's Music": "🎸",
  "90's Music": "💿",
  "2000's Music": "📀",
  "Heavy Metal": "🤘",
  Rock: "🎵",
  "Classic Rock": "🎶",
  Pop: "⭐",
  "Hip Hop / Rap": "🎤",
  "R&B / Soul": "🎷",
  Jazz: "🎺",
  Blues: "🎸",
  Country: "🤠",
  "Electronic / Dance": "🎧",
  Punk: "⚡",
  Indie: "🌟",
  Reggae: "🌿",
  Latin: "💃",
  Alternative: "🔮",
};

const CATEGORY_COLORS: Record<string, string> = {
  "80's Music": "from-pink-900/60 to-purple-900/60",
  "90's Music": "from-teal-900/60 to-blue-900/60",
  "2000's Music": "from-orange-900/60 to-red-900/60",
  "Heavy Metal": "from-gray-900/80 to-zinc-800/60",
  Rock: "from-red-900/60 to-orange-900/60",
  "Classic Rock": "from-amber-900/60 to-yellow-900/60",
  Pop: "from-pink-800/60 to-rose-900/60",
  "Hip Hop / Rap": "from-zinc-900/80 to-gray-800/60",
  "R&B / Soul": "from-purple-900/60 to-indigo-900/60",
  Jazz: "from-blue-900/60 to-indigo-900/60",
  Blues: "from-blue-900/70 to-slate-900/60",
  Country: "from-yellow-900/60 to-amber-800/60",
  "Electronic / Dance": "from-cyan-900/60 to-blue-900/60",
  Punk: "from-red-900/70 to-zinc-900/60",
  Indie: "from-emerald-900/60 to-teal-900/60",
  Reggae: "from-green-900/60 to-emerald-800/60",
  Latin: "from-orange-900/60 to-yellow-900/60",
  Alternative: "from-violet-900/60 to-purple-900/60",
};

const SKELETON_IDS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];
const SKELETON_CAT_IDS = [
  "c1",
  "c2",
  "c3",
  "c4",
  "c5",
  "c6",
  "c7",
  "c8",
  "c9",
  "c10",
  "c11",
  "c12",
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: featured, isLoading: featuredLoading } = useFeaturedVideos();
  const { data: categories, isLoading: categoriesLoading } = useAllCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-12 space-y-6"
      >
        <div className="flex justify-center mb-4">
          <Music2 className="w-12 h-12 text-primary neon-pulse-icon" />
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-bold text-gradient leading-tight neon-pulse-text">
          Voldermort Music Vault
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Your dark sanctuary for curated YouTube music — browse by genre,
          discover artists, and explore the vault.
        </p>

        <form
          onSubmit={handleSearch}
          className="flex gap-3 max-w-lg mx-auto mt-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              data-ocid="search.input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search songs, artists, genres..."
              className="pl-10 h-12 bg-secondary/50 border-border/50 focus:border-primary/50 text-base"
            />
          </div>
          <Button
            data-ocid="search.submit_button"
            type="submit"
            size="lg"
            className="h-12 px-6 bg-primary hover:bg-primary/80 vault-glow"
          >
            Search
          </Button>
        </form>
      </motion.section>

      {/* Categories */}
      <section>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="font-display text-2xl font-bold mb-6 text-gradient neon-pulse-text"
        >
          Browse by Genre
        </motion.h2>

        {categoriesLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {SKELETON_CAT_IDS.map((id) => (
              <div key={id} className="h-20 bg-card rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.04 } },
              hidden: {},
            }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
          >
            {(categories ?? []).map((cat, i) => (
              <motion.button
                key={cat}
                type="button"
                data-ocid={`category.item.${i + 1}`}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: { opacity: 1, scale: 1 },
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/category/${encodeURIComponent(cat)}`)}
                className={`relative rounded-lg p-3 text-center bg-gradient-to-br ${
                  CATEGORY_COLORS[cat] ?? "from-primary/20 to-accent/20"
                } border border-border/50 hover:border-primary/40 transition-all duration-200 group`}
              >
                <div className="text-2xl mb-1">
                  {CATEGORY_ICONS[cat] ?? "🎵"}
                </div>
                <div className="text-xs font-medium text-foreground/80 group-hover:text-foreground leading-tight">
                  {cat}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </section>

      {/* Featured Videos */}
      <section>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display text-2xl font-bold mb-6 text-gradient neon-pulse-text-pink"
        >
          Featured Tracks
        </motion.h2>

        {featuredLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {SKELETON_IDS.map((id) => (
              <SkeletonCard key={id} />
            ))}
          </div>
        ) : (featured?.length ?? 0) === 0 ? (
          <div
            data-ocid="video.empty_state"
            className="text-center py-16 text-muted-foreground"
          >
            <Music2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No videos in the vault yet. Check back soon.</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.06 } },
              hidden: {},
            }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {(featured ?? []).slice(0, 8).map((video, i) => (
              <motion.div
                key={String(video.id)}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <VideoCard video={video} index={i} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}
