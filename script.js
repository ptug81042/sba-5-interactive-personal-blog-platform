class BlogPlatform {
  constructor() {
    // DOM Elements
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

    this.init();
  }

  init() {
    this.loadEntries();
    this.renderEntries();
    this.applySavedTheme();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.journalForm.addEventListener('submit', (e) => this.handleSubmit(e));
    this.abortBtn.addEventListener('click', () => this.resetForm());
    this.entriesContainer.addEventListener('click', (e) => this.handleEntryActions(e));
    this.toolbar.addEventListener('click', (e) => this.handleToolbarClick(e));
    this.exportBtn.addEventListener('click', () => this.exportPosts());
    this.importBtn.addEventListener('click', () => this.importFileInput.click());
    this.importFileInput.addEventListener('change', (e) => this.importPosts(e));
    this.toggleThemeBtn.addEventListener('click', () => this.toggleTheme());

    this.richTextEditor.addEventListener('input', () => this.syncContent());
    this.richTextEditor.addEventListener('paste', (e) => this.handlePaste(e));
  }

  handleSubmit(event) {
    event.preventDefault();
    this.clearErrors();

    const title = this.titleInput.value.trim();
    const content = this.richTextEditor.innerHTML.trim();
    const plainContent = this.richTextEditor.textContent.trim();
    const tagsRaw = this.tagsInput.value.trim();

    // Validation
    let valid = true;

    if (!title) {
      this.titleError.textContent = 'Title is required.';
      valid = false;
    }

    // Content must have at least 20 characters excluding HTML tags
    if (!plainContent || plainContent.length < 20) {
      this.contentError.textContent = 'Content must be at least 20 characters.';
      valid = false;
    }

    if (!valid) return;

    // Prepare tags array
    const tags = tagsRaw
      ? tagsRaw
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    if (this.editingId) {
      // Update existing entry
      this.updateEntry(this.editingId, title, content, tags);
    } else {
      // Add new entry
      this.addEntry(title, content, tags);
    }

    this.resetForm();
    this.renderEntries();
  }

  clearErrors() {
    this.titleError.textContent = '';
    this.contentError.textContent = '';
    this.errorMsg.textContent = '';
  }

  addEntry(title, content, tags) {
    const newEntry = {
      id: Date.now().toString(),
      title,
      content,
      tags,
      createdAt: new Date().toISOString(),
    };
    this.entries.unshift(newEntry);
    this.saveEntries();
  }

  updateEntry(id, title, content, tags) {
    const index = this.entries.findIndex((entry) => entry.id === id);
    if (index === -1) return;
    this.entries[index].title = title;
    this.entries[index].content = content;
    this.entries[index].tags = tags;
    this.saveEntries();
  }

  deleteEntry(id) {
    this.entries = this.entries.filter((entry) => entry.id !== id);
    this.saveEntries();
    this.renderEntries();
    if (this.editingId === id) this.resetForm();
  }

  editEntry(id) {
    const entry = this.entries.find((e) => e.id === id);
    if (!entry) return;

    this.editingId = id;
    this.titleInput.value = entry.title;
    this.richTextEditor.innerHTML = entry.content;
    this.tagsInput.value = entry.tags.join(', ');
    this.saveBtn.textContent = 'Save Changes';
    this.abortBtn.style.display = 'inline-block';

    this.titleInput.focus();
    this.syncContent();
  }

  resetForm() {
    this.editingId = null;
    this.journalForm.reset();
    this.richTextEditor.innerHTML = '';
    this.saveBtn.textContent = 'Publish Entry';
    this.abortBtn.style.display = 'none';
    this.clearErrors();
    this.syncContent();
    this.titleInput.focus();
  }

  renderEntries() {
    this.entriesContainer.innerHTML = '';
    if (this.entries.length === 0) {
      this.noEntriesMsg.style.display = 'block';
      return;
    }
    this.noEntriesMsg.style.display = 'none';

    for (const entry of this.entries) {
      const post = document.createElement('article');
      post.className = 'blog-post';
      post.tabIndex = 0;
      post.dataset.id = entry.id;
      post.setAttribute('role', 'listitem');

      const titleEl = document.createElement('h3');
      titleEl.className = 'blog-post-title';
      titleEl.textContent = entry.title;

      const contentEl = document.createElement('div');
      contentEl.className = 'blog-post-content';
      contentEl.innerHTML = entry.content;

      const tagsEl = document.createElement('div');
      tagsEl.className = 'blog-post-tags';
      tagsEl.textContent = entry.tags.length ? `Tags: ${entry.tags.join(', ')}` : '';

      const actionsEl = document.createElement('div');
      actionsEl.className = 'blog-post-actions';

      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.className = 'edit-btn';
      editBtn.setAttribute('aria-label', `Edit post titled ${entry.title}`);
      editBtn.dataset.action = 'edit';

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.className = 'delete-btn';
      deleteBtn.setAttribute('aria-label', `Delete post titled ${entry.title}`);
      deleteBtn.dataset.action = 'delete';

      actionsEl.appendChild(editBtn);
      actionsEl.appendChild(deleteBtn);

      post.appendChild(titleEl);
      post.appendChild(contentEl);
      if (entry.tags.length > 0) post.appendChild(tagsEl);
      post.appendChild(actionsEl);

      this.entriesContainer.appendChild(post);
    }
  }

  handleEntryActions(event) {
    const btn = event.target.closest('button');
    if (!btn) return;

    const action = btn.dataset.action;
    if (!action) return;

    const post = btn.closest('.blog-post');
    if (!post) return;

    const id = post.dataset.id;

    if (action === 'edit') {
      this.editEntry(id);
    } else if (action === 'delete') {
      if (confirm('Are you sure you want to delete this post?')) {
        this.deleteEntry(id);
      }
    }
  }

  handleToolbarClick(event) {
    const btn = event.target.closest('button');
    if (!btn) return;

    const cmd = btn.dataset.command;
    if (!cmd) return;

    document.execCommand(cmd, false, null);
    this.richTextEditor.focus();
    this.syncContent();
  }

  syncContent() {
    this.contentTextarea.value = this.richTextEditor.innerHTML;
  }

  handlePaste(event) {
    event.preventDefault();
    const text = (event.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, text);
  }

  saveEntries() {
    localStorage.setItem('blogEntries', JSON.stringify(this.entries));
  }

  loadEntries() {
    try {
      const stored = localStorage.getItem('blogEntries');
      this.entries = stored ? JSON.parse(stored) : [];
    } catch {
      this.entries = [];
    }
  }

  exportPosts() {
    if (this.entries.length === 0) {
      alert('No posts to export.');
      return;
    }
    const dataStr = JSON.stringify(this.entries, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'blog-posts.json';
    a.click();

    URL.revokeObjectURL(url);
  }

  importPosts(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (!Array.isArray(imported)) throw new Error('Invalid format');

        // Filter out duplicates based on IDs
        const existingIds = new Set(this.entries.map((e) => e.id));
        const filtered = imported.filter((e) => !existingIds.has(e.id));

        this.entries = filtered.concat(this.entries);
        this.saveEntries();
        this.renderEntries();

        alert(`Imported ${filtered.length} new post(s).`);
      } catch {
        alert('Failed to import. Please upload a valid JSON file.');
      }
      this.importFileInput.value = '';
    };
    reader.readAsText(file);
  }

  applySavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      this.toggleThemeBtn.textContent = '☀️ Light Mode';
      this.toggleThemeBtn.setAttribute('aria-pressed', 'true');
    } else {
      document.body.classList.remove('dark-mode');
      this.toggleThemeBtn.textContent = '🌙 Dark Mode';
      this.toggleThemeBtn.setAttribute('aria-pressed', 'false');
    }
  }

  toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    if (isDark) {
      this.toggleThemeBtn.textContent = '☀️ Light Mode';
      this.toggleThemeBtn.setAttribute('aria-pressed', 'true');
    } else {
      this.toggleThemeBtn.textContent = '🌙 Dark Mode';
      this.toggleThemeBtn.setAttribute('aria-pressed', 'false');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new BlogPlatform();
});