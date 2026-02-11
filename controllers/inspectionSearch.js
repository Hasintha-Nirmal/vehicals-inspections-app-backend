const mongoose = require("mongoose");
const inspectionModel = require("../models/inspectionModel");

// Search inspections by chassis number or date range
const searchInspections = async (req, res) => {
  try {
    const { chassisNumber, startDate, endDate, inspectionDetailes } = req.query;

    if (!chassisNumber && !startDate && !endDate) {
    return res
      .status(400)
      .json({
        error:
          "At least one search parameter (chassisNumber, startDate, endDate) is required",
      });
  }

    let query = {};

    if (chassisNumber) {
      query.chassisNumber = { $regex: chassisNumber, $options: "i" }; // Case-insensitive search
    }

    if (startDate && endDate) {
      query.inspectionDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    if (inspectionDetailes) {
      // Convert to an array if it's a single string, then map everything to Numbers
      const detailsArray = Array.isArray(inspectionDetailes)
        ? inspectionDetailes.map(Number)
        : [Number(inspectionDetailes)];

      query.inspectionDetailes = { $in: detailsArray };
    }

    if (startDate && !endDate) {
      query.inspectionDate = { $gte: new Date(startDate) };
    }
    if (!startDate && endDate) {
      query.inspectionDate = { $lte: new Date(endDate) };
    }

    const inspections = await inspectionModel
      .find(query)
      .sort({ createdAt: -1 });

    if (inspections.length === 0) {
      return res
        .status(404)
        .json({ error: "No inspections found matching the criteria" });
    }
    res.status(200).json(inspections);
  } catch (error) {
    console.error("Error searching inspections:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while searching for inspections" });
  }

  
};

module.exports = {
  searchInspections,
};
