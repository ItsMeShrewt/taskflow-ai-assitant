<?php

namespace App\Http\Middleware;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        /** @var User|null $user */
        $user = $request->user();
        $unreadTaskCount = 0;
        
        if ($user && !$user->canManageTasks()) {
            // Only show unread count for members (not project managers)
            $unreadTaskCount = Task::where('assigned_to_user_id', $user->id)
                ->whereNull('viewed_at')
                ->count();
        }

        // Load team relationship if user exists
        if ($user) {
            $user->load('team:id,name,code,description,photo');
            
            // Check if user was recently approved
            $approvalKey = "member_{$user->id}_approved";
            if (session()->has($approvalKey)) {
                session()->forget($approvalKey);
                session()->flash('memberApproved', true);
                if ($user->team) {
                    session()->flash('teamName', $user->team->name);
                }
            }
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $user,
            ],
            'unreadTaskCount' => $unreadTaskCount,
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
                'info' => session('info'),
                'teamCode' => session('teamCode'),
                'teamName' => session('teamName'),
                'accountCreated' => session('accountCreated'),
                'memberApproved' => session('memberApproved'),
            ],
        ];
    }
}
