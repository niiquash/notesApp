const Note = require('../models/Note')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().lean()
    if (!notes) {
        return res.status(400).json({ message: 'No notes found' })
    }
    res.json(notes)
})

// @desc Create a note
// @route POST /notes
// @access Private
const createNote = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body

    // confirm data
    if (!user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // check for duplicate
    const duplicate = await Note.findOne({ text }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate text content' })
    }

    const noteObject = { user, title, text }

    // create and store new note
    const note = await Note.create(noteObject)

    if (note) { // if created
        res.status(201).json({ message: `New note created` })
    } else {
        res.status(400).json({ message: 'Problem creating note' })
    }
})

// @desc Update A note
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req.body

    // confirm data
    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    // check for duplicate
    const duplicate = await Note.findOne({ text }).lean().exec()
    // Allow updates to the original note
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate note' })
    }

    note.user = user
    note.title = title
    note.text = text
    note.completed = completed

    const updateNote = await note.save()

    res.json({ message: 'Note updated' })
})

// @desc Delete a note
// @route DELETE /notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'Note ID Required' })
    }

    const note = await Note.findById(id).exec()
    // console.log(note)

    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    const result = await note.deleteOne()

    const reply = `Note ${result.title} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllNotes,
    createNote,
    updateNote,
    deleteNote
}