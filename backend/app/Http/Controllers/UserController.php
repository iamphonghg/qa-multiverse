<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function getUserInfo($id) {
        $userInfo = User::find($id);
        if ($userInfo) {
            $postCount = Post::whereNull('parent_id')
                ->where('user_id', $id)->count();
            $answerCount = Post::whereNotNull('parent_id')
                ->where('user_id', $id)->count();

            $posts = Post::where('user_id', $id)
                ->with('university')
                ->get();

            return response()->json([
                'success' => true,
                'userInfo' => $userInfo,
                'stats' => [
                    'postCount' => $postCount,
                    'answerCount' => $answerCount
                ],
                'posts' => $posts
            ]);
        }
    }

    public function updateUserInfo(Request $request) {
        $user = auth()->user();
        $user->display_name = $request['displayName'];
        $user->about = $request['about'];
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật thông tin thành công'
        ]);
    }
}
