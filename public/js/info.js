let globalPokemonList = [];

// Handles all events (only when the page has loaded)

document.addEventListener("DOMContentLoaded", async () => {
    const dropdownMenu = document.getElementById("custom-dropdown");
    const monInputField = document.getElementById("pokemon");

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

    // Global click

    document.addEventListener("click", (e) => {
        if (
            !monInputField.contains(e.target) &&
            !dropdownMenu.contains(e.target)
        ) {
            dropdownMenu.classList.add("hidden");
        }
    });
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