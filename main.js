// ===== ELEMENTI =====

const searchInput = document.querySelector("#cerca");
const cards = document.querySelectorAll(".card");
const tags = document.querySelectorAll(".tag");


// ===== RICERCA GIOCHI =====

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

        // Evita che il click sul tag
        // apra anche la card
        event.stopPropagation();

        // Prende il testo del tag
        const valoreTag = tag.textContent.trim();

        // Lo inserisce nel campo cerca
        searchInput.value = valoreTag;

        // Esegue la ricerca
        cercaGiochi();

        // Porta il cursore nel campo di ricerca
        searchInput.focus();

        // Seleziona il testo
        searchInput.select();

    });

});


// ===== CREAZIONE OVERLAY =====

const overlay = document.createElement("div");

overlay.classList.add("overlay");


// ===== APERTURA CARD =====

cards.forEach(card => {

    card.addEventListener("click", () => {

        // Se c'è già una card aperta,
        // non fare nulla
        if (document.querySelector(".card--open")) {
            return;
        }

        // Mostra l'overlay
        document.body.appendChild(overlay);

        // Espande la card
        card.classList.add("card--open");

    });


    // ===== PULSANTE CHIUDI =====

    const closeButton = card.querySelector(".card-close");

    closeButton.addEventListener("click", (event) => {

        // Evita che il click sulla X
        // venga interpretato come click sulla card
        event.stopPropagation();

        chiudiCard(card);

    });

});


// ===== FUNZIONE CHIUSURA CARD =====

function chiudiCard(card) {

    // Rimuove la classe che espande la card
    card.classList.remove("card--open");

    // Rimuove l'overlay
    if (overlay.parentElement) {
        overlay.remove();
    }

}


// ===== CLICK SULL'OVERLAY =====

overlay.addEventListener("click", () => {

    const cardAperta = document.querySelector(".card--open");

    if (cardAperta) {
        chiudiCard(cardAperta);
    }

});
