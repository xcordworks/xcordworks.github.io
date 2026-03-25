document.addEventListener('DOMContentLoaded', () => {
    loadClipboardEntries();

    document.getElementById('clipboardInput').focus();

    document.getElementById('clipboardInput').addEventListener('paste', pasteContent);
    document.getElementById('searchInput').addEventListener('input', loadClipboardEntries);

    document.getElementById('deleteAll').addEventListener('click', deleteAll);
    document.getElementById('deleteExceptToday').addEventListener('click', deleteExceptToday);

    document.getElementById('goTopBtn').addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

});

/* ================= INITIAL DATA ================= */
function injectInitialData() {
    let entries = getAllClipboardEntries();

    const dates = [
        '2026-03-05T10:00:00',
        '2026-03-10T11:00:00',
        '2026-03-15T12:00:00',
        '2026-03-22T13:00:00'
    ];

    for (let i = 0; i < 10; i++) {
        entries.push({
            name: `Auto Tag ${i + 1}`,
            content: `Auto generated content ${i + 1}`,
            creationDateTime: new Date(dates[i % 4]).toISOString()
        });

        localStorage.setItem('clipboardEntries', JSON.stringify(entries));

    }

    loadClipboardEntries();
}

/* ================= DATE FORMAT ================= */
function formatDate(dateString) {
    const d = new Date(dateString);

    const day = String(d.getDate()).padStart(2, '0');
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    const secs = String(d.getSeconds()).padStart(2, '0');

    return `${day}-${months[d.getMonth()]}-${d.getFullYear()} ${hours}:${mins}:${secs}`;
}

/* ================= LOAD ================= */
function loadClipboardEntries() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    let entries = getAllClipboardEntries();

    /* SORT DESC */
    entries.sort((a, b) => new Date(b.creationDateTime) - new Date(a.creationDateTime));

    const tbody = document.querySelector('#clipboardTable tbody');
    tbody.innerHTML = '';

    entries
        .filter(e =>
            e.content.toLowerCase().includes(search) ||
            e.name.toLowerCase().includes(search)
        )
        .forEach((entry, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${index + 1}</td>
                <td><textarea class="content-edit">${entry.content}</textarea></td>
                <td><input class="name-tag" value="${entry.name}"></td>
                <td>${formatDate(entry.creationDateTime)}</td>
                <td>
                    <button class="copy-button"><i class="fas fa-copy"></i></button>
                    <button class="delete-button"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;

            const contentEl = row.querySelector('.content-edit');

            /* ✅ REAL-TIME SAVE */
            contentEl.addEventListener('input', (e) => {
                updateEntry(index, 'content', e.target.value);
            });

            row.querySelector('.name-tag').addEventListener('input', (e) => {
                updateEntry(index, 'name', e.target.value);
            });

            /* ✅ COPY LATEST VALUE */
            row.querySelector('.copy-button').addEventListener('click', () => {
                navigator.clipboard.writeText(contentEl.value);
            });

            row.querySelector('.delete-button').addEventListener('click', () => {
                deleteEntry(index);
            });

            tbody.appendChild(row);
        });
}


/* ================= UPDATE ================= */
function updateEntry(index, field, value) {
    const entries = getAllClipboardEntries();
    entries[index][field] = value;
    localStorage.setItem('clipboardEntries', JSON.stringify(entries));
}

/* ================= DELETE ================= */
function deleteEntry(index) {
    if (confirm("Are you sure?")) {
        const entries = getAllClipboardEntries();
        entries.splice(index, 1);
        localStorage.setItem('clipboardEntries', JSON.stringify(entries));
        loadClipboardEntries();
    }
}

function deleteAll() {
    if (confirm("Delete all entries?")) {
        localStorage.removeItem('clipboardEntries');
        localStorage.removeItem('initialDataAdded');
        loadClipboardEntries();
    }
}

function deleteExceptToday() {
    const today = new Date().toDateString();

    let entries = getAllClipboardEntries();

    entries = entries.filter(e =>
        new Date(e.creationDateTime).toDateString() === today
    );

    localStorage.setItem('clipboardEntries', JSON.stringify(entries));
    loadClipboardEntries();
}

/* ================= PASTE ================= */
function pasteContent(event) {
    event.preventDefault();

    const content = (event.clipboardData || window.clipboardData).getData('text');

    if (content) {
        saveClipboardEntry({
            name: '-',
            content,
            creationDateTime: new Date().toISOString()
        });
    }
}

function saveClipboardEntry(entry) {
    const entries = getAllClipboardEntries();
    entries.push(entry);
    localStorage.setItem('clipboardEntries', JSON.stringify(entries));
    loadClipboardEntries();
}

function getAllClipboardEntries() {
    return JSON.parse(localStorage.getItem('clipboardEntries')) || [];
}

