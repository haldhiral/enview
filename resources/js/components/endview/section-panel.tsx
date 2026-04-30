import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export function SectionPanel({
    title,
    description,
    action,
    icon: Icon,
    children,
}: {
    title: string;
    description?: string;
    action?: ReactNode;
    icon?: LucideIcon;
    children: ReactNode;
}) {
    return (
        <section className="overflow-hidden rounded-xl border bg-card/95 shadow-sm transition hover:shadow-md">
            <div className="flex flex-col gap-2 border-b bg-gradient-to-r from-muted/40 via-card to-card px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                    <span
                        aria-hidden="true"
                        className="mt-1 h-6 w-1 rounded-full bg-gradient-to-b from-sky-500 to-emerald-500"
                    />
                    <div>
                        <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight text-foreground">
                            {Icon && (
                                <Icon
                                    aria-hidden="true"
                                    className="size-4 text-sky-600 dark:text-sky-300"
                                />
                            )}
                            {title}
                        </h2>
                        {description && (
                            <p className="mt-1 text-sm text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
                {action}
            </div>
            <div className="p-5">{children}</div>
        </section>
    );
}
