// Handles saving/loading for entries and theme-keeps our persistence in one place.

const ENTRIES_KEY = 'blogEntries';
const THEME_KEY = 'theme';

export function saveEntries(entries) {
    // Save array of entries as JSON
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

export function loadEntries() {
    // Read entries from storage or return []
    try {
        const raw = localStorage.getItem(ENTRIES_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        // If JSON is malformed for some reason
        return [];
    }
}

export function saveTheme(mode) {
    // Store theme mode
    localStorage.setItem(THEME_KEY, mode);
}

export function loadTheme() {
    // Get previously chosen theme, default to light
    return localStorage.getItem(THEME_KEY) || 'light';
}