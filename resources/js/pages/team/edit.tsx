import { Head, useForm, router, usePage } from '@inertiajs/react';
import { Camera, ArrowLeft, Save } from 'lucide-react';
import { FormEvent, ChangeEvent, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';

interface Team {
    id: number;
    name: string;
    description: string | null;
    photo: string | null;
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

    const handleBack = () => {
        router.visit('/dashboard');
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(`/team/${team.id}`);
    };

    return (
        <>
            <Head title="Edit Team Settings" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md relative">
                    {/* Back Button */}
                    <div className="absolute top-4 left-4 z-10">
                        <Button 
                            variant="ghost" 
                            onClick={handleBack}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                            size="sm"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            <span>Back</span>
                        </Button>
                    </div>
                    
                    <CardHeader className="text-center pt-12">
                        <CardTitle className="text-3xl">Team Settings</CardTitle>
                        <CardDescription className="text-base">
                            Edit your team's information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            {/* Photo Upload */}
                            <div className="flex flex-col items-center">
                                <Label htmlFor="photo" className="mb-2">Team Photo</Label>
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                                        {photoPreview ? (
                                            <img src={photoPreview} alt="Team preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <Camera className="w-12 h-12 text-gray-400" />
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
                                        className="absolute bottom-0 right-0"
                                    >
                                        Change
                                    </Button>
                                </div>
                                {errors.photo && <p className="text-sm text-red-600 mt-1">{errors.photo}</p>}
                                <p className="text-xs text-gray-500 mt-2">Only Project Managers can edit team photo</p>
                            </div>

                            {/* Team Name */}
                            <div>
                                <Label htmlFor="name">Team Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1"
                                    required
                                />
                                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                            </div>

                            {/* Team Description */}
                            <div>
                                <Label htmlFor="description">Team Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Describe what your team does..."
                                    className="mt-1 min-h-[80px]"
                                    rows={3}
                                />
                                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                            </div>

                            {/* Submit Button */}
                            <Button 
                                type="submit" 
                                className="w-full" 
                                disabled={processing}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
