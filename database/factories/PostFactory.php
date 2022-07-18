<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id' => rand(1, 50),
            'university_id' => rand(1, 3),
            'title' => $this->faker->sentence(),
            'body' => $this->faker->paragraph(5)
        ];
    }
}
