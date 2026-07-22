import { ReactNode } from "react";
import type { Virtualizer } from "@tanstack/react-virtual";

interface VirtualListProps<T> {
  parentRef: React.RefObject<HTMLDivElement | null>;
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
  items: T[];
  renderRow: (item: T, index: number) => ReactNode;
}

export function VirtualList<T>({
  parentRef,
  rowVirtualizer,
  items,
  renderRow,
}: VirtualListProps<T>) {
  return (
    <div
      ref={parentRef}
      style={{ height: "calc(100vh - 170px)", overflowY: "auto" }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((vRow) => {
          const item = items[vRow.index];
          if (!item) return null;
          return (
            <div
              key={vRow.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${vRow.size}px`,
                transform: `translateY(${vRow.start}px)`,
              }}
            >
              {renderRow(item, vRow.index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
