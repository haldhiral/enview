import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, Clock3, Clock8, TimerReset } from 'lucide-react';
import { DataTable } from '@/components/endview/data-table';
import type { DataTableColumn } from '@/components/endview/data-table';
import { HealthScore } from '@/components/endview/health-score';
import { SectionPanel } from '@/components/endview/section-panel';
import { StatusBadge } from '@/components/endview/status-badge';
import { SummaryCard } from '@/components/endview/summary-card';
import { formatDateTime, formatRelative } from '@/lib/endview';
import type { CheckinItem, DeviceSummary } from '@/types';

type CheckinsIndexProps = {
    summary: {
        late_5m: number;
        late_15m: number;
        late_30m: number;
        late_1h: number;
    };
    latest_checkins: CheckinItem[];
    offline_candidates: DeviceSummary[];
};

export default function CheckinsIndex({
    summary,
    latest_checkins,
    offline_candidates,
}: CheckinsIndexProps) {
    const checkinColumns: DataTableColumn<CheckinItem>[] = [
        {
            key: 'checked_in_at',
            header: 'Checked in',
            render: (checkin) => (
                <div>
                    <div className="font-medium">
                        {formatRelative(checkin.checked_in_at)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {formatDateTime(checkin.checked_in_at)}
                    </div>
                </div>
            ),
        },
        {
            key: 'device',
            header: 'Device',
            render: (checkin) =>
                checkin.device ? (
                    <Link
                        href={`/devices/${checkin.device.id}`}
                        className="font-semibold hover:underline"
                    >
                        {checkin.device.hostname}
                    </Link>
                ) : (
                    'n/a'
                ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (checkin) => <StatusBadge status={checkin.status_code} />,
        },
        {
            key: 'user',
            header: 'User',
            render: (checkin) => checkin.current_user_name ?? 'n/a',
        },
        {
            key: 'ip',
            header: 'IP',
            render: (checkin) => checkin.ip_address ?? 'n/a',
        },
        {
            key: 'mac',
            header: 'MAC',
            render: (checkin) => checkin.mac_address ?? 'n/a',
        },
        {
            key: 'remarks',
            header: 'Remarks',
            render: (checkin) => checkin.remarks ?? 'n/a',
        },
    ];

    const candidateColumns: DataTableColumn<DeviceSummary>[] = [
        {
            key: 'device',
            header: 'Device',
            render: (device) => (
                <div>
                    <Link
                        href={`/devices/${device.id}`}
                        className="font-semibold hover:underline"
                    >
                        {device.hostname}
                    </Link>
                    <div className="text-xs text-muted-foreground">
                        {device.device_name}
                    </div>
                </div>
            ),
        },
        {
            key: 'company',
            header: 'Company',
            render: (device) => device.company ?? 'n/a',
        },
        {
            key: 'site',
            header: 'Site',
            render: (device) => device.site ?? 'n/a',
        },
        {
            key: 'status',
            header: 'Status',
            render: (device) => <StatusBadge status={device.status_code} />,
        },
        {
            key: 'health',
            header: 'Health',
            render: (device) => (
                <HealthScore score={device.health_score} compact />
            ),
        },
        {
            key: 'last_checkin',
            header: 'Last Check-in',
            render: (device) => (
                <div>
                    <div className="font-medium">
                        {formatRelative(device.last_checkin_at)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {formatDateTime(device.last_checkin_at)}
                    </div>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Check-ins" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-normal">
                        Check-in Monitoring
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Connectivity posture and heartbeat latency for monitored
                        endpoints.
                    </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard
                        title="Late > 5m"
                        value={summary.late_5m}
                        icon={Clock3}
                        tone="amber"
                    />
                    <SummaryCard
                        title="Late > 15m"
                        value={summary.late_15m}
                        icon={TimerReset}
                        tone="amber"
                    />
                    <SummaryCard
                        title="Late > 30m"
                        value={summary.late_30m}
                        icon={Clock8}
                        tone="red"
                    />
                    <SummaryCard
                        title="Late > 1h"
                        value={summary.late_1h}
                        icon={AlertTriangle}
                        tone="red"
                    />
                </div>

                <SectionPanel title="Latest Check-ins">
                    <DataTable
                        rows={latest_checkins}
                        columns={checkinColumns}
                        getRowKey={(checkin) => checkin.id}
                        emptyTitle="No check-ins yet"
                    />
                </SectionPanel>

                <SectionPanel title="Offline Candidates">
                    <DataTable
                        rows={offline_candidates}
                        columns={candidateColumns}
                        getRowKey={(device) => device.id}
                        emptyTitle="No offline candidates"
                    />
                </SectionPanel>
            </div>
        </>
    );
}

CheckinsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Check-ins',
            href: '/check-ins',
        },
    ],
};
