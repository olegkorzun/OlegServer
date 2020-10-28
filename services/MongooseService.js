const mongoose = require('mongoose');
const { Schema } = mongoose;
UsersSchema = new Schema({
    name: String,
    lname: String,
    role: {
        type: String,
        default: 'sales',
        enum: ['sales', 'tech', 'admin']
    },
    phone: String,
    email: {
        type: String,
        required: 'Require e-mail',
        unique: 'Such e-mail exist'
    },
});
mongoose.model('Users', UsersSchema);
Users = mongoose.model('Users');

class MongooseService {

    constructor() {}

    /* POST New User */
    newUser(user) {
        console.log(user);
        const finalUser = new Users(user);

        return finalUser.save()
            .then((usr) => usr)
            .catch((err) => err);
    }

    /* POST Fing User by Name*/
    finduser(name) {
        Users.find({ 'name': name }, (err, usr) => {
            if (err) {
                return err;
            }
            if (usr.length > 0) {
                return usr;
            } else {
                return err;
            }
        });
    }
}

module.exports = {
    MongooseService: MongooseService
}