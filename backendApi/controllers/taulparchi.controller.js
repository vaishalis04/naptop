const Model = require("../models/taulparchi.model");
const createError = require("http-errors");
const mongoose = require("mongoose");

module.exports = {

    create: async (req, res, next) => {
        try {
            const data = req.body;
            console.log("data", data);
            
            // Validate required fields
            if (!data.farmer) {
                return res.status(400).json({ error: "Farmer is required." });
            }
            if (!data.village) {
                return res.status(400).json({ error: "Village is required." });
            }
            if (!data.firm_company) {
                return res.status(400).json({ error: "Firm/Company is required." });
            }
            if (!data.rate) {
                return res.status(400).json({ error: "Rate is required." });
            }
            if (!data.hammal) {
                return res.status(400).json({ error: "Hammal is required." });
            }
            if (!data.boraQuantity) {
                return res.status(400).json({ error: "Bora Quantity is required." });
            }
            if (!data.unitBora) {
                return res.status(400).json({ error: "Unit Bora is required." });
            }
            if (!data.bharti) {
                return res.status(400).json({ error: "Bharti is required." });
            }
            if (!data.crop) {
                return res.status(400).json({ error: "Crop is required." });
            }
    
            // Calculate netWeight using the formula: netWeight = (boraQuantity * unitBora) + bharti
            data.netWeight = (data.boraQuantity * data.unitBora) + data.bharti;
    
            // Check for duplicates (optional)
            const existingTaulParchi = await Model.findOne({ 
                farmer: data.farmer, 
                village: data.village, 
                firm_company: data.firm_company 
            });
            if (existingTaulParchi) {
                return res.status(400).json({ error: "A TaulParchi entry already exists with the same Farmer, Village, and Firm/Company." });
            }
    
            // Assign the `created_by` field from the authenticated user's ID
            if (req.user) {
                data.created_by = req.user.id;
            }
    
            // Create a new TaulParchi instance with the provided data
            const newTaulParchi = new Model(data);
    
            const result = await newTaulParchi.save();
    
            res.status(201).json(result);
        } catch (error) {
            console.error("Error saving TaulParchi:", error);
            next(createError(500, "Failed to save TaulParchi.")); // Handle errors and send a 500 response
        }
    },
    list: async (req, res, next) => {
        try {
            const { firm_company, disabled, page, limit, order_by, order_in } = req.query;

            const _page = page ? parseInt(page) : 1;
            const _limit = limit ? parseInt(limit) : 20;
            const _skip = (_page - 1) * _limit;

            // Define sorting logic
            let sorting = {};
            if (order_by) {
                sorting[order_by] = order_in === "desc" ? -1 : 1;
            } else {
                sorting["_id"] = -1; 
            }

            const query = {};
            if (firm_company) {
                query.firm_company = new RegExp(firm_company, "i");
            }

            query.disabled = { $ne: true };
            query.is_inactive = { $ne: true };

            console.log(query);

            // Aggregate query to get taul parchis with applied filters, pagination, and sorting
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
            if (data.farmer === undefined) {
                return res.status(400).json({ error: "Farmer is required." });
            }
            if (data.village === undefined) {
                return res.status(400).json({ error: "Village is required." });
            }
            if (data.firm_company === undefined) {
                return res.status(400).json({ error: "Firm/Company is required." });
            }
            if (data.rate === undefined) {
                return res.status(400).json({ error: "Rate is required." });
            }
            if (data.hammal === undefined) {
                return res.status(400).json({ error: "Hammal is required." });
            }
            if (data.boraQuantity === undefined) {
                return res.status(400).json({ error: "Bora Quantity is required." });
            }
            if (data.unitBora === undefined) {
                return res.status(400).json({ error: "Unit Bora is required." });
            }
            if (data.bharti === undefined) {
                return res.status(400).json({ error: "Bharti is required." });
            }
            if (data.crop === undefined) {
                return res.status(400).json({ error: "Crop is required." });
            }
    
            // Calculate netWeight using the formula: netWeight = (boraQuantity * unitBora) + bharti
            data.netWeight = (data.boraQuantity * data.unitBora) + data.bharti;
    
            // Assign the `updated_at` field
            data.updated_at = Date.now();
    
            // Update the TaulParchi document by ID and return the updated document
            const result = await Model.findByIdAndUpdate(
                id,
                { $set: data },
                { new: true, runValidators: true } // Return the updated document and run validators
            );
    
            if (!result) {
                return res.status(404).json({ error: "TaulParchi not found" });
            }
    
            res.json(result);
        } catch (error) {
            console.error("Error updating TaulParchi:", error);
            next(createError(500, "Failed to update TaulParchi.")); // Handle errors and send a 500 response
        }
    },
    

    delete: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!id) {
                throw createError.BadRequest("Invalid Parameters: Missing ID");
            }

            const deleted_at = Date.now();

            // Performing a soft delete by marking the TaulParchi as inactive and setting the deleted_at timestamp
            const result = await Model.updateOne(
                { _id: mongoose.Types.ObjectId(id) },
                { $set: { disabled: true, deleted_at } }
            );

            if (result.nModified === 0) {
                throw createError.NotFound("TaulParchi not found or already deleted");
            }

            res.json({ message: "TaulParchi deleted successfully", result });
        } catch (error) {
            next(error);
        }
    },

    get: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!id) {
                throw createError.BadRequest("Invalid Parameters: Missing ID");
            }

            // Finding the TaulParchi document by its ID
            const result = await Model.findOne({ _id: mongoose.Types.ObjectId(id) });

            if (!result) {
                throw createError.NotFound("No TaulParchi Found");
            }

            // Sending the found TaulParchi document as a response
            res.json(result);
        } catch (error) {
            next(error);
        }
    },
     getTaulparchisAggregatedData : async (req, res) => {
        try {
          const result = await Model.aggregate([
            {
              $lookup: {
                from: 'crops',
                localField: 'crop',
                foreignField: '_id',
                as: 'cropDetails'
              }
            },
            { $unwind: '$cropDetails' },
            {
              $group: {
                _id: '$crop',
                crop_name: { $first: '$cropDetails.name' },
                totalUnitBoraBoraQuantity: {
                  $sum: { $multiply: ['$unitBora', '$boraQuantity'] }
                },
                totalBharti: { $sum: '$bharti' },
                grandTotal: {
                  $sum: {
                    $add: [
                      '$bharti',
                      { $multiply: ['$unitBora', '$boraQuantity'] }
                    ]
                  }
                }
              }
            }
          ],
          {
            maxTimeMS: 60000, 
            allowDiskUse: true 
          });
      
          res.status(200).json({
            success: true,
            data: result
          });
        } catch (error) {
          console.error('Error in aggregation:', error);
      
          res.status(500).json({
            success: false,
            message: 'Error occurred while fetching data',
            error: error.message
          });
        }
      },
       getTaulParchiDetails : async (req, res) => {
        try {
            const results = await Model.aggregate([
                {
                    $lookup: {
                        from: 'farmers',
                        localField: 'farmer',
                        foreignField: '_id',
                        as: 'farmerDetails'
                    }
                },
                {
                    $lookup: {
                        from: 'villages',
                        localField: 'village',
                        foreignField: '_id',
                        as: 'villageDetails'
                    }
                },
                {
                    $lookup: {
                        from: 'hammals',
                        localField: 'hammal',
                        foreignField: '_id',
                        as: 'hammalDetails'
                    }
                },
                {
                    $lookup: {
                        from: 'crops',
                        localField: 'crop',
                        foreignField: '_id',
                        as: 'cropDetails'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        farmerName: { $arrayElemAt: ['$farmerDetails.name', 0] },
                        villageName: { $arrayElemAt: ['$villageDetails.name', 0] },
                        hammalName: { $arrayElemAt: ['$hammalDetails.name', 0] },
                        cropName: { $arrayElemAt: ['$cropDetails.name', 0] }
                    }
                }
            ]);
    
            return results;
        } catch (error) {
            throw new Error(error);
        }
    }
          

}