"use client";

import type { LucideIcon } from "lucide-react";
import { ListEmptyState } from "@/components/shared/list-empty-state";
import { ListPagination } from "@/components/shared/list-pagination";
import type { PaginationMeta } from "@/server/pagination";

type EntityListLayoutProps = {
  filterBar?: React.ReactNode;
  isEmpty: boolean;
  emptyState: {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel: string;
  };
  onCreate: () => void;
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  children: React.ReactNode;
};

export function EntityListLayout({
  filterBar,
  isEmpty,
  emptyState,
  onCreate,
  pagination,
  onPageChange,
  children,
}: EntityListLayoutProps) {
  return (
    <div className="flex flex-col gap-6">
      {filterBar}
      {isEmpty ? (
        <ListEmptyState
          icon={emptyState.icon}
          title={emptyState.title}
          description={emptyState.description}
          actionLabel={emptyState.actionLabel}
          onAction={onCreate}
        />
      ) : (
        children
      )}
      <ListPagination
        page={pagination.page}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onPageChange={onPageChange}
      />
    </div>
  );
}
