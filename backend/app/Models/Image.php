<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'name',
        'original_name',
        'belong_to_model',
        'model_id',
        'size',
        'status',
        'extension',
        'deleted_at'
    ];
}
