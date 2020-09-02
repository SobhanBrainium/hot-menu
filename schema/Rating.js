const mongoose = require("mongoose")

const Schema = mongoose.Schema

const ratingSchema = new Schema({
    customerId : { type : Schema.Types.ObjectId, required : true, ref : 'User'},
    menuId : { type : Schema.Types.ObjectId, required : true, ref : 'RestaurantMenu'},
    rating : {type : String, required : true},
    review : { type : String, default : ''}
},{
    timestamps : true
})

module.exports = mongoose.model("Rating", ratingSchema)