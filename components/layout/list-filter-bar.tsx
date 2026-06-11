import { cn } from "@/utils/cn";

type ListFilterBarProps = {
  children: React.ReactNode;
  className?: string;
};

export function ListFilterBar({ children, className }: ListFilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
}
