const express = require('express');
const csrf = require("csurf")
const csrfProtection = csrf({ cookie: true })
const passport = require("passport")

//#region middleware
const auth = require("../../middlewares/auth")
const adminAuth = require("../../middlewares/adminAuth")
const vendorAuth = require("../../middlewares/vendorAuth")
//#endregion

//#region schema
const User = require("../../schema/User")
//#endregion

let adminAPI = express.Router()
adminAPI.use(express.json())
adminAPI.use(express.urlencoded({extended: false}))

//#region login
adminAPI.get('/admin', csrfProtection ,(req, res) => {
    const msg = req.flash('loginMessage')[0];
    res.render('adminLoginBody',{layout: 'adminLoginView', csrfToken: req.csrfToken(), message: msg});
})

adminAPI.post('/admin/login', csrfProtection, passport.authenticate('local-login', {
    failureRedirect: '/admin',
    failureFlash: true
}), (req, res) => {
    if(req.user != undefined && req.user.userType === 'restaurant'){
        res.redirect('/vendor/dashboard');
    }

    else if(req.user != undefined && req.user.userType === 'ADMIN'){
        res.redirect('/admin/dashboard');
    }
})
//#endregion

//#region Admin section

//#region admin dashboard
adminAPI.get("/admin/dashboard", auth, adminAuth, csrfProtection, async (req, res) => {
    //#region get number of registered user
    const getNumberOfUser = await User.countDocuments({"status" : "ACTIVE", userType : 'CUSTOMER'})
    //#endregion

    res.render('dashboard', {
        layout:"adminDashboardView", 
        title:"Admin Dashboard", 
        totalUser : getNumberOfUser, 
        totalOrder : '',
        totalRestaurantAdmin : '',
        csrfToken: req.csrfToken()
    });
})
//#endregion

//#endregion

//#region logout
adminAPI.get("/logout", async(req, res) => {
    req.logout();
    res.redirect('/admin');
})
//#endregion

module.exports = adminAPI; 