const express = require('express');
const { createSlot, bookedSlots, cancelBookedSlot } = require('../controllers/professorController');
const router = express.Router();

router.post('/createSlot', createSlot); 
router.get('/bookedSlots', bookedSlots); 
router.post('/cancelBookedSlot', cancelBookedSlot); 

module.exports = router;
