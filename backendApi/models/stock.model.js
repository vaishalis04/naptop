const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StockSchema = new Schema({
    crop: {
        type: Schema.Types.ObjectId,
        ref: 'Crop',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    warehouse: {
        type: Schema.Types.ObjectId,
        ref: 'Storage',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    logType: {
        type: String,
        enum: ['purchase', 'sale', 'transfer in', 'transfer out'],
    },
    meta_data: {
        type: Schema.Types.Mixed
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    deleted_at: {
        type: Date
    },
    disabled: {
        type: Boolean,
        default: false
    },
    is_inactive: {
        type: Boolean,
        default: false
    },
    restored_at: {
        type: Date
    }
});

// createOrUpdateStock method to create or update stock item
StockSchema.statics.createOrUpdateStock = async function (id, data) {
    try {
        if (id) {
            const result = await this.findByIdAndUpdate(id, data, {
                new: true
            });
            return result;
        }
        const stock = new this(data);
        const result = await stock.save();
        return result;
    }
    catch (error) {
        console.error("Error creating or updating stock item:", error);
        throw error;
    }
}

module.exports = mongoose.model('Stock', StockSchema);
