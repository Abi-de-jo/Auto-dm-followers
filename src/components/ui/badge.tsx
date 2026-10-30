import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#E8F7F0] text-[#059669] hover:bg-[#D1FAE5]",
        secondary:
          "border-white/10 bg-white/[0.04] text-[#B8B1C0]",
        destructive:
          "border-rose-500/30 bg-rose-500/10 text-rose-300",
        outline: "border-white/10 text-[#F4EFF6]",
        success:
          "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
        warning:
          "border-amber-400/30 bg-amber-400/10 text-amber-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
