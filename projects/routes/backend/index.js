var express = require('express');
var router = express.Router();

var itemsRouter = require('./items');
var homeRouter = require('./home');
var dashboardRouter = require('./dashboard');
var employeesRouter= require('./employees');
var salaryRouter= require('./salary');

var positionRouter= require('./positiones');
var departmentRouter= require('./departmentes');

router.use('/',homeRouter);
router.use('/dashboard',dashboardRouter);
router.use('/items',itemsRouter);

router.use('/employees',employeesRouter);

router.use('/salary',salaryRouter);

router.use('/position',positionRouter);

router.use('/department',departmentRouter);




module.exports = router;
 