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
            'bg-primary-600 text-white hover:bg-primary-700': variant === 'default',
            'border border-primary-600 text-primary-400 hover:bg-primary-600 hover:text-white': variant === 'outline',
            'hover:bg-primary-600/10': variant === 'ghost',
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