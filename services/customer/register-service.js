var async = require('async');
const registerModel = require('../../models/customer/register-model');

module.exports = {
    customerRegister: (data, callBack) => {
        async.waterfall([
            function(nextCb) {
                registerModel.customerRegistration(data, function(result) {
                    nextCb(null, result);
                })
            }
        ], function(err, result) {
            if (err) {
                callBack({
                    success: false,
                    STATUSCODE: 403,
                    message: 'Request Forbidden',
                    response_data: {}
                })
            } else {
                callBack(result);
            }
        });
    },
    sendVerificationCode: (data, callBack) => {
        async.waterfall([
            function(nextCb) {
                registerModel.sendVerificationCode(data, function(result) {
                    nextCb(null, result);
                })
            }
        ], function(err, result) {
            if (err) {
                callBack({
                    success: false,
                    STATUSCODE: 403,
                    message: 'Request Forbidden',
                    response_data: {}
                })
            } else {
                callBack(result);
            }
        });
    },
    verifyUser: (data, callBack) => {
        async.waterfall([
            function(nextCb) {
                registerModel.verifyUser(data, function(result) {
                    nextCb(null, result);
                })
            }
        ], function(err, result) {
            if (err) {
                callBack({
                    success: false,
                    STATUSCODE: 403,
                    message: 'Request Forbidden',
                    response_data: {}
                })
            } else {
                callBack(result);
            }
        });
    },

    customerLogin: (data, callBack) => {
        async.waterfall([
            function(nextCb) {
                registerModel.customerLogin(data, function(result) {
                    nextCb(null, result);
                })
            }
        ], function(err, result) {
            if (err) {
                callBack({
                    success: false,
                    STATUSCODE: 403,
                    message: 'Request Forbidden',
                    response_data: {}
                })
            } else {
                callBack(result);
            }
        });
       
    },
    forgotPassword: (data, callBack) => {
        async.waterfall([
            function(nextCb) {
                registerModel.customerForgotPassword(data, function(result) {
                    nextCb(null, result);
                });
            }
        ], function(err, result) {
            if (err) {
                callBack({
                    success: false,
                    STATUSCODE: 403,
                    message: 'Request Forbidden',
                    response_data: {}
                })
            } else {
                callBack(result);
            }
        });
    },

    resetPassword: (data, callBack) => {
        async.waterfall([
            function(nextCb) {
                registerModel.customerResetPassword(data, function(result) {
                    nextCb(null, result);
                });
            }
        ], function(err, result) {
            if (err) {
                callBack({
                    success: false,
                    STATUSCODE: 403,
                    message: 'Request Forbidden',
                    response_data: {}
                })
            } else {
                callBack(result);
            }
        });
    },
    resendForgotPassordOtp: (data, callBack) => {
    
        async.waterfall([
            function(nextCb) {
                registerModel.customerResendForgotPasswordOtp(data, function(result) {
                    nextCb(null, result);
                });
            }
        ], function(err, result) {
            if (err) {
                callBack({
                    success: false,
                    STATUSCODE: 403,
                    message: 'Request Forbidden',
                    response_data: {}
                })
            } else {
                callBack(result);
            }
        });
    },
    viewProfile: (data, callBack) => {
        async.waterfall([
            function(nextCb) {
                registerModel.customerViewProfile(data, function(result) {
                    nextCb(null, result);
                });
            }
        ], function(err, result) {
            if (err) {
                callBack({
                    success: false,
                    STATUSCODE: 403,
                    message: 'Request Forbidden',
                    response_data: {}
                })
            } else {
                callBack(result);
            }
        });
    
    },
    editProfile: (data, callBack) => {
            async.waterfall([
                function(nextCb) {
                    registerModel.customerEditProfile(data, function(result) {
                        nextCb(null, result);
                    });
                }
            ], function(err, result) {
                if (err) {
                    callBack({
                        success: false,
                        STATUSCODE: 403,
                        message: 'Request Forbidden',
                        response_data: {}
                    })
                } else {
                    callBack(result);
                }
            });
        
       
    },
    changePassword: (data, callBack) => {
        async.waterfall([
            function(nextCb) {
                registerModel.customerChangePassword(data, function(result) {
                    nextCb(null, result);
                });
            }
        ], function(err, result) {
            if (err) {
                callBack({
                    success: false,
                    STATUSCODE: 403,
                    message: 'Request Forbidden',
                    response_data: {}
                })
            } else {
                callBack(result);
            }
        });
    },
    logout: (data, callBack) => {
        async.waterfall([
            function(nextCb) {
                registerModel.logout(data, function(result) {
                    nextCb(null, result);
                });
            }
        ], function(err, result) {
            if (err) {
                callBack({
                    success: false,
                    STATUSCODE: 403,
                    message: 'Request Forbidden',
                    response_data: {}
                })
            } else {
                callBack(result);
            }
        });
    },
    profileImageUpload: (data, callBack) => {
        async.waterfall([
            function(nextCb) {
                registerModel.customerProfileImageUpload(data, function(result) {
                    nextCb(null, result);
                });
            }
        ], function(err, result) {
            if (err) {
                callBack({
                    success: false,
                    STATUSCODE: 403,
                    message: 'Request Forbidden',
                    response_data: {}
                })
            } else {
                callBack(result);
            }
        });

    },
    dashboard : async (data, callBack) => {
        if (!data) {
            callBack({
                success: false,
                STATUSCODE: 403,
                message: 'Request Forbidden',
                response_data: {}
            })
        } else {
            const dashboard = await registerModel.dashboard(data, callBack)
            callBack (dashboard)
        }
    },
    categoryWiseMenu : async (data) => {
        if (!data) {
            res.json({
                success: false,
                STATUSCODE: 403,
                message: 'Request Forbidden',
                response_data: {}
            })
        } else {
            const categoryWiseMenu = await registerModel.categoryWiseMenu(data)
            return categoryWiseMenu
        } 
    },
    favoriteMenuList : async (data) => {
        if (!data) {
            res.json({
                success: false,
                STATUSCODE: 403,
                message: 'Request Forbidden',
                response_data: {}
            })
        } else {
            const favoriteMenuList = await registerModel.favoriteMenuList(data)
            return favoriteMenuList
        } 
    },
    markAsFavorite : async (data) => {
        if (!data) {
            res.json({
                success: false,
                STATUSCODE: 403,
                message: 'Request Forbidden',
                response_data: {}
            })
        } else {
            const markAsFavorite = await registerModel.markAsFavorite(data)
            return markAsFavorite
        } 
    },
    markAsUnFavorite : async (data) => {
        if (!data) {
            res.json({
                success: false,
                STATUSCODE: 403,
                message: 'Request Forbidden',
                response_data: {}
            })
        } else {
            const markAsUnFavorite = await registerModel.markAsUnFavorite(data)
            return markAsUnFavorite
        }
    },
    addToCart : async (data) => {
        if (!data) {
            res.json({
                success: false,
                STATUSCODE: 403,
                message: 'Request Forbidden',
                response_data: {}
            })
        } else {
            const addToCart = await registerModel.addToCart(data)
            return addToCart
        }
    },
    cartList : async (data) => {
        if (!data) {
            res.json({
                success: false,
                STATUSCODE: 403,
                message: 'Request Forbidden',
                response_data: {}
            })
        } else {
            const cartList = await registerModel.cartList(data)
            return cartList
        }
    },
    updateCartItem : async (data) => {
        if (!data) {
            res.json({
                success: false,
                STATUSCODE: 403,
                message: 'Request Forbidden',
                response_data: {}
            })
        } else {
            const updateCartItem = await registerModel.updateCartItem(data)
            return updateCartItem
        }
    },
    removeCartItem : async (data) => {
        if (!data) {
            res.json({
                success: false,
                STATUSCODE: 403,
                message: 'Request Forbidden',
                response_data: {}
            })
        } else {
            const removeCartItem = await registerModel.removeCartItem(data)
            return removeCartItem
        }
    },
    addRating : async (data) => {
        if (!data) {
            res.json({
                success: false,
                STATUSCODE: 403,
                message: 'Request Forbidden',
                response_data: {}
            })
        } else {
            const addRating = await registerModel.addRating(data)
            return addRating
        }
    },
    ratingList : async (data) => {
        if (!data) {
            res.json({
                success: false,
                STATUSCODE: 403,
                message: 'Request Forbidden',
                response_data: {}
            })
        } else {
            const ratingList = await registerModel.ratingList(data)
            return ratingList
        }   
    },
    searchMenu : async (data) => {
        if (!data) {
            res.json({
                success: false,
                STATUSCODE: 403,
                message: 'Request Forbidden',
                response_data: {}
            })
        } else {
            const searchMenu = await registerModel.searchMenu(data)
            return searchMenu
        }
    },
    addressType : async (data) => {
        if (!data) {
            res.json({
                success: false,
                STATUSCODE: 403,
                message: 'Request Forbidden',
                response_data: {}
            })
        } else {
            const addressType = await registerModel.addressType(data)
            return addressType
        }
    },
    addAddress : async (data) => {
        if (!data) {
            res.json({
                success: false,
                STATUSCODE: 403,
                message: 'Request Forbidden',
                response_data: {}
            })
        } else {
            const addAddress = await registerModel.addAddress(data)
            return addAddress
        }
    },
    addressList : async (data) => {
        if (!data) {
            res.json({
                success: false,
                STATUSCODE: 403,
                message: 'Request Forbidden',
                response_data: {}
            })
        } else {
            const addressList = await registerModel.addressList(data)
            return addressList
        }
    },
    addressDelete : async (data) => {
        if (!data) {
            res.json({
                success: false,
                STATUSCODE: 403,
                message: 'Request Forbidden',
                response_data: {}
            })
        } else {
            const addressDelete = await registerModel.addressDelete(data)
            return addressDelete
        }
    },
    addressMarkedAsDefault : async (data) => {
        if (!data) {
            res.json({
                success: false,
                STATUSCODE: 403,
                message: 'Request Forbidden',
                response_data: {}
            })
        } else {
            const addressMarkedAsDefault = await registerModel.addressMarkedAsDefault(data)
            return addressMarkedAsDefault
        }
    },
    addressEdit : async (data) => {
        if (!data) {
            res.json({
                success: false,
                STATUSCODE: 403,
                message: 'Request Forbidden',
                response_data: {}
            })
        } else {
            const addressEdit = await registerModel.addressEdit(data)
            return addressEdit
        } 
    }
}