import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-primary bg-primary text-on-primary hover:bg-primary-strong focus-visible:outline-primary disabled:border-outline-variant disabled:bg-surface-container-high disabled:text-on-surface-variant",
  secondary:
    "border-outline-variant bg-surface-container-lowest text-on-surface hover:border-primary hover:text-primary focus-visible:outline-primary disabled:text-on-surface-variant",
  ghost:
    "border-transparent bg-transparent text-on-surface-variant hover:bg-surface-container hover:text-on-surface focus-visible:outline-primary disabled:text-outline",
  danger:
    "border-danger-soft bg-danger-soft text-danger hover:border-danger hover:bg-danger hover:text-on-primary focus-visible:outline-danger disabled:border-outline-variant disabled:bg-surface-container disabled:text-outline",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  icon: "size-9 p-0",
};

export function Button({
  className = "",
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      type={type}
      className={[
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-md border font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
      {...props}
    />
  );
}
