var express = require('express');
const ObjectId = require('mongodb').ObjectId;
var router = express.Router();

const PositionModel = require('../../schemas/positiones');
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
  PositionModel.count().then((data) => {
    pagination.totalItems = data;
  });
    PositionModel.find({})
    .find(objwhere)
    .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage)
    .limit(pagination.totalItemsPerPage)
    .then((position) => {
    res.render('page/position/list', {
      pageTitle: 'Position list page',
      dataPosition: position,
      pagination,
      keyword
    });
  });
});
router.get('/add', (req, res, next) => {
  res.render('page/position/add', { titlePage: 'Employees Managment Add',  });
});
//add
router.post('/save',
  (req, res, next) => {
    req.body = JSON.parse(JSON.stringify(req.body));
    let position = {
      name: ParamsHelper.getParam(req.body, 'name', '')
    }
    new PositionModel(position).save().then(() => {
      req.flash('success', 'thêm mới thành công', false)
      res.redirect(`/${systemConfig.prefixAdmin}/position`);
    });
});
// edit
router.get('/edit/:id', (req, res, next) => {
  let id = ParamsHelper.getParam(req.params, 'id', '');
  PositionModel.findById(id,(err, data)  => {
    res.render('page/position/edit',{ 
      titlePage: 'Salary Managment Edit ',
      dataPosition: data 
    });
  });
});
//edit
router.post('/edit/:id', [

], (req, res, next) => {
 req.body = JSON.parse(JSON.stringify(req.body));
 let id = ParamsHelper.getParam(req.params, 'id', '');
 PositionModel.findById(id).then((data) => {
   data.name = ParamsHelper.getParam(req.body, 'name', '');
   data.save();
   req.flash('success', 'Edit mới thành công', false);
   res.redirect(`/${systemConfig.prefixAdmin}/position/`);
 });
});

module.exports = router;
