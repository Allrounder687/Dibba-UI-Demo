import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#0A2240] text-white",
        blue: "border-[#2678FF]/25 bg-[#2678FF]/10 text-[#2678FF]",
        gold: "border-[#D5A84B]/35 bg-[#D5A84B]/15 text-[#b8892a]",
        goldDark: "border-[#D5A84B]/40 bg-[#D5A84B]/20 text-[#D5A84B]",
        success: "border-emerald-500/30 bg-emerald-500/15 text-emerald-700",
        successDark: "border-emerald-400/30 bg-emerald-500/20 text-emerald-300",
        outline: "border-border text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
