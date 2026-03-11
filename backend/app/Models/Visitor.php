<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Visitor extends Model
{
    protected $fillable = ['name', 'phone', 'flat', 'purpose', 'status', 'photo_path', 'rejection_reason'];
}
