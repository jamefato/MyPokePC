<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function showLoginForm()
    {
        return view('login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate
        ([
            'email' => 'required|string|max:50',
            'password' => 'required|string',
        ]);

        // Attempt to login using the provided credentials
        if (Auth::attempt($credentials))
            {
                // Regenerate the session
                $request->session()->regenerate();
                // Redirect to home page
                return redirect()->intended('home');
            }
        return back()->withErrors
        ([
            'email' => 'Invalid credentials',
        ])->withInput();
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}