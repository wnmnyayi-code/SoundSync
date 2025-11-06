// components/ui/button.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "px-4 py-2 rounded-lg font-medium transition",
          variant === 'default' && "bg-primary-600 text-white hover:bg-primary-700",
          variant === 'outline' && "border border-primary-600 text-primary-400 hover:bg-primary-600 hover:text-white",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }