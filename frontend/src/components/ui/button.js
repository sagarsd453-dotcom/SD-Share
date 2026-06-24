import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Button = forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20",
    outline: "border border-zinc-700 bg-transparent hover:bg-zinc-800 text-zinc-100",
    ghost: "hover:bg-zinc-800 text-zinc-300 hover:text-zinc-50",
  };
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-12 rounded-md px-8 text-lg",
    icon: "h-10 w-10",
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-zinc-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button };
