import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PaginationLink } from '@/types';

function labelFor(label: string) {
    if (label.includes('Previous')) {
        return <ChevronLeft className="size-4" />;
    }

    if (label.includes('Next')) {
        return <ChevronRight className="size-4" />;
    }

    return label.replace('&laquo;', '').replace('&raquo;', '').trim();
}

export function Pagination({
    links,
    from,
    to,
    total,
}: {
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
}) {
    if (links.length <= 3) {
        return null;
    }

    return (
        <div className="flex flex-col gap-3 border-t px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
                Showing {from ?? 0}-{to ?? 0} of {total}
            </span>
            <div className="flex flex-wrap gap-1">
                {links.map((link, index) => (
                    <Button
                        key={`${link.label}-${index}`}
                        asChild={Boolean(link.url)}
                        variant={link.active ? 'default' : 'outline'}
                        size="sm"
                        disabled={!link.url}
                        className="min-w-9"
                    >
                        {link.url ? (
                            <Link href={link.url}>{labelFor(link.label)}</Link>
                        ) : (
                            <span>{labelFor(link.label)}</span>
                        )}
                    </Button>
                ))}
            </div>
        </div>
    );
}
