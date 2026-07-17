let url = "https://pokeapi.co/api/v2";
let query = "/pokemon"; // Base query is pokemon

let globalPokemonList = []; // Stores master directory in memory
let currentSelectedFilter = "all"; // Tracks active version filter

document.addEventListener("DOMContentLoaded", async () => {
    const inputField = document.getElementById("pokemon");
    const dropdownMenu = document.getElementById("custom-dropdown");
    if (!inputField || !dropdownMenu) return;

    // --- SETUP GAME VERSION FILTER INTERACTION ---
    const filterTrigger = document.querySelector(".filter-trigger-btn");
    const filterItems = document.querySelectorAll(".filter-item");

    filterItems.forEach((item) => {
        item.addEventListener("click", () => {
            currentSelectedFilter = item.getAttribute("data-value");

            // Update filter trigger button text visually
            if (filterTrigger) {
                filterTrigger.innerHTML = `${item.textContent} <span class="filter-arrow">▼</span>`;
            }

            // Apply filter immediately to any cards loaded in the DOM
            applyGameFilter();
        });
    });

    const mon = localStorage.getItem("query");
    const startSearch = localStorage.getItem("search");

    if (startSearch && mon) {
        inputField.value = mon.toLowerCase().trim();
        localStorage.removeItem("query");
        localStorage.removeItem("search");
        search();
    }

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
        search();
    });

    document.addEventListener("click", (e) => {
        if (
            !inputField.contains(e.target) &&
            !dropdownMenu.contains(e.target)
        ) {
            dropdownMenu.classList.add("hidden");
        }
    });
});

// Listens for enter pressed (no button needed to search for mons)
const enterSearch = document.getElementById("pokemon");
if (enterSearch) {
    enterSearch.addEventListener("keydown", function (event) {
        if (event.key == "Enter") {
            search();
        }
    });
}

function search() {
    let newPokemon = document.getElementById("pokemon").value;
    let name = "/" + newPokemon;
    let endpoint = url + query + name;

    const cachedMons = "pokeCache" + name;
    const cached = localStorage.getItem(cachedMons);

    if (cached) {
        parseInfo(JSON.parse(cached));
        return;
    }

    let promise = fetch(endpoint);
    promise
        .then((res) => res.json())
        .then((data) => {
            localStorage.setItem(cachedMons, JSON.stringify(data));
            parseInfo(data);
        });
}

// Separate helper function to filter rendered elements safely
function applyGameFilter() {
    const cards = document.querySelectorAll(".game-entry-card");
    cards.forEach((card) => {
        const gameValue = card.getAttribute("data-game-value");

        if (currentSelectedFilter === "all") {
            card.style.display = "block";
        } else if (currentSelectedFilter === gameValue) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
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
    const typesList = data.types
        .map((t) => toNameCase(t.type.name))
        .join(" / ");
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
                        return `<button class="form-layout-tab ${isActive}" onclick="/* Form swapping code */">${displayLabel}</button>`;
                    })
                    .join("")}
            </div>
        `;
    } else {
        formsTabsHTML = `<div class="form-tabs-container"><button class="form-layout-tab active-tab">Default Form</button></div>`;
    }

    // --- FULL GENERATION GAME LOG ARRAY ---
    const gameVersions = [
        {
            key: "red-blue",
            displayName: "Red",
            gen: "Generation I",
            spriteKey: "generation-i",
            internalVersionKeys: ["red"],
            filterTag: "all",
        },
        {
            key: "red-blue",
            displayName: "Blue",
            gen: "Generation I",
            spriteKey: "generation-i",
            internalVersionKeys: ["blue"],
            filterTag: "all",
        },
        {
            key: "yellow",
            displayName: "Yellow",
            gen: "Generation I",
            spriteKey: "generation-i",
            internalVersionKeys: ["yellow"],
            filterTag: "all",
        },
        {
            key: "gold",
            displayName: "Gold",
            gen: "Generation II",
            spriteKey: "generation-ii",
            internalVersionKeys: ["gold"],
            filterTag: "all",
        },
        {
            key: "silver",
            displayName: "Silver",
            gen: "Generation II",
            spriteKey: "generation-ii",
            internalVersionKeys: ["silver"],
            filterTag: "all",
        },
        {
            key: "crystal",
            displayName: "Crystal",
            gen: "Generation II",
            spriteKey: "generation-ii",
            internalVersionKeys: ["crystal"],
            filterTag: "all",
        },
        {
            key: "ruby-sapphire",
            displayName: "Ruby",
            gen: "Generation III",
            spriteKey: "generation-iii",
            internalVersionKeys: ["ruby"],
            filterTag: "all",
        },
        {
            key: "ruby-sapphire",
            displayName: "Sapphire",
            gen: "Generation III",
            spriteKey: "generation-iii",
            internalVersionKeys: ["sapphire"],
            filterTag: "all",
        },
        {
            key: "emerald",
            displayName: "Emerald",
            gen: "Generation III",
            spriteKey: "generation-iii",
            internalVersionKeys: ["emerald"],
            filterTag: "all",
        },
        {
            key: "firered-leafgreen",
            displayName: "Fire Red",
            gen: "Generation III",
            spriteKey: "generation-iii",
            internalVersionKeys: ["firered"],
            filterTag: "all",
        },
        {
            key: "firered-leafgreen",
            displayName: "Leaf Green",
            gen: "Generation III",
            spriteKey: "generation-iii",
            internalVersionKeys: ["leafgreen"],
            filterTag: "all",
        },
        {
            key: "diamond-pearl",
            displayName: "Diamond",
            gen: "Generation IV",
            spriteKey: "generation-iv",
            internalVersionKeys: ["diamond"],
            filterTag: "all",
        },
        {
            key: "diamond-pearl",
            displayName: "Pearl",
            gen: "Generation IV",
            spriteKey: "generation-iv",
            internalVersionKeys: ["pearl"],
            filterTag: "all",
        },
        {
            key: "platinum",
            displayName: "Platinum",
            gen: "Generation IV",
            spriteKey: "generation-iv",
            internalVersionKeys: ["platinum"],
            filterTag: "all",
        },

        // Custom Filter Targets matching your HTML dropdown values: 'hg', 'ss', 'or'
        {
            key: "heartgold-soulsilver",
            displayName: "Heart Gold",
            gen: "Generation IV",
            spriteKey: "generation-iv",
            internalVersionKeys: ["heartgold"],
            filterTag: "hg",
        },
        {
            key: "heartgold-soulsilver",
            displayName: "Soul Silver",
            gen: "Generation IV",
            spriteKey: "generation-iv",
            internalVersionKeys: ["soulsilver"],
            filterTag: "ss",
        },

        {
            key: "black-white",
            displayName: "Black",
            gen: "Generation V",
            spriteKey: "generation-v",
            internalVersionKeys: ["black"],
            filterTag: "all",
        },
        {
            key: "black-white",
            displayName: "White",
            gen: "Generation V",
            spriteKey: "generation-v",
            internalVersionKeys: ["white"],
            filterTag: "all",
        },
        {
            key: "black-2-white-2",
            displayName: "Black 2",
            gen: "Generation V",
            spriteKey: "generation-v",
            internalVersionKeys: ["black-2"],
            filterTag: "all",
        },
        {
            key: "black-2-white-2",
            displayName: "White 2",
            gen: "Generation V",
            spriteKey: "generation-v",
            internalVersionKeys: ["white-2"],
            filterTag: "all",
        },
        {
            key: "x-y",
            displayName: "X",
            gen: "Generation VI",
            spriteKey: "generation-vi",
            internalVersionKeys: ["x"],
            filterTag: "all",
        },
        {
            key: "x-y",
            displayName: "Y",
            gen: "Generation VI",
            spriteKey: "generation-vi",
            internalVersionKeys: ["y"],
            filterTag: "all",
        },

        {
            key: "omegaruby-alphasapphire",
            displayName: "Omega Ruby",
            gen: "Generation VI",
            spriteKey: "generation-vi",
            internalVersionKeys: ["omega-ruby"],
            filterTag: "or",
        },
        {
            key: "omegaruby-alphasapphire",
            displayName: "Alpha Sapphire",
            gen: "Generation VI",
            spriteKey: "generation-vi",
            internalVersionKeys: ["alpha-sapphire"],
            filterTag: "all",
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
                        .map(
                            (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1),
                        )
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
            versionSprites.back_shiny_female ||
            data.sprites.back_shiny_female ||
            "";

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

        // 💡 Added data-game-value targeting your custom filter menu options!
        const cardHTML = `
            <details class="game-entry-card" data-game="${game.key}" data-game-value="${game.filterTag}">
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
                        <div class="dashboard-col col-sprites">
                            <span class="data-label">${game.displayName.toUpperCase()} SPRITE CABINET</span>
                            <div class="sprite-display-cabinet big-cabinet">
                                <div class="sprite-box">${frontNormalBlock}<span>Normal Front</span></div>
                                <div class="sprite-box">${backNormalBlock}<span>Normal Back</span></div>
                                <div class="sprite-box shiny-bg">${frontShinyBlock}<span class="shiny-txt">★ Shiny Front</span></div>
                                <div class="sprite-box shiny-bg">${backShinyBlock}<span class="shiny-txt">★ Shiny Back</span></div>
                            </div>
                        </div>
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

    // Make sure current active filters apply right away to newly generated elements
    applyGameFilter();
}

// Fixed Favorite Toggle implementation using proper HTML 'disabled' attributes
async function toggleFavorite(buttonElement) {
    const isCurrentlyFavorited = buttonElement.classList.contains("active");
    const nextFavoriteState = !isCurrentlyFavorited;
    const pokemonId = buttonElement.getAttribute("data-id");
    const csrfMeta = document.querySelector('meta[name="csrf-token"]');

    try {
        // Fix: Use the standard native disabled property to stop thread freezes
        buttonElement.disabled = true;

        const response = await fetch(`/api/pokemon/${pokemonId}/favorite`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfMeta ? csrfMeta.content : "",
            },
            body: JSON.stringify({ is_favorite: nextFavoriteState }),
        });

        if (!response.ok) {
            throw new Error(`Server status: ${response.status}`);
        }

        buttonElement.classList.toggle("active");
    } catch (error) {
        console.error("Failed to update favorite status:", error.message);
    } finally {
        buttonElement.disabled = false;
    }
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


// Although redundant, it simplifies the HTML page
function searchPage() {
    search()
}