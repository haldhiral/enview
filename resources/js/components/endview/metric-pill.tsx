import { formatPercent, scoreClass } from '@/lib/endview';
import { cn } from '@/lib/utils';

export function MetricPill({
    label,
    value,
    suffix,
    higherIsBetter = false,
}: {
    label: string;
    value: number | null | undefined;
    suffix?: string;
    higherIsBetter?: boolean;
}) {
    const width = Math.max(0, Math.min(100, value ?? 0));
    const toneScore = higherIsBetter ? width : 100 - width;

    return (
        <div className="rounded-lg border bg-card px-3 py-2">
            <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-medium text-muted-foreground">
                    {label}
                </span>
                <span className="font-semibold text-foreground">
                    {suffix ? (value ?? 'n/a') + suffix : formatPercent(value)}
                </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                    className={cn('h-full rounded-full', scoreClass(toneScore))}
                    style={{ width: `${width}%` }}
                />
            </div>
        </div>
    );
}
