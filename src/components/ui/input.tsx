import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-[#00ff88]/30 bg-[#0f1716]/60 backdrop-blur-sm text-[#00ff88] px-4 py-2 text-sm shadow-sm transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#00ff88]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ff88] focus-visible:border-[#00ff88]/60 focus-visible:shadow-[0_0_20px_rgba(0,255,136,0.2)] disabled:cursor-not-allowed disabled:opacity-50 hover:border-[#00ff88]/50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
