let url = "https://pokeapi.co/api/v2";
let query = "/pokemon"; // Base query is pokemon

// Initial text: (none for now)
const infoText = document.getElementById("info").innerText
const abText = document.getElementById("abilities").innerText
const cryText = document.getElementById("cries").innerText
const formText = document.getElementById("forms").innerText

// Runs on startup if coming from the dex page
if (globalSearching) {
    document.getElementById.innerText = globalSearch;
    globalSearching = false;
    globalSearch = "";
    search();
}

function search() {

    let newPokemon = document.getElementById("pokemon").value;

    let name = "/" + newPokemon;

    let endpoint = url + query + name;

    console.log(newPokemon);
    console.log(endpoint);

    let promise = fetch(endpoint);
    
    promise.then((res) => {

    console.log(res)
    return res.json()

    }).then(data => {
    
        console.log(data)

        // Basic info (name, Pokedex number...)

        const infoContainer = document.getElementById("info")
        infoContainer.replaceChildren()
        infoContainer.innerText = infoText
        const olI = document.createElement('ul')

        // Name

        let info1 = document.createElement('li')
        info1.innerText = self.toNameCase(data.name)
        olI.appendChild(info1)

        // Pokedex Number

        let info2 = document.createElement('li')
        info2.innerText = "Pokedex number " + String(data.id)
        olI.appendChild(info2)

        // Types

        let info3 = document.createElement('li')
        for (let i = 0; i < data.types.length; i++) {
            if (!i) {
                info3.innerText = String(self.toNameCase(data.types[i].type.name))
            } else {
                info3.innerText += "/" + String(self.toNameCase(data.types[i].type.name))
            }
        }
        info3.innerText += " type"
        olI.appendChild(info3)

        infoContainer.appendChild(olI)

        // Abilities

        const abContainer = document.getElementById("abilities")
        abContainer.replaceChildren()
        abContainer.innerText = abText
        const olA = document.createElement('ol')

        data.abilities.forEach(ab => {
            const li = document.createElement('li')
            let abilities = ab.ability.name
            abilities = self.toNameCase(abilities)
            li.textContent = abilities
            olA.appendChild(li)
        });
        abContainer.appendChild(olA)

        // Cries

        const cryContainer = document.getElementById("cries")
        cryContainer.replaceChildren()
        cryContainer.innerText = cryText
        const olC = document.createElement("ol")
        let cryArray = []

        for (let i = 0; i < 2; i++) {
            const li = document.createElement('li')
            const button = document.createElement('button')

            let cryType
            if (i == 0) {
                cryType = data.cries.latest
                button.id = "latest"
                button.innerText = "Latest"

            } else {
                cryType = data.cries.legacy
                button.id = "legacy"
                button.innerText = "Legacy"
            }
            
            
            cryArray.push(new Audio(cryType))
            button.onclick = playCry()
            li.appendChild(button)
            olC.appendChild(li)
        }
        cryContainer.appendChild(olC)
        
        // Forms

        const formContainer = document.getElementById("forms")
        formContainer.replaceChildren()
        formContainer.innerText = formText
        const olF = document.createElement('ol')
        data.forms.forEach(formData =>{
            const li = document.createElement('li')
            let form = formData.name
            form = self.toNameCase(form)
            li.textContent = form
            olF.appendChild(li)
        });

        formContainer.appendChild(olF)
        
        // Sprites

        const spriteContainer = document.getElementById("sprites")
        spriteContainer.replaceChildren()

        console.log(spriteContainer)
        
        const spr1 = data.sprites.back_default
        const spr2 = data.sprites.back_female
        const spr3 = data.sprites.back_shiny
        const spr4 = data.sprites.back_shiny_female
        const spr5 = data.sprites.front_default
        const spr6 = data.sprites.front_female
        const spr7 = data.sprites.front_shiny
        const spr8 = data.sprites.front_shiny_female

        const sprites = [spr1, spr2, spr3, spr4, spr5, spr6, spr7, spr8]

        for (let i = 0; i < sprites.length; i++) {
            if (sprites[i] != null) {
                const img = document.createElement('img')
                img.src = sprites[i]
                spriteContainer.appendChild(img)
            }
        }
    

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
        }
        else if (word.charAt(i - 1) == " ") {
            word = word.slice(0, i) + word.charAt(i).toUpperCase() + word.slice(i + 1);
        }
    }
    return word;
}