import { cn } from '@/lib/utils';

export function MiniBarChart({
    points,
    color = 'bg-teal-500',
}: {
    points: { label: string; value: number | null | undefined }[];
    color?: string;
}) {
    const values = points.map((point) => point.value ?? 0);
    const max = Math.max(1, ...values);

    return (
        <div className="flex h-28 items-end gap-1">
            {points.map((point, index) => {
                const height = Math.max(6, ((point.value ?? 0) / max) * 100);

                return (
                    <div
                        key={`${point.label}-${index}`}
                        className="flex min-w-4 flex-1 flex-col items-center gap-2"
                    >
                        <div className="flex h-24 w-full items-end rounded-sm bg-muted">
                            <div
                                className={cn('w-full rounded-sm', color)}
                                style={{ height: `${height}%` }}
                            />
                        </div>
                        <span className="max-w-14 truncate text-[10px] text-muted-foreground">
                            {point.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
