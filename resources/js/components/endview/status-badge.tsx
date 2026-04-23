import { Badge } from '@/components/ui/badge';
import { statusClass } from '@/lib/endview';
import { cn } from '@/lib/utils';

export function StatusBadge({
    status,
    className,
}: {
    status: string | null | undefined;
    className?: string;
}) {
    return (
        <Badge
            variant="outline"
            className={cn('font-semibold', statusClass(status), className)}
        >
            {status ?? 'UNKNOWN'}
        </Badge>
    );
}
