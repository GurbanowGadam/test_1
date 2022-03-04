const mongoose = require("mongoose");

const UserShem = mongoose.Schema({
    username: {type:String, required:true, unique:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true}
});
module.exports = mongoose.model('users',UserShem);
