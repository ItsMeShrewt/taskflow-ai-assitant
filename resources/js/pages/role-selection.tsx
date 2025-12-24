import { Head, router } from '@inertiajs/react';
import { Users, UserCog, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function RoleSelection() {
    const selectRole = (role: 'pm' | 'member') => {
        router.post('/role-selection', { role });
    };
    
    const handleBack = () => {
        // Delete the account and logout
        router.delete('/role-selection/cancel', {
            onSuccess: () => {
                router.visit('/');
            }
        });
    };

    return (
        <>
            <Head title="Select Your Role" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
                <div className="w-full max-w-4xl">
                    {/* Back Button - Top Left */}
                    <div className="mb-6">
                        <Button 
                            variant="outline" 
                            onClick={handleBack}
                            className="border-gray-300 bg-white/80 hover:bg-white text-gray-700 dark:text-gray-900"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            <span>Back to Welcome</span>
                        </Button>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to TaskFlow!</h1>
                        <p className="text-lg text-gray-600">Choose your role to get started</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Project Manager Card */}
                        <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-500">
                            <CardHeader className="text-center">
                                <div className="mx-auto mb-4 w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                                    <UserCog className="w-10 h-10 text-blue-600" />
                                </div>
                                <CardTitle className="text-2xl">Project Manager</CardTitle>
                                <CardDescription className="text-base">
                                    Lead your team and manage projects
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start">
                                        <span className="mr-2 text-blue-500">✓</span>
                                        Create and manage your team
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2 text-blue-500">✓</span>
                                        Assign tasks to team members
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2 text-blue-500">✓</span>
                                        Track project progress
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2 text-blue-500">✓</span>
                                        Approve team member requests
                                    </li>
                                </ul>
                                <Button 
                                    onClick={() => selectRole('pm')}
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                    size="lg"
                                >
                                    I'm a Project Manager
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Team Member Card */}
                        <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-500">
                            <CardHeader className="text-center">
                                <div className="mx-auto mb-4 w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                                    <Users className="w-10 h-10 text-purple-600" />
                                </div>
                                <CardTitle className="text-2xl">Team Member</CardTitle>
                                <CardDescription className="text-base">
                                    Join a team and collaborate on tasks
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start">
                                        <span className="mr-2 text-purple-500">✓</span>
                                        Join an existing team
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2 text-purple-500">✓</span>
                                        Receive and complete tasks
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2 text-purple-500">✓</span>
                                        Collaborate with teammates
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2 text-purple-500">✓</span>
                                        Track your task progress
                                    </li>
                                </ul>
                                <Button 
                                    onClick={() => selectRole('member')}
                                    className="w-full bg-purple-600 hover:bg-purple-700"
                                    size="lg"
                                >
                                    I'm a Team Member
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
