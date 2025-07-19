// Central place to add, edit, delete, import, and export entries.

import { saveEntries } from './storage.js';

export function addEntry(entries, title, content, tags) {
    // Prepare a fresh entry object
    const entry = {
        id: Date.now().toString(),
        title,
        content,
        tags,
        createdAt: new Date().toISOString()
    };
    entries.unshift(entry); // Most recent at top
    saveEntries(entries); // Persist immediately
}

export function updateEntry(entries, id, title, content, tags) {
    const index = entries.findIndex(e => e.id === id);
    if (index !== -1) {
        // Merge new values in place
        entries[index] = { ...entries[index], title, content, tags };
        saveEntries(entries);
    }
}

export function deleteEntry(entries, id) {
    // Filter out the removed entry
    const filtered = entries.filter(e => e.id !== id);
    saveEntries(filtered);
    return filtered;
}

export function importEntries(currentEntries, importedJSON) {
    // Avoid duplicates by ID
    const existingIds = new Set(currentEntries.map(e => e.id));
    const newEntries = importedJSON.filter(e => !existingIds.has(e.id));
    const merged = [...newEntries, ...currentEntries];
    saveEntries(merged);
    return { merged, count: newEntries.length };
}