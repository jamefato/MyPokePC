@extends('layout.app')
@section('content')
<div class = "page-content">
    <div class="info-page-layout">
      <div class="side-column left-side"></div>

      <main class="center-column">
        <br>
        <div class="pokemon-game-feed" id="pokemon-game-feed"></div>
      </main>

      <div class="side-column right-side"></div>
    </div>

    <script src="{{ asset("js/app.js") }}">
  </script>
</div>
@endsection