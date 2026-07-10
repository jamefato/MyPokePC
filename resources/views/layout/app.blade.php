<!DOCTYPE html>
<html lang="en-us">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>MyPokePC</title>
    <link rel = "stylesheet" href = '<?php echo(asset("css/style.css")) ?>'/>
    <link href="https://fonts.googleapis.com/css2?family=Silkscreen&family=Pixelify+Sans:wght@400..700&display=swap" rel="stylesheet">
</head>
<body>
    <nav class="navbar">
  <div class="nav-left">
    
    <div class="nav-logo">
      <a href="{{ route('home') }}" style="color: #ffffff !important; font-family: 'Pixelify Sans', sans-serif !important; font-size: 26px !important; font-weight: bold !important; text-decoration: none !important;">MyPokéPC</a>
    </div>
    
    <ul class="nav-links">
      <li><a href="{{ route('dex') }}" style="color: #ffffff !important; font-family: 'Silkscreen', sans-serif !important; font-size: 16px !important; text-decoration: none !important;">Dex</a></li>
      <li><a href="#target" style="color: #ffffff !important; font-family: 'Silkscreen', sans-serif !important; font-size: 16px !important; text-decoration: none !important;">Targets</a></li>
    </ul>

  </div>
  <div class="nav-right">

    <ul class="nav-links">
      <li><a href="{{ route('logout') }}" style="color: #ffffff !important; font-family: 'Silkscreen', sans-serif !important; font-size: 16px !important; text-decoration: none !important;">Log Out</a></li>
      <li><a href="{{ route('info') }}" style="color: #ffffff !important; font-family: 'Silkscreen', sans-serif !important; font-size: 16px !important; text-decoration: none !important;">User Info</a></li>
      <li><a href="#setting" style="color: #ffffff !important; font-family: 'Silkscreen', sans-serif !important; font-size: 16px !important; text-decoration: none !important;">:</a></li>
    </ul>

  </div>
</nav>
<header class="search-section">
      <div class="search-container">
        <div class="search-box">
          <input
            type="text"
            placeholder="Search by name or number..."
            name=""
            id="pokemon"
            autocomplete="off"
          />

          <span class="search-icon" onclick="search()">
            <img src="assets/icons8-search-24.png" alt="search" />
          </span>

          <div id="custom-dropdown" class="custom-dropdown-menu hidden"></div>
        </div>
      </div>
</header>
    <!-- Page Content -->
    @yield('content')
</body>
</html>