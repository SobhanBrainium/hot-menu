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
    }

}