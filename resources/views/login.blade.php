@extends("layout.form")
@section("content")
<div class = "page-content">
    <form class="login-form" id="login-form" action="{{ route('login') }}" method="post">

        @csrf
        
        <input name="email" class="login-box" type="email" placeholder="Enter email..." required/>
        <br/>
        <input name="password" class="login-box" type="password" placeholder="Enter password..." required/>
        <br/>

        @if ($errors->any())
        <div class = "msg error">
            @foreach ($errors->all() as $error)
                <p>{{ $error }}</p>
            @endforeach
        </div>
        @endif

        <button type="submit">Login</button>
        <br/><br/>
        <p>Don't have an account? <a href = {{ route('register') }}>Create one</a></p>
    </form>
</div>
@endsection