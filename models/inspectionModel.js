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
    },
    assemblyTeam:{
        type: String
    },
    hood:{
        type: String
    },
    lineTest:{
        type: String
    },
    runningTester:{
        type: String
    },
    deliverTester:{
        type: String
    },
    qc:{
        type: String
    },
    painter:{
        type: String
    },
}, { timestamps: true });

module.exports = mongoose.model('Inspection', inspectionSchema);
