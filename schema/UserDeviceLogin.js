var mongoose = require('mongoose');

var userDeviceLoginSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userType: { type: String,required: true , enum: ['CUSTOMER', 'RESTAURANT', 'DELIVERY BOY']},
    appType: { type: String,required: true , enum: ['IOS', 'ANDROID', 'BROWSER']},
    pushMode: { type: String,required: true , enum: ['P', 'S']},
    deviceToken: { type: String  }
}, {
    timestamps: true
});

module.exports = mongoose.model('UserDeviceLogin', userDeviceLoginSchema);