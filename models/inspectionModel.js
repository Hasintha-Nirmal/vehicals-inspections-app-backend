const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inspectionSchema = new Schema({
    chassisNumber: {
        type: String,
        required: true,
        unique: true
    },
    inspectionDetailes: [{
        type: Number,
        required: true
    }],
    otherDetails: {
        type: String
    },
    inspectionDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Inspection', inspectionSchema);
