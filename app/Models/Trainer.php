<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Trainer extends Model
{
    protected $table = 'trainer';
    protected $fillable =
    [
        "name", "dexCount", "monCount", "shinyCount", "shinyDex",
    ];
}
