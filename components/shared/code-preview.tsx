import { cn } from "@/utils/cn";

type CodePreviewProps = {
  content: string;
  className?: string;
};

export function CodePreview({ content, className }: CodePreviewProps) {
  return (
    <pre
      className={cn(
        "overflow-hidden rounded-md border border-border bg-[#0e0e0e] font-mono leading-relaxed text-muted-foreground",
        className,
      )}
    >
      {content}
    </pre>
  );
}
