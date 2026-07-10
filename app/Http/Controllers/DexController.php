<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Trainer;

class DexController extends Controller
{
    public function dex()
    {
        $account = Auth::user();
        $trainer = Trainer::findorFail($account->trainerID);

        return view('dex', ['account' => $account, 'trainer' => $trainer]);
    }
}
