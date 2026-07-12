<!DOCTYPE html>
<html lang="en-us">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>MyPokePC</title>
    <link rel = "stylesheet" href = '<?php echo(asset("css/style.css")) ?>'/>
    <link href="https://fonts.googleapis.com/css2?family=Silkscreen&family=Pixelify+Sans:wght@400..700&display=swap" rel="stylesheet">
</head>
</head>
<body>
    <nav class="navbar">
      <div class="nav-left">
        <div class="nav-logo"><a href="{{ route("home") }}">MyPokéPC</a></div>
        <ul class="nav-links">
          <li><a href="{{ route("dex") }}">Dex</a></li>
          <li><a href="{{ route("home") }}">Search</a></li>
        </ul>
      </div>
      <div class="nav-right">
        <ul class="nav-links">
          <li><a href="{{ route('login') }}">Log In</a></li>
          <li><a href="#setting">:</a></li>
        </ul>
      </div>
    </nav>
    <!-- Page Content -->
    @yield('content')
</body>
</html>