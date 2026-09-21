import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

interface UseOptimisticUpdateOptions<T> {
  queryKey: (string | number | boolean)[];
  updateFn: (oldData: T | undefined, newData: Partial<T>) => T;
  rollbackFn?: (oldData: T | undefined) => T | undefined;
}

/**
 * Hook for performing optimistic updates with automatic rollback on failure.
 * @param options.queryKey - React Query cache key to update
 * @param options.updateFn - Function to compute the optimistic update from old data
 * @param options.rollbackFn - Optional function to compute rollback state on error
 * @returns An object with `optimisticUpdate` and `invalidateQuery` methods
 */
export function useOptimisticUpdate<T>({
  queryKey,
  updateFn,
  rollbackFn,
}: UseOptimisticUpdateOptions<T>) {
  const queryClient = useQueryClient();

  const optimisticUpdate = useCallback(
    async (newData: Partial<T>, mutationFn: () => Promise<any>) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<T>(queryKey);

      queryClient.setQueryData<T>(queryKey, (oldData) =>
        updateFn(oldData, newData)
      );

      try {
        const result = await mutationFn();
        return { result, previousData };
      } catch (error) {
        queryClient.setQueryData<T>(
          queryKey,
          rollbackFn ? rollbackFn(previousData) : previousData
        );
        throw error;
      }
    },
    [queryClient, queryKey, updateFn, rollbackFn]
  );

  const invalidateQuery = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  return {
    optimisticUpdate,
    invalidateQuery,
  };
}

export default useOptimisticUpdate;
