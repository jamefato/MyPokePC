// Listens for enter pressed (no button needed to search for mons)
const enterSearch = document.getElementById("poke-search");

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
      searchBtn.click();
    } else if (typeof search === "function") {
      search();
    }
  });

  document.addEventListener("click", (e) => {
    if (!inputField.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.add("hidden");
    }
  });
});

enterSearch.addEventListener("keydown", function (event) {
  if (event.key == "Enter") {
    console.log("enter pressed!");
    searchPage();
  }
});

// Switches files and searches for specified pokemon

function searchPage() {
    localStorage.setItem("query", String(document.getElementById("poke-search").value));
    localStorage.setItem("search", true);
    window.location.href = "index.html";
}
