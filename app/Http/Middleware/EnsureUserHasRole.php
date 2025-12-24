<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        // If user is authenticated but doesn't have a role, redirect to role selection
        if ($user && ($user->role === null || $user->role === '')) {
            // Don't redirect if already on role-selection page or canceling
            if (!$request->routeIs('role-selection.show') && 
                !$request->routeIs('role-selection.store') && 
                !$request->routeIs('role-selection.cancel')) {
                return redirect()->route('role-selection.show');
            }
        }
        
        // Allow access to role-selection routes at any time
        if ($request->routeIs('role-selection.show') || 
            $request->routeIs('role-selection.store') || 
            $request->routeIs('role-selection.cancel')) {
            return $next($request);
        }
        
        // If user has a role but doesn't have a team, redirect to appropriate page
        if ($user && $user->role && !$user->team_id) {
            // PM should be redirected to create team
            if ($user->canManageTasks() && !$request->routeIs('team.create') && !$request->routeIs('team.store')) {
                return redirect()->route('team.create')->with('info', 'Please create your team to continue.');
            }
            // Member should be redirected to join team
            if (!$user->canManageTasks() && !$request->routeIs('team.join') && !$request->routeIs('team.request-join')) {
                return redirect()->route('team.join')->with('info', 'Please join a team to continue.');
            }
        }
        
        // If member is pending approval, they can only access certain routes
        if ($user && $user->role && $user->team_id && $user->membership_status === 'pending') {
            // Allow access to dashboard (they'll see a waiting message) and logout
            $allowedRoutes = ['dashboard', 'logout'];
            if (!in_array($request->route()?->getName(), $allowedRoutes)) {
                return redirect()->route('dashboard');
            }
        }
        
        return $next($request);
    }
}
