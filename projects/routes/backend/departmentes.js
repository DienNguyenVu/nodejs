var express = require('express');
const ObjectId = require('mongodb').ObjectId;
var router = express.Router();

const DepartmentModel = require('../../schemas/departmentes');
const ParamsHelper = require('../../helper/params');
const systemConfig = require('../../configs/systems');



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
  DepartmentModel.count().then((data) => {
    pagination.totalItems = data;
  });
  DepartmentModel.find({})
    .find(objwhere)
    .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage)
    .limit(pagination.totalItemsPerPage)
    .then((department) => {
      res.render('page/department/list', {
        pageTitle: 'department list page',
        dataDepartment: department,
        pagination,
        keyword
      });
    });
});
router.get('/add', (req, res, next) => {
  res.render('page/department/add', { titlePage: 'Employees Managment Add',  });
});
//add
router.post('/save',
  (req, res, next) => {
    req.body = JSON.parse(JSON.stringify(req.body));
    let de = {
      name: ParamsHelper.getParam(req.body, 'name', ''),
      numberphone: ParamsHelper.getParam(req.body, 'numberphone', ''),
      address: ParamsHelper.getParam(req.body, 'address', '')
    }
    new DepartmentModel(de).save().then(() => {
      req.flash('success', 'thêm mới thành công', false)
      res.redirect(`/${systemConfig.prefixAdmin}/department`);
    });
});
// edit
router.get('/edit/:id', (req, res, next) => {
  let id = ParamsHelper.getParam(req.params, 'id', '');
  DepartmentModel.findById(id,(err, data)  => {
    res.render('page/department/edit',{ 
      titlePage: 'Salary Managment Edit ',
      dataDepartment: data 
    });
  });
});
//edit
router.post('/edit/:id', [

], (req, res, next) => {
 req.body = JSON.parse(JSON.stringify(req.body));
 let id = ParamsHelper.getParam(req.params, 'id', '');
 DepartmentModel.findById(id).then((data) => {
   data.name = ParamsHelper.getParam(req.body, 'name', '');
   data.numberphone = ParamsHelper.getParam(req.body, 'numberphone', '');
   data.address = ParamsHelper.getParam(req.body, 'address', '');
   data.save();
   req.flash('success', 'Edit mới thành công', false);
   res.redirect(`/${systemConfig.prefixAdmin}/department/`);
 });
});


module.exports = router;
