var express = require('express');
var router = express.Router();
const ItemsModel = require('./../../schemas/items');
const systemConfig = require('./../../configs/systems');

const UtilsHelpers = require('./../../helper/utils');
const ParamsHelper = require('./../../helper/params');
//import ParamsHelper from './../../helper/params';

const { check, validationResult } = require('express-validator');


/* GET home page. */
router.get('(/status/:status)?', (req, res, next) => {
  let objwhere = {};
  let keyword = ParamsHelper.getParam(req.query, 'keyword', '');
  let currentStatus = ParamsHelper.getParam(req.params, 'status', 'all');
  let statusFilter = UtilsHelpers.createFilterStatus();
  console.log(keyword);
  let pagination = {
    totalItemsPerPage: 5,
    currentPage: 1,
    totalItems: 1,
    pageRanges: 3
  };
  pagination.currentPage = parseInt(ParamsHelper.getParam(req.query, 'page', 1));
  console.log(pagination);
  if (currentStatus === 'all') {
    if (keyword !== "")
      objwhere = { name: new RegExp(keyword, 'i') };
  } else {
    objwhere = { status: currentStatus, name: new RegExp(keyword, 'i') };
  }
  ItemsModel.count(objwhere).then((data) => {
    pagination.totalItems = data;
  });
  ItemsModel
    .find(objwhere)
    .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage)
    .sort({ ordering: 'asc' })
    .limit(pagination.totalItemsPerPage)
    .then((items) => {
      res.render('page/items/list', {
        pageTitle: 'Items List',
        items: items,
        statusFilter: statusFilter,
        currentStatus,
        pagination,
        keyword
      });
    });

});
/* change status */
router.get('/change-status/:id/:status', function (req, res, next) {
  let currentStatus = ParamsHelper.getParam(req.params, 'status', 'active');
  let id = ParamsHelper.getParam(req.params, 'id', '');
  let status = (currentStatus === "active") ? "inactive" : "active";
  ItemsModel.updateOne({ _id: id }, { status: status }, (err, rel) => {
    res.redirect(`/${systemConfig.prefixAdmin}/items/`);

  });
});
/* change status mul*/
router.post('/change-status/:status', function (req, res, next) {
  const { cid } = req.body;
  let currentStatus = ParamsHelper.getParam(req.params, 'status', 'active');
  ItemsModel.updateMany({ _id: { $in: cid } }, { status: currentStatus }, (err, rel) => {
    req.flash('success', `có ${rel.n} phần tử cập nhật status thành công !`, false);
    res.redirect(`/${systemConfig.prefixAdmin}/items/`);
  });
});
router.get('/delete/:id', (req, res, next) => {
  let id = ParamsHelper.getParam(req.params, 'id', '');
  ItemsModel.deleteOne({ _id: id }, (err, rel) => {
    res.redirect(`/${systemConfig.prefixAdmin}/items/`);
  });
});
// delete muti
router.post('/delete', (req, res, next) => {
  ItemsModel.remove({ _id: { $in: req.body.cid } }, (err, rel) => {
    res.redirect(`/${systemConfig.prefixAdmin}/items/`);
  });
});
router.post('/change-ordering', (req, res, next) => {
  let cids = req.body.cid;
  let orderings = req.body.ordering;
  if (Array.isArray(cids)) {
    cids.forEach((item, index) => {
      ItemsModel.updateOne({ _id: item }, { ordering: parseInt(orderings[index]) }, (err, rel) => {
      })
    });
    //res.send(req.body);
  }
  else {
    ItemsModel.updateOne({ _id: { $in: cids } }, { ordering: parseInt(orderings) }, (err, rel) => {
    });
  }
  res.redirect(`/${systemConfig.prefixAdmin}/items/`);
});

/* add */
router.get(('/add(/:id)?'), (req, res, next) => {
  let id = ParamsHelper.getParam(req.params, 'id', '');
  let item = { name: '', ordering: 0, status: 'novalue' };
  if (id === '') {// thêm mới
    res.render('page/items/add', { titlePage: 'Item Managment Add', item });
  }
  else {//edit
    ItemsModel.findById(id, (err, item) => {
      res.render('page/items/add', { titlePage: 'Item Managment Edit ', item });
    });
  }
});

//add
router.post('/save',
[
  check('name').isEmpty(),
  check('ordering',"phải là số").isNumeric()
],(req, res, next) => {
  req.body = JSON.parse(JSON.stringify(req.body));
  let item = {
    name: ParamsHelper.getParam(req.body, 'name', ''),
    ordering: ParamsHelper.getParam(req.body, 'ordering', 0),
    status: ParamsHelper.getParam(req.body, 'status', 'active')
  }
  new ItemsModel(item).save().then(() => {
    req.flash('success', 'thêm mới thành công', false)
    res.redirect(`/${systemConfig.prefixAdmin}/items/`);
  });
});

module.exports = router;
