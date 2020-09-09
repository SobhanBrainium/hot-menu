'use strict';
var express = require('express');
var bcrypt = require('bcryptjs');
const config = require('../config');

const restaurantValidator = require('../middlewares/validators/restaurant-validator');
const jwtTokenValidator = require('../middlewares/jwt-validation-middlewares');

var jwt = require('jsonwebtoken');

//#region schema
const userSchema = require('../schema/User');
const userDeviceLoginSchema = require('../schema/UserDeviceLogin');
//#endregion

var restaurantApi = express.Router();
restaurantApi.use(express.json());
restaurantApi.use(express.urlencoded({extended: false}));

//#region restaurant login
restaurantApi.post('/login', restaurantValidator.restaurantLogin, async (req, res) => {
    try {
        const getUser = await userSchema.findOne({email : req.body.email, status : "ACTIVE", userType : "RESTAURANT", loginType : "GENERAL" })

        if(getUser){
            const comparePass = bcrypt.compareSync(req.body.password, getUser.password);
            if(comparePass === true){
                const authToken = generateToken(getUser);

                //#region login data enter into db as login session
                var userDeviceData = {
                    userId: getUser._id,
                    userType: "RESTAURANT",
                    appType: req.body.appType,
                    pushMode: req.body.pushMode,
                    deviceToken: req.body.deviceToken
                }
                const loginRecordData = await new userDeviceLoginSchema(userDeviceData).save()
                //#endregion

                //#region update user device toke
                getUser.deviceToken = req.body.deviceToken
                getUser.countryCode = req.body.countryCode
                await getUser.save()
                //#endregion

                const loginId = loginRecordData._id;

                let response = {
                    userDetails: {
                        fullName: getUser.fullName,
                        email: getUser.email,
                        countryCode: getUser.countryCode,
                        countryCodeId : getUser.countryCodeId,
                        phone: getUser.phone.toString(),
                        socialId: getUser.socialId,
                        id: getUser._id,
                        loginId: loginId,
                        profileImage: `${config.serverhost}:${config.port}/img/profile-pic/` + getUser.profileImage,
                        userType: 'RESTAURANT',
                        loginType: req.body.loginType
                    },
                    authToken: authToken
                }

                return res.json({
                    success: true,
                    STATUSCODE: 200,
                    message: 'Login Successful',
                    response_data: response
                })
                //#endregion
            }else{
                return res.json({
                    success: false,
                    STATUSCODE: 422,
                    message: 'Invalid email or password',
                    response_data: {}
                })
            }
        }else{
            return res.json({
                success: false,
                STATUSCODE: 422,
                message: 'Wrong email or password.',
                response_data: {}
            })
        }
        
    } catch (error) {
        console.log(error, 'err')
        return res.json({
            success: false,
            STATUSCODE: 500,
            message: 'Internal DB error',
            response_data: {}
        })
    }
})
//#endregion

function generateToken(userData) {
    let payload = { subject: userData._id, user: 'RESTAURANT' };
    return jwt.sign(payload, config.secretKey, { expiresIn: '3600000h' })
}

module.exports = restaurantApi;