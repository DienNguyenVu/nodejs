const mongoose = require('mongoose');
var departmentSchema = new mongoose.Schema({
    name : String,
    numberphone:Number,
    address:String
});
const Departmentes= mongoose.model('departmentes', departmentSchema);
module.exports = Departmentes;