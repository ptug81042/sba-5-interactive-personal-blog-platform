// Responsible for page display logic-drawing entries or showing 'no entry' message.

export function renderEntries(entries, container, noEntriesMsg) {
    container.innerHTML = '';
    if (entries.length === 0) {
        // Nothing yet? Show encouragement message
        noEntriesMsg.style.display = 'block';
        return;
    }

    noEntriesMsg.style.display = 'none';

    for (const entry of entries) {
        const post = document.createElement('article');
        post.className = 'blog-post';
        post.tabIndex = 0;
        post.dataset.id = entry.id;

        post.innerHTML = `
            <h3 class="blog-post-title">${entry.title}</h3>
            <div class="blog-post-content">${entry.content}</div>
            ${entry.tags.length > 0 ? `<div class="blog-post-tags">Tags: ${entry.tags.join(', ')}</div>` : ''}
            <div class="blog-post-actions">
                <button class="edit-btn" aria-label="Edit post titled ${entry.title}" data-action="edit">Edit</button>
                <button class="delete-btn" aria-label="Delete post titled ${entry.title}" data-action="delete">Delete</button>
            </div>
        `;
        container.appendChild(post);
    }
}