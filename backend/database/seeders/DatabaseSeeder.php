<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Post;
use App\Models\PostTag;
use App\Models\Tag;
use App\Models\User;
use App\Models\Vote;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $tags = [
            'javascript',
            'python',
            'java',
            'c#',
            'php',
            'android',
            'html',
            'jquery',
            'c++',
            'css',
            'ios',
            'mysql',
            'sql',
            'r',
            'node.js',
            'reactjs',
            'arrays',
            'c',
            'asp.net',
            'json',
            'ruby-on-rails',
            '.net',
            'sql-server',
            'giaitich',
            'cautrucdulieu',
            'linhtinh',
            'django',
            'objective-c',
            'angular',
            'swift',
            'excel',
            'powerpoint',
            'linux',
            'iphone'
        ];
        $faker = Faker::create();

        $this->call([UniversitySeeder::class]);
        User::factory(50)->create();
        foreach ($tags as $tag) {
            Tag::factory()->create([
                'name' => $tag,
                'description' => $faker->paragraph(3)
            ]);
        }
        Post::factory(300)->create();

        DB::table('users')->insert([
            'display_name' => 'Admin',
            'email' => 'admin@qa.com',
            'password' => Hash::make('123123123')
        ]);

        foreach (range(1, 300) as $postId) {
            PostTag::factory()->create([
                'post_id' => $postId,
                'tag_id' => rand(1, count($tags))
            ]);
            $post = Post::find($postId);

            $acceptedAnswerPost = null;
            foreach (range(1, 5) as $i) {
                $childPosts = Post::factory()->create([
                    'user_id' => rand(1, 50),
                    'university_id' => $post->university_id,
                    'title' => '',
                    'body' => $faker->paragraph(5),
                    'parent_id' => $postId
                ]);

                if ($i === 1) {
                    $acceptedAnswerPost = $childPosts;
                }
            }

            $post->accepted_answer_id = $acceptedAnswerPost->id;
            $post->save();
        }

        foreach (range(1, 1800) as $postId) {
            Comment::factory(1)->create([
                'post_id' => $postId,
                'user_id' => rand(1, 51)
            ]);
            Comment::factory(1)->create([
                'post_id' => $postId,
                'user_id' => rand(1, 51)
            ]);
            Comment::factory(1)->create([
                'post_id' => $postId,
                'user_id' => rand(1, 51)
            ]);
        }

        $voteTypes = ['upvote', 'downvote'];
        foreach (range(1, 10000) as $i) {
            Vote::factory()->create([
                'user_id' => rand(1, 51),
                'post_id' => rand(1, 1800),
                'vote_type' => $voteTypes[rand(0, 1)]
            ]);
        }

        foreach (range(1, 51) as $userId) {
            $postIds = Post::where('user_id', $userId)->pluck('id');
            $upvoteCount = 0;
            $downvoteCount = 0;
            foreach ($postIds as $id) {
                $upvoteCount += Vote::where('post_id', $id)
                    ->where('vote_type', 'upvote')
                    ->count();
                $downvoteCount += Vote::where('post_id', $id)
                    ->where('vote_type', 'downvote')
                    ->count();
            }
            $reputation = $upvoteCount * 10 + $downvoteCount * -2;
            $user = User::find($userId);
            $user->up_votes = $upvoteCount;
            $user->down_votes = $downvoteCount;
            $user->reputation = $reputation;
            $user->save();
        }

        DB::table('admins')->insert([
            'display_name' => 'Sudo',
            'email' => 'sudo@qa.com',
            'password' => Hash::make('123123123')
        ]);
    }
}
