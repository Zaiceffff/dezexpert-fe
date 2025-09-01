// src/components/ui/button.tsx — кнопка
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Старые варианты для обратной совместимости
        primary: "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm hover:from-sky-600 hover:to-blue-700",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        "mobile-sm": "h-8 px-3 py-1.5 text-xs",
        "mobile-lg": "h-12 px-6 py-3 text-base",
        "responsive": "h-8 sm:h-10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm",
      },
      mobile: {
        default: "",
        full: "w-full sm:w-auto",
        stacked: "flex-col space-y-1",
        inline: "flex-row space-x-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      mobile: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, mobile, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, mobile, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

// Адаптивная кнопка для мобильных устройств
const ResponsiveButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    mobileVariant?: 'full' | 'stacked' | 'inline';
    showTextOnMobile?: boolean;
    mobileText?: string;
    desktopText?: string;
  }
>(({ 
  className, 
  mobileVariant = 'full', 
  showTextOnMobile = true,
  mobileText,
  desktopText,
  children,
  ...props 
}, ref) => {
  const buttonContent = (
    <>
      {mobileText && desktopText ? (
        <>
          <span className="sm:hidden">{mobileText}</span>
          <span className="hidden sm:inline">{desktopText}</span>
        </>
      ) : (
        children
      )}
    </>
  );

  return (
    <Button
      ref={ref}
      className={cn(className)}
      mobile={mobileVariant}
      size="responsive"
      {...props}
    >
      {buttonContent}
    </Button>
  );
})
ResponsiveButton.displayName = "ResponsiveButton"

// Мобильная кнопка с автоматическим размером
const MobileButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    mobileSize?: 'small' | 'medium' | 'large';
    responsiveIcon?: boolean;
  }
>(({ 
  className, 
  mobileSize = 'medium',
  responsiveIcon = false,
  children,
  ...props 
}, ref) => {
  const sizeClasses = {
    small: "h-8 px-3 py-1.5 text-xs",
    medium: "h-10 px-4 py-2 text-sm",
    large: "h-12 px-6 py-3 text-base"
  };

  const iconClasses = responsiveIcon ? "w-8 h-8 sm:w-10 sm:h-10" : "";

  return (
    <Button
      ref={ref}
      className={cn(
        sizeClasses[mobileSize],
        iconClasses,
        "w-full sm:w-auto",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
})
MobileButton.displayName = "MobileButton"

export { Button, ResponsiveButton, MobileButton, buttonVariants }

