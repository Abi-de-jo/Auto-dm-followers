import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-[#059669] to-[#047857] text-white font-semibold border border-[#10B981]/30 shadow-md shadow-[#059669]/20 hover:from-[#10B981] hover:to-[#059669]",
        secondary:
          "bg-[#F4FBF7] border border-[#D5EAE0] text-[#11271D] hover:bg-white hover:border-[#059669]/40",
        outline:
          "border border-[#D5EAE0] bg-transparent text-[#11271D] hover:bg-[#E8F7F0] hover:border-[#059669]/40",
        destructive:
          "bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20",
        ghost: "hover:bg-[#E8F7F0] text-[#3B5D4D] hover:text-[#059669]",
        link: "text-[#059669] underline-offset-4 hover:underline",
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
