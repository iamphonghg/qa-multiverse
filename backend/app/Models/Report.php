<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $appends = [
        'owner',
        'objectData',
    ];

    protected $fillable = [
        'belong_to_model',
        'model_id',
        'created_by_user_id',
        'status',
        'reason',
        'reviewed_at'
    ];

    public function getOwnerAttribute() {
        return User::find($this->created_by_user_id);
    }

    public function getObjectDataAttribute() {
        if ($this->belong_to_model == Post::class) {
            return Post::find($this->model_id);
        }
        return User::find($this->model_id);
    }
}
