import { Head, useForm, router } from '@inertiajs/react';
import { Camera, ArrowLeft } from 'lucide-react';
import { FormEvent, ChangeEvent, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CreateTeam() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        photo: null as File | null,
    });
    
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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
        router.visit('/role-selection');
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/team/create');
    };

    return (
        <>
            <Head title="Create Your Team" />
            
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
                        <CardTitle className="text-3xl">Create Your Team</CardTitle>
                        <CardDescription className="text-base">
                            Set up your team to start managing projects
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
                                        Upload
                                    </Button>
                                </div>
                                {errors.photo && <p className="text-sm text-red-600 mt-1">{errors.photo}</p>}
                            </div>

                            {/* Team Name */}
                            <div>
                                <Label htmlFor="name">Team Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g., Development Team Alpha"
                                    className="mt-1"
                                    required
                                />
                                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                            </div>

                            {/* Submit Button */}
                            <Button 
                                type="submit" 
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                size="lg"
                                disabled={processing}
                            >
                                {processing ? 'Creating Team...' : 'Create Team'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
