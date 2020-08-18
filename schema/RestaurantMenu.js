const mongoose = require("mongoose")

const Schema = mongoose.Schema

const restaurantMenuSchema = new Schema({
    itemName: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref : "Category" },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, required: true, ref : 'Restaurant' },
    mealTypeId : {type: mongoose.Schema.Types.ObjectId, required: true, ref : 'MealType'},
    type: { type: String, enum: ['VEG', 'NON VEG'] },
    description: { type: String, allow: '' },
    price: { type: Number, required: true },
    offerPrice : {type: Number, required: true},
    waitingTime: { type: Number, required: true },
    menuImage: { type: String, allow: ''},
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true
})

module.exports = mongoose.model('RestaurantMenu', restaurantMenuSchema)