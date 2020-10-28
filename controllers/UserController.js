const { MongooseService } = require('../services/MongooseService');

class UserController {
    constructor() {
        this.mongooseService = new MongooseService();
    }

    newUser(req, res) {
        console.log('USER:', req.body);
        let rr = this.mongooseService.newUser(req.body)
        console.log(rr);
        res.json({
            ststus: "New",
            date: new Date(),
            answer: rr,
        });

    }
}

module.exports = {
    userController: new UserController()
}