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
        
        // If user already has a role selected and a team, redirect to dashboard
        if ($user->role !== null && $user->role !== '' && $user->team_id) {
            return redirect()->route('dashboard');
        }
        
        // Clear role if they're coming back to reconsider
        if ($user->role !== null && $user->role !== '') {
            $user->update(['role' => null]);
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
            // For members, set a temporary role that will be updated by PM later
            $user->update(['role' => 'member_pending_assignment']);
            return redirect()->route('team.join');
        }
    }

    public function cancel()
    {
        /** @var User $user */
        $user = Auth::user();

        if ($user) {
            // Delete the user account if they haven't selected a role
            if ($user->role === null || $user->role === '') {
                $user->delete();
            }
            
            // Logout
            Auth::logout();
            request()->session()->invalidate();
            request()->session()->regenerateToken();
        }

        return redirect()->route('home');
    }
}
