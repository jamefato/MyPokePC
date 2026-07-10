<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DexController extends Controller
{
    public function dex()
    {
        $account = Auth::user();

        return view('dex', ['account' => $account]);
    }
}
