<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\PostImage;
use App\Models\University;
use App\Models\Vote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    public function index($verse) {
        $university = University::where('slug', $verse)->first();
        if ($university) {
            $posts = Post::whereNull('parent_id')
                ->where('university_id', $university->id)
                ->orderBy('created_at', 'DESC')
                ->paginate(10);
            return response()->json($posts);
        }
    }

    public function show($verse, $id) {
        $university = University::where('slug', $verse)->first();
        if ($university) {
            $post = Post::whereNull('parent_id')->where([
                ['id', '=', $id],
                ['university_id', '=', $university->id]
            ])->first();
            if ($post) {
                $postAnswers = Post::where('parent_id', $post->id)->get();
                return response()->json([
                    'post' =>$post,
                    'postAnswers' => $postAnswers
                ]);

            }
        }
        return response()->json(['error' => [
            'code' => 404,
            'message' => 'Not found'
        ]]);
    }

    public function create(Request $request) {
        $userId = auth()->id();
        $university = University::where('slug', $request['verse'])->first();
        if ($university) {
            $newPostData = [
                'university_id' => $university->id,
                'title' => $request['title'],
                'body' => $request['body'],
                'user_id' => $userId
            ];
            $newPost = Post::create($newPostData);
            if ($request->file('images')) {
                foreach ($request->file('images') as $image) {
                    $filename = time().rand(1,10).'.'.$image->getClientOriginalExtension();
                    $directoryPath = "post_img/".$request['category'];
                    $image->move("uploaded_img/$directoryPath/", $filename);
                    PostImage::create([
                        'post_id' => $newPost->id,
                        'filename' => $filename,
                        'directory_path' => $directoryPath
                    ]);
                }
            }
            return response()->json([
                'success' => true,
                'message' => 'Successfully create new post',
                'newPostId' => $newPost->id
            ]);
        }
        return response()->json(['error' => [
            'success' => false,
            'message' => 'Not valid'
        ]]);
    }

    public function upvote(Request $request) {
        $postId = $request['postId'];
        $vote = Vote::where([
            ['post_id', '=', $postId],
            ['user_id', '=', auth()->id()],
            ['vote_type', '=', 'upvote']
        ])->first();
        if ($vote) {
            $vote->delete();
        } else {
            Vote::factory()->create([
                'post_id' => $postId,
                'user_id' => auth()->id(),
                'vote_type' => 'upvote'
            ]);
        }

        return response()->json([
            'success' => true
        ]);

    }

    public function downvote(Request $request) {
        $postId = $request['postId'];
        $vote = Vote::where([
            ['post_id', '=', $postId],
            ['user_id', '=', auth()->id()],
            ['vote_type', '=', 'downvote']
        ])->first();
        if ($vote) {
            $vote->delete();
        } else {
            Vote::factory()->create([
                'post_id' => $postId,
                'user_id' => auth()->id(),
                'vote_type' => 'downvote'
            ]);
        }

        return response()->json([
            'success' => true
        ]);
    }

}
