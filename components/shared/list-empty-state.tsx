import type { LucideIcon } from "lucide-react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

type ListEmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  showActionIcon?: boolean;
};

export function ListEmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  onAction,
  showActionIcon = true,
}: ListEmptyStateProps) {
  const actionContent =
    action ??
    (actionLabel && onAction ? (
      <Button onClick={onAction}>
        {showActionIcon ? <Plus data-icon="inline-start" /> : null}
        {actionLabel}
      </Button>
    ) : null);

  return (
    <Empty>
      <EmptyHeader>
        {Icon ? (
          <EmptyMedia variant="icon">
            <Icon />
          </EmptyMedia>
        ) : null}
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {actionContent ? <EmptyContent>{actionContent}</EmptyContent> : null}
    </Empty>
  );
}
