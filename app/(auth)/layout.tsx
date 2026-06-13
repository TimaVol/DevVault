import { cn } from "@/utils/cn";

export default function AuthLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 py-12",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-primary/5 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-0 right-0 size-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]"
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}
