document.addEventListener('DOMContentLoaded', () => {
    // $('#copyToast').toast('hide');

    loadClipboardEntries();

    document.getElementById('clipboardInput').focus();

    document.getElementById('clipboardInput').addEventListener('paste', pasteContent);
    document.getElementById('searchInput').addEventListener('input', loadClipboardEntries);

    document.getElementById('deleteAll').addEventListener('click', deleteAll);
    document.getElementById('deleteExceptToday').addEventListener('click', deleteExceptToday);

    // document.getElementById('addDummy').addEventListener('click', injectInitialData);
    // document.getElementById('printToConsole').addEventListener('click', printToConsole);

    document.getElementById('goTopBtn').addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

});

function printToConsole() {
    const entries = getAllClipboardEntries();
    console.log('Alll entries');
    console.table(entries, ["content", "tag"]);
}

function setupJson(tag, content, creationDateTime, uniqueKey) {
    return {
        tag: tag,
        content: content,
        creationDateTime: creationDateTime,
        uniqueKey: uniqueKey
    };
}

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

        let entry = setupJson(`Auto Tag ${i + 1}`, `Auto generated content ${i + 1}`, new Date(dates[i % 4]).toISOString(), getUniqueKey());
        entries.push(entry);

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
            e.tag.toLowerCase().includes(search)
        )
        .forEach((entry, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${index + 1}</td>
                <td><textarea class="content-edit">${entry.content}</textarea></td>
                <td><input class="name-tag" value="${entry.tag}"></td>
                <td>${formatDate(entry.creationDateTime)}</td>
                <td>
                    <button class="copy-button"><i class="fas fa-copy"></i></button>
                    <button class="delete-button"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;

            const contentEl = row.querySelector('.content-edit');

            /* ✅ REAL-TIME SAVE */
            contentEl.addEventListener('input', (e) => {
                updateEntry(entry.uniqueKey, 'content', e.target.value);
            });

            row.querySelector('.name-tag').addEventListener('input', (e) => {
                updateEntry(entry.uniqueKey, 'tag', e.target.value);
            });

            row.querySelector('.copy-button').addEventListener('click', (e) => {
                const button = e.currentTarget;
                const icon = button.querySelector('i');
                const toast = document.getElementById('copyToast');

                navigator.clipboard.writeText(contentEl.value).then(() => {

                    // 🟢 SHOW TOAST
                    toast.classList.remove('show');
                    void toast.offsetWidth; // force reflow
                    toast.classList.add('show');

                    // 🟢 AUTO HIDE AFTER 10s
                    setTimeout(() => {
                        toast.classList.remove('show');
                    }, 5000);

                    // 🟢 ICON CHANGE
                    icon.classList.remove('fa-copy');
                    icon.classList.add('fa-check');
                    icon.style.color = 'green';

                    // 🟢 RESET ICON AFTER 5s
                    setTimeout(() => {
                        icon.classList.remove('fa-check');
                        icon.classList.add('fa-copy');
                        icon.style.color = '';
                    }, 5000);
                });
            });

            row.querySelector('.delete-button').addEventListener('click', () => {
                deleteEntry(entry.uniqueKey);
            });

            tbody.appendChild(row);
        });
}


/* ================= UPDATE ================= */
function updateEntry(uniqueKey, field, value) {
    const entries = getAllClipboardEntries();

    let entry = entries.find(e => e.uniqueKey === uniqueKey);

    if (entry) {
        entry[field] = value;
    }

    localStorage.setItem('clipboardEntries', JSON.stringify(entries));
}

/* ================= DELETE ================= */
function deleteEntry(uniqueKey) {
    if (confirm("Are you sure?")) {
        let entries = getAllClipboardEntries();

        entries = entries.filter(entry => entry.uniqueKey !== uniqueKey);
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
        let entry = setupJson('-', content, new Date().toISOString(), getUniqueKey());

        saveClipboardEntry(entry);
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

function getUniqueKey() {
    // const d = new Date();
    return crypto.randomUUID();
}
