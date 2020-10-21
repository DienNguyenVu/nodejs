var express = require('express');
const ObjectId = require('mongodb').ObjectId;
var router = express.Router();

const EmployeesModel = require('./../../schemas/employees');
const ParamsHelper = require('./../../helper/params');
const systemConfig = require('./../../configs/systems');



//import ParamsHelper from './../../helper/params';

const { check, validationResult } = require('express-validator');
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
     objwhere = { name: new RegExp(keyword, 'i') };
  }
      console.log(keyword);
  EmployeesModel.count().then((data) => {
    pagination.totalItems = data;
  });
  EmployeesModel.find({})
  .find(objwhere)
  .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage)
  .limit(pagination.totalItemsPerPage)
  .then((employees) => {
    res.render('page/employees/list', {
      pageTitle: 'employees list page',
      dataEmployees: employees,
      pagination,
      keyword
    });
  });
});
/* add */
router.get(('/add'), (req, res, next) => {
  res.render('page/employees/add', { titlePage: 'Employees Managment Add', });
});

// edit
router.get('/edit/:id', (req, res, next) => {
  let id = ParamsHelper.getParam(req.params, 'id', '');
  EmployeesModel.findById(id,(err, data)  => {
    res.render('page/employees/edit',{ 
      titlePage: 'Item Managment Edit ',
      dataEmployees: data 
    });
  });
});

//edit
 router.post('/edit/:id', [
   check('name').isEmpty()
 ], (req, res, next) => {
  req.body = JSON.parse(JSON.stringify(req.body));
  let id = ParamsHelper.getParam(req.params, 'id', '');
  EmployeesModel.findById(id).then((data) => {
    data.name = ParamsHelper.getParam(req.body, 'name', '');
    data.birthday = ParamsHelper.getParam(req.body, 'birthday', '');
    data.born = ParamsHelper.getParam(req.body, 'born', '');
    data.sex = ParamsHelper.getParam(req.body, 'sex', '');
    data.nation = ParamsHelper.getParam(req.body, 'nation', '');
    data.numberphone = ParamsHelper.getParam(req.body, 'numberphone', '');
    data.position = ParamsHelper.getParam(req.body, 'position', '');
    data.literacy = ParamsHelper.getParam(req.body, 'literacy', '');
    data.wage = ParamsHelper.getParam(req.body, 'wage', '');
    data.save();
    req.flash('success', 'Edit mới thành công', false);
    res.redirect(`/${systemConfig.prefixAdmin}/employees/`);
  });
});
//add
router.post('/save',
  [
    check('name').isEmpty()
  ], (req, res, next) => {
    req.body = JSON.parse(JSON.stringify(req.body));
    let employees = {
      name: ParamsHelper.getParam(req.body, 'name', ''),
      birthday: ParamsHelper.getParam(req.body, 'birthday', ''),
      born: ParamsHelper.getParam(req.body, 'born', ''),
      sex: ParamsHelper.getParam(req.body, 'sex', ''),
      nation: ParamsHelper.getParam(req.body, 'nation', ''),
      numberphone: ParamsHelper.getParam(req.body, 'numberphone', ''),
      position: ParamsHelper.getParam(req.body, 'position', ''),
      literacy: ParamsHelper.getParam(req.body, 'literacy', ''),
      wage: ParamsHelper.getParam(req.body, 'wage', '')
    }
    new EmployeesModel(employees).save().then(() => {
      req.flash('success', 'thêm mới thành công', false)
      res.redirect(`/${systemConfig.prefixAdmin}/employees/`);
    });
  });

module.exports = router;
