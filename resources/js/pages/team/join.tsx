import { Head, useForm, router } from '@inertiajs/react';
import { KeyRound, Users, ArrowLeft } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Team {
    id: number;
    name: string;
    photo: string | null;
}

interface Props {
    teams: Team[];
}

export default function JoinTeam({ teams }: Props) {
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const { data, setData, post, processing, errors } = useForm({
        team_id: '',
        team_code: '',
    });

    const handleTeamSelect = (team: Team) => {
        setSelectedTeam(team);
        setData('team_id', team.id.toString());
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/team/join');
    };

    return (
        <>
            <Head title="Join a Team" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                            <Users className="w-10 h-10 text-purple-600" />
                        </div>
                        <CardTitle className="text-3xl">Join a Team</CardTitle>
                        <CardDescription className="text-base">
                            {!selectedTeam ? 'Select a team to join' : 'Enter the team code to join'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!selectedTeam ? (
                            /* Step 1: Team Selection */
                            <div className="space-y-3">
                                <Label className="text-base">Available Teams</Label>
                                {teams.length > 0 ? (
                                    <div className="grid gap-3">
                                        {teams.map((team) => (
                                            <button
                                                key={team.id}
                                                onClick={() => handleTeamSelect(team)}
                                                className="flex items-center gap-4 p-4 border-2 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all text-left"
                                            >
                                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                    {team.photo ? (
                                                        <img src={`/storage/${team.photo}`} alt={team.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-white font-semibold text-xl">
                                                            {team.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg text-gray-900">{team.name}</h3>
                                                    <p className="text-sm text-gray-500">Click to select this team</p>
                                                </div>
                                                <KeyRound className="w-5 h-5 text-gray-400" />
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">No teams available yet</p>
                                        <p className="text-sm text-gray-400 mt-1">Ask your Project Manager to create a team first</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Step 2: Code Entry */
                            <form onSubmit={submit} className="space-y-6">
                                {/* Selected Team Display */}
                                <div className="flex items-center gap-4 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden">
                                        {selectedTeam.photo ? (
                                            <img src={`/storage/${selectedTeam.photo}`} alt={selectedTeam.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-white font-semibold">
                                                {selectedTeam.name.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600">Joining</p>
                                        <h3 className="font-semibold text-lg text-gray-900">{selectedTeam.name}</h3>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedTeam(null);
                                            setData({ team_id: '', team_code: '' });
                                        }}
                                    >
                                        Change
                                    </Button>
                                </div>

                                {/* Team Code Input */}
                                <div>
                                    <Label htmlFor="team_code">Team Code</Label>
                                    <Input
                                        id="team_code"
                                        type="text"
                                        value={data.team_code}
                                        onChange={(e) => setData('team_code', e.target.value.toUpperCase())}
                                        placeholder="Enter 8-character code"
                                        className="mt-1 uppercase text-center text-xl tracking-widest font-mono"
                                        maxLength={8}
                                        required
                                    />
                                    {errors.team_code && <p className="text-sm text-red-600 mt-1">{errors.team_code}</p>}
                                    <p className="text-sm text-gray-500 mt-2">
                                        Ask your Project Manager for the team code
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <Button 
                                    type="submit" 
                                    className="w-full bg-purple-600 hover:bg-purple-700"
                                    size="lg"
                                    disabled={processing}
                                >
                                    {processing ? 'Requesting to Join...' : 'Request to Join Team'}
                                </Button>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-600">
                                    <p className="font-semibold mb-1">What happens next?</p>
                                    <p>Your Project Manager will receive your join request and can approve or reject it. You'll be notified once they make a decision.</p>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
