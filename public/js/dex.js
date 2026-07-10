// Handles all events (only when the page has loaded)

document.addEventListener("DOMContentLoaded", async () => {

  let globalPokemonList = [];

  const dropdownMenu = document.getElementById("custom-dropdown");
  const monInputField = document.getElementById("pokemon");
  let inputField;

  // Gets pokemon name data

  try {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=1025",
    );
    if (response.ok) {
      const data = await response.json();
      globalPokemonList = data.results;
    }
  } catch (e) {
    console.error("Failed to build custom autocomplete index:", e);
  }

  // Creates the dropdown menu when searching for pokemon

  monInputField.addEventListener("input", () => {
    const query = monInputField.value.trim().toLowerCase();

    if (!query) {
      dropdownMenu.classList.add("hidden");
      return;
    }

    const matches = globalPokemonList
      .filter((p) => p.name.includes(query))
      .slice(0, 8);

    if (matches.length === 0) {
      dropdownMenu.classList.add("hidden");
      return;
    }

    dropdownMenu.innerHTML = matches
      .map((pokemon) => {
        const formattedName = pokemon.name
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        return `<div class="dropdown-item" data-value="${pokemon.name}">${formattedName}</div>`;
      })
      .join("");

    dropdownMenu.classList.remove("hidden");
  });

  monInputField.addEventListener('keydown', function(event) {
    if (event.key == 'Enter') {
        self.searchPage();
    }
  });

  // Handles all types of dropdown menus on the page

  dropdownMenu.addEventListener("click", (event) => {
    self.dropdownClicked(monInputField, event);
    dropdownMenu.classList.add("hidden");

    const searchBtn =
      document.getElementById("search-btn") ||
      document.querySelector('button[type="submit"]');
    if (searchBtn) {
      self.searchPage();
    }
  });

  document.addEventListener("mousedown", (event) => {
    if (inputField && inputField != monInputField) {
      self.dropdownClicked(inputField, event);
    }
  });

  // Global click

  document.addEventListener("click", (e) => {
    // Updates the current inputField on any click
    inputField = document.getElementById(document.activeElement.id);

    if (!monInputField.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.add("hidden");
    }
  });

  // Global screen hotkeys

  document.addEventListener('keydown', (event) => {

    const activeElement = document.activeElement;

    // Opens the add pokemon menu

    if (event.key.toUpperCase() == 'A') {
      if (!activeElement.id) {
        self.startAddMon();
      }
    }

    // Exits the add pokemon menu when esc pressed

    if (event.key == 'Escape') {
        self.endAddMon(false);
    }
  });

  // Calls displayCard() so pokemon are displayed on opening page

  displayCard();
});

// Adds dropdown text into input text 

function dropdownClicked(inputV, event) {
  console.log("Clicked a dropdown item!");
  const clickedItem = event.target.closest(".dropdown-item");
  console.log(clickedItem);
  if (!clickedItem) return;

  let selectedValue = clickedItem.innerText;
  if (clickedItem.getAttribute("data-value")) {
    selectedValue = clickedItem.getAttribute("data-value");
  }
  inputV.value = selectedValue;
}

// Switches files and searches for specified pokemon

function searchPage() {
    localStorage.setItem("query", String(document.getElementById("pokemon").value));
    localStorage.setItem("search", true);
    window.location.href = "index.html";
}

// Opens the menu to add a pokemon
// Called on button click or 'a' pressed

function startAddMon() {
  const screen = document.getElementById("add-pokemon-modal");
  screen.style.display = 'flex';
}

// Closes the menu to add a pokemon
// Called on close/add button click or 'esc' pressed

async function endAddMon(adding) {
  if (adding) {
    // Update as more stats are added
    const newPokemon = {
      nickname: document.getElementById("input-nickname").value,
      gender: document.getElementById("input-gender").value,
      nature: document.getElementById("input-nature").value,
      generation: 0, // Doesn't matter - changing this anyways so it depends on game
      game: document.getElementById("input-game").value,

      // Currently Unimplemented

      species: "Leafeon",
      shiny: false,
      level: 1,
      location: null,
      method: null,
      moves: null,
      baseStats: null,
      trainer_id: 2
    };

    console.log(newPokemon);

    await fetch("/api/pokemon", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(newPokemon),
    });

  }
  displayCard();
  const screen = document.getElementById("add-pokemon-modal");
  screen.style.display = 'none';
}

// Displays all caught pokemon

async function displayCard() {
  const cardHolder = document.getElementById("grid");
  cardHolder.replaceChildren();

  // Gets currently stored pokemon data
  
  const response = await fetch("/api/pokemon");
  const pokemonData = await response.json();

  // Iteratively displays all pokemon
  pokemonData.forEach(mon => {
    let cardHtml = `
    <div class="card">
          <span class="pokedex-number">DEX NUM</span>
          <img
            class="sprite"
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/412.png"
            alt="${mon.species}"
          />
          <div class="content">`;
    if (mon.nickname) {
      cardHtml += `<h3 class="pokemon_name">${mon.nickname} (${mon.species})</h3>`
    } else {
      cardHtml += `<h3 class="pokemon_name">${mon.species}</h3>`;
      }
      cardHtml += `
            <div class="pokemon-info-grid">
              <div class="info-group">
                <span class="info-label" id="nickname-label">nickname</span>
                <span class="info-value" id="nickname-value">${mon.nickname}</span>
              </div>
              <div class="info-group">
                <span class="info-label" id="nature-label">nature</span>
                <span class="info-value" id="nature-value">${mon.nature}</span>
              </div>

              <div class="info-group">
                <span class="info-label" id="game-label">game</span>
                <span class="info-value" id="game-value">${mon.game}</span>
              </div>

              <div class="info-group">
                <span class="info-label" id="location-label"
                  >caught location</span
                >
                <span class="info-value" id="location-value">${mon.location}</span>
              </div>

              <div class="info-group">
                <span class="info-label" id="date-label">Date found</span>
                <span class="info-value" id="date-value">${String(mon.dateCaught).slice(0, 10)}</span>
              </div>
              <div class="info-group">
                <span class="info-label" id="method-label">Method</span>
                <span class="info-value" id="method-value"
                  >${mon.method}</span
                >
              </div>
              <div class="info-group">
                <span class="info-label" id="hour-label">Hour</span>
                <span class="info-value" id="hour-value">20</span>
              </div>
              <div class="info-group">
                <span class="info-label" id="phase-label">Phases</span>
                <span class="info-value" id="phase-value">1</span>
              </div>
              <div class="info-group">
                <span class="info-label" id="console-label">Console</span>
                <span class="info-value" id="console-value">1</span>
              </div>
            </div>
            <div class="card-footer">
              <button class="fav-button">❤️</button>
              <div class="status-icons">
                <span class="icon gender-icon">♂️</span>
                <span class="icon shiny-icon">✨</span>
              </div>
            </div>
          </div>
        </div>
    `;
    cardHolder.innerHTML = cardHtml;
  });
}