<?php

use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;


Route::prefix('user')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);

    Route::get('posts/{verse}', [PostController::class, 'index']);
    Route::get('posts/{verse}/{id}', [PostController::class, 'show']);
    Route::get('getPostAnswersIds/{verse}/{id}', [PostController::class, 'getPostAnswersIds']);
    Route::get('getPostAnswer/{verse}/{id}', [PostController::class, 'getPostAnswer']);
    Route::get('getUserInfo/{id}', [UserController::class, 'getUserInfo']);

    Route::get('getRelatedPosts/{id}', [PostController::class, 'getRelatedPosts']);

    Route::middleware('auth:api')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::get('logout',  [AuthController::class, 'logout']);
        Route::post('updateUserInfo', [UserController::class, 'updateUserInfo']);


        Route::post('createPost', [PostController::class, 'create']);
        Route::post('updatePost', [UserController::class, 'updatePost']);
        Route::post('reportPost', [UserController::class, 'reportPost']);
        Route::post('reportUser', [UserController::class, 'reportUser']);
        Route::post('toggleNewNoti', [UserController::class, 'toggleNewNoti']);
        Route::get('getNotifications', [UserController::class, 'getNotifications']);
        Route::post('upvote', [PostController::class, 'upvote']);
        Route::post('downvote', [PostController::class, 'downvote']);
        Route::post('comment', [CommentController::class, 'comment']);
        Route::post('markAsAcceptedAnswer', [PostController::class, 'markAsAcceptedAnswer']);
        Route::get('getAllPostsOfCurrentUser', [PostController::class, 'getAllPostsOfCurrentUser']);

    });
});

Route::prefix('admin')->group(function () {
    Route::post('login', [AdminAuthController::class, 'login']);
    Route::middleware('auth:admin')->group(function () {
        Route::get('me', [AdminAuthController::class, 'me']);
        Route::get('logout', [AdminAuthController::class, 'logout']);
        Route::get('getAllQuestionsCount', [AdminController::class, 'getAllQuestionsCount']);
        Route::get('getAllAnswersCount', [AdminController::class, 'getAllAnswersCount']);
        Route::get('getAllUsersCount', [AdminController::class, 'getAllUsersCount']);
        Route::get('postStatsByMonthInYear/{year}', [AdminController::class, 'getPostStatsByMonthInYear']);
        Route::get('userStatsByMonthInYear/{year}', [AdminController::class, 'getUserStatsByMonthInYear']);
        Route::get('postStatsByUniversity', [AdminController::class, 'getPostStatsByUniversity']);
        Route::get('getAllUsers', [AdminController::class, 'getAllUsers']);
        Route::get('getReports', [AdminController::class, 'getReports']);
        Route::post('updateUserInfo', [AdminController::class, 'updateUserInfo']);
        Route::post('createNotification', [AdminController::class, 'createNotification']);
        Route::post('updatePost', [AdminController::class, 'updatePost']);
        Route::post('toggleBlockUser', [AdminController::class, 'toggleBlockUser']);
        Route::get('getAllPosts', [AdminController::class, 'getAllPosts']);
        Route::get('getNotifications', [AdminController::class, 'getNotifications']);
        Route::post('deletePost', [AdminController::class, 'deletePost']);
        Route::post('changePermisison', [AdminController::class, 'changePermisison']);
        Route::post('reviewReport', [AdminController::class, 'reviewReport']);
    });
});

