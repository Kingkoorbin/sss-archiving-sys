<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPermission extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'permission_name_id'
    ];

    /**
     * Retrieve the permission name associated with this user permission.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function permissionName()
    {
        return $this->belongsTo(PermissionName::class);
    }

    /**
     * Retrieve the user associated with this activity.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
