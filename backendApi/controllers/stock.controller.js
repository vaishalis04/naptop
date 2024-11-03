const CropModel = require('../models/crops.model');
const StorageModel = require('../models/storage.model');
const createError = require("http-errors");
const mongoose = require("mongoose");
const Model = require("../models/stock.model");

module.exports = {
    create: async (req, res, next) => {
        try {
            const data = req.body;
            console.log("data", data);

            if (!data.crop) {
                return res.status(400).json({ error: "Crop is required." });
            }

            if (!data.quantity) {
                return res.status(400).json({ error: "Quantity is required." });
            }

            if (!data.warehouse) {
                return res.status(400).json({ error: "Warehouse is required." });
            }

            if (!data.price) {
                return res.status(400).json({ error: "Price is required." });
            }

            const existingCrop = await CropModel.findById(data.crop);
            if (!existingCrop) {
                return res.status(400).json({ error: "Invalid crop ID." });
            }

            const existingWarehouse = await StorageModel.findById(data.warehouse);
            if (!existingWarehouse) {
                return res.status(400).json({ error: "Invalid warehouse ID." });
            }

            const newStock = new Model(data);
            const result = await newStock.save();
            res.status(201).json(result);
        } catch (error) {
            console.error("Error saving stock item:", error);
            next(createError(500, "Failed to save stock item."));
        }
    },

    list: async (req, res, next) => {
        try {
            const { crop, warehouse, page, limit, order_by, order_in } = req.query;

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

            if (crop) {
                query.crop = crop;
            }

            if (warehouse) {
                query.warehouse = warehouse;
            }

            query.disabled = { $ne: true };
            query.is_inactive = { $ne: true };

            const result = await Model.find(query)
                .sort(sorting)
                .skip(_skip)
                .limit(_limit)
                .populate("crop")
                .populate("warehouse");

            const total = await Model.countDocuments(query);

            res.json({
                data: result,
                meta: {
                current_page: _page,
                from: _skip + 1,
                last_page: Math.ceil(total / _limit),
                per_page: _limit,
                to: _skip + result.length,
                total: total,
                },
            });
        } catch (error) {
            console.error("Error fetching stock items:", error);
            next(createError(500, "Failed to fetch stock items."));
        }
    },

    warehouseStockCropWise: async (req, res, next) => {
        try {
            const { warehouse } = req.query;
            if (!warehouse) {
                return res.status(400).json({ error: "Warehouse is required." });
            }

            const query = {
                warehouse: mongoose.Types.ObjectId(warehouse),
                disabled: { $ne: true },
                is_inactive: { $ne: true },
            };

            const result = await Model.aggregate([
                { $match: query },
                // Group by crop and sum the quantity for logType 'purchase' and 'transfer in' subtracting the quantity for logType 'sale' and 'transfer out'
                {
                    $group: {
                        _id: "$crop",
                        quantity: {
                            $sum: {
                                $cond: [
                                    { $in: ["$logType", ["purchase", "transfer in"]] },
                                    "$quantity",
                                    { $cond: [{ $in: ["$logType", ["sale", "transfer out"]] }, { $subtract: [0, "$quantity"] }, 0] }
                                ]
                            }
                        },
                        averagePrice: { $avg: "$price" },
                        bag_units: { $push: "$bag_units" }
                    }
                },
                // Populate crop details
                {
                    $lookup: {
                        from: "crops",
                        localField: "_id",
                        foreignField: "_id",
                        as: "crop"
                    }
                },
                { $unwind: "$crop" },
                // Project required fields
                {
                    $project: {
                        _id: 0,
                        crop_id: "$crop._id",
                        crop: "$crop.name",
                        quantity: 1,
                        averagePrice: 1,
                        bag_units: 1
                    }
                }
            ]);

            res.json(result);
        } catch (error) {
            console.error("Error fetching warehouse stock crop-wise:", error);
            next(createError(500, "Failed to fetch warehouse stock crop-wise."));
        }
    },

    get: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: "Invalid stock ID." });
            }

            const result = await Model.findById(id).populate("crop").populate("warehouse");

            if (!result) {
                return res.status(404).json({ error: "Stock item not found." });
            }

            res.json(result);
        } catch (error) {
            console.error("Error fetching stock item:", error);
            next(createError(500, "Failed to fetch stock item."));
        }
    },

    update: async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = req.body;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: "Invalid stock ID." });
            }

            if (data.crop) {
                const existingCrop = await CropModel.findById(data.crop);
                if (!existingCrop) {
                    return res.status(400).json({ error: "Invalid crop ID." });
                }
            }

            if (data.warehouse) {
                const existingWarehouse = await StorageModel.findById(data.warehouse);
                if (!existingWarehouse) {
                    return res.status(400).json({ error: "Invalid warehouse ID." });
                }
            }

            const result = await Model.findByIdAndUpdate(id, data, { new: true });

            if (!result) {
                return res.status(404).json({ error: "Stock item not found." });
            }

            res.json(result);
        } catch (error) {
            console.error("Error updating stock item:", error);
            next(createError(500, "Failed to update stock item."));
        }
    },

    delete: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: "Invalid stock ID." });
            }

            const deleted_at = Date.now();

            const result = await Model.updateOne(
                { _id: mongoose.Types.ObjectId(id) },
                { $set: { disabled: true, deleted_at } }
            );

            if (!result) {
                return res.status(404).json({ error: "Stock item not found." });
            }

            res.json({ message: "Stock item deleted successfully." });

        } catch (error) {
            console.error("Error deleting stock item:", error);
            next(createError(500, "Failed to delete stock item."));
        }
    },

    restore: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: "Invalid stock ID." });
            }

            const restored_at = Date.now();

            const result = await Model.updateOne(
                { _id: mongoose.Types.ObjectId(id) },
                { $set: { disabled: false, restored_at } }
            );

            if (!result) {
                return res.status(404).json({ error: "Stock item not found." });
            }

            res.json({ message: "Stock item restored successfully." });

        } catch (error) {
            console.error("Error restoring stock item:", error);
            next(createError(500, "Failed to restore stock item."));
        }
    },
};