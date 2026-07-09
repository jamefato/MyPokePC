// Listens for enter pressed (no button needed to search for mons)
const enterSearch = document.getElementById("poke-search");

enterSearch.addEventListener('keydown', function(event) {
    if (event.key == 'Enter') {
        searchPage();
    }
});

// Switches files and searches for specified pokemon

function searchPage() {
    localStorage.setItem("query", String(document.getElementById("poke-search").value));
    localStorage.setItem("search", true);
    window.location.href = "index.html";
}