let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = null; // Bêdzie przechowywaæ aktualnie zalogowanego u¿ytkownika

// Dane administratora (prosty przyk³ad, w praktyce nie przechowujemy takich danych w kodzie)
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
            alert('Nazwa u¿ytkownika jest ju¿ zajêta.');
        } else {
            users.push({ username, password, books: [] });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Rejestracja zakoñczona pomyœlnie.');
            showLogin();
        }
    } else {
        alert('Proszê wprowadziæ nazwê u¿ytkownika i has³o.');
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
        alert('Niepoprawna nazwa u¿ytkownika lub has³o.');
    }
}

// Funkcja logowania administratora
function adminLogin() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    if (username === adminCredentials.username && password === adminCredentials.password) {
        showAdminPanel();
    } else {
        alert('Niepoprawna nazwa u¿ytkownika lub has³o.');
    }
}

// Poka¿ formularz rejestracji
function showRegister() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('registerSection').style.display = 'block';
    document.getElementById('adminSection').style.display = 'none';
}

// Poka¿ formularz logowania
function showLogin() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('adminSection').style.display = 'none';
}

// Poka¿ formularz logowania administratora
function showAdmin() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('adminSection').style.display = 'block';
}

// Poka¿ panel administratora
function showAdminPanel() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('adminSection').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    updateAdminUserList();
}

// Wyloguj siê
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Usuñ u¿ytkownika
function deleteUser(username) {
    users = users.filter(user => user.username !== username);
    localStorage.setItem('users', JSON.stringify(users));
    updateAdminUserList();
}

// Zaktualizuj listê u¿ytkowników w panelu administratora
function updateAdminUserList() {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user.username;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Usuñ';
        deleteButton.onclick = () => deleteUser(user.username);
        li.appendChild(deleteButton);
        userList.appendChild(li);
    });
}

// Inicjalizacja ksi¹¿ek po za³adowaniu strony biblioteki
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

// Dodaj ksi¹¿kê
function addBook() {
    const bookTitle = document.getElementById('bookTitle').value;
    if (bookTitle) {
        const existingBook = currentUser.books.find(book => book.title === bookTitle);
        if (existingBook) {
            alert('Ta ksi¹¿ka jest ju¿ w tabeli.');
        } else {
            currentUser.books.push({ title: bookTitle, author: '', genre: '', totalPages: 0, pagesRead: 0 });
            document.getElementById('bookTitle').value = '';
            updateTable();
        }
    }
}

// Zaktualizuj ksi¹¿kê
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
            alert('Iloœæ przeczytanych stron nie mo¿e byæ wiêksza ni¿ iloœæ stron ksi¹¿ki.');
        }
        document.getElementById('targetTitle').value = '';
        document.getElementById('author').value = '';
        document.getElementById('genre').value = '';
        document.getElementById('totalPages').value = '';
        document.getElementById('pagesRead').value = '';
        updateTable();
    } else {
        alert('Ten tytu³ nie znajduje siê w tabeli.');
    }
}

// Usuñ ksi¹¿kê
function deleteBook() {
    const targetTitle = document.getElementById('targetTitle').value;
    currentUser.books = currentUser.books.filter(b => b.title !== targetTitle);
    document.getElementById('targetTitle').value = '';
    updateTable();
}

// Zaktualizuj tabelê
function updateTable() {
    const tbody = document.querySelector('#bookTable tbody');
    tbody.innerHTML = '';
    currentUser.books.forEach(book => {
        const percentRead = book.totalPages ? ((book.pagesRead / book.totalPages) * 100).toFixed(2) + '%' : '0%';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.genre}</td>
            <td>${book.totalPages}</td>
            <td>${book.pagesRead}</td>
            <td>${percentRead}</td>
        `;
        tbody.appendChild(row);
    });
    localStorage.setItem('users', JSON.stringify(users));
}

// Poka¿ szczegó³y u¿ytkownika
function showDetails() {
    window.location.href = 'details.html';
}