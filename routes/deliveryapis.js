const path = require('path');
const express = require('express');

const deliveryfunc = require('../controllers/deliverycode');

const router3 = express.Router();

router3.get('/login',deliveryfunc.getdelloginapi);
router3.post('/login',deliveryfunc.delloginapi);
router3.get('/signup',deliveryfunc.getdelsignapi);
router3.post('/signup',deliveryfunc.delsignapi);
router3.get('/available-orders', deliveryfunc.available_orders);
router3.post('/available-orders', deliveryfunc.usecase9);
router3.get('/current-orders', deliveryfunc.current_orders);
router3.post('/current-orders', deliveryfunc.usecase10);
router3.get('/Previous_Orders', deliveryfunc.past_orders);
router3.get('/logout',deliveryfunc.logoutapi2);

module.exports = router3;
