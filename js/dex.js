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
    console.log("SEARCHING FOR REAL")
    globalSearch = document.getElementById("poke-search").innerText;
    globalSearching = true;
    window.location.href = "index.html";
}