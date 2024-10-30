const { ref } = require("@hapi/joi/lib/compile");
const { type } = require("@hapi/joi/lib/extend");
const mongoose = require("mongoose");

const TruckLoadingSchema = new mongoose.Schema({
    transferType: {
        type: String,
        enum: ['Sale', 'Stock Transfer']
    },
    partyName: {
        type: mongoose.Types.ObjectId,
        ref: 'Party',
    },
    vehicleNumber: {
        type: String,
    },
    truck: {
        type: mongoose.Types.ObjectId,
        ref: 'Truck',
    },
    deliveryLocation: {
        type: mongoose.Types.ObjectId,
        ref: 'Delivery',
    },
    assignedHammal: {
        type: mongoose.Types.ObjectId,
        ref: 'Hammal',

    },
    transport:{
        type: mongoose.Types.ObjectId,
        ref: 'Transport',
    },
    storage: {
        type: mongoose.Types.ObjectId,

    },
    boraQuantity: {
        type: Number,
    },
    unitBora: {
        type: Number,
    },
    bardanaType:{
        type: Number,
        enum: [0, 650 , 1000],
    },
    bardanaUnit:{
        type: Number,
    },
    // bardanaBag650g: {
    //     type: Number,
    //     default: 0,
    // },
    // bardanaBag1kg: {
    //     type: Number,
    //     default: 0,
    // },
    netWeight: {
        type: Number,
    },
    rate: {
        type: Number
    },
    amount: {
        type: Number,
    },
    crop: {
        type: mongoose.Types.ObjectId,
        ref: 'Crop',

    },
    other: {
        type: String,
        default: '',
    },
    advance:{
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
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

TruckLoadingSchema.pre('save', function (next) {
    if (this.isModified()) {
        this.updated_at = Date.now();
    }
    next();
});

const TruckLoading = mongoose.model("TruckLoading", TruckLoadingSchema);

module.exports = TruckLoading;
