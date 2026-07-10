@extends('layout.form')
@section('content')
<div class="page-content">
    <form class="login-form" id="form register-form" action="{{ route('register') }}" method="post">

        @csrf

        <input name="email" class="form login-box" type="email" placeholder="enter email..." required/>
        <br/>
        <input name="password" class="form login-box" type="password" placeholder="create password..." required/>
        <br/>

        @if ($errors->any())
        <div class="msg error">
            @foreach ($errors->all() as $error)
                <p>{{ $error }}</p>
            @endforeach
        </div>
        @endif

        <button type="submit">Register</button>
    </form>
</div>
@endsection