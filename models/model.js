const Mongoose = require("mongoose");
const Shema = Mongoose.Schema;
const collec = Mongoose.Schema({
    title: {type: String, required:true},
    author: {type: Shema.Types.ObjectId, ref: 'users'},
    content: {type: String, required:true },
    date: {type: Date, default: Date.now},
    categori : {type: Shema.Types.ObjectId, ref: 'categoris'},
    post_name: {type: String, required:true }
});

module.exports = Mongoose.model('posts',collec);
