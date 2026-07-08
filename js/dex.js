// Listens for enter pressed
const enterSearch = document.getElementById("poke-search");

enterSearch.addEventListener('keydown', function(event) {
    if (event.key == 'Enter') {
        console.log("enter pressed!")
        searchPage();
    }
});

// Switches files and searches for specified pokemon

function searchPage() {
    console.log("SEARCHING FOR REAL");
    localStorage.setItem("query", String(document.getElementById("poke-search").value));
    localStorage.setItem("search", true);
    window.location.href = "index.html";
}