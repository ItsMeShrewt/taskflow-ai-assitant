import { Head, useForm, router, usePage } from '@inertiajs/react';
import { Camera, Save, Users, Settings, Info, Shield } from 'lucide-react';
import { FormEvent, ChangeEvent, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import toast from 'react-hot-toast';

interface Team {
    id: number;
    name: string;
    description: string | null;
    photo: string | null;
    code: string;
}

interface EditTeamProps {
    team: Team;
}

export default function EditTeam({ team }: EditTeamProps) {
    const page = usePage();
    const flash = page.props.flash as any;
    
    const { data, setData, post, processing, errors } = useForm({
        name: team.name,
        description: team.description || '',
        photo: null as File | null,
    });
    
    const [photoPreview, setPhotoPreview] = useState<string | null>(
        team.photo ? `/storage/${team.photo}` : null
    );

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('photo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(`/team/${team.id}`);
    };

    return (
        <AppLayout>
            <Head title="Team Settings" />
            
            <div className="container mx-auto p-6 max-w-6xl">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Team Settings</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage your team's information and preferences
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar - Team Info */}
                    <Card className="lg:col-span-1 h-fit">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                                    {photoPreview ? (
                                        <img src={photoPreview} alt={team.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Users className="w-10 h-10 text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{team.name}</h3>
                                    <p className="text-sm text-gray-500">Team Code: {team.code}</p>
                                </div>
                                <div className="w-full pt-4 border-t">
                                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-4 h-4" />
                                            <span>Manager Access</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <Tabs defaultValue="basic" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-6">
                                <TabsTrigger value="basic" className="flex items-center gap-2">
                                    <Info className="w-4 h-4" />
                                    Basic Info
                                </TabsTrigger>
                                <TabsTrigger value="photo" className="flex items-center gap-2">
                                    <Camera className="w-4 h-4" />
                                    Team Photo
                                </TabsTrigger>
                                <TabsTrigger value="advanced" className="flex items-center gap-2">
                                    <Settings className="w-4 h-4" />
                                    Advanced
                                </TabsTrigger>
                            </TabsList>

                            {/* Basic Information Tab */}
                            <TabsContent value="basic">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Basic Information</CardTitle>
                                        <CardDescription>
                                            Update your team's name and goal
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={submit} className="space-y-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-base font-medium">
                                                    Team Name
                                                </Label>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    placeholder="Enter team name"
                                                    className="mt-1"
                                                    required
                                                />
                                                {errors.name && (
                                                    <p className="text-sm text-red-600">{errors.name}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="description" className="text-base font-medium">
                                                    Team's Goal
                                                </Label>
                                                <Textarea
                                                    id="description"
                                                    value={data.description}
                                                    onChange={(e) => setData('description', e.target.value)}
                                                    placeholder="What is your team's mission and goal?"
                                                    className="mt-1 min-h-[120px]"
                                                    rows={5}
                                                />
                                                <p className="text-xs text-gray-500">
                                                    Define your team's mission and objectives
                                                </p>
                                                {errors.description && (
                                                    <p className="text-sm text-red-600">{errors.description}</p>
                                                )}
                                            </div>

                                            <div className="flex justify-end pt-4 border-t">
                                                <Button 
                                                    type="submit" 
                                                    disabled={processing}
                                                    className="px-6"
                                                >
                                                    <Save className="w-4 h-4 mr-2" />
                                                    {processing ? 'Saving...' : 'Save Changes'}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Team Photo Tab */}
                            <TabsContent value="photo">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Team Photo</CardTitle>
                                        <CardDescription>
                                            Upload a photo to represent your team
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={submit} className="space-y-6">
                                            <div className="flex flex-col items-center space-y-4">
                                                <div className="relative">
                                                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                                                        {photoPreview ? (
                                                            <img src={photoPreview} alt="Team preview" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Camera className="w-16 h-16 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <input
                                                        id="photo"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handlePhotoChange}
                                                        className="hidden"
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={() => document.getElementById('photo')?.click()}
                                                        variant="secondary"
                                                        size="sm"
                                                        className="absolute bottom-2 right-2 rounded-full shadow-lg"
                                                    >
                                                        <Camera className="w-4 h-4 mr-1" />
                                                        Change
                                                    </Button>
                                                </div>
                                                
                                                <div className="text-center">
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Recommended: Square image, at least 400x400px
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        JPG, PNG or GIF. Max size 2MB
                                                    </p>
                                                </div>
                                                
                                                {errors.photo && (
                                                    <p className="text-sm text-red-600">{errors.photo}</p>
                                                )}
                                            </div>

                                            <div className="flex justify-end pt-4 border-t">
                                                <Button 
                                                    type="submit" 
                                                    disabled={processing}
                                                    className="px-6"
                                                >
                                                    <Save className="w-4 h-4 mr-2" />
                                                    {processing ? 'Uploading...' : 'Save Photo'}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Advanced Settings Tab */}
                            <TabsContent value="advanced">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Advanced Settings</CardTitle>
                                        <CardDescription>
                                            Manage team code and other advanced options
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-2">
                                            <Label className="text-base font-medium">Team Code</Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    value={team.code}
                                                    readOnly
                                                    className="font-mono bg-gray-50 dark:bg-gray-900"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(team.code);
                                                        toast.success('Team code copied!');
                                                    }}
                                                >
                                                    Copy
                                                </Button>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Share this code with members to join your team
                                            </p>
                                        </div>

                                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                                            <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2">
                                                Danger Zone
                                            </h4>
                                            <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                                                Irreversible actions that affect your entire team
                                            </p>
                                            <Button 
                                                variant="destructive" 
                                                size="sm"
                                                disabled
                                            >
                                                Delete Team
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
