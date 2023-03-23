<?php

namespace App\Http\Controllers;

use App\Models\Image;
use App\Models\Notification;
use App\Models\Post;
use App\Models\PostTag;
use App\Models\Report;
use App\Models\University;
use App\Models\User;
use App\Models\Vote;
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

    public function getAllUsers(Request $request) {
        $searchString = $request->searchString;
        $statusQuery = $request->statusQuery;
        $users = User::when(strlen($searchString) >= 1, function ($query) use ($searchString) {
            return $query->where('display_name', 'like', '%'.$searchString.'%');
        })
            ->when($statusQuery and  $statusQuery != 'all', function ($query) use ($statusQuery) {
                return $query->where('status', $statusQuery);
            })
            ->simplePaginate(10);
        return response()->json($users);
    }

    public function getAllPosts(Request $request) {
        $searchString = $request->searchString;
        $statusQuery = $request->statusQuery;
        $posts = Post::whereNull('parent_id')
            ->when(strlen($searchString) >= 1, function ($query) use ($searchString) {
                return $query->where('title', 'like', '%'.$searchString.'%')
                    ->orWhere('body', 'like', '%'.$searchString.'%');
            })
//            ->when($statusQuery and  $statusQuery != 'all', function ($query) use ($statusQuery) {
//                return $query->where('status', $statusQuery);
//            })
            ->with(['user', 'university'])
            ->simplePaginate(10);
        return response()->json($posts);
    }

    public function deletePost(Request $request) {
        $postId = $request->id;
        $postToDelete = Post::find($postId);
        if ($postToDelete) {
            PostTag::where('post_id', $postToDelete->id)->delete();
            Vote::where('post_id', $postToDelete->id)->delete();
            $postToDelete->tags()->delete();
            $postToDelete->comments()->delete();
            $postToDelete->delete();
        }

        Notification::create([
            'variant' => 'dangerous',
            'type' => 'specific',
            'user_id' => $postToDelete->user_id,
            'read_ids' => json_encode([]),
            'title' => "Bài đăng của bạn vừa bị xóa do vi phạm",
            'description' => 'Vui lòng tuân thủ nghiêm luật lệ',
            'created_by_admin_id' => auth('admin')->id()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Xóa bài đăng thành công'
        ]);
    }

    public function updateUserInfo(Request $request) {
        $user = User::find($request['id']);
        $avatar = $request->file(['avatar']);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Người dùng không tồn tại hoặc đã bị xóa'
            ]);
        }

        $user->display_name = $request['displayName'];
        $user->about = $request['about'];
        $user->save();

        if ($avatar) {
            $originalName = $avatar->getClientOriginalName();
            $originalExtension = $avatar->getClientOriginalExtension();
            $fileSize = $avatar->getSize();
            $filename = time().rand(1,10).'.'.$originalExtension;
            $avatar->move("uploaded_img/avatar/", $filename);
            Image::create([
                'model_id' => $user->id,
                'belong_to_model' => User::class,
                'name' => $filename,
                'original_name' => $originalName,
                'size' => $fileSize,
                'status' => 'ready',
                'extension' => $originalExtension
            ]);

        } else if ($user->avatar && $request['oldAvatar'] == 'null') {
            $oldAvatar = $user->avatar;
            $oldAvatar->status = 'deleted';
            $oldAvatar->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật thông tin thành công'
        ]);

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

    public function updatePost(Request $request) {
        $postId = $request->get('postId');
        $newTitle = $request->get('title');
        $newBody = $request->get('body');
        $postToUpdate = Post::find($postId);
        $newImages = $request->file('images');
        $oldImagesJsonStr = $request->get('oldImages');

        $oldImages = collect(json_decode($oldImagesJsonStr, true));
        $removedImages = $postToUpdate->images->filter(function ($image) use ($oldImages) {
            return !$oldImages->where('id', $image->id)->first();
        });
        if ($removedImages->count()) {
            foreach ($removedImages as $image) {
                $image->status = 'deleted';
                $image->update();
            }
        }

        if ($newImages) {
            foreach ($newImages as $image) {
                $originalName = $image->getClientOriginalName();
                $originalExtension = $image->getClientOriginalExtension();
                $fileSize = $image->getSize();
                $filename = time().rand(1,10).'.'.$originalExtension;
                $image->move("uploaded_img/post_img/", $filename);
                Image::create([
                    'model_id' => $postToUpdate->id,
                    'belong_to_model' => Post::class,
                    'name' => $filename,
                    'original_name' => $originalName,
                    'size' => $fileSize,
                    'status' => 'ready',
                    'extension' => $originalExtension
                ]);
            }
        }

        $postToUpdate->title = $newTitle;
        $postToUpdate->body = $newBody;
        $postToUpdate->update();

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật thành công'
        ]);
    }

    public function getReports(Request $request) {
        $type = $request->get('type');
        $status = $request->get('status');

        if ($type == 'post') {
            $reports = Report::where('belong_to_model', Post::class)
                ->where('status', $status)
                ->paginate(10);
        } else {
            $reports = Report::where('belong_to_model', User::class)
                ->where('status', $status)
                ->paginate(10);
        }

        return $reports;
    }

    public function createNotification(Request $request) {
        $specific = $request->get('specific');
        $variant = $request->get('variant');
        $title = $request->get('title');
        $description = $request->get('description');
        $email = $request->get('email');

        if (!$title) {
            return response()->json([
                'success' => false,
                'message' => 'Thiếu trường tiêu đề'
            ]);
        }

        if ($specific && !$email) {
            return response()->json([
                'success' => false,
                'message' => 'Thiếu trường email'
            ]);
        }

        if ($specific) {
            $user = User::where('email', $email)->first();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Người dùng không tồn tại'
                ]);
            }

            Notification::create([
                'variant' => $variant,
                'type' => 'specific',
                'user_id' => $user->id,
                'read_ids' => json_encode([]),
                'title' => $title,
                'description' => $description,
                'created_by_admin_id' => auth('admin')->id()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Tạo thông báo thành công'
            ]);
        }

        Notification::create([
            'variant' => $variant,
            'type' => 'all',
            'read_ids' => json_encode([]),
            'title' => $title,
            'description' => $description,
            'created_by_admin_id' => auth('admin')->id()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Tạo thông báo thành công'
        ]);
    }

    public function getNotifications() {
        return Notification::paginate(10);
    }

    public function changePermisison(Request $request) {
        $userId = $request->get('userId');
        $isRevoke = $request->get('isRevoke');
        $permission = $request->get('permission');

        /** @var User $user */
        $user = User::find($userId);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy người dùng'
            ]);
        }

        if ($isRevoke) {
            $user->revokePermissionTo($permission);
        } else {
            $user->givePermissionTo($permission);
        }

        Notification::create([
            'variant' => $isRevoke ? 'dangerous' : 'info',
            'type' => 'specific',
            'user_id' => $user->id,
            'read_ids' => json_encode([]),
            'title' => $isRevoke
                ? "Bạn vừa bị thu hồi quyền $permission do vi phạm tiêu chuẩn cộng đồng"
                : "Bạn vừa được mở quyền $permission, vui lòng tuân thủ tiêu chuẩn cộng đồng.",
            'description' => $isRevoke ? 'Xin chia buồn' : 'Xin chúc mừng',
            'created_by_admin_id' => auth('admin')->id()
        ]);
        return response()->json([
            'success' => true,
            'message' => 'Thành công!'
        ]);
    }

    public function reviewReport(Request $request) {
        $reportId = $request->get('reportId');

        $report = Report::find($reportId);

        $report->status = 'reviewed';
        $report->reviewed_at = now();

        $report->save();

        Notification::create([
            'variant' => 'info',
            'type' => 'specific',
            'user_id' => $report->created_by_user_id,
            'read_ids' => json_encode([]),
            'title' => "Xin cảm ơn rất nhiều về báo cáo của bạn.",
            'description' => 'Thank you',
            'created_by_admin_id' => auth('admin')->id()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Thành công!'
        ]);
    }
}
