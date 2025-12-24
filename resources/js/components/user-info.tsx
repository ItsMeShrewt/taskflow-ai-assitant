import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

export function UserInfo({
    user,
    showEmail = false,
    showRole = false,
}: {
    user: User;
    showEmail?: boolean;
    showRole?: boolean;
}) {
    const getInitials = useInitials();

    const getRoleLabel = (role: User['role']) => {
        switch (role) {
            case 'superadmin':
            case 'project_manager':
                return 'Project Manager';
            case 'frontend_developer':
                return 'Frontend Developer';
            case 'backend_developer':
                return 'Backend Developer';
            case 'technical_writer':
                return 'Technical Writer';
            case 'system_analyst':
                return 'System Analyst';
            default:
                return 'Unknown';
        }
    };

    const isDeveloper = ['frontend_developer', 'backend_developer', 'technical_writer', 'system_analyst'].includes(user.role);

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left leading-tight">
                <span className="truncate text-xs font-medium">{user.name}</span>
                {showRole && (
                    <span className="truncate text-[10px] font-medium text-muted-foreground">
                        {getRoleLabel(user.role)}
                    </span>
                )}
                {showEmail && (
                    <span className="truncate text-[10px] text-muted-foreground">
                        {user.email}
                    </span>
                )}
            </div>
        </>
    );
}
