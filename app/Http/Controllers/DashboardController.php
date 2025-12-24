<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        /** @var User $user */
        $user = Auth::user();
        $canManageTasks = $user->canManageTasks();

        // Build base query based on role
        /** @var Builder $baseQuery */
        if ($canManageTasks) {
            // For PMs: separate personal tasks from team tasks
            $myTasksQuery = Task::where('assigned_to_user_id', $user->id);
            $teamTasksQuery = Task::where('assigned_to_user_id', '!=', $user->id)
                ->orWhereNull('assigned_to_user_id');
            
            // All tasks for overall stats
            $baseQuery = Task::query();
            
            // Get recent tasks - separate by PM's tasks and team tasks
            $myRecentTasks = (clone $myTasksQuery)
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get();
            
            $teamRecentTasks = (clone $teamTasksQuery)
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get();
            
            // Get upcoming tasks - separate by PM's tasks and team tasks
            $myUpcomingTasks = (clone $myTasksQuery)
                ->whereNotNull('due_date')
                ->where('due_date', '>=', now())
                ->whereNotIn('status', ['completed', 'cancelled'])
                ->orderBy('due_date', 'asc')
                ->limit(5)
                ->get();
            
            $teamUpcomingTasks = (clone $teamTasksQuery)
                ->whereNotNull('due_date')
                ->where('due_date', '>=', now())
                ->whereNotIn('status', ['completed', 'cancelled'])
                ->orderBy('due_date', 'asc')
                ->limit(5)
                ->get();
        } else {
            // Members only see tasks assigned to them
            $baseQuery = Task::where('assigned_to_user_id', $user->id);
            $myTasksQuery = $baseQuery;
            $teamTasksQuery = null;
            
            $myRecentTasks = null;
            $teamRecentTasks = null;
            $myUpcomingTasks = null;
            $teamUpcomingTasks = null;
        }

        // Get task statistics
        $stats = [
            'total' => (clone $baseQuery)->count(),
            'completed' => (clone $baseQuery)->where('status', 'completed')->count(),
            'pending' => (clone $baseQuery)->where('status', 'pending')->count(),
            'in_progress' => (clone $baseQuery)->where('status', 'in_progress')->count(),
            'urgent' => (clone $baseQuery)->where('priority', 'urgent')->whereNotIn('status', ['completed', 'cancelled'])->count(),
            'overdue' => (clone $baseQuery)
                ->where('due_date', '<', now())
                ->whereNotIn('status', ['completed', 'cancelled'])
                ->count(),
        ];

        // For non-PM users, get tasks the old way
        if (!$canManageTasks) {
            // Get recent tasks (last 5)
            $recentTasks = (clone $baseQuery)
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get();

            // Get upcoming tasks (next 5 by due date)
            $upcomingTasks = (clone $baseQuery)
                ->whereNotNull('due_date')
                ->where('due_date', '>=', now())
                ->whereNotIn('status', ['completed', 'cancelled'])
                ->orderBy('due_date', 'asc')
                ->limit(5)
                ->get();
        } else {
            $recentTasks = null;
            $upcomingTasks = null;
        }

        // Get priority breakdown
        $priorityBreakdown = [
            'low' => (clone $baseQuery)->where('priority', 'low')->whereNotIn('status', ['completed', 'cancelled'])->count(),
            'medium' => (clone $baseQuery)->where('priority', 'medium')->whereNotIn('status', ['completed', 'cancelled'])->count(),
            'high' => (clone $baseQuery)->where('priority', 'high')->whereNotIn('status', ['completed', 'cancelled'])->count(),
            'urgent' => (clone $baseQuery)->where('priority', 'urgent')->whereNotIn('status', ['completed', 'cancelled'])->count(),
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentTasks' => $recentTasks,
            'upcomingTasks' => $upcomingTasks,
            'myRecentTasks' => $myRecentTasks ?? null,
            'myUpcomingTasks' => $myUpcomingTasks ?? null,
            'teamRecentTasks' => $teamRecentTasks ?? null,
            'teamUpcomingTasks' => $teamUpcomingTasks ?? null,
            'priorityBreakdown' => $priorityBreakdown,
            'canManageTasks' => $canManageTasks,
        ]);
    }
}
