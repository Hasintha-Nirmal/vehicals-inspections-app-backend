const infectionModel = require('../models/inspectionModel');
const mongoose = require('mongoose');

// Get all inspections
const getAllInspections = async (req, res) => {
    const inspections = await infectionModel.find({}).sort({ createdAt: -1 });
    res.status(200).json(inspections);
}

// Create a new inspection
const createInspection = async (req, res) => {
    const { chassisNumber, inspectionDetailes, otherDetails } = req.body;
    if (!chassisNumber) {
        return res.status(400).json({ error: 'Chassis number is required' });
    }

    try {
        const inspection = await infectionModel.create({ chassisNumber, inspectionDetailes, otherDetails });
        res.status(200).json(inspection);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Get a single inspection by ID
const getInspectionById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such inspection' });
    }

    const inspection = await infectionModel.findById(id);
    if (!inspection) {
        return res.status(404).json({ error: 'No such inspection' });
    }else {
        res.status(200).json(inspection);
    }
}

//delete a inspection
const deleteInspection = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such inspection' });
    }

    const inspection = await infectionModel.findByIdAndDelete(id);
    if (!inspection) {
        return res.status(404).json({ error: 'No such inspection' });
    }
    res.status(200).json(inspection);
}

// Update a inspection
    const updateInspection = async (req, res) => {
    const { id } = req.params;
    const { chassisNumber, inspectionDetailes, otherDetails } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such inspection' });
    }

    const inspection = await infectionModel.findByIdAndUpdate(id, { chassisNumber, inspectionDetailes, otherDetails }, { new: true });
    if (!inspection) {
        return res.status(404).json({ error: 'No such inspection' });
    }
    res.status(200).json(inspection);
}

module.exports = {
    getAllInspections,
    createInspection,
    getInspectionById,
    deleteInspection,
    updateInspection
}