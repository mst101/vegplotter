<?php

namespace Database\Seeders;

use App\Models\Plot;
use Database\Factories\UserFactory;
use Illuminate\Database\Seeder;
use Illuminate\Validation\Factory;

class PlotSeeder extends Seeder
{
    public function run(): void
    {
        Plot::factory()->create([
            'name' => 'My new plot',
            'user_id' => 1,
            'width' => 10,
            'length' => 7,
        ]);

        Plot::factory()->create([
            'name' => 'My new plot',
            'user_id' => 2,
            'width' => 10,
            'length' => 7,
        ]);
    }
}
