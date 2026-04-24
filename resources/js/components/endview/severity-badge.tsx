import { Badge } from '@/components/ui/badge';
import { severityClass } from '@/lib/endview';
import { cn } from '@/lib/utils';

function dotClass(severity: string | null | undefined): string {
    if (severity === 'CRITICAL') {
        return 'bg-red-500';
    }

    if (severity === 'WARNING') {
        return 'bg-amber-500';
    }

    if (severity === 'INFO') {
        return 'bg-sky-500';
    }

    return 'bg-muted-foreground';
}

export function SeverityBadge({
    severity,
    className,
    withDot = true,
}: {
    severity: string | null | undefined;
    className?: string;
    withDot?: boolean;
}) {
    return (
        <Badge
            variant="outline"
            className={cn(
                'gap-1.5 font-semibold tracking-wide',
                severityClass(severity),
                className,
            )}
        >
            {withDot && (
                <span
                    aria-hidden="true"
                    className={cn('size-1.5 rounded-full', dotClass(severity))}
                />
            )}
            {severity ?? 'INFO'}
        </Badge>
    );
}
