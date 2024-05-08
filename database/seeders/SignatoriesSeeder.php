<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SignatoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Seed the signatories table.
     *
     * @return void
     */
    public function run()
    {
        DB::table('signatories')->insert([
            [
                'payroll_incharge' => "Ms. Cristice Lyn. Abamonga",
                'vp_finance' => "S. Maria Mae M. Anacaya, RVM",
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]); // seed the signatories table
    }
}
