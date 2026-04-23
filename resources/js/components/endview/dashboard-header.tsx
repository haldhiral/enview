import { Bell, Clock3, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/endview';

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
        <section className="rounded-xl border bg-card/95 px-5 py-5 shadow-sm sm:px-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                            EndView
                        </p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-foreground sm:text-[2rem]">
                            Endpoint Monitoring Dashboard
                        </h1>
                        <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">
                            A single monitoring surface for device health,
                            connectivity, alerts, and recent endpoint activity.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-xs">
                            <span className="size-2 rounded-full bg-emerald-500" />
                            {totalDevices} monitored devices
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-xs">
                            <Bell className="size-3.5 text-red-500" />
                            {openAlerts} open alerts
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:min-w-72 sm:flex-row sm:items-center sm:justify-end lg:flex-col lg:items-end">
                    <div className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm text-muted-foreground shadow-xs">
                        <Clock3 className="size-4" />
                        <span>Last updated {formatDateTime(lastUpdatedAt)}</span>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onRefresh}
                        disabled={refreshing}
                        className="sm:min-w-36"
                    >
                        <RefreshCw
                            className={refreshing ? 'size-4 animate-spin' : 'size-4'}
                        />
                        Refresh
                    </Button>
                </div>
            </div>
        </section>
    );
}
