<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class RunAllSeeds extends Command
{
    protected $signature = 'run:seeds';
    protected $description = 'Run all database seeders';

    public function handle()
    {
        $this->info('Running migrations...');
        Artisan::call('migrate');

        $this->info('Running seeders...');

        $this->info('Seeding administrator account...');
        Artisan::call('db:seed', ['--class' => 'AdminUserSeeder']);

        $this->info('Seeding user permissions...');
        Artisan::call('db:seed', ['--class' => 'PermissionNameSeeder']);

        $this->info('Seeding completed.');
    }
}
