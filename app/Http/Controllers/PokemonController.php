<?php

namespace App\Http\Controllers;

use App\Models\Pokemon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Trainer;

class PokemonController extends Controller
{

    // GET Function, only returns your trainer's pokemon
    public function index() {
        return Pokemon::where('trainer_id', Auth::user()->trainerID)->get();
    }

    // POST Function
    public function store(Request $request) {

        // Using $validated since it helps prevent malicious data entry

        $validated = $request->validate([
            "species" => "required|string", 
            "nickname" => "nullable|string", 
            "level" => "nullable|integer",
            "gender" => "nullable|string", 
            "shiny" => "boolean", 
            "game" => "nullable|string", 
            "generation" => "nullable|integer", 
            "nature" => "nullable|string", 
            "location" => "nullable|string",
            "method" => "nullable|string",
            "ability" => "nullable|string", 
            "baseStats" => "nullable|array", 
            "dateCaught" => "nullable|date"
        ]);

        // Sets trainer ID to user
        
        $validated["trainer_id"] = Auth::user()->trainerID;


        // Everything regarding the trainer (incrementing counts)


        // For incrementing pokedex
        $newTrainerMon = !Pokemon::where("trainer_id", $validated["trainer_id"])->where("species", $validated["species"])->exists();

        // For incrementing shinydex
        $newTrainerShiny = false;
        if ($validated["shiny"]) {
            $newTrainerShiny = !Pokemon::where("trainer_id", $validated["trainer_id"])->where("shiny", true)->where("species", $validated["species"])->exists();
        }

        $pokemon = Pokemon::create($validated);
        $trainer = Trainer::find($validated["trainer_id"]);

        $trainer->increment("monCount");

        if ($validated["shiny"]) {
            $trainer->increment("shinyCount");
        }
        if ($newTrainerMon) {
            $trainer->increment("dexCount");
        }
        if ($newTrainerShiny) {
            $trainer->increment("shinyDex");
        }

        return response()->json($pokemon, 201);
    }
}