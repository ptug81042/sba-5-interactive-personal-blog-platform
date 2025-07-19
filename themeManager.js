// Toggles between dark/light themes, and remembers choice.

import { saveTheme, loadTheme } from './storage.js';

export function applyTheme(btn) {
    const theme = loadTheme(); // Read saved mode
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
    btn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    btn.setAttribute('aria-pressed', isDark.toString());
}

export function toggleTheme(btn) {
    const isNowDark = document.body.classList.toggle('dark-mode');
    saveTheme(isDark ? 'dark' : 'light');
    btn.textContent = isNowDark ? 'Light Mode' : 'Dark Mode';
    btn.setAttribute('aria-pressed', isNowDark.toString());
}