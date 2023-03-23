<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    public $timestamps = false;

    protected $appends = [
        'avatar',
        'canCreatePost',
        'canVote',
        'canEditPost',
        'canComment'
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'display_name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /*
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /*
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    public function getAvatarAttribute() {
        $avatar = Image::where('model_id', $this->id)
            ->where('belong_to_model', User::class)
            ->orderBy('created_at', 'desc')
            ->first();

        if ($avatar && $avatar->status == 'ready') {
            return $avatar;
        }
        return null;
    }

    public function getCanCreatePostAttribute() {
        return $this->can('create_post');
    }
    public function getCanVoteAttribute() {
        return $this->can('vote');
    }
    public function getCanEditPostAttribute() {
        return $this->can('edit_post');
    }
    public function getCanCommentAttribute() {
        return $this->can('comment');
    }
}
