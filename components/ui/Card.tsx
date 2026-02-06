import { cn } from "@/lib/utils";
import { forwardRef, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined" | "flat";
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const cardVariants = {
  default: "bg-[var(--surface-1)] border border-[var(--border)] shadow-[var(--shadow-sm)]",
  elevated: "bg-[var(--surface-2)] border border-[var(--border)] shadow-[var(--shadow-md)]",
  outlined: "bg-[var(--surface-1)] border border-[var(--border-strong)]",
  flat: "bg-transparent",
};

const paddingStyles = {
  none: "",
  sm: "p-3 sm:p-4",
  md: "p-4 sm:p-6",
  lg: "p-6 sm:p-8",
};

/**
 * Consistent card component with variants and optional interactivity
 *
 * @example
 * // Default card
 * <Card>
 *   <h2>Title</h2>
 *   <p>Content</p>
 * </Card>
 *
 * @example
 * // Interactive card (for links/buttons)
 * <Card interactive className="cursor-pointer">
 *   <h2>Title</h2>
 * </Card>
 *
 * @example
 * // Elevated card with custom padding
 * <Card variant="elevated" padding="lg">
 *   <h2>Title</h2>
 * </Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", interactive = false, padding = "md", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants[variant],
          paddingStyles[padding],
          "rounded-xl",
          interactive && "hover:-translate-y-0.5 active:translate-y-0 transition-transform duration-150 cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex flex-col space-y-1.5", className)} {...props} />;
  }
);

CardHeader.displayName = "CardHeader";

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: "h1" | "h2" | "h3" | "h4";
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, level = "h3", children, ...props }, ref) => {
    const Tag = level;
    const sizeStyles = {
      h1: "text-3xl font-bold",
      h2: "text-2xl font-semibold",
      h3: "text-xl font-semibold",
      h4: "text-lg font-medium",
    };

    return (
      <Tag ref={ref} className={cn(sizeStyles[level], "text-[var(--text-1)]", className)} {...props}>
        {children}
      </Tag>
    );
  }
);

CardTitle.displayName = "CardTitle";

type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p ref={ref} className={cn("text-sm text-[var(--text-3)]", className)} {...props} />
    );
  }
);

CardDescription.displayName = "CardDescription";

type CardContentProps = HTMLAttributes<HTMLDivElement>;

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("pt-0", className)} {...props} />;
  }
);

CardContent.displayName = "CardContent";

type CardFooterProps = HTMLAttributes<HTMLDivElement>;

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex items-center pt-4", className)} {...props} />;
  }
);

CardFooter.displayName = "CardFooter";
