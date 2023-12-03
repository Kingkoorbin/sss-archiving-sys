<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContributionRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'editor',
        'sss_no',
        'name',
        'date_of_employment',
        'date_of_resignation',
        'requester',
        'email',
        'phone_number',
        'date_needed',
        'status',
        'all'
    ];

    public function editor()
    {
        return $this->belongsTo(User::class, 'editor');
    }
}
