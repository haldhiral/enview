import { Link, usePage } from '@inertiajs/react';
import { Activity, MonitorCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

export function AppHeader({ breadcrumbs = [] }: Props) {
    const { auth } = usePage().props;
    const getInitials = useInitials();
    const currentSection = breadcrumbs.at(-1)?.title ?? 'Dashboard';

    return (
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <Link
                    href={dashboard()}
                    prefetch
                    className="flex min-w-0 items-center gap-3"
                >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-foreground text-background shadow-sm">
                        <MonitorCheck className="size-5" />
                    </span>
                    <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold leading-tight">
                            EndView
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                            Endpoint Monitoring Dashboard
                        </span>
                    </span>
                </Link>

                <div className="ml-auto flex items-center gap-3">
                    <div className="hidden items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-xs sm:flex">
                        <Activity className="size-3.5 text-emerald-500" />
                        {currentSection}
                    </div>

                    {auth.user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="size-10 rounded-full p-1"
                                >
                                    <Avatar className="size-8 overflow-hidden rounded-full">
                                        <AvatarImage
                                            src={auth.user.avatar}
                                            alt={auth.user.name}
                                        />
                                        <AvatarFallback className="rounded-lg bg-muted text-foreground">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </header>
    );
}
