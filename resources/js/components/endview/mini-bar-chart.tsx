import { cn } from '@/lib/utils';

const gradientFor: Record<string, string> = {
    'bg-emerald-500':
        'bg-gradient-to-t from-emerald-500 via-emerald-400 to-emerald-300',
    'bg-amber-500':
        'bg-gradient-to-t from-amber-500 via-amber-400 to-amber-300',
    'bg-red-500': 'bg-gradient-to-t from-red-500 via-red-400 to-red-300',
    'bg-sky-500': 'bg-gradient-to-t from-sky-500 via-sky-400 to-sky-300',
    'bg-teal-500': 'bg-gradient-to-t from-teal-500 via-teal-400 to-teal-300',
};

export function MiniBarChart({
    points,
    color = 'bg-teal-500',
}: {
    points: { label: string; value: number | null | undefined }[];
    color?: string;
}) {
    const values = points.map((point) => point.value ?? 0);
    const max = Math.max(1, ...values);
    const barClass = gradientFor[color] ?? color;

    return (
        <div className="flex h-28 items-end gap-1.5">
            {points.map((point, index) => {
                const height = Math.max(6, ((point.value ?? 0) / max) * 100);
                const hasValue =
                    point.value !== null && point.value !== undefined;

                return (
                    <div
                        key={`${point.label}-${index}`}
                        className="group/bar flex min-w-3 flex-1 flex-col items-center gap-2"
                    >
                        <div className="relative flex h-24 w-full items-end overflow-hidden rounded-md bg-muted/60 ring-1 ring-inset ring-border/50">
                            {hasValue && (
                                <div
                                    className={cn(
                                        'w-full rounded-md transition-all duration-300 ease-out group-hover/bar:opacity-90',
                                        barClass,
                                    )}
                                    style={{ height: `${height}%` }}
                                />
                            )}
                        </div>
                        <span className="max-w-14 truncate text-[10px] font-medium text-muted-foreground">
                            {point.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
