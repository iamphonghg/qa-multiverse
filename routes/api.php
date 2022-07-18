<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function () {
    Route::get('me', [AuthController::class, 'me']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
    Route::get('logout',  [AuthController::class, 'logout']);

    Route::post('create-post', [PostController::class, 'create']);
    Route::post('upvote', [PostController::class, 'upvote']);
    Route::post('downvote', [PostController::class, 'downvote']);
});
Route::get('posts/{verse}', [PostController::class, 'index']);
Route::get('posts/{verse}/{id}', [PostController::class, 'show']);

