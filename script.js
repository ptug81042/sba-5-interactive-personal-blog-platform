// script.js

const form = document.getElementById('journalForm');
const titleInput = document.getElementById('journalTitleInput');
const contentInput = document.getElementById('journalContentInput');
const tagsInput = document.getElementById('journalTagsInput');
const journalEntriesContainer = document.getElementById('journalEntriesContainer');
const noEntriesMsg = document.getElementById('noEntriesMsg');
const saveBtn = document.getElementById('saveJournalBtn');
const abortEditBtn = document.getElementById('abortEditBtn');
const journalErrorMsg = document.getElementById('journalErrorMsg');
const toggleThemeBtn = document.getElementById('toggleThemeBtn');
const richTextEditor = document.getElementById('richTextEditor');
const toolbarButtons = document.querySelectorAll('#toolbar button');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFileInput = document.getElementById('importFileInput');

let posts = [];
let editPostId = null;

// Initialization
loadPostsFromStorage();
renderPosts();
updateWelcomeMessage();
setupTheme();
setupRichTextEditor();

function setupTheme() {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  if (darkMode) document.body.classList.add('dark-mode');
  toggleThemeBtn.setAttribute('aria-pressed', darkMode);
  toggleThemeBtn.textContent = darkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
}

toggleThemeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  toggleThemeBtn.setAttribute('aria-pressed', isDark);
  toggleThemeBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  localStorage.setItem('darkMode', isDark);
});

// Welcome message
function updateWelcomeMessage() {
  const msg = document.getElementById('welcomeMessage');
  const hour = new Date().getHours();
  if (hour < 12) {
    msg.textContent = 'Good morning! Ready to share your thoughts?';
  } else if (hour < 18) {
    msg.textContent = 'Good afternoon! What’s on your mind today?';
  } else {
    msg.textContent = 'Good evening! Time to unwind with a post.';
  }
}

// Rich text editor toolbar actions
toolbarButtons.forEach(button => {
  button.addEventListener('click', () => {
    const cmd = button.getAttribute('data-command');
    document.execCommand(cmd, false, null);
    richTextEditor.focus();
  });
});

// Sync rich text editor content to hidden textarea for form submission
richTextEditor.addEventListener('input', () => {
  contentInput.value = richTextEditor.innerHTML;
});

// Form validation
function validateForm() {
  let valid = true;
  journalErrorMsg.textContent = '';
  document.getElementById('titleError').textContent = '';
  document.getElementById('contentError').textContent = '';

  if (!titleInput.value.trim()) {
    document.getElementById('titleError').textContent = 'Title is required.';
    valid = false;
  }

  if (!richTextEditor.textContent.trim()) {
    document.getElementById('contentError').textContent = 'Content is required.';
    valid = false;
  }

  return valid;
}

// Save or update post
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  const postData = {
    id: editPostId || Date.now(),
    title: titleInput.value.trim(),
    content: richTextEditor.innerHTML.trim(),
    tags: tagsInput.value.split(',').map(t => t.trim()).filter(t => t.length > 0),
    date: new Date().toISOString()
  };

  if (editPostId) {
    // Update existing post
    const idx = posts.findIndex(p => p.id === editPostId);
    if (idx > -1) posts[idx] = postData;
    editPostId = null;
    abortEditBtn.style.display = 'none';
    saveBtn.textContent = 'Publish Entry';
  } else {
    // New post
    posts.unshift(postData);
  }

  savePostsToStorage();
  renderPosts();
  form.reset();
  richTextEditor.innerHTML = '';
  contentInput.value = '';
});

// Cancel edit
abortEditBtn.addEventListener('click', () => {
  editPostId = null;
  form.reset();
  richTextEditor.innerHTML = '';
  contentInput.value = '';
  abortEditBtn.style.display = 'none';
  saveBtn.textContent = 'Publish Entry';
  journalErrorMsg.textContent = '';
  clearErrors();
});

// Render posts list
function renderPosts() {
  journalEntriesContainer.innerHTML = '';
  if (!posts.length) {
    noEntriesMsg.style.display = 'block';
    return;
  }
  noEntriesMsg.style.display = 'none';

  posts.forEach(post => {
    const postEl = document.createElement('article');
    postEl.className = 'journalEntry';
    postEl.tabIndex = 0;
    postEl.setAttribute('role', 'listitem');
    postEl.innerHTML = `
      <h3>${post.title}</h3>
      <div class="entryMeta">${new Date(post.date).toLocaleString()}</div>
      <div class="entryTags">${post.tags.map(tag => `<span>#${tag}</span>`).join(' ')}</div>
    `;

    postEl.addEventListener('click', () => {
      startEditPost(post.id);
    });

    postEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        startEditPost(post.id);
      }
    });

    journalEntriesContainer.appendChild(postEl);
  });
}

function startEditPost(id) {
  const post = posts.find(p => p.id === id);
  if (!post) return;

  editPostId = id;
  titleInput.value = post.title;
  richTextEditor.innerHTML = post.content;
  contentInput.value = post.content;
  tagsInput.value = post.tags.join(', ');
  saveBtn.textContent = 'Update Entry';
  abortEditBtn.style.display = 'inline-block';
  journalErrorMsg.textContent = '';
  clearErrors();
  titleInput.focus();
}

function clearErrors() {
  document.getElementById('titleError').textContent = '';
  document.getElementById('contentError').textContent = '';
}

// Local Storage helpers
function savePostsToStorage() {
  localStorage.setItem('blogPosts', JSON.stringify(posts));
}

function loadPostsFromStorage() {
  const storedPosts = localStorage.getItem('blogPosts');
  posts = storedPosts ? JSON.parse(storedPosts) : [];
}

// Export posts JSON
exportBtn.addEventListener('click', () => {
  if (!posts.length) {
    alert('No posts to export!');
    return;
  }
  const blob = new Blob([JSON.stringify(posts, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'blog-posts.json';
  a.click();
  URL.revokeObjectURL(url);
});

// Import posts JSON
importBtn.addEventListener('click', () => {
  importFileInput.click();
});

importFileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      const importedPosts = JSON.parse(event.target.result);
      if (!Array.isArray(importedPosts)) throw new Error('Invalid file format.');
      posts = importedPosts.concat(posts);
      savePostsToStorage();
      renderPosts();
      alert('Posts imported successfully!');
    } catch (err) {
      alert('Error importing posts: ' + err.message);
    }
  };
  reader.readAsText(file);
  importFileInput.value = ''; // Reset input
});

// Initialize contentInput hidden textarea with richTextEditor content on page load
contentInput.value = richTextEditor.innerHTML;