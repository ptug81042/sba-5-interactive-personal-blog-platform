# SBA 5: Interactive Personal Blog Platform

## Project Description
This project is a fully interactive personal blog platform that allows users to create, modify, and erase journal entries directly in the browser. Each post includes a title and content, and users can edit or delete any entry at any time. All posts are stored in the browser's localStorage, ensuring that your thoughts persist even after refreshing or closing the page. The platform features a clean, user-friendly interface and provides instant feedback for form validation.

## How to Run the Application
No installation or server setup is required. Simply open the `index.html` file in any modern web browser (such as Chrome, Firefox, or Edge). All functionality is handled client-side with JavaScript, HTML, and CSS.

## Reflection on Development Process
Building this blog platform was a rewarding challenge. I started by designing the data structure for journal entries, ensuring each post would have a unique identifier and timestamps for creation and edits. I then focused on modularizing the JavaScript code, separating concerns for rendering, persistence, and form handling. One of the main challenges was managing the edit state and ensuring the form reset correctly after edits or deletions. I overcame this by introducing a clear editing state variable and a dedicated cancel edit button, which improved both the code clarity and user experience. Another challenge was crafting custom error messages that guide the user without being intrusive. Testing across different browsers helped me ensure consistent behavior.

## Known Issues or Features Not Implemented
- There is currently no support for images or rich text formatting in posts; only plain text is allowed.
- Posts cannot be reordered or categorized.
- There is no authentication or user management—anyone with access to the browser can view or modify entries.
- The platform is designed for single-user, local use and does not sync data across devices.

---