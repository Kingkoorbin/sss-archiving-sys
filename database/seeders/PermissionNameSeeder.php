<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PermissionNameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('permission_names')->insert([
            [
                'name' => "View",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => "Edit",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => "Generate",
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
