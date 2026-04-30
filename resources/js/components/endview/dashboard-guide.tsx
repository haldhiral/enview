import {
    Activity,
    Bell,
    ChevronDown,
    Clock3,
    Compass,
    Cpu,
    LayoutDashboard,
    ListFilter,
    MonitorCheck,
    PieChart,
    X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState, useSyncExternalStore } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'endview.dashboard.guide.dismissed';

function subscribeStorage(callback: () => void) {
    if (typeof window === 'undefined') {
        return () => {};
    }

    const handler = (event: StorageEvent) => {
        if (event.key === STORAGE_KEY) {
            callback();
        }
    };

    window.addEventListener('storage', handler);

    return () => window.removeEventListener('storage', handler);
}

function getStoredDismissed() {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.localStorage.getItem(STORAGE_KEY) === '1';
}

function getServerDismissed() {
    return false;
}

type GuideStep = {
    icon: LucideIcon;
    title: string;
    description: string;
    accent: string;
};

const steps: GuideStep[] = [
    {
        icon: LayoutDashboard,
        title: 'Summary cards',
        description:
            'Top-line health of the fleet. Counts of online, offline, warning, and critical devices plus open alerts at a glance.',
        accent: 'text-sky-600 dark:text-sky-300 bg-sky-100/80 dark:bg-sky-950/50',
    },
    {
        icon: ListFilter,
        title: 'Device filters',
        description:
            'Narrow the device list by company, site, status, type, OS, or free-text search across hostname, IP, MAC, or operator.',
        accent: 'text-emerald-600 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/50',
    },
    {
        icon: MonitorCheck,
        title: 'Device monitor',
        description:
            'Live device list with status, health score, and resource utilization. Click any row to inspect full detail in a modal.',
        accent: 'text-violet-600 dark:text-violet-300 bg-violet-100/80 dark:bg-violet-950/50',
    },
    {
        icon: PieChart,
        title: 'Fleet status & metric trend',
        description:
            'Distribution of device statuses across the fleet alongside CPU, RAM, and storage utilization trends from recent snapshots.',
        accent: 'text-amber-600 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/50',
    },
    {
        icon: Bell,
        title: 'Alerts, check-ins, events',
        description:
            'The bottom row groups recent alerts, the latest endpoint heartbeats, and the event timeline so you can react fast.',
        accent: 'text-red-600 dark:text-red-300 bg-red-100/80 dark:bg-red-950/50',
    },
];

const tips: { icon: LucideIcon; label: string }[] = [
    { icon: Activity, label: 'Live indicator means data refreshes on demand — use Refresh to pull the newest snapshot.' },
    { icon: Cpu, label: 'Health score blends CPU, RAM, storage, and connectivity into a 0–100 score.' },
    { icon: Clock3, label: 'Relative timestamps (e.g. "3m ago") show how stale a record is at a glance.' },
];

export function DashboardGuide() {
    const storedDismissed = useSyncExternalStore(
        subscribeStorage,
        getStoredDismissed,
        getServerDismissed,
    );
    const [localDismissed, setLocalDismissed] = useState(false);
    const [expanded, setExpanded] = useState(true);

    if (storedDismissed || localDismissed) {
        return null;
    }

    const dismiss = () => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(STORAGE_KEY, '1');
        }

        setLocalDismissed(true);
    };

    return (
        <section
            aria-label="Dashboard guide"
            className="relative overflow-hidden rounded-2xl border bg-card/95 shadow-sm"
        >
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-sky-500 via-emerald-500 to-amber-500"
                aria-hidden="true"
            />

            <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
                <div className="flex items-start gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/15 to-emerald-500/15 ring-1 ring-inset ring-sky-500/20">
                        <Compass className="size-4 text-sky-700 dark:text-sky-300" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold tracking-tight text-foreground">
                            Welcome to your endpoint dashboard
                        </h2>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            A quick tour of every section so you know where to look first.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpanded((value) => !value)}
                        className="gap-1.5 text-xs font-medium text-muted-foreground"
                        aria-expanded={expanded}
                    >
                        <ChevronDown
                            className={cn(
                                'size-4 transition-transform duration-200',
                                expanded ? 'rotate-180' : 'rotate-0',
                            )}
                        />
                        {expanded ? 'Hide' : 'Show'}
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={dismiss}
                        aria-label="Dismiss dashboard guide"
                        className="size-8 text-muted-foreground hover:text-foreground"
                    >
                        <X className="size-4" />
                    </Button>
                </div>
            </div>

            {expanded && (
                <div className="border-t bg-muted/20 px-5 py-5">
                    <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                        {steps.map((step, index) => (
                            <li
                                key={step.title}
                                className="group relative flex flex-col gap-2 rounded-xl border bg-background p-4 shadow-xs transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className={cn(
                                            'flex size-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset ring-border/40',
                                            step.accent,
                                        )}
                                    >
                                        <step.icon className="size-4" />
                                    </span>
                                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                        Step {index + 1}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold tracking-tight text-foreground">
                                        {step.title}
                                    </p>
                                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                        {step.description}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ol>

                    <div className="mt-4 grid gap-2 rounded-xl border border-dashed bg-background/60 p-4 sm:grid-cols-3">
                        {tips.map((tip) => (
                            <div
                                key={tip.label}
                                className="flex items-start gap-2 text-xs text-muted-foreground"
                            >
                                <tip.icon className="mt-0.5 size-3.5 shrink-0 text-sky-600 dark:text-sky-300" />
                                <span>{tip.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
