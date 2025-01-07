// dataset.js

// URL del file JSON
const jsonURL = 'Processed_Books.json';

// Elementi DOM
const bookList = document.getElementById('book-list');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
const pageIndicator = document.getElementById('page-indicator');

let books = [];
let currentPage = 1;
const booksPerPage = 20;

// Funzione per caricare i dati dal file JSON
async function loadBooks() {
    try {
        const response = await fetch(jsonURL);
        books = await response.json();
        displayBooks();
    } catch (error) {
        console.error('Errore nel caricamento dei libri:', error);
    }
}

// Funzione per visualizzare i libri nella pagina corrente
function displayBooks() {
    bookList.innerHTML = '';
    const bookTitles = Object.keys(books);
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = Math.min(startIndex + booksPerPage, bookTitles.length);

    for (let i = startIndex; i < endIndex; i++) {
        const title = bookTitles[i];
        const book = books[title];

        const bookElement = document.createElement('div');
        bookElement.className = 'book-item';
        bookElement.innerHTML = `
            <img src="${book.Info.Cover}" alt="${title}" class="book-cover">
            <div class="book-info">
                <h3 class="book-title">${title}</h3>
                <p><strong>Autore:</strong> ${book.Info.Author}</p>
                <button class="details-button">Maggiori informazioni</button>
                <div class="extra-info" style="display: none;">
                    <p><strong>Anno:</strong> ${book.Info.Year}</p>
                    <p><strong>Genere:</strong> ${book.Info.Genre}</p>
                </div>
            </div>
        `;

        const detailsButton = bookElement.querySelector('.details-button');
        const extraInfo = bookElement.querySelector('.extra-info');
        const bookCover = bookElement.querySelector('.book-cover');
        const bookTitle = bookElement.querySelector('.book-title');

        // Listener per il pulsante "Maggiori informazioni"
        detailsButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Blocca la propagazione del click
            extraInfo.style.display = extraInfo.style.display === 'none' ? 'block' : 'none';
        });

        // Listener per la copertina e il titolo del libro
        [bookCover, bookTitle].forEach((element) => {
            element.addEventListener('click', () => {
                window.location.href = `results.html?book=${encodeURIComponent(title)}`;
            });
        });

        bookList.appendChild(bookElement);
    }

    updatePagination(bookTitles.length);
}

// Funzione per aggiornare la navigazione della paginazione
function updatePagination(totalBooks) {
    pageIndicator.textContent = `Pagina ${currentPage}`;

    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === Math.ceil(totalBooks / booksPerPage);
}

// Eventi per i pulsanti di navigazione
prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayBooks();
    }
});

nextPageButton.addEventListener('click', () => {
    if (currentPage < Math.ceil(Object.keys(books).length / booksPerPage)) {
        currentPage++;
        displayBooks();
    }
});

// Avvia il caricamento dei libri
loadBooks();
