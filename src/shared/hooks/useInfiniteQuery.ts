import React from "react";
import { useInfiniteQuery as useReactInfiniteQuery } from "@tanstack/react-query";
import { ApiResponse } from "../types/api.types";

interface UseInfiniteQueryOptions<T> {
  queryKey: (string | number | boolean)[];
  queryFn: ({ pageParam }: { pageParam: number }) => Promise<ApiResponse<T>>;
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

export function useInfiniteQuery<T>({
  queryKey,
  queryFn,
  enabled = true,
  staleTime,
  gcTime,
}: UseInfiniteQueryOptions<T>) {
  return useReactInfiniteQuery({
    queryKey,
    queryFn,
    enabled,
    staleTime,
    gcTime,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.info.next) {
        return allPages.length + 1;
      }
      return undefined;
    },
    getPreviousPageParam: (firstPage, allPages) => {
      if (firstPage.info.prev) {
        return allPages.length > 1 ? allPages.length - 1 : undefined;
      }
      return undefined;
    },
  });
}

export function useFlattenedInfiniteData<T>(data: any) {
  return React.useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page: ApiResponse<T>) => page.results);
  }, [data]);
}

export default useInfiniteQuery;
