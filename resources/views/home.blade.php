@extends('layout.app')
@section('content')
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
<div class = "page-content">
    <div class="info-page-layout">
      <div class="side-column left-side"></div>

      <main class="center-column">
        <!--filter doesn't work yet-->
        <div class="feed-header-bar">
          <div class="feed-title-placeholder"></div>
          <div class="custom-filter-dropdown">
            <button class="filter-trigger-btn">
              Filter <span class="filter-arrow">▼</span>
            </button>
            <ul class="filter-menu">
              <li class="filter-item" data-value="all">All Games</li>
              <li class="filter-item" data-value="hg">Heart Gold</li>
              <li class="filter-item" data-value="ss">Soul Silver</li>
              <li class="filter-item" data-value="or">Omega Ruby</li>
            </ul>
          </div>
        </div>

        <div class="pokemon-game-feed" id="pokemon-game-feed"></div>
      </main>

      <div class="side-column right-side"></div>
    </div>

    <script src="{{ asset("js/app.js") }}">
  </script>
</div>
@endsection