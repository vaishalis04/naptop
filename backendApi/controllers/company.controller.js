const Model = require("../models/company.model");
const createError = require("http-errors");
const mongoose = require("mongoose");
const ModelName = "Company";
const {
  uploadImage,
} = require("../Helpers/helper_functions");

module.exports = {
    create: async (req, res, next) => {
        try {
            const data = req.body; // Extracting data from request body

            // Check if the name is provided
            if (!data.name) {
                return res.status(400).json({ error: "Company name is required." });
            }

            // Check for duplicate company name
            const existingCompany = await Model.findOne({ name: data.name });
            if (existingCompany) {
                return res.status(400).json({ error: "Company name must be unique." });
            }

            // Assign the `created_by` field from the authenticated user's ID
            if (req.user) {
                data.created_by = req.user.id;
            }

            // Create a new Company instance with the provided data
            const newCompany = new Model(data);

            // Save the new company to the database
            const result = await newCompany.save();

            // Respond with the saved company and a status of 201 (Created)
            res.status(201).json(result);
        } catch (error) {
            console.error("Error saving company:", error);
            next(createError(500, "Failed to save company.")); // Handle errors and send a 500 response
        }
    },

    list: async (req, res, next) => {
        try {
            const { name, disabled, page, limit, order_by, order_in } = req.query;

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

            // Filter by name if provided (case-insensitive)
            if (name) {
                query.name = new RegExp(name, "i");
            }

            query.disabled = { $ne: true };
            query.is_inactive = { $ne: true };

            // Aggregate query to get companies with applied filters, pagination, and sorting
            let result = await Model.aggregate([
                {
                    $match: query, // Apply query filters
                },
                {
                    $sort: sorting, // Apply sorting
                },
                {
                    $skip: _skip, // Skip for pagination
                },
                {
                    $limit: _limit, // Limit for pagination
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
            const { id } = req.params; // Extracting company ID from the request parameters

            if (!id) {
                throw createError.BadRequest("Invalid Parameters: Missing ID");
            }

            const data = req.body; // Extracting the update data from the request body

            if (!data || Object.keys(data).length === 0) {
                throw createError.BadRequest("Invalid Parameters: No data provided");
            }

            data.updated_at = Date.now(); // Updating the 'updated_at' field with the current time

            // Updating the Company document by ID and returning the updated document
            const result = await Model.findByIdAndUpdate(
                id,                    // The Company document ID
                { $set: data },         // Setting the new data
                { new: true }           // Returning the updated document
            );

            if (!result) {
                throw createError.NotFound("Company not found");
            }

            res.json(result); // Sending the updated Company document as a response
        } catch (error) {
            if (error.isJoi === true) error.status = 422; // Handling validation errors
            res.status(error.status || 500).send({
                error: {
                    status: error.status || 500,
                    message: error.message,
                },
            });
        }
    },

    delete: async (req, res, next) => {
        try {
            const { id } = req.params; // Extracting company ID from the request parameters

            if (!id) {
                throw createError.BadRequest("Invalid Parameters: Missing ID");
            }

            const deleted_at = Date.now(); // Setting the current timestamp for the deleted_at field

            // Performing a soft delete by marking the company as inactive and setting the deleted_at timestamp
            const result = await Model.updateOne(
                { _id: mongoose.Types.ObjectId(id) },    // Finding the company by ID
                { $set: { disabled: true, deleted_at } } // Marking as disabled (inactive) and updating deleted_at field
            );

            if (result.nModified === 0) {
                throw createError.NotFound("Company not found or already deleted");
            }

            res.json({ message: "Company deleted successfully", result });
        } catch (error) {
            next(error); // Handling errors and passing them to the error handler
        }
    },

    get: async (req, res, next) => {
        try {
            const { id } = req.params; // Extracting company ID from the request parameters

            if (!id) {
                throw createError.BadRequest("Invalid Parameters: Missing ID");
            }

            // Finding the company document by its ID
            const result = await Model.findOne({ _id: mongoose.Types.ObjectId(id) });

            if (!result) {
                throw createError.NotFound("No Company Found");
            }

            // Sending the found company document as a response
            res.json(result);
        } catch (error) {
            next(error); // Handling any errors that occur
        }
    },
}