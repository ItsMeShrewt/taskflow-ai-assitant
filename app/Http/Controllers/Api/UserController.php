<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Get all users (for task assignment dropdown)
     */
    public function index()
    {
        /** @var User $user */
        $user = Auth::user();

        // Only admins and PMs can view all users
        if (!$user->canManageTasks()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $users = User::select('id', 'name', 'email', 'role')
            ->orderBy('name')
            ->get();

        return response()->json(['data' => $users]);
    }

    /**
     * Update user role (project managers can update their team members)
     */
    public function updateRole(Request $request, User $targetUser)
    {
        /** @var User $user */
        $user = Auth::user();

        // Only superadmin and project managers can update roles
        if (!$user->canManageTasks()) {
            return response()->json(['message' => 'Unauthorized. Only Project Managers can update roles.'], 403);
        }

        // Project managers can only update team members in their team
        if ($user->role === User::ROLE_PROJECT_MANAGER) {
            // Cannot change another PM's role
            if ($targetUser->canManageTasks()) {
                return response()->json(['message' => 'Cannot change another Project Manager\'s role.'], 403);
            }
            
            // Can only update members in their own team
            if ($targetUser->team_id !== $user->team_id) {
                return response()->json(['message' => 'You can only update roles for members in your team.'], 403);
            }
        }

        $validated = $request->validate([
            'role' => ['required', Rule::in([
                User::ROLE_SUPERADMIN, 
                User::ROLE_PROJECT_MANAGER, 
                User::ROLE_FRONTEND_DEVELOPER,
                User::ROLE_BACKEND_DEVELOPER,
                User::ROLE_TECHNICAL_WRITER,
                User::ROLE_SYSTEM_ANALYST
            ])],
        ]);

        // Project managers cannot assign PM or superadmin roles
        if ($user->role === User::ROLE_PROJECT_MANAGER) {
            if (in_array($validated['role'], [User::ROLE_SUPERADMIN, User::ROLE_PROJECT_MANAGER])) {
                return response()->json(['message' => 'Project Managers cannot assign PM or admin roles.'], 403);
            }
        }

        $targetUser->role = $validated['role'];
        $targetUser->touch(); // Explicitly update updated_at timestamp
        $targetUser->save();

        return response()->json([
            'message' => 'Role updated successfully',
            'user' => $targetUser->only(['id', 'name', 'email', 'role'])
        ]);
    }
}
