const express = require('express');
const { createSlot, deleteSlot, bookedSlots, cancelBookedSlot } = require('../controllers/professorController');
const router = express.Router();

router.post('/createSlot', createSlot); 
router.delete('/deleteSlot', deleteSlot); 
router.get('/bookedSlots', bookedSlots); 
router.post('/cancelBookedSlot', cancelBookedSlot); 

module.exports = router;
