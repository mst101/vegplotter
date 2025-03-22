<?php

namespace Database\Factories;

use App\Models\Plot;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class PlotFactory extends Factory
{
    protected $model = Plot::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'width' => $this->faker->randomFloat(),
            'length' => $this->faker->randomFloat(),
            'location_lat' => $this->faker->latitude(),
            'location_lng' => $this->faker->longitude(),
            'location_name' => $this->faker->city(),
            'units' => 'metres',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),

            'user_id' => User::factory(),
        ];
    }
}
