const mongoose = require('mongoose');
var employeesSchema = new mongoose.Schema({
    name : String,
    id_employ:Number,
    birthday : String,
    born : String,
    sex : String,
    nation : String,
    numberphone : Number,
    position: String,
    literacy : String,
    wage : Number,
    day_at_word:Date,
    created:{
        user_id:Number,
        user_name:String,
        time:Date
    },
    modified:{
        user_id:Number,
        user_name:String,
        time:Date
    }
});
const Employees= mongoose.model('employees', employeesSchema);
module.exports = Employees;