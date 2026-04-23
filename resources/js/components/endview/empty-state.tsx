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
        <div className="flex min-h-32 flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
            <Icon className="size-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">{title}</p>
            {description && (
                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                    {description}
                </p>
            )}
        </div>
    );
}
