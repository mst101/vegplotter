<?php

namespace Database\Seeders;

use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
//        User::factory()->withPersonalTeam()->create([
//            'name' => 'Test user',
//            'email' => 'test@example.com',
//            'password' => Hash::make('password')
//        ]);

//        User::factory()->withPersonalTeam()->create([
//            'name' => 'Mark Thompson',
//            'email' => 'info@hiddengambia.com',
//            'password' => Hash::make('password')
//        ]);

//        User::factory()->withPersonalTeam()->create([
//            'name' => 'David White',
//            'email' => 'david@hiddengambia.com',
//            'password' => Hash::make('password'),
//            'current_team_id' => 2,
//        ]);

//        User::factory()
//            ->hasAttached(
//                Team::factory()
//                    ->state(function (array $attributes, User $user) {
//                        return ['user_id' => $user->id, 'personal_team' => true];
//                    }),
//            )->create();

        User::factory()
            ->withPersonalTeam()
            ->hasAttached(
                Team::factory()
                    ->state(function (array $attributes, User $user) {
                        return [
                            'name' => 'Testing team',
                            'user_id' => $user->id,
                        ];
                    }),
            )->create([
                'name' => 'Test user',
                'email' => 'test@example.com',
            ]);

        User::factory()
            ->hasAttached(
                Team::factory()
                    ->state(function (array $attributes, User $user) {
                        return [
                            'name' => 'Footsteps',
                            'user_id' => $user->id,
                        ];
                    }),
            )->create([
                'name' => 'Mark Thompson',
                'email' => 'info@hiddengambia.com',
            ]);

        User::factory()
            ->hasAttached(
                Team::where('name', 'Footsteps')->first()
            )->create([
                'name' => 'David White',
                'email' => 'david@hiddengambia.com',
            ]);
    }
}
