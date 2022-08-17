const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
var session = require('express-session');
var sess;

const adminRo = require('./routes/admin');
const admin1Ro = require('./routes/admin1');
const managerRo = require('./routes/mangerapis');
const staffRo = require('./routes/staffapis');
const deliveryRo = require('./routes/deliveryapis');
const pool =  require('./utils/database');

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(session({secret: 'skjskskbkasa',saveUninitialized: true,resave:true}));

app.use('/admin',adminRo);
app.use('',admin1Ro);
app.use('/manager',managerRo);
app.use('/staff',staffRo);
app.use('/delivery',deliveryRo);

app.listen(3000);
