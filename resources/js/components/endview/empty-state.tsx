import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

export function EmptyState({
    title = 'No records found',
    description,
    icon: Icon = Inbox,
}: {
    title?: string;
    description?: string;
    icon?: LucideIcon;
}) {
    return (
        <div className="flex min-h-32 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 p-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-muted to-muted/50 ring-1 ring-inset ring-border/60">
                <Icon className="size-5 text-muted-foreground" />
            </div>
            <p className="mt-3 text-sm font-semibold text-foreground">{title}</p>
            {description && (
                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                    {description}
                </p>
            )}
        </div>
    );
}
