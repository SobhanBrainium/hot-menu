const express = require('express');
const csrf = require("csurf")
const csrfProtection = csrf({ cookie: true })
const passport = require("passport")
const mail = require('../../modules/sendEmail');

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

//#region restaurant manager lists view
adminAPI.get('/admin/restaurant', auth, adminAuth, csrfProtection, async (req, res) => {
    const success_message = req.flash('Success')[0];
    const errorMessage = req.flash('Error')[0]

    const getAllManagers = await User.find({"status" : "ACTIVE", userType : "RESTAURANT"}).sort({_id : -1})

    // let allData = []
    // if(getAllManagers){
    //     for(let i = 0; i <getAllManagers.length; i++){
    //         // fetch restaurant admin details
    //         const restaurantAdminDetail = await vendorSchema.find({isActive : true, managerName : getAllManagers[i]._id})
    //         .populate('managerName')
    //         .sort({_id : -1})
    //         // end

    //         if(restaurantAdminDetail.length > 0){
    //             for(let j = 0; j < restaurantAdminDetail.length; j++){
    //                 allData.push(restaurantAdminDetail[j])
    //             }
    //         }else{
    //             const config = {
    //                 restaurantName: '',
    //                 managerName : getAllManagers[i].toObject()
    //             }
    //             allData.push(config)
    //         }
    //     }
    // }

    res.render('restaurant/list', {
        layout : "adminDashboardView",
        title : "Restaurant Manager List",
        csrfToken: req.csrfToken(),
        list : getAllManagers,
        message : success_message,
        errorMessage : errorMessage
    })
})
//#endregion

//#region restaurant manager add view and submit
adminAPI.get('/admin/restaurant/addAdmin', auth, adminAuth, csrfProtection,  async (req, res) => {
    const success_message = req.flash('addRestaurantAdminMessage')[0];
    const errorMessage = req.flash('Error')[0]
    res.render('restaurant/add', {
        layout : "adminDashboardView",
        title : "Restaurant Admin Add",
        csrfToken: req.csrfToken(),
        message : success_message,
        errorMessage : errorMessage
    })
}).post('/admin/restaurant/addAdmin', auth, adminAuth,  csrfProtection, async(req, res) => {
    try {
        const isExist = await User.findOne({
            $or : [{email : req.body.email}, {phone : req.body.mobileNumber}]
        })
        
        if(isExist){
            req.flash('Error', 'Restaurant Manager is already exist with this email or phone.');
            res.redirect('/admin/restaurant/addAdmin');
        }else{
            // const isUserNameExist = await User.findOne({username : req.body.managerUserName})
            // if(isUserNameExist){
            //     req.flash('Error', 'User name is already exist. Please try with another username.');
            //     res.redirect('/admin/restaurant/addAdmin');
            // }else{
                // add user to db and sent manager credential using email
                const generateRandomPassword = Math.random().toString().replace('0.', '').substr(0, 8)
                //#region add restaurant admin detail
                const adminObj = new User({
                    fullName : req.body.managerFirstName + ' ' + req.body.managerLastName,
                    email : req.body.email,
                    phone : req.body.mobileNumber,
                    password : generateRandomPassword,
                    status : 'ACTIVE',
                    userType : 'RESTAURANT',
                    loginType : 'GENERAL',
                    appType : 'BROWSER'
                })
            
                const addedAdmin = await adminObj.save()
                //#region 

                //#region restaurant get also restaurant manager login credential
                const restaurantObject = {
                    email : req.user.email,
                    firstName : req.user.firstName,
                    restaurantEmail : req.body.email
                }
                //#endregion

                //#region restaurant manager detail with credentials
                const restaurantManagerData = {
                    fullName : req.body.managerFirstName + ' ' + req.body.managerLastName,
                    email : req.body.email,
                    password : generateRandomPassword
                }
                //#endregion

                // sent email with password to restaurant manager
                mail('restaurantAdminWelcomeMail')(restaurantManagerData.email, restaurantManagerData).send();

                // sent restaurant login email with password to super admin
                // mail('restaurantCredentialSentAdmin')(restaurantObject.email, restaurantObject, generateRandomPassword).send();
            
                req.flash('Success', 'Restaurant manager has been created successfully.');
                res.redirect('/admin/restaurant');
            // }
        }

    } catch (error) {
        console.log(error, 'error')
        req.flash('Error', 'Something went wrong.');
        res.redirect('/admin/restaurant/addAdmin');
    }
})
//#endregion

//#region restaurant manager delete
adminAPI.get('/admin/restaurant/deleteAdmin/:restaurantManagerId', auth, adminAuth, csrfProtection, async (req, res) => {
    const restaurantManagerId = req.params.restaurantManagerId

    const deleteManager = await User.remove({_id : restaurantManagerId})

    if(deleteManager){
        req.flash('Success', "Restaurant manager has been deleted successfully.")
        res.redirect('/admin/restaurant')
    }else{
        req.flash('Error', "Something went wrong.")
        res.redirect('/admin/restaurant')
    }
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