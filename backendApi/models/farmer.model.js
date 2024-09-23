const mongoose = require("mongoose");

const FarmerSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    created_by: {
        type: mongoose.Types.ObjectId,
        
    },
    updated_at: {
        type: Date,
    },
    deleted_at: {
        type: Date,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    is_inactive: {
        type: Boolean,
        default: false,
      },
});

FarmerSchema.pre('save', function(next) {
    if (this.isModified()) {
        this.updated_at = Date.now();
    }
    next();
});

const Farmer = mongoose.model("Farmer", FarmerSchema);

module.exports = Farmer;
