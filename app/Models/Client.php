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

    public function workHistory()
    {
        return $this->hasMany(WorkHistory::class);
    }

    public function contributions()
    {
        return $this->hasMany(Contributions::class, 'sss_no', 'sss_no');
    }
}
