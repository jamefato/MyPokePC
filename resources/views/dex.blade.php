@extends('layout.app')
@section('content')
<div class = "page-content">
  <div class="title">
    <h1 style="text-align: center;">My Dex</h1>
    <button onclick="startAddMon()" class="add-button">Add Pokémon</button>
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
            src=" {{asset('assets/QuestionMark.png')}} "
            alt="Sprite"
            class="modal-sprite"
            style="max-width: 50px; height:auto"
            id="poke-sprite"
          />
        </div>
        <div class="modal-title-wrapper">
          <span class="modal-subtitle">YOU CAUGHT:</span>
          <div class="search-box">
            <input type="text" class="modal-title" id="input-name" placeholder="e.g. Pikachu" autocomplete="off"/>
            <div id="caughtMon" class="custom-dropdown-menu hidden"></div>
          </div>


          <!-- FIX LATER, USE THE SAME FORMATTING FOR A DROPDOWN AS THE OTHER THING -->

        </div>
      </div>

      <form class="modal-form" id="modal-form">
        <div class="form-group">
          <label for="input-nickname">Nickname</label>
          <input type="text" id="input-nickname" placeholder="e.g. Borm" autocomplete="off"/>
        </div>

        <!-- LEVEL -->

        <div class="form-group">
          <label for="input-level">Level: </label>
          <input type="number" id="input-level" min="1" max="100" placeholder="5">
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
            <input type="radio" id="yesShiny" name="shiny" value="true" onclick="setPokeSprite()">

            <label for="noShiny">No</label>
            <input type="radio" id="noShiny" name="shiny" value="false" onclick="setPokeSprite()">
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
              <li class="dropdown-item game-option">Red</li>
              <li class="dropdown-item game-option">Blue</li>
              <li class="dropdown-item game-option">Yellow</li>
              <li class="dropdown-item game-option">Gold</li>
              <li class="dropdown-item game-option">Silver</li>
              <li class="dropdown-item game-option">Crystal</li>
              <li class="dropdown-item game-option">Ruby</li>
              <li class="dropdown-item game-option">Sapphire</li>
              <li class="dropdown-item game-option">Emerald</li>
              <li class="dropdown-item game-option">Fire Red</li>
              <li class="dropdown-item game-option">Leaf Green</li>
              <li class="dropdown-item game-option">Diamond</li>
              <li class="dropdown-item game-option">Pearl</li>
              <li class="dropdown-item game-option">Platinum</li>
              <li class="dropdown-item game-option">Heart Gold</li>
              <li class="dropdown-item game-option">Soul Silver</li>
              <li class="dropdown-item game-option">Black</li>
              <li class="dropdown-item game-option">White</li>
              <li class="dropdown-item game-option">Black 2</li>
              <li class="dropdown-item game-option">White 2</li>
              <li class="dropdown-item game-option">X</li>
              <li class="dropdown-item game-option">Y</li>
              <li class="dropdown-item game-option">Omega Ruby</li>
              <li class="dropdown-item game-option">Alpha Sapphire</li>
            </ul>
          </div>
        </div>

        <div class="modal-actions" id="modal-actions">
          <button type="button" onclick="showMore()">Show More</button>
          <button type="button" class="btn-cancel" onclick="endAddMon(false)">Cancel</button>
          <button type="button" class="btn-submit" onclick="endAddMon(true)">Add to PC</button>
        </div>
      </form>
    </div>
  </div>
  <script src="js/dex.js"></script>
</div>
@endsection