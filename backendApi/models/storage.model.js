const mongoose = require("mongoose");

const StorageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Title or name of the storage item is required
    },
    created_at: {
        type: Date,
        default: Date.now, // Automatically set the creation date
    },
    created_by: {
        type: mongoose.Types.ObjectId, // Reference to the user who created the storage item
    },
    updated_at: {
        type: Date,
    },
    deleted_at: {
        type: Date,
    },
    disabled: {
        type: Boolean,
        default: false, // Flag for disabling or soft-deleting the storage item
    },
    is_inactive: {
        type: Boolean,
        default: false, // Flag to mark the item as inactive
    },
});

// Middleware to update the updated_at field before saving
StorageSchema.pre('save', function(next) {
    if (this.isModified()) {
        this.updated_at = Date.now();
    }
    next();
});

const Storage = mongoose.model("Storage", StorageSchema);

module.exports = Storage;
