const Model = require("../models/truckLoading.model");
const createError = require("http-errors");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
     create: async (req, res, next) => {
        try {
            const data = req.body;
            console.log("data", data);
    
            // Validate required fields
            if (!data.partyName) {
                return res.status(400).json({ error: "Party Name is required." });
            }
            if (!data.vehicleNumber) {
                return res.status(400).json({ error: "Vehicle Number is required." });
            }
            if (!data.assignedHammal) {
                return res.status(400).json({ error: "Assigned Hammal is required." });
            }
            if (!data.boraQuantity) {
                return res.status(400).json({ error: "Bora Quantity is required." });
            }
            if (!data.unitBora) {
                return res.status(400).json({ error: "Unit Bora is required." });
            }
            if (!data.crop) {
                return res.status(400).json({ error: "Crop is required." });
            }
    
            // Calculate netWeight using the formula: netWeight = boraQuantity * unitBora
            data.netWeight = data.boraQuantity * data.unitBora;
    
            // Optional: You can check for duplicates or other conditions if required.
            const existingTruckLoading = await Model.findOne({
                partyName: data.partyName,
                vehicleNumber: data.vehicleNumber,
            });
            if (existingTruckLoading) {
                return res.status(400).json({ error: "A Truck Loading entry already exists with the same Party Name and Vehicle Number." });
            }
    
            // Create a new TruckLoading instance with the provided data
            const newTruckLoading = new Model(data);
    
            // Save the new TruckLoading entry to the database
            const result = await newTruckLoading.save();
    
            // Respond with the saved TruckLoading and a status of 201 (Created)
            res.status(201).json(result);
        } catch (error) {
            console.error("Error saving TruckLoading:", error);
            next(createError(500, "Failed to save Truck Loading.")); // Handle errors and send a 500 response
        }
    },
     list : async (req, res, next) => {
        try {
            const { partyName, vehicleNumber, page, limit, order_by, order_in } = req.query;
    
            const _page = page ? parseInt(page) : 1;
            const _limit = limit ? parseInt(limit) : 20;
            const _skip = (_page - 1) * _limit;
    
            // Define sorting logic
            let sorting = {};
            if (order_by) {
                sorting[order_by] = order_in === "desc" ? -1 : 1;
            } else {
                sorting["_id"] = -1; // Default sorting by _id (descending)
            }
    
            const query = {};
            if (partyName) {
                query.partyName = mongoose.Types.ObjectId(partyName);
            }
            if (vehicleNumber) {
                query.vehicleNumber = new RegExp(vehicleNumber, "i");
            }
    
            query.disabled = { $ne: true };
            query.is_inactive = { $ne: true };
    
            console.log(query);
    
            // Aggregate query to get truck loading data with filters, pagination, and sorting
            let result = await Model.aggregate([
                { $match: query },
                { $sort: sorting },
                { $skip: _skip },
                { $limit: _limit },
            ]);
    
            // Count total number of results for pagination metadata
            const resultCount = await Model.countDocuments(query);
    
            // Respond with data and pagination metadata
            res.json({
                data: result,
                meta: {
                    current_page: _page,
                    from: _skip + 1,
                    last_page: Math.ceil(resultCount / _limit),
                    per_page: _limit,
                    to: _skip + result.length,
                    total: resultCount,
                },
            });
        } catch (error) {
            next(error); // Handle errors
        }
    },    
     update: async (req, res, next) => {
        try {
            const { id } = req.params;
    
            if (!id) {
                return res.status(400).json({ error: "Invalid Parameters: Missing ID" });
            }
    
            const data = req.body;
    
            if (!data) {
                return res.status(400).json({ error: "No data provided for update." });
            }
    
            // Validate required fields
            if (data.partyName === undefined) {
                return res.status(400).json({ error: "Party Name is required." });
            }
            if (data.vehicleNumber === undefined) {
                return res.status(400).json({ error: "Vehicle Number is required." });
            }
            if (data.deliveryLocation === undefined) {
                return res.status(400).json({ error: "Delivery Location is required." });
            }
            if (data.assignedHammal === undefined) {
                return res.status(400).json({ error: "Assigned Hammal is required." });
            }
            if (data.boraQuantity === undefined) {
                return res.status(400).json({ error: "Bora Quantity is required." });
            }
            if (data.unitBora === undefined) {
                return res.status(400).json({ error: "Unit Bora is required." });
            }
            if (data.crop === undefined) {
                return res.status(400).json({ error: "Crop is required." });
            }
    
            // Calculate netWeight using the formula: netWeight = boraQuantity * unitBora
            data.netWeight = data.boraQuantity * data.unitBora;
    
            // Assign the `updated_at` field
            data.updated_at = Date.now();
    
            // Update the TruckLoading document by ID and return the updated document
            const result = await Model.findByIdAndUpdate(
                id,
                { $set: data },
                { new: true, runValidators: true } // Return the updated document and run validators
            );
    
            if (!result) {
                return res.status(404).json({ error: "TruckLoading entry not found" });
            }
    
            res.json(result);
        } catch (error) {
            console.error("Error updating TruckLoading:", error);
            next(createError(500, "Failed to update TruckLoading.")); // Handle errors and send a 500 response
        }
    },
     delete :async (req, res, next) => {
        try {
            const { id } = req.params;
    
            if (!id) {
                throw createError.BadRequest("Invalid Parameters: Missing ID");
            }
    
            const deleted_at = Date.now();
    
            // Performing a soft delete by marking the TruckLoading as inactive and setting the deleted_at timestamp
            const result = await Model.updateOne(
                { _id: mongoose.Types.ObjectId(id) },
                { $set: { disabled: true, deleted_at } }
            );
    
            if (result.nModified === 0) {
                throw createError.NotFound("TruckLoading not found or already deleted");
            }
    
            res.json({ message: "TruckLoading deleted successfully", result });
        } catch (error) {
            next(error);
        }
    },
     get:async (req, res, next) => {
        try {
            const { id } = req.params;
    
            if (!id) {
                throw createError.BadRequest("Invalid Parameters: Missing ID");
            }
    
            // Finding the TruckLoading document by its ID
            const result = await Model.findOne({ _id: mongoose.Types.ObjectId(id) });
    
            if (!result) {
                throw createError.NotFound("No TruckLoading Found");
            }
    
            res.json(result);
        } catch (error) {
            next(error);
        }
    },
   
     getTruckLoadingAggregatedData : async (req, res) => {
        try {
          const result = await TruckLoading.aggregate([
            {
              $lookup: {
                from: 'crops', 
                localField: 'crop', 
                foreignField: '_id', 
                as: 'cropDetails',
              },
            },
            { $unwind: '$cropDetails' },
            {
              $group: {
                _id: '$crop', 
                crop_name: { $first: '$cropDetails.name' }, 
                totalBoraValue: {
                  $sum: {
                    $multiply: ['$unitBora', '$boraQuantity'], 
                  },
                },
              },
            },
          ])
            .maxTimeMS(60000) 
            .allowDiskUse(true); 
      
          res.status(200).json(result);
        } catch (error) {
          console.error('Error executing aggregation:', error);
          res.status(500).json({ message: 'Internal server error', error: error.message });
        }
      },

 getTruckLoadingDetails : async (req, res) => {
    try {
        const results = await Model.aggregate([
            {
                $lookup: {
                    from: 'parties', // The name of the collection for Party
                    localField: 'partyName',
                    foreignField: '_id',
                    as: 'partyDetails'
                }
            },
            {
                $lookup: {
                    from: 'deliveries', // The name of the collection for Delivery
                    localField: 'deliveryLocation',
                    foreignField: '_id',
                    as: 'deliveryDetails'
                }
            },
            {
                $lookup: {
                    from: 'hammals', // The name of the collection for Hammal
                    localField: 'assignedHammal',
                    foreignField: '_id',
                    as: 'hammalDetails'
                }
            },
            {
                $lookup: {
                    from: 'crops', // The name of the collection for Crop
                    localField: 'crop',
                    foreignField: '_id',
                    as: 'cropDetails'
                }
            },
            {
                $project: {
                    _id: 1,
                    partyName: { $arrayElemAt: ['$partyDetails.name', 0] }, // Adjust 'name' to your field
                    deliveryLocation: { $arrayElemAt: ['$deliveryDetails.locationName', 0] }, // Adjust 'locationName'
                    assignedHammal: { $arrayElemAt: ['$hammalDetails.name', 0] }, // Adjust 'name'
                    cropName: { $arrayElemAt: ['$cropDetails.name', 0] } // Adjust 'name'
                }
            }
        ]);

        return results;
    } catch (error) {
        throw new Error(error);
    }
}

      
    }