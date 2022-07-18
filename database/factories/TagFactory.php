<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class TagFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'university_id' => rand(1, 3),
            'user_id' => rand(1, 50),
            'name' => $this->faker->word()
        ];
    }
}
