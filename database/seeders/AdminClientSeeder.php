<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdminClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // $adminUserId = DB::table('users')->where('username', env('ADMIN_USERNAME'))->value('id');

        // if ($adminUserId) {
        //     DB::table('clients')->insert([
        //         'user_id' => $adminUserId,
        //         'first_name' => 'Historia',
        //         'middle_name' => 'Reiss',
        //         'last_name' => 'Jaeger',
        //         'present_address' => 'Shiganshina District',
        //         'permanent_address' => 'Paradis Island',
        //         'phone_number' => '+639277522772',
        //         'department' => 'College of Computer Science',
        //         'gender' => 'Male',
        //         'birthdate' => now()->subYears(30)->toDateString(),
        //         'active' => true,
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ]);
        // }
    }
}
