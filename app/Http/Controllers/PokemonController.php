<?php

namespace App\Http\Controllers;

use App\Models\Pokemon;
use Illuminate\Http\Request;

class PokemonController extends Controller
{

    // GET Function
    public function index() {
        return Pokemon::all();
    }

    // POST Function
    public function store(Request $request) {

        // Using $validated since it helps prevent malicious data entry

        $validated = $request->validate([
            "species" => "required|string", 
            "nickname" => "nullable|string", 
            "gender" => "nullable|string", 
            "shiny" => "boolean", 
            "level" => "nullable|integer",
            "game" => "nullable|string", 
            "generation" => "nullable|integer", 
            "nature" => "nullable|string", 
            "location" => "nullable|string",
            "method" => "nullable|string",
            "moves" => "nullable|string", 
            "baseStats" => "nullable|array", 
            "trainer_id" => "nullable|integer",
        ]);

        // Sets time caught as right now
        
        $validated["dateCaught"] = now();

        $pokemon = Pokemon::create($validated);
        return response()->json($pokemon, 201);
    }
}