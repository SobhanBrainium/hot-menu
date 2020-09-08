module.exports = (req, res, next) => {
    if(req.isAuthenticated()) {
        if(req.user.userType === 'restaurant'){
            return next();
        }else{

            res.redirect('/')
        }
    }else{

        res.redirect('/');
    }
};