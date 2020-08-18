const { required } = require("@hapi/joi");

const mongoose = require('mongoose');

const Schema = mongoose.Schema

const favoriteMenuSchema = new Schema({
    customerId : {type : Schema.Types.ObjectId, required : true, ref : "User"},
    menuId : {type : Schema.Types.ObjectId, required : true, ref : "RestaurantMenu"}
}, {
    timestamps : true
})


module.exports = mongoose.model('FavoriteMenu', favoriteMenuSchema)