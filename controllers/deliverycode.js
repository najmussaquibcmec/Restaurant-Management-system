const Prod = require('../models/prod');
const Orders = require('../models/order');
const Car = require('../models/car');


exports.getdelloginapi = (req,res,next) => {


    res.render('admin/delivery_login', {
        pageTitle: 'Login',
    });


};


exports.delloginapi = (req,res,next) => {
    const email = req.body.email;
    const passwd = req.body.password;
    //console.log(req.body.username);
    Car.get_delivery(email,passwd).then((data,fields) => {
        if(data.rows.length==0){
            console.log({error:'incorrect credentials'});
            res.redirect('/delivery/login');
        }
        else{
            sess = req.session;
            //console.log(req.session);
            sess.email = email;
            sess.username = data.rows[0].username;
            sess.first_name = data.rows[0].first_name;
            sess.last_name = data.rows[0].last_name;
            sess.per_id = data.rows[0].id;
            sess.phone = data.rows[0].phone;
            sess.addr = data.rows[0].addr;
            sess.is_manager = false;
            sess.is_staff = false;
            sess.is_del = true;
            sess.prim_region = data.rows[0].prim_region;
            sess.sec_region = data.rows[0].sec_region;
            //sess.accepted = data.rows[0].accepted;
            console.log(req.session);
            // console.log(data);
            // console.log(sess);
            res.redirect('/delivery/available-orders');
        }
    })
    .catch(err => console.log(sess));
    
};

exports.getdelsignapi = (req,res,next) => {


    res.render('admin/delivery_signup', {
        pageTitle: 'Signup',
    });


};


exports.delsignapi = (req,res,next) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const phone = req.body.pho_num;
    const address = req.body.address;
    //console.log(req.body.username);
    Car.create_delivery(firstname,lastname,username,password,email,phone,address).then((data,fields) => {
        //console.log(data);
        res.redirect('/delivery/login');
    })
    .catch(err => {
        console.log({error:'invalid'});
        res.redirect('/delivery/signup');
    });
    
};



exports.available_orders = (req, res, next) => {
    try{
        if(req.session.is_del){
            var area_code1 = req.session.prim_region;
            var area_code2 = req.session.sec_region;

            Orders.get_available_orders(area_code1).then((data, fields) => {
                if(data.rows.length<5){
                    Orders.get_available_orders(area_code2).then((data1, fields1) => {
                        console.log(data.rows);
                        console.log(data1.rows);
                        res.render('admin/delivery_available_orders', {
                            pageTitle: 'Available orders',
                            path: '/delivery/available-orders',
                            avialable_orders_prim: data.rows,
                            avialable_orders_secd: data1.rows,
                            id2: req.session.per_id,
                            editing: false
                        });

                    })
                    .catch(err => console.log("ERROR MESSAGE 1: ", err.message));
                }
                else{
                    // console.log(data.rows);
                    res.render('admin/delivery_available_orders', {
                            pageTitle: 'Available orders',
                            path: '/delivery/available-orders',
                            avialable_orders_prim: data.rows,
                            avialable_orders_secd: [],
                            id2: req.session.per_id,
                            editing: false
                        });
                }
            })
            .catch(err => console.log("ERROR MESSAGE 2: ", err.message));
        }
        else{
            console.log({error:'not allowed'});
            res.redirect('/delivery/login');
        }
    }
    catch(err){
        console.log("ERROR MESSAGE 3: ", err.message)
        res.redirect('/delivery/login');
    }

};

exports.usecase9 = (req,res,next) => {

   try{
        if(req.session.is_del){
            var delivery_person_id = req.session.per_id; // don't know how to get the deliver_person_id
            var cur_order_id = parseInt(req.body.order_num); // don't know how to get the current_order_id
            Orders.check_and_update_delivery(cur_order_id, delivery_person_id)
            .then((data, fields) => {
                res.redirect('/delivery/current-orders');
            })
            .catch(err => console.log(err));
        }
        else{
            console.log({error:'not allowed'});
            res.redirect('/delivery/login');
        }
    }
    catch(err){
        console.log(err);
        res.redirect('/delivery/login');
    }
};

exports.current_orders = (req, res, next) => {
    try{
        if(req.session.is_del){
            var delivery_person_id = req.session.per_id;
            Orders.get_delivery_current(delivery_person_id).then((data, fields1) => {

                res.render('admin/delivery_current_orders', {
                    pageTitle: 'Current orders',
                    path: '/delivery/current-orders',
                    current_orders : data.rows,
                    editing: false
                });

            });
        }
        else{
            console.log({error:'not allowed'});
            res.redirect('/delivery/login');
        }
    }
    catch(err){
        console.log(err);
        res.redirect('/delivery/login');
    }
};

exports.usecase10 = (req,res,next) => {
    

    try{
        if(req.session.is_del){
            // Set the current_order_status to 'delivery_completed'
            var cur_order_id = req.body.order_num; // don't know how to get the current_order_id
            console.log(cur_order_id,"ulfa");
            Orders.delivery_person_confirmed(cur_order_id).then((data, fields) => {
                res.redirect('/delivery/current-orders');
            })
            .catch(err => {
                console.log(err.message);
                res.redirect('/delivery/current-orders');
            }); // it will for confirmation from customer and then will be sent to past delivries for the delivery person
        }
        else{
            console.log({error:'not allowed'});
            res.redirect('/delivery/login');
        }
    }
    catch(err){
        console.log(err);
        res.redirect('/delivery/login');
    }
};

exports.past_orders = (req, res, next) => {
    try{
        if(req.session.is_del){
            var delivery_person_id = req.session.per_id;
            Orders.get_delivery_past_orders(delivery_person_id).then((data, fields1) => {

                res.render('admin/delivery_past_orders', {
                    pageTitle: 'Previous orders',
                    path: '/delivery/Previous_Orders',
                    past_orders : data.rows,
                    editing: false
                });

            });
        }
        else{
            console.log({error:'not allowed'});
            res.redirect('/delivery/login');
        }
    }
    catch(err){
        console.log("ERROR Message - ", err.message);
        res.redirect('/delivery/login');
    }
};

exports.logoutapi2 = (req,res,next) => {
    try{
        if(req.session.is_del){
            req.session.destroy();
            res.redirect('/delivery/login');
        }
        else{
            console.log({waste:'not logged in or not allowed'});
            res.redirect('/delivery/login');
        }
    }
    catch(err){
        console.log(err);
        res.redirect('/delivery/login');
    }
};
