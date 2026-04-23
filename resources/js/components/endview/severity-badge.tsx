import { Badge } from '@/components/ui/badge';
import { severityClass } from '@/lib/endview';
import { cn } from '@/lib/utils';

export function SeverityBadge({
    severity,
    className,
}: {
    severity: string | null | undefined;
    className?: string;
}) {
    return (
        <Badge
            variant="outline"
            className={cn('font-semibold', severityClass(severity), className)}
        >
            {severity ?? 'INFO'}
        </Badge>
    );
}
