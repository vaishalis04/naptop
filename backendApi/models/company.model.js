
const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Name of the company is required
    },
    created_at: {
        type: Date,
        default: Date.now, // Automatically set the creation date
    },
    created_by: {
        type: mongoose.Types.ObjectId, // Reference to the user who created the company
    },
    updated_at: {
        type: Date,
    },
    deleted_at: {
        type: Date,
    },
    disabled: {
        type: Boolean,
        default: false, // Flag for disabling or soft-deleting the company
    },
    is_inactive: {
        type: Boolean,
        default: false, // Indicates if the company is inactive
    },
});

CompanySchema.pre('save', function(next) {
    if (this.isModified()) {
        this.updated_at = Date.now();
    }
    next();
});

const Company = mongoose.model("Company", CompanySchema);

module.exports = Company;