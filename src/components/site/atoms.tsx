import { cn } from "@/lib/utils";

export const btnBase =
  "inline-flex items-center justify-center border px-6 py-3 label-xs transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none";

export const btn = {
  primary: cn(btnBase, "border-foreground bg-foreground text-background hover:bg-transparent hover:text-foreground"),
  outline: cn(btnBase, "border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background"),
  quiet: cn(btnBase, "border-border bg-transparent text-foreground hover:border-foreground"),
};

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("label-xs text-muted-foreground", className)}>{children}</p>;
}

export function Rule({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-border", className)} />;
}
