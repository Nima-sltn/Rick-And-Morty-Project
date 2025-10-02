import { useQuery } from "@tanstack/react-query";
import { episodeService } from "../services/episode.service";
import { EpisodeFilters } from "../../../shared/types/api.types";

export const episodeKeys = {
  all: ["episodes"] as const,
  lists: () => [...episodeKeys.all, "list"] as const,
  list: (filters: EpisodeFilters) => [...episodeKeys.lists(), filters] as const,
  details: () => [...episodeKeys.all, "detail"] as const,
  detail: (id: number) => [...episodeKeys.details(), id] as const,
  search: (query: string) => [...episodeKeys.all, "search", query] as const,
  season: (season: number) => [...episodeKeys.all, "season", season] as const,
  seasons: () => [...episodeKeys.all, "seasons"] as const,
  byUrls: (urls: string[]) =>
    [...episodeKeys.all, "byUrls", urls.sort()] as const,
  byIds: (ids: number[]) => [...episodeKeys.all, "byIds", ids.sort()] as const,
};

/**
 * Hook for fetching paginated episodes with filters
 */
export function useEpisodes(filters: EpisodeFilters = {}) {
  return useQuery({
    queryKey: episodeKeys.list(filters),
    queryFn: () => episodeService.getEpisodes(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook for fetching a single episode
 */
export function useEpisode(id: number | null) {
  return useQuery({
    queryKey: episodeKeys.detail(id!),
    queryFn: () => episodeService.getEpisode(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook for fetching multiple episodes by IDs
 */
export function useEpisodesByIds(ids: number[]) {
  return useQuery({
    queryKey: episodeKeys.byIds(ids),
    queryFn: () => episodeService.getEpisodesByIds(ids),
    enabled: ids.length > 0,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook for fetching episodes by URLs
 */
export function useEpisodesByUrls(urls: string[]) {
  return useQuery({
    queryKey: episodeKeys.byUrls(urls),
    queryFn: () => episodeService.getEpisodesByUrls(urls),
    enabled: urls.length > 0,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook for searching episodes
 */
export function useEpisodeSearch(query: string, page: number = 1) {
  return useQuery({
    queryKey: [...episodeKeys.search(query), page],
    queryFn: () => episodeService.searchEpisodes(query, page),
    enabled: query.length > 0,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook for fetching episodes by season
 */
export function useEpisodesBySeason(season: number) {
  return useQuery({
    queryKey: episodeKeys.season(season),
    queryFn: () => episodeService.getEpisodesBySeason(season),
    enabled: season > 0,
    staleTime: 15 * 60 * 1000,
  });
}

/**
 * Hook for fetching all seasons summary
 */
export function useSeasonsSummary() {
  return useQuery({
    queryKey: episodeKeys.seasons(),
    queryFn: () => episodeService.getSeasonsSummary(),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}
