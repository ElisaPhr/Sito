// URL del file JSON
const jsonURL = 'Processed_Books.json';

// Elementi DOM
const searchBar = document.getElementById('search-bar');
const suggestionsList = document.getElementById('suggestions');
const featuredBooks = document.querySelector('.featured-books');

// Funzione per andare alla pagina dei risultati
function goToResults(title) {
    window.location.href = `results.html?book=${encodeURIComponent(title)}`;
}

// Funzione per caricare i libri dal JSON e mostrarli in evidenza
async function loadBooks() {
    try {
        const response = await fetch(jsonURL);
        const books = await response.json();
        displayFeaturedBooks(books); // Mostra i libri in evidenza
        setupSearch(books); // Configura la barra di ricerca
    } catch (error) {
        console.error('Errore nel caricamento dei libri:', error);
    }
}

// Funzione per mostrare i libri in evidenza
function displayFeaturedBooks(books) {
    const bookTitles = Object.keys(books).slice(0, 3); // Prendi solo i primi 3 libri
    bookTitles.forEach(title => {
        const book = books[title];
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card'; // Aggiunge la classe per lo stile coerente

        bookCard.innerHTML = `
            <img src="${book.Info.Cover}" alt="${title}">
            <div class="book-info">
                <p class="title">${title}</p>
                <p class="author">${book.Info.Author}</p>
            </div>
        `;

        bookCard.addEventListener('click', () => goToResults(title)); // Navigazione al clic
        featuredBooks.appendChild(bookCard);
    });
}

// Configura la barra di ricerca
function setupSearch(books) {
    searchBar.addEventListener('input', () => {
        const query = searchBar.value.toLowerCase();
        suggestionsList.innerHTML = '';

        if (query.length > 1) {
            const suggestions = Object.keys(books).filter(title =>
                title.toLowerCase().includes(query) ||
                books[title].Info.Author.toLowerCase().includes(query)
            );

            suggestions.forEach(title => {
                const suggestionItem = document.createElement('li');
                suggestionItem.textContent = `${title} - ${books[title].Info.Author}`;
                suggestionItem.addEventListener('click', () => {
                    goToResults(title);
                });
                suggestionsList.appendChild(suggestionItem);
            });
        }
    });
}

// Carica i libri e avvia la logica
loadBooks();
