
// Interactive Personal Blog Platform - Full script.js with advanced features

class BlogPlatform {
  constructor() {
    this.journalForm = document.getElementById('journalForm');
    this.titleInput = document.getElementById('journalTitleInput');
    this.contentTextarea = document.getElementById('journalContentInput');
    this.richTextEditor = document.getElementById('richTextEditor');
    this.tagsInput = document.getElementById('journalTagsInput');
    this.saveBtn = document.getElementById('saveJournalBtn');
    this.abortBtn = document.getElementById('abortEditBtn');
    this.errorMsg = document.getElementById('journalErrorMsg');
    this.titleError = document.getElementById('titleError');
    this.contentError = document.getElementById('contentError');
    this.entriesContainer = document.getElementById('journalEntriesContainer');
    this.noEntriesMsg = document.getElementById('noEntriesMsg');
    this.toolbar = document.getElementById('toolbar');
    this.exportBtn = document.getElementById('exportBtn');
    this.importBtn = document.getElementById('importBtn');
    this.importFileInput = document.getElementById('importFileInput');
    this.toggleThemeBtn = document.getElementById('toggleThemeBtn');
    this.welcomeMessage = document.getElementById('welcomeMessage');
  
    this.entries = [];
    this.editingId = null;
  
    this.applySavedTheme(); // ← Added here
    this.init();
  }

  init() {
    this.loadEntries();
    this.renderEntries();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.journalForm.addEventListener('submit', (e) => this.handleSubmit(e));
    this.abortBtn.addEventListener('click', () => this.resetForm());
    this.entriesContainer.addEventListener('click', (e) => this.handleEntryActions(e));
    this.toolbar.addEventListener('click', (e) => this.handleToolbarClick(e));
    this.exportBtn.addEventListener('click', () => this.exportEntries());
    this.importBtn.addEventListener('click', () => this.importFileInput.click());
    this.importFileInput.addEventListener('change', (e) => this.handleImportFile(e));
    this.toggleThemeBtn.addEventListener('click', () => this.toggleTheme());
    this.richTextEditor.addEventListener('input', () => this.syncEditorContent());
  }

  generateId() {
    return 'entry-' + Date.now() + '-' + Math.floor(Math.random() * 99999);
  }

  saveEntries() {
    localStorage.setItem('blogEntries', JSON.stringify(this.entries));
  }

  loadEntries() {
    const data = localStorage.getItem('blogEntries');
    this.entries = data ? JSON.parse(data) : [];
  }

  renderEntries() {
    this.entriesContainer.innerHTML = '';
    if (this.entries.length === 0) {
      this.noEntriesMsg.style.display = 'block';
      return;
    }
    this.noEntriesMsg.style.display = 'none';

    this.entries.forEach((entry) => {
      const post = document.createElement('article');
      post.classList.add('blog-post');
      post.dataset.id = entry.id;

      post.innerHTML = `
        <h3 class="blog-post-title">${entry.title}</h3>
        <div class="blog-post-content">${entry.content}</div>
        ${entry.tags ? `<div class="blog-post-tags">Tags: ${entry.tags.join(', ')}</div>` : ''}
        <div class="blog-post-actions">
          <button class="editEntryBtn">Edit</button>
          <button class="deleteEntryBtn">Delete</button>
        </div>
      `;

      this.entriesContainer.appendChild(post);
    });
  }

  validateForm() {
    let valid = true;
    this.titleError.textContent = '';
    this.contentError.textContent = '';

    if (!this.titleInput.value.trim()) {
      this.titleError.textContent = 'Title is required.';
      valid = false;
    }

    const contentText = this.richTextEditor.innerText.trim();
    if (!contentText) {
      this.contentError.textContent = 'Content cannot be empty.';
      valid = false;
    }

    return valid;
  }

  handleSubmit(event) {
    event.preventDefault();
    this.errorMsg.textContent = '';

    if (!this.validateForm()) return;

    const title = this.titleInput.value.trim();
    const content = this.richTextEditor.innerHTML.trim();
    const tags = this.tagsInput.value
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);

    if (this.editingId) {
      const idx = this.entries.findIndex((e) => e.id === this.editingId);
      if (idx !== -1) {
        this.entries[idx] = {
          ...this.entries[idx],
          title,
          content,
          tags,
          lastEdited: new Date().toISOString(),
        };
      }
    } else {
      this.entries.unshift({
        id: this.generateId(),
        title,
        content,
        tags,
        created: new Date().toISOString(),
      });
    }

    this.saveEntries();
    this.renderEntries();
    this.resetForm();
  }

  resetForm() {
    this.journalForm.reset();
    this.richTextEditor.innerHTML = '';
    this.editingId = null;
    this.abortBtn.style.display = 'none';
    this.saveBtn.textContent = 'Publish Entry';
    this.titleError.textContent = '';
    this.contentError.textContent = '';
  }

  handleEntryActions(e) {
    const entryEl = e.target.closest('.blog-post');
    if (!entryEl) return;
    const id = entryEl.dataset.id;

    if (e.target.classList.contains('editEntryBtn')) {
      const entry = this.entries.find((en) => en.id === id);
      if (entry) {
        this.titleInput.value = entry.title;
        this.richTextEditor.innerHTML = entry.content;
        this.tagsInput.value = entry.tags ? entry.tags.join(', ') : '';
        this.editingId = id;
        this.abortBtn.style.display = 'inline-block';
        this.saveBtn.textContent = 'Update Entry';
      }
    }

    if (e.target.classList.contains('deleteEntryBtn')) {
      this.entries = this.entries.filter((en) => en.id !== id);
      this.saveEntries();
      this.renderEntries();
      if (this.editingId === id) this.resetForm();
    }
  }

  handleToolbarClick(e) {
    if (e.target.dataset.command) {
      document.execCommand(e.target.dataset.command, false, null);
      this.syncEditorContent();
    }
  }

  syncEditorContent() {
    this.contentTextarea.value = this.richTextEditor.innerHTML;
  }

  exportEntries() {
    const dataStr = JSON.stringify(this.entries, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'blog-posts.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  handleImportFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target.result);
        if (Array.isArray(imported)) {
          this.entries = imported;
          this.saveEntries();
          this.renderEntries();
        } else {
          alert('Invalid file format');
        }
      } catch {
        alert('Failed to parse JSON file');
      }
    };
    reader.readAsText(file);
  }

  toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    this.toggleThemeBtn.setAttribute('aria-pressed', isDark);
    localStorage.setItem('darkMode', isDark ? '1' : '0');
  }

  applySavedTheme() {
    const saved = localStorage.getItem('darkMode');
    const isDark = saved === '1';
    document.body.classList.toggle('dark-mode', isDark);
    this.toggleThemeBtn.setAttribute('aria-pressed', isDark);
    this.toggleThemeBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  }
}

document.addEventListener('DOMContentLoaded', () => new BlogPlatform());
