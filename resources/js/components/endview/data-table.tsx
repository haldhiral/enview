import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { EmptyState } from '@/components/endview/empty-state';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type DataTableColumn<T> = {
    key: string;
    header: ReactNode;
    className?: string;
    sortable?: boolean;
    render: (row: T) => ReactNode;
};

export function DataTable<T>({
    rows,
    columns,
    getRowKey,
    emptyTitle,
    sortBy,
    sortDirection,
    onSort,
}: {
    rows: T[];
    columns: DataTableColumn<T>[];
    getRowKey: (row: T) => string | number;
    emptyTitle?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    onSort?: (key: string) => void;
}) {
    if (rows.length === 0) {
        return <EmptyState title={emptyTitle} />;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
                <thead>
                    <tr className="border-b bg-muted/40 text-xs text-muted-foreground uppercase">
                        {columns.map((column) => {
                            const sorted = sortBy === column.key;

                            return (
                                <th
                                    key={column.key}
                                    className={cn(
                                        'px-3 py-2 font-semibold',
                                        column.className,
                                    )}
                                >
                                    {column.sortable && onSort ? (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="-ml-2 h-7 px-2 text-xs uppercase"
                                            onClick={() => onSort(column.key)}
                                        >
                                            {column.header}
                                            {sorted &&
                                                sortDirection === 'asc' && (
                                                    <ArrowUp className="size-3.5" />
                                                )}
                                            {sorted &&
                                                sortDirection === 'desc' && (
                                                    <ArrowDown className="size-3.5" />
                                                )}
                                            {!sorted && (
                                                <ArrowUpDown className="size-3.5" />
                                            )}
                                        </Button>
                                    ) : (
                                        column.header
                                    )}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr
                            key={getRowKey(row)}
                            className="border-b last:border-0 hover:bg-muted/30"
                        >
                            {columns.map((column) => (
                                <td
                                    key={column.key}
                                    className={cn(
                                        'px-3 py-3 align-middle',
                                        column.className,
                                    )}
                                >
                                    {column.render(row)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
