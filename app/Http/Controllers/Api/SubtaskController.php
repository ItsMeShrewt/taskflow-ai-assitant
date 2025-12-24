<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Subtask;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class SubtaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Task $task)
    {
        Gate::authorize('view', $task);

        $subtasks = $task->subtasks;

        return response()->json($subtasks);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Task $task)
    {
        Gate::authorize('update', $task);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'estimated_time' => 'nullable|integer|min:1',
        ]);

        $lastOrder = $task->subtasks()->max('order') ?? -1;

        /** @var int $taskId */
        $taskId = $task->id;
        
        $subtask = Subtask::create([
            ...$validated,
            'task_id' => $taskId,
            'order' => $lastOrder + 1,
        ]);

        return response()->json($subtask, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task, Subtask $subtask)
    {
        Gate::authorize('update', $task);

        /** @var int $subtaskTaskId */
        $subtaskTaskId = $subtask->task_id;
        /** @var int $taskId */
        $taskId = $task->id;
        
        if ($subtaskTaskId !== $taskId) {
            return response()->json(['message' => 'Subtask does not belong to this task'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => ['sometimes', 'required', Rule::in(['pending', 'in_progress', 'completed'])],
            'estimated_time' => 'nullable|integer|min:1',
            'order' => 'nullable|integer|min:0',
        ]);

        $subtask->update($validated);

        return response()->json($subtask);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task, Subtask $subtask)
    {
        Gate::authorize('update', $task);

        /** @var int $subtaskTaskId */
        $subtaskTaskId = $subtask->task_id;
        /** @var int $taskId */
        $taskId = $task->id;
        
        if ($subtaskTaskId !== $taskId) {
            return response()->json(['message' => 'Subtask does not belong to this task'], 403);
        }

        $subtask->delete();

        return response()->json(['message' => 'Subtask deleted successfully']);
    }

    /**
     * Reorder subtasks
     */
    public function reorder(Request $request, Task $task)
    {
        Gate::authorize('update', $task);

        $validated = $request->validate([
            'subtasks' => 'required|array',
            'subtasks.*.id' => 'required|exists:subtasks,id',
            'subtasks.*.order' => 'required|integer|min:0',
        ]);

        foreach ($validated['subtasks'] as $item) {
            Subtask::where('id', $item['id'])
                ->where('task_id', $task->id)
                ->update(['order' => $item['order']]);
        }

        return response()->json(['message' => 'Subtasks reordered successfully']);
    }
}
