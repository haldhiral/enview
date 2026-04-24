import { Activity, Bell, Clock3, RefreshCw, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDateTime, formatRelative } from '@/lib/endview';

export function DashboardHeader({
    totalDevices,
    openAlerts,
    lastUpdatedAt,
    refreshing = false,
    onRefresh,
}: {
    totalDevices: number;
    openAlerts: number;
    lastUpdatedAt: string | null;
    refreshing?: boolean;
    onRefresh: () => void;
}) {
    return (
        <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-sky-50 via-card to-emerald-50/60 shadow-sm dark:from-sky-950/40 dark:via-card dark:to-emerald-950/30">
            <div
                className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-sky-400/20 blur-3xl dark:bg-sky-400/10"
                aria-hidden="true"
            />
            <div
                className="pointer-events-none absolute -bottom-24 -left-16 size-60 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-400/10"
                aria-hidden="true"
            />

            <div className="relative flex flex-col gap-6 px-6 py-6 lg:flex-row lg:items-start lg:justify-between sm:px-8 sm:py-7">
                <div className="space-y-4">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/60 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700 shadow-xs backdrop-blur dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300">
                            <ShieldCheck className="size-3.5" />
                            EnView · Endpoint Visibility
                        </div>
                        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-[2.15rem]">
                            Endpoint Monitoring Dashboard
                        </h1>
                        <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">
                            A single monitoring surface for device health,
                            connectivity, alerts, and recent endpoint activity.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white/80 px-3 py-1.5 text-xs font-medium text-emerald-800 shadow-xs backdrop-blur dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
                            <span className="relative flex size-2">
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                            </span>
                            Live
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground shadow-xs backdrop-blur">
                            <Activity className="size-3.5 text-sky-600 dark:text-sky-400" />
                            <span className="font-semibold">{totalDevices}</span>
                            <span className="text-muted-foreground">monitored devices</span>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground shadow-xs backdrop-blur">
                            <Bell className="size-3.5 text-red-500" />
                            <span className="font-semibold">{openAlerts}</span>
                            <span className="text-muted-foreground">open alerts</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:min-w-72 sm:flex-row sm:items-center sm:justify-end lg:flex-col lg:items-end">
                    <div className="inline-flex flex-col items-start gap-0.5 rounded-xl border bg-background/80 px-4 py-2.5 text-sm shadow-xs backdrop-blur sm:items-end">
                        <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                            <Clock3 className="size-3.5" />
                            Last updated
                        </div>
                        <div className="text-sm font-semibold text-foreground">
                            {formatRelative(lastUpdatedAt)}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                            {formatDateTime(lastUpdatedAt)}
                        </div>
                    </div>
                    <Button
                        type="button"
                        onClick={onRefresh}
                        disabled={refreshing}
                        className="group gap-2 bg-foreground text-background shadow-sm transition hover:bg-foreground/90 sm:min-w-36"
                    >
                        <RefreshCw
                            className={
                                refreshing
                                    ? 'size-4 animate-spin'
                                    : 'size-4 transition group-hover:rotate-180'
                            }
                        />
                        {refreshing ? 'Refreshing' : 'Refresh'}
                    </Button>
                </div>
            </div>
        </section>
    );
}
