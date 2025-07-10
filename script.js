class BlogPlatform {
  constructor() {
    this.journalForm = document.getElementById('journalForm');
    this.titleInput = document.getElementById('journalTitleInput');
    this.richTextEditor = document.getElementById('richTextEditor');
    this.contentTextarea = document.getElementById('journalContentInput');
    this.tagsInput = document.getElementById('journalTagsInput');
    this.saveBtn = document.getElementById('saveJournalBtn');
    this.abortBtn = document.getElementById('abortEditBtn');
    this.entriesContainer = document.getElementById('journalEntriesContainer');
    this.noEntriesMsg = document.getElementById('noEntriesMsg');
    this.toolbar = document.getElementById('toolbar');
    this.exportBtn = document.getElementById('exportBtn');
    this.importBtn = document.getElementById('importBtn');
    this.importFileInput = document.getElementById('importFileInput');
    this.toggleThemeBtn = document.getElementById('toggleThemeBtn');

    this.entries = [];
    this.editingId = null;

    this.applySavedTheme();
    this.init();
  }

  init() {
    this.loadEntries();
    this.renderEntries();

    this.journalForm.addEventListener('submit', e => this.handleSubmit(e));
    this.abortBtn.addEventListener('click', () => this.resetForm());
    this.entriesContainer.addEventListener('click', e => this.handleEntryActions(e));
    this.toolbar.addEventListener('click', e => {
      if (e.target.dataset.command) {
        document.execCommand(e.target.dataset.command);
        this.syncEditor();
      }
    });
    this.richTextEditor.addEventListener('input', () => this.syncEditor());
    this.exportBtn.addEventListener('click', () => this.exportEntries());
    this.importBtn.addEventListener('click', () => this.importFileInput.click());
    this.importFileInput.addEventListener('change', e => this.handleImport(e));
    this.toggleThemeBtn.addEventListener('click', () => this.toggleTheme());
  }

  applySavedTheme() {
    const dark = localStorage.getItem('darkMode') === '1';
    document.body.classList.toggle('dark-mode', dark);
    this.toggleThemeBtn.setAttribute('aria-pressed', dark);
    this.toggleThemeBtn.textContent = dark ? '☀️ Light Mode' : '🌙 Dark Mode';
  }

  toggleTheme() {
    const dark = document.body.classList.toggle('dark-mode');
    this.toggleThemeBtn.setAttribute('aria-pressed', dark);
    this.toggleThemeBtn.textContent = dark ? '☀️ Light Mode' : '🌙 Dark Mode';
    localStorage.setItem('darkMode', dark ? '1' : '0');
  }

  generateId() {
    return 'entry-' + Date.now() + Math.floor(Math.random() * 10000);
  }

  syncEditor() {
    this.contentTextarea.value = this.richTextEditor.innerHTML;
  }

  validate() {
    let ok = true;
    document.getElementById('titleError').textContent = '';
    document.getElementById('contentError').textContent = '';

    if (!this.titleInput.value.trim()) {
      document.getElementById('titleError').textContent = 'Title required.';
      ok = false;
    }
    if (!this.richTextEditor.innerText.trim()) {
      document.getElementById('contentError').textContent = 'Content cannot be empty.';
      ok = false;
    }
    return ok;
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.validate()) return;

    const data = {
      id: this.editingId || this.generateId(),
      title: this.titleInput.value.trim(),
      content: this.richTextEditor.innerHTML,
      tags: this.tagsInput.value.split(',').map(t => t.trim()).filter(Boolean),
      time: new Date().toISOString()
    };

    if (this.editingId) {
      this.entries = this.entries.map(en => en.id === data.id ? data : en);
    } else {
      this.entries.unshift(data);
    }

    this.saveEntries();
    this.renderEntries();
    this.resetForm();
  }

  handleEntryActions(e) {
    const el = e.target;
    const entryEl = el.closest('.blog-post');
    if (!entryEl) return;
    const id = entryEl.dataset.id;

    if (el.textContent === 'Edit') {
      const en = this.entries.find(x => x.id === id);
      this.titleInput.value = en.title;
      this.richTextEditor.innerHTML = en.content;
      this.tagsInput.value = en.tags.join(', ');
      this.editingId = id;
      this.abortBtn.style.display = 'inline-block';
      this.saveBtn.textContent = 'Update Entry';
    }

    if (el.textContent === 'Delete') {
      this.entries = this.entries.filter(x => x.id !== id);
      this.saveEntries();
      this.renderEntries();
      if (this.editingId === id) this.resetForm();
    }
  }

  resetForm() {
    this.journalForm.reset();
    this.richTextEditor.innerHTML = '';
    this.editingId = null;
    this.abortBtn.style.display = 'none';
    this.saveBtn.textContent = 'Publish Entry';
    this.syncEditor();
  }

  renderEntries() {
    this.entriesContainer.innerHTML = '';
    if (!this.entries.length) {
      this.noEntriesMsg.style.display = 'block';
      return;
    }
    this.noEntriesMsg.style.display = 'none';

    this.entries.forEach(en => {
      const a = document.createElement('article');
      a.className = 'blog-post';
      a.dataset.id = en.id;
      a.innerHTML = `
        <h3 class="blog-post-title">${en.title}</h3>
        <div class="blog-post-content">${en.content}</div>
        ${en.tags.length ? `<div class="blog-post-content"><em>Tags: ${en.tags.join(', ')}</em></div>` : ''}
        <div class="blog-post-actions">
          <button>Edit</button>
          <button>Delete</button>
        </div>
      `;
      this.entriesContainer.appendChild(a);
    });
  }

  saveEntries() {
    localStorage.setItem('blogEntries', JSON.stringify(this.entries));
  }

  loadEntries() {
    const data = localStorage.getItem('blogEntries');
    this.entries = data ? JSON.parse(data) : [];
  }

  exportEntries() {
    const blob = new Blob([JSON.stringify(this.entries, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'posts.json'; a.click();
    URL.revokeObjectURL(url);
  }

  handleImport(e) {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const imp = JSON.parse(r.result);
      if (Array.isArray(imp)) {
        this.entries = imp;
        this.saveEntries();
        this.renderEntries();
      } else alert('Invalid file');
    };
    r.readAsText(f);
  }
}

document.addEventListener('DOMContentLoaded', () => new BlogPlatform());
