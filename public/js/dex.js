// Listens for enter pressed (no button needed to search for mons)
const enterSearch = document.getElementById("pokemon");

console.log(enterSearch);

enterSearch.addEventListener('keydown', function(event) {
    if (event.key == 'Enter') {
        self.searchPage();
    }
});

//drop down menu
let globalPokemonList = []; // Stores master directory in memory

document.addEventListener("DOMContentLoaded", async () => {
  const inputField = document.getElementById("pokemon");
  const dropdownMenu = document.getElementById("custom-dropdown");
  if (!inputField || !dropdownMenu) return;

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

  inputField.addEventListener("input", () => {
    const query = inputField.value.trim().toLowerCase();

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

  dropdownMenu.addEventListener("click", (e) => {
    const clickedItem = e.target.closest(".dropdown-item");
    if (!clickedItem) return;

    const selectedValue = clickedItem.getAttribute("data-value");
    inputField.value = selectedValue;
    dropdownMenu.classList.add("hidden");

    const searchBtn =
      document.getElementById("search-btn") ||
      document.querySelector('button[type="submit"]');
    if (searchBtn) {
      self.searchPage();
    }
  });

  document.addEventListener("click", (e) => {
    if (!inputField.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.add("hidden");
    }
  });
});

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

// Closes the menu to add a pokemon
// Called on close/add button click or 'esc' pressed

function endAddMon(adding) {
  if (adding) {
    console.log("Add cdoe to keep mon here")
  }
  displayCard();
  const screen = document.getElementById("add-pokemon-modal");
  screen.style.display = 'none';
}

// Displays all caught pokemon

function displayCard() {
  const cardHolder = document.getElementById("grid");
  cardHolder.replaceChildren();
  const numPokemon = 5; // Change later when DB is added
  for (let i = 0; i < numPokemon; i++) {
    cardHolder.innerHTML += `
    <div class="card">
          <span class="pokedex-number">#412</span>
          <img
            class="sprite"
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/412.png"
            alt="burmy"
          />
          <div class="content">
            <h3 class="pokemon_name">Burmy</h3>
            <div class="pokemon-info-grid">
              <div class="info-group">
                <span class="info-label" id="nickname-label">nickname</span>
                <span class="info-value" id="nickname-value">Borm</span>
              </div>
              <div class="info-group">
                <span class="info-label" id="nature-label">nature</span>
                <span class="info-value" id="nature-value">Adamant</span>
              </div>

              <div class="info-group">
                <span class="info-label" id="game-label">game</span>
                <span class="info-value" id="game-value">Omega Ruby</span>
              </div>

              <div class="info-group">
                <span class="info-label" id="location-label"
                  >caught location</span
                >
                <span class="info-value" id="location-value">Route 104</span>
              </div>

              <div class="info-group">
                <span class="info-label" id="date-label">Date found</span>
                <span class="info-value" id="date-value">2026/06/29</span>
              </div>
              <div class="info-group">
                <span class="info-label" id="method-label">Method</span>
                <span class="info-value" id="method-value"
                  >random encouter</span
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
    `
  }
}

// Calls displayCard() so pokemon are displayed on opening page

displayCard();