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
          <input type="text" class="modal-title" id="input-name" placeholder="e.g. Pikachu" autocomplete="off" style="max-width: 75%"/>
          <div id="caughtMon"></div>
        </div>
      </div>

      <form class="modal-form">
        <div class="form-group">
          <label for="input-nickname">Nickname</label>
          <input type="text" id="input-nickname" placeholder="e.g. Borm" autocomplete="off"/>
        </div>

        <!-- GENDER -->

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

        <!-- SHINY -->

        <div class="form-group">
          <label for="input-shiny">Shiny?</label>

          <div id="input-shiny">
            <label for="yesShiny">Yes</label>
            <input type="radio" id="yesShiny" name="shiny" value="Yes">

            <label for="noShiny">No</label>
            <input type="radio" id="noShiny" name="shiny" value="No">
          </div>
        </div>

        <!-- NATURE -->

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
              <li class="dropdown-item" id="natureType">Adamant</li>
              <li class="dropdown-item" id="natureType">Bold</li>
              <li class="dropdown-item" id="natureType">Brave</li>
              <li class="dropdown-item" id="natureType">Bashful</li>
              <li class="dropdown-item" id="natureType">Calm</li>
              <li class="dropdown-item" id="natureType">Careful</li>
              <li class="dropdown-item" id="natureType">Docile</li>
              <li class="dropdown-item" id="natureType">Gentle</li>
              <li class="dropdown-item" id="natureType">Hardy</li>
              <li class="dropdown-item" id="natureType">Hasty</li>
              <li class="dropdown-item" id="natureType">Impish</li>
              <li class="dropdown-item" id="natureType">Jolly</li>
              <li class="dropdown-item" id="natureType">Lax</li>
              <li class="dropdown-item" id="natureType">Lonely</li>
              <li class="dropdown-item" id="natureType">Mild</li>
              <li class="dropdown-item" id="natureType">Modest</li>
              <li class="dropdown-item" id="natureType">Naive</li>
              <li class="dropdown-item" id="natureType">Naughty</li>
              <li class="dropdown-item" id="natureType">Quiet</li>
              <li class="dropdown-item" id="natureType">Quirky</li>
              <li class="dropdown-item" id="natureType">Rash</li>
              <li class="dropdown-item" id="natureType">Relaxed</li>
              <li class="dropdown-item" id="natureType">Sassy</li>
              <li class="dropdown-item" id="natureType">Serious</li>
              <li class="dropdown-item" id="natureType">Timid</li>
            </ul>
          </div>
        </div>

        <!-- GENERATION -->

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

        <!-- GAME -->

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
              <li class="dropdown-item" id="gameType">Omega Ruby</li>
              <li class="dropdown-item" id="gameType">Alpha Sapphire</li>
              <li class="dropdown-item" id="gameType">X</li>
              <li class="dropdown-item" id="gameType">Y</li>
              <li class="dropdown-item" id="gameType">Black</li>
              <li class="dropdown-item" id="gameType">White</li>
            </ul>
          </div>
        </div>

        <!-- LOCATION -->

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
              <li class="dropdown-item" id="locationType">Route 205</li>
              <li class="dropdown-item" id="locationType">Route 206</li>
              <li class="dropdown-item" id="locationType">Route 207</li>
              <li class="dropdown-item" id="locationType">Route 208</li>
              <li class="dropdown-item" id="locationType">Route 209</li>
              <li class="dropdown-item" id="locationType">Route 210</li>
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