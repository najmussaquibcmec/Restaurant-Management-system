const Prod = require('../models/prod');
const Car = require('../models/car');


exports.get_test = (req,res,next) => {


    //console.log(req.session);
    res.render('admin/add_product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });


};

exports.post_test = (req,res,next) => {
    const title = req.body.title;
    const image = req.body.image
    const price = req.body.price;
    const quantity = req.body.quantity;
    const product = new Prod( title, image, price,quantity);
    product
        .add_prod()
        .then(resss => {
            console.log(resss);
            res.redirect('/admin/add-product');
        })
        .catch(err => console.log(err));
};

exports.home_page = (req,res,next) => {

    res.render('admin/home_page',{
        pageTitle: 'Home Page',
        path: '/home'
    });
    
};

exports.get_cart = (req,res,next) => {
    Car.get_all().then(results =>
    {
        res.render('admin/show_cart', {
        pageTitle: 'Cart',
        path: '/cart',
        editing: false,
        carts: results[0],
        credits: results[1]
    });
    });
    
};

exports.buy_but = (req,res,next) => {
	Car.get_creds().then(creds => {
		Car.req_cred().then(credreq => {
			if(creds.rows[0].credit >=  credreq.rows[0].reqs){
				Car.add_ords().then(() => {
					Car.rem_cart().then(() => {
						Car.update_creds(creds.rows[0].credit - credreq.rows[0].reqs).then(() => {
							res.redirect('/admin/add-product');
						})
						.catch(err => console.log(err));
					})
					.catch(err => console.log(err));
			})
			.catch(err => console.log(err));
			}
			else{
				res.redirect('/cart');
			}
		})
		.catch(err => console.log(err));
	}
	)
	.catch(err => console.log(err));

};


exports.getloginapi = (req,res,next) => {


    res.render('admin/user_login', {
        pageTitle: 'Login',
    });


};


exports.loginapi = (req,res,next) => {
    const email = req.body.email;
    const passwd = req.body.password;
    //console.log(req.body.username);
    Car.get_user(email,passwd).then((data,fields) => {
        if(data.rows.length==0){
            console.log({error:'incorrect credentials'});
            res.redirect('/user/login');
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
            // console.log(sess);
            // console.log(data);
            // console.log(sess);
            res.redirect('/user/home');
        }
    })
    .catch(err => console.log(sess));
    
};


exports.getsignapi = (req,res,next) => {


    res.render('admin/user_signup', {
        pageTitle: 'Signup',
    });


};


exports.signapi = (req,res,next) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const phone = req.body.pho_num;
    const address = req.body.address;
    //console.log(req.body.username);
    Car.create_user(firstname,lastname,username,password,email,phone,address).then((data,fields) => {
        //console.log(data);
        res.redirect('/user/login');
    })
    .catch(err => {
        console.log({error:'invalid'});
        res.redirect('/user/signup');
    });
    
};
