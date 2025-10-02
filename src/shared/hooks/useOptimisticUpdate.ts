import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

interface UseOptimisticUpdateOptions<T> {
  queryKey: (string | number | boolean)[];
  updateFn: (oldData: T | undefined, newData: Partial<T>) => T;
  rollbackFn?: (oldData: T | undefined) => T | undefined;
}

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
