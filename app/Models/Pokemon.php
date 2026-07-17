<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pokemon extends Model
{
    protected $fillable = [
        "species", "nickname", "gender", "shiny", "level", 
        "dateCaught", "game", "generation", "nature", "location", 
        "method", "ability", "baseStats", "trainer_id", 
    ];

    protected $casts = [
        "baseStats" => "array",
    ];
}
