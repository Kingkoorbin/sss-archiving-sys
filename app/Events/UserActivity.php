<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;


class UserActivity
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $actionName;
    public $userId;

    public function __construct($actionName, $userId)
    {
        $this->actionName = $actionName;
        $this->userId = $userId;
    }
}
