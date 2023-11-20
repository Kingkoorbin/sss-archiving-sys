<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdminWorkHistorytSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // $adminUserId = DB::table('users')->where('username', env('ADMIN_USERNAME'))->value('id');
        // $clientId = DB::table('clients')->where('id', $adminUserId)->value('id');

        // $workHistories = [
        //     [
        //         "id"=> 1,
        //         "client_id"=> $clientId,
        //         "company_name"=> "Attack On Titan",
        //         "position"=> "Training Corps",
        //         "start_date"=> "2022-01-01",
        //         "end_date"=> "2023-01-01",
        //         "responsibilities"=> "Enlisted in the military's Training Corps along with his friends Mikasa Ackerman and Armin Arlert.",
        //         "created_at"=> now(),
        //         "updated_at"=> now()
        //     ],
        //     [
        //         "id"=> 2,
        //         "client_id"=> $clientId,
        //         "company_name"=> "Attack On Titan",
        //         "position"=> "Training Corps",
        //         "start_date"=> "2022-01-01",
        //         "end_date"=> "2023-01-01",
        //         "responsibilities"=> "Discovered his ability to transform into a Titan during a traumatic event, marking the beginning of the mysteries surrounding his powers.",
        //         "created_at"=> now(),
        //         "updated_at"=> now()
        //     ],
        //     [
        //         "id"=> 3,
        //         "client_id"=> $clientId,
        //         "company_name"=> "Attack On Titan",
        //         "position"=> "Survey Corps",
        //         "start_date"=> "2022-01-01",
        //         "end_date"=> "2023-01-01",
        //         "responsibilities"=> "Graduated from the Training Corps and joined the elite Survey Corps to fight against Titans.",
        //         "created_at"=>now(),
        //         "updated_at"=>now()
        //     ],
        //     [
        //         "id"=> 4,
        //         "client_id"=> $clientId,
        //         "company_name"=> "Attack On Titan",
        //         "position"=> "Survey Corps",
        //         "start_date"=> "2022-01-01",
        //         "end_date"=> "2023-01-01",
        //         "responsibilities"=> "Uncovered the truth about the Titans, the Walls, and the government conspiracy.",
        //         "created_at"=> now(),
        //         "updated_at"=> now()
        //     ],
        //     [
        //         "id"=> 5,
        //         "client_id"=> $clientId,
        //         "company_name"=> "Attack On Titan",
        //         "position"=> "Titan Shifters",
        //         "start_date"=> "2022-01-01",
        //         "end_date"=> "2023-01-01",
        //         "responsibilities"=> "Revealed to be a Titan Shifter with the ability to transform into a Titan at will.",
        //         "created_at"=> now(),
        //         "updated_at"=> now()
        //     ],
        //     [
        //         "id"=> 6,
        //         "client_id"=> $clientId,
        //         "company_name"=> "Attack On Titan",
        //         "position"=> "Titan Shifters",
        //         "start_date"=> "2022-01-01",
        //         "end_date"=> "2023-01-01",
        //         "responsibilities"=> "Learned about the existence of other Titan Shifters, including Reiner Braun and Annie Leonhart.",
        //         "created_at"=> now(),
        //         "updated_at"=> now()
        //     ],
        //     [
        //         "id"=> 7,
        //         "client_id"=> $clientId,
        //         "company_name"=> "Attack On Titan",
        //         "position"=> "Warrior Infiltration",
        //         "start_date"=> "2022-01-01",
        //         "end_date"=> "2023-01-01",
        //         "responsibilities"=> "Confronted the traitorous Titans who were initially his comrades=> Reiner and Bertholdt",
        //         "created_at"=> now(),
        //         "updated_at"=> now()
        //     ],
        //     [
        //         "id"=> 8,
        //         "client_id"=> $clientId,
        //         "company_name"=> "Attack On Titan",
        //         "position"=> "Warrior Infiltration",
        //         "start_date"=> "2022-01-01",
        //         "end_date"=> "2023-01-01",
        //         "responsibilities"=> "Engaged in battles within Wall Rose, leading to the capture of Annie and the revelation of the Titan Shifters' mission.",
        //         "created_at"=> now(),
        //         "updated_at"=> now()
        //     ],
        //     [
        //         "id"=> 9,
        //         "client_id"=> $clientId,
        //         "company_name"=> "Attack On Titan",
        //         "position"=> "The Ocean and Marley",
        //         "start_date"=> "2022-01-01",
        //         "end_date"=> "2023-01-01",
        //         "responsibilities"=> "Explored the ocean with his friends after reaching the sea, fulfilling a childhood dream.",
        //         "created_at"=> now(),
        //         "updated_at"=> now()
        //     ],
        //     [
        //         "id"=> 10,
        //         "client_id"=> $clientId,
        //         "company_name"=> "Attack On Titan",
        //         "position"=> "The Ocean and Marley",
        //         "start_date"=> "2022-01-01",
        //         "end_date"=> "2023-01-01",
        //         "responsibilities"=> "Discovered the existence of the nation of Marley, where Titans were being used as weapons.",
        //         "created_at"=> now(),
        //         "updated_at"=> now()
        //     ],
        //     [
        //         "id"=> 11,
        //         "client_id"=> $clientId,
        //         "company_name"=> "Attack On Titan",
        //         "position"=> "Rumbling and World Conflict",
        //         "start_date"=> "2022-01-01",
        //         "end_date"=> "2023-01-01",
        //         "responsibilities"=> "Uncovered the truth about the history of Eldia, Marley, and the global conflict involving Titans.",
        //         "created_at"=> now(),
        //         "updated_at"=> now()
        //     ],
        //     [
        //         "id"=> 12,
        //         "client_id"=> $clientId,
        //         "company_name"=> "Attack On Titan",
        //         "position"=> "Rumbling and World Conflict",
        //         "start_date"=> "2022-01-01",
        //         "end_date"=> "2023-01-01",
        //         "responsibilities"=> "Decided to initiate the Rumbling, a plan to use the Founding Titan's power to eliminate the threat from Marley and the world.",
        //         "created_at"=> now(),
        //         "updated_at"=> now()
        //     ],
        // ];

        // foreach ($workHistories as $workHistory) {
        //     DB::table('work_histories')->insert($workHistory);
        // }
    }
}
