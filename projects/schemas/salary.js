const mongoose = require('mongoose');
const salarySchema = new mongoose.Schema({
    wage: Number,
    basic_salary: Number,
    coefficient_salary: Number,
    allowance_coefficient: Number
});
const Salary= mongoose.model('salary',salarySchema);
module.exports = Salary;