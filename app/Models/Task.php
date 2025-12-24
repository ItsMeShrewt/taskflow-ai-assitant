<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property int $user_id
 * @property int|null $assigned_to_user_id
 * @property int|null $created_by_user_id
 * @property string $title
 * @property string|null $description
 * @property string $priority
 * @property string $status
 * @property string|null $due_date
 * @property string|null $viewed_at
 * @property int|null $estimated_time
 * @property int|null $actual_time
 * @property string $created_at
 * @property string $updated_at
 * @property string|null $deleted_at
 * @property-read int $progress_percentage
 * @property-read \Illuminate\Database\Eloquent\Collection|Subtask[] $subtasks
 * @property-read User|null $assignedTo
 * @property-read User|null $createdBy
 * @property-read User $user
 */
class Task extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'priority',
        'status',
        'due_date',
        'viewed_at',
        'estimated_time',
        'actual_time',
        'assigned_to_user_id',
        'created_by_user_id',
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'viewed_at' => 'datetime',
        'estimated_time' => 'integer',
        'actual_time' => 'integer',
    ];

    protected $appends = [
        'progress_percentage',
    ];

    protected $with = [
        'subtasks',
        'assignedTo',
        'createdBy',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * User who this task is assigned to
     */
    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to_user_id');
    }

    /**
     * User who created this task
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    public function subtasks(): HasMany
    {
        return $this->hasMany(Subtask::class)->orderBy('order');
    }

    public function getProgressPercentageAttribute(): int
    {
        $subtasksCount = $this->subtasks()->count();
        
        if ($subtasksCount === 0) {
            return $this->status === 'completed' ? 100 : 0;
        }

        $completedSubtasks = $this->subtasks()->where('status', 'completed')->count();
        return (int) (($completedSubtasks / $subtasksCount) * 100);
    }

    /**
     * Check if task is unread by the assigned member
     */
    public function isUnread(): bool
    {
        return $this->viewed_at === null && $this->assigned_to_user_id !== null;
    }
}
