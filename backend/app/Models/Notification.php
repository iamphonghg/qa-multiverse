<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $appends = [
        'target_user'
    ];

    protected $fillable = [
        'variant',
        'type',
        'user_id',
        'read_ids',
        'title',
        'description',
        'created_by_admin_id',
    ];

    public function getTargetUserAttribute() {
        return User::find($this->user_id);
    }

}
