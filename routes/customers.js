'use strict';
var express = require('express');
const config = require('../config');
const registerService = require('../services/customer/register-service');

const customerValidator = require('../middlewares/validators/customer/customer-validator');
const jwtTokenValidator = require('../middlewares/jwt-validation-middlewares');

var customerApi = express.Router();
customerApi.use(express.json());
customerApi.use(express.urlencoded({extended: false}));

/** Customer registration */
customerApi.post('/register', customerValidator.customerRegister, function(req, res) {
    registerService.customerRegister(req, function(result) {
        res.status(200).send(result);
    })
});

/** Send Verification Email/Ph */
customerApi.post('/sendVerificationCode', customerValidator.sendVerificationCode, function(req, res) {
    registerService.sendVerificationCode(req, function(result) {
        res.status(200).send(result);
    });
});

/** Verify Registered User */
customerApi.post('/verifyUser', customerValidator.verifyUser, function(req, res) {
    registerService.verifyUser(req, function(result) {
        res.status(200).send(result);
    });
});

/** Customer Login */
customerApi.post('/login', customerValidator.customerLogin, function(req, res) {
    registerService.customerLogin(req, function(result) {
        res.status(200).send(result);
    })
});

/** Forgot Password */
customerApi.post('/forgotPassword', customerValidator.forgotPasswordEmail, function(req, res) {
    registerService.forgotPassword(req, function(result) {
        res.status(200).send(result);
    })
});

/** Reset Password */
customerApi.post('/resetPassword', customerValidator.resetPassword, function(req, res) {
    registerService.resetPassword(req, function(result) {
        res.status(200).send(result);
    });
});

/** Resend Forgot Password OTP */
customerApi.post('/resendForgotPassOtp', customerValidator.resendForgotPassOtp, function(req, res) {
    registerService.resendForgotPassordOtp(req, function(result) {
        res.status(200).send(result);
    });
});

/** View Profile */
customerApi.post('/viewProfile',jwtTokenValidator.validateToken, customerValidator.viewProfile, function(req, res) {
    registerService.viewProfile(req, function(result) {
        res.status(200).send(result);
    });
});

/** Edit Profile */
customerApi.post('/editProfile',jwtTokenValidator.validateToken, customerValidator.editProfile, function(req, res) {
    registerService.editProfile(req, function(result) {
        res.status(200).send(result);
    });
});

/** Change password */
customerApi.post('/changePassword',jwtTokenValidator.validateToken, customerValidator.changePassword, function(req, res) {
    registerService.changePassword(req, function(result) {
        res.status(200).send(result);
    });
});

/** Profile image upload */
customerApi.post('/profileImageUpload',jwtTokenValidator.validateToken,customerValidator.profileImageUpload, function(req, res) {
    registerService.profileImageUpload(req, function(result) {
        res.status(200).send(result);
    });
});

/** Change password */
customerApi.post('/logout',jwtTokenValidator.validateToken, customerValidator.logout, function(req, res) {
    registerService.logout(req, function(result) {
        res.status(200).send(result);
    });
});

/** customer home or dashboard */
customerApi.post('/dashboard', jwtTokenValidator.validateToken, customerValidator.customerHomeValidator, async(req, res) => {
    registerService.dashboard(req.body, function(result) {
        res.status(200).send(result);
    });
})

//#region list of favorites menu by customer
customerApi.post('/favoriteMenuList', jwtTokenValidator.validateToken, customerValidator.favoriteMenuListValidator, async(req, res) => {
    const result = await registerService.favoriteMenuList(req.body)
    res.status(200).send(result);
})
//#endregion

//#region mark as favorite restaurant by customer
customerApi.post('/markAsFavorite', jwtTokenValidator.validateToken, customerValidator.markAsFavoriteValidator, async(req, res) => {
    const result = await registerService.markAsFavorite(req.body)
    res.status(200).send(result)
})
//#endregion

//#region mark as un favorite restaurant by customer
customerApi.post('/markAsUnFavorite', jwtTokenValidator.validateToken, customerValidator.markAsFavoriteValidator, async(req, res) => {
    const result = await registerService.markAsUnFavorite(req.body)
    res.status(200).send(result)
})
//#endregion

//#region category wise menu list
customerApi.post('/categoryWiseMenu', jwtTokenValidator.validateToken, customerValidator.categoryWiseMenuValidator, async(req, res) => {
    const result = await registerService.categoryWiseMenu(req.body);
    res.status(200).send(result);
})
//#endregion

//#region Add to cart
customerApi.post("/addToCart", jwtTokenValidator.validateToken, customerValidator.addToCartValidator, async(req, res) => {
    const result = await registerService.addToCart(req.body);
    res.status(200).send(result);
})
//#endregion

//#region Customer cart list
customerApi.post("/cartList", jwtTokenValidator.validateToken, customerValidator.cartListValidator, async(req, res) => {
    const result = await registerService.cartList(req.body);
    res.status(200).send(result);
})
//#endregion

//#region update cart menu
customerApi.post("/updateCartItem", jwtTokenValidator.validateToken, customerValidator.updateCartItemValidator, async(req, res) => {
    const result = await registerService.updateCartItem(req.body);
    res.status(200).send(result);
})
//#endregion

//#region remove cart menu
customerApi.post("/removeCartItem", jwtTokenValidator.validateToken, customerValidator.removeCartItemValidator, async(req, res) => {
    const result = await registerService.removeCartItem(req.body);
    res.status(200).send(result);
})
//#endregion

//#region add rating on menu
customerApi.post("/addRating", jwtTokenValidator.validateToken, customerValidator.addRating, async(req, res) => {
    const result = await registerService.addRating(req.body);
    res.status(200).send(result);
})
//#endregion

//#region menu wise rating list
customerApi.post("/ratingList", jwtTokenValidator.validateToken, customerValidator.ratingList, async(req, res) => {
    const result = await registerService.ratingList(req.body);
    res.status(200).send(result);
})
//#endregion

//#region menu search list
customerApi.post("/searchMenu", jwtTokenValidator.validateToken, customerValidator.searchMenu, async(req, res) => {
    const result = await registerService.searchMenu(req.body);
    res.status(200).send(result);
})
//#endregion

module.exports = customerApi;