import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SummaryCard({
    title,
    value,
    icon: Icon,
    tone = 'neutral',
}: {
    title: string;
    value: number | string;
    icon: LucideIcon;
    tone?: 'neutral' | 'green' | 'amber' | 'red' | 'sky';
}) {
    const toneClass = {
        neutral:
            'bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200',
        green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
        amber: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
        red: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
        sky: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
    }[tone];

    return (
        <div className="rounded-xl border bg-card/95 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        {title}
                    </p>
                    <p className="mt-3 text-3xl font-semibold tracking-normal text-foreground">
                        {value}
                    </p>
                </div>
                <div
                    className={cn(
                        'flex size-10 items-center justify-center rounded-lg shadow-xs',
                        toneClass,
                    )}
                >
                    <Icon className="size-5" />
                </div>
            </div>
        </div>
    );
}
