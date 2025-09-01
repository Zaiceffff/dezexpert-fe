// src/components/ui/input.tsx — текстовый инпут
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  mobile?: 'default' | 'full' | 'compact';
  responsive?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, mobile = 'default', responsive = false, ...props }, ref) => {
    const mobileClasses = {
      default: "",
      full: "w-full",
      compact: "w-full sm:w-auto"
    };

    const responsiveClasses = responsive ? "text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3" : "";

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-base",
          mobileClasses[mobile],
          responsiveClasses,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

// Адаптивный Input для мобильных устройств
const ResponsiveInput = React.forwardRef<
  HTMLInputElement,
  InputProps & {
    mobileSize?: 'small' | 'medium' | 'large';
    showLabelOnMobile?: boolean;
  }
>(({ 
  className, 
  mobileSize = 'medium',
  showLabelOnMobile = true,
  ...props 
}, ref) => {
  const sizeClasses = {
    small: "h-8 px-2 py-1 text-xs",
    medium: "h-10 px-3 py-2 text-sm",
    large: "h-12 px-4 py-3 text-base"
  };

  return (
    <Input
      ref={ref}
      className={cn(
        sizeClasses[mobileSize],
        "w-full",
        className
      )}
      responsive={true}
      {...props}
    />
  );
})
ResponsiveInput.displayName = "ResponsiveInput"

// Мобильный Input с автоматическим размером
const MobileInput = React.forwardRef<
  HTMLInputElement,
  InputProps & {
    autoResize?: boolean;
    mobilePadding?: 'compact' | 'normal' | 'spacious';
  }
>(({ 
  className, 
  autoResize = true,
  mobilePadding = 'normal',
  ...props 
}, ref) => {
  const paddingClasses = {
    compact: "px-2 sm:px-3 py-1.5 sm:py-2",
    normal: "px-3 sm:px-4 py-2 sm:py-3",
    spacious: "px-4 sm:px-6 py-3 sm:py-4"
  };

  return (
    <Input
      ref={ref}
      className={cn(
        "w-full",
        paddingClasses[mobilePadding],
        autoResize ? "text-sm sm:text-base" : "",
        className
      )}
      {...props}
    />
  );
})
MobileInput.displayName = "MobileInput"

export { Input, ResponsiveInput, MobileInput }

