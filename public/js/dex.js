// Global script vars

let globalPokemonList = [];
const gameGenerations = {
  // Gen I
  "Red": 1,
  "Blue": 1,
  "Yellow": 1,

  // Gen II
  "Gold": 2,
  "Silver": 2,
  "Crystal": 2,

  // Gen III
  "Ruby": 3,
  "Sapphire": 3,
  "Emerald": 3,
  "Fire Red": 3,
  "Leaf Green": 3,

  // Gen IV
  "Diamond": 4,
  "Pearl": 4,
  "Platinum": 4,
  "Heart Gold": 4,
  "Soul Silver": 4,

  // Gen V
  "Black": 5,
  "White": 5,
  "Black 2": 5,
  "White 2": 5,

  // Gen VI
  "X": 6,
  "Y": 6,
  "Omega Ruby": 6,
  "Alpha Sapphire": 6,

  // Gen VII
  "Sun": 7,
  "Moon": 7,
  "Ultra Sun": 7,
  "Ultra Moon": 7,
  "Let's Go Pikachu": 7,
  "Let's Go Eevee": 7,

  // Gen VIII
  "Sword": 8,
  "Shield": 8,
  "Brilliant Diamond": 8,
  "Shining Pearl": 8,
  "Legends Arceus": 8,

  // Gen IX
  "Scarlet": 9,
  "Violet": 9
}; // Fewer games than pokemon, so we have hard coded this
let showingMore = false;
let abilitiesList;

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
            searchPage();
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
            searchPage();
        }
    });

    // Hides the dropdown menu when adding pokemon

    dropdownCaught.addEventListener("click", (event) => {
      self.dropdownClicked(speciesInputField, event);
      dropdownCaught.classList.add("hidden");
      self.getAbilities();
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
    window.location.href = "/home";
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

    // Additional options

    let natSub = null;
    let locSub = null;
    let newGame;
    let newGen;
    let newDate = new Date().toISOString();
    let newMthd;
    let newBS;
    if (showingMore) {
      natSub = document.getElementById("input-nature").value;
      locSub = document.getElementById("input-location").value;
      newMthd = document.getElementById("input-method").value;

      newGame = document.getElementById("input-game").value;
      if (newGame) {
        newGen = gameGenerations[newGame];
      }

      if (document.getElementById("input-date").value) {
        newDate = document.getElementById("input-date").value;
      }
      // Base stats

      if (document.getElementById("hp").value === "" && document.getElementById("spAtk").value === "" && document.getElementById("atk").value === "" && document.getElementById("spDef").value === "" && document.getElementById("def").value === "" && document.getElementById("spe").value === "") {
        
      } else {
        newBS = {
          HP: Number(document.getElementById("hp").value) || 0,
          SpAtk: Number(document.getElementById("spAtk").value) || 0,
          Attack: Number(document.getElementById("atk").value) || 0,
          SpDef: Number(document.getElementById("spDef").value) || 0,
          Defense:Number(document.getElementById("def").value) || 0,
          Speed: Number(document.getElementById("spe").value) || 0
        };
      }
    }

    const newPokemon = {
      species: document.getElementById("input-name").value,
      nickname: document.getElementById("input-nickname").value,
      level: document.getElementById("input-level").value,
      gender: document.getElementById("input-gender").value,
      shiny: isShiny,
      game: newGame,
      generation: newGen,
      nature: natSub,
      location: locSub,
      method: newMthd,
      ability: document.getElementById("input-ability").value,
      baseStats: newBS,
      dateCaught: newDate
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
    alert("Please enter what Pokémon you caught.");
    return false;
  } else if (!pokemonArr.includes(nameText)) {
    alert("Please enter a valid type of Pokémon.");
    return false;
  }
  
  // Nickname (optional)
  const nicknameText = document.getElementById("input-nickname").value;
  if (!nicknameText.match(/^[a-zA-Z 0-9\.\,\+\-\;\:\!\?\♀️\♂️]*$/)) {
    alert("Invalid nickname, only alphanumeric characters and the following are allowed: \n. , + - ; : ! ? ♀️ ♂️");
    return false;
  } else if (nicknameText.length > 12) {
    alert("Invalid nickname, length must be 1-12 characters.");
    return false;
  }

  // Level
  const level = Number(document.getElementById("input-level").value);
  if (level < 1 || level > 100 || !Number.isInteger(level)) {
    alert("Please enter a level 1-100.");
    return false;
  }

  // Gender
  const genderText = document.getElementById("input-gender").value;
  if (genderText == "") {
    document.getElementById("input-gender").value = "Genderless";
  } else if (genderText.toUpperCase() != "MALE" && genderText.toUpperCase() != "FEMALE" && genderText.toUpperCase() != "GENDERLESS") {
    alert("Please enter a valid Pokémon gender.");
    return false;
  }

  // Ability
  let validAbilities = [];
  abilitiesList.forEach(ab => {
    validAbilities.push(ab.toUpperCase());
  });

  const abilityText = document.getElementById("input-ability").value.toUpperCase();
  if (abilityText != "" && !validAbilities.includes(abilityText)) {
    alert("Please enter a valid ability for your Pokémon.");
    console.log(validAbilities);
    console.log(abilityText);
    return false;
  }

  // Shiny

  if (!document.querySelector('input[name="shiny"]:checked')) {
    alert("Please select if your Pokémon was shiny.")
    return false;
  }

  if (showingMore) { // All optional
      
    // Nature

    const natureArr = Array.from(document.querySelectorAll('[id="natureType"]'), input => input.innerText);
    const natureText = document.getElementById("input-nature").value;
    if (!natureArr.includes(natureText) && natureText != "") {
      alert("Please enter a valid nature.");
      return false;
    }

    // Game (optional)

    const gameText = document.getElementById("input-game").value;
    if (!Object.hasOwn(gameGenerations, gameText) && gameText != "") {
      alert("Please enter a valid game.");
    }

    // Location

    const locArr = Array.from(document.querySelectorAll('[id="locationType"]'), input => input.innerText.toUpperCase());
    const locText = document.getElementById("input-location").value.toUpperCase();
    if (!locArr.includes(locText) && locText != "") {
      alert("Please enter a valid location.");
      return false;
    }

    // Method

    const mthds = Array.from(document.querySelectorAll('[id="methodType"]'), input => input.innerText.toUpperCase());
    const mthd = document.getElementById("input-method").value.toUpperCase();
    if (mthd != "" && !mthds.includes(mthd)) {
      alert("Please enter a valid method.");
      return false;
    }
        

    // Base stats

    const stats = document.querySelectorAll("#input-stats input[type = 'number']");

    for (const stat of stats) {
      if (stat.value < 0 || stat.value > 31) {
        alert("Please enter valid IVs (0-31).");
        return false;
      }
    };

    // Date

    const today = new Date();
    let catchDay = new Date(document.getElementById("input-date").value);
    catchDay.setHours(0, 0, 0, 0);
    if (catchDay > today) {
      alert("Please select from a valid date.");
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
        { label: "level",           key: "level" },
        { label: "ability",         key: "ability" },
        { label: "trainer id",      key: "trainer_id" },
        { label: "nature",          key: "nature" },
        { label: "game",            key: "game" },
        { label: "generation",      key: "generation" },
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
                  <span class="info-label">${attr.label}</span>
                  <span class="info-value">${value}</span>
                </div>`
        }
      });

      // Adding base stats specifically:
      if (mon.baseStats) {
        cardHtml += `
                <div class="info-group">
                  <span class="info-label">HP/Atk/Def</span>
                  <span class="info-value">${mon.baseStats.HP}, ${mon.baseStats.Attack}, ${mon.baseStats.Defense}</span>
                </div>
                <div class="info-group">
                  <span class="info-label">Sp.Atk/Sp.Def/Spe</span>
                  <span class="info-value">${mon.baseStats.SpAtk}, ${mon.baseStats.SpDef}, ${mon.baseStats.Speed}</span>
                </div>`
      }
      
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

         <!-- GAME -->

        <div class="form-group" id="extraOptions">
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
              <li class="dropdown-item game-option">Sun</li>
              <li class="dropdown-item game-option">Moon</li>
              <li class="dropdown-item game-option">Ultra Sun</li>
              <li class="dropdown-item game-option">Ultra Moon</li>
              <li class="dropdown-item game-option">Let's Go Pikachu</li>
              <li class="dropdown-item game-option">Let's Go Eevee</li>
              <li class="dropdown-item game-option">Sword</li>
              <li class="dropdown-item game-option">Shield</li>
              <li class="dropdown-item game-option">Brilliant Diamond</li>
              <li class="dropdown-item game-option">Shining Pearl</li>
              <li class="dropdown-item game-option">Legends Arceus</li>
              <li class="dropdown-item game-option">Scarlet</li>
              <li class="dropdown-item game-option">Violet</li>
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

        <!-- METHOD -->

        <div class="form-group" id="extraOptions">
          <label for="input-method">Method of catch</label>
          <div class="custom-dropdown">
            <input
              type="text"
              id="input-method"
              placeholder="Masuda, Soft-reset..."
              autocomplete="off"
            />

            <ul class="dropdown-results">
              <li class="dropdown-item" id="methodType">Random</li>
              <li class="dropdown-item" id="methodType">Masuda</li>
              <li class="dropdown-item" id="methodType">Soft-reset</li>
              <li class="dropdown-item" id="methodType">Chain</li>
              <li class="dropdown-item" id="methodType">Trade</li>
            </ul>
          </div>
        </div>

        <!-- STATS -->

        <div class="form-group" id="input-stats" style="display: flex; align-items: center; text-align: center">
          <div id="hp-loc">
            <label for="hp">HP:</label>
            <br>
            <input type="number" id="hp" min="0" max="31" placeholder="0">
          </div>
          <div class="atk-loc" style="width: 100%">
            <label for="spAtk" style="margin-right: 15%">Sp. Atk:</label>
            <label for="atk" style="margin-left: 15%">Attack:</label>
            <br>
            <input type="number" id="spAtk" min="0" max="31" placeholder="0" style="margin-right: 15%">
            <input type="number" id="atk" min="0" max="31" placeholder="0" style="margin-left: 15%">
          </div>
          <div class="def-loc" style="width: 100%">
            <label for="spDef" style="margin-right: 15%">Sp. Def:</label>
            <label for="def" style="margin-left: 15%">Defense:</label>
            <br>
            <input type="number" id="spDef" min="0" max="31" placeholder="0" style="margin-right: 15%">
            <input type="number" id="def" min="0" max="31" placeholder="0" style="margin-left: 15%">
          </div>
          <div class="spe-loc">
            <label for="spe">Speed:</label>
            <br>
            <input type="number" id="spe" min="0" max="31" placeholder="0">
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

  // Handled separately since ID is different
  document.getElementById("input-stats").remove();

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

// Gets abilities for the specific pokemon

async function getAbilities() {
  abilitiesList = [];

  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon/" + document.getElementById("input-name").value.toLowerCase()
  );
  const data = await response.json();
  
  const abilitiesDD = document.getElementById("ability-dropdown");
  abilitiesDD.innerHTML = "";

  data.abilities.forEach(abilities => {
    let ability = abilities.ability.name;
    ability = toNameCase(ability);
    abilitiesList.push(ability);

    const li = document.createElement("li");
    li.className = "dropdown-item";
    li.textContent = ability;
    abilitiesDD.appendChild(li);
  });
}

function toNameCase(word) {
    for (let i = 0; i < word.length; i++) {
        if (!i) {
            word = word.charAt(0).toUpperCase() + word.slice(1);
        } else if (word.charAt(i) == "-") {
            word = word.slice(0, i) + " " + word.slice(i + 1);
        } else if (word.charAt(i - 1) == " ") {
            word =
                word.slice(0, i) +
                word.charAt(i).toUpperCase() +
                word.slice(i + 1);
        }
    }
    return word;
}