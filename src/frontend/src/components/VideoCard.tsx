import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { navigate } from "../App";
import type { VideoEntry } from "../backend";

interface VideoCardProps {
  video: VideoEntry;
  index?: number;
}

export default function VideoCard({ video, index = 0 }: VideoCardProps) {
  const handleArtistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/artist/${encodeURIComponent(video.artist)}`);
  };

  const handleCategoryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/category/${encodeURIComponent(video.category)}`);
  };

  const videoId = video.youtubeUrl.match(/[?&]v=([^&]+)/)?.[1] ?? "";

  return (
    <div
      data-ocid={`video.item.${index + 1}`}
      className="group relative bg-card rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] vault-glow-hover border border-border/50 hover:border-primary/40"
    >
      {/* Thumbnail — full clickable link to YouTube */}
      <a
        href={video.youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative aspect-video overflow-hidden bg-secondary"
        aria-label={`Watch ${video.title} on YouTube`}
      >
        <img
          src={
            video.thumbnailUrl ||
            `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
          }
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
          <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center vault-glow">
            <ExternalLink className="w-6 h-6 text-white" />
          </div>
        </div>
      </a>

      {/* Info */}
      <div className="p-3 space-y-1.5">
        <a
          href={video.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block font-semibold text-foreground line-clamp-2 text-sm leading-tight group-hover:text-primary transition-colors"
        >
          {video.title}
        </a>
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleArtistClick}
            className="text-xs text-muted-foreground hover:text-accent transition-colors truncate"
          >
            {video.artist}
          </button>
          <Badge
            onClick={handleCategoryClick}
            className="text-xs cursor-pointer bg-primary/20 text-primary border-primary/30 hover:bg-primary/40 transition-colors flex-shrink-0"
          >
            {video.category}
          </Badge>
        </div>
      </div>
    </div>
  );
}
