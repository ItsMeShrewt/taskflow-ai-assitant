<?php

use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\SubtaskController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\UpdateCheckController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth'])->group(function () {
    
    // Task Routes
    Route::get('tasks/unread-count', [TaskController::class, 'unreadCount']);
    Route::apiResource('tasks', TaskController::class)->names([
        'index' => 'api.tasks.index',
        'store' => 'api.tasks.store',
        'show' => 'api.tasks.show',
        'update' => 'api.tasks.update',
        'destroy' => 'api.tasks.destroy',
    ]);
    
    // Subtask Routes
    Route::apiResource('tasks.subtasks', SubtaskController::class)
        ->except(['show']);
    
    Route::post('tasks/{task}/subtasks/reorder', [SubtaskController::class, 'reorder']);

    // User Routes
    Route::get('users', [UserController::class, 'index']);
    Route::patch('users/{targetUser}/role', [UserController::class, 'updateRole']);
    
    // Update Check Routes
    Route::get('check-updates/tasks', [UpdateCheckController::class, 'checkTasksUpdate']);
    Route::get('check-updates/unread', [UpdateCheckController::class, 'checkUnreadCount']);
    Route::get('check-updates/dashboard', [UpdateCheckController::class, 'checkDashboardUpdate']);
    Route::get('check-updates/users', [UpdateCheckController::class, 'checkUsersUpdate']);
    Route::get('check-updates/pending-members', [UpdateCheckController::class, 'checkPendingMembersUpdate']);
});
