<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function comment(Request $request) {
        try {
            Comment::factory()->create([
                'post_id' => $request['postId'],
                'user_id' => auth()->id(),
                'body' => $request['body']
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Bình luận thành công'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra'
            ]);
        }
    }
}
