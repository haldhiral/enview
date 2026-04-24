import { formatPercent, scoreClass } from '@/lib/endview';
import { cn } from '@/lib/utils';

function scoreTextClass(score: number | null | undefined) {
    if (score === null || score === undefined) {
        return 'text-muted-foreground';
    }

    if (score >= 85) {
        return 'text-emerald-600 dark:text-emerald-400';
    }

    if (score >= 65) {
        return 'text-amber-600 dark:text-amber-400';
    }

    return 'text-red-600 dark:text-red-400';
}

export function HealthScore({
    score,
    compact = false,
}: {
    score: number | null | undefined;
    compact?: boolean;
}) {
    const width = Math.max(0, Math.min(100, score ?? 0));

    return (
        <div className={cn('min-w-24', compact && 'min-w-16')}>
            <div className="mb-1.5 flex items-baseline justify-between gap-2">
                <span
                    className={cn(
                        'text-sm font-semibold tabular-nums',
                        scoreTextClass(score),
                    )}
                >
                    {formatPercent(score)}
                </span>
                {!compact && (
                    <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        health
                    </span>
                )}
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted ring-1 ring-inset ring-border/50">
                <div
                    className={cn(
                        'h-full rounded-full transition-all duration-500 ease-out',
                        scoreClass(score),
                    )}
                    style={{ width: `${width}%` }}
                />
            </div>
        </div>
    );
}
