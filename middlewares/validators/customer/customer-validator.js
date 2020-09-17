var joi = require('@hapi/joi');

module.exports = {
    customerRegister: async (req, res, next) => {
        console.log(req.body, 'register object')
        const loginTypeVal = ['GENERAL', 'FACEBOOK', 'GOOGLE'];
        const rules = joi.object({
            fullName: joi.string().required().error(new Error('Full name is required')),
            email: joi.string().email().error(new Error('Valid email is required')),
            phone: joi.number().integer().error(new Error('Valid phone no is required')),
            socialId: joi.string().allow('').optional(),
            countryCode: joi.string().required().error(new Error('Country code is required')),
            countryCodeId : joi.string().allow('').optional(),
            password: joi.string().allow('').optional(),
            confirmPassword: joi.string().valid(joi.ref('password')).required().error(err => {
                if (err[0].value === undefined || err[0].value === '' || err[0].value === null) {
                    return new Error('Confirm password is required');
                } else if (err[0].value !== req.body.password) {
                    return new Error('Password and confirm password must match');
                }
            }),
            loginType: joi.string().required().valid(...loginTypeVal).error(new Error('Login type required')),
            deviceToken: joi.string().allow('').optional(),
            appType: joi.string().allow('').optional(),
            pushMode: joi.string().allow('').optional(),
            image: joi.string().allow('').optional(),
        });

        const value = await rules.validate(req.body);

        if (value.error) {
            res.status(200).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        }else {
            if (req.body.socialId == '') {
                if((req.body.password == '') || (req.body.password == undefined)) {
                    res.status(200).json({
                        success: false,
                        STATUSCODE: 422,
                        message: 'Password is required'
                    });
                } else {
                    next();
                }
                
            } else {
                if((req.body.deviceToken == '') || (req.body.deviceToken == undefined)) {
                    res.status(200).json({
                        success: false,
                        STATUSCODE: 422,
                        message: 'Device token is required'
                    });
                } else if((req.body.appType == '') || (req.body.appType == undefined)) {
                    res.status(200).json({
                        success: false,
                        STATUSCODE: 422,
                        message: 'App type is required'
                    });
                } else if((req.body.pushMode == '') || (req.body.pushMode == undefined)) {
                    res.status(200).json({
                        success: false,
                        STATUSCODE: 422,
                        message: 'Push mode is required'
                    });
                } else {
                    next();
                }
                
            }

        }
    },
    sendVerificationCode: async (req, res, next) => {
        const rules = joi.object({
            userId: joi.string().required().error(new Error('User id is required'))
        });

        const value = await rules.validate(req.body);
        if (value.error) {
            res.status(200).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else {
            next();
        }
    },
    verifyUser: async (req, res, next) => {

        const appTypeVal = ["ANDROID", "IOS", "BROWSER"];
        const pushType = ["P", "S"];
        const rules = joi.object({
            userId: joi.string().required().error(new Error('User id is required')),
            sid: joi.string().required().error(new Error('Sid required')),
            verificationCode: joi.string().required().error(new Error('Verification code required')),
            deviceToken: joi.string().required().error(new Error('Device token required')),
            appType: joi.string().required().valid(...appTypeVal).error(new Error('App type required')),
            pushMode: joi.string().required().valid(...pushType).error(new Error('Push mode required'))
        });

        const value = await rules.validate(req.body);
        if (value.error) {
            res.status(200).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else {
            next();
        }
    },

    customerLogin: async (req, res, next) => {
        console.log(req.body,'object')
        const loginTypeVal = ['GENERAL', 'FACEBOOK', 'GOOGLE'];
        const appTypeVal = ["ANDROID", "IOS", "BROWSER"];
        const pushType = ["P", "S"];
        const rules = joi.object({
            countryCode: joi.string().allow('').optional(),
            user: joi.string().required().error(new Error('Phone is required')),
            password: joi.string().allow('').optional(),
            loginType: joi.string().required().valid(...loginTypeVal).error(new Error('Please send valid loginType')),
            deviceToken: joi.string().required().error(new Error('Device token required')),
            appType: joi.string().required().valid(...appTypeVal).error(new Error('App type required')),
            pushMode: joi.string().required().valid(...pushType).error(new Error('Push mode required'))
        });

        const value = await rules.validate(req.body);
        if (value.error) {
            console.log(value.error);
            res.status(200).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else {
            next();
        }
    },

    forgotPasswordEmail: async (req, res, next) => {
        const userTypeVal = ["CUSTOMER", "DELIVERY_BOY","RESTAURANT"];
        const rules = joi.object({
            email: joi.string().required().email().error((err) => {
                if (err[0].value === undefined || err[0].value === '' || err[0].value === null) {
                    return new Error('Email is required');
                } else {
                    return new Error('Please enter valid email');
                }
            }),
            userType: joi.string().required().valid(...userTypeVal).error(new Error('Please send userType'))
        });

        const value = await rules.validate(req.body);
        if (value.error) {
            res.status(200).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else {
            next();
        }
    },

    resetPassword: async (req, res, next) => {
        const userTypeVal = ["CUSTOMER", "DELIVERY_BOY","RESTAURANT"];
        const rules = joi.object({
            email: joi.string().required().email().error((err) => {
                if (err[0].value === undefined || err[0].value === '' || err[0].value === null) {
                    return new Error('Email is required');
                } else {
                    return new Error('Please enter valid email');
                }
            }),
            password: joi.string().required().error(new Error('Password is required')),
            confirmPassword: joi.string().valid(joi.ref('password')).required().error(err => {
                if (err[0].value === undefined || err[0].value === '' || err[0].value === null) {
                    return new Error('Confirm password is required');
                } else if (err[0].value !== req.body.password) {
                    return new Error('Password and confirm password must match');
                }
            }),
            userType: joi.string().required().valid(...userTypeVal).error(new Error('Please send userType')),
        });

        const value = await rules.validate(req.body);
        if (value.error) {
            res.status(200).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else {
            next();
        }
    },
    resendForgotPassOtp: async (req, res, next) => {
        const userTypeVal = ["CUSTOMER", "DELIVERY_BOY","RESTAURANT"];
        const rules = joi.object({
            email: joi.string().required().email().error((err) => {
                if (err[0].value === undefined || err[0].value === '' || err[0].value === null) {
                    return new Error('Email is required');
                } else {
                    return new Error('Please enter valid email');
                }
            }),
            userType: joi.string().required().valid(...userTypeVal).error(new Error('Please send userType'))
        });

        const value = await rules.validate(req.body);
        if (value.error) {
            res.status(200).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else {
            next();
        }
    },
    viewProfile: async (req, res, next) => {
        const rules = joi.object({
            customerId: joi.string().required().error(new Error('Customer id is required')),
            loginId: joi.string().required().error(new Error('Login id is required')),
        });

        const value = await rules.validate(req.body);
        if (value.error) {
            res.status(200).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else {
            next();
        }
    },
    editProfile: async (req, res, next) => {
        const rules = joi.object({
            customerId: joi.string().required().error(new Error('Customer id is required')),
            loginId: joi.string().required().error(new Error('Login id is required')),
            fullName: joi.string().required().error(new Error('Full name is required')),
            email: joi.string().email().error(new Error('Valid email is required')),
            phone: joi.number().integer().error(new Error('Valid phone no is required')),
            countryCode: joi.string().required().error(new Error('Country code is required')),
        });

        const value = await rules.validate(req.body);
        if (value.error) {
            res.status(200).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else {
            next();
        }
    },
    changePassword: async (req, res, next) => {
        const rules = joi.object({
            customerId: joi.string().required().error(new Error('Customer id is required')),
            loginId: joi.string().required().error(new Error('Login id is required')),
            oldPassword: joi.string().required().error(new Error('Old password is required')),
            newPassword: joi.string().required().error(err => {
                if (err[0].value === undefined || err[0].value === '' || err[0].value === null) {
                    return new Error('New password is required');
                } else if (err[0].value == req.body.oldPassword) {
                    return new Error('New password and new password must not match');
                }
            }),
            confirmPassword: joi.string().valid(joi.ref('newPassword')).required().error(err => {
                if (err[0].value === undefined || err[0].value === '' || err[0].value === null) {
                    return new Error('Confirm password is required');
                } else if (err[0].value !== req.body.newPassword) {
                    return new Error('New password and confirm password must match');
                }
            })
        });

        const value = await rules.validate(req.body);
        if (value.error) {
            res.status(200).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else {
            next();
        }
    },
    profileImageUpload: async (req, res, next) => {
        const rules = joi.object({
            customerId: joi.string().required().error(new Error('Customer id is required')),
            loginId: joi.string().required().error(new Error('Login id is required'))
        });
        const imageRules = joi.object({
            image: joi.object().required().error(new Error('Image is required')),
        });

        const value = await rules.validate(req.body);
        const imagevalue = await imageRules.validate(req.files);

        if (value.error) {
            res.status(200).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else if (imagevalue.error) {
            res.status(200).json({
                success: false,
                STATUSCODE: 422,
                message: 'Image is required'
            })
        } else if (!["jpg", "jpeg", "bmp", "gif", "png"].includes(getExtension(req.files.image.name))) {
            res.status(200).json({
                success: false,
                STATUSCODE: 422,
                message: 'Invalid image format.'
            })
        } else {
            next();
        }
    },
    logout: async (req, res, next) => {
        const rules = joi.object({
            customerId: joi.string().required().error(new Error('Customer id is required')),
            loginId: joi.string().required().error(new Error('Login id is required')),
        });

        const value = await rules.validate(req.body);
        if (value.error) {
            res.status(200).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else {
            next();
        }
    },
    customerHomeValidator : async (req, res, next) => {
        var userType = ['CUSTOMER','GUEST']
        const rules = joi.object({
            customerId: joi.string().required().error(new Error('customerId is required')),
            userType: joi.string().valid(...userType).error(new Error('Please send userType')),
            latitude: joi.string().required().error(new Error('Latitude required')),
            longitude: joi.string().required().error(new Error('Longitude required'))
        });

        const value = await rules.validate(req.body);
        if (value.error) {
            res.status(422).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else {
            if((userType == 'CUSTOMER') && (customerId == '')) {
                res.status(422).json({
                    success: false,
                    STATUSCODE: 422,
                    message: 'Customer Id is required'
                })
            } else {
                next();
            }
            
        }
    },
    categoryWiseMenuValidator : async (req, res, next) => {
        var userType = ['CUSTOMER','GUEST']
        const rules = joi.object({
            customerId: joi.string().required().error(new Error('customerId is required')),
            userType: joi.string().valid(...userType).error(new Error('Please send userType')),
            latitude: joi.string().required().error(new Error('Latitude required')),
            longitude: joi.string().required().error(new Error('Longitude required')),
            categoryId : joi.string().required().error(new Error('categoryId required')),
        });

        const value = await rules.validate(req.body);
        if (value.error) {
            res.status(422).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else {
            if((userType == 'CUSTOMER') && (customerId == '')) {
                res.status(422).json({
                    success: false,
                    STATUSCODE: 422,
                    message: 'Customer Id is required'
                })
            } else {
                next();
            }
            
        }
    },
    favoriteMenuListValidator : async (req, res, next) => {
        var userType = ['CUSTOMER','GUEST']
        const rules = joi.object({
            customerId: joi.string().required().error(new Error('customerId is required')),
            userType: joi.string().valid(...userType).error(new Error('Please send userType')),
            // latitude: joi.string().required().error(new Error('Latitude required')),
            // longitude: joi.string().required().error(new Error('Longitude required'))
        });

        const value = await rules.validate(req.body);
        if (value.error) {
            res.status(422).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else {
            if((userType == 'CUSTOMER') && (customerId == '')) {
                res.status(422).json({
                    success: false,
                    STATUSCODE: 422,
                    message: 'Customer Id is required'
                })
            } else {
                next();
            }
            
        }
    },
    markAsFavoriteValidator : async (req, res, next) => {
        var userType = ['CUSTOMER','GUEST']
        const rules = joi.object({
            customerId: joi.string().required().error(new Error('customerId is required')),
            userType: joi.string().valid(...userType).error(new Error('Please send userType')),
            menuId: joi.string().required().error(new Error('menuId required')),
        });
        const value = await rules.validate(req.body);
        if (value.error) {
            res.status(422).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else {
            if((userType == 'CUSTOMER') && (customerId == '')) {
                res.status(422).json({
                    success: false,
                    STATUSCODE: 422,
                    message: 'Customer Id is required'
                })
            } else {
                next();
            }
            
        }
    },
    addToCartValidator : async (req, res, next) => {
        var userType = ['CUSTOMER','GUEST']
        const rules = joi.object({
            customerId: joi.string().required().error(new Error('customerId is required')),
            menuId: joi.string().required().error(new Error('menuId required')),
            menuAmount : joi.number().required().error(new Error('menuAmount required')),
            menuQuantity : joi.number().required().error(new Error('menuQuantity required')),
        });
        const value = await rules.validate(req.body);
        if (value.error) {
            res.status(422).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else {
            if((userType == 'CUSTOMER') && (customerId == '')) {
                res.status(422).json({
                    success: false,
                    STATUSCODE: 422,
                    message: 'Customer Id is required'
                })
            } else {
                next();
            }
            
        }
    },
    cartListValidator : async (req, res, next) => {
        var userType = ['CUSTOMER','GUEST']
        const rules = joi.object({
            customerId: joi.string().required().error(new Error('customerId is required')),
        });
        const value = await rules.validate(req.body);
        if (value.error) {
            res.status(422).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else {
            if((userType == 'CUSTOMER') && (customerId == '')) {
                res.status(422).json({
                    success: false,
                    STATUSCODE: 422,
                    message: 'Customer Id is required'
                })
            } else {
                next();
            }
            
        }
    },
    updateCartItemValidator : async (req, res, next) => {
        var userType = ['CUSTOMER','GUEST']
        const rules = joi.object({
            customerId: joi.string().required().error(new Error('customerId is required')),
            cartId: joi.string().required().error(new Error('cartId is required')),
            menuId: joi.string().required().error(new Error('menuId required')),
            menuAmount : joi.number().required().error(new Error('menuAmount required')),
            menuQuantity : joi.number().required().error(new Error('menuQuantity required')),
        });
        const value = await rules.validate(req.body);
        if (value.error) {
            res.status(422).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else {
            if((userType == 'CUSTOMER') && (customerId == '')) {
                res.status(422).json({
                    success: false,
                    STATUSCODE: 422,
                    message: 'Customer Id is required'
                })
            } else {
                next();
            }
            
        }
    },
    removeCartItemValidator : async (req, res, next) => {
        var userType = ['CUSTOMER','GUEST']
        const rules = joi.object({
            customerId: joi.string().required().error(new Error('customerId is required')),
            cartId: joi.string().required().error(new Error('cartId is required')),
            menuId: joi.string().required().error(new Error('menuId required'))
        });
        const value = await rules.validate(req.body);
        if (value.error) {
            res.status(422).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else {
            if((userType == 'CUSTOMER') && (customerId == '')) {
                res.status(422).json({
                    success: false,
                    STATUSCODE: 422,
                    message: 'Customer Id is required'
                })
            } else {
                next();
            }
            
        } 
    },
    addRating : async (req, res, next) => {
        var userType = ['CUSTOMER','GUEST']
        const rules = joi.object({
            customerId: joi.string().required().error(new Error('customerId is required')),
            menuId: joi.string().required().error(new Error('menuId required')),
            rating : joi.string().required().error(new Error('rating is required')),
            review : joi.string().optional(),
        });
        const value = await rules.validate(req.body);
        if (value.error) {
            res.status(422).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else {
            if((userType == 'CUSTOMER') && (customerId == '')) {
                res.status(422).json({
                    success: false,
                    STATUSCODE: 422,
                    message: 'Customer Id is required'
                })
            } else {
                next();
            }
            
        }
    },
    ratingList : async (req, res, next) => {
        var userType = ['CUSTOMER','GUEST']
        const rules = joi.object({
            customerId: joi.string().required().error(new Error('customerId is required')),
            menuId: joi.string().required().error(new Error('menuId required'))
        });
        const value = await rules.validate(req.body);
        if (value.error) {
            res.status(422).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else {
            if((userType == 'CUSTOMER') && (customerId == '')) {
                res.status(422).json({
                    success: false,
                    STATUSCODE: 422,
                    message: 'Customer Id is required'
                })
            } else {
                next();
            }
            
        } 
    },
    searchMenu : async (req, res, next) => {
        var userType = ['CUSTOMER','GUEST']
        const rules = joi.object({
            customerId: joi.string().required().error(new Error('customerId is required')),
            searchValue: joi.string().required().error(new Error('searchValue required')),
            latitude : joi.string().optional(),
            longitude : joi.string().optional(),
        });
        const value = await rules.validate(req.body);
        if (value.error) {
            res.status(422).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else {
            if((userType == 'CUSTOMER') && (customerId == '')) {
                res.status(422).json({
                    success: false,
                    STATUSCODE: 422,
                    message: 'Customer Id is required'
                })
            } else {
                next();
            }
            
        } 
    },
    addressType : async (req, rs, next) => {
        const rules = joi.object({
            customerId : joi.string().required().error(new Error('customerId is required'))
        });

        const value = await rules.validate(req.body);
        if (value.error) {
            res.status(422).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else {
            next();
        } 
    },
    addAddress : async (req, res, next) => {
        const rules = joi.object({
            customerId : joi.string().required().error(new Error('customerId is required')),
            addressType : joi.string().required().error(new Error('addressType is required')),
            flatOrHouseOrBuildingOrCompany: joi.string().required().error(new Error('flatOrHouseOrBuildingOrCompany is required')),
            fullAddress: joi.string().required().error(new Error('fullAddress is required')),
            landmark: joi.string().allow('').optional(),
            latitude: joi.string().required().error(new Error('latitude is required')),
            longitude: joi.string().required().error(new Error('longitude is required')),
        });

        const value = await rules.validate(req.body);
        if (value.error) {
            res.status(422).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else {
            next();
        }
    },
    addressList : async (req, res, next) => {
        const rules = joi.object({
            customerId : joi.string().required().error(new Error('customerId is required'))
        });

        const value = await rules.validate(req.body);
        if (value.error) {
            res.status(422).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else {
            next();
        }
    },
    addressDelete : async (req, res, next) => {
        const rules = joi.object({
            customerId : joi.string().required().error(new Error('customerId is required')),
            addressId : joi.string().required().error(new Error('addressId is required')),
        });

        const value = await rules.validate(req.body);
        if (value.error) {
            res.status(422).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else {
            next();
        }  
    },
    addressMarkedAsDefault : async (req, res, next) => {
        const rules = joi.object({
            customerId : joi.string().required().error(new Error('customerId is required')),
            addressId : joi.string().required().error(new Error('addressId is required')),
            isDefault : joi.string().required().error(new Error('isDefault is required'))
        });

        const value = await rules.validate(req.body);
        if (value.error) {
            res.status(422).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else {
            next();
        }
    },
    addressEdit : async (req, res, next) => {
        const rules = joi.object({
            customerId : joi.string().required().error(new Error('customerId is required')),
            addressId : joi.string().required().error(new Error('addressId is required')),
            // addressType : joi.string().required().error(new Error('addressType is required')),
            flatOrHouseOrBuildingOrCompany: joi.string().required().error(new Error('flatOrHouseOrBuildingOrCompany is required')),
            fullAddress: joi.string().required().error(new Error('fullAddress is required')),
            landmark: joi.string().allow('').optional(),
            latitude: joi.string().required().error(new Error('latitude is required')),
            longitude: joi.string().required().error(new Error('longitude is required')),
        });

        const value = await rules.validate(req.body);
        if (value.error) {
            res.status(422).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else {
            next();
        } 
    },
    orderSubmit : async (req, res, next) => {
        const rules = joi.object({
            customerId : joi.string().required().error(new Error('customerId is required')),
            cartId : joi.string().required().error(new Error('cartId is required')),
            paymentStatus : joi.string().required().error(new Error('paymentStatus is required')),
            paymentId: joi.string().required().error(new Error('paymentId is required')),
            promoCodeId: joi.string().optional(),
            finalAmount: joi.string().required().error(new Error('finalAmount is required'))
        });

        const value = await rules.validate(req.body);
        if (value.error) {
            res.status(422).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else {
            next();
        } 
    },
    orderList : async (req, res, next) => {
        const rules = joi.object({
            customerId : joi.string().required().error(new Error('customerId is required'))
        });

        const value = await rules.validate(req.body);
        if (value.error) {
            res.status(422).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else {
            next();
        } 
    },
    orderDetail : async (req, res, next) => {
        const rules = joi.object({
            customerId : joi.string().required().error(new Error('customerId is required')),
            orderId : joi.string().required().error(new Error('orderId is required')),
        });

        const value = await rules.validate(req.body);
        if (value.error) {
            res.status(422).json({
                success: false,
                STATUSCODE: 422,
                message: value.error.message
            })
        } else {
            next();
        }
    }
}

function getExtension(filename) {
    return filename.substring(filename.indexOf('.') + 1);
}