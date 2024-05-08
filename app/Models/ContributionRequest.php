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
        'all',
        'relationship'
    ];

    /**
     * Retrieve the user that is associated with this contribution request as the editor.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo The belongsTo relationship for the editor.
     */
    public function editor()
    {
        return $this->belongsTo(User::class, 'editor');
    }
}
