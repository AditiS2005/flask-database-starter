const API = "http://127.0.0.1:5000/api/authors";

let allAuthors = [];
let allBooks = [];
let currentTab = "authors";

function loadAuthors() {
    fetch(API)
        .then(res => res.json())
        .then(data => {
            const table = document.getElementById("authorTable");
            table.innerHTML = "";

            data.authors.forEach(a => {
                table.innerHTML += `
                    <tr>
                        <td>#${a.id}</td>
                        <td><strong>${a.name}</strong></td>
                        <td>${a.city}</td>
                        <td>
                            <button class="action-btn delete" onclick="deleteAuthor(${a.id})">
                                Delete
                            </button>
                        </td>
                    </tr>
                `;
            });
        });
}

function addAuthor() {
    const name = document.getElementById("name").value;
    const city = document.getElementById("city").value;

    fetch(API, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, city})
    }).then(() => {
        document.getElementById("name").value = "";
        document.getElementById("city").value = "";
        loadAuthors();
    });
}

function deleteAuthor(id) {
    fetch(`${API}/${id}`, {method: "DELETE"})
        .then(() => loadAuthors());
}

function renderAuthors(list) {
    authorsTable.innerHTML = "";
    bookAuthor.innerHTML = '<option value="">Select author...</option>';

    list.forEach(a => {
        authorsTable.innerHTML += `
        <tr>
            <td>#${a.id}</td>
            <td>${a.name}</td>
            <td>${a.city}</td>
            <td>
                <button class="action-btn edit" onclick="editAuthor(${a.id},'${a.name}','${a.city}')">Edit</button>
                <button class="action-btn delete" onclick="deleteAuthor(${a.id})">Delete</button>
            </td>
        </tr>`;
        bookAuthor.innerHTML += `<option value="${a.id}">${a.name}</option>`;
    });
}

function renderBooks(list) {
    booksTable.innerHTML = "";
    list.forEach(b => {
        booksTable.innerHTML += `
        <tr>
            <td>#${b.id}</td>
            <td>${b.title}</td>
            <td>${b.author.name}</td>
            <td>${b.year || "-"}</td>
            <td>
                <button class="action-btn delete" onclick="deleteBook(${b.id})">Delete</button>
            </td>
        </tr>`;
    });
}

function filterAuthors() {
    const text = authorSearch.value.toLowerCase();
    const sort = authorSort.value;

    let filtered = allAuthors.filter(a =>
        a.name.toLowerCase().includes(text)
    );

    filtered.sort((a, b) =>
        sort === "az"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

    renderAuthors(filtered);
}

function filterBooks() {
    const text = bookSearch.value.toLowerCase();
    const sort = bookSort.value;

    let filtered = allBooks.filter(b =>
        b.title.toLowerCase().includes(text)
    );

    if (sort === "title") {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else {
        filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
    }

    renderBooks(filtered);
}



loadAuthors();
