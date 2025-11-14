// components/ui/button.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

import { Spinner } from '@/components/ui/spinner'
import type { ButtonProps } from '@/types'

export { type ButtonProps }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', isLoading, size = 'md', children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "relative px-4 py-2 rounded-lg font-medium transition disabled:opacity-70 disabled:cursor-not-allowed",
          {
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
            'border border-primary text-primary hover:bg-primary hover:text-primary-foreground': variant === 'outline',
            'hover:bg-primary/10': variant === 'ghost',
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
          },
          className
        )}
        disabled={isLoading}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Spinner size="sm" />
          </span>
        )}
        <span className={cn({ 'opacity-0': isLoading })}>
          {children}
        </span>
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }