<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $role
 * @property string $password
 * @property string|null $email_verified_at
 * @property string|null $remember_token
 * @property int|null $team_id
 * @property string|null $membership_status
 * @property string $created_at
 * @property string $updated_at
 * @property-read Team|null $team
 */
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    // User roles
    const ROLE_SUPERADMIN = 'superadmin';
    const ROLE_PROJECT_MANAGER = 'project_manager';
    const ROLE_FRONTEND_DEVELOPER = 'frontend_developer';
    const ROLE_BACKEND_DEVELOPER = 'backend_developer';
    const ROLE_TECHNICAL_WRITER = 'technical_writer';
    const ROLE_SYSTEM_ANALYST = 'system_analyst';

    public static function getRoleLabel(string $role): string
    {
        return match($role) {
            self::ROLE_SUPERADMIN, self::ROLE_PROJECT_MANAGER => 'Project Manager',
            self::ROLE_FRONTEND_DEVELOPER => 'Frontend Developer',
            self::ROLE_BACKEND_DEVELOPER => 'Backend Developer',
            self::ROLE_TECHNICAL_WRITER => 'Technical Writer',
            self::ROLE_SYSTEM_ANALYST => 'System Analyst',
            'member_pending_assignment' => 'Team Member',
            default => 'Unknown',
        };
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'team_id',
        'membership_status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Check if user is a superadmin
     */
    public function isSuperAdmin(): bool
    {
        return $this->role === self::ROLE_SUPERADMIN;
    }

    /**
     * Check if user is a project manager
     */
    public function isProjectManager(): bool
    {
        return $this->role === self::ROLE_PROJECT_MANAGER;
    }

    /**
     * Check if user is a developer role (frontend, backend, technical writer, system analyst)
     */
    public function isDeveloper(): bool
    {
        return in_array($this->role, [
            self::ROLE_FRONTEND_DEVELOPER,
            self::ROLE_BACKEND_DEVELOPER,
            self::ROLE_TECHNICAL_WRITER,
            self::ROLE_SYSTEM_ANALYST,
            'member_pending_assignment',
        ]);
    }

    /**
     * Check if user can manage tasks (superadmin or project manager)
     */
    public function canManageTasks(): bool
    {
        return in_array($this->role, [self::ROLE_SUPERADMIN, self::ROLE_PROJECT_MANAGER]);
    }

    /**
     * Tasks created by this user
     */
    public function createdTasks()
    {
        return $this->hasMany(Task::class, 'created_by_user_id');
    }

    /**
     * Tasks assigned to this user
     */
    public function assignedTasks()
    {
        return $this->hasMany(Task::class, 'assigned_to_user_id');
    }

    /**
     * Team this user belongs to
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<Team, User>
     */
    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Check if user is approved team member
     */
    public function isApprovedMember(): bool
    {
        return $this->team_id && $this->membership_status === 'approved';
    }

    /**
     * Check if user has pending membership
     */
    public function hasPendingMembership(): bool
    {
        return $this->team_id && $this->membership_status === 'pending';
    }
}
