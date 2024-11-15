const Model = require("../models/taulparchi.model");
const createError = require("http-errors");
const mongoose = require("mongoose");
const StockModel = require("../models/stock.model");

module.exports = {
  create: async (req, res, next) => {
    try {
      const data = req.body;

      if (data.tulai === "Labour" && (!data.hammal || data.hammal === "")) {
        return res
          .status(400)
          .json({ error: "Hammal must be selected when Tulai is 'Labour'." });
      }
      if (data.hammal === "") {
        data.hammal = null;
      }
      // Validate required fields
      if (!data.farmerName) {
        return res.status(400).json({ error: "Farmer is required." });
      }
      if (!data.farmerVillage) {
        return res.status(400).json({ error: "Village is required." });
      }
      if (!data.firm_company) {
        return res.status(400).json({ error: "Firm/Company is required." });
      }
      if (!data.rate) {
        return res.status(400).json({ error: "Rate is required." });
      }

      if (data.tulai === "Labour" && !data.boraQuantity) {
        return res.status(400).json({ error: "Bora Quantity is required." });
      }
      // if (!data.unitBora) {
      //   return res.status(400).json({ error: "Unit Bora is required." });
      // }
      // if (!data.bharti) {
      //   return res.status(400).json({ error: "Bharti is required." });
      // }
      if (!data.crop) {
        return res.status(400).json({ error: "Crop is required." });
      }

      // // Calculate netWeight using the formula: netWeight = (boraQuantity * unitBora) + bharti
      // data.netWeight = data.boraQuantity * data.unitBora + data.bharti;

      // Check for duplicates (optional)
      // const existingTaulParchi = await Model.findOne({
      //   farmer: data.farmer,
      //   village: data.village,
      //   firm_company: data.firm_company,
      // });
      // if (existingTaulParchi) {
      //   return res.status(400).json({
      //     error:
      //       "A TaulParchi entry already exists with the same Farmer, Village, and Firm/Company.",
      //   });
      // }

      // Assign the `created_by` field from the authenticated user's ID
      if (req.user) {
        data.created_by = req.user.id;
      }
      const lastRecord = await Model.findOne({}).sort({ created_at: -1 }).select("sno");

      let newSno = "TL000001"; // Default if no records exist
  
      if (lastRecord && lastRecord.sno) {
        const lastNumber = parseInt(lastRecord.sno.slice(2)); // Extract number part after "Tl"
        newSno = `TL${String(lastNumber + 1).padStart(6, "0")}`;
      }
  
      data.sno = newSno;
      // Create a new TaulParchi instance with the provided data
      const newTaulParchi = new Model(data);
      const result = await newTaulParchi.save();

      // Create a new Stock instance with the provided data
      const newStock = new StockModel({
        crop: data.crop,
        quantity: data.netWeight,
        warehouse: data.storage,
        price: data.rate,
        bag_units:
          data.tulai == 'Labour'
          ?
            [
              {
                unit_weight_of_bags: data.bharti,
                no_of_bags: data.boraQuantity
              }
            ]
          :
            [],
        logType: "purchase",
        meta_data: {
          taulParchi: result._id,
        },
      });
      const stockResult = await newStock.save();

      res.status(201).json(result);
    } catch (error) {
      console.error("Error saving TaulParchi:", error);
      next(createError(500, "Failed to save TaulParchi.")); // Handle errors and send a 500 response
    }
  },
  // list: async (req, res, next) => {
  //   try {
  //     const { crop, firm_company, disabled, page, limit, order_by, order_in } =
  //       req.query;

  //     const _page = page ? parseInt(page) : 1;
  //     const _limit = limit ? parseInt(limit) : 20;
  //     const _skip = (_page - 1) * _limit;

  //     // Define sorting logic
  //     let sorting = {};
  //     if (order_by) {
  //       sorting[order_by] = order_in === "desc" ? -1 : 1;
  //     } else {
  //       sorting["_id"] = -1;
  //     }

  //     const query = {};
  //     if (firm_company) {
  //       query.firm_company = new RegExp(firm_company, "i");
  //     }
  //     if (crop) {
  //       query.crop = new mongoose.Types.ObjectId(crop);
  //     }
  //     query.disabled = { $ne: true };
  //     query.is_inactive = { $ne: true };


  //     // Aggregate query to get taul parchis with applied filters, pagination, and sorting
  //     let result = await Model.aggregate([
  //       { $match: query },
  //       { $sort: sorting },
  //       { $skip: _skip },
  //       { $limit: _limit },
  //       {
  //         $lookup: {
  //           from: "farmers",
  //           localField: "farmer",
  //           foreignField: "_id",
  //           as: "farmerDetails",
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "villages",
  //           localField: "village",
  //           foreignField: "_id",
  //           as: "villageDetails",
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "hammals",
  //           localField: "hammal",
  //           foreignField: "_id",
  //           as: "hammalDetails",
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "crops",
  //           localField: "crop",
  //           foreignField: "_id",
  //           as: "cropDetails",
  //         },
  //       },
  //       {
  //         $unwind: "$cropDetails",
  //       },
  //       {
  //         $unwind: "$hammalDetails",
  //       },
  //       {
  //         $unwind: "$villageDetails",
  //       },
  //       {
  //         $unwind: "$farmerDetails",
  //       },
  //     ]);

  //     // Count total number of results for pagination metadata
  //     const resultCount = await Model.countDocuments(query);

  //     // Respond with data and pagination metadata
  //     res.json({
  //       data: result,
  //       meta: {
  //         current_page: _page,
  //         from: _skip + 1,
  //         last_page: Math.ceil(resultCount / _limit),
  //         per_page: _limit,
  //         to: _skip + result.length,
  //         total: resultCount,
  //       },
  //     });
  //   } catch (error) {
  //     next(error); // Handle errors
  //   }
  // },

  list: async (req, res, next) => {
    try {
      const { farmerName, farmerMobile, farmerVillage, storage, crop, sno,firm_company, disabled, page, limit, order_by, order_in } =
        req.query;

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
      if (farmerName) {
        query.farmerName = new RegExp(farmerName, "i");
      }
      if (farmerMobile) {
        query.farmerMobile = new RegExp(farmerMobile, "i");
      }
      if (farmerVillage) {
        query.farmerVillage = new RegExp(farmerVillage, "i");
      }
      if (storage) {
        query.storage = new mongoose.Types.ObjectId(storage);
      }
      if (firm_company) {
        query.firm_company = new RegExp(firm_company, "i");
      }
      if (crop) {
        query.crop = new mongoose.Types.ObjectId(crop);
      }
      if (sno) {
        query.sno = new RegExp(sno, "i");
      }
      query.disabled = { $ne: true };
      query.is_inactive = { $ne: true };

      if (req.user && req.user.role !== "Admin" && req.user.role !== "cashier") {
        query.createdBy = mongoose.Types.ObjectId(req.user.id);
      }

      // Aggregate query to get taul parchis with applied filters, pagination, and sorting
      let result = await Model.aggregate([
        { $match: query },
        { $sort: sorting },
        { $skip: _skip },
        { $limit: _limit },
        {
          $lookup: {
            from: "farmers",
            localField: "farmer",
            foreignField: "_id",
            as: "farmerDetails",
          },
        },
        {
          $lookup: {
            from: "villages",
            localField: "village",
            foreignField: "_id",
            as: "villageDetails",
          },
        },
        {
          $lookup: {
            from: "hammals",
            localField: "hammal",
            foreignField: "_id",
            as: "hammalDetails",
          },
        },
        {
          $lookup: {
            from: "crops",
            localField: "crop",
            foreignField: "_id",
            as: "cropDetails",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $lookup: {
            from: "storages",
            localField: "storage",
            foreignField: "_id",
            as: "wearhouseDetails",
          },
        },
        {
          $lookup: {
            from: "companies",
            localField: "firm_company",
            foreignField: "_id",
            as: "companyDetails",
          },
        },
        {
          $unwind: {
            path: "$companyDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$cropDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$hammalDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$villageDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$farmerDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$userDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$wearhouseDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
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
        return res
          .status(400)
          .json({ error: "Invalid Parameters: Missing ID" });
      }

      const data = req.body;

      if (!data) {
        return res.status(400).json({ error: "No data provided for update." });
      }

      if (!data.transactionType) {
        return res.status(400).json({ error: "transactionType is required." });
      }

      // Calculate netWeight using the formula: netWeight = (boraQuantity * unitBora) + bharti
      // data.netWeight = data.boraQuantity * data.unitBora + data.bharti;
      if (
        data.boraQuantity !== undefined &&
        data.unitBora !== undefined &&
        data.bharti !== undefined
      ) {
        data.netWeight = data.boraQuantity * data.unitBora + data.bharti;
      }

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

      // delete the stock item related to the TaulParchi
      const stockResult = await StockModel.deleteMany({
        "meta_data.taulParchi": mongoose.Types.ObjectId(id),
      });

      console.log("Deleted stock items:", stockResult);

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

  // get: async (req, res, next) => {
  //   try {
  //     const { id } = req.params;

  //     if (!id) {
  //       throw createError.BadRequest("Invalid Parameters: Missing ID");
  //     }

  //     // Finding the TaulParchi document by its ID
  //     const result = await Model.findOne({ _id: mongoose.Types.ObjectId(id) });

  //     if (!result) {
  //       throw createError.NotFound("No TaulParchi Found");
  //     }

  //     // Sending the found TaulParchi document as a response
  //     res.json(result);
  //   } catch (error) {
  //     next(error);
  //   }
  // },

  get: async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!id) {
        throw createError.BadRequest("Invalid Parameters: Missing ID");
      }

      // Aggregation pipeline to fetch the TaulParchi document and related data
      const result = await Model.aggregate([
        {
          $match: { _id: mongoose.Types.ObjectId(id) }, // Match the ID
        },
        {
          $lookup: {
            from: "farmers",
            localField: "farmer",
            foreignField: "_id",
            as: "farmerDetails",
          },
        },
        {
          $lookup: {
            from: "villages",
            localField: "village",
            foreignField: "_id",
            as: "villageDetails",
          },
        },
        {
          $lookup: {
            from: "hammals",
            localField: "hammal",
            foreignField: "_id",
            as: "hammalDetails",
          },
        },
        {
          $lookup: {
            from: "crops",
            localField: "crop",
            foreignField: "_id",
            as: "cropDetails",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $lookup: {
            from: "storages",
            localField: "storage",
            foreignField: "_id",
            as: "wearhouseDetails",
          },
        },
        {
          $lookup: {
            from: "companies",
            localField: "firm_company",
            foreignField: "_id",
            as: "companyDetails",
          },
        },

        {
          $unwind: {
            path: "$cropDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$hammalDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$villageDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$farmerDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$userDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$wearhouseDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$companyDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);

      if (!result || result.length === 0) {
        throw createError.NotFound("No TaulParchi Found");
      }

      // Send the first result (since it's an array)
      res.json(result[0]);
    } catch (error) {
      next(error);
    }
  },
  getTaulparchisAggregatedData: async (req, res) => {
    try {
      const result = await Model.aggregate([
        {
          $lookup: {
            from: "crops",
            localField: "crop",
            foreignField: "_id",
            as: "cropDetails",
          },
        },
        { $unwind: "$cropDetails" },
        {
          $group: {
            _id: "$crop",
            crop_name: { $first: "$cropDetails.name" },
            totalUnitBoraBoraQuantity: {
              $sum: { $multiply: ["$unitBora", "$boraQuantity"] },
            },
            totalBharti: { $sum: "$bharti" },
            grandTotal: {
              $sum: {
                $add: [
                  "$bharti",
                  { $multiply: ["$unitBora", "$boraQuantity"] },
                ],
              },
            },
            grandRate: {
              $sum: {
                calculatedRate: {
                  $multiply: ["$rate", "$grandTotal"],
                },
              },
            },
          },
        },
      ]);

      res.status(200).json(result);
    } catch (error) {
      console.error("Error in aggregation:", error);

      res.status(500).json({
        success: false,
        message: "Error occurred while fetching data",
        error: error.message,
      });
    }
  },

  getTaulParchiDetails: async (req, res) => {
    try {
      const results = await Model.aggregate([
        {
          $lookup: {
            from: "farmers",
            localField: "farmer",
            foreignField: "_id",
            as: "farmerDetails",
          },
        },
        {
          $lookup: {
            from: "villages",
            localField: "village",
            foreignField: "_id",
            as: "villageDetails",
          },
        },
        {
          $lookup: {
            from: "hammals",
            localField: "hammal",
            foreignField: "_id",
            as: "hammalDetails",
          },
        },
        {
          $lookup: {
            from: "crops",
            localField: "crop",
            foreignField: "_id",
            as: "cropDetails",
          },
        },
        {
          $project: {
            _id: 1,
            farmerName: { $arrayElemAt: ["$farmerDetails.name", 0] },
            villageName: { $arrayElemAt: ["$villageDetails.name", 0] },
            hammalName: { $arrayElemAt: ["$hammalDetails.name", 0] },
            cropName: { $arrayElemAt: ["$cropDetails.name", 0] },
          },
        },
      ]);
      res.status(200).json(results);
    } catch (error) {
      throw new Error(error);
    }
  },
  getTaulParchiSummary: async (req, res) => {
    try {
      const { firm_company, page, limit, order_by, order_in, from, to } =
        req.query;

      const _page = page ? parseInt(page) : 1;
      const _limit = limit ? parseInt(limit) : 20;
      const _skip = (_page - 1) * _limit;


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

      if (from || to) {
        query.created_at = {};
        if (from) {
          query.created_at.$gte = new Date(from);
        }
        if (to) {
          query.created_at.$lte = new Date(to);
        }
      }

      query.disabled = { $ne: true };
      query.is_inactive = { $ne: true };

      let result = await Model.aggregate([
        { $match: query },
        { $sort: sorting },
        { $skip: _skip },
        { $limit: _limit },
        {
          $lookup: {
            from: "farmers",
            localField: "farmer",
            foreignField: "_id",
            as: "farmerDetails",
          },
        },

        {
          $lookup: {
            from: "crops",
            localField: "crop",
            foreignField: "_id",
            as: "cropDetails",
          },
        },
        { $unwind: "$farmerDetails" },

        { $unwind: "$cropDetails" },

        {
          $group: {
            _id: "$cropDetails._id",
            cropName: { $first: "$cropDetails.name" },
            totalRate: { $sum: "$rate" },
          },
        },
        { $sort: sorting },
      ]);
      const resultCount = await Model.countDocuments(query);

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
      throw new Error(error);
    }
  },
  // getWeightSummary: async (req, res) => {
  //   try {
  //     const { firm_company, page, limit, order_by, order_in, from, to } =
  //       req.query;

  //     const _page = page ? parseInt(page) : 1;
  //     const _limit = limit ? parseInt(limit) : 20;
  //     const _skip = (_page - 1) * _limit;

  //     // Define sorting logic
  //     let sorting = {};
  //     if (order_by) {
  //       sorting[order_by] = order_in === "desc" ? -1 : 1;
  //     } else {
  //       sorting["_id"] = -1; // Default sorting by _id (descending)
  //     }

  //     const query = {};
  //     if (firm_company) {
  //       query.firm_company = new RegExp(firm_company, "i");
  //     }

  //     // Add date range filter based on 'from' and 'to' params
  //     if (from || to) {
  //       query.created_at = {};
  //       if (from) {
  //         query.created_at.$gte = new Date(from);
  //       }
  //       if (to) {
  //         query.created_at.$lte = new Date(to);
  //       }
  //     }

  //     query.disabled = { $ne: true };
  //     query.is_inactive = { $ne: true };

  //     // Aggregate query to get total weight per crop
  //     let result = await Model.aggregate([
  //       { $match: query },
  //       { $sort: sorting },
  //       { $skip: _skip },
  //       { $limit: _limit },
  //       {
  //         $lookup: {
  //           from: "farmers",
  //           localField: "farmer",
  //           foreignField: "_id",
  //           as: "farmerDetails",
  //         },
  //       },
  //       // {
  //       //   $lookup: {
  //       //     from: "villages",
  //       //     localField: "village",
  //       //     foreignField: "_id",
  //       //     as: "villageDetails",
  //       //   },
  //       // },
  //       {
  //         $lookup: {
  //           from: "hammals",
  //           localField: "hammal",
  //           foreignField: "_id",
  //           as: "hammalDetails",
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "crops",
  //           localField: "crop",
  //           foreignField: "_id",
  //           as: "cropDetails",
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "users",
  //           localField: "createdBy",
  //           foreignField: "_id",
  //           as: "userDetails",
  //         },
  //       },
  //       { $unwind: "$farmerDetails" },
  //       // { $unwind: "$villageDetails" },
  //       { $unwind: "$hammalDetails" },
  //       { $unwind: "$cropDetails" },
  //       {
  //         $unwind: "$userDetails",
  //       },

  //       // Dynamically calculate net weight based on (boraQuantity * unitBora) + bharti
  //       {
  //         $addFields: {
  //           calculatedNetWeight: {
  //             $add: [{ $multiply: ["$boraQuantity", "$unitBora"] }, "$bharti"],
  //           },
  //         },
  //       },

  //       {
  //         $group: {
  //           _id: "$cropDetails._id",
  //           cropName: { $first: "$cropDetails.name" },
  //           totalWeight: { $sum: "$calculatedNetWeight" }, // Summing up the dynamically calculated net weight
  //         },
  //       },
  //       { $sort: sorting },
  //     ]);

  //     // Count total number of results for pagination metadata
  //     const resultCount = await Model.countDocuments(query);

  //     // Respond with data and pagination metadata
  //     res.json({
  //       data: result,
  //       meta: {
  //         current_page: _page,
  //         from: _skip + 1,
  //         last_page: Math.ceil(resultCount / _limit),
  //         per_page: _limit,
  //         to: _skip + result.length,
  //         total: resultCount,
  //       },
  //     });
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // },
  getWeightSummary: async (req, res) => {
    try {
      const { firm_company, page, limit, order_by, order_in, from, to } =
        req.query;

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

      // Create query object for filtering
      const query = {};
      if (firm_company) {
        query.firm_company = new RegExp(firm_company, "i");
      }

      // Date range filtering
      if (from || to) {
        query.created_at = {};
        if (from) query.created_at.$gte = new Date(from);
        if (to) query.created_at.$lte = new Date(to);
      }

      // Exclude disabled and inactive entries
      query.disabled = { $ne: true };
      query.is_inactive = { $ne: true };

      // Perform aggregation to calculate total weight per crop
      const result = await Model.aggregate([
        { $match: query },
        { $sort: sorting },
        { $skip: _skip },
        { $limit: _limit },
        {
          $lookup: {
            from: "farmers",
            localField: "farmer",
            foreignField: "_id",
            as: "farmerDetails",
          },
        },
        {
          $lookup: {
            from: "hammals",
            localField: "hammal",
            foreignField: "_id",
            as: "hammalDetails",
          },
        },
        {
          $lookup: {
            from: "crops",
            localField: "crop",
            foreignField: "_id",
            as: "cropDetails",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: { path: "$farmerDetails", preserveNullAndEmptyArrays: true },
        },
        {
          $unwind: { path: "$hammalDetails", preserveNullAndEmptyArrays: true },
        },
        { $unwind: { path: "$cropDetails", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },

        // Calculate net weight: (boraQuantity * unitBora) + bharti
        {
          $addFields: {
            calculatedNetWeight: {
              $add: [{ $multiply: ["$boraQuantity", "$unitBora"] }, "$bharti"],
            },
          },
        },

        // Group by crop to sum up the weights
        {
          $group: {
            _id: "$cropDetails._id",
            cropName: { $first: "$cropDetails.name" },
            totalWeight: { $sum: "$calculatedNetWeight" },
          },
        },
        { $sort: sorting }, // Sort results based on sorting criteria
      ]);

      // Get total count for pagination
      const resultCount = await Model.countDocuments(query);

      // Send response with result and pagination metadata
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
      console.error("Error in getWeightSummary:", error);
      res.status(500).json({ error: error.message });
    }
  },

  getByUser: async function (req, res, next) {
    const { id } = req.params;
    const { page, limit, order_by, order_in } = req.query;

    const _page = page ? parseInt(page) : 1;
    const _limit = limit ? parseInt(limit) : 20;
    const _skip = (_page - 1) * _limit;

    try {
      // Define sorting logic
      let sorting = {};
      if (order_by) {
        sorting[order_by] = order_in === "desc" ? -1 : 1;
      } else {
        sorting["_id"] = -1; // Default sorting by _id (descending)
      }

      // Build the query
      const query = { createdBy: mongoose.Types.ObjectId(id), disabled: false };
      // if (firm_company) {
      //     query.firm_company = new RegExp(firm_company, "i"); // Filter by firm_company (case-insensitive)
      // }
      // if (crop) {
      //     query.crop = mongoose.Types.ObjectId(crop); // Filter by crop
      // }
      query.disabled = { $ne: true };
      query.is_inactive = { $ne: true };

      let result = await Model.aggregate([
        { $match: query },
        { $sort: sorting },
        { $skip: _skip },
        { $limit: _limit },
        {
          $lookup: {
            from: "crops",
            localField: "crop",
            foreignField: "_id",
            as: "cropDetails",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $lookup: {
            from: "farmers",
            localField: "farmer",
            foreignField: "_id",
            as: "farmerDetails",
          },
        },
        {
          $lookup: {
            from: "villages",
            localField: "village",
            foreignField: "_id",
            as: "villageDetails",
          },
        },
        {
          $lookup: {
            from: "hammals",
            localField: "hammal",
            foreignField: "_id",
            as: "hammalDetails",
          },
        },
        {
          $unwind: "$cropDetails",
        },
        { $unwind: "$userDetails" },
        // { $unwind: "$hammalDetails" },
        {
          $unwind: { path: "$hammalDetails", preserveNullAndEmptyArrays: true },
        },
        { $unwind: "$farmerDetails" },
      ]);

      const resultCount = await Model.countDocuments(query);

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
  getWearhouseSummary: async (req, res) => {
    try {
      const { firm_company, page, limit, order_by, order_in, from, to } = req.query;

      const _page = page ? parseInt(page) : 1;
      const _limit = limit ? parseInt(limit) : 20;
      const _skip = (_page - 1) * _limit;

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

      if (from || to) {
        query.created_at = {};
        if (from) {
          query.created_at.$gte = new Date(from);
        }
        if (to) {
          query.created_at.$lte = new Date(to);
        }
      }

      query.disabled = { $ne: true };
      query.is_inactive = { $ne: true };

      let result = await Model.aggregate([
        { $match: query },
        { $sort: sorting },
        { $skip: _skip },
        { $limit: _limit },
        {
          $lookup: {
            from: "farmers",
            localField: "farmer",
            foreignField: "_id",
            as: "farmerDetails",
          },
        },
        {
          $lookup: {
            from: "crops",
            localField: "crop",
            foreignField: "_id",
            as: "cropDetails",
          },
        },
        {
          $lookup: {
            from: "storages",
            localField: "storage",
            foreignField: "_id",
            as: "wearhouseDetails",
          },
        },
        { $unwind: "$farmerDetails" },
        { $unwind: "$cropDetails" },
        { $unwind: "$wearhouseDetails" }, // Unwind the wearhouse details

        {
          $group: {
            _id: "$wearhouseDetails._id", // Group by wearhouseDetails
            storageName: { $first: "$wearhouseDetails.name" }, // Use the wearhouse name
            totalRate: { $sum: "$rate" }, // Calculate totalRate for each wearhouse
          },
        },
        { $sort: sorting },
      ]);

      const resultCount = await Model.countDocuments(query);

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
      throw new Error(error);
    }
  },
  getWearhouseWeightSummary: async (req, res) => {
    try {
      const {
        firm_company,
        page,
        limit,
        order_by,
        order_in,
        from,
        to,
      } = req.query;

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
      if (firm_company) {
        query.firm_company = mongoose.Types.ObjectId(firm_company);
      }


      // Add date range filter based on 'from' and 'to' params
      if (from || to) {
        query.created_at = {};
        if (from) {
          query.created_at.$gte = new Date(from);
        }
        if (to) {
          query.created_at.$lte = new Date(to);
        }
      }

      query.disabled = { $ne: true };
      query.is_inactive = { $ne: true };

      // Aggregate query to get truck loading data with filters, pagination, and sorting
      let result = await Model.aggregate([
        { $match: query },
        { $sort: sorting },

        {
          $lookup: {
            from: "crops",
            localField: "crop",
            foreignField: "_id",
            as: "cropDetails",
          },
        },
        {
          $lookup: {
            from: "storages",
            localField: "storage",
            foreignField: "_id",
            as: "wearhouseDetails",
          },
        },
        { $unwind: "$cropDetails" },
        { $unwind: "$wearhouseDetails" },

        // Grouping by crop to calculate total weight and sum of weights
        {
          $group: {
            _id: "$wearhouseDetails._id",
            storageName: { $first: "$wearhouseDetails.name" },
            totalWeight: {
              $sum: { $multiply: ["$boraQuantity", "$unitBora"] },
            }, // Calculate total weight
          },
        },
        {
          $sort: sorting,
        },
      ]);

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
      throw new Error(error);
    }
  },
  // patch:async (req, res) => {
  //   try {
  //     const { id } = req.params; 
  //     const { transactionType } = req.body; // Extract the field to update
  
  //     // Debugging: Log the request body to verify the incoming data
  //     console.log('Received data for update:', req.body);
  
  //     // Check if transactionType is provided
  //     if (!transactionType) {
  //       return res.status(400).json({ error: 'Transaction type is required.' });
  //     }
  
  //     // Find and update the Taulparchi document by ID
  //     const updatedTaulparchi = await Model.findByIdAndUpdate(
  //       id, // ID of the record to update
  //       { transactionType }, // Only update the transactionType field
  //       { new: true } // Return the updated document
  //     );
  
  //     if (!updatedTaulparchi) {
  //       return res.status(404).json({ error: 'Taulparchi not found.' });
  //     }
  
  //     // Send success response
  //     res.status(200).json({ message: 'Taulparchi updated successfully', data: updatedTaulparchi });
  //   } catch (err) {
  //     console.error('Error updating Taulparchi:', err);
  //     res.status(500).json({ error: 'An error occurred while updating Taulparchi.' });
  //   }}
   patch : async (req, res) => {
    try {
      const { id } = req.params;
      const { transactionType } = req.body;
      // const userId = req.user.id;  // Assuming the user ID is available in req.user (after authentication)
  
      // Debugging: Log the request body to verify the incoming data
      console.log('Received data for update:', req.body);
  
      // Check if transactionType is provided
      if (!transactionType) {
        return res.status(400).json({ error: 'Transaction type is required.' });
      }
  
      // Generate transactionId (sno) based on last record's sno
      const lastRecord = await Model.findOne({}).sort({ created_at: -1 }).select('sno');
      let newSno = "TRTP000001";  // Default if no records exist
  
      if (lastRecord && lastRecord.sno) {
        const lastNumber = parseInt(lastRecord.sno.slice(4)); // Extract number part after "TRTP"
        newSno = `TRTP${String(lastNumber + 1).padStart(6, '0')}`;
      }
  
      // Prepare the update data
      const updateData = {
        transactionType,
        update_date: new Date(),
        // transaction_by: userId,  // Save the user ID who made the transaction
        transactionId: newSno,   // New transaction ID based on sno
      };
  
      // Find and update the Taulparchi document by ID
      const updatedTaulparchi = await Model.findByIdAndUpdate(
        id,                      // ID of the record to update
        { $set: updateData },     // Update the fields
        { new: true }             // Return the updated document
      );
  
      if (!updatedTaulparchi) {
        return res.status(404).json({ error: 'Taulparchi not found.' });
      }
  
      // Send success response
      res.status(200).json({
        message: 'Taulparchi updated successfully',
        data: updatedTaulparchi
      });
    } catch (err) {
      console.error('Error updating Taulparchi:', err);
      res.status(500).json({ error: 'An error occurred while updating Taulparchi.' });
    }
  }  
  }
