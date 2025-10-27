export function DocularLogo({
  className = "flex items-center",
}: {
  className?: string;
}) {
  return (
    <div className={className} aria-label="DocularAI - Inicio">
      <span className="text-2xl font-medium font-sans text-primary">
        Docular
      </span>
      <span className="text-2xl italic  font-bold font-sans text-primary">
        AI
      </span>
    </div>
  );
}
