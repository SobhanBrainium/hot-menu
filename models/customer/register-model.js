var jwt = require('jsonwebtoken');
var userSchema = require('../../schema/User');
var userDeviceLoginSchema = require('../../schema/UserDeviceLogin');
const Restaurant = require('../../schema/Restaurant')
const Category = require('../../schema/Category')
const RestaurantMenu = require('../../schema/RestaurantMenu')
const FavoriteMenu = require('../../schema/FavoriteMenu')
const config = require('../../config');
const mail = require('../../modules/sendEmail');
var bcrypt = require('bcryptjs');

const OTPLog = require("../../schema/OTPLog")
const MealType = require("../../schema/MealType")

module.exports = {
    //Customer 
    customerRegistration: (req, callBack) => {
        if (req) {
            var data = req.body;
            var customerExistCheck = {};
            var socialSignup = 0
            if (data.socialId != '') {
                socialSignup = 1;
                customerExistCheck = { socialId: data.socialId };
            } else {
                customerExistCheck = { email: data.email, loginType: 'GENERAL' };
            }
            /** Check for customer existence */
            userSchema.countDocuments(customerExistCheck).exec(function (err, count) {
                if (err) {
                    console.log(err);
                    callBack({
                        success: false,
                        STATUSCODE: 500,
                        message: 'Internal DB error',
                        response_data: {}
                    });
                } if (count) {
                    // console.log(count);

                    if (socialSignup == 1) {
                        callBack({
                            success: false,
                            STATUSCODE: 422,
                            message: 'User already exists for this information.',
                            response_data: {}
                        });
                    } else {
                        callBack({
                            success: false,
                            STATUSCODE: 422,
                            message: 'User already exists for this email',
                            response_data: {}
                        });
                    }

                } else {
                    if (data.socialId != '') {
                        socialSignup = 1;
                        customerExistCheck = { socialId: data.socialId };
                    } else {
                        socialSignup = 0;
                        customerExistCheck = { phone: data.phone, loginType: 'GENERAL' };
                    }
                    userSchema.countDocuments(customerExistCheck).exec(async function (err, count) {
                        if (err) {
                            console.log(err);
                            nextCb(null, {
                                success: false,
                                STATUSCODE: 500,
                                message: 'Internal DB error',
                                response_data: {}
                            });

                        } if (count) {
                            callBack({
                                success: false,
                                STATUSCODE: 422,
                                message: 'User already exists for this phone',
                                response_data: {}
                            });
                        } else {

                            var customerdata = {
                                fullName: data.fullName,
                                email: data.email,
                                password: data.password,
                                socialId: data.socialId,
                                countryCode: data.countryCode,
                                countryCodeId : data.countryCodeId,
                                phone: data.phone,
                                userType: 'CUSTOMER',
                                loginType: data.loginType,
                                deviceToken : data.deviceToken,
                                appType : data.appType
                            };

                            if (socialSignup == 1) {
                                customerdata.status = 'ACTIVE';
                            } else {
                                customerdata.status = 'INACTIVE';
                            }

                            new userSchema(customerdata).save(async function (err, result) {
                                if (err) {
                                    console.log(err);
                                    callBack({
                                        success: false,
                                        STATUSCODE: 500,
                                        message: 'Internal DB error',
                                        response_data: {}
                                    });
                                } else {
                                    if (socialSignup == 1) { //IF SOCIAL THEN NO VERIFICATION

                                        mail('userRegistrationMail')(data.email, {}).send();

                                        //ADD DATA IN USER LOGIN DEVICE TABLE
                                        var userDeviceData = {
                                            userId: result._id,
                                            userType: 'CUSTOMER',
                                            appType: data.appType,
                                            pushMode: data.pushMode,
                                            deviceToken: data.deviceToken
                                        }
                                        new userDeviceLoginSchema(userDeviceData).save(async function (err, success) {
                                            if (err) {
                                                console.log(err);
                                                nextCb(null, {
                                                    success: false,
                                                    STATUSCODE: 500,
                                                    message: 'Internal DB error',
                                                    response_data: {}
                                                });
                                            } else {

                                                //#region Image Upload for social
                                                if(data.image != '' || data.image != undefined){
                                                    const download = require('image-downloader')

                                                    // Download to a directory and save with the original filename
                                                    const options = {
                                                        url: data.image,
                                                        dest: `public/img/profile-pic/`   // Save to /path/to/dest/image.jpg
                                                    }

                                                    const FileType = require('file-type');

                                                    download.image(options)
                                                    .then(({ filename, image }) => {
                                                        (async () => {
                                                            var fileInfo = await FileType.fromFile(filename);
                                                            var fileExt = fileInfo.ext;

                                                            var fs = require('fs');

                                                            var file_name = `customerimage-${Math.floor(Math.random() * 1000)}-${Math.floor(Date.now() / 1000)}.${fileExt}`;

                                                            let image_path = `public/img/profile-pic/${file_name}`;

                                                            fs.rename(filename, image_path, function (err) { //RENAME THE FILE
                                                                if (err) console.log('ERROR: ' + err);
                                                            })

                                                            //#region update profile image of registered customer
                                                            const updateCustomerProfileImage = await userSchema.findByIdAndUpdate(result._id,{
                                                                profileImage : file_name
                                                            })
                                                            //#endregion

                                                            if(updateCustomerProfileImage){
                                                                var loginId = success._id;

                                                                const authToken = generateToken(result);
                                                                let response = {
                                                                    userDetails: {
                                                                        fullName: result.fullName,
                                                                        email: result.email,
                                                                        countryCode: result.countryCode,
                                                                        phone: result.phone.toString(),
                                                                        socialId: result.socialId,
                                                                        customerId: result._id,
                                                                        loginId: loginId,
                                                                        profileImage: `${config.serverhost}:${config.port}/img/profile-pic/` + file_name,
                                                                        userType: 'CUSTOMER',
                                                                        loginType: data.loginType
                                                                    },
                                                                    authToken: authToken
                                                                }

                                                                callBack({
                                                                    success: true,
                                                                    STATUSCODE: 200,
                                                                    message: 'User registered successfully.',
                                                                    response_data: response
                                                                })
                                                            }

                                                        })();
                                                    })
                                                }
                                                //#endregion
                                            }
                                        });

                                    } else {
                                        //#region image upload
                                        if(req.files != null){
                                            //Get image extension
                                            var ext = getExtension(req.files.image.name);

                                            // The name of the input field (i.e. "image") is used to retrieve the uploaded file
                                            let sampleFile = req.files.image;

                                            var file_name = `customerimage-${Math.floor(Math.random() * 1000)}${Math.floor(Date.now() / 1000)}.${ext}`;

                                            result.profileImage = file_name

                                            // Use the mv() method to place the file somewhere on your server
                                            sampleFile.mv(`public/img/profile-pic/${file_name}`, async function (err) {
                                                if (err) {
                                                    console.log(err);
                                                    callBack({
                                                        success: false,
                                                        STATUSCODE: 500,
                                                        message: 'Internal error',
                                                        response_data: {}
                                                    });
                                                } else {
                                                    //#region update profile image of registered customer
                                                    const updateCustomerProfileImage = await userSchema.findByIdAndUpdate(result._id,{
                                                        profileImage : file_name
                                                    })
                                                    //#endregion
                                                }
                                            });
                                        }
                                        
                                        //#endregion

                                        //ADD DATA IN USER LOGIN DEVICE TABLE
                                        var userDeviceData = {
                                            userId: result._id,
                                            userType: 'CUSTOMER',
                                            appType: data.appType,
                                            pushMode: data.pushMode,
                                            deviceToken: data.deviceToken
                                        }

                                        const success = new userDeviceLoginSchema(userDeviceData).save() 

                                        var loginId = success._id;

                                        const authToken = generateToken(result);
                                        const userOtp = await sendVerificationCode(result);

                                        //#region Sent user OTP to email
                                        let generateRegisterOTP = generateOTP()
                                        if(generateRegisterOTP != ''){
                                            //#region save OTP to DB
                                            const addedOTPToTable = new OTPLog({
                                                userId : result._id,
                                                email : result.email,
                                                otp : generateRegisterOTP,
                                                usedFor : "Registration",
                                                status : 1
                                            })
                                            const savetoDB = await addedOTPToTable.save()
                                            //#endregion
                                        }
                                        //#endregion

                                        let response = {
                                            userDetails: {
                                                fullName: result.fullName,
                                                email: result.email,
                                                countryCode: result.countryCode,
                                                countryCodeId : result.countryCodeId,
                                                phone: result.phone.toString(),
                                                socialId: result.socialId,
                                                customerId: result._id,
                                                loginId: loginId,
                                                profileImage: `${config.serverhost}:${config.port}/img/profile-pic/` + result.profileImage,
                                                userType: 'CUSTOMER',
                                                loginType: data.loginType,
                                                sid: userOtp.serviceSid,
                                                otp : generateRegisterOTP
                                            },
                                            authToken: authToken
                                        }

                                        // var resUser = {
                                        //     userId: result._id,
                                        //     sid: userOtp.serviceSid
                                        // }


                                        var verifyMsg = 'Please check your phone. We have sent a code to be used to verify your account.';

                                        /** Send Registration Email */
                                        mail('sendOTPdMail')(response.userDetails.email, response.userDetails).send();

                                        callBack({
                                            success: true,
                                            STATUSCODE: 200,
                                            message: verifyMsg,
                                            response_data: response
                                        });
                                    }

                                }
                            });

                        }
                    });
                }
            });


        }
    },

    sendVerificationCode: (req, callBack) => {
        if (req) {
            var data = req.body;

            var userId = data.userId;

            userSchema.findOne({ _id: userId })
                .then(async (customer) => {

                    if (customer != null) {

                        var userOtp = await sendVerificationCode(customer);

                        var resUser = {
                            userId: customer._id,
                            sid: userOtp.serviceSid,
                        }


                        var verifyMsg = 'Please check your phone. We have sent a code to be used to verify your account.';


                        callBack({
                            success: true,
                            STATUSCODE: 200,
                            message: verifyMsg,
                            response_data: resUser
                        });

                    } else {
                        callBack({
                            success: false,
                            STATUSCODE: 422,
                            message: 'User not found.',
                            response_data: {}
                        });
                    }

                });
        }
    },

    verifyUser: (req, callBack) => {
        if (req) {
            const data = req.body;
            const userId = data.userId;
            const otp = data.verificationCode;

            userSchema.findOne({ _id: userId })
                .then(async (customer) => {
                    if (customer != null) {
                        var sid = data.sid;
                        if ((sid == '1234') && (config.twilio.testMode == 'YES')) {
                            //#region OTP checking
                            const isChecked = await OTPLog.findOne({userId : userId, otp : otp, status : 1})
                            if(isChecked != null){
                                //deactivate the OTP with status  2
                                isChecked.status = 2;
                                await isChecked.save();
                
                                let finalResponse = {}
                
                                if(isChecked.usedFor == 'Registration'){
                                    var userResp = await userSchema.updateOne({ _id: userId }, { $set: { status: 'ACTIVE' } });

                                    mail('userRegistrationMail')(customer.email, {}).send();
                                    //ADD DATA IN USER LOGIN DEVICE TABLE
                                    var userDeviceData = {
                                        userId: userId,
                                        userType: 'CUSTOMER',
                                        appType: data.appType,
                                        pushMode: data.pushMode,
                                        deviceToken: data.deviceToken
                                    }
                                    new userDeviceLoginSchema(userDeviceData).save(async function (err, success) {
                                        if (err) {
                                            console.log(err);
                                            nextCb(null, {
                                                success: false,
                                                STATUSCODE: 500,
                                                message: 'Internal DB error',
                                                response_data: {}
                                            });
                                        } else {
                                            var loginId = success._id;

                                            const authToken = generateToken(customer);
                                            let response = {
                                                userDetails: {
                                                    fullName: customer.fullName,
                                                    email: customer.email,
                                                    countryCode: customer.countryCode,
                                                    phone: customer.phone.toString(),
                                                    socialId: customer.socialId,
                                                    customerId: customer._id,
                                                    loginId: loginId,
                                                    profileImage: `${config.serverhost}:${config.port}/img/profile-pic/` + customer.profileImage,
                                                    userType: 'CUSTOMER',
                                                    loginType: customer.loginType
                                                },
                                                authToken: authToken
                                            }

                                            callBack({
                                                success: true,
                                                STATUSCODE: 200,
                                                message: 'User verified successfully.',
                                                response_data: response
                                            })


                                        }
                                    })
                                }else{
                                    callBack({
                                        success: true,
                                        STATUSCODE: 200,
                                        message: 'OTP verification successfully.',
                                        response_data: finalResponse
                                    })
                                }
                            }else{
                                callBack({
                                    success: false,
                                    STATUSCODE: 300,
                                    message: 'OTP does not matched.',
                                    response_data: {}
                                })
                            }
                            //#endregion
                        } else {

                            const Cryptr = require('cryptr');
                            const cryptr = new Cryptr('HOTMENU');

                            const accountSid = cryptr.decrypt(config.twilio.TWILIO_SID);
                            const authToken = config.twilio.TWILIO_AUTHTOKEN;

                            const client = require('twilio')(accountSid, authToken);
                            var code = data.verificationCode;
                            var phoneNo = `${customer.countryCode}${customer.phone}`;

                            client.verify.services(sid)
                                .verificationChecks
                                .create({ to: phoneNo, code: code })
                                .then(async function (verification_check) {
                                    if (verification_check.status == 'approved') {

                                        var userResp = await userSchema.updateOne({ _id: userId }, { $set: { status: 'ACTIVE' } });


                                        mail('userRegistrationMail')(customer.email, {}).send();
                                        //ADD DATA IN USER LOGIN DEVICE TABLE
                                        var userDeviceData = {
                                            userId: userId,
                                            userType: 'CUSTOMER',
                                            appType: data.appType,
                                            pushMode: data.pushMode,
                                            deviceToken: data.deviceToken
                                        }
                                        new userDeviceLoginSchema(userDeviceData).save(async function (err, success) {
                                            if (err) {
                                                console.log(err);
                                                nextCb(null, {
                                                    success: false,
                                                    STATUSCODE: 500,
                                                    message: 'Internal DB error',
                                                    response_data: {}
                                                });
                                            } else {
                                                var loginId = success._id;

                                                const authToken = generateToken(customer);
                                                let response = {
                                                    userDetails: {
                                                        fullName: customer.fullName,
                                                        email: customer.email,
                                                        countryCode: customer.countryCode,
                                                        phone: customer.phone.toString(),
                                                        socialId: customer.socialId,
                                                        customerId: customer._id,
                                                        loginId: loginId,
                                                        profileImage: `${config.serverhost}:${config.port}/img/profile-pic/` + customer.profileImage,
                                                        userType: 'CUSTOMER',
                                                        loginType: customer.loginType
                                                    },
                                                    authToken: authToken
                                                }

                                                callBack({
                                                    success: true,
                                                    STATUSCODE: 200,
                                                    message: 'User verified successfully.',
                                                    response_data: response
                                                })


                                            }
                                        })
                                    } else {
                                        callBack({
                                            success: false,
                                            STATUSCODE: 422,
                                            message: 'Invalid verification code.',
                                            response_data: {}
                                        })

                                    }

                                })
                                .catch(function (err) {
                                    console.log(err);
                                    callBack({
                                        success: false,
                                        STATUSCODE: 500,
                                        message: 'Something went wrong.',
                                        response_data: {}
                                    })
                                });

                        }
                    } else {
                        callBack({
                            success: false,
                            STATUSCODE: 422,
                            message: 'User not found.',
                            response_data: {}
                        });
                    }

                });






        }
    },
    customerLogin: (req, callBack) => {
        if (req) {
            var data = req.body;
            console.log(data,'data')
            var loginUser = '';
            var loginErrMsg = '';


            if (data.loginType != 'GENERAL') {
                loginUser = 'SOCIAL';
                var loginCond = { socialId: data.user };
                loginErrMsg = 'Invalid login credentials'
            } else {
                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.user)) {
                    var loginCond = { email: data.user, loginType: 'GENERAL' };
                    loginUser = 'EMAIL';
                    loginErrMsg = 'Invalid email or password'
                } else {
                    var loginCond = { phone: data.user, loginType: 'GENERAL' };
                    loginUser = 'PHONE';
                    loginErrMsg = 'Invalid phone or password'
                }
            }

            userSchema.findOne(loginCond, async function (err, result) {

                if (err) {
                    callBack({
                        success: false,
                        STATUSCODE: 500,
                        message: 'Internal DB error',
                        response_data: {}
                    });
                } else {
                    if (result) {

                        if (result.status != 'INACTIVE') {
                            var userType = 'CUSTOMER'

                            //ADD DATA IN USER LOGIN DEVICE TABLE
                            var userDeviceData = {
                                userId: result._id,
                                userType: userType,
                                appType: data.appType,
                                pushMode: data.pushMode,
                                deviceToken: data.deviceToken
                            }
                            new userDeviceLoginSchema(userDeviceData).save(async function (err, success) {
                                if (err) {
                                    console.log(err);
                                    nextCb(null, {
                                        success: false,
                                        STATUSCODE: 500,
                                        message: 'Internal DB error',
                                        response_data: {}
                                    });
                                } else {
                                    var loginId = success._id;
                                    if (loginUser == 'SOCIAL') { //IF SOCIAL LOGIN THEN NO NEED TO CHECK THE PASSWORD 
                                        const authToken = generateToken(result);
                                        let response = {
                                            userDetails: {
                                                fullName: result.fullName,
                                                email: result.email,
                                                countryCode: result.countryCode,
                                                countryCodeId : result.countryCodeId,
                                                phone: result.phone.toString(),
                                                socialId: result.socialId,
                                                customerId: result._id,
                                                loginId: loginId,
                                                profileImage: `${config.serverhost}:${config.port}/img/profile-pic/` + result.profileImage,
                                                userType: 'CUSTOMER',
                                                loginType: data.loginType
                                            },
                                            authToken: authToken
                                        }

                                        callBack({
                                            success: true,
                                            STATUSCODE: 200,
                                            message: 'Login Successful',
                                            response_data: response
                                        })

                                    } else { //NORMAL LOGIN
                                        //  console.log('hello');
                                        if ((data.password == '') || (data.password == undefined)) {
                                            callBack({
                                                success: false,
                                                STATUSCODE: 422,
                                                message: 'Password is required',
                                                response_data: {}
                                            });
                                        } else {
                                            const comparePass = bcrypt.compareSync(data.password, result.password);
                                            if (comparePass) {
                                                const authToken = generateToken(result);
                                                let response = {
                                                    userDetails: {
                                                        fullName: result.fullName,
                                                        email: result.email,
                                                        countryCode: result.countryCode,
                                                        countryCodeId : result.countryCodeId,
                                                        phone: result.phone.toString(),
                                                        socialId: result.socialId,
                                                        customerId: result._id,
                                                        loginId: loginId,
                                                        profileImage: `${config.serverhost}:${config.port}/img/profile-pic/` + result.profileImage,
                                                        userType: 'CUSTOMER',
                                                        loginType: data.loginType
                                                    },
                                                    authToken: authToken
                                                }

                                                callBack({
                                                    success: true,
                                                    STATUSCODE: 200,
                                                    message: 'Login Successful',
                                                    response_data: response
                                                })

                                            } else {
                                                callBack({
                                                    success: false,
                                                    STATUSCODE: 422,
                                                    message: loginErrMsg,
                                                    response_data: {}
                                                });
                                            }
                                        }
                                    }
                                }
                            })
                        } else {

                            var userOtp = await sendVerificationCode(result);

                            // var resUser = {
                            //     userId: result._id,
                            //     sid: userOtp.serviceSid
                            // }


                            var verifyMsg = 'Please check your phone. We have sent a code to be used to verify your account.';

                            let response = {
                                                    userDetails: {
                                                        fullName: result.fullName,
                                                        email: result.email,
                                                        countryCode: result.countryCode,
                                                        countryCodeId : result.countryCodeId,
                                                        phone: result.phone.toString(),
                                                        socialId: result.socialId,
                                                        customerId: result._id,
                                                        loginId: '',
                                                        profileImage: `${config.serverhost}:${config.port}/img/profile-pic/` + result.profileImage,
                                                        userType: 'CUSTOMER',
                                                        loginType: data.loginType
                                                    },
                                                    authToken: '',
                                                    userId: result._id,
                                                    sid: userOtp.serviceSid
                                                }


                            callBack({
                                success: false,
                                STATUSCODE: 410,
                                message: verifyMsg,
                                response_data: response
                            });
                        }

                    } else {
                        if ((data.loginType != 'GENERAL') && (loginUser == 'SOCIAL')) {
                            callBack({
                                success: true,
                                STATUSCODE: 201,
                                message: 'New User',
                                response_data: {}
                            });
                        } else {

                            callBack({
                                success: false,
                                STATUSCODE: 422,
                                message: loginErrMsg,
                                response_data: {}
                            });
                        }

                    }
                }
            })
        }
    },
    customerForgotPassword: (req, callBack) => {
        if (req) {
            var data = req.body;
            userSchema.findOne({ email: data.email, userType: data.userType, loginType: 'GENERAL' }, async function (err, customer) {
                if (err) {
                    callBack({
                        success: false,
                        STATUSCODE: 500,
                        message: 'Internal DB error',
                        response_data: {}
                    });
                } else {
                    if (customer) {
                        let forgotPasswordOtp = Math.random().toString().replace('0.', '').substr(0, 6);
                        customer = customer.toObject();
                        customer.forgotPasswordOtp = forgotPasswordOtp;

                        //#region Sent user OTP to email
                        let generateForgotPasswordOTP = generateOTP()
                        if(generateForgotPasswordOTP != ''){
                            //#region save OTP to DB
                            const addedOTPToTable = new OTPLog({
                                userId : customer._id,
                                email : customer.email,
                                otp : generateForgotPasswordOTP,
                                usedFor : "ForgotPassword",
                                status : 1
                            })
                            const savetoDB = await addedOTPToTable.save()
                            //#endregion
                        }
                        //#endregion

                        try {
                            mail('forgotPasswordMail')(customer.email, customer).send();
                            console.log('done');
                            callBack({
                                success: true,
                                STATUSCODE: 200,
                                message: 'Please check your email. We have sent a code to be used to reset password.',
                                response_data: {
                                    email: customer.email,
                                    forgotPassOtp: forgotPasswordOtp
                                }
                            });
                        } catch (Error) {
                            console.log(Error);
                            callBack({
                                success: false,
                                STATUSCODE: 500,
                                message: 'Something went wrong while sending email',
                                response_data: {}
                            });
                        }
                    } else {
                        callBack({
                            success: false,
                            STATUSCODE: 422,
                            message: 'User not found',
                            response_data: {}
                        });
                    }
                }
            })
        }
    },
    customerResetPassword: (req, callBack) => {
        if (req) {
            var data = req.body;
            userSchema.findOne({ email: data.email, userType: data.userType, loginType: 'GENERAL' }, function (err, customer) {
                if (err) {
                    callBack({
                        success: false,
                        STATUSCODE: 500,
                        message: 'Internal DB error',
                        response_data: {}
                    });
                } else {
                    if (customer) {
                        bcrypt.hash(data.password, 8, function (err, hash) {
                            if (err) {
                                callBack({
                                    success: false,
                                    STATUSCODE: 500,
                                    message: 'Something went wrong while setting the password',
                                    response_data: {}
                                });
                            } else {
                                userSchema.updateOne({ _id: customer._id }, {
                                    $set: {
                                        password: hash
                                    }
                                }, function (err, res) {
                                    if (err) {
                                        callBack({
                                            success: false,
                                            STATUSCODE: 500,
                                            message: 'Internal DB error',
                                            response_data: {}
                                        });
                                    } else {
                                        callBack({
                                            success: true,
                                            STATUSCODE: 200,
                                            message: 'Password updated successfully',
                                            response_data: {}
                                        });

                                    }
                                })
                            }
                        })
                    } else {
                        callBack({
                            success: false,
                            STATUSCODE: 422,
                            message: 'User not found',
                            response_data: {}
                        });
                    }
                }
            })
        }
    },
    customerResendForgotPasswordOtp: (req, callBack) => {
        if (req) {
            var data = req.body;
            userSchema.findOne({ email: data.email, userType: data.userType, loginType: 'GENERAL' }, function (err, customer) {
                if (err) {
                    callBack({
                        success: false,
                        STATUSCODE: 500,
                        message: 'Internal DB error',
                        response_data: {}
                    });
                } else {
                    if (customer) {
                        let forgotPasswordOtp = Math.random().toString().replace('0.', '').substr(0, 6);
                        customer = customer.toObject();
                        customer.forgotPasswordOtp = forgotPasswordOtp;
                        try {
                            mail('forgotPasswordMail')(customer.email, customer).send();
                            callBack({
                                success: true,
                                STATUSCODE: 200,
                                message: 'Please check your email. We have sent a code to be used to reset password.',
                                response_data: {
                                    email: customer.email,
                                    forgotPassOtp: forgotPasswordOtp
                                }
                            });
                        } catch (Error) {
                            console.log(Error);
                            callBack({
                                success: false,
                                STATUSCODE: 500,
                                message: 'Something went wrong while sending email',
                                response_data: {}
                            });
                        }
                    } else {
                        callBack({
                            success: false,
                            STATUSCODE: 422,
                            message: 'User not found',
                            response_data: {}
                        });
                    }
                }
            })
        }
    },
    customerViewProfile: (req, callBack) => {
        if (req) {

            var data = req.body;

            userSchema.findOne({ _id: data.customerId }, function (err, result) {
                if (err) {
                    callBack({
                        success: false,
                        STATUSCODE: 500,
                        message: 'Internal DB error',
                        response_data: {}
                    });
                } else {
                    if (result) {

                        let response = {
                            userDetails: {
                                fullName: result.fullName,
                                email: result.email,
                                countryCode: result.countryCode,
                                countryCodeId : result.countryCodeId,
                                phone: result.phone.toString(),
                                socialId: result.socialId,
                                customerId: result._id,
                                loginId: data.loginId,
                                userType: 'CUSTOMER',
                                loginType: result.loginType
                            },
                            authToken: ''
                        }

                        if (result.profileImage != '') {
                            response.userDetails.profileImage = `${config.serverhost}:${config.port}/img/profile-pic/` + result.profileImage
                        } else {
                            response.userDetails.profileImage = ''
                        }
                        callBack({
                            success: true,
                            STATUSCODE: 200,
                            message: 'User profile fetched successfully',
                            response_data: response
                        })

                    } else {
                        callBack({
                            success: false,
                            STATUSCODE: 422,
                            message: 'User not found',
                            response_data: {}
                        });
                    }
                }
            });

        }
    },
    customerEditProfile: (req, callBack) => {
        if (req) {

            var data = req.body;

            userSchema.findOne({ _id: data.customerId }, function (err, customer) {
                if (err) {
                    callBack({
                        success: false,
                        STATUSCODE: 500,
                        message: 'Internal DB error',
                        response_data: {}
                    });
                } else {
                    if (customer) {
                        let updateData = {
                            fullName: data.fullName,
                            email: data.email,
                            countryCode: data.countryCode,
                            countryCodeId : data.countryCodeId,
                            phone: data.phone
                        }

                        userSchema.updateOne({ _id: data.customerId }, {
                            $set: updateData
                        }, function (err, res) {
                            if (err) {
                                console.log(err);
                                callBack({
                                    success: false,
                                    STATUSCODE: 500,
                                    message: 'Internal DB error',
                                    response_data: {}
                                });
                            } else {

                                if (res.nModified == 1) {
                                    callBack({
                                        success: true,
                                        STATUSCODE: 200,
                                        message: 'User updated Successfully',
                                        response_data: {}
                                    });
                                } else {
                                    callBack({
                                        success: false,
                                        STATUSCODE: 422,
                                        message: 'Something went wrong',
                                        response_data: {}
                                    });
                                }

                            }
                        });
                    } else {
                        callBack({
                            success: false,
                            STATUSCODE: 422,
                            message: 'User not found',
                            response_data: {}
                        });
                    }



                }
            });
        }
    },
    customerChangePassword: (req, callBack) => {
        if (req) {
            var data = req.body;

            userSchema.findOne({ _id: data.customerId }, function (err, result) {
                if (err) {
                    console.log(err);
                    callBack({
                        success: false,
                        STATUSCODE: 500,
                        message: 'Internal DB error',
                        response_data: {}
                    });
                } else {
                    if (result) {
                        const comparePass = bcrypt.compareSync(data.oldPassword, result.password);
                        if (comparePass) {

                            bcrypt.hash(data.newPassword, 8, function (err, hash) {
                                if (err) {
                                    callBack({
                                        success: false,
                                        STATUSCODE: 500,
                                        message: 'Something went wrong while setting the password',
                                        response_data: {}
                                    });
                                } else {
                                    userSchema.updateOne({ _id: data.customerId }, {
                                        $set: {
                                            password: hash
                                        }
                                    }, function (err, res) {
                                        if (err) {
                                            callBack({
                                                success: false,
                                                STATUSCODE: 500,
                                                message: 'Internal DB error',
                                                response_data: {}
                                            });
                                        } else {
                                            if (res.nModified == 1) {
                                                callBack({
                                                    success: true,
                                                    STATUSCODE: 200,
                                                    message: 'Password updated successfully',
                                                    response_data: {}
                                                });
                                            } else {
                                                callBack({
                                                    success: false,
                                                    STATUSCODE: 422,
                                                    message: 'Something went wrong',
                                                    response_data: {}
                                                });
                                            }
                                        }
                                    })
                                }
                            })
                        } else {
                            callBack({
                                success: false,
                                STATUSCODE: 422,
                                message: 'Invalid old password',
                                response_data: {}
                            });
                        }
                    } else {
                        callBack({
                            success: false,
                            STATUSCODE: 422,
                            message: 'User not found',
                            response_data: {}
                        });
                    }
                }
            });



        }
    },
    customerProfileImageUpload: (data, callBack) => {
        if (data) {

            userSchema.findOne({ _id: data.body.customerId }, function (err, result) {
                if (err) {
                    console.log(err);
                    callBack({
                        success: false,
                        STATUSCODE: 500,
                        message: 'Internal DB error',
                        response_data: {}
                    });
                } else {
                    if (result) {
                        if (result.profileImage != '') {
                            var fs = require('fs');
                            var filePath = `public/img/profile-pic/${result.profileImage}`;
                            fs.unlink(filePath, (err) => { });
                        }

                        //Get image extension
                        var ext = getExtension(data.files.image.name);

                        // The name of the input field (i.e. "image") is used to retrieve the uploaded file
                        let sampleFile = data.files.image;

                        var file_name = `customerimage-${Math.floor(Math.random() * 1000)}${Math.floor(Date.now() / 1000)}.${ext}`;

                        // Use the mv() method to place the file somewhere on your server
                        sampleFile.mv(`public/img/profile-pic/${file_name}`, function (err) {
                            if (err) {
                                console.log(err);
                                callBack({
                                    success: false,
                                    STATUSCODE: 500,
                                    message: 'Internal error',
                                    response_data: {}
                                });
                            } else {

                                userSchema.updateOne({ _id: data.body.customerId }, {
                                    $set: { profileImage: file_name }
                                }, function (err, res) {
                                    if (err) {
                                        callBack({
                                            success: false,
                                            STATUSCODE: 500,
                                            message: 'Internal DB error',
                                            response_data: {}
                                        });
                                    } else {
                                        if (res.nModified == 1) {
                                            callBack({
                                                success: true,
                                                STATUSCODE: 200,
                                                message: 'Profile image updated Successfully',
                                                response_data: {}
                                            })
                                        } else {
                                            callBack({
                                                success: false,
                                                STATUSCODE: 422,
                                                message: 'Something went wrong',
                                                response_data: {}
                                            });
                                        }
                                    }
                                })
                            }
                        });
                    }
                }
            });


        }
    },
    logout: (req, callBack) => {
        if (req) {
            var data = req.body;
            var loginId = data.loginId;
            userDeviceLoginSchema.deleteOne({ _id: loginId }, function (err) {
                if (err) {
                    console.log(err);
                }
                // deleted at most one tank document
            });
            callBack({
                success: true,
                STATUSCODE: 200,
                message: 'User logged out Successfully',
                response_data: {}
            })
        }
    },
    dashboard : async (data, callBack) => {
        try {
            if(data){
                const customerId = data.customerId
                const latt = data.latitude;
                const long = data.longitude;
                const userType = data.userType;
                let responseDt = [];
                let response_data = {};
                let allRestaurantMenus = []
                let topDishes = []

                /**Search vendor with user current lat, long */
                const isVendorExist = await Restaurant.find({
                    location: {
                        $near: {
                            $maxDistance: config.restaurantSearchDistance,
                            $geometry: {
                                type: "Point",
                                coordinates: [long, latt]
                            }
                        }
                    },
                    isActive: true
                })

                if(isVendorExist.length > 0){
                    for(let i = 0; i < isVendorExist.length; i++){
                        const restaurantId = isVendorExist[i]._id

                        /**Fetch restaurant menu */
                        const getRestaurantMenuLists = await RestaurantMenu.find({restaurantId})
                        .populate('mealTypeId')
                        .sort({_id : -1})

                        if(getRestaurantMenuLists.length > 0){
                            /**Create all restaurant menu list array with favorite item option */
                            for(let j = 0; j < getRestaurantMenuLists.length; j++){
                                getRestaurantMenuLists[j].menuImage = `${config.serverhost}:${config.port}/img/category/${getRestaurantMenuLists[j].menuImage}`;

                                /** check favorite menu  */
                                const isFavorite = await FavoriteMenu.findOne({menuId : getRestaurantMenuLists[j]._id, customerId : customerId})
                                /** end */

                                const finalMenusResponse = {
                                    ...getRestaurantMenuLists[j].toObject(),
                                    isFavorite : isFavorite != null ? 1 : 0
                                }

                                allRestaurantMenus.push(finalMenusResponse)

                                /**Create Top dishes based on number of favorite count */
                                const getCount = await FavoriteMenu.countDocuments({menuId : getRestaurantMenuLists[j]._id})
                                if(getCount >= 3){
                                    const topDishesResponse = {
                                        ...getRestaurantMenuLists[j].toObject(),
                                        isFavorite : isFavorite != null ? 1 : 0
                                    }
                                    topDishes.push(topDishesResponse)
                                }
                                /**End */
                            }
                        }
                    }

                    let fullArrayWithMealList = []
                    let mealKey = {};

                    /**Make menu meal wise */
                    if(allRestaurantMenus.length > 0){
                        const getMealList = await MealType.find()
                        if(getMealList.length > 0){
                            for(let k = 0; k < getMealList.length; k++){
                                const mealId = getMealList[k]._id
                                const name = getMealList[k].type

                                mealKey[name] = mealKey[name] || []

                                for(let l = 0; l < allRestaurantMenus.length; l++){
                                    const menuMealId = allRestaurantMenus[l].mealTypeId._id

                                    if(menuMealId.toString() === mealId.toString()){
                                        mealKey[name].push(allRestaurantMenus[l])
                                    }

                                }
                            }

                            fullArrayWithMealList.push(mealKey)
                        }
                    }
                    /**End */

                    //toDaysMenu
                    response_data.toDaysMenu = fullArrayWithMealList

                    //top dishes
                    response_data.topDishes = topDishes

                    //Category Data
                    response_data.category_data = await Category.find({})
                    response_data.category_imageUrl = `${config.serverhost}:${config.port}/img/category/`;

                    callBack({
                        success: true,
                        STATUSCODE: 200,
                        message: `${allRestaurantMenus.length} menus has been successfully found.`,
                        response_data: response_data
                    })
                }else{
                    callBack({
                        success: true,
                        STATUSCODE: 200,
                        message: 'No nearby restaurants found.',
                        response_data: {}
                    })
                }
            }
            
        } catch (error) {
            console.log(error, 'err')
           return callBack({
                success: false,
                STATUSCODE: 500,
                message: 'Internal DB error',
                response_data: {}
           }) 
        }
    }
}

//for generate OTP
function generateOTP(){
    const OTP = Math.random().toString().replace('0.', '').substr(0, 6);
    return OTP
}

function generateToken(userData) {
    let payload = { subject: userData._id, user: 'CUSTOMER' };
    return jwt.sign(payload, config.secretKey, { expiresIn: '3600000h' })
}


function getExtension(filename) {
    return filename.substring(filename.indexOf('.') + 1);
}


function sendVerificationCode(customer) {
    return new Promise(async function (resolve, reject) {


        var twilioMode = config.twilio.testMode;
        if (twilioMode == 'YES') {
            var resp = {
                serviceSid: '1234'
            }
            return resolve(resp);
        } else {
            //Twilio
            const Cryptr = require('cryptr');
            const cryptr = new Cryptr('HOTMENU');


            const accountSid = cryptr.decrypt(config.twilio.TWILIO_SID);
            const authToken = config.twilio.TWILIO_AUTHTOKEN;

            var frndlyName = config.twilio.friendlyName;

            const client = require('twilio')(accountSid, authToken);

            var countryCode = customer.countryCode;
            var phone = customer.phone;


            client.verify.services.create({ friendlyName: frndlyName })
                .then(function (service) {

                    var sid = service.sid;
                    var phoneNo = `${countryCode}${phone}`;

                    client.verify.services(sid)
                        .verifications
                        .create({ to: phoneNo, channel: 'sms' })
                        .then(function (verification) {
                            console.log(verification);
                            if (verification.status == 'pending') {
                                return resolve(verification);
                            } else {
                                return reject(verification);
                            }
                        })
                        .catch(function (err) {
                            return reject(err);
                        })
                })
                .catch(function (err) {
                    return reject(err);
                })
        }

    });

}


//Upload image
function uploadImage(file, name) {
    return new Promise(function (resolve, reject) {
        console.log(file.name);
        //Get image extension
        var ext = getExtension(file.name);

        // The name of the input field (i.e. "image") is used to retrieve the uploaded file
        let sampleFile = file;

        var file_name = `${name}-${Math.floor(Math.random() * 1000)}${Math.floor(Date.now() / 1000)}.${ext}`;

        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv(`public/img/profile-pic/${file_name}`, function (err) {
            if (err) {
                console.log('err', err);
                return reject('error');
            } else {
                return resolve(file_name);
            }
        });
    });
}
