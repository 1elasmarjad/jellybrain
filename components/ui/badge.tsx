type BadgeTone = "neutral" | "blue" | "green" | "amber" | "red";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-surface-container text-on-surface-variant",
  blue: "bg-blue-100 text-blue-800",
  green: "bg-emerald-100 text-emerald-800",
  amber: "bg-amber-100 text-amber-900",
  red: "bg-red-100 text-red-800",
};

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
}) {
  return (
    <span
      className={[
        "inline-flex h-6 items-center rounded-full px-2 text-xs font-bold",
        toneClasses[tone],
      ].join(" ")}
    >
      {children}
    </span>
  );
}
