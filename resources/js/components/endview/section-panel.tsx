import type { ReactNode } from 'react';

export function SectionPanel({
    title,
    description,
    action,
    children,
}: {
    title: string;
    description?: string;
    action?: ReactNode;
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
                        <h2 className="text-base font-semibold tracking-tight text-foreground">
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
