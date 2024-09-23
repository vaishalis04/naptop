const { ref } = require("@hapi/joi/lib/compile");
const mongoose = require("mongoose");

const TaulParchiSchema = new mongoose.Schema({
    farmer: {
        type: mongoose.Types.ObjectId,
        ref:'farmers'      
    },
    village: {
        type: mongoose.Types.ObjectId, 
        ref:'villages'       
    },
    firm_company: {
        type: String,     
    },
    rate: {
        type: Number,    
    },
    hammal: {
        type: mongoose.Types.ObjectId,
        ref:'hammals'
    },
    boraQuantity: {
        type: Number,   
    },
    unitBora: {
        type: Number,   
    },
    bharti: {
        type: Number,  
    },
    netWeight:{
        type: Number,
    },
    crop: {
        type: mongoose.Types.ObjectId,  
        ref:'crop'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    created_by: {
        type: mongoose.Types.ObjectId,     
    },
    updated_at: {
        type: Date
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
    }
});

TaulParchiSchema.pre('save', function(next) {
    if (this.isModified()) {
        this.updated_at = Date.now();
    }
    next();
});

const TaulParchi = mongoose.model("TaulParchi", TaulParchiSchema);

module.exports = TaulParchi;
