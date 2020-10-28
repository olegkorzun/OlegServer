var express = require('express');
var router = express.Router();
var passport = require('../passport/passport');
let middleware = require('../passport/middleware');
const { adminController } = require('../controllers/AdminController');


/* ADMIN */
router.post('/create-user', middleware.checkToken, (req, res) => adminController.newUser(req, res));

/* LOGIN */
router.post('/login', passport.authenticate('local', { session: false, failureRedirect: '/err', }), (req, res, next) => {
    //res.json({user:req.user})
    res.json(req.user);
});
router.get('/err', (req, res) => { res.status(401).send('Not autorized') });


module.exports = router;