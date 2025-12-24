<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RoleSelectionController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        
        // If user already has a role selected, redirect to dashboard
        if ($user->role !== null && $user->role !== '') {
            return redirect()->route('dashboard');
        }

        return Inertia::render('role-selection');
    }

    public function store(Request $request)
    {
        $request->validate([
            'role' => 'required|in:pm,member',
        ]);

        /** @var User $user */
        $user = Auth::user();

        if (!$user) {
            abort(403);
        }

        if ($request->role === 'pm') {
            $user->update(['role' => User::ROLE_PROJECT_MANAGER]);
            return redirect()->route('team.create');
        } else {
            // For members, leave role as null
            // PM will assign the specific role later in Team Members page
            return redirect()->route('team.join');
        }
    }
}
