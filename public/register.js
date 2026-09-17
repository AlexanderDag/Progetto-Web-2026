const registerForm = document.querySelector("#register-form");

registerForm.addEventListener("submit", async (event) => {

    // Evita il normale invio del form
    event.preventDefault();

    const username =
        document.querySelector("#username").value.trim();

    const password =
        document.querySelector("#password").value;

    try {

        const response = await fetch(
            "http://localhost:3000/api/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username,
                    password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Errore durante la registrazione"
            );
        }

        
        alert("Account creato con successo!");

        // Torniamo alla pagina principale
        window.location.href = "index.html";

    } catch (error) {

        console.error(
            "Errore registrazione:",
            error
        );

        alert(error.message);

    }

});
