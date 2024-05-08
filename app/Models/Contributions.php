<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contributions extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'sbr_date',
        'sbr_no',
        'sss_no',
        'ss',
        'ec',
        'total',
        'batchDate'
    ];

    /**
     * Saves a contribution with the given data.
     *
     * @param array $data The data to be saved.
     * @return Model The created contribution instance.
     */
    public static function saveContribution(array $data)
    {
        return self::create($data);
    }
}
