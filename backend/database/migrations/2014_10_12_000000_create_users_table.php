<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('display_name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->text('about')->nullable();
            $table->integer('reputation')->default(0);
            $table->integer('up_votes')->default(0);
            $table->integer('down_votes')->default(0);
            $table->rememberToken();
            $table->string('status')->default('active');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('last_access_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
