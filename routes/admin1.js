const path = require('path');
const express = require('express');

const adminCon1 = require('../controllers/admin');
const userfunc = require('../controllers/usercode');
//const managerfunc = require('../controllers/managercode');

const router = express.Router();

router.get('/',adminCon1.home_page);

router.get('/cart',adminCon1.get_cart);
router.post('/cart',adminCon1.buy_but);

router.get('/user/login',adminCon1.getloginapi);
router.post('/user/login',adminCon1.loginapi);

router.get('/user/signup',adminCon1.getsignapi);
router.post('/user/signup',adminCon1.signapi);

router.get('/user/home',userfunc.givemenu);
router.post('/user/home',userfunc.addtocart);

router.get('/user/cart',userfunc.givecart);
router.post('/user/cart',userfunc.placeorder);

router.get('/user/curr_ords',userfunc.curr_ords);
router.post('/user/curr_ords',userfunc.curr_ord_det);
router.get('/user/curr_order_items',userfunc.curr_order_items);

router.post('/user/curr_order_items',userfunc.order_completion);

router.get('/user/prev_ords',userfunc.prev_ords);
router.post('/user/prev_ords',userfunc.order_det);
router.get('/user/order_items',userfunc.order_items);

router.post('/user/order_items',userfunc.give_feedback);

router.get('/user/logout',userfunc.logoutapi1);

router.get('/user/table_booking',userfunc.table_booking_get);
router.post('/user/table_booking',userfunc.table_booking_post);

//router.get('/logout',adminCon1.logoutapi);
//router.get('/dets',adminCon1.user_dets);

module.exports = router;

// .gitignore file:
// .env
// node_modules
// -----------------------------------------------------
// "test": "echo \"Error: no test specified\" && exit 1"

// dev-x7a-6ay9.us.auth0.com

// https://projectsplaza.com/login-logout-nodejs-express/
// https://codeforgeek.com/manage-session-using-node-js-express-4/

// 127.0.0.1:3000/user/curr_ords
