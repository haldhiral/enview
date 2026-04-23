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
        <section className="rounded-xl border bg-card/95 shadow-sm">
            <div className="flex flex-col gap-2 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-base font-semibold tracking-normal">
                        {title}
                    </h2>
                    {description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
                {action}
            </div>
            <div className="p-5">{children}</div>
        </section>
    );
}
