import { useRef, useEffect, useCallback, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

interface UseInfiniteVirtualizerOptions<T> {
  items: T[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  estimateSize?: (index: number) => number;
  overscan?: number;
}

export function useInfiniteVirtualizer<T>({
  items,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  estimateSize = () => 50,
  overscan = 5,
}: UseInfiniteVirtualizerOptions<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const getScrollElement = useCallback(() => parentRef.current, []);
  const stableEstimateSize = useMemo(() => estimateSize, [estimateSize]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement,
    estimateSize: stableEstimateSize,
    overscan,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const lastVisibleIndex = virtualItems[virtualItems.length - 1]?.index ?? 0;

  useEffect(() => {
    if (
      hasNextPage &&
      !isFetchingNextPage &&
      lastVisibleIndex >= items.length - 6
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    isFetchingNextPage,
    lastVisibleIndex,
    items.length,
    fetchNextPage,
  ]);

  return { parentRef, rowVirtualizer, virtualItems };
}
