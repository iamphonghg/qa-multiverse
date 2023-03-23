<?php

namespace App\Http\Controllers;

use App\Models\Image;
use App\Models\Post;
use App\Models\PostImage;
use App\Models\PostTag;
use App\Models\Tag;
use App\Models\University;
use App\Models\User;
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
                ->with('user')
                ->orderBy('created_at', 'DESC')
                ->paginate(10);
            return response()->json($posts);
        }
    }

    public function show($verse, $id) {
        $university = University::where('slug', $verse)->first();
        if ($university) {
            $post = Post::whereNull('parent_id')
                ->where([
                    ['id', '=', $id],
                    ['university_id', '=', $university->id]
                ])
                ->with('user')
                ->with('comments')
                ->with('tags')
                ->first();
            if ($post) {
                return response()->json([
                    'success' => true,
                    'post' => $post
                ]);
            }
        }
        return response()->json([
            'success' => false,
            'message' => 'Tin đăng không tồn tại'
        ]);
    }

    public function getPostAnswersIds($verse, $id) {
        $university = University::where('slug', $verse)->first();
        if ($university) {
            $post = Post::find($id);
            if (!$post->parent_id) {
                $postAnswersIds = Post::where('parent_id', $id)
                    ->with('user')
                    ->with('comments')
                    ->pluck('id');
                return response()->json([
                    'success' => true,
                    'postAnswersIds' => $postAnswersIds,
                    'authorId' => $post->user_id
                ]);
            }
        }

        return response()->json([
            'success' => false,
            'message' => 'Tin đăng không tồn tại'
        ]);
    }

    public function getPostAnswer($verse, $id) {
        $university = University::where('slug', $verse)->first();
        if ($university) {
            $post = Post::where([
                    ['id', '=', $id],
                    ['university_id', '=', $university->id]
                ])
                ->with('user')
                ->with('comments')
                ->first();
            if ($post) {
                return response()->json([
                    'success' => true,
                    'post' =>$post
                ]);

            }
        }
        return response()->json([
            'success' => false,
            'message' => 'Not found'
        ]);
    }

    public function create(Request $request) {
        if (!\auth()->user()->can('create_post')){
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền thực hiện hành động này'
            ]);
        }
        $userId = auth()->id();
        $images = $request->file('images');
//        dd($request->all());
        $university = University::where('slug', $request['verse'])->first();
        if ($university) {
            $newPostData = [
                'university_id' => $university->id,
                'title' => $request['title'],
                'body' => $request['body'],
                'user_id' => $userId,
                'parent_id' => $request['parentId']
            ];
            $newPost = Post::factory()
                ->create($newPostData);
            if ($images) {
                foreach ($images as $image) {
                    $originalName = $image->getClientOriginalName();
                    $originalExtension = $image->getClientOriginalExtension();
                    $fileSize = $image->getSize();
                    $filename = time().rand(1,10).'.'.$originalExtension;
                    $image->move("uploaded_img/post_img/", $filename);
                    Image::create([
                        'model_id' => $newPost->id,
                        'belong_to_model' => Post::class,
                        'name' => $filename,
                        'original_name' => $originalName,
                        'size' => $fileSize,
                        'status' => 'ready',
                        'extension' => $originalExtension
                    ]);
                }
            }
            if ($request['tags'] and count(explode(',', $request['tags'])) > 0) {
                foreach (explode(',', $request['tags']) as $tag) {
                    $newTag = Tag::factory()->create([
                        'university_id' => $university->id,
                        'user_id' => auth()->id(),
                        'name' => $tag
                    ]);
                    PostTag::factory()->create([
                        'post_id' => $newPost->id,
                        'tag_id' => $newTag->id
                    ]);
                }
            }
            return response()->json([
                'success' => true,
                'message' => 'Thành công',
                'newPostId' => $newPost->id
            ]);
        }
        return response()->json([
            'success' => false,
            'message' => 'Dữ liệu không phù hợp'
        ]);
    }

    public function upvote(Request $request) {
        if (!\auth()->user()->can('vote')){
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền thực hiện hành động này'
            ]);
        }
        $postId = $request['postId'];
        $upvote = Vote::where([
            ['post_id', '=', $postId],
            ['user_id', '=', auth()->id()],
            ['vote_type', '=', 'upvote']
        ])->first();
        $downvote = Vote::where([
            ['post_id', '=', $postId],
            ['user_id', '=', auth()->id()],
            ['vote_type', '=', 'downvote']
        ])->first();
        $post = Post::find($postId);
        $user = $post->user;
        if ($upvote) {
            $upvote->delete();
            $user->reputation = $user->reputation - 2;
            $user->save();
        } else {
            if ($downvote) {
                $downvote->delete();
                $user->reputation = $user->reputation + 2;
                $user->save();
            }
            $user->reputation = $user->reputation + 2;
            $user->save();
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
        if (!\auth()->user()->can('vote')){
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền thực hiện hành động này'
            ]);
        }
        $postId = $request['postId'];
        $downvote = Vote::where([
            ['post_id', '=', $postId],
            ['user_id', '=', auth()->id()],
            ['vote_type', '=', 'downvote']
        ])->first();
        $upvote = Vote::where([
            ['post_id', '=', $postId],
            ['user_id', '=', auth()->id()],
            ['vote_type', '=', 'upvote']
        ])->first();
        $post = Post::find($postId);
        $user = $post->user;
        if ($downvote) {
            $downvote->delete();
            $user->reputation = $user->reputation + 2;
            $user->save();
        } else {
            if ($upvote) {
                $upvote->delete();
                $user->reputation = $user->reputation - 2;
                $user->save();
            }

            $user->reputation = $user->reputation - 2;
            $user->save();
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

    public function markAsAcceptedAnswer(Request $request) {
        $parentPost = Post::find($request['postId']);
        if (auth()->id() != $parentPost->user_id) {
            return response()->json([
                'success' => false
            ]);
        }
        if ($parentPost->accepted_answer_id === $request['acceptedAnswerId']) {
            $parentPost->accepted_answer_id = null;
            $parentPost->save();
            return response()->json([
                'success' => true,
                'message' => 'Bỏ đánh dấu thành công'
            ]);
        }
        $parentPost->accepted_answer_id = $request['acceptedAnswerId'];
        $parentPost->save();
        return response()->json([
            'success' => true,
            'message' => 'Đánh dấu thành công'
        ]);
    }

    public function getAllPostsOfCurrentUser() {
        $posts = Post::whereNull('parent_id')
            ->where('user_id', auth()->id())
            ->with('user')
            ->with('university')
            ->orderBy('created_at', 'DESC')
            ->paginate(10);
        return response()->json($posts);
    }

    public function getRelatedPosts($id) {
        $postToFind = Post::find($id);
        if (!$postToFind) {
            return [
                'success' => true,
                'relatedPosts' => []
            ];
        }

        $relatedPosts = collect([]);

        $tags = $postToFind->tags;

        foreach ($tags as $tag) {
            $posts = $tag->posts;
            foreach ($posts as $post) {
                $relatedPosts->push($post);
            }
        }

        $relatedPosts = $relatedPosts->where('id', '!=', $id)
            ->where('university_id', $postToFind->university_id)
            ->whereNull('parent_id')
            ->values();

        return [
            'success' => true,
            'relatedPosts' => $relatedPosts->toArray()
        ];
    }

}
