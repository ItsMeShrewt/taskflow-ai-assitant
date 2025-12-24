<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TaskPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Task $task): bool
    {
        // Admins and PMs can view all tasks
        if ($user->canManageTasks()) {
            return true;
        }

        // Members can only view tasks assigned to them
        return $user->id === $task->assigned_to_user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Only admins and PMs can create tasks
        return $user->canManageTasks();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Task $task): bool
    {
        // Admins and PMs can update any task
        if ($user->canManageTasks()) {
            return true;
        }

        // Members can update tasks assigned to them (status, actual_time, etc.)
        return $user->id === $task->assigned_to_user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Task $task): bool
    {
        // Only admins and PMs who created the task can delete it
        return $user->canManageTasks() && $user->id === $task->created_by_user_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Task $task): bool
    {
        // Only admins and PMs who created the task can restore it
        return $user->canManageTasks() && $user->id === $task->created_by_user_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Task $task): bool
    {
        // Only superadmins can permanently delete
        return $user->isSuperAdmin();
    }

    /**
     * Determine whether the user can assign tasks to others
     */
    public function assign(User $user): bool
    {
        return $user->canManageTasks();
    }
}
