const mongoose = require('mongoose');
var positionSchema = new mongoose.Schema({
    name : String
});
const Positiones= mongoose.model('positiones', positionSchema);
module.exports = Positiones;