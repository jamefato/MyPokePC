<?php

use Illuminate\Support\Facades\Route;

Route::view('/', 'home') -> name('home');
Route::view('/dex', 'dex') -> name('dex');