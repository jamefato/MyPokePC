<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\DexController;
use App\Http\Controllers\AboutController;
use App\Http\Controllers\InfoController;
use App\Http\Controllers\PokemonController;

Route::get('/', [AboutController::class, 'about'])->name('about');

Route::get('/register', [RegisterController::class, 'showRegistrationForm'])->name('register');
Route::post('/register', [RegisterController::class, 'register']);

Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'login']);

Route::get('/logout', [LoginController::class, 'logout'])->name('logout');

Route::get('/home', [HomeController::class, 'home'])->name('home')->middleware('auth');

Route::get('/dex', [DexController::class, 'dex'])->name('dex')->middleware('auth');

Route::get('/info', [InfoController::class, 'info'])->name('info')->middleware('auth');

Route::view('/register', 'register') -> name('register');

Route::get('/api/pokemon', [PokemonController::class, 'index']);
Route::post('/api/pokemon', [PokemonController::class, 'store']);