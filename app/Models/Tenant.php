<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tenant extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_name',
        'description',
        'present_address',
        'address',
        'subscription_plan',
        'verified',
        'user_id',
    ];

    /**
     * Retrieve the user associated with this activity.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo The belongsTo relationship for the user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
