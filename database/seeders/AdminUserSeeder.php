<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'username' => env('ADMIN_USERNAME'),
            'verified_at' => now(),
            'password' => Hash::make(env('ADMIN_PASSWORD')),
            'role' => env('ADMIN_ROLE', 'ADMIN'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
