import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { VideoEntry } from "../backend";
import { useActor } from "./useActor";

export function useAllVideos() {
  const { actor, isFetching } = useActor();
  return useQuery<VideoEntry[]>({
    queryKey: ["videos", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVideos();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFeaturedVideos() {
  const { actor, isFetching } = useActor();
  return useQuery<VideoEntry[]>({
    queryKey: ["videos", "featured"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeaturedVideos();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useVideosByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<VideoEntry[]>({
    queryKey: ["videos", "category", category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVideosByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useVideosByArtist(artist: string) {
  const { actor, isFetching } = useActor();
  return useQuery<VideoEntry[]>({
    queryKey: ["videos", "artist", artist],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVideosByArtist(artist);
    },
    enabled: !!actor && !isFetching && !!artist,
  });
}

export function useSearchVideos(query: string) {
  const { actor, isFetching } = useActor();
  return useQuery<VideoEntry[]>({
    queryKey: ["videos", "search", query],
    queryFn: async () => {
      if (!actor || !query) return [];
      return actor.searchVideos(query);
    },
    enabled: !!actor && !isFetching && !!query,
  });
}

export function useAllCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllArtists() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["artists"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllArtists();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      artist: string;
      category: string;
      youtubeUrl: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addVideo(
        data.title,
        data.artist,
        data.category,
        data.youtubeUrl,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["artists"] });
    },
  });
}

export function useUpdateVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      artist: string;
      category: string;
      youtubeUrl: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateVideo(
        data.id,
        data.title,
        data.artist,
        data.category,
        data.youtubeUrl,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["artists"] });
    },
  });
}

export function useDeleteVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteVideo(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["artists"] });
    },
  });
}
