import { formatPercent, scoreClass } from '@/lib/endview';
import { cn } from '@/lib/utils';

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
            <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                <span className="font-medium text-foreground">
                    {formatPercent(score)}
                </span>
                {!compact && (
                    <span className="text-muted-foreground">health</span>
                )}
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                    className={cn('h-full rounded-full', scoreClass(score))}
                    style={{ width: `${width}%` }}
                />
            </div>
        </div>
    );
}
