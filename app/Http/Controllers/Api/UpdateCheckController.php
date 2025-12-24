<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class UpdateCheckController extends Controller
{
    /**
     * Check if there are updates for tasks
     */
    public function checkTasksUpdate(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();
        
        // Get the latest task timestamp for this user
        if ($user->canManageTasks()) {
            // For admins/PMs, check all tasks
            $latestUpdate = Task::max('updated_at');
        } else {
            // For members, check only their assigned tasks
            $latestUpdate = Task::where('assigned_to_user_id', $user->id)
                ->max('updated_at');
        }
        
        $hasUpdate = false;
        if ($request->has('last_known') && $latestUpdate) {
            $lastKnown = $request->get('last_known');
            $hasUpdate = strtotime($latestUpdate) > strtotime($lastKnown);
            
            // Debug logging
            Log::info('Tasks Update Check', [
                'user_id' => $user->id,
                'user_role' => $user->role,
                'last_known' => $lastKnown,
                'latest_update' => $latestUpdate,
                'last_known_timestamp' => strtotime($lastKnown),
                'latest_update_timestamp' => strtotime($latestUpdate),
                'has_update' => $hasUpdate
            ]);
        }
        
        return response()->json([
            'last_update' => $latestUpdate,
            'has_update' => $hasUpdate
        ]);
    }

    /**
     * Check if there are new unread tasks for member
     */
    public function checkUnreadCount(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();
        
        if ($user->canManageTasks()) {
            return response()->json(['count' => 0]);
        }
        
        $count = Task::where('assigned_to_user_id', $user->id)
            ->whereNull('viewed_at')
            ->count();
            
        return response()->json([
            'count' => $count,
            'has_update' => $request->has('last_count') && $count != $request->get('last_count')
        ]);
    }

    /**
     * Check for dashboard updates
     */
    public function checkDashboardUpdate(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();
        
        // Get the latest task update timestamp
        if ($user->canManageTasks()) {
            $latestUpdate = Task::max('updated_at');
        } else {
            $latestUpdate = Task::where('assigned_to_user_id', $user->id)
                ->max('updated_at');
        }
        
        $hasUpdate = false;
        if ($request->has('last_known') && $latestUpdate) {
            $lastKnown = $request->get('last_known');
            $hasUpdate = strtotime($latestUpdate) > strtotime($lastKnown);
        }
        
        return response()->json([
            'last_update' => $latestUpdate,
            'has_update' => $hasUpdate
        ]);
    }

    /**
     * Check for users list updates
     */
    public function checkUsersUpdate(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();
        
        // Only check users from the same team with approved status
        $latestUpdate = User::where('team_id', $user->team_id)
            ->where('membership_status', 'approved')
            ->max('updated_at');
        
        $hasUpdate = false;
        if ($request->has('last_known') && $latestUpdate) {
            $lastKnown = $request->get('last_known');
            $hasUpdate = strtotime($latestUpdate) > strtotime($lastKnown);
            
            // Debug logging
            Log::info('Users Update Check', [
                'user_id' => $user->id,
                'team_id' => $user->team_id,
                'last_known' => $lastKnown,
                'latest_update' => $latestUpdate,
                'last_known_timestamp' => strtotime($lastKnown),
                'latest_update_timestamp' => strtotime($latestUpdate),
                'has_update' => $hasUpdate
            ]);
        }
        
        return response()->json([
            'last_update' => $latestUpdate,
            'has_update' => $hasUpdate
        ]);
    }

    /**
     * Check for pending members updates
     */
    public function checkPendingMembersUpdate(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        if (!$user->canManageTasks() || !$user->team_id) {
            return response()->json([
                'last_update' => null,
                'has_update' => false
            ]);
        }

        $latestUpdate = User::where('team_id', $user->team_id)
            ->where('membership_status', 'pending')
            ->max('updated_at');
        
        $hasUpdate = false;
        if ($request->has('last_known') && $latestUpdate) {
            $lastKnown = $request->get('last_known');
            $hasUpdate = strtotime($latestUpdate) > strtotime($lastKnown);
        }
        
        return response()->json([
            'last_update' => $latestUpdate,
            'has_update' => $hasUpdate
        ]);
    }
}
