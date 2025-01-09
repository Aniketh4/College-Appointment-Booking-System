const express = require('express');
const { listAvailableProfessors, bookslot, viewbookedslots } = require('../controllers/studentController');

const router = express.Router();

router.post('/listavailableprofessors', listAvailableProfessors);
router.post('/bookslot', bookslot);
router.post('/viewbookedslots', viewbookedslots);

module.exports = router;
