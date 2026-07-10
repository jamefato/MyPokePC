<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Trainer;

class InfoController extends Controller
{
    public function info()
    {
        $account = Auth::user();
        $trainer = Trainer::findorFail($account->trainerID);

        return view('info', ['account' => $account, 'trainer' => $trainer]);
    }
}
