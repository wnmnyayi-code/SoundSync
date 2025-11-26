import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { Spinner } from '@/components/ui/spinner'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  isLoading?: boolean
  asChild?: boolean
}

const ButtonContent = ({
  children,
  isLoading,
}: Pick<ButtonProps, "children" | "isLoading">) => (
  <>
    {isLoading ? (
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Spinner size="sm" />
      </span>
    ) : null}
    <span className={cn({ 'opacity-0': isLoading })}>{children}</span>
  </>
)

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', isLoading, size = 'md', asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(
          "relative inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition disabled:opacity-70 disabled:cursor-not-allowed",
          {
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
            'border border-primary text-primary hover:bg-primary hover:text-primary-foreground': variant === 'outline',
            'hover:bg-primary/10': variant === 'ghost',
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
            'h-10 w-10': size === 'icon',
          },
          className
        )}
        disabled={isLoading}
        ref={ref}
        {...props}
      >
        <ButtonContent isLoading={isLoading}>{children}</ButtonContent>
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button }