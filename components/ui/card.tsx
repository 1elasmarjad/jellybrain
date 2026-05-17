export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={[
        "rounded-lg border border-outline-variant bg-surface-container-lowest shadow-[0_16px_40px_rgba(37,99,235,0.08)]",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}
