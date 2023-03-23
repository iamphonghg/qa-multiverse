<?php

namespace App\Http\Controllers;

use App\Models\Image;
use App\Models\Notification;
use App\Models\Post;
use App\Models\Report;
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
                ->paginate(10);

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

    public function updatePost(Request $request) {
        if (!\auth()->user()->can('vote')){
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền thực hiện hành động này'
            ]);
        }
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

    public function updateUserInfo(Request $request) {
        $user = auth()->user();
        $avatar = $request->file(['avatar']);
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

    public function reportPost(Request $request) {
        $postId = $request->get('postId');
        $reason = $request->get('reason');

        Report::create([
            'belong_to_model' => Post::class,
            'model_id' => $postId,
            'created_by_user_id' => auth()->id(),
            'reason' => $reason
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Báo cáo vi phạm thành công'
        ]);
    }

    public function reportUser(Request $request) {
        $userId = $request->get('userId');
        $reason = $request->get('reason');

        Report::create([
            'belong_to_model' => User::class,
            'model_id' => $userId,
            'created_by_user_id' => auth()->id(),
            'reason' => $reason
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Báo cáo vi phạm thành công'
        ]);
    }

    public function getNotifications() {
        if (!auth()->check()) {
            return null;
        }

        return Notification::where('type', 'all')
            ->orWhere(function ($q) {
                return $q->where('type', 'specific')
                    ->where('user_id', auth()->id());
            })->orderBy('created_at', 'desc')
            ->get();
    }

    public function toggleNewNoti() {
        if (!auth()->check()) {
            return null;
        }

        $notis = Notification::where('type', 'all')
            ->orWhere(function ($q) {
                return $q->where('type', 'specific')
                    ->where('user_id', auth()->id());
            })->orderBy('created_at', 'desc')
            ->get();

        foreach ($notis as $noti) {
            $readIds = json_decode($noti->read_ids);
            if (!in_array(auth()->id(), $readIds)) {
                $readIds[] = auth()->id();
            }

            $noti->read_ids = $readIds;
            $noti->save();
        }
    }
}
