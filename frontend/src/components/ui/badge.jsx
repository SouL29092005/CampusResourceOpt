import React from "react";
import { cn } from "../../lib/utils";

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "border border-gray-200 bg-gray-100 text-gray-900",
    primary: "bg-blue-100 text-blue-900 border border-blue-200",
    secondary: "bg-gray-100 text-gray-900 border border-gray-200",
    destructive: "bg-red-100 text-red-900 border border-red-200",
    success: "bg-green-100 text-green-900 border border-green-200",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export default Badge;
