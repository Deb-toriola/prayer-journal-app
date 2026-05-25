// Inline placeholder for facts only the client can supply (RC numbers, years
// of operation, exact title status). Per CLAUDE.md: must be VISIBLE so the
// client knows where to fill in, never silent.

interface Props {
  label: string;
  hint?: string;
  inline?: boolean;
}

export function FactPlaceholder({ label, hint, inline = false }: Props) {
  if (inline) {
    return (
      <span className="inline-flex items-baseline gap-1.5 rounded-sm border border-dashed border-gold/60 bg-gold/5 px-1.5 py-0.5 align-baseline font-mono text-[0.78em] text-gold-700">
        <span aria-hidden>◇</span>
        <span>{label}</span>
      </span>
    );
  }
  return (
    <div className="rounded-sm border border-dashed border-gold/60 bg-gold/5 px-4 py-3 text-small text-gold-700">
      <div className="flex items-baseline gap-2 font-mono">
        <span aria-hidden>◇</span>
        <span>{label}</span>
      </div>
      {hint && <p className="mt-1 text-micro text-ink-muted">{hint}</p>}
    </div>
  );
}
