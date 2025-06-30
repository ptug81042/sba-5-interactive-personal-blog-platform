// Journal Platform by Parsa - Enhanced unique implementation with UX improvements

// DOM Elements
const journalForm = document.getElementById('journalForm');
const journalTitleInput = document.getElementById('journalTitleInput');
const journalContentInput = document.getElementById('journalContentInput');
const saveJournalBtn = document.getElementById('saveJournalBtn');
const abortEditBtn = document.getElementById('abortEditBtn');
const journalErrorMsg = document.getElementById('journalErrorMsg');
const journalEntriesContainer = document.getElementById('journalEntriesContainer');
const titleError = document.getElementById('titleError');
const contentError = document.getElementById('contentError');

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

// Render all entries with buttons in a container
function displayJournalEntries() {
    journalEntriesContainer.innerHTML = '';
    if (journalEntries.length === 0) {
        journalEntriesContainer.innerHTML = '<p>No journal entries yet. Start by publishing your thoughts above!</p>';
        return;
    }

    journalEntries.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'blog-post';

        // Format timestamps
        const createdDate = new Date(entry.created);
        const createdStr = createdDate.toLocaleString();

        let lastEditedStr = '';
        if (entry.lastEdited) {
            const editedDate = new Date(entry.lastEdited);
            lastEditedStr = ` (Edited: ${editedDate.toLocaleString()})`;
        }

        entryDiv.innerHTML = `
            <div class="blog-post-title">${escapeHtml(entry.title)}</div>
            <div class="blog-post-content">${escapeHtml(entry.content)}</div>
            <div class="post-meta" style="font-size:0.8rem;color:#666;margin-bottom:0.8rem;">
                Created: ${createdStr}${lastEditedStr}
            </div>
            <div class="post-buttons">
                <button class="editEntryBtn" data-entry-id="${entry.id}" aria-label="Edit post titled ${escapeHtml(entry.title)}">Modify</button>
                <button class="removeEntryBtn" data-entry-id="${entry.id}" aria-label="Delete post titled ${escapeHtml(entry.title)}">Erase</button>
            </div>
        `;
        journalEntriesContainer.appendChild(entryDiv);
    });
}

// Reset form and editing state with validation clears
function resetJournalForm() {
    journalForm.reset();
    editingEntryId = null;
    saveJournalBtn.textContent = 'Publish Entry';
    abortEditBtn.style.display = 'none';
    journalErrorMsg.textContent = '';
    titleError.style.display = 'none';
    contentError.style.display = 'none';
    journalTitleInput.classList.remove('invalid');
    journalContentInput.classList.remove('invalid');
}

// HTML escape helper for XSS safety
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Form validation with inline feedback
function validateForm() {
    let valid = true;

    // Title validation: required, min length 3
    if (!journalTitleInput.value.trim()) {
        titleError.textContent = 'Title is required.';
        titleError.style.display = 'block';
        journalTitleInput.classList.add('invalid');
        valid = false;
    } else if (journalTitleInput.value.trim().length < 3) {
        titleError.textContent = 'Title must be at least 3 characters.';
        titleError.style.display = 'block';
        journalTitleInput.classList.add('invalid');
        valid = false;
    } else {
        titleError.style.display = 'none';
        journalTitleInput.classList.remove('invalid');
    }

    // Content validation: required, min length 10
    if (!journalContentInput.value.trim()) {
        contentError.textContent = 'Content is required.';
        contentError.style.display = 'block';
        journalContentInput.classList.add('invalid');
        valid = false;
    } else if (journalContentInput.value.trim().length < 10) {
        contentError.textContent = 'Content must be at least 10 characters.';
        contentError.style.display = 'block';
        journalContentInput.classList.add('invalid');
        valid = false;
    } else {
        contentError.style.display = 'none';
        journalContentInput.classList.remove('invalid');
    }

    return valid;
}

// Handle form submission for add/edit
journalForm.addEventListener('submit', function(event) {
    event.preventDefault();
    journalErrorMsg.textContent = '';

    if (!validateForm()) {
        journalErrorMsg.textContent = 'Please correct the highlighted errors before submitting.';
        return;
    }

    const titleVal = journalTitleInput.value.trim();
    const contentVal = journalContentInput.value.trim();

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

// Handle edit and delete buttons using event delegation
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
            titleError.style.display = 'none';
            contentError.style.display = 'none';
            journalTitleInput.classList.remove('invalid');
            journalContentInput.classList.remove('invalid');
        }
    }
    if (event.target.classList.contains('removeEntryBtn')) {
        if (confirm('Are you sure you want to delete this entry?')) {
            const entryId = event.target.getAttribute('data-entry-id');
            journalEntries = journalEntries.filter(en => en.id !== entryId);
            persistJournalEntries();
            displayJournalEntries();
            if (editingEntryId === entryId) resetJournalForm();
        }
    }
});

// Cancel edit mode
abortEditBtn.addEventListener('click', resetJournalForm);

// Initial load
retrieveJournalEntries();
displayJournalEntries();
