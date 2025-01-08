// URL del file JSON
const jsonURL = 'Processed_Books.json';
let bookData = {};

// Funzione per caricare il file JSON
async function loadJSON() {
    try {
        const response = await fetch(jsonURL);
        bookData = await response.json();
        loadBookDetailsFromURL(); // Carica i dettagli del libro una volta che il JSON è pronto
    } catch (error) {
        console.error('Errore nel caricamento dei dati JSON:', error);
    }
}

// Funzione per formattare le percentuali rimuovendo "0."
const formatPercentage = (value) => {
    const strValue = value.toString();
    if (strValue.startsWith("0.") && strValue.length === 3) {
        return strValue.replace("0.", "") + "0";
    }
    return strValue.replace("0.", "");
};

// Funzione per mostrare i dettagli del libro principale
function loadBookDetails(bookTitle) {
    const book = bookData[bookTitle];
    if (!book) return;

    // Popola i dettagli principali del libro
    document.getElementById("book-title").textContent = bookTitle;
    document.getElementById("book-cover").src = book.Info.Cover;
    document.getElementById("book-author").textContent = book.Info.Author;
    document.getElementById("book-year").textContent = book.Info.Year;
    document.getElementById("book-genre").textContent = book.Info.Genre;

    // Carica i libri correlati
    const relatedBooks = book["Top Affinities"];
    const relatedBooksContainer = document.querySelector(".related-books");

    // Svuota il contenitore per assicurarsi che non ci siano duplicati
    relatedBooksContainer.innerHTML = '';

    relatedBooks.forEach((related, index) => {
        // Converte le affinità in stringhe senza lo "0."
        const avResult = formatPercentage(related.Affinity.av_result);
        const listsResult = formatPercentage(related.Affinity.lists_result);
        const bertResult = formatPercentage(related.Affinity.bert_result);
        const fnResult = formatPercentage(related.Affinity.fn_result);

        // Crea un elemento per ogni libro correlato
        const relatedDiv = document.createElement("div");
        relatedDiv.className = "related-book";

        relatedDiv.innerHTML = `
            <img src="${related.Info.Cover}" alt="Copertina libro correlato" class="related-cover">
            <div class="related-info">
                <p><strong>Titolo:</strong> ${related.Title}</p>
                <p><strong>Autore:</strong> ${related.Info.Author}</p>
                <p><strong>Affinità:</strong> ${avResult}%</p>
                <button class="details-button" onclick="showDetails(${index})">Ulteriori dettagli</button>
                <div class="extra-info" id="details-${index}" style="display: none;">
                    <p>Affinità basata sulle parole più frequenti: ${listsResult}%</p>
                    <p>Affinità basata su BERT: ${bertResult}%</p>
                    <p>Affinità basata su FrameNet: ${fnResult}%</p>
                </div>
            </div>
        `;

        relatedBooksContainer.appendChild(relatedDiv);
    });
}

// Funzione per mostrare/nascondere i dettagli aggiuntivi
function showDetails(index) {
    const detailsDiv = document.getElementById(`details-${index}`);
    if (detailsDiv.style.display === "none" || detailsDiv.style.display === "") {
        detailsDiv.style.display = "block";
    } else {
        detailsDiv.style.display = "none";
    }
}

// Simulazione del caricamento della pagina con un libro specifico
// Questo dovrebbe essere dinamico basato sull'input dell'utente
function getBookTitleFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('book'); // Ottieni il titolo dal parametro 'book'
}

function loadBookDetailsFromURL() {
    const bookTitle = getBookTitleFromURL();
    if (!bookTitle) {
        console.error('Nessun titolo specificato nell\'URL');
        return;
    }

    loadBookDetails(bookTitle); // Usa la funzione esistente per caricare i dettagli
}

// Chiama la funzione per caricare i dettagli in base all'URL
loadJSON(); // Inizia caricando il file JSON
