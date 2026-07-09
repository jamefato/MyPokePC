let url = "https://pokeapi.co/api/v2";
let query = "/pokemon"; // Base query is pokemon

let globalPokemonList = []; // Stores master directory in memory

document.addEventListener("DOMContentLoaded", async () => {
  const inputField = document.getElementById("pokemon");
  const dropdownMenu = document.getElementById("custom-dropdown");
  if (!inputField || !dropdownMenu) return;

  // Fetch master database directory once on app initialization
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

  // Handle keystrokes inside the input bar
  inputField.addEventListener("input", () => {
    const query = inputField.value.trim().toLowerCase();

    // Hide if search is empty
    if (!query) {
      dropdownMenu.classList.add("hidden");
      return;
    }

    // Filter standard list array matching query string anywhere in name
    const matches = globalPokemonList
      .filter((p) => p.name.includes(query))
      .slice(0, 8);

    if (matches.length === 0) {
      dropdownMenu.classList.add("hidden");
      return;
    }

    //drop down menu
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
    search();
  });

  document.addEventListener("click", (e) => {
    if (!inputField.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.add("hidden");
    }
  });
});

// Listens for enter pressed (no button needed to search for mons)
const enterSearch = document.getElementById("pokemon");
console.log("This runs!");

enterSearch.addEventListener('keydown', function(event) {
    if (event.key == 'Enter') {
        search();
    }
});

// Runs on startup if coming from the dex page
const mon = localStorage.getItem("query");
const startSearch = localStorage.getItem("search");

if (startSearch) {
    document.getElementById("pokemon").innerText = mon;
    localStorage.removeItem("query");
    localStorage.removeItem("search");
    search();
}

function search() {
  let newPokemon = document.getElementById("pokemon").value;

  let name = "/" + newPokemon;

  let endpoint = url + query + name;

    // AI assisted in ensuring the cache function works properly
    // We do not want to get in trouble for making too many requests...

    const cachedMons = "pokeCache" + name;
    const cached = localStorage.getItem(cachedMons);

    if (cached) {
        console.log("USING CACHE");
        parseInfo(JSON.parse(cached));
        return;
    }

  let promise = fetch(endpoint);

  promise
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((data) => {
      console.log(data);
      localStorage.setItem(cachedMons, JSON.stringify(data));
      parseInfo(data);
    });
}

async function parseInfo(data) {
  const feedContainer = document.getElementById("pokemon-game-feed");
  if (!feedContainer) return;

  let pokedexEntry = "Data log index unavailable for this system model.";
  try {
    const speciesResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${data.id}/`,
    );
    if (speciesResponse.ok) {
      const speciesData = await speciesResponse.json();
      const englishEntries = speciesData.flavor_text_entries.filter(
        (entry) => entry.language.name === "en",
      );
      if (englishEntries.length > 0) {
        pokedexEntry = englishEntries[0].flavor_text
          .replace(/\f/g, " ")
          .replace(/\n/g, " ");
      }
    }
  } catch (e) {}

  let rawEncounters = [];
  try {
    const encounterResponse = await fetch(data.location_area_encounters);
    if (encounterResponse.ok) {
      rawEncounters = await encounterResponse.json();
    }
  } catch (e) {
    console.error("Error pulling encounter logs:", e);
  }

  let formsDataArray = [];
  if (data.forms && data.forms.length > 1) {
    try {
      const formPromises = data.forms.map((f) =>
        fetch(f.url).then((res) => res.json()),
      );
      formsDataArray = await Promise.all(formPromises);
    } catch (e) {}
  }

  feedContainer.innerHTML = "";

  const cleanName = toNameCase(data.name);
  const typesList = data.types.map((t) => toNameCase(t.type.name)).join(" / ");
  const abilitiesList = data.abilities
    .map((a) => toNameCase(a.ability.name))
    .join(", ");
  const heightMeters = data.height / 10;
  const weightKilograms = data.weight / 10;
  const baseExp = data.base_experience || "---";

  let formsTabsHTML = "";
  if (formsDataArray.length > 1) {
    formsTabsHTML = `
            <div class="form-tabs-container">
                ${formsDataArray
                  .map((formObj, idx) => {
                    const rawFormName = formObj.name;
                    let displayLabel = rawFormName.includes("-")
                      ? rawFormName.split("-")[1]
                      : rawFormName;
                    displayLabel = toNameCase(displayLabel);

                    const isActive =
                      data.name === rawFormName
                        ? "active-tab"
                        : idx === 0 && !data.name.includes("-")
                          ? "active-tab"
                          : "";

                    const fNormal = formObj.sprites.front_default || "";
                    const bNormal = formObj.sprites.back_default || "";
                    const fShiny = formObj.sprites.front_shiny || "";
                    const bShiny = formObj.sprites.back_shiny || "";

                    return `
                        <button class="form-layout-tab ${isActive}" 
                                data-f-normal="${fNormal}" 
                                data-b-normal="${bNormal}" 
                                data-f-shiny="${fShiny}" 
                                data-b-shiny="${bShiny}"
                                onclick="
                                    const parent = this.parentElement;
                                    parent.querySelectorAll('.form-layout-tab').forEach(b => b.classList.remove('active-tab'));
                                    this.classList.add('active-tab');

                                    const card = this.closest('.game-entry-card');
                                    if(card) {
                                        const imgFN = card.querySelector('.img-front-normal');
                                        const imgBN = card.querySelector('.img-back-normal');
                                        const imgFS = card.querySelector('.img-front-shiny');
                                        const imgBS = card.querySelector('.img-back-shiny');

                                        if(imgFN && this.dataset.fNormal) imgFN.src = this.dataset.fNormal;
                                        if(imgBN && this.dataset.bNormal) imgBN.src = this.dataset.bNormal;
                                        if(imgFS && this.dataset.fShiny) imgFS.src = this.dataset.fShiny;
                                        if(imgBS && this.dataset.bShiny) imgBS.src = this.dataset.bShiny;
                                    }
                                ">
                            ${displayLabel}
                        </button>
                    `;
                  })
                  .join("")}
            </div>
        `;
  } else {
    formsTabsHTML = `<div class="form-tabs-container"><button class="form-layout-tab active-tab">Default Form</button></div>`;
  }

  //CHRONOLOGICAL GAME INDEX ARRAY
  const gameVersions = [
    {
      key: "red-blue",
      displayName: "Red",
      gen: "Generation I",
      spriteKey: "generation-i",
      internalVersionKeys: ["red"],
    },
    {
      key: "red-blue",
      displayName: "Blue",
      gen: "Generation I",
      spriteKey: "generation-i",
      internalVersionKeys: ["blue"],
    },
    {
      key: "yellow",
      displayName: "Yellow",
      gen: "Generation I",
      spriteKey: "generation-i",
      internalVersionKeys: ["yellow"],
    },
    {
      key: "gold",
      displayName: "Gold",
      gen: "Generation II",
      spriteKey: "generation-ii",
      internalVersionKeys: ["gold"],
    },
    {
      key: "silver",
      displayName: "Silver",
      gen: "Generation II",
      spriteKey: "generation-ii",
      internalVersionKeys: ["silver"],
    },
    {
      key: "crystal",
      displayName: "Crystal",
      gen: "Generation II",
      spriteKey: "generation-ii",
      internalVersionKeys: ["crystal"],
    },
    {
      key: "ruby-sapphire",
      displayName: "Ruby",
      gen: "Generation III",
      spriteKey: "generation-iii",
      internalVersionKeys: ["ruby"],
    },
    {
      key: "ruby-sapphire",
      displayName: "Sapphire",
      gen: "Generation III",
      spriteKey: "generation-iii",
      internalVersionKeys: ["sapphire"],
    },
    {
      key: "emerald",
      displayName: "Emerald",
      gen: "Generation III",
      spriteKey: "generation-iii",
      internalVersionKeys: ["emerald"],
    },
    {
      key: "firered-leafgreen",
      displayName: "Fire Red",
      gen: "Generation III",
      spriteKey: "generation-iii",
      internalVersionKeys: ["firered"],
    },
    {
      key: "firered-leafgreen",
      displayName: "Leaf Green",
      gen: "Generation III",
      spriteKey: "generation-iii",
      internalVersionKeys: ["leafgreen"],
    },
    {
      key: "diamond-pearl",
      displayName: "Diamond",
      gen: "Generation IV",
      spriteKey: "generation-iv",
      internalVersionKeys: ["diamond"],
    },
    {
      key: "diamond-pearl",
      displayName: "Pearl",
      gen: "Generation IV",
      spriteKey: "generation-iv",
      internalVersionKeys: ["pearl"],
    },
    {
      key: "platinum",
      displayName: "Platinum",
      gen: "Generation IV",
      spriteKey: "generation-iv",
      internalVersionKeys: ["platinum"],
    },
    {
      key: "heartgold-soulsilver",
      displayName: "Heart Gold",
      gen: "Generation IV",
      spriteKey: "generation-iv",
      internalVersionKeys: ["heartgold"],
    },
    {
      key: "heartgold-soulsilver",
      displayName: "Soul Silver",
      gen: "Generation IV",
      spriteKey: "generation-iv",
      internalVersionKeys: ["soulsilver"],
    },
    {
      key: "black-white",
      displayName: "Black",
      gen: "Generation V",
      spriteKey: "generation-v",
      internalVersionKeys: ["black"],
    },
    {
      key: "black-white",
      displayName: "White",
      gen: "Generation V",
      spriteKey: "generation-v",
      internalVersionKeys: ["white"],
    },
    {
      key: "black-2-white-2",
      displayName: "Black 2",
      gen: "Generation V",
      spriteKey: "generation-v",
      internalVersionKeys: ["black-2"],
    },
    {
      key: "black-2-white-2",
      displayName: "White 2",
      gen: "Generation V",
      spriteKey: "generation-v",
      internalVersionKeys: ["white-2"],
    },
    {
      key: "x-y",
      displayName: "X",
      gen: "Generation VI",
      spriteKey: "generation-vi",
      internalVersionKeys: ["x"],
    },
    {
      key: "x-y",
      displayName: "Y",
      gen: "Generation VI",
      spriteKey: "generation-vi",
      internalVersionKeys: ["y"],
    },
    {
      key: "omegaruby-alphasapphire",
      displayName: "Omega Ruby",
      gen: "Generation VI",
      spriteKey: "generation-vi",
      internalVersionKeys: ["omega-ruby"],
    },
    {
      key: "omegaruby-alphasapphire",
      displayName: "Alpha Sapphire",
      gen: "Generation VI",
      spriteKey: "generation-vi",
      internalVersionKeys: ["alpha-sapphire"],
    },
  ];

  gameVersions.forEach((game) => {
    let versionSprites = null;
    let mainHeaderSpriteUrl = "";

    try {
      versionSprites = data.sprites.versions[game.spriteKey][game.key];
      if (!versionSprites || !versionSprites.front_default) return;
      mainHeaderSpriteUrl = versionSprites.front_default;
    } catch (e) {
      return;
    }

    // DYNAMIC ENCOUNTER FILTERING FOR THIS CARD'S GAME VERSION
    const filteredLocations = rawEncounters.filter((loc) => {
      return loc.version_details.some((detail) =>
        game.internalVersionKeys.includes(detail.version.name),
      );
    });

    let locationsHTML = `<div class="no-location">Uncatchable / Event only in ${game.displayName}.</div>`;
    if (filteredLocations.length > 0) {
      locationsHTML = filteredLocations
        .slice(0, 6)
        .map((loc) => {
          const cleanLocName = loc.location_area.name
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
          return `<div class="location-row">📍 ${cleanLocName}</div>`;
        })
        .join("");
    }

    const vaultFrontNormal =
      versionSprites.front_default || data.sprites.front_default || "";
    const vaultBackNormal =
      versionSprites.back_default || data.sprites.back_default || "";
    const vaultFrontShiny =
      versionSprites.front_shiny || data.sprites.front_shiny || "";
    const vaultBackShiny =
      versionSprites.back_shiny || data.sprites.back_shiny || "";

    const hasFemaleSprite = !!versionSprites.front_female;
    const vaultFrontFemale =
      versionSprites.front_female || data.sprites.front_female || "";
    const vaultBackFemale =
      versionSprites.back_female || data.sprites.back_female || "";
    const vaultFrontShinyFemale =
      versionSprites.front_shiny_female ||
      data.sprites.front_shiny_female ||
      "";
    const vaultBackShinyFemale =
      versionSprites.back_shiny_female || data.sprites.back_shiny_female || "";

    const renderClass =
      game.spriteKey === "generation-vi" ? "gen-6-render" : "";

    const frontNormalBlock = hasFemaleSprite
      ? `<div class="gender-split-subrow"><img src="${vaultFrontNormal}" class="img-front-normal ${renderClass}"><span>♂</span><img src="${vaultFrontFemale}" class="${renderClass}"><span>♀</span></div>`
      : `<img src="${vaultFrontNormal}" class="img-front-normal dashboard-sprite ${renderClass}">`;

    const backNormalBlock = hasFemaleSprite
      ? `<div class="gender-split-subrow"><img src="${vaultBackNormal}" class="img-back-normal ${renderClass}"><span>♂</span><img src="${vaultBackFemale}" class="${renderClass}"><span>♀</span></div>`
      : `<img src="${vaultBackNormal}" class="img-back-normal dashboard-sprite ${renderClass}">`;

    const frontShinyBlock = hasFemaleSprite
      ? `<div class="gender-split-subrow"><img src="${vaultFrontShiny}" class="img-front-shiny ${renderClass}"><span>♂</span><img src="${vaultFrontShinyFemale}" class="${renderClass}"><span>♀</span></div>`
      : `<img src="${vaultFrontShiny}" class="img-front-shiny dashboard-sprite ${renderClass}">`;

    const backShinyBlock = hasFemaleSprite
      ? `<div class="gender-split-subrow"><img src="${vaultBackShiny}" class="img-back-shiny ${renderClass}"><span>♂</span><img src="${vaultBackShinyFemale}" class="${renderClass}"><span>♀</span></div>`
      : `<img src="${vaultBackShiny}" class="img-back-shiny dashboard-sprite ${renderClass}">`;

    const cardHTML = `
            <details class="game-entry-card" data-game="${game.key}">
                <summary class="game-entry-header">
                    <div class="header-main-info">
                        <img src="${mainHeaderSpriteUrl}" alt="${game.displayName} sprite" class="game-mini-sprite">
                        <div class="title-text-group">
                            <span class="game-title">${cleanName} — ${game.displayName}</span>
                            <span class="generation-subtitle">${game.gen}</span>
                        </div>
                    </div>
                    <span class="expand-arrow">▼</span>
                </summary>
                
                <div class="game-entry-content">
                    ${formsTabsHTML}

                    <div class="info-dashboard-grid">
                        
                        <!-- COL 1: SPRITES CABINET -->
                        <div class="dashboard-col col-sprites">
                            <span class="data-label">${game.displayName.toUpperCase()} SPRITE CABINET</span>
                            <div class="sprite-display-cabinet big-cabinet">
                                <div class="sprite-box">${frontNormalBlock}<span>Normal Front</span></div>
                                <div class="sprite-box">${backNormalBlock}<span>Normal Back</span></div>
                                <div class="sprite-box shiny-bg">${frontShinyBlock}<span class="shiny-txt">★ Shiny Front</span></div>
                                <div class="sprite-box shiny-bg">${backShinyBlock}<span class="shiny-txt">★ Shiny Back</span></div>
                            </div>
                        </div>
                        
                        <!-- COL 2: VITALS & ENCYCLOPEDIA LOG -->
                        <div class="dashboard-col col-stats">
                            <span class="data-label">VITAL COEFFICIENTS</span>
                            <div class="stats-table-box">
                                <div class="spec-row"><span class="label">INDEX:</span> <span class="val">#${String(data.id).padStart(3, "0")}</span></div>
                                <div class="spec-row"><span class="label">TYPE:</span> <span class="val">${typesList}</span></div>
                                <div class="spec-row"><span class="label">HEIGHT:</span> <span class="val">${heightMeters} m</span></div>
                                <div class="spec-row"><span class="label">WEIGHT:</span> <span class="val">${weightKilograms} kg</span></div>
                            </div>
                            
                            <span class="data-label">TRAIT INDICES</span>
                            <div class="stats-table-box">
                                <div class="spec-row"><span class="label">ABILITIES:</span> <span class="val-scroll">${abilitiesList}</span></div>
                                <div class="spec-row"><span class="label">BASE EXP:</span> <span class="val">${baseExp}</span></div>
                            </div>

                            <span class="data-label">ARCHIVAL ENTRY LOG</span>
                            <p class="flavor-text mini-text">"${pokedexEntry}"</p>
                        </div>

                        <!-- COL 3: CHRONOLOGICAL HABITAT RADAR PANEL -->
                        <div class="dashboard-col col-location">
                            <span class="data-label">${game.displayName.toUpperCase()} FIELD HABITATS</span>
                            <div class="location-radar-box">
                                ${locationsHTML}
                            </div>
                        </div>

                    </div>
                </div>
            </details>
        `;
    feedContainer.insertAdjacentHTML("beforeend", cardHTML);
  });
}

function playCry() {
  if (this.id == "latest") {
    cryArray[0].play();
    console.log("Well, I tried");
  }
}

function toNameCase(word) {
  for (let i = 0; i < word.length; i++) {
    if (!i) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    } else if (word.charAt(i) == "-") {
      // Don't do for 2 abilities that actually have a dash in them (if I care to implement)
      word = word.slice(0, i) + " " + word.slice(i + 1);
    } else if (word.charAt(i - 1) == " ") {
      word =
        word.slice(0, i) + word.charAt(i).toUpperCase() + word.slice(i + 1);
    }
  }
  return word;
}
