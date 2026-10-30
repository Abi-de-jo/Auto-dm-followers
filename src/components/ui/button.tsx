import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-[#8E2CCB] to-[#6A1C99] text-white font-semibold border border-[#A24BE0]/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_10px_28px_-12px_rgba(122,34,176,0.7)] hover:from-[#9B35DB] hover:to-[#7622A8]",
        secondary:
          "bg-[#0A080C] border border-white/[0.09] text-[#B8B1C0] hover:text-white hover:bg-[#7A22B0]/10 hover:border-[#A24BE0]/30",
        outline:
          "border border-white/[0.12] bg-transparent text-[#F4EFF6] hover:bg-[#7A22B0]/10 hover:border-[#A24BE0]/40",
        destructive:
          "bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20",
        ghost: "hover:bg-white/[0.05] text-[#B8B1C0] hover:text-[#F4EFF6]",
        link: "text-[#C084FC] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-[11px]",
        lg: "h-11 rounded-xl px-6 text-sm",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
