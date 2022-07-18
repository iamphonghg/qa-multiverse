<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Post extends Model
{
    use HasFactory;

    protected $appends = ['score', 'isUpvoted', 'isDownvoted', 'answersCount'];
    public $timestamps = false;

    protected $fillable = [
        'university_id',
        'user_id',
        'title',
        'body'
    ];

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
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

}
