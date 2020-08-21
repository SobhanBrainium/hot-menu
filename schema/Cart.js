const mongoose = require("mongoose")
const Float = require('mongoose-float').loadType(mongoose, 2)

const Schema = mongoose.Schema

const cartSchema = new Schema({
    customerId : { type : Schema.Types.ObjectId, required : true, ref : 'User'},
    menus : [{
        menuId : {type : Schema.Types.ObjectId, required : true, ref : 'RestaurantMenu'},
        menuAddedDate : {type : Date, default : Date.now()},
        menuAmount : {type : Float, required : true},
        menuQuantity : {type : Number, required : true},
        menuTotal : { type : Float, required : true},
    }],
    cartTotal : {type : Float , required : true, default : 0},
    isCheckout : {type : Number, required : true, default : 1}, // 1 = new item add, 2 = payment done.
    status : {type : String, default : "Y"}
},{
    timestamps : true
})

module.exports = mongoose.model("Cart", cartSchema)