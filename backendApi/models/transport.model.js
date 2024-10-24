const mongoose = require("mongoose");

const TransportSchema = new mongoose.Schema({
    name: {
        type: String,
    
    },
    
    created_at: {
        type: Date,
        default: Date.now, // Automatically set the creation date
    },
    created_by: {
        type: mongoose.Types.ObjectId, // Reference to the user who created the transport entry
    },
    updated_at: {
        type: Date,
    },
    deleted_at: {
        type: Date,
    },
    disabled: {
        type: Boolean,
        default: false, // Flag for disabling or soft-deleting the transport entry
    },
    is_inactive: {
        type: Boolean,
        default: false, // Indicates if the transport is inactive
    },
});

TransportSchema.pre('save', function(next) {
    if (this.isModified()) {
        this.updated_at = Date.now();
    }
    next();
});

const Transport = mongoose.model("Transport", TransportSchema);

module.exports = Transport;
