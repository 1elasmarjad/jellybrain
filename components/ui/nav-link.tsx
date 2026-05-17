"use client";

import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes } from "react";

type NavLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    active?: boolean;
  };

export function NavLink({
  active = false,
  className = "",
  children,
  ...props
}: NavLinkProps) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={[
        "group flex min-h-14 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        active
          ? "border-transparent bg-surface-container-low text-primary"
          : "border-transparent text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </Link>
  );
}
