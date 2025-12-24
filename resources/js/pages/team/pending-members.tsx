import { Head, router } from '@inertiajs/react';
import { CheckCircle, XCircle, Users } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAutoRefresh } from '@/hooks/use-auto-refresh';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

interface Props {
    pendingMembers: User[];
}

export default function PendingMembers({ pendingMembers }: Props) {
    const [processing, setProcessing] = useState<number | null>(null);

    // Auto-refresh to detect new pending members
    useAutoRefresh({
        endpoint: '/api/check-updates/pending-members',
        onlyProps: ['pendingMembers'],
        checkInterval: 3000,
    });

    const approve = (userId: number) => {
        setProcessing(userId);
        router.post(`/team/approve/${userId}`, {}, {
            preserveScroll: true,
            onFinish: () => setProcessing(null),
        });
    };

    const reject = (userId: number) => {
        setProcessing(userId);
        router.post(`/team/reject/${userId}`, {}, {
            preserveScroll: true,
            onFinish: () => setProcessing(null),
        });
    };

    const getRoleBadgeColor = (role: string) => {
        const colors: Record<string, string> = {
            'frontend_developer': 'bg-blue-100 text-blue-800',
            'backend_developer': 'bg-green-100 text-green-800',
            'technical_writer': 'bg-purple-100 text-purple-800',
            'system_analyst': 'bg-orange-100 text-orange-800',
        };
        return colors[role] || 'bg-gray-100 text-gray-800';
    };

    const formatRole = (role: string) => {
        return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout>
            <Head title="Pending Team Members" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">Pending Team Members</CardTitle>
                                    <CardDescription>
                                        Review and approve or reject member requests to join your team
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {pendingMembers.length === 0 ? (
                                <div className="text-center py-12">
                                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Requests</h3>
                                    <p className="text-gray-500">You don't have any pending member requests at the moment.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {pendingMembers.map((member) => (
                                        <div 
                                            key={member.id} 
                                            className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                                                        {member.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{member.name}</h4>
                                                        <p className="text-sm text-gray-500">{member.email}</p>
                                                    </div>
                                                </div>
                                                <div className="ml-15 flex items-center gap-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                                                        {formatRole(member.role)}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        Requested {formatDate(member.created_at)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                <Button
                                                    onClick={() => approve(member.id)}
                                                    className="bg-green-600 hover:bg-green-700"
                                                    size="sm"
                                                    disabled={processing === member.id}
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-1" />
                                                    {processing === member.id ? 'Approving...' : 'Approve'}
                                                </Button>
                                                <Button
                                                    onClick={() => reject(member.id)}
                                                    variant="destructive"
                                                    size="sm"
                                                    disabled={processing === member.id}
                                                >
                                                    <XCircle className="w-4 h-4 mr-1" />
                                                    {processing === member.id ? 'Rejecting...' : 'Reject'}
                                                    Reject
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
