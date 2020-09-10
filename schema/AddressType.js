const mongoose = require("mongoose")

const Schema = mongoose.Schema

const addressTypeSchema = new Schema({
    type : { type : String, required : true},
},{
    timestamps : true
})

module.exports = mongoose.model("AddressType", addressTypeSchema)