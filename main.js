// ===== RICERCA GIOCHI =====

const searchInput = document.querySelector("#cerca");
const cards = document.querySelectorAll(".card");
const tags = document.querySelectorAll(".tag");


// Funzione che esegue la ricerca
function cercaGiochi() {

    const ricerca = searchInput.value
        .trim()
        .toLowerCase();

    cards.forEach(card => {

        const contenutoCard = card.textContent.toLowerCase();

        if (contenutoCard.includes(ricerca)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }

    });
}


// Ricerca mentre si scrive
searchInput.addEventListener("input", cercaGiochi);


// ===== CLICK SUI TAG =====

tags.forEach(tag => {

    tag.addEventListener("click", (event) => {

        // Evita che il click venga interpretato
        // come click sulla card
        event.stopPropagation();

        // Prende il testo del tag
        const valoreTag = tag.textContent.trim();

        // Lo inserisce nel campo cerca
        searchInput.value = valoreTag;

        // Esegue automaticamente la ricerca
        cercaGiochi();

        // Porta il cursore nel campo di ricerca
        searchInput.focus();

        // Seleziona il testo inserito
        searchInput.select();

    });

});
