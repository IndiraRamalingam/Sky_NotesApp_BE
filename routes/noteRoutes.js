const express=require('express')
const router=express.Router();
const noteController = require('../controllers/note/noteController')

//to get the ID of User
router.get('/getId',noteController.getUserID);

//to view all notes
router.get('/getAll/:id',noteController.getAllNotes);

//to get note using ID
router.get('/getNote/:id',noteController.getNote);

//to add new note
router.post('/addNote/:id',noteController.addnewNote);

//to update note
router.put('/editNote/:id',noteController.editNote);

//to delete note
router.delete('/deleteNote/:id',noteController.deleteNote);

module.exports=router;