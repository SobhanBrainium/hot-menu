const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userAddressSchema = new Schema({
    userId : {type : Schema.Types.ObjectId, required : true, ref : "User"},
    isDefault : { type : Boolean, default : false},
    fullAddress : { type : String, required : true},
    addressType : {type : Schema.Types.ObjectId, required : true, ref : "AddressType"},
    flatOrHouseOrBuildingOrCompany : {type : String, required : true},
    landmark : {type : String, default : ''},
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number]
        }
    },
},{
    timestamps: true
})

module.exports = mongoose.model("Address", userAddressSchema)