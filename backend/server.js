const express = require('express');         // Import express for creating the server
const bodyParser = require('body-parser');  // Import body-parser for parsing JSON requests
const cors = require('cors');               // Import cors for enabling Cross-Origin Resource Sharing
const mongoose = require('mongoose');       // Import mongoose for interacting with MongoDB

// Setup express app
const app = express();
app.use(cors());                            // Enable all CORS requests
app.use(bodyParser.json());                 // Parse JSON bodies

// Connect to MongoDB (Replace with your MongoDB URI)
mongoose.connect('mongodb+srv://sparashar5102001:snigdha510@cluster0.s162ilt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema for the notes
const noteSchema = new mongoose.Schema({
    title: String,
    date: String
});

// Create a model from the schema
const Note = mongoose.model('Note', noteSchema);

// Route for getting all notes
app.get('/notes', async (req, res) => {
    const notes = await Note.find();         // Fetch all notes from the database
    res.json(notes);                         // Send the notes as a JSON response
});

// Route for creating a new note
app.post('/notes', async (req, res) => {
    try {
        const newNote = new Note({
            title: req.body.title,
            date: req.body.date
        });
        await newNote.save();               // Save the new note to the database
        res.status(201).json(newNote);      // Send the saved note as a JSON response with a 201 status
    } catch (err) {
        console.error('Error saving note:', err);
        res.status(500).json({ error: 'Failed to save note' });  // Send a 500 status if there's an error
    }
});

// Route for updating an existing note
app.put('/notes/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);  // Find the note by ID
        if (note) {
            note.title = req.body.title;                  // Update the note's title
            await note.save();                            // Save the updated note
            res.json(note);                               // Send the updated note as a JSON response
        } else {
            res.status(404).json({ error: 'Note not found' });  // Send a 404 status if the note is not found
        }
    } catch (err) {
        console.error('Error updating note:', err);
        res.status(500).json({ error: 'Failed to update note' });  // Send a 500 status if there's an error
    }
});

// Route for deleting an existing note
app.delete('/notes/:id', async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);  // Find the note by ID and delete it
        res.status(204).send();                      // Send a 204 status to indicate successful deletion
    } catch (err) {
        console.error('Error deleting note:', err);
        res.status(500).json({ error: 'Failed to delete note' });  // Send a 500 status if there's an error
    }
});

// Start the server and listen on port 3000
app.listen(3000, () => console.log('Server running on port 3000'));
