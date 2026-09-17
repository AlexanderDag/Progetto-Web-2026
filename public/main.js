// =====================================================
// ELEMENTI DELLA PAGINA
// =====================================================

const searchInput = document.querySelector("#cerca");
const giochiContainer = document.querySelector("#giochi");
const loginLink = document.querySelector("#login-link");
const tuttiGiochiButton = document.querySelector("#tutti-giochi");


// =====================================================
// VARIABILI
// =====================================================

// Contiene tutti i giochi presenti nel catalogo
let games = [];

// Contiene le card attualmente presenti nella pagina
let cards = [];


// =====================================================
// CONTROLLO UTENTE LOGGATO
// =====================================================

async function controllaUtente() {

    try {

        const response = await fetch(
            "http://localhost:3000/api/me"
        );

        // Se non siamo autenticati,
        // lasciamo semplicemente "Login"
        if (!response.ok) {
            return;
        }

        const data = await response.json();

        if (!data.success || !data.user) {
            return;
        }

        if (!loginLink) {
            return;
        }


        // =================================================
        // MOSTRA USERNAME
        // =================================================

        loginLink.textContent =
            data.user.username;

        // Non deve più portare a login.html
        loginLink.href = "#";


        // =================================================
        // CREAZIONE MENU UTENTE
        // =================================================

        const userMenu =
            document.querySelector("#user-menu");

        if (!userMenu) {
            return;
        }


        // Menu a tendina
        const dropdown =
            document.createElement("div");

        dropdown.classList.add("user-dropdown");

        dropdown.innerHTML = `

            <div class="user-info">

                <span class="user-icon">
                    👤
                </span>

                <span>
                    ${data.user.username}
                </span>

            </div>


            <div class="dropdown-divider"></div>


            <button
                type="button"
                class="dropdown-item"
                id="miei-giochi-button">

                🎮 I miei giochi

            </button>


            <button
                type="button"
                class="dropdown-item logout"
                id="logout-button">

                ↪ Esci

            </button>

        `;

        userMenu.appendChild(dropdown);


        // =================================================
        // APERTURA MENU
        // =================================================

        loginLink.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();

                userMenu.classList.toggle("open");

            }
        );


        // =================================================
        // CLICK FUORI DAL MENU
        // =================================================

        document.addEventListener(
            "click",
            event => {

                if (!userMenu.contains(event.target)) {

                    userMenu.classList.remove("open");

                }

            }
        );


        // =================================================
        // I MIEI GIOCHI
        // =================================================

        const mieiGiochiButton =
            document.querySelector("#miei-giochi-button");

        if (mieiGiochiButton) {

            mieiGiochiButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    userMenu.classList.remove("open");

                    caricaMieiGiochi();

                }
            );

        }


        // =================================================
        // LOGOUT
        // =================================================

        const logoutButton =
            document.querySelector("#logout-button");

        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                async event => {

                    event.preventDefault();
                    event.stopPropagation();

                    try {

                        const response = await fetch(
                            "http://localhost:3000/logout",
                            {
                                method: "POST"
                            }
                        );


                        if (!response.ok) {

                            throw new Error(
                                "Logout fallito"
                            );

                        }


                        // Dopo il logout
                        // ricarichiamo la pagina
                        window.location.reload();


                    } catch (error) {

                        console.error(
                            "Errore logout:",
                            error
                        );

                        alert(
                            "Errore durante il logout"
                        );

                    }

                }
            );

        }

    } catch (error) {

        console.error(
            "Errore controllo utente:",
            error
        );

    }

}


// =====================================================
// CARICAMENTO DI TUTTI I GIOCHI
// =====================================================

async function caricaGiochi() {

    // Mostriamo lo stato di caricamento
    if (giochiContainer) {

        giochiContainer.innerHTML = `

            <p class="loading-message">
                Caricamento giochi...
            </p>

        `;

    }


    try {

        const response = await fetch(
            "http://localhost:3000/api/games"
        );


        // Controllo status HTTP
        if (!response.ok) {

            throw new Error(
                "Errore nella richiesta dei giochi"
            );

        }


        const data = await response.json();


        // Controllo formato risposta
        if (
            !data.success ||
            !Array.isArray(data.games)
        ) {

            throw new Error(
                "Formato dati non valido"
            );

        }


        // Salviamo i giochi
        games = data.games;


        // Lista vuota
        if (games.length === 0) {

            mostraListaVuota(
                "Non ci sono giochi disponibili."
            );

            return;

        }


        // Creiamo le card
        creaCards(games);


    } catch (error) {

        console.error(
            "Errore caricamento giochi:",
            error
        );


        if (giochiContainer) {

            giochiContainer.innerHTML = `

                <p class="error-message">
                    Impossibile caricare i giochi.
                </p>

            `;

        }

    }

}


// =====================================================
// CREAZIONE DELLE CARD
// =====================================================

function creaCards(listaGiochi) {

    if (!giochiContainer) {
        return;
    }


    // Svuotiamo il contenitore
    giochiContainer.innerHTML = "";


    // Lista vuota
    if (listaGiochi.length === 0) {

        mostraListaVuota(
            "Non hai ancora aggiunto nessun gioco."
        );

        return;

    }


    // Creiamo una card per ogni gioco
    listaGiochi.forEach(game => {

        const card =
            document.createElement("div");


        card.classList.add("card");


        // Salviamo l'ID del gioco
        card.dataset.gameId =
            game.index;


        // =================================================
        // CONTENUTO CARD
        // =================================================

        card.innerHTML = `

            <!-- Pulsante chiusura -->

            <button
                class="card-close"
                type="button"
                aria-label="Chiudi">

                &times;

            </button>


            <!-- Nome gioco -->

            <p class="card-title">
                ${game.name}
            </p>


            <!-- Piattaforme -->

            <div class="card-info">

                <span class="info-label">
                    Piattaforme
                </span>

                <div class="tags">

                    ${game.platform.map(platform => `

                        <span class="tag">
                            ${platform}
                        </span>

                    `).join("")}

                </div>

            </div>


            <!-- Tag -->

            <div class="card-info">

                <span class="info-label">
                    Tag
                </span>

                <div class="tags">

                    ${game.tags.map(tag => `

                        <span class="tag">
                            ${tag}
                        </span>

                    `).join("")}

                </div>

            </div>


            <!-- =========================================
                 DETTAGLI DELLA CARD
            ========================================== -->

            <div class="card-details">


                <!-- Risorse -->

                <div class="card-info">

                    <span class="info-label">
                        Risorse
                    </span>


                    <div class="game-links">


                        <a
                            href="${game.howLongToBeat}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="game-link">

                            ⏱ HowLongToBeat

                        </a>


                        <a
                            href="${game.review}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="game-link">

                            ⭐ Recensione

                        </a>


                    </div>

                </div>


                <!-- Pulsante aggiunta -->

                <button
                    type="button"
                    class="add-game-button"
                    data-game-id="${game.index}">

                    + Aggiungi ai miei giochi

                </button>


            </div>

        `;


        // Aggiungiamo la card alla pagina
        giochiContainer.appendChild(card);

    });


    // Aggiorniamo la lista globale delle card
    cards =
        document.querySelectorAll(".card");


    // Configuriamo gli eventi
    configuraCards();

}


// =====================================================
// CONFIGURAZIONE EVENTI DELLE CARD
// =====================================================

function configuraCards() {

    cards.forEach(card => {


        // =================================================
        // APERTURA CARD
        // =================================================

        card.addEventListener(
            "click",
            () => {

                // Se c'è già una card aperta,
                // non ne apriamo un'altra
                if (
                    document.querySelector(
                        ".card--open"
                    )
                ) {

                    return;

                }


                // Creiamo overlay
                const overlay =
                    document.createElement("div");

                overlay.classList.add(
                    "overlay"
                );


                // Inseriamo overlay nel body
                document.body.appendChild(
                    overlay
                );


                // Espandiamo la card
                card.classList.add(
                    "card--open"
                );


                // Click sull'overlay
                overlay.addEventListener(
                    "click",
                    () => {

                        chiudiCard(
                            card,
                            overlay
                        );

                    }
                );

            }
        );


        // =================================================
        // PULSANTE CHIUDI
        // =================================================

        const closeButton =
            card.querySelector(
                ".card-close"
            );


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    const overlay =
                        document.querySelector(
                            ".overlay"
                        );


                    chiudiCard(
                        card,
                        overlay
                    );

                }
            );

        }


        // =================================================
        // TAG
        // =================================================

        const cardTags =
            card.querySelectorAll(
                ".tag"
            );


        cardTags.forEach(tag => {

            tag.addEventListener(
                "click",
                event => {

                    // Evitiamo l'apertura
                    // della card
                    event.stopPropagation();


                    if (!searchInput) {
                        return;
                    }


                    // Prendiamo il testo del tag
                    const valoreTag =
                        tag.textContent.trim();


                    // Inseriamo nel campo ricerca
                    searchInput.value =
                        valoreTag;


                    // Eseguiamo la ricerca
                    cercaGiochi();


                    // Focus sul campo
                    searchInput.focus();


                    // Selezioniamo il testo
                    searchInput.select();

                }
            );

        });


        // =================================================
        // LINK HOWLONGTOBEAT E RECENSIONE
        // =================================================

        const gameLinks =
            card.querySelectorAll(
                ".game-link"
            );


        gameLinks.forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    // Evita che il click
                    // apra la card
                    event.stopPropagation();

                }
            );

        });


        // =================================================
        // AGGIUNGI AI MIEI GIOCHI
        // =================================================

        const addButton =
            card.querySelector(
                ".add-game-button"
            );


        if (addButton) {

            addButton.addEventListener(
                "click",
                event => {

                    // Evita apertura card
                    event.stopPropagation();


                    const gameId =
                        Number(
                            addButton.dataset.gameId
                        );


                    aggiungiAiMieiGiochi(
                        gameId,
                        addButton
                    );

                }
            );

        }

    });

}


// =====================================================
// CHIUSURA CARD
// =====================================================

function chiudiCard(card, overlay) {

    card.classList.remove(
        "card--open"
    );


    if (overlay) {

        overlay.remove();

    }

}


// =====================================================
// RICERCA GIOCHI
// =====================================================

function cercaGiochi() {

    if (!searchInput) {
        return;
    }


    const ricerca =
        searchInput.value
            .trim()
            .toLowerCase();


    cards.forEach(card => {

        const contenutoCard =
            card.textContent.toLowerCase();


        if (
            contenutoCard.includes(
                ricerca
            )
        ) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

}


// =====================================================
// EVENTO RICERCA
// =====================================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        cercaGiochi
    );

}


// =====================================================
// AGGIUNGI AI MIEI GIOCHI
// =====================================================

async function aggiungiAiMieiGiochi(
    gameId,
    addButton
) {

    try {

        // Disabilitiamo temporaneamente
        // il pulsante
        if (addButton) {

            addButton.disabled = true;

            addButton.textContent =
                "Aggiunta...";

        }


        const response = await fetch(
            "http://localhost:3000/api/my-games",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    gameId: gameId
                })
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Errore durante l'aggiunta"
            );

        }


        // Aggiornamento visivo
        if (addButton) {

            addButton.textContent =
                "✓ Nei miei giochi";

        }


        console.log(
            "Gioco aggiunto:",
            data.game
        );


    } catch (error) {

        console.error(
            "Errore aggiunta gioco:",
            error
        );


        alert(
            error.message
        );


        // Riattiviamo il pulsante
        if (addButton) {

            addButton.disabled = false;

            addButton.textContent =
                "+ Aggiungi ai miei giochi";

        }

    }

}


// =====================================================
// CARICAMENTO I MIEI GIOCHI
// =====================================================

async function caricaMieiGiochi() {

    if (!giochiContainer) {
        return;
    }


    // Stato caricamento
    giochiContainer.innerHTML = `

        <p class="loading-message">
            Caricamento dei tuoi giochi...
        </p>

    `;


    try {

        const response =
            await fetch(
                "http://localhost:3000/api/my-games"
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Errore nel caricamento"
            );

        }


        if (
            !data.success ||
            !Array.isArray(data.games)
        ) {

            throw new Error(
                "Formato dati non valido"
            );

        }


        // Lista vuota
        if (data.games.length === 0) {

            mostraListaVuota(
                "Non hai ancora aggiunto nessun gioco."
            );

            return;

        }


        // Mostriamo i giochi personali
        creaCards(data.games);


    } catch (error) {

        console.error(
            "Errore caricamento miei giochi:",
            error
        );


        giochiContainer.innerHTML = `

            <p class="error-message">
                Impossibile caricare i tuoi giochi.
            </p>

        `;

    }

}


// =====================================================
// LISTA VUOTA
// =====================================================

function mostraListaVuota(messaggio) {

    if (!giochiContainer) {
        return;
    }


    giochiContainer.innerHTML = `

        <p class="empty-message">
            ${messaggio}
        </p>

    `;

}


// =====================================================
// PULSANTE "TUTTI I GIOCHI"
// =====================================================

if (tuttiGiochiButton) {

    tuttiGiochiButton.addEventListener(
        "click",
        () => {

            // Se i giochi sono già stati caricati,
            // li mostriamo direttamente
            if (games.length > 0) {

                creaCards(games);

            } else {

                // Altrimenti li carichiamo dal server
                caricaGiochi();

            }

        }
    );

}


// =====================================================
// AVVIO APPLICAZIONE
// =====================================================

// Controlliamo l'utente
controllaUtente();

// Carichiamo tutti i giochi
caricaGiochi();
