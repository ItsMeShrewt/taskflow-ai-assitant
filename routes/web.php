<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Role selection (for new users)
    Route::get('role-selection', [App\Http\Controllers\RoleSelectionController::class, 'show'])->name('role-selection.show');
    Route::post('role-selection', [App\Http\Controllers\RoleSelectionController::class, 'store'])->name('role-selection.store');

    // Team routes
    Route::get('team/create', [App\Http\Controllers\TeamController::class, 'create'])->name('team.create');
    Route::post('team/create', [App\Http\Controllers\TeamController::class, 'store'])->name('team.store');
    Route::get('team/join', [App\Http\Controllers\TeamController::class, 'join'])->name('team.join');
    Route::post('team/join', [App\Http\Controllers\TeamController::class, 'requestJoin'])->name('team.request-join');
    Route::get('team/pending-members', [App\Http\Controllers\TeamController::class, 'pendingMembers'])->name('team.pending-members');
    Route::post('team/approve/{userId}', [App\Http\Controllers\TeamController::class, 'approveMember'])->name('team.approve-member');
    Route::post('team/reject/{userId}', [App\Http\Controllers\TeamController::class, 'rejectMember'])->name('team.reject-member');

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
