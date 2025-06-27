// DOM Elements
const blogPostForm = document.getElementById('blogPostForm');
const postTitleInput = document.getElementById('postTitleInput');
const postContentInput = document.getElementById('postContentInput');
const formErrorMessage = document.getElementById('formErrorMessage');
const blogPostsContainer = document.getElementById('blogPostsContainer');

// Blog posts array
let blogPosts = [];

// Utility: Generate unique ID
function generateUniqueBlogPostId() {
    return 'post-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
}

// Utility: Save posts to localStorage
function saveBlogPostsToLocalStorage() {
    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
}

// Utility: Load posts from localStorage
function loadBlogPostsFromLocalStorage() {
    const postsFromLocalStorage = localStorage.getItem('blogPosts');
    if (postsFromLocalStorage) {
        blogPosts = JSON.parse(postsFromLocalStorage);
    }
}

// Render all posts
function renderBlogPosts() {
    blogPostsContainer.innerHTML = '';
    if (blogPosts.length === 0) {
        blogPostsContainer.innerHTML = '<p>No posts yet. Start by adding one above!</p>';
        return;
    }
    blogPosts.forEach(blogPost => {
        const blogPostDiv = document.createElement('div');
        blogPostDiv.className = 'blog-post-container';
        blogPostDiv.innerHTML = `
            <div class="blog-post-title">${blogPost.title}</div>
            <div class="blog-post-content">${blogPost.content}</div>
        `;
        blogPostsContainer.appendChild(blogPostDiv);
    });
}

// Form validation and submission when it comes to adding the blog posts
blogPostForm.addEventListener('submit', function(event) {
    event.preventDefault();
    formErrorMessage.textContent = '';

    const blogPostTitleValue = postTitleInput.value.trim();
    const blogPostContentValue = postContentInput.value.trim();

    if (!blogPostTitleValue || blogPostContentValue) {
        formErrorMessage.textContent = 'Both title and content are required to create a post.';
        return;
    }

    const newBlogPostBeingAdded = {
        blogPostId: generateUniqueBlogPostId(),
        blogPostTitle: blogPostTitleValue,
        blogPostContent: blogPostContentValue,
        timestamp: new Date().toISOString()
    };

    blogPosts.unshift(newBlogPostBeingAdded);
    saveBlogPostsToLocalStorage();
    renderBlogPosts();

    blogPostForm.requestFullscreen();
})

// Initial load of all blog posts
loadBlogPostsFromLocalStorage();
renderBlogPosts();