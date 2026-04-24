import { clsx } from 'clsx';

export function formatDateTime(value: string | null | undefined): string {
    if (!value) {
        return 'Never';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

export function formatRelative(value: string | null | undefined): string {
    if (!value) {
        return 'Never';
    }

    const date = new Date(value);
    const diffSeconds = Math.max(
        0,
        Math.floor((Date.now() - date.getTime()) / 1000),
    );

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    if (diffSeconds < 60) {
        return 'just now';
    }

    const diffMinutes = Math.floor(diffSeconds / 60);

    if (diffMinutes < 60) {
        return `${diffMinutes}m ago`;
    }

    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours < 24) {
        return `${diffHours}h ago`;
    }

    return `${Math.floor(diffHours / 24)}d ago`;
}

export function formatPercent(value: number | null | undefined): string {
    if (value === null || value === undefined) {
        return 'n/a';
    }

    return `${Math.round(value)}%`;
}

export function formatGb(value: number | null | undefined): string {
    if (value === null || value === undefined) {
        return 'n/a';
    }

    return `${Number(value).toLocaleString(undefined, { maximumFractionDigits: 1 })} GB`;
}

export function formatMb(value: number | null | undefined): string {
    if (value === null || value === undefined) {
        return 'n/a';
    }

    if (value >= 1024) {
        return `${(value / 1024).toLocaleString(undefined, { maximumFractionDigits: 1 })} GB`;
    }

    return `${value.toLocaleString()} MB`;
}

type QueryParam = string | number | boolean | null | undefined;

export function cleanParams(
    params: Record<string, QueryParam>,
): Record<string, string | number | boolean> {
    return Object.fromEntries(
        Object.entries(params).filter(
            ([, value]) =>
                value !== '' && value !== null && value !== undefined,
        ),
    ) as Record<string, string | number | boolean>;
}

export function statusClass(status: string | null | undefined): string {
    return clsx({
        'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300':
            status === 'ONLINE',
        'border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300':
            status === 'OFFLINE',
        'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300':
            status === 'WARNING' || status === 'ACK',
        'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300':
            status === 'CRITICAL' || status === 'OPEN',
        'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300':
            status === 'RESOLVED',
        'border-border bg-muted text-muted-foreground':
            !status ||
            ![
                'ONLINE',
                'OFFLINE',
                'WARNING',
                'CRITICAL',
                'OPEN',
                'ACK',
                'RESOLVED',
            ].includes(status),
    });
}

export function statusDotClass(status: string | null | undefined): string {
    return clsx({
        'bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.18)]':
            status === 'ONLINE',
        'bg-zinc-400': status === 'OFFLINE',
        'bg-amber-500 shadow-[0_0_0_3px_rgba(245,158,11,0.18)]':
            status === 'WARNING' || status === 'ACK',
        'bg-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.18)]':
            status === 'CRITICAL' || status === 'OPEN',
        'bg-sky-500': status === 'RESOLVED',
        'bg-muted-foreground':
            !status ||
            ![
                'ONLINE',
                'OFFLINE',
                'WARNING',
                'CRITICAL',
                'OPEN',
                'ACK',
                'RESOLVED',
            ].includes(status),
    });
}

export function statusBarClass(status: string | null | undefined): string {
    return clsx({
        'bg-gradient-to-r from-emerald-400 to-emerald-500': status === 'ONLINE',
        'bg-gradient-to-r from-zinc-300 to-zinc-400 dark:from-zinc-600 dark:to-zinc-500':
            status === 'OFFLINE',
        'bg-gradient-to-r from-amber-400 to-amber-500':
            status === 'WARNING' || status === 'ACK',
        'bg-gradient-to-r from-red-400 to-red-500':
            status === 'CRITICAL' || status === 'OPEN',
        'bg-gradient-to-r from-sky-400 to-sky-500': status === 'RESOLVED',
        'bg-gradient-to-r from-zinc-300 to-zinc-400':
            !status ||
            ![
                'ONLINE',
                'OFFLINE',
                'WARNING',
                'CRITICAL',
                'OPEN',
                'ACK',
                'RESOLVED',
            ].includes(status),
    });
}

export function severityClass(severity: string | null | undefined): string {
    return clsx({
        'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300':
            severity === 'INFO',
        'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300':
            severity === 'WARNING',
        'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300':
            severity === 'CRITICAL',
        'border-border bg-muted text-muted-foreground':
            !severity || !['INFO', 'WARNING', 'CRITICAL'].includes(severity),
    });
}

export function severityAccentClass(
    severity: string | null | undefined,
): string {
    return clsx({
        'border-l-sky-500': severity === 'INFO',
        'border-l-amber-500': severity === 'WARNING',
        'border-l-red-500': severity === 'CRITICAL',
        'border-l-border':
            !severity || !['INFO', 'WARNING', 'CRITICAL'].includes(severity),
    });
}

export function scoreClass(score: number | null | undefined): string {
    if (score === null || score === undefined) {
        return 'bg-muted';
    }

    if (score >= 85) {
        return 'bg-gradient-to-r from-emerald-400 to-emerald-500';
    }

    if (score >= 65) {
        return 'bg-gradient-to-r from-amber-400 to-amber-500';
    }

    return 'bg-gradient-to-r from-red-400 to-red-500';
}
