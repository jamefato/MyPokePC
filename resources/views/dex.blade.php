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
        </div>
      </div>

      <form class="modal-form" id="modal-form">
        <div class="form-group">
          <label for="input-nickname">Nickname</label>
          <input type="text" id="input-nickname" placeholder="e.g. Borm" autocomplete="off"/>
        </div>

        <!-- LEVEL -->

        <div class="form-group">
          <label for="input-level">Level</label>
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

        <!-- ABILITY -->

        <div class="form-group">
          <label for="input-ability">Ability</label>
          <div class="custom-dropdown">
            <input
              type="text"
              id="input-ability"
              placeholder="Overgrowth, Blaze..."
              autocomplete="off"
            />

            <ul class="dropdown-results" id="ability-dropdown"></ul>
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