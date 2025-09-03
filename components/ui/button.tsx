import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg";
}

const variantClasses = {
  default: "bg-yellow-400 text-purple-900 hover:bg-yellow-500",
  secondary: "bg-purple-700 text-white hover:bg-purple-800",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  outline:
    "border border-purple-700 text-purple-700 bg-transparent hover:bg-purple-50",
  ghost: "bg-white/10 text-white hover:bg-white/20",
  link: "underline text-purple-700 hover:text-purple-900 bg-transparent",
};

const sizeClasses = {
  default: "h-10 px-4 py-2 text-base",
  sm: "h-7 px-2 py-0 text-xs",
  lg: "h-12 px-6 py-3 text-lg",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
