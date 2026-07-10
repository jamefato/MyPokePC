<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pokemon extends Model
{
    protected $fillable = [
        "species", "nickname", "gender", "shiny", "level", 
        "dateCaught", "game", "generation", "nature", "location", 
        "method", "moves", "baseStats", "trainer_id", 
    ];
}
