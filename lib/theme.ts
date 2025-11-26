// lib/theme.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Common styles for buttons
export const buttonVariants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-glow/50 transition-all duration-300",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-all duration-300",
  outline: "border border-input bg-transparent hover:bg-accent/10 transition-all duration-300",
  ghost: "hover:bg-accent/10 hover:text-accent-foreground transition-all duration-300",
  link: "text-primary underline-offset-4 hover:underline",
  gradient: "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-all duration-300 shadow-glow hover:shadow-glow/50",
}

// Card styles
export const cardStyles = {
  base: "rounded-xl border bg-card/80 backdrop-blur-sm shadow-card transition-all duration-300 hover:shadow-glow/30",
  header: "flex flex-col space-y-1.5 p-6 pb-2",
  title: "text-2xl font-semibold leading-none tracking-tight",
  description: "text-sm text-muted-foreground",
  content: "p-6 pt-0",
  footer: "flex items-center p-6 pt-0",
}

// Input styles
export const inputStyles = {
  base: "flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
}

// Typography styles
export const typography = {
  h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-balance",
  h2: "scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 text-balance",
  h3: "scroll-m-20 text-2xl font-semibold tracking-tight text-balance",
  h4: "scroll-m-20 text-xl font-semibold tracking-tight text-balance",
  p: "leading-7 [&:not(:first-child)]:mt-6 text-pretty",
  lead: "text-xl text-muted-foreground text-pretty",
  large: "text-lg font-semibold text-pretty",
  small: "text-sm font-medium leading-none",
  muted: "text-sm text-muted-foreground text-pretty",
}

// Animation utilities
export const animations = {
  fadeIn: "animate-fade-in opacity-0 [animation-fill-mode:forwards]",
  slideUp: "animate-slide-up opacity-0 [animation-fill-mode:forwards]",
  slideIn: "animate-slide-in opacity-0 [animation-fill-mode:forwards]",
  slideOut: "animate-slide-out opacity-100 [animation-fill-mode:forwards]",
}

// Common layout utilities
export const layout = {
  container: "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
  section: "py-12 md:py-24 lg:py-32",
  page: "min-h-[calc(100vh-4rem)] py-8 md:py-12",
  grid: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
}

export const theme = {
  button: buttonVariants,
  card: cardStyles,
  input: inputStyles,
  typography,
  animations,
  layout,
  cn,
}

export default theme
