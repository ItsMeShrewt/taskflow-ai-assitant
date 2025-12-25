<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property string $code
 * @property string|null $photo
 * @property int $created_by
 * @property string $created_at
 * @property string $updated_at
 */
class Team extends Model
{
    protected $fillable = [
        'name',
        'description',
        'code',
        'photo',
        'created_by',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function members(): HasMany
    {
        return $this->hasMany(User::class, 'team_id');
    }

    public function approvedMembers(): HasMany
    {
        return $this->hasMany(User::class, 'team_id')->where('membership_status', 'approved');
    }

    public function pendingMembers(): HasMany
    {
        return $this->hasMany(User::class, 'team_id')->where('membership_status', 'pending');
    }

    public static function generateUniqueCode(): string
    {
        do {
            $code = strtoupper(substr(md5(uniqid(rand(), true)), 0, 8));
        } while (self::where('code', $code)->exists());

        return $code;
    }
}
