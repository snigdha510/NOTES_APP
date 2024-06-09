// URL of the API endpoint
const API_URL = 'http://localhost:3000/notes';

// When the document is fully loaded, initialize the application
document.addEventListener('DOMContentLoaded', () => {
    fetchNotes();       // Fetch and display notes from the API
    setupTrash();       // Set up trash functionality
    setupCalendar();    // Set up calendar functionality
});

// Function to fetch notes from the API
async function fetchNotes() {
    try {
        const response = await fetch(API_URL);      // Fetch notes from the API
        const notes = await response.json();        // Parse the response as JSON
        updateNotesList(notes);                     // Update the notes list in the UI
    } catch (error) {
        console.error('Error fetching notes:', error);  // Log any errors to the console
    }
}

// Function to update the notes list in the UI
function updateNotesList(notes) {
    const notesList = document.getElementById('note-list');
    notesList.innerHTML = ''; // Clear existing notes

    notes.forEach(note => {
        const noteDiv = createNoteElement(note);  // Create a note element for each note
        notesList.insertBefore(noteDiv, document.getElementById('add-note')); // Add the note element to the list
    });
}

// Function to create a note element
function createNoteElement(note) {
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note');
    noteDiv.setAttribute('data-id', note._id);
    noteDiv.setAttribute('draggable', true);
    noteDiv.innerHTML = `
        <div class="note-title">${note.title}</div>
        <div class="note-date">${note.date}</div>
        <div class="note-actions">
            <button class="edit-note">Edit</button>
            <button class="delete-note">Delete</button>
        </div>`;

    addNoteListeners(noteDiv);  // Add event listeners to the note element
    return noteDiv;
}

// Event listener for adding a new note
document.getElementById('add-note').addEventListener('click', async () => {
    const noteTitle = prompt("Enter note title:"); // Prompt the user for a note title
    if (noteTitle) {
        const noteDate = new Date().toLocaleDateString(); // Get the current date
        const newNote = { title: noteTitle, date: noteDate }; // Create a new note object

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newNote)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const savedNote = await response.json();  // Parse the response as JSON
            const noteDiv = createNoteElement(savedNote);  // Create a note element for the new note
            document.getElementById('note-list').insertBefore(noteDiv, document.getElementById('add-note'));
        } catch (error) {
            console.error('Error adding note:', error);  // Log any errors to the console
        }
    }
});

// Event listener for adding a new folder
document.getElementById('add-folder').addEventListener('click', () => {
    const folderName = prompt("Enter folder name:");  // Prompt the user for a folder name
    if (folderName) {
        const folderDate = new Date().toLocaleDateString(); // Get the current date
        const folderDiv = document.createElement('div');
        folderDiv.classList.add('folder');
        folderDiv.innerHTML = `
            <div class="folder-name">${folderName}</div>
            <div class="folder-date">${folderDate}</div>
            <div class="folder-actions">
                <button class="edit-folder">Edit</button>
                <button class="delete-folder">Delete</button>
            </div>`;
        folderDiv.style.backgroundColor = generateRandomColor(); // Assign a random background color to the folder
        folderDiv.setAttribute('data-folder', folderName);
        document.getElementById('folder-list').insertBefore(folderDiv, document.getElementById('add-folder'));
        addFolderListeners(folderDiv);  // Add event listeners to the folder element
    }
});

// Function to add event listeners to a note element
function addNoteListeners(noteDiv) {
    noteDiv.querySelector('.edit-note').addEventListener('click', async () => {
        const newTitle = prompt("Edit note title:", noteDiv.querySelector('.note-title').innerText);
        if (newTitle) {
            const noteId = noteDiv.getAttribute('data-id');
            try {
                const response = await fetch(`${API_URL}/${noteId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: newTitle })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }

                const updatedNote = await response.json();  // Parse the response as JSON
                noteDiv.querySelector('.note-title').innerText = updatedNote.title;  // Update the note title in the UI
            } catch (error) {
                console.error('Error updating note:', error);  // Log any errors to the console
            }
        }
    });

    noteDiv.querySelector('.delete-note').addEventListener('click', async () => {
        if (confirm("Are you sure you want to delete this note?")) {
            const noteId = noteDiv.getAttribute('data-id');
            try {
                const response = await fetch(`${API_URL}/${noteId}`, { method: 'DELETE' });

                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }

                moveNoteToTrash(noteDiv);  // Move the note to the trash
            } catch (error) {
                console.error('Error deleting note:', error);  // Log any errors to the console
            }
        }
    });

    noteDiv.addEventListener('dragstart', handleDragStart);  // Add drag start event listener
    noteDiv.addEventListener('dragend', handleDragEnd);      // Add drag end event listener
}

// Function to add event listeners to a folder element
function addFolderListeners(folderDiv) {
    folderDiv.querySelector('.edit-folder').addEventListener('click', () => {
        const newName = prompt("Edit folder name:", folderDiv.querySelector('.folder-name').innerText);
        if (newName) {
            folderDiv.querySelector('.folder-name').innerText = newName;  // Update the folder name in the UI
            folderDiv.setAttribute('data-folder', newName);
        }
    });

    folderDiv.querySelector('.delete-folder').addEventListener('click', () => {
        if (confirm("Are you sure you want to delete this folder?")) {
            folderDiv.remove();  // Remove the folder from the UI
        }
    });

    folderDiv.addEventListener('dragover', handleDragOver);  // Add drag over event listener
    folderDiv.addEventListener('drop', handleDrop);          // Add drop event listener
}

// Function to generate a random color for folders
function generateRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];  // Generate a random hex color code
    }
    return color;
}

// Function to handle drag start event
function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.id);  // Store the note id in the data transfer object
    setTimeout(() => {
        event.target.classList.add('hidden');  // Hide the note being dragged
    }, 0);
}

// Function to handle drag end event
function handleDragEnd(event) {
    event.target.classList.remove('hidden');  // Show the note after dragging ends
}

// Function to handle drag over event
function handleDragOver(event) {
    event.preventDefault();  // Prevent the default behavior to allow dropping
}

// Function to handle drop event
function handleDrop(event) {
    event.preventDefault();  // Prevent the default behavior
    const noteId = event.dataTransfer.getData('text/plain');  // Retrieve the note id from the data transfer object
    const noteDiv = document.querySelector(`.note[data-id='${noteId}']`);
    const folderName = event.target.dataset.folder;  // Get the folder name from the drop target
    noteDiv.querySelector('.note-actions').innerHTML += `<span class="note-folder">${folderName}</span>`;  // Update the note with the folder name
    event.target.appendChild(noteDiv);  // Move the note to the folder
}

// Function to move a note to the trash
function moveNoteToTrash(noteDiv) {
    const trashList = document.getElementById('trash-list');
    noteDiv.querySelector('.note-actions').remove();  // Remove note actions before moving to trash
    trashList.appendChild(noteDiv);  // Add the note to the trash list
}

// Function to set up the trash functionality
function setupTrash() {
    document.getElementById('trash-link').addEventListener('click', () => {
        document.getElementById('trash').classList.toggle('hidden');  // Toggle visibility of the trash section
    });
}

// Function to set up the calendar functionality
function setupCalendar() {
    document.getElementById('calendar-link').addEventListener('click', () => {
        const selectedDate = prompt("Enter date (MM/DD/YYYY):");  // Prompt the user for a date
        if (selectedDate) {
            fetchNotesByDate(selectedDate);  // Fetch notes by the selected date
        }
    });
}

// Function to fetch notes by a specific date from the API
async function fetchNotesByDate(selectedDate) {
    try {
        const response = await fetch(`${API_URL}?date=${selectedDate}`);  // Fetch notes for the specified date
        const notes = await response.json();  // Parse the response as JSON
        displayNotesByDate(notes);  // Display the notes in the UI
    } catch (error) {
        console.error('Error fetching notes by date:', error);  // Log any errors to the console
    }
}

// Function to display notes by a specific date in the UI
function displayNotesByDate(notes) {
    const dateNotesList = document.getElementById('date-notes-list');
    dateNotesList.innerHTML = ''; // Clear existing notes

    notes.forEach(note => {
        const noteDiv = createNoteElement(note);  // Create a note element for each note
        dateNotesList.appendChild(noteDiv);  // Add the note element to the list
    });

    // Show the calendar section and hide other sections
    document.getElementById('calendar').classList.remove('hidden');
    document.getElementById('notes').classList.add('hidden');
    document.getElementById('recent-folders').classList.add('hidden');
    document.getElementById('trash').classList.add('hidden');
}
