let globalPokemonList = []; // Used in multiple functions
let showingMore = false;


// Handles all events (only when the page has loaded)

document.addEventListener("DOMContentLoaded", async () => {
    const dropdownMenu = document.getElementById("custom-dropdown");
    const dropdownCaught = document.getElementById("caughtMon");
    const monInputField = document.getElementById("pokemon");
    const speciesInputField = document.getElementById("input-name");
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

    // Same as above but on add screen

    speciesInputField.addEventListener("input", () => {
      
        const query = speciesInputField.value.trim().toLowerCase();

        if (!query) {
            dropdownCaught.classList.add("hidden");
            return;
        }

        const matches = globalPokemonList
            .filter((p) => p.name.includes(query))
            .slice(0, 8);

        if (matches.length === 0) {
            dropdownCaught.classList.add("hidden");
            return;
        }

        dropdownCaught.innerHTML = matches
            .map((pokemon) => {
                const formattedName = pokemon.name
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");
                return `<div class="dropdown-item" data-value="${pokemon.name}" style="width: 70%;">${formattedName}</div>`;
            })
            .join("");

        dropdownCaught.classList.remove("hidden");
    });

    monInputField.addEventListener("keydown", function (event) {
        if (event.key == "Enter") {
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

    // Hides the dropdown menu when adding pokemon

    dropdownCaught.addEventListener("click", (event) => {
      self.dropdownClicked(speciesInputField, event);
      dropdownCaught.classList.add("hidden");

      self.setPokeSprite();
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

        if (
            !monInputField.contains(e.target) &&
            !dropdownMenu.contains(e.target)
        ) {
            dropdownMenu.classList.add("hidden");
        }
    });

    // Global screen hotkeys

    document.addEventListener("keydown", (event) => {
        const activeElement = document.activeElement;

        // Opens the add pokemon menu

        if (event.key.toUpperCase() == "A") {
            if (!activeElement.id) {
                self.startAddMon();
            }
        }

        // Exits the add pokemon menu when esc pressed

        if (event.key == "Escape") {
            self.endAddMon(false);
        }

        // Debugging thing - currently runs validatePokemon();

        if (event.key.toUpperCase() == "B") {
          self.validatePokemon();
        }
    });

    // Calls displayCard() so pokemon are displayed on opening page

    displayCard();
});

// Adds dropdown text into input text

function dropdownClicked(inputV, event) {
    const clickedItem = event.target.closest(".dropdown-item");
    if (!clickedItem) return;

    let selectedValue = clickedItem.innerText;
    if (clickedItem.getAttribute("data-value")) {
        selectedValue = clickedItem.getAttribute("data-value");
    }
    inputV.value = selectedValue;
}

// Switches files and searches for specified pokemon

function searchPage() {
    localStorage.setItem(
        "query",
        String(document.getElementById("pokemon").value),
    );
    localStorage.setItem("search", true);
    window.location.href = "/";
}

// Opens the menu to add a pokemon
// Called on button click or 'a' pressed

function startAddMon() {
    const screen = document.getElementById("add-pokemon-modal");
    screen.style.display = "flex";
}

// Closes the menu to add a pokemon
// Called on close/add button click or 'esc' pressed

async function endAddMon(adding) {

  if (adding) {

    if (!self.validatePokemon()) return;

    let isShiny = false;
    if (document.querySelector('input[name="shiny"]:checked')?.value == "true") {
      isShiny = true;
    }

    let natSub = null;
    let locSub = null;
    let newDate;
    if (showingMore) {
      natSub = document.getElementById("input-nature").value;
      locSub = document.getElementById("input-location").value;
      newDate = document.getElementById("input-date").value;
    } else {
      newDate = new Date().toISOString();
    }

    const newPokemon = {
      species: document.getElementById("input-name").value,
      nickname: document.getElementById("input-nickname").value,
      level: document.getElementById("input-level").value,
      gender: document.getElementById("input-gender").value,
      game: document.getElementById("input-game").value,
      shiny: isShiny,
      nature: natSub,
      location: locSub,
      dateCaught: newDate,

      // Currently Unimplemented

      method: null,
      moves: null,
      baseStats: null,
      generation: 0,
    };


    await fetch("/api/pokemon", {
      method: "POST",
      headers: {"Content-Type": "application/json",
        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
      },
      body: JSON.stringify(newPokemon),
    });

  }
  displayCard();
  const screen = document.getElementById("add-pokemon-modal");
  screen.style.display = 'none';
}

// Error handling - Validates user inputs

function validatePokemon() {

  // Species
  let pokemonArr = [];
  globalPokemonList.forEach(element => {
    pokemonArr.push(element.name.toLowerCase());
  });
  const nameText = document.getElementById("input-name").value.toLowerCase();
  if (!nameText) {
    return false;
  } else if (!pokemonArr.includes(nameText)) {
    return false;
  }
  
  // Nickname
  const nicknameText = document.getElementById("input-nickname").value;
  if (!nicknameText.match(/^[a-zA-Z 0-9\.\,\+\-\;\:\!\?\♀️\♂️]*$/)) {
    // Display error message/box
    return false;
  } else if (nicknameText.length > 11) {
    // Display on error message
    return false;
  }

  // Level
  const level = Number(document.getElementById("input-level").value);
  if (level < 1 || level > 100 || !Number.isInteger(level)) {
    console.log('INVLID NUM');
    return false;
  }

  // Gender
  let genderText = document.getElementById("input-gender").value;
  console.log
  if (genderText == "") {
    document.getElementById("input-gender").value = "Genderless";
  } else if (genderText.toUpperCase() != "MALE" && genderText.toUpperCase() != "FEMALE" && genderText.toUpperCase() != "GENDERLESS") {
    // Display error message/box
    return false;
  }

  // Shiny

  if (!document.querySelector('input[name="shiny"]:checked')) {
      return false;
  }

  // Game (optional)

  const gameArr = Array.from(document.querySelectorAll('[id="gameType"]'), input => input.innerText);
  const gameText = document.getElementById("input-game").value;
  if (!gameArr.includes(gameText) && gameText != "") {
  }

  if (showingMore) {
      
    // Nature (optional)

    const natureArr = Array.from(document.querySelectorAll('[id="natureType"]'), input => input.innerText);
    const natureText = document.getElementById("input-nature").value;
    if (!natureArr.includes(natureText) && natureText != "") {
      return false;
    }

    // Location (optional)

    const locArr = Array.from(document.querySelectorAll('[id="locationType"]'), input => input.innerText);
    const locText = document.getElementById("input-location").value;
    if (!locArr.includes(locText) && locText != "") {
      return false;
    }

    // Date

    const today = new Date();
    let catchDay = new Date(document.getElementById("input-date").value);
    catchDay.setHours(0, 0, 0, 0);
    if (catchDay > today) {
      return false;
    }
  }

  return true;
}

// Displays all caught pokemon

async function displayCard() {
    const cardHolder = document.getElementById("grid");
    cardHolder.replaceChildren();

    // Gets currently stored pokemon data

    const response = await fetch("/api/pokemon");
    const pokemonData = await response.json();

    

    // Iteratively displays all pokemon
    pokemonData.forEach((mon) => {
        let pokeNum = getIDSprite(mon.species, false, mon.shiny);
        let pokeSprite = getIDSprite(mon.species, true, mon.shiny);
        let cardHtml = `
    <div class="card">
          <span class="pokedex-number">#${pokeNum}</span>
          <img
            class="sprite"
            src=${pokeSprite}
            alt="${mon.species}"
            style="max-width: 111px; height:auto"
          />
          <div class="content">`;
    
    if (mon.nickname) {
      cardHtml += `<h3 class="pokemon_name" style="margin: 0px;">${mon.nickname}</h3>
      <h4 style="margin-top: 0px; margin-bottom: 10px">(${mon.species})</h4>`
    } else {
      cardHtml += `<h3 class="pokemon_name">${mon.species}</h3>`;
      }

    cardHtml += '<div class="pokemon-info-grid">';


    // Adding various attributes to the card:

    const addingAtt = [
      { label: "nickname",        key: "nickname" },
      { label: "level",        key: "level" },
      { label: "trainer id",      key: "trainer_id" },
      { label: "nature",          key: "nature" },
      { label: "game",            key: "game" },
      { label: "caught location", key: "location" },
      { label: "Date found",      key: "dateCaught" },
      { label: "Method",          key: "method" },
    ];

    addingAtt.forEach(attr => {
      let value = mon[attr.key];
      if (attr.key == "dateCaught") {
         value = String(mon.dateCaught).slice(0, 10);
      }
      if (value) {
        cardHtml += `
              <div class="info-group">
                <span class="info-label" id="nickname-label">${attr.label}</span>
                <span class="info-value" id="nickname-value">${value}</span>
              </div>`
      }
    })
    
    cardHtml += `
            </div>
            <div class="card-footer">
              <button class="fav-button">❤️</button>
              <div class="status-icons">`
      
      let genderIcon = "";
      if (mon.gender.toLowerCase() == "male") {
        genderIcon = "♂️";
      } else if (mon.gender.toLowerCase() == "female") {
        genderIcon = "♀️";
      }

      let shinyIcon = "";
      if (mon.shiny) {
        shinyIcon = "✨";
      }

      cardHtml +=`<span class="icon gender-icon">${genderIcon}</span>
                <span class="icon shiny-icon">${shinyIcon}</span>
              </div>
            </div>
          </div>
        </div>
    `;
    cardHolder.innerHTML += cardHtml;
  });
}

// Show More button for extra input features

function showMore() {
  showingMore = true;
  const container = document.getElementById("modal-form");
  container.removeChild(document.getElementById("modal-actions"));
  container.innerHTML += `
  <!-- NATURE -->

        <div class="form-group" id="extraOptions">
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

        <div class="form-group" id="extraOptions">
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

        <!-- LOCATION -->

        <div class="form-group" id="extraOptions">
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

        <!-- DATE -->

        <div class="form-group" id="extraOptions">
          <label for="input-date">Date Caught:</label>
          <input type="date" id="input-date">
        </div>

        <div class="modal-actions" id="modal-actions">
          <button type="button" onclick="showLess()">Show Less</button>
          <button type="button" class="btn-cancel" onclick="endAddMon(false)">Cancel</button>
          <button type="button" class="btn-submit" onclick="endAddMon(true)">Add to PC</button>
        </div>
  `
}

// Show less

function showLess() {
  showingMore = false;
  const container = document.getElementById("modal-form");
  const extraVars = container.querySelectorAll("#extraOptions");

  extraVars.forEach(child => child.remove());
  container.removeChild(document.getElementById("modal-actions"));
  container.innerHTML += `
        <div class="modal-actions" id="modal-actions">
          <button type="button" onclick="showMore()">Show More</button>
          <button type="button" class="btn-cancel" onclick="endAddMon(false)">Cancel</button>
          <button type="button" class="btn-submit" onclick="endAddMon(true)">Add to PC</button>
        </div>
  `
}

// Function that gets a pokemons ID and sprite
// true for sprite, false for ID

function getIDSprite(mon, sprite, shiny) {
  const pokeID = parseInt(Object.keys(globalPokemonList).find(key => globalPokemonList[key].name === mon.toLowerCase())) + 1;
  if (sprite) {
    if (shiny) {
      return "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/" + String(pokeID) + ".png";
    }
    return "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + String(pokeID) + ".png";
  }
  return pokeID;
}

function setPokeSprite() {
  document.getElementById("poke-sprite").src = getIDSprite(document.getElementById("input-name").value, true, (document.querySelector('input[name="shiny"]:checked')?.value == "true"));
  document.getElementById("poke-sprite").style = "max-width: 100%; height:auto"
}
