import { Button } from "@/components/ui/button";
import { ChevronLeft, User2 } from "lucide-react";
import { motion } from "motion/react";
import { navigate } from "../App";
import SkeletonCard from "../components/SkeletonCard";
import VideoCard from "../components/VideoCard";
import { useVideosByArtist } from "../hooks/useQueries";

const SKELETON_IDS = ["s1", "s2", "s3", "s4", "s5", "s6"];

interface ArtistPageProps {
  name: string;
}

export default function ArtistPage({ name }: ArtistPageProps) {
  const { data: videos, isLoading } = useVideosByArtist(name);

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
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
            <User2 className="w-8 h-8 text-primary neon-pulse-icon" />
          </div>
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gradient neon-pulse-text">
              {name}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isLoading ? "Loading..." : `${videos?.length ?? 0} tracks`}
            </p>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {SKELETON_IDS.map((id) => (
            <SkeletonCard key={id} />
          ))}
        </div>
      ) : (videos?.length ?? 0) === 0 ? (
        <div
          data-ocid="video.empty_state"
          className="text-center py-20 text-muted-foreground"
        >
          <User2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg">No tracks found for this artist.</p>
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
          {(videos ?? []).map((video, i) => (
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
