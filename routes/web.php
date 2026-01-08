<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// Health check endpoint for Railway
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
        'php_version' => PHP_VERSION,
        'laravel_version' => app()->version(),
    ]);
});

Route::get('/', function () {
    // If user is authenticated, redirect them appropriately
    if (Auth::check()) {
        $user = Auth::user();
        
        // If user hasn't selected a role yet, send them to role selection
        if ($user->role === null || $user->role === '') {
            return redirect()->route('role-selection.show');
        }
        
        // If user has a role, send them to dashboard
        return redirect()->route('dashboard');
    }
    
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified', 'ensure.role'])->group(function () {
    // Role selection (for new users)
    Route::get('role-selection', [App\Http\Controllers\RoleSelectionController::class, 'show'])->name('role-selection.show');
    Route::post('role-selection', [App\Http\Controllers\RoleSelectionController::class, 'store'])->name('role-selection.store');
    Route::delete('role-selection/cancel', [App\Http\Controllers\RoleSelectionController::class, 'cancel'])->name('role-selection.cancel');

    // Team routes
    Route::get('team/create', [App\Http\Controllers\TeamController::class, 'create'])->name('team.create');
    Route::post('team/create', [App\Http\Controllers\TeamController::class, 'store'])->name('team.store');
    Route::get('team/join', [App\Http\Controllers\TeamController::class, 'join'])->name('team.join');
    Route::post('team/join', [App\Http\Controllers\TeamController::class, 'requestJoin'])->name('team.request-join');
    Route::get('team/pending-members', [App\Http\Controllers\TeamController::class, 'pendingMembers'])->name('team.pending-members');
    Route::post('team/approve/{userId}', [App\Http\Controllers\TeamController::class, 'approveMember'])->name('team.approve-member');
    Route::post('team/reject/{userId}', [App\Http\Controllers\TeamController::class, 'rejectMember'])->name('team.reject-member');
    Route::get('team/{id}/edit', [App\Http\Controllers\TeamController::class, 'edit'])->name('team.edit');
    Route::post('team/{id}', [App\Http\Controllers\TeamController::class, 'update'])->name('team.update');

    Route::get('dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // Task routes
    Route::get('tasks', function () {
        return Inertia::render('tasks/index');
    })->name('tasks.index');

    Route::get('tasks/{id}', function ($id) {
        return Inertia::render('tasks/show', [
            'taskId' => (int) $id,
        ]);
    })->name('tasks.show');

    // User management route
    Route::get('users', function () {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        // Only show users from the same team
        $users = App\Models\User::select('id', 'name', 'email', 'role', 'created_at', 'team_id', 'membership_status')
            ->where('team_id', $user->team_id)
            ->where('membership_status', 'approved')
            ->orderBy('name')
            ->get();
        
        return Inertia::render('users/index', [
            'users' => $users,
        ]);
    })->name('users.index');
});

require __DIR__.'/settings.php';
