@extends('layout.app')
@section('content')
<div class = "page-content">
  <div class="title">
    <h1 style="text-align: center;">My Dex</h1>
    <button onclick="startAddMon()" class="add-button">Add new Pokémon</button>
  </div>
  <div class="wrapper">
    <div class="grid" id="grid"> <!-- This is where pokemon cards are displayed -->
    </div>
  </div>
  <div class="modal-overlay" id="add-pokemon-modal">
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-sprite-container">
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/412.png"
            alt="Burmy"
            class="modal-sprite"
          />
        </div>
        <div class="modal-title-wrapper">
          <span class="modal-subtitle">YOU CAUGHT:</span>
          <h2 class="modal-title">Burmy</h2>
        </div>
      </div>

      <form class="modal-form">
        <div class="form-group">
          <label for="input-nickname">Nickname</label>
          <input type="text" id="input-nickname" placeholder="e.g. Borm" autocomplete="off"/>
        </div>

        <div class="form-group">
          <label for="input-gender">Gender</label>
          <div class="custom-dropdown">
            <input
              type="text"
              id="input-gender"
              placeholder="Select a gender..."
              autocomplete="off"
            />

            <ul class="dropdown-results">
              <li class="dropdown-item">Male</li>
              <li class="dropdown-item">Female</li>
              <li class="dropdown-item">Genderless</li>
            </ul>
          </div>
        </div>
        <div class="form-group">
          <label for="input-nature">Nature</label>

          <div class="custom-dropdown">
            <input
              type="text"
              id="input-nature"
              placeholder="Search or select a nature..."
              autocomplete="off"
            />
            <ul class="dropdown-results">
              <li class="dropdown-item">Adamant</li>
              <li class="dropdown-item">Bashful</li>
              <li class="dropdown-item">Bold</li>
              <li class="dropdown-item">Brave</li>
              <li class="dropdown-item">Calm</li>
              <li class="dropdown-item">Careful</li>
              <li class="dropdown-item">Docile</li>
              <li class="dropdown-item">Gentle</li>
              <li class="dropdown-item">Hardy</li>
              <li class="dropdown-item">Hasty</li>
              <li class="dropdown-item">Impish</li>
              <li class="dropdown-item">Jolly</li>
              <li class="dropdown-item">Lax</li>
              <li class="dropdown-item">Lonely</li>
              <li class="dropdown-item">Mild</li>
              <li class="dropdown-item">Modest</li>
              <li class="dropdown-item">Naive</li>
              <li class="dropdown-item">Naughty</li>
              <li class="dropdown-item">Quiet</li>
              <li class="dropdown-item">Quirky</li>
              <li class="dropdown-item">Rash</li>
              <li class="dropdown-item">Relaxed</li>
              <li class="dropdown-item">Sassy</li>
              <li class="dropdown-item">Serious</li>
              <li class="dropdown-item">Timid</li>
            </ul>
          </div>
        </div>
        <div class="form-group">
          <label for="input-generation">Generation</label>
          <div class="custom-dropdown">
            <input
              type="text"
              id="input-generation"
              placeholder="Search or select a generation..."
              autocomplete="off"
            />

            <ul class="dropdown-results">
              <li class="dropdown-item">Generation 1</li>
              <li class="dropdown-item">Generation 2</li>
              <li class="dropdown-item">Generation 3</li>
              <li class="dropdown-item">Generation 4</li>
              <li class="dropdown-item">Generation 5</li>
              <li class="dropdown-item">Generation 6</li>
              <li class="dropdown-item">Generation 7</li>
              <li class="dropdown-item">Generation 8</li>
              <li class="dropdown-item">Generation 9</li>
            </ul>
          </div>
        </div>
        <div class="form-group">
          <label for="input-game">Game</label>

          <div class="custom-dropdown">
            <input
              type="text"
              id="input-game"
              placeholder="Search or select a game..."
              autocomplete="off"
            />

            <ul class="dropdown-results">
              <li class="dropdown-item">Omega Ruby</li>
              <li class="dropdown-item">Alpha Sapphire</li>
              <li class="dropdown-item">X</li>
              <li class="dropdown-item">Y</li>
              <li class="dropdown-item">Black</li>
              <li class="dropdown-item">White</li>
            </ul>
          </div>
        </div>
        <div class="form-group">
          <label for="input-location">Location</label>

          <div class="custom-dropdown">
            <input
              type="text"
              id="input-location"
              placeholder="Search or select a location..."
              autocomplete="off"
            />

            <ul class="dropdown-results">
              <li class="dropdown-item">Route 205</li>
              <li class="dropdown-item">Route 206</li>
              <li class="dropdown-item">Route 207</li>
              <li class="dropdown-item">Route 208</li>
              <li class="dropdown-item">Route 209</li>
              <li class="dropdown-item">Route 210</li>
            </ul>
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-cancel" onclick="endAddMon(false)">Cancel</button>
          <button type="button" class="btn-submit" onclick="endAddMon(true)">Add to PC</button>
        </div>
      </form>
    </div>
  </div>
  <script src="js/dex.js"></script>
</div>
@endsection