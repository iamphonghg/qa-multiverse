<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('accepted_answer_id')->nullable();
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('university_id')->constrained();
            $table->string('title')->nullable();
            $table->text('body');
            $table->string('status')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('last_voted_at')->nullable();
            $table->timestamp('last_activity_at')->nullable();
            $table->timestamp('last_edited_at')->useCurrent();
            $table->timestamp('closed_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('posts');
    }
}
