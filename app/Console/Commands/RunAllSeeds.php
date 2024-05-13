<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class RunAllSeeds extends Command
{
    protected $signature = 'run:seeds';
    protected $description = 'Run all database seeders';

    /**
     * Handles the execution of the command.
     *
     * This function runs the migrations, seeds the database with an administrator account,
     * user permissions, and signatories. It displays informational messages during the process.
     *
     * @return void
     */
    public function handle()
    {
        $this->info('Running migrations...');
        Artisan::call('migrate');

        $this->info('Running seeders...');

        $this->info('Seeding administrator account...');
        Artisan::call('db:seed', ['--class' => 'AdminUserSeeder']);

        $this->info('Seeding user permissions...');
        Artisan::call('db:seed', ['--class' => 'PermissionNameSeeder']);

        $this->info('Seeding signatories...');
        Artisan::call('db:seed', ['--class' => 'SignatoriesSeeder']);

        $this->info('Seeding completed.');
    }
}
