const Model = require("../models/hammals.model");
const createError = require("http-errors");
const mongoose = require("mongoose");
const ModelName = "Hammal";
const {
    uploadImage,
} = require("../Helpers/helper_functions");


module.exports = {
    create: async (req, res, next) => {
        try {
            const data = req.body;

            if (!data.name) {
                return res.status(400).json({ error: "hammal is required." });
            }

            const existingHammal = await Model.findOne({ name: data.name });
            if (existingHammal) {
                return res.status(400).json({ error: "Hammal name must be unique." });
            }

            if (req.user) {
                data.created_by = req.user.id;
            }

            const newHammal = new Model(data);
            const result = await newHammal.save();

            res.status(201).json(result);
        } catch (error) {
            console.error("Error saving hammal:", error);
            next(createError(500, "Failed to save hammal."));
        }
    },

    list: async (req, res, next) => {
        try {
            const { name, disabled, page, limit, order_by, order_in } = req.query;

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

            if (name) {
                query.name = new RegExp(name, "i");
            }

            query.disabled = { $ne: true };

            query.is_inactive = { $ne: true };

            const result = await Model.aggregate([
                { $match: query },
                { $sort: sorting },
                { $skip: _skip },
                { $limit: _limit },
            ]);

            // Count total results for pagination
            const resultCount = await Model.countDocuments(query);

            // Send response with data and pagination metadata
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
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!id) {
                throw createError.BadRequest("Invalid Parameters: Missing ID");
            }

            const data = req.body;

            if (!data || Object.keys(data).length === 0) {
                throw createError.BadRequest("Invalid Parameters: No data provided");
            }

            data.updated_at = Date.now();

            const result = await Model.findByIdAndUpdate(
                id,
                { $set: data },
                { new: true }
            );

            if (!result) {
                throw createError.NotFound("Hammal not found");
            }

            res.json(result);
        } catch (error) {
            if (error.isJoi === true) error.status = 422;
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
            const { id } = req.params;

            if (!id) {
                throw createError.BadRequest("Invalid Parameters: Missing ID");
            }

            const deleted_at = Date.now();

            const result = await Model.updateOne(
                { _id: mongoose.Types.ObjectId(id) },
                { $set: { disabled: true, deleted_at } }
            );

            if (result.nModified === 0) {
                throw createError.NotFound("Hammal not found or already deleted");
            }

            res.json({ message: "Hammal deleted successfully", result });
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

            const result = await Model.findOne({ _id: mongoose.Types.ObjectId(id) });

            if (!result) {
                throw createError.NotFound("No Hammal Found");
            }

            res.json(result);
        } catch (error) {
            next(error);
        }
    }

}