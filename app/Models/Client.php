<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id',
        'first_name',
        'middle_name',
        'last_name',
        'present_address',
        'permanent_address',
        'phone_number',
        'gender',
        'birthdate',
        'active',
        'department',

        // Relationships
        // 'user_id',
    ];

    // public function user()
    // {
    //     return $this->belongsTo(User::class);
    // }

    public function workHistory()
    {
        return $this->hasMany(WorkHistory::class);
    }
}
