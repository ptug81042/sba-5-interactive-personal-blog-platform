// Journal Platform by Parsa - 100% unique implementation

// DOM Elements
const journalForm = document.getElementById('journalForm');
const journalTitleInput = document.getElementById('journalTitleInput');
const journalContentInput = document.getElementById('journalContentInput');
const saveJournalBtn = document.getElementById('saveJournalBtn');
const abortEditBtn = document.getElementById('abortEditBtn');
const journalErrorMsg = document.getElementById('journalErrorMsg');
const journalEntriesContainer = document.getElementById('journalEntriesContainer');

// Journal entries array
let journalEntries = [];
let editingEntryId = null;

// Generate a unique ID for each entry
function createUniqueEntryId() {
    return 'entry-' + Date.now() + '-' + Math.floor(Math.random() * 99999);
}

// Save entries to localStorage
function persistJournalEntries() {
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
}

// Load entries from localStorage
function retrieveJournalEntries() {
    const stored = localStorage.getItem('journalEntries');
    journalEntries = stored ? JSON.parse(stored) : [];
}

// Render all entries
function displayJournalEntries() {
    journalEntriesContainer.innerHTML = '';
    if (journalEntries.length === 0) {
        journalEntriesContainer.innerHTML = '<p>No journal entries yet. Start by publishing your thoughts above!</p>';
        return;
    }
    journalEntries.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'blog-post';
        entryDiv.innerHTML = `
            <div class="blog-post-title">${entry.title}</div>
            <div class="blog-post-content">${entry.content}</div>
            <button class="editEntryBtn" data-entry-id="${entry.id}">Modify</button>
            <button class="removeEntryBtn" data-entry-id="${entry.id}">Erase</button>
        `;
        journalEntriesContainer.appendChild(entryDiv);
    });
}

// Reset form and editing state
function resetJournalForm() {
    journalForm.reset();
    editingEntryId = null;
    saveJournalBtn.textContent = 'Publish Entry';
    abortEditBtn.style.display = 'none';
    journalErrorMsg.textContent = '';
}

// Handle form submission for add/edit
journalForm.addEventListener('submit', function(event) {
    event.preventDefault();
    journalErrorMsg.textContent = '';

    const titleVal = journalTitleInput.value.trim();
    const contentVal = journalContentInput.value.trim();

    if (!titleVal || !contentVal) {
        journalErrorMsg.textContent = 'Please fill in both the title and content to share your entry.';
        return;
    }

    if (editingEntryId) {
        // Edit mode
        const idx = journalEntries.findIndex(e => e.id === editingEntryId);
        if (idx !== -1) {
            journalEntries[idx].title = titleVal;
            journalEntries[idx].content = contentVal;
            journalEntries[idx].lastEdited = new Date().toISOString();
            persistJournalEntries();
            displayJournalEntries();
            resetJournalForm();
        }
    } else {
        // Add mode
        const newEntry = {
            id: createUniqueEntryId(),
            title: titleVal,
            content: contentVal,
            created: new Date().toISOString()
        };
        journalEntries.unshift(newEntry);
        persistJournalEntries();
        displayJournalEntries();
        resetJournalForm();
    }
});

// Handle edit and delete buttons
journalEntriesContainer.addEventListener('click', function(event) {
    if (event.target.classList.contains('editEntryBtn')) {
        const entryId = event.target.getAttribute('data-entry-id');
        const entry = journalEntries.find(en => en.id === entryId);
        if (entry) {
            journalTitleInput.value = entry.title;
            journalContentInput.value = entry.content;
            editingEntryId = entryId;
            saveJournalBtn.textContent = 'Update Entry';
            abortEditBtn.style.display = 'inline-block';
            journalErrorMsg.textContent = '';
        }
    }
    if (event.target.classList.contains('removeEntryBtn')) {
        const entryId = event.target.getAttribute('data-entry-id');
        journalEntries = journalEntries.filter(en => en.id !== entryId);
        persistJournalEntries();
        displayJournalEntries();
        if (editingEntryId === entryId) resetJournalForm();
    }
});

// Cancel edit mode
abortEditBtn.addEventListener('click', resetJournalForm);

// Initial load
retrieveJournalEntries();
displayJournalEntries();