<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

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
        'personnel_category',
        'suffix',
        'civil_status',
        'blood_type',
        'email',
        'tin',
        'sss_no',
        'philhealth_no',
        'pagibig_no',
        'rvm_retirement_no',
        'bpi_atm_account_no',
        'date_hired',
        'date_resigned',
        'main_employer',
        'address',
        // Relationships
        // 'user_id',
    ];

    // public function user()
    // {
    //     return $this->belongsTo(User::class);
    // }

    /**
     * Retrieves the work history associated with this client.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany The work history relationship.
     */
    public function workHistory()
    {
        return $this->hasMany(WorkHistory::class);
    }

    /**
     * Retrieves the contributions associated with this client.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function contributions()
    {
        return $this->hasMany(Contributions::class, 'sss_no', 'sss_no');
    }

    /**
     * Find a record by the SSS number.
     *
     * @param Builder $query The query builder instance.
     * @param mixed $sssNo The SSS number to search for.
     * @return Builder The query builder instance.
     */
    public function scopeFindBySSSNo(Builder $query, $sssNo)
    {
        return $query->where('sss_no', $sssNo);
    }

    /**
     * Retrieves the full name of the client.
     *
     * @return string The full name of the client.
     */
    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->middle_name} {$this->last_name}";
    }
}
