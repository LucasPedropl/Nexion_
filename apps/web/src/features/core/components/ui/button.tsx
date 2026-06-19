import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/features/core/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-brand text-brand-foreground hover:bg-brand/90 shadow-sm",
        secondary:
          "bg-surface-elevated text-foreground border border-border hover:bg-border/40",
        ghost: "text-muted-foreground hover:bg-surface-elevated hover:text-foreground",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-surface-elevated",
        destructive:
          "bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20",
        link: "text-brand underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-6",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({
  className,
  variant,
  size,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { buttonVariants };
