<?php

namespace App\Http\Controllers\Auth;

use App\Models\Account;
use App\Models\Trainer;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
class RegisterController extends Controller
{
    public function showRegistrationForm()
    {
        return view('register');
    }

    public function register(Request $request)
    {
        // Validate the request data
        $data = $request->validate
        ([
            'email' => 'required|string|max:50|unique:accounts',
            'name' => 'required|string|max:28',
            'password' => 'required|string|min:8',
        ]);

        $trainer = Trainer::create
        ([
            'name' => $data['name'],
            'dexCount' => 0,
            'monCount' => 0,
            'shinyCount' => 0,
            'shinyDex' => 0,
        ]);

        // Create a new account
        $account = Account::create
        ([
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'trainerID' => $trainer->id,
        ]);

        

        

        Auth::login($account);

        return redirect('home');
    }
}
