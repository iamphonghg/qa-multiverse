<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Post extends Model
{
    use HasFactory;

    protected $appends = [
        'score',
        'isUpvoted',
        'isDownvoted',
        'answersCount',
        'isAcceptedAnswer',
        'upvoteCount',
        'downvoteCount',
        'images',
        'university'
    ];
    public $timestamps = false;

    protected $fillable = [
        'university_id',
        'user_id',
        'title',
        'body'
    ];

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'post_tags', 'post_id', 'tag_id');
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function comments() {
        return $this->hasMany(Comment::class)->with('user');
    }

    public function university() {
        return $this->belongsTo(University::class);
    }

    public function getImagesAttribute() {
        return Image::where('status', 'ready')
            ->where('model_id', $this->id)
            ->where('belong_to_model', Post::class)
            ->get();
    }

    public function getScoreAttribute()
    {
        $upvoteCount = Vote::where([
            ['post_id', '=', $this->id],
            ['vote_type', '=', 'upvote']
        ])->count();
        $downvoteCount = Vote::where([
            ['post_id', '=', $this->id],
            ['vote_type', '=', 'downvote']
        ])->count();

        return $upvoteCount - $downvoteCount;
    }
    public function getUpvoteCountAttribute()
    {
        $upvoteCount = Vote::where([
            ['post_id', '=', $this->id],
            ['vote_type', '=', 'upvote']
        ])->count();

        return $upvoteCount;
    }
    public function getDownvoteCountAttribute()
    {
        $downvoteCount = Vote::where([
            ['post_id', '=', $this->id],
            ['vote_type', '=', 'downvote']
        ])->count();

        return $downvoteCount;
    }

    public function getIsUpvotedAttribute() {
        return (bool) Vote::where([
            ['vote_type', '=', 'upvote'],
            ['user_id', '=', auth()->id()],
            ['post_id', '=', $this->id]
        ])->first();
    }

    public function getIsDownvotedAttribute() {
        return (bool) Vote::where([
            ['vote_type', '=', 'downvote'],
            ['user_id', '=', auth()->id()],
            ['post_id', '=', $this->id]
        ])->first();
    }

    public function getAnswersCountAttribute() {
        return Post::where('parent_id', $this->id)
            ->count();
    }

    public function getIsAcceptedAnswerAttribute() {
        $parentPost = Post::where('id', $this->parent_id)
            ->first();
        if ($parentPost) {
            if ($parentPost->accepted_answer_id == $this->id) {
                return true;
            }
        }
        return false;
    }

    public function getUniversityAttribute() {
        return University::find($this->university_id);
    }
}
