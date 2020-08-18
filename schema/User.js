var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, default : ''},
    password: { type: String, default : '' },
    socialId: { type: String, default : ''},
    countryCode: { type: String, default : ''},
    countryCodeId: { type: String, default : ''},
    phone: { type: Number, default : ''},
    gender: { type: String, default: ''},
    status: { type: String, enum: ['INACTIVE', 'ACTIVE'], required : true},
    userType: { type: String, enum: ['ADMIN', 'CUSTOMER', 'RESTAURANT', 'DELIVERY_BOY'], required : true},
    loginType: { type: String, enum: ['GENERAL', 'FACEBOOK', 'GOOGLE']},
    profileImage: { type: String, default: '' },
    verifyOtp: { type: String, default: '' },
    lastLogin: { type: Date, default : ''},
    appType: { type: String, enum: ['IOS', 'ANDROID', 'BROWSER'], default : ''},
    deviceToken: { type: String, default: '' },
}, {
    timestamps: true
});

userSchema.pre('save', function(next) {
    let customer = this;
    if (!customer.isModified('password')) {
        return next();
    }

    bcrypt.hash(customer.password, 8, function(err, hash) {
        if (err) {
            return next(err);
        } else {
            if (customer.password !== '') {
                customer.password = hash
            }
            next();
        }
    })
});

module.exports = mongoose.model('User', userSchema);