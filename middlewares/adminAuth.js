module.exports = (req, res, next) => {
    if(req.isAuthenticated()) {
        if(req.user.userType === 'ADMIN'){
            return next();
        }else{

            res.redirect('/admin')
        }
    }else{

        res.redirect('/admin');
    }
};