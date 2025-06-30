# SBA 5: Interactive Personal Blog Platform

## Project Description
This project is a fully interactive personal blog platform that allows users to create, modify, and erase journal entries directly in the browser. Each post includes a title and content, and users can edit or delete any entry at any time. Posts display their creation date and last edited timestamp for transparency. All data is stored in the browser's localStorage, ensuring persistence across page reloads and browser sessions.

The platform features an accessible, user-friendly interface with real-time validation feedback and confirmation dialogs to enhance the user experience. It supports keyboard navigation and ARIA labels for better accessibility. The responsive design adapts gracefully to various screen sizes, from desktops to mobile devices.

## How to Run the Application
No installation or server setup is required. Simply open the `index.html` file in any modern web browser (such as Chrome, Firefox, or Edge). All functionality is handled client-side with JavaScript, HTML, and CSS.

## Features
- **Create New Posts:** Users can add new blog entries with title and content, both validated for presence and minimum length.
- **Edit Existing Posts:** Modify any post with live feedback and the ability to cancel edits.
- **Delete Posts:** Remove posts with a confirmation prompt to prevent accidental deletions.
- **Data Persistence:** All posts are saved and loaded from localStorage, retaining state between sessions.
- **Accessibility:** Buttons have ARIA labels, form fields highlight errors, and keyboard navigation is supported.
- **Responsive UI:** Optimized layout and styling for various screen sizes.
- **Security:** User inputs are safely escaped to prevent cross-site scripting (XSS).

## Reflection on Development Process
Building this blog platform was a rewarding challenge that pushed me to improve both functionality and user experience. Initially, I focused on implementing the core CRUD operations with localStorage persistence. Then, I enhanced the form validation system to provide clear, real-time feedback to users, improving usability.

Handling edit states and canceling modifications required careful state management, which I solved by maintaining an editing entry ID and resetting the form appropriately. Introducing confirmation dialogs for deletion was important to protect user data.

I also prioritized accessibility by adding ARIA labels and ensuring the interface is navigable via keyboard. The responsive design ensures the platform works well on both desktop and mobile devices.

If given more time, I would add features such as rich text formatting, image uploads, post categorization, and synchronization across devices using a backend service.

Overall, this project helped me deepen my skills in vanilla JavaScript, DOM manipulation, user experience design, and front-end accessibility.

## Known Issues or Features Not Implemented
- No support for images or rich text formatting; only plain text entries.
- Posts cannot be reordered or categorized.
- No user authentication or multi-user support.
- Data is stored locally and does not sync between devices.

---

