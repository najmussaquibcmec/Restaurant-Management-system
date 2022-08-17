const Prod = require('../models/prod');
const Forder = require('../models/food_ordered');
const Fcart = require('../models/food_cart');
const Menitem = require('../models/menu_item');
const Order = require('../models/order');
const Rmater = require('../models/raw_materials');
const Car = require('../models/car');

exports.getstaffloginapi = (req,res,next) => {


    res.render('admin/staff_login', {
        pageTitle: 'Login',
    });


};


exports.staffloginapi = (req,res,next) => {
    const email = req.body.email;
    const passwd = req.body.password;
    //console.log(req.body.username);
    Car.get_staff(email,passwd).then((data,fields) => {
        if(data.rows.length==0){
            console.log({error:'incorrect credentials'});
            res.redirect('/staff/login');
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
            sess.is_staff = true;
            sess.is_del = false;
            sess.accepted = data.rows[0].accepted;
            // console.log(sess);
            // console.log(data);
            // console.log(sess);
            res.redirect('/staff/confirm_orders');
        }
    })
    .catch(err => console.log(sess));
    
};

exports.getstaffsignapi = (req,res,next) => {


    res.render('admin/staff_signup', {
        pageTitle: 'Signup',
    });


};


exports.staffsignapi = (req,res,next) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const phone = req.body.pho_num;
    const address = req.body.address;
    //console.log(req.body.username);
    Car.create_staff(firstname,lastname,username,password,email,phone,address).then((data,fields) => {
        //console.log(data);
        res.redirect('/staff/login');
    })
    .catch(err => {
        console.log({error:'invalid'});
        res.redirect('/staff/signup');
    });
    
};

exports.getformofraw = (req,res,next) => {
	if(req.session.is_staff && req.session.accepted){
		res.render('admin/staff_add_raw_materials', {
	        pageTitle: 'Add materials',
	    });
	}
	else{
		console.log({waste:'not logged in or not allowed'});
		res.redirect('/staff/login');
	}
};

exports.addrawmate = (req,res,next) => {
	if(req.session.is_staff && req.session.accepted){
		const mat_name = req.body.name.toLowerCase();
    	const mat_state = req.body.mate_state;
    	var states;
    	if(mat_state=='Ltr'){
    		states = 'L';
    	}
    	else{
    		states = 'S';
    	}
    	Rmater.add_new(mat_name,states,0).then((data,fields) => {
    		res.render('admin/staff_add_raw_materials', {
    			pageTitle: mat_name,
    		});
    	})
    	.catch(err => console.log(err));
	}
	else{
		console.log({waste:'not logged in or not allowed'});
		res.redirect('/staff/login');
	}
};

exports.getupdate_raw = (req,res,next) => {
	try{
		if(req.session.is_staff && req.session.accepted){
			Rmater.get_all_names().then((data,fields) => {
				var mates = new Array(data.rows.length);
				for(i=0;i<data.rows.length;i++){
					mates[i]=data.rows[i].mat_name;
				}
                Rmater.get_recent().then((data1,fields1) => {
    				res.render('admin/staff_update_raw_materials',{
    					pageTitle: 'mat_update',
    					raw_materials: mates,
                        recent_addns: data1.rows,
    				});
                })
                .catch(err => {
                    console.log({error:err});
                    res.redirect('/staff/add_raw');
                });
			})
            .catch(err => {
                console.log({error:err});
                res.redirect('/staff/add_raw');
            });
		}
		else{
			console.log({waste:'not logged in or not allowed'});
			res.redirect('/staff/login');
		}
	}
	catch(err){
		console.log({waste:'not logged in or not allowed'});
		res.redirect('/staff/login');
	}
};

exports.update_raw = (req,res,next) => {
	try{
		if(req.session.is_staff && req.session.accepted){
			const mat_name = req.body.name;
			const quantity = req.body.quantity;
			const flag = req.body.flag;
			Rmater.update(mat_name,quantity,flag).then((data,fields) => {
				res.redirect('/staff/update_raw');
			})
			.catch(err => {
				console.log({failed:'Error occured in insertion'});
				res.redirect('/staff/update_raw');
			});
		}
		else{
			console.log({waste:'not logged in or not allowed'});
			res.redirect('/staff/login');
		}
	}
	catch(err){
		console.log({waste:'not logged in or not allowed'});
		res.redirect('/staff/login');
	}
};


//manju written
exports.assign_area_code = (req, res, next) => {
    try{
        if(req.session.is_staff && req.session.accepted){
            const area_code = parseInt(req.body.area_code); 
            const cur_order_id = parseInt(req.body.order_id); 
            const staff_id = req.session.per_id;

            Order.check_and_update_area_code(cur_order_id, staff_id ,area_code)
            .then((data, fields) => {
                res.redirect('/staff/confirm_orders');
            }).catch(err => {
                console.log(err);
                res.redirect('/staff/confirm_orders');
            });
        }
        else{
            console.log({waste:'not logged in or not allowed'});
            res.redirect('/staff/login');
        }
    }
    catch(err){
        console.log({waste:'not logged in or not allowed'});
        res.redirect('/staff/login');
    }
};

exports.staff_assign_orders = (req, res, next) => {
    try{
        if(req.session.is_staff && req.session.accepted){
            Order.get_confirm_orders_staff().then((data, fields1) => {
                res.render('admin/staff_assign_orders', {
                    pageTitle: 'Waiting Orders',
                    path: '/staff/confirm_orders',
                    confirm_orders_list: data.rows,
                    editing: false
                });
            });
        }
        else{
            console.log({waste:'not logged in or not allowed'});
            res.redirect('/staff/login');
        }
    }
    catch(err){
        console.log({waste:'not logged in or not allowed'});
        res.redirect('/staff/login');
    }
};

exports.staff_previous_orders = (req, res, next) => {
    try{
        if(req.session.is_staff && req.session.accepted){
            Order.get_previous_orders_staff(req.session.per_id).then((data, fields) => {
                res.render('admin/staff_previous_orders', {
                    pageTitle: 'Previous Orders',
                    path: '/staff/previous_orders',
                    confirm_orders_list: data.rows,
                    editing: false
                });
            });
        }
        else{
            console.log({waste:'not logged in or not allowed'});
            res.redirect('/staff/login');
        }
    }
    catch(err){
        console.log({waste:'not logged in or not allowed'});
        res.redirect('/staff/login');
    }
};

exports.get_new_order = (req, res, next) => {
    try{
        if(req.session.is_staff && req.session.accepted){
            res.render('admin/staff_new_order', {
                pageTitle: 'New Order',
                path: '/staff/new_order',
            });
        }
        else{
            console.log({waste:'not logged in or not allowed'});
            res.redirect('/staff/login');
        }
    }
    catch(err){
        console.log({waste:'not logged in or not allowed'});
        res.redirect('/staff/login');
    }
};

//usecase8
exports.post_new_order = (req, res, next) => {
    try{
        if(req.session.is_staff && req.session.accepted){
            const name = req.name;
            const phone = req.phone;
            const addr = req.addr;

            const item_list = req.item_list;

            Order.place_order_unregistered(name, phone, addr, item_list)
            .then((data, fields) => {
                res.redirect('/staff/new_order');
            }).catch(err => {
                // error in taking order via phone call
            });
        }
        else{
            console.log({waste:'not logged in or not allowed'});
            res.redirect('/staff/login');
        }
    }
    catch(err){
        console.log({waste:'not logged in or not allowed'});
        res.redirect('/staff/login');
    }
};

exports.logoutapi3 = (req,res,next) => {
    try{
        if(req.session.is_staff && req.session.accepted){
            req.session.destroy();
            res.redirect('/staff/login');
        }
        else{
            console.log({waste:'not logged in or not allowed'});
            res.redirect('/staff/login');
        }
    }
    catch(err){
        console.log(err);
        res.redirect('/staff/login');
    }
};
