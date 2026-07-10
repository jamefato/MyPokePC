<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Trainer;

class HomeController extends Controller
{
    public function home()
    {
        $account = Auth::user();
        $trainer = Trainer::findOrFail($account->trainerID);

        return view('home', ['account' => $account, 'trainer' => $trainer]);
    }
}
