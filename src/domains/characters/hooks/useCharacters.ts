import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { characterService } from "../services/character.service";
import { SearchFilters } from "../../../shared/types/api.types";

export const characterKeys = {
  all: ["characters"] as const,
  lists: () => [...characterKeys.all, "list"] as const,
  list: (filters: SearchFilters) =>
    [...characterKeys.lists(), filters] as const,
  details: () => [...characterKeys.all, "detail"] as const,
  detail: (id: number) => [...characterKeys.details(), id] as const,
  search: (query: string) => [...characterKeys.all, "search", query] as const,
  random: () => [...characterKeys.all, "random"] as const,
};

/**
 * Hook for fetching paginated characters with filters
 */
export function useCharacters(filters: SearchFilters = {}) {
  return useQuery({
    queryKey: characterKeys.list(filters),
    queryFn: () => characterService.getCharacters(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook for infinite scrolling characters
 */
export function useInfiniteCharacters(
  filters: Omit<SearchFilters, "page"> = {}
) {
  return useInfiniteQuery({
    queryKey: [...characterKeys.lists(), "infinite", filters],
    queryFn: ({ pageParam = 1 }) =>
      characterService.getCharacters({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.info.next) {
        const url = new URL(lastPage.info.next);
        return parseInt(url.searchParams.get("page") || "1");
      }
      return undefined;
    },
  });
}

/**
 * Hook for fetching a single character
 */
export function useCharacter(id: number | null) {
  return useQuery({
    queryKey: characterKeys.detail(id!),
    queryFn: () => characterService.getCharacter(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook for fetching multiple characters by IDs
 */
export function useCharactersByIds(ids: number[]) {
  return useQuery({
    queryKey: [
      ...characterKeys.all,
      "multiple",
      [...ids].sort((a, b) => a - b),
    ],
    queryFn: () => characterService.getCharactersByIds(ids),
    enabled: ids.length > 0,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook for searching characters with debouncing
 */
export function useCharacterSearch(query: string, page: number = 1) {
  return useQuery({
    queryKey: characterKeys.search(`${query}-${page}`),
    queryFn: () => characterService.searchCharacters(query, page),
    enabled: query.length > 0,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook for fetching random characters
 */
export function useRandomCharacters(count: number = 5) {
  return useQuery({
    queryKey: [...characterKeys.random(), count],
    queryFn: () => characterService.getRandomCharacters(count),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}
