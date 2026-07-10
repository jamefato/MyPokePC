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