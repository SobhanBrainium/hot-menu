const mongoose = require("mongoose")
const { schema } = require("./User")
const Float = require('mongoose-float').loadType(mongoose, 2)

const Schema = mongoose.Schema

const orderSchema = new Schema({
    orderNo : {type : String, required : true},
    customerId : {type : Schema.Types.ObjectId, required : true, ref : "User"},
    cartId : {type : Schema.Types.ObjectId, required : true, ref : "Cart"},
    paymentInfo : {
        paymentStatus : {type : String, required : true},
        paymentId : { type : String, required : true}
    },
    promoCodeId : {type : Schema.Types.ObjectId, default : null},
    finalAmount : { type : Float, required : true },
    orderStatus : { type : Number, required : true, default : 0}, //0 = order initiate, 1 = order picked up from restaurant, 2 = delivered order, 3 = cancel order
    orderLog : [{
        logDetail : {type : String, required : true},
        logTime : {type : Date, default : Date.now()}
    }]
},{
    timestamps : true
})

module.exports = mongoose.model('Order', orderSchema)