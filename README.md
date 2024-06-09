# Notes App

This is a simple notes application built using HTML, CSS, JavaScript for the front end and Node.js with MongoDB for the backend. It allows users to create, edit, delete notes, organize them into folders, and view notes by date.
<img width="1496" alt="Screenshot 2024-06-10 at 1 48 24 AM" src="https://github.com/snigdha510/NOTES_APP/assets/100710845/68f2001c-24e8-4e40-a76b-12bac1d84d80">



## Installation

To run this application locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd <project-directory>
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   node server.js
   ```

5. Open the application in your web browser by visiting `http://localhost:3000`.

## Features

- **Create Note**: Click on the "Add Note" button to create a new note. Enter the title of the note in the prompt window.

- **Edit Note**: Click on the "Edit" button next to a note to edit its title. Enter the new title in the prompt window.

- **Delete Note**: Click on the "Delete" button next to a note to delete it. Confirm the action in the confirmation dialog.

- **Organize Notes into Folders**: Create folders to organize your notes. Click on the "Add Folder" button to create a new folder.

- **View Notes by Date**: Click on the calendar icon to view notes by a specific date. Enter the date in the format MM/DD/YYYY in the prompt window.

- **Trash Functionality**: Move notes to the trash by deleting them. Click on the trash icon to view and restore deleted notes.

## Technologies Used

- **Frontend**:
  - HTML
  - CSS
  - JavaScript

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB

## Dependencies

- express
- body-parser
- cors
- mongoose

## Additional Notes

- This application uses MongoDB as the database. Make sure you have MongoDB installed and running locally or replace the MongoDB URI in `server.js` with your own.

- Ensure that Node.js and npm are installed on your system to run the server.

## Acknowledgements

- This project was developed by [Snigdha Parashar].
