// Ensures users don't submit empty or too-short content.

export function validateEntry(title, plainTextContent) {
    const errors = { title: '', content: '' };
    let valid = true;

    if (!title.trim()) {
        errors.title = 'Title is required.'; // Friendly prompt
        valid = false;
    }

    if (!plainTextContent || plainTextContent.trim().length < 20) {
        errors.content = 'Content must be at least 20 characters.'; // Minimum meaningful length
        valid = false;
    }

    // Return both flag and specific messages
    return { valid, errors };
}