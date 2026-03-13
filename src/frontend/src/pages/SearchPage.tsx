import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Search } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { navigate } from "../App";
import SkeletonCard from "../components/SkeletonCard";
import VideoCard from "../components/VideoCard";
import { useSearchVideos } from "../hooks/useQueries";

const SKELETON_IDS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];

interface SearchPageProps {
  query: string;
}

export default function SearchPage({ query }: SearchPageProps) {
  const [searchInput, setSearchInput] = useState(query);
  const { data: results, isLoading } = useSearchVideos(query);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </Button>

        <h1 className="font-display text-3xl font-bold text-gradient neon-pulse-text">
          Search Results
        </h1>

        <form onSubmit={handleSearch} className="flex gap-3 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-ocid="search.input"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search songs, artists, genres..."
              className="pl-9 bg-secondary/50 border-border/50"
            />
          </div>
          <Button
            data-ocid="search.submit_button"
            type="submit"
            className="bg-primary hover:bg-primary/80"
          >
            Search
          </Button>
        </form>

        {!isLoading && query && (
          <p className="text-muted-foreground text-sm">
            {results?.length ?? 0} result
            {(results?.length ?? 0) !== 1 ? "s" : ""} for{" "}
            <span className="text-foreground font-medium">"{query}"</span>
          </p>
        )}
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {SKELETON_IDS.map((id) => (
            <SkeletonCard key={id} />
          ))}
        </div>
      ) : !query ? (
        <div className="text-center py-20 text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Enter a search term to find tracks.</p>
        </div>
      ) : (results?.length ?? 0) === 0 ? (
        <div
          data-ocid="video.empty_state"
          className="text-center py-20 text-muted-foreground"
        >
          <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg">No tracks found for "{query}"</p>
          <p className="text-sm mt-2">Try searching by artist name or genre.</p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.05 } },
            hidden: {},
          }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {(results ?? []).map((video, i) => (
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
    </div>
  );
}
