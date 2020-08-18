const mongoose = require("mongoose")

const Schema = mongoose.Schema

const mealTypeSchema = new Schema({
    type : {type : String, required : true},
})

module.exports = mongoose.model('MealType', mealTypeSchema)