const path = require('path');
const express = require('express');

// const adminCon1 = require('../controllers/admin');
// const userfunc = require('../controllers/usercode');
const managerfunc = require('../controllers/managercode');

const router1 = express.Router();

router1.get('/login',managerfunc.getmanageloginapi);
router1.post('/login',managerfunc.manageloginapi);
router1.get('/add_raw',managerfunc.getformofraw);
router1.post('/add_raw',managerfunc.addrawmate);
router1.get('/update_raw',managerfunc.getupdate_raw);
router1.post('/update_raw',managerfunc.update_raw);

router1.get('/projections', managerfunc.projection_page_get);
router1.post('/projections', managerfunc.projection_page_post);

router1.get('/revenuedets',managerfunc.revenue_projs);
router1.get('/item_saledets',managerfunc.item_projs);

router1.get('/staff_reqs',managerfunc.staff_reqs);
router1.post('/staff_reqs',managerfunc.staff_accept);

router1.get('/logout',managerfunc.logoutapi);

router1.get('/add_menu_item',managerfunc.add_menu_form);
router1.post('/add_menu_item',managerfunc.create_item);

router1.get('/update_menu_item',managerfunc.upd_menu_form);
router1.post('/update_menu_item',managerfunc.upd_menu_item)

module.exports = router1;
