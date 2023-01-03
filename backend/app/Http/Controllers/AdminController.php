<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\University;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function getAllQuestionsCount() {
        $questionsCount = Post::whereNull('parent_id')
            ->count();

        return response()->json([
            'allQuestionsCount' => $questionsCount
        ]);
    }

    public function getAllAnswersCount() {
        $answersCount = Post::whereNotNull('parent_id')
            ->count();

        return response()->json([
            'allAnswersCount' => $answersCount
        ]);
    }

    public function getAllUsersCount() {
        $usersCount = User::all()
            ->count();

        return response()->json([
            'allUsersCount' => $usersCount
        ]);
    }

    public function getPostStatsByMonthInYear($year) {
        $posts = Post::whereNull('parent_id')
            ->whereYear('created_at', $year)
            ->select(
                DB::raw("MONTH(created_at) month"),
                DB::raw("count('month') as posts_count"))
            ->groupby('month')
            ->orderBy('month')
            ->get();
        return response()->json($posts);
    }

    public function getUserStatsByMonthInYear($year) {
        $users = User::whereYear('created_at', $year)
            ->select(
                DB::raw("MONTH(created_at) month"),
                DB::raw("count('month') as users_count"))
            ->groupby('month')
            ->orderBy('month')
            ->get();
        return response()->json($users);
    }

    public function getPostStatsByUniversity() {
        $universities = University::withCount('posts')->get()->makeHidden(['id']);

        return response()->json($universities);
    }

    public function getAllUsers() {
        $users = User::simplePaginate(10);
        return response()->json($users);
    }

    public function updateUserInfo(Request $request) {
        $user = User::find($request['id']);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Người dùng không tồn tại hoặc đã bị xóa'
            ]);
        }

        try {
            $user->display_name = $request['displayName'];
            $user->about = $request['about'];
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật thông tin thành công'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cập nhật thông tin thất bại'
            ]);
        }
    }

    public function toggleBlockUser(Request $request) {
        $user = User::find($request['userId']);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Người dùng không tồn tại hoặc đã bị xóa'
            ]);
        }
        if ($request['type'] === 'block') {
            try {
                $user->status = 'blocked';
                $user->save();
                return response()->json([
                    'success' => true,
                    'message' => 'Khóa người dùng thành công'
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'success' => true,
                    'message' => 'Khóa người dùng thất bại'
                ]);
            }
        } else {
            try {
                $user->status = 'active';
                $user->save();
                return response()->json([
                    'success' => true,
                    'message' => 'Mở khóa người dùng thành công'
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'success' => true,
                    'message' => 'Mở khóa người dùng thất bại'
                ]);
            }
        }
    }
}
