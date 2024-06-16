let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = null; // Będzie przechowywać aktualnie zalogowanego użytkownika

// Dane administratora (prosty przykład, w praktyce nie przechowujemy takich danych w kodzie)
const adminCredentials = {
    username: 'admin',
    password: 'admin123'
};

// Funkcja rejestracji
function register() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    if (username && password) {
        const existingUser = users.find(user => user.username === username);
        if (existingUser) {
            alert('Nazwa użytkownika jest już zajęta.');
        } else {
            users.push({ username, password, books: [] });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Rejestracja zakończona pomyślnie.');
            showLogin();
        }
    } else {
        alert('Proszę wprowadzić nazwę użytkownika i hasło.');
    }
}

// Funkcja logowania
function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        window.location.href = 'library.html';
    } else {
        alert('Niepoprawna nazwa użytkownika lub hasło.');
    }
}

// Funkcja logowania administratora
function adminLogin() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    if (username === adminCredentials.username && password === adminCredentials.password) {
        showAdminPanel();
    } else {
        alert('Niepoprawna nazwa użytkownika lub hasło.');
    }
}

// Pokaż formularz rejestracji
function showRegister() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('registerSection').style.display = 'block';
    document.getElementById('adminSection').style.display = 'none';
}

// Pokaż formularz logowania
function showLogin() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('adminSection').style.display = 'none';
}

// Pokaż formularz logowania administratora
function showAdmin() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('adminSection').style.display = 'block';
}

// Pokaż panel administratora
function showAdminPanel() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('adminSection').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    updateAdminUserList();
}

// Wyloguj się
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Usuń użytkownika
function deleteUser(username) {
    users = users.filter(user => user.username !== username);
    localStorage.setItem('users', JSON.stringify(users));
    updateAdminUserList();
}

// Zaktualizuj listę użytkowników w panelu administratora
function updateAdminUserList() {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user.username;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Usuń';
        deleteButton.onclick = () => deleteUser(user.username);
        li.appendChild(deleteButton);
        userList.appendChild(li);
    });
}

// Inicjalizacja książek po załadowaniu strony biblioteki
window.onload = function () {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
        currentUser = storedUser;
        const user = users.find(user => user.username === currentUser.username);
        if (user) {
            currentUser = user;
            updateTable();
        }
    } else {
        window.location.href = 'index.html';
    }
}

// Dodaj książkę
function addBook() {
    const bookTitle = document.getElementById('bookTitle').value;
    if (bookTitle) {
        const existingBook = currentUser.books.find(book => book.title === bookTitle);
        if (existingBook) {
            alert('Ta książka jest już w tabeli.');
        } else {
            currentUser.books.push({ title: bookTitle, author: '', genre: '', totalPages: 0, pagesRead: 0 });
            document.getElementById('bookTitle').value = '';
            updateTable();
        }
    }
}

// Zaktualizuj książkę
function updateBook() {
    const targetTitle = document.getElementById('targetTitle').value;
    const author = document.getElementById('author').value;
    const genre = document.getElementById('genre').value;
    const totalPages = parseInt(document.getElementById('totalPages').value);
    const pagesRead = parseInt(document.getElementById('pagesRead').value);

    const book = currentUser.books.find(b => b.title === targetTitle);
    if (book) {
        if (author) book.author = author;
        if (genre) book.genre = genre;
        if (totalPages) book.totalPages = totalPages;
        if (pagesRead >= 0 && pagesRead <= totalPages) {
            book.pagesRead = pagesRead;
        } else {
            alert('Ilość przeczytanych stron nie może być większa niż ilość stron książki.');
        }
        document.getElementById('targetTitle').value = '';
        document.getElementById('author').value = '';
        document.getElementById('genre').value = '';
        document.getElementById('totalPages').value = '';
        document.getElementById('pagesRead').value = '';
        updateTable();
    } else {
        alert('Ten tytuł nie znajduje się w tabeli.');
    }
}

// Usuń książkę
function deleteBook() {
    const targetTitle = document.getElementById('targetTitle').value;
    currentUser.books = currentUser.books.filter(b => b.title !== targetTitle);
    document.getElementById('targetTitle').value = '';
    updateTable();
}

// Zaktualizuj tabelę
function updateTable() {
    const tbody = document.querySelector('#bookTable tbody');
    tbody.innerHTML = '';
    currentUser.books.forEach(book => {
        const percentRead = book.totalPages ? ((book.pagesRead / book.totalPages) * 100).toFixed(2) : 0;
        const row = document.createElement('tr');

        // Dodaj pasek postępu jako nową komórkę w wierszu
        const progressCell = document.createElement('td');
        const progress = document.createElement('progress');
        progress.setAttribute('value', percentRead);
        progress.setAttribute('max', '100');

        // Dodaj obsługę zdarzenia mouseover
        row.addEventListener('mouseover', function () {
            progress.setAttribute('title', `${percentRead}%`);
        });

        // Dodaj obsługę zdarzenia mouseout
        row.addEventListener('mouseout', function () {
            progress.removeAttribute('title');
        });

        progressCell.appendChild(progress);
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.genre}</td>
            <td>${book.totalPages}</td>
            <td>${book.pagesRead}</td>
        `;
        row.appendChild(progressCell);
        tbody.appendChild(row);
    });
    localStorage.setItem('users', JSON.stringify(users));
}


// Pokaż szczegóły użytkownika
function showDetails() {
    window.location.href = 'details.html';
}

// Pobierz nagłówek
var header = document.querySelector('header');

// Śledź przewijanie strony
window.addEventListener('scroll', function () {
    // Jeśli przewinięcie strony jest większe niż 50px
    if (window.scrollY > 50) {
        // Dodaj klasę "small" do nagłówka
        header.classList.add('small');
    } else {
        // W przeciwnym razie usuń klasę "small"
        header.classList.remove('small');
    }
});
