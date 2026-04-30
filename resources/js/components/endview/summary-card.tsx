import { Info } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type Tone = 'neutral' | 'green' | 'amber' | 'red' | 'sky';

const toneStyles: Record<
    Tone,
    {
        icon: string;
        accent: string;
        glow: string;
        value: string;
    }
> = {
    neutral: {
        icon: 'bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-700 dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-200',
        accent: 'from-zinc-400/30 via-zinc-400/0 to-zinc-400/0',
        glow: 'group-hover:shadow-zinc-200/70 dark:group-hover:shadow-zinc-900/40',
        value: 'text-foreground',
    },
    green: {
        icon: 'bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 dark:from-emerald-900/70 dark:to-emerald-950 dark:text-emerald-300',
        accent: 'from-emerald-500/60 via-emerald-500/0 to-emerald-500/0',
        glow: 'group-hover:shadow-emerald-200/60 dark:group-hover:shadow-emerald-900/30',
        value: 'text-emerald-700 dark:text-emerald-300',
    },
    amber: {
        icon: 'bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 dark:from-amber-900/70 dark:to-amber-950 dark:text-amber-300',
        accent: 'from-amber-500/60 via-amber-500/0 to-amber-500/0',
        glow: 'group-hover:shadow-amber-200/60 dark:group-hover:shadow-amber-900/30',
        value: 'text-amber-700 dark:text-amber-300',
    },
    red: {
        icon: 'bg-gradient-to-br from-red-100 to-red-200 text-red-700 dark:from-red-900/70 dark:to-red-950 dark:text-red-300',
        accent: 'from-red-500/60 via-red-500/0 to-red-500/0',
        glow: 'group-hover:shadow-red-200/60 dark:group-hover:shadow-red-900/30',
        value: 'text-red-700 dark:text-red-300',
    },
    sky: {
        icon: 'bg-gradient-to-br from-sky-100 to-sky-200 text-sky-700 dark:from-sky-900/70 dark:to-sky-950 dark:text-sky-300',
        accent: 'from-sky-500/60 via-sky-500/0 to-sky-500/0',
        glow: 'group-hover:shadow-sky-200/60 dark:group-hover:shadow-sky-900/30',
        value: 'text-sky-700 dark:text-sky-300',
    },
};

export function SummaryCard({
    title,
    value,
    icon: Icon,
    tone = 'neutral',
    hint,
    info,
}: {
    title: string;
    value: number | string;
    icon: LucideIcon;
    tone?: Tone;
    hint?: string;
    info?: string;
}) {
    const styles = toneStyles[tone];

    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-xl border bg-card/95 p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md',
                styles.glow,
            )}
        >
            <div
                className={cn(
                    'pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r',
                    styles.accent,
                )}
                aria-hidden="true"
            />

            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            {title}
                        </p>
                        {info && (
                            <TooltipProvider delayDuration={150}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            type="button"
                                            aria-label={`About ${title}`}
                                            className="flex size-4 items-center justify-center rounded-full text-muted-foreground/60 transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                                        >
                                            <Info className="size-3" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="max-w-[16rem] leading-relaxed">
                                        {info}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                    <p
                        className={cn(
                            'mt-3 text-3xl font-semibold tabular-nums tracking-tight',
                            styles.value,
                        )}
                    >
                        {value}
                    </p>
                    {hint && (
                        <p className="mt-1 text-xs text-muted-foreground">
                            {hint}
                        </p>
                    )}
                </div>
                <div
                    className={cn(
                        'flex size-11 shrink-0 items-center justify-center rounded-xl shadow-xs ring-1 ring-inset ring-white/40 transition group-hover:scale-105 dark:ring-white/5',
                        styles.icon,
                    )}
                >
                    <Icon className="size-5" />
                </div>
            </div>
        </div>
    );
}
