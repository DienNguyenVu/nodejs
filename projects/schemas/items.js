const mongoose = require('mongoose');

var itemsSchema = new mongoose.Schema({
    name: String,
    status: String,
    ordering: Number
});
const Items = mongoose.model('items', itemsSchema);
module.exports = Items;