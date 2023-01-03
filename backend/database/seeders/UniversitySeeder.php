<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class UniversitySeeder extends Seeder
{

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $universities = [
            [
                'name' => 'Đại học Bách Khoa Hà Nội',
                'slug' => 'hust'
            ],
            [
                'name' => 'Đại học Kinh Tế Quốc Dân',
                'slug' => 'neu'
            ],
            [
                'name' => 'Đại học Xây Dựng',
                'slug' => 'nuce'
            ],
            [
                'name' => 'Đại học Mở Hà Nội',
                'slug' => 'hou'
            ]
        ];
        foreach ($universities as $university) {
            DB::table('universities')->insert([
                'name' => $university['name'],
                'slug' => $university['slug'],
            ]);
        }
    }
}
