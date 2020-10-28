//const { SqlDataService } = require('../services/SqlDataService');
const { KnexDataService } = require('../services/KnexDataService');
const bcrypt = require('bcrypt');

class AdminController {
    constructor() {
        //this.sqlDataService = new SqlDataService();
        this.knexDataService = new KnexDataService();
    }

    newUser(req, res) {
        const { body: { user } } = req;
        let password = bcrypt.hashSync(user.password, 10);
        user.password = password;
        console.log('password', user.password);
        this.KnexDataService.newUser(user, () => {
            res.json({ 'res': "New user success" });
            //res.json(['duplicate!', req.body.username]);
        });
    }
}
module.exports = {
    adminController: new AdminController()
}