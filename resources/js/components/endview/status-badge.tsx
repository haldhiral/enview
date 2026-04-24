import { Badge } from '@/components/ui/badge';
import { statusClass, statusDotClass } from '@/lib/endview';
import { cn } from '@/lib/utils';

export function StatusBadge({
    status,
    className,
    withDot = true,
}: {
    status: string | null | undefined;
    className?: string;
    withDot?: boolean;
}) {
    return (
        <Badge
            variant="outline"
            className={cn(
                'gap-1.5 font-semibold tracking-wide',
                statusClass(status),
                className,
            )}
        >
            {withDot && (
                <span
                    aria-hidden="true"
                    className={cn('size-1.5 rounded-full', statusDotClass(status))}
                />
            )}
            {status ?? 'UNKNOWN'}
        </Badge>
    );
}
