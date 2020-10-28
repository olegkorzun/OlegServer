var express = require('express');
var router = express.Router();
const { userController } = require('../controllers/UserController');

/* POST Fing User by Name*/
router.post('/newuser', (req, res) => userController.newUser(req, res));

module.exports = router;