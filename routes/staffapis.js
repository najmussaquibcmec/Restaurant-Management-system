const path = require('path');
const express = require('express');

// const adminCon1 = require('../controllers/admin');
// const userfunc = require('../controllers/usercode');
const stafffunc = require('../controllers/staffcode');

const router2 = express.Router();

router2.get('/login',stafffunc.getstaffloginapi);
router2.post('/login',stafffunc.staffloginapi);
router2.get('/signup',stafffunc.getstaffsignapi);
router2.post('/signup',stafffunc.staffsignapi);
router2.get('/add_raw',stafffunc.getformofraw);
router2.post('/add_raw',stafffunc.addrawmate);
router2.get('/update_raw',stafffunc.getupdate_raw);
router2.post('/update_raw',stafffunc.update_raw);
router2.get('/confirm_orders', stafffunc.staff_assign_orders);
router2.post('/confirm_orders', stafffunc.assign_area_code);
router2.get('/previous_orders', stafffunc.staff_previous_orders);
router2.get('/new_order', stafffunc.get_new_order);
router2.post('/new_order', stafffunc.post_new_order);
router2.get('/logout',stafffunc.logoutapi3);

module.exports = router2;
