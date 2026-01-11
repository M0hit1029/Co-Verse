import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ff88] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e0d] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#00ff88] to-[#00cc77] text-black border border-[#00ff88]/50 shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:shadow-[0_0_30px_rgba(0,255,136,0.5)] hover:from-[#00ffaa] hover:to-[#00ff88]",
        destructive:
          "bg-gradient-to-r from-[#ff4444] to-[#cc0000] text-white border border-[#ff0000]/50 shadow-[0_0_15px_rgba(255,68,68,0.3)] hover:shadow-[0_0_25px_rgba(255,68,68,0.5)]",
        outline:
          "border border-[#00ff88]/40 bg-[#0f1716]/60 backdrop-blur-sm text-[#00ff88] shadow-sm hover:bg-[#141d1b] hover:border-[#00ff88]/60 hover:shadow-[0_0_15px_rgba(0,255,136,0.2)]",
        secondary:
          "bg-[#141d1b] text-[#00ff88] border border-[#00ff88]/30 shadow-sm hover:bg-[#1a2624] hover:border-[#00ff88]/50",
        ghost: "hover:bg-[#141d1b]/60 text-[#00ff88] hover:text-[#00ffaa]",
        link: "text-[#00ff88] underline-offset-4 hover:underline hover:text-[#00ffaa]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
