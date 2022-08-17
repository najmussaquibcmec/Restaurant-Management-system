const Prod = require('../models/prod');
const Forder = require('../models/food_ordered');
const Fcart = require('../models/food_cart');
const Menitem = require('../models/menu_item');
const Order = require('../models/order');
const Rmater = require('../models/raw_materials');
const Car = require('../models/car');


exports.getmanageloginapi = (req,res,next) => {


    res.render('admin/manager_login', {
        pageTitle: 'Login',
    });


};


exports.manageloginapi = (req,res,next) => {
    const email = req.body.email;
    const passwd = req.body.password;
    //console.log(req.body.username);
    Car.get_manager(email,passwd).then((data,fields) => {
        if(data.rows.length==0){
            console.log({error:'incorrect credentials'});
            res.redirect('/manager/login');
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
            sess.is_manager = true;
            sess.is_staff = true;
            // console.log(sess);
            // console.log(data);
            // console.log(sess);
            res.redirect('/manager/projections');
        }
    })
    .catch(err => console.log(sess));
    
};


exports.getformofraw = (req,res,next) => {
	if(req.session.is_manager){
		res.render('admin/manager_add_raw_materials', {
	        pageTitle: 'Add materials',
	    });
	}
	else{
		console.log({waste:'not logged in or not allowed'});
		res.redirect('/manager/login');
	}
};

exports.addrawmate = (req,res,next) => {
	if(req.session.is_manager){
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
    		res.render('admin/manager_add_raw_materials', {
    			pageTitle: mat_name,
    		});
    	})
    	.catch(err => console.log(err));
	}
	else{
		console.log({waste:'not logged in or not allowed'});
		res.redirect('/manager/login');
	}
};

exports.getupdate_raw = (req,res,next) => {
	try{
		if(req.session.is_manager){
			Rmater.get_all_names().then((data,fields) => {
				var mates = new Array(data.rows.length);
				for(i=0;i<data.rows.length;i++){
					mates[i]=data.rows[i].mat_name;
				}
				Rmater.get_recent().then((data1,fields1) => {
					res.render('admin/manager_update_raw_materials',{
						pageTitle: 'mat_update',
						raw_materials: mates,
						recent_addns: data1.rows,
					});
				})
				.catch(err => {
		            console.log({error:err});
		            res.redirect('/manager/add_raw');
            	});
			})
			.catch(err => {
                console.log({error:err});
                res.redirect('/manager/add_raw');
            });
		}
		else{
			console.log({waste:'not logged in or not allowed'});
			res.redirect('/manager/login');
		}
	}
	catch(err){
		console.log(err);
		res.redirect('/manager/login');
	}
};

exports.update_raw = (req,res,next) => {
	try{
		if(req.session.is_manager){
			const mat_name = req.body.name;
			const quantity = req.body.quantity;
			const flag = req.body.flag;
			Rmater.update(mat_name,quantity,flag).then((data,fields) => {
				res.redirect('/manager/update_raw');
			})
			.catch(err => {
				console.log({failed:'Error occured in insertion'});
				res.redirect('/manager/update_raw');
			});
		}
		else{
			console.log({waste:'not logged in or not allowed'});
			res.redirect('/manager/login');
		}
	}
	catch(err){
		console.log({waste:'not logged in or not allowed'});
		res.redirect('/manager/login');
	}
};


exports.projection_page_get = (req, res, next) => {
	try{
		if(req.session.is_manager){
			res.render('admin/manager_projections',{
				pageTitle: 'Projections',
				path: 'manager/projections',
			});
		}
		else{
			console.log({waste:'not logged in or not allowed'});
			res.redirect('/manager/login');
		}
	}
	catch(err){
		console.log({waste:'not logged in or not allowed'});
		res.redirect('/manager/login');
	}
};

exports.projection_page_post = (req, res, next) => {
	try{
		if(req.session.is_manager){
			var from_date1 = req.body.from;
			var to_date1 = req.body.to;
			var mode = req.body.mode;
			if(from_date1 > to_date1){
				var temp = to_date1;
				to_date1 = from_date1;
				from_date1 = temp;
			}
			var proj_type = req.body.proj_type;
			console.log(from_date1,to_date1,mode,proj_type);
			if(proj_type=='revenue'){
				res.redirect('/manager/revenuedets/?date1='+from_date1+'&date2='+to_date1+'&mode='+mode);
			}
			else if(proj_type=='items_proj'){
				console.log(proj_type);
				// console.log("/manager/item_saledets/?date1='"+from_date1+"'&date2='"+to_date1+"'&mode='"+mode+"'");
				res.redirect('/manager/item_saledets/?date1='+from_date1+'&date2='+to_date1+'&mode='+mode);
			}
			else{
				console.log('give correct requirements');
				res.redirect('/manager/projections');
			}
		}
		else{
			console.log({waste:'not logged in or not allowed'});
			res.redirect('/manager/login');
		}
	}
	catch(err){
		console.log(err);
		res.redirect('/manager/login');
	}
};

exports.revenue_projs = (req,res,next) => {
	try{
		if(req.session.is_manager){
			var d1 = req.query.date1;
			var d2 = req.query.date2;
			var mode = req.query.mode;
			Order.get_revenue(d1,d2,mode).then((data,fields) => {
				var l1 = [];
				var l2 =[];
				for(var i=0;i<data.rows.length;i++){
					l1.push(data.rows[i].sum);
					l2.push(data.rows[i].x);
				}
				console.log(l1,l2);
				res.render('admin/revenue_files', {
					pageTitle: 'Projections',
					reqs: data.rows,
					l1: l1,
					l2: l2,
					d1: d1,
					d2: d2,
					mode: mode,
					cities: [1,2,3,4],
					pops: [200,43,78,120],
				});
			})
			.catch(err => {
				console.log(err);
				res.redirect('/manager/projections');
			});
		}
		else{
			console.log({waste:'not logged in or not allowed'});
			res.redirect('/manager/login');
		}
	}
	catch(err){
		console.log(err);
		res.redirect('/manager/projections');
	}
};

exports.item_projs = (req,res,next) => {
	try{
		if(req.session.is_manager){
			var d1 = req.query.date1;
			var d2 = req.query.date2;
			var mode = req.query.mode;
			console.log(d1,d2,mode);
			Order.most_selling(d1,d2,mode).then((data,fields) => {
				console.log("ulfa1");
				res.render('admin/items_files', {
					pageTitle: 'Item Projections',
					reqs: data.rows,
					d1: d1,
					d2: d2,
					mode: mode,
				});
			})
			.catch(err => {
				console.log(err);
				res.redirect('/manager/projections');
			});
		}
		else{
			console.log({waste:'not logged in or not allowed'});
			res.redirect('/manager/login');
		}
	}
	catch(err){
		console.log(err);
		res.redirect('/manager/projections');
	}
};

exports.staff_reqs = (req,res,next) => {
	try{
		if(req.session.is_manager){
			Car.get_all_stf_reqs().then((data,fields) => {
				res.render('admin/pending_staff', {
					pageTitle: 'Recruit Staff',
					people: data.rows,
				});
			})
			.catch(err => {
				console.log(err);
				res.redirect('/manager/projections');
			});
		}
		else{
			console.log({waste:'not logged in or not allowed'});
			res.redirect('/manager/login');
		}
	}
	catch(err){
		console.log(err);
		res.redirect('/manager/projections');
	}
};

exports.staff_accept = (req,res,next) => {
	try{
		if(req.session.is_manager){
			var a = parseInt(req.body.staff_id);
			var b = parseInt(req.body.salary);
			Car.update_staff(a,b).then((data,fields) => {
				res.redirect('/manager/staff_reqs');
			})
			.catch(err => {
				console.log(err);
				res.redirect('/manager/projections');
			});
		}
		else{
			console.log({waste:'not logged in or not allowed'});
			res.redirect('/manager/login');
		}
	}
	catch(err){
		console.log(err);
		res.redirect('/manager/projections');
	}
};

exports.logoutapi = (req,res,next) => {
	try{
		if(req.session.is_manager){
			req.session.destroy();
			res.redirect('/manager/login');
		}
		else{
			console.log({waste:'not logged in or not allowed'});
			res.redirect('/manager/login');
		}
	}
	catch(err){
		console.log(err);
		res.redirect('/manager/login');
	}
};


exports.add_menu_form = (req,res,next) => {
	try{
		if(req.session.is_manager){
			res.render('admin/add_menu_item', {
				pageTitle: 'Add Menu Item'
			});
		}
		else{
			console.log({waste:'not logged in or not allowed'});
			res.redirect('/manager/login');
		}
	}
	catch(err){
		console.log(err);
		res.redirect('/manager/login');
	}
};

exports.create_item = (req,res,next) => {
	try{
		if(req.session.is_manager){
			var name = req.body.name;
			var price = parseInt(req.body.price);
			var tag = req.body.tag;
			Menitem.create_menu_item(name,price,tag).then((data,fileds) => {
				console.log('success');
				res.redirect('/manager/add_menu_item');
			})
			.catch(err => {
				console.log(err);
				res.redirect('/manager/add_menu_item')
			});
		}
		else{
			console.log({waste:'not logged in or not allowed'});
			res.redirect('/manager/login');
		}
	}
	catch(err){
		console.log(err);
		res.redirect('/manager/add_menu_item');
	}
}

exports.upd_menu_form = (req,res,next) => {
	try{
		if(req.session.is_manager){
			Menitem.get_all_menus().then((data,fields) => {
				res.render('admin/upd_menu_item', {
					menus: data.rows,
					pageTitle: 'Update Menu Item'
				});
			})
			.catch(err => {
				console.log(err);
				res.redirect('/manager/add_menu_item');
			});
		}
		else{
			console.log({waste:'not logged in or not allowed'});
			res.redirect('/manager/login');
		}
	}
	catch(err){
		console.log(err);
		res.redirect('/manager/login');
	}
};

exports.upd_menu_item = (req,res,next) => {
	try{
		if(req.session.is_manager){
			var identifier = parseInt(req.body.menu_id);
			var tag1 = req.body.tag;
			var price1 = parseInt(req.body.price);
			var available = parseInt(req.body.available);
			console.log("available : ", available, identifier, tag1, price1);
			Menitem.update_menu(identifier,tag1,price1,available).then((data,fields) => {
				res.redirect('/manager/update_menu_item');
			})
			.catch(err => {
				console.log(err);
				res.redirect('/manager/update_menu_item');
			});
		}
		else{
			console.log({waste:'not logged in or not allowed'});
			res.redirect('/manager/login');
		}
	}
	catch(err){
		console.log(err);
		res.redirect('/manager/login');
	}
};
