<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PokemonController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// For Pokemon objects

Route::get("/pokemon", [PokemonController::class, "index"]);
Route::post("/pokemon", [PokemonController::class, "store"]);