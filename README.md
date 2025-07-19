# SBA 5: Interactive Personal Blog Platform

## Project Overview

This project is a lightweight, browser-based blogging and journaling platform developed using vanilla JavaScript. It allows users to write, edit, and delete personal journal entries directly in the browser. All data is stored locally using the browser’s `localStorage`, meaning no internet connection, backend server, or external database is required to use the application.

The purpose behind this build was to create something simple, fast, and completely offline—perfect for quick personal notes or day-to-day reflections.

---

## How to Run the Application

Getting started requires no setup or installation:

1. Download or clone this repository to your local machine.
2. Open the `index.html` file in any modern browser (Chrome, Firefox, Safari, or Edge).
3. Begin creating entries. Your data will be saved automatically in your browser's storage.

This app runs entirely in the browser and does not require an internet connection after the initial load.

---

## Development Reflection

This project gave me the opportunity to work through a range of practical front-end challenges without relying on frameworks or libraries. Everything was handled using plain JavaScript, which helped reinforce my understanding of DOM manipulation, state management, and browser APIs.

### Challenges Encountered:

- Managing the difference between creating and editing a post in a clear and user-friendly way.
- Keeping the UI consistent with the state of `localStorage` to avoid bugs during updates or deletions.
- Implementing form validation in a way that helped guide the user without being overly restrictive.

### How I Solved Them:

- Introduced a dedicated variable to track whether the form was in editing mode and changed button labels dynamically to reflect that.
- Created modular helper functions to handle rendering and state updates in a predictable way.
- Built clear validation logic for both title and content inputs, and added the ability to cancel edits at any time.

Each of these improvements not only made the app more stable, but also helped streamline the user experience.

---

## Known Limitations and Future Improvements

While the core functionality is stable, there are a few known areas where enhancements could be made:

- No support for rich text formatting or images (currently plain text only).
- Posts cannot be organized into categories or filtered.
- Data is stored only locally—entries won't persist across browsers or devices.
- There is no user authentication or multi-user support.

---

## Final Thoughts

This project was an excellent opportunity to apply core JavaScript concepts in a meaningful and self-directed way. The entire platform was designed with simplicity and clarity in mind—from both a user experience and a code architecture perspective.

I'm proud of how clean and maintainable the code turned out, and I believe the final result strikes a good balance between functionality and lightweight design.