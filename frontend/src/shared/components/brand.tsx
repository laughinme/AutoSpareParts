import { cn } from "@/shared/lib/utils";

export function Brand({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={cn("brand", className)}>
      <svg className="brand-symbol" viewBox="0 0 36 36" aria-hidden="true">
        <rect width="36" height="36" rx="8" fill="currentColor" />
        <path fill="#171714" d="M7 25.5 16.2 10.5h5.2l-9.2 15zm9.5 0 9.2-15H29l-1.8 15h-4.6l.5-4.2-2.6 4.2z" />
      </svg>
      <span className="brand-name">
        Auto<span>Spare</span>
        {!compact && <small>Маркетплейс запчастей</small>}
      </span>
    </span>
  );
}
