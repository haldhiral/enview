import { ShieldCheck } from 'lucide-react';

export function DashboardFooter() {
    return (
        <footer className="mt-2 overflow-hidden rounded-2xl border bg-card/80 shadow-xs">
            <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2.5">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500/15 to-emerald-500/15 ring-1 ring-inset ring-sky-500/20">
                        <ShieldCheck className="size-3.5 text-sky-700 dark:text-sky-300" />
                    </span>
                    <div className="leading-tight">
                        <p className="text-xs font-semibold tracking-tight text-foreground">
                            EnView
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                            End Point Service &ndash; Technical Development
                        </p>
                    </div>
                </div>
                <p className="text-[11px] text-muted-foreground sm:text-right">
                    Copyright &copy; 2026 Intikom Berlian Mustika. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
