import type { ReactNode } from 'react';

export function KeyValue({
    label,
    value,
}: {
    label: string;
    value: ReactNode;
}) {
    return (
        <div className="rounded-md border bg-background px-3 py-2">
            <dt className="text-xs font-medium text-muted-foreground">
                {label}
            </dt>
            <dd className="mt-1 text-sm font-medium break-words text-foreground">
                {value || 'n/a'}
            </dd>
        </div>
    );
}
