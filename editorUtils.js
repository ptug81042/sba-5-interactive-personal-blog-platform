// Keep rich editor and hidden textarea in sync, and santizes pasted text.

export function syncContent(richTextEditor, contentTextarea) {
    // Update hidden input so form submission stays in sync
    contentTextarea.value = richTextEditor.innerHTML;
}

export function handlePaste(event) {
    // Clean up pasted text to plain content
    event.preventDefault();
    const text = (event.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, text);
}

export function execToolbarCommand(command) {
    // Run formatting commands (bold, italics, etc.)
    document.execCommand(command, false, null);
}