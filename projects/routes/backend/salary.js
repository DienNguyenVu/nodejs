var express = require('express');
var router = express.Router();
const SalaryModel = require('./../../schemas/salary');
const ParamsHelper = require('./../../helper/params');
const systemConfig = require('./../../configs/systems');



//import ParamsHelper from './../../helper/params';

router.get('/', (req, res, next) => {
  let objwhere = {};
  let keyword = ParamsHelper.getParam(req.query, 'keyword', '');
  let pagination = {
    totalItemsPerPage: 5,
    currentPage: 1,
    totalItems: 1,
    pageRanges: 3
  };
  pagination.currentPage = parseInt(ParamsHelper.getParam(req.query, 'page', 1));
  if (keyword !== "")
  {
    objwhere = { wage: new RegExp(keyword, 'i') };
  }
  SalaryModel.count().then((data) => {
    pagination.totalItems = data;
  });
  SalaryModel.find({})
    .find(objwhere)
    .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage)
    .limit(pagination.totalItemsPerPage)
    .then((sa) => {
      console.log("data", sa);
      res.render('page/salary/list', {
        pageTitle: 'Sala list page',
        dataSalary: sa,
        pagination,
        keyword
      });
    });
});
router.get('/add', (req, res, next) => {
  res.render('page/salary/add', { titlePage: 'Employees Managment Add',  });
});
//add
router.post('/save',
  (req, res, next) => {
    req.body = JSON.parse(JSON.stringify(req.body));
    let salary = {
      wage: ParamsHelper.getParam(req.body, 'wage', ''),
      basic_salary: ParamsHelper.getParam(req.body, 'basic_salary', ''),
      coefficient_salary: ParamsHelper.getParam(req.body, 'coefficient_salary', ''),
      allowance_coefficient: ParamsHelper.getParam(req.body, 'allowance_coefficient', '')
    }
    new SalaryModel(salary).save().then(() => {
      req.flash('success', 'thêm mới thành công', false)
      res.redirect(`/${systemConfig.prefixAdmin}/salary`);
    });
});
// edit
router.get('/edit/:id', (req, res, next) => {
  let id = ParamsHelper.getParam(req.params, 'id', '');
  SalaryModel.findById(id,(err, data)  => {
    res.render('page/salary/edit',{ 
      titlePage: 'Salary Managment Edit ',
      dataSalary: data 
    });
  });
});
//edit
router.post('/edit/:id', [], (req, res, next) => {
 req.body = JSON.parse(JSON.stringify(req.body));
 let id = ParamsHelper.getParam(req.params, 'id', '');
 SalaryModel.findById(id).then((data) => {
   data.wage = ParamsHelper.getParam(req.body, 'wage', '');
   data.basic_salary = ParamsHelper.getParam(req.body, 'basic_salary', '');
   data.coefficient_salary = ParamsHelper.getParam(req.body, 'coefficient_salary', '');
   data.allowance_coefficient = ParamsHelper.getParam(req.body, 'allowance_coefficient', '');
   data.save();
   req.flash('success', 'Edit mới thành công', false);
   res.redirect(`/${systemConfig.prefixAdmin}/salary/`);
 });
});
module.exports = router;

//may cai do get bt sao maf