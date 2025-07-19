// Boots up the app by initializing state, wiring listeners, and rendering entries.

import {
    journalForm, titleInput, contentTextarea, richTextEditor, tagsInput,
    saveBtn, abortBtn, errorMsg, titleError, contentError,
    entriesContainer, noEntriesMsg, toolbar, exportBtn, importBtn,
    importFileInput, toggleThemeBtn
} from './domElements.js';

import { validateEntry } from './validation.js';
import { syncContent, handlePaste, execToolbarCommand } from './editorUtils.js';
import { loadEntries } from './storage.js';
import { addEntry, updateEntry, deleteEntry, importEntries } from './entryManager.js';
import { renderEntries } from './render.js';
import { applyTheme, toggleTheme } from './themeManager.js';

let entries = loadEntries(); // Grab saved entries from localStorage
let editingId = null;

function resetForm() {
    editingId = null;
    journalForm.reset();
    richTextEditor.innerHTML = '';
    saveBtn.textContent = 'Publish Entry';
    abortBtn.style.display = 'none';
    clearErrors();
    syncContent(richTextEditor, contentTextarea);
    titleInput.focus();
}

function clearErrors() {
    titleError.textContent = '';
    contentError.textContent = '';
    errorMsg.textContent = '';
}

function handleSubmit(e) {
    e.preventDefault();
    clearErrors();

    const title = titleInput.value.trim();
    const htmlContent = richTextEditor.innerHTML.trim();
    const plainContent = richTextEditor.textContent.trim();
    const tags = tagsInput.value
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean);
    
    const { valid, errors } = validateEntry(title, plainContent);
    if (!valid) {
        titleError.textContent = errors.title;
        contentError.textContent = errors.content;
        return;
    }

    if (editingId) {
        updateEntry(entries, editingId, title, htmlContent, tags);
    } else {
        addEntry(entries, title, htmlContent, tags);
    }

    entries = loadEntries(); // refresh current state
    resetForm();
    renderEntries(entries, entriesContainer, noEntriesMsg);
}

function handleEntryActions(e) {
    const btn = e.target.closest('button');
    if (!btn) return;

    const action = btn.dataset.action;
    const post = btn.closest('.blog-post');
    const id = post?.dataset.id;
    if (!action || !id) return;

    if (action === 'edit') {
        const entry = entries.find(e => e.id === id);
        if (!entry) return;

        editingId = id;
        titleInput.value = entry.title;
        richTextEditor.innerHTML = entry.content;
        tagsInput.value = entry.tags.join(', ');
        abortBtn.style.display = 'inline-block';
        titleInput.focus();
        syncContent(richTextEditor, contentTextarea);
    } else if (action === 'delete') {
        if (confirm('Are you sure you want to delete this post?')) {
            entries = deleteEntry(entries, id);
            renderEntries(entries, entriesContainer, noEntriesMsg);
            if (editingId === id) resetForm();
        }
    }
}

function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        try {
            const data = JSON.parse(reader.result);
            const { merged, count } = importEntries(entries, data);
            entries = merged;
            renderEntries(entries, entriesContainer, noEntriesMsg);
            alert(`Imported ${count} new post(s).`);
        } catch (error) {
            alert(`Import failed. Please upload a valid JSON file.`);
        }
        importFileInput.value = '';
    };
    reader.readAsText(file);
}

document.addEventListener('DOMContentLoaded', () => {
    renderEntries(entries, entriesContainer, noEntriesMsg);
    applyTheme(toggleThemeBtn);

    journalForm.addEventListener('submit', handleSubmit);
    abortBtn.addEventListener('click', resetForm);
    entriesContainer.addEventListener('click', handleEntryActions);
    toolbar.addEventListener('click', e => {
        const cmd = e.target.closest('button')?.dataset?.command;
        if (cmd) execToolbarCommand(cmd);
        syncContent(richTextEditor, contentTextarea);
    });

    exportBtn.addEventListener('click', () => {
        if (!entries.length) return alert('No posts to export.');
        const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'blog-post-json';
        a.click();
        URL.revokeObjectURL(url);
    });

    importBtn.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', handleImport);
    toggleThemeBtn.addEventListener('click', () => toggleTheme(toggleThemeBtn));

    richTextEditor.addEventListener('input', () => syncContent(richTextEditor, contentTextarea));
    richTextEditor.addEventListener('paste', handlePaste);
});