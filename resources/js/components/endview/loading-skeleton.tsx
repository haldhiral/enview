import { Skeleton } from '@/components/ui/skeleton';

export function LoadingSkeleton({
    rows = 4,
    title = true,
}: {
    rows?: number;
    title?: boolean;
}) {
    return (
        <div className="space-y-3">
            {title && <Skeleton className="h-5 w-44" />}
            {Array.from({ length: rows }).map((_, index) => (
                <div
                    key={index}
                    className="grid gap-3 rounded-lg border bg-background p-3 sm:grid-cols-[1fr_8rem_8rem]"
                >
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            ))}
        </div>
    );
}
