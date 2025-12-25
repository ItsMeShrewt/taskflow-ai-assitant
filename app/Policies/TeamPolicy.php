<?php

namespace App\Policies;

use App\Models\Team;
use App\Models\User;

class TeamPolicy
{
    /**
     * Determine if the user can update the team.
     * Only project managers and superadmins can update teams.
     */
    public function update(User $user, Team $team): bool
    {
        // User must be a project manager or superadmin
        if (!$user->canManageTasks()) {
            return false;
        }

        // User must be part of the team they're trying to edit
        return $user->team_id === $team->id;
    }

    /**
     * Determine if the user can view the team.
     */
    public function view(User $user, Team $team): bool
    {
        return $user->team_id === $team->id;
    }
}
