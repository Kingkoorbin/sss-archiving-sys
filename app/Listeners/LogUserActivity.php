<?php

namespace App\Listeners;

use App\Events\UserActivity;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;

class LogUserActivity implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(UserActivity $event)
    {
        DB::table('activities')->insert([
            'action_name' => $event->actionName,
            'user_id' => $event->userId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
