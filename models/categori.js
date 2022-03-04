const mongoose = require("mongoose");

const CategoriShem = mongoose.Schema({
    name: {type:String, required:true, unique:true}
});
module.exports = mongoose.model('categoris',CategoriShem);
