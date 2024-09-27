const Model = require("../models/transaction.model");
const createError = require("http-errors");
const mongoose = require("mongoose");


    
module.exports = {
  create: async (req, res, next) => {
    try {
      const data = req.body;
      console.log("Transaction Data:", data);

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
      if (!data.boraQuantity) {
        return res.status(400).json({ error: "Bora Quantity is required." });
      }
      if (!data.unitBora) {
        return res.status(400).json({ error: "Unit Bora is required." });
      }
      if (!data.crop) {
        return res.status(400).json({ error: "Crop is required." });
      }
      if (!data.transactionMode) {
        return res.status(400).json({ error: "Transaction Mode is required." });
      }
      if (!data.totalAmount) {
        return res.status(400).json({ error: "Total Amount is required." });
      }
      if (!data.paidAmount) {
        return res.status(400).json({ error: "Paid Amount is required." });
      }

      // Calculate netWeight using the formula: netWeight = boraQuantity * unitBora
      data.netWeight = data.boraQuantity * data.unitBora;

      // Calculate remainingAmount: totalAmount - paidAmount - discount (default discount to 0 if not provided)
      data.discount = data.discount || 0;
      data.remainingAmount = data.totalAmount - data.paidAmount - data.discount;

      // Optional: Check if a similar transaction already exists based on some condition (e.g., firm_company, crop, etc.)
      const existingTransaction = await Model.findOne({
        firm_company: data.firm_company,
        crop: data.crop,
      });
      if (existingTransaction) {
        return res.status(400).json({
          error: "A transaction with the same firm/company and crop already exists.",
        });
      }

      // Create a new Transaction instance with the provided data
      const newTransaction = new Model(data);

      // Save the new Transaction entry to the database
      const result = await newTransaction.save();

      // Respond with the saved Transaction and a status of 201 (Created)
      res.status(201).json(result);
    } catch (error) {
      console.error("Error saving Transaction:", error);
      next(createError(500, "Failed to save Transaction.")); // Handle errors and send a 500 response
    }
  },
  list: async (req, res, next) => {
    try {
      const {
        crop, 
        farmer, 
        village, 
        firm_company, 
        hammal, 
        transactionStatus, 
        transactionMode, 
        page, 
        limit, 
        order_by, 
        order_in 
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
  
      // Apply filters based on query parameters
      if (farmer) {
        query.farmer = mongoose.Types.ObjectId(farmer);
      }
      if (village) {
        query.village = mongoose.Types.ObjectId(village);
      }
      if (firm_company) {
        query.firm_company = new RegExp(firm_company, "i");
      }
      if (hammal) {
        query.hammal = mongoose.Types.ObjectId(hammal);
      }
      if (transactionStatus) {
        query.transactionStatus = transactionStatus;
      }
      if (transactionMode) {
        query.transactionMode = transactionMode;
      }
      if (crop) {
        query.crop = mongoose.Types.ObjectId(crop);
      }
  
      // Filter out disabled or inactive transactions
      query.disabled = { $ne: true };
      query.is_inactive = { $ne: true };
  
      console.log(query);
  
      // Aggregate query to get transactions with filters, pagination, and sorting
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
          $unwind: "$farmerDetails",
        },
        {
          $unwind: "$villageDetails",
        },
        {
          $unwind: "$hammalDetails",
        },
        {
          $unwind: "$cropDetails",
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
      console.error("Error fetching transaction list:", error);
      next(error); // Handle errors
    }
  },
  update: async (req, res, next) => {
    try {
      const transactionId = req.params.id;
      const data = req.body;
      console.log("Updating Transaction Data:", data);
  
      // Validate required fields (if necessary, otherwise rely on Mongoose validation)
      if (!data.farmer) {
        return res.status(400).json({ error: "Farmer is required." });
      }
      if (!data.village) {
        return res.status(400).json({ error: "Village is required." });
      }
      if (!data.firm_company) {
        return res.status(400).json({ error: "Firm/Company is required." });
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
      if (!data.transactionMode) {
        return res.status(400).json({ error: "Transaction Mode is required." });
      }
      if (!data.totalAmount) {
        return res.status(400).json({ error: "Total Amount is required." });
      }
      if (!data.paidAmount) {
        return res.status(400).json({ error: "Paid Amount is required." });
      }
  
      // Calculate netWeight using the formula: netWeight = boraQuantity * unitBora
      data.netWeight = data.boraQuantity * data.unitBora;
  
      // Calculate remainingAmount: totalAmount - paidAmount - discount (default discount to 0 if not provided)
      data.discount = data.discount || 0;
      data.remainingAmount = data.totalAmount - data.paidAmount - data.discount;
  
      // Find the existing transaction by ID and update with the new data
      const updatedTransaction = await Model.findByIdAndUpdate(
        transactionId,
        { $set: data },
        { new: true, runValidators: true }
      );
  
      if (!updatedTransaction) {
        return res.status(404).json({ error: "Transaction not found." });
      }
  
      // Respond with the updated transaction
      res.status(200).json(updatedTransaction);
    } catch (error) {
      console.error("Error updating Transaction:", error);
      next(createError(500, "Failed to update Transaction.")); // Handle errors and send a 500 response
    }
  },
   delete : async (req, res, next) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        throw createError.BadRequest("Invalid Parameters: Missing ID");
      }
  
      const deleted_at = Date.now();
  
      // Performing a soft delete by marking the Transaction as inactive and setting the deleted_at timestamp
      const result = await Model.updateOne(
        { _id: mongoose.Types.ObjectId(id) },
        { $set: { disabled: true, deleted_at } }
      );
  
      if (result.nModified === 0) {
        throw createError.NotFound("Transaction not found or already deleted");
      }
  
      res.json({ message: "Transaction deleted successfully", result });
    } catch (error) {
      next(error);
    }
  },
   get : async (req, res, next) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        throw createError.BadRequest("Invalid Parameters: Missing ID");
      }
  
      // Finding the Transaction document by its ID
      const result = await Model.findOne({ _id: mongoose.Types.ObjectId(id) });
  
      if (!result) {
        throw createError.NotFound("No Transaction Found");
      }
  
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
  
}
