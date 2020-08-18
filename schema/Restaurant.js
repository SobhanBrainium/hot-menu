const mongoose = require('mongoose');

const Schema = mongoose.Schema

const restaurantSchema = new Schema({
    restaurantName: { type: String, required: true },
    description: { type: String},
    contactEmail: { type: String, email: true, unique: true },
    countryCode: { type: String, default : '' },
    contactPhone: { type: Number, unique: true },
    logo: { type: String, default : '' },
    banner: { type: String, default : '' },
    rating: { type: Number, default: 0 },
    licenceImage: { type: String, default: ''},
    address: { type: String, default: ''},
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number]
        }
    },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true
})

restaurantSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('Restaurant', restaurantSchema)