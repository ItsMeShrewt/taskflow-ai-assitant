<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class TeamController extends Controller
{
    public function create()
    {
        return Inertia::render('team/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'photo' => 'nullable|image|max:2048',
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('teams', 'public');
            \Log::info('Team photo uploaded', ['path' => $photoPath]);
        }

        \Log::info('Creating team with data', [
            'name' => $request->name,
            'description' => $request->description,
            'photo' => $photoPath,
            'created_by' => Auth::id(),
        ]);

        $team = Team::create([
            'name' => $request->name,
            'description' => $request->description,
            'code' => Team::generateUniqueCode(),
            'photo' => $photoPath,
            'created_by' => Auth::id(),
        ]);

        \Log::info('Team created', ['id' => $team->id, 'photo' => $team->photo]);

        // Update user's team and set as approved
        /** @var User $user */
        $user = Auth::user();
        if ($user) {
            $user->update([
                'team_id' => $team->id,
                'membership_status' => 'approved',
            ]);
        }

        // Redirect to dashboard with team code in flash message
        return redirect()->route('dashboard')->with([
            'success' => 'Team created successfully!',
            'accountCreated' => true,
            'teamCode' => $team->code,
            'teamName' => $team->name,
        ]);
    }

    public function join()
    {
        $teams = Team::select('id', 'name', 'photo')->get();
        
        return Inertia::render('team/join', [
            'teams' => $teams,
        ]);
    }

    public function requestJoin(Request $request)
    {
        $request->validate([
            'team_id' => 'required|exists:teams,id',
            'team_code' => 'required|string',
        ]);

        $team = Team::findOrFail($request->team_id);
        
        // Verify the code matches the selected team
        if ($team->code !== $request->team_code) {
            return back()->withErrors(['team_code' => 'Invalid team code for the selected team.']);
        }

        /** @var User $user */
        $user = Auth::user();
        if ($user) {
            $user->update([
                'team_id' => $team->id,
                'membership_status' => 'pending',
            ]);
        }

        return redirect()->route('dashboard')->with('info', 'Your request to join ' . $team->name . ' has been sent. Please wait for approval.');
    }

    public function pendingMembers()
    {
        /** @var User $user */
        $user = Auth::user();
        
        if (!$user->canManageTasks() || !$user->team_id) {
            abort(403);
        }

        $pendingMembers = User::where('team_id', $user->team_id)
            ->where('membership_status', 'pending')
            ->get();

        return Inertia::render('team/pending-members', [
            'pendingMembers' => $pendingMembers,
            'team' => $user->team,
        ]);
    }

    public function approveMember($userId)
    {
        /** @var User $user */
        $user = Auth::user();
        $member = User::findOrFail($userId);

        if (!$user->canManageTasks() || $member->team_id !== $user->team_id) {
            abort(403);
        }

        $wasApproved = $member->membership_status !== 'approved';
        $member->update(['membership_status' => 'approved']);

        // Store approval notification for the member
        if ($wasApproved) {
            session()->put("member_{$userId}_approved", true);
        }

        return back()->with('success', 'Member approved successfully!');
    }

    public function rejectMember($userId)
    {
        /** @var User $user */
        $user = Auth::user();
        $member = User::findOrFail($userId);

        if (!$user->canManageTasks() || $member->team_id !== $user->team_id) {
            abort(403);
        }

        $member->update([
            'team_id' => null,
            'membership_status' => null,
        ]);

        return back()->with('success', 'Member rejected successfully!');
    }

    public function edit($id)
    {
        $team = Team::findOrFail($id);
        
        Gate::authorize('update', $team);

        return Inertia::render('team/edit', [
            'team' => $team,
        ]);
    }

    public function update(Request $request, $id)
    {
        $team = Team::findOrFail($id);
        
        Gate::authorize('update', $team);

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'photo' => 'nullable|image|max:2048',
        ]);

        $data = [
            'name' => $request->name,
            'description' => $request->description,
        ];

        // Handle photo update
        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($team->photo) {
                Storage::disk('public')->delete($team->photo);
            }
            
            $data['photo'] = $request->file('photo')->store('teams', 'public');
        }

        $team->update($data);

        return redirect()->route('team.edit', $team->id)->with('success', 'Team updated successfully!');
    }
}
