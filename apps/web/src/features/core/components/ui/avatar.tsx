import { cn } from "@/features/core/utils/cn";

interface AvatarProps {
  name: string;
  src?: string;
  className?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({ name, src, className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("h-8 w-8 rounded-full object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full bg-brand-muted text-xs font-semibold text-brand-foreground",
        className,
      )}
    >
      {getInitials(name)}
    </div>
  );
}
