<?php

namespace App\Http\Controllers\Auth;

use App\Models\Account;
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
            'password' => 'required|string|min:8',
        ]);

        // Create a new account
        $account = Account::create
        ([
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        Auth::login($account);

        return redirect('home');
    }
}
