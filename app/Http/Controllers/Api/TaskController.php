<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Validation\Rule;

class TaskController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();
        Log::info('TaskController::index - User: ' . $user->email . ' (Role: ' . $user->role . ')');
        
        $canManageTasks = $user->canManageTasks();

        // For PM: separate personal tasks from team tasks
        if ($canManageTasks) {
            // My tasks query (assigned to PM)
            $myTasksQuery = Task::where('assigned_to_user_id', $user->id);
            
            // Team tasks query (assigned to others)
            $teamTasksQuery = Task::where('assigned_to_user_id', '!=', $user->id)
                ->orWhereNull('assigned_to_user_id');
            
            // Apply filters to both queries
            $this->applyFilters($myTasksQuery, $request, $canManageTasks);
            $this->applyFilters($teamTasksQuery, $request, $canManageTasks);
            
            $myTasks = $myTasksQuery->get();
            $teamTasks = $teamTasksQuery->get();
            
            Log::info('TaskController::index - PM viewing: ' . $myTasks->count() . ' my tasks, ' . $teamTasks->count() . ' team tasks');
            
            return response()->json([
                'data' => null,
                'myTasks' => $myTasks,
                'teamTasks' => $teamTasks,
                'canManageTasks' => true,
            ]);
        } else {
            // Members only see tasks assigned to them
            $query = Task::where('assigned_to_user_id', $user->id);
            Log::info('TaskController::index - Member viewing assigned tasks');
            
            $this->applyFilters($query, $request, $canManageTasks);
            
            $tasks = $query->get();
            Log::info('TaskController::index - Query returned ' . $tasks->count() . ' tasks');

            // Mark unread tasks as viewed for members
            Task::where('assigned_to_user_id', $user->id)
                ->whereNull('viewed_at')
                ->update(['viewed_at' => now()]);
            Log::info('TaskController::index - Marked tasks as viewed for member');

            return response()->json([
                'data' => $tasks,
                'myTasks' => null,
                'teamTasks' => null,
                'canManageTasks' => false,
            ]);
        }
    }
    
    private function applyFilters($query, Request $request, bool $canManageTasks)
    {
        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by priority
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        // Filter by assigned user (for admins/PMs)
        if ($request->filled('assigned_to') && $canManageTasks) {
            $query->where('assigned_to_user_id', $request->assigned_to);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);
        
        return $query;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Task::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => ['required', Rule::in(['low', 'medium', 'high', 'urgent'])],
            'due_date' => 'nullable|date',
            'estimated_time' => 'nullable|integer|min:1',
            'assigned_to_user_id' => 'required|exists:users,id',
        ]);

        $task = Task::create([
            ...$validated,
            'user_id' => Auth::id(),
            'created_by_user_id' => Auth::id(),
        ]);

        $task->load(['subtasks', 'assignedTo', 'createdBy']);

        return response()->json($task, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        $this->authorize('view', $task);

        $task->load(['subtasks', 'user', 'assignedTo', 'createdBy']);

        return response()->json($task);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        /** @var User $user */
        $user = Auth::user();

        // Define base validation rules
        $rules = [
            'status' => ['sometimes', 'required', Rule::in(['pending', 'in_progress', 'completed', 'cancelled'])],
            'actual_time' => 'nullable|integer|min:0',
        ];

        // Admins and PMs can update all fields
        if ($user->canManageTasks()) {
            $rules = array_merge($rules, [
                'title' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'priority' => ['sometimes', 'required', Rule::in(['low', 'medium', 'high', 'urgent'])],
                'due_date' => 'nullable|date',
                'estimated_time' => 'nullable|integer|min:1',
                'assigned_to_user_id' => 'sometimes|required|exists:users,id',
            ]);
        }

        $validated = $request->validate($rules);

        $task->update($validated);

        $task->load(['subtasks', 'assignedTo', 'createdBy']);

        return response()->json($task);
    }

    /**
     * Get count of unread tasks for the authenticated user
     */
    public function unreadCount()
    {
        /** @var User $user */
        $user = Auth::user();
        
        $count = Task::where('assigned_to_user_id', $user->id)
            ->whereNull('viewed_at')
            ->count();
            
        return response()->json(['count' => $count]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }
}
