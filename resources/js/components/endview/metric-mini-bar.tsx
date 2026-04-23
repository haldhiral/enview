import { formatPercent, scoreClass } from '@/lib/endview';
import { cn } from '@/lib/utils';

export function MetricMiniBar({
    label,
    value,
    higherIsBetter = false,
    className,
}: {
    label: string;
    value: number | null | undefined;
    higherIsBetter?: boolean;
    className?: string;
}) {
    const width = Math.max(0, Math.min(100, value ?? 0));
    const toneScore = higherIsBetter ? width : 100 - width;

    return (
        <div className={cn('min-w-24', className)}>
            <div className="mb-1 flex items-center justify-between gap-2 text-[11px] font-medium">
                <span className="text-muted-foreground">{label}</span>
                <span className="text-foreground">{formatPercent(value)}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                    className={cn('h-full rounded-full', scoreClass(toneScore))}
                    style={{ width: `${width}%` }}
                />
            </div>
        </div>
    );
}
