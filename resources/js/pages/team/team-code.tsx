import { Head, Link } from '@inertiajs/react';
import { Copy, Check, Users } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Team {
    id: number;
    name: string;
    code: string;
    photo: string | null;
}

interface Props {
    team: Team;
}

export default function TeamCode({ team }: Props) {
    const [copied, setCopied] = useState(false);

    const copyCode = () => {
        navigator.clipboard.writeText(team.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <Head title="Team Created Successfully" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                            <Check className="w-10 h-10 text-green-600" />
                        </div>
                        <CardTitle className="text-3xl">Team Created Successfully!</CardTitle>
                        <CardDescription className="text-base">
                            Your team "{team.name}" is ready. Share the code below with your team members.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Team Info */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden">
                                {team.photo ? (
                                    <img src={`/storage/${team.photo}`} alt={team.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Users className="w-8 h-8 text-white" />
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{team.name}</h3>
                                <p className="text-sm text-gray-500">Project Manager Team</p>
                            </div>
                        </div>

                        {/* Team Code Display */}
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                                Your Team Code
                            </label>
                            <div className="flex items-center justify-center gap-3">
                                <div className="bg-white px-6 py-4 rounded-lg border-2 border-blue-300">
                                    <code className="text-3xl font-mono font-bold text-blue-600 tracking-widest">
                                        {team.code}
                                    </code>
                                </div>
                                <Button
                                    onClick={copyCode}
                                    variant="outline"
                                    size="lg"
                                    className="border-blue-300 hover:bg-blue-50"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-5 h-5 mr-2 text-green-600" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-5 h-5 mr-2" />
                                            Copy
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                <span className="text-amber-600">ℹ️</span>
                                Important: Save this code!
                            </h4>
                            <ul className="text-sm text-gray-600 space-y-1 ml-6 list-disc">
                                <li>Share this code with your team members so they can join your team</li>
                                <li>Team members will need to enter this code when they register or sign in</li>
                                <li>You can find this code later in your team settings</li>
                                <li>You'll receive notifications when members request to join</li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button 
                                asChild
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                                size="lg"
                            >
                                <Link href="/dashboard">
                                    Go to Dashboard
                                </Link>
                            </Button>
                            <Button 
                                asChild
                                variant="outline"
                                className="flex-1"
                                size="lg"
                            >
                                <Link href="/team/pending-members">
                                    View Pending Members
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
