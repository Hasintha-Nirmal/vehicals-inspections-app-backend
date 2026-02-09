const express = require('express');
const router = express.Router();

const {
    getAllInspections,
    createInspection,
    getInspectionById,
    deleteInspection,
    updateInspection
} = require('../controllers/inspectionController');

const { searchInspections } = require('../controllers/inspectionSearch');

// GET all inspections
router.get('/', getAllInspections);

// POST a new inspection
router.post('/', createInspection);

// GET a single inspection by ID
router.get('/id/:id', getInspectionById);

// DELETE a inspection by ID
router.delete('/:id', deleteInspection);

// UPDATE a inspection by ID
router.patch('/:id', updateInspection);


// Search inspections by chassis number or date range
router.get('/search', searchInspections);

module.exports = router;