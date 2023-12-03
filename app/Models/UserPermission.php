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

    public function permissionName()
    {
        return $this->belongsTo(PermissionName::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
