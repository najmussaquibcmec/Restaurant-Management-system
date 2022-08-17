const Prod = require('../models/prod');
const Forder = require('../models/food_ordered');
const Fcart = require('../models/food_cart');
const Menitem = require('../models/menu_item');
const Order = require('../models/order');
const Rmater = require('../models/raw_materials');


exports.givemenu = (req,res,next) => {
 
 if(req.session.per_id){
    var a=req.session.per_id;
    Menitem.get_all1().then((data,fields) => {
        Fcart.get_most_selled_today().then((data1,fields1) => {
            Fcart.get_popular().then((data2,fields2) => {
                 //console.log(data.rows);
                 console.log(req.session);
                 //console.log(data1.rows);
                 res.render('admin/user', {
                 pageTitle: 'Home',
                 path: '/',
                 menu_items: data.rows,
                 top_items : data1.rows,
                 pop_items : data2.rows,
                 editing: false
                 });
             })
            .catch(err => {
                console.log(err);
                res.redirect('/user/login');
            });
         })
        .catch(err => {
        console.log(err);
        res.redirect('/user/login');
        });

     }).catch(err => {
        console.log(err);
        res.redirect('/user/login');
     });
 }
 else{
    console.log({waste : 'not logged in'})
    res.redirect('/user/login');
}

};

exports.addtocart = (req,res,next) => {
    try{
        if(req.session.per_id){
            var a=req.session.per_id;
            var b=req.body.cart_items;
            b=b.split(',');
            Fcart.insert_in_cart(a,b).then((data,fields) => {
                res.redirect('/user/cart');
            })
            .catch(err => {
                console.log("there is an error in insertion");
                res.redirect('/user/home');
            });
        }
        else{
            console.log({waste : 'not logged in'})
            res.redirect('/user/login');
        }
    }
    catch(err){
        console.log({waste : 'not logged in'})
        res.redirect('/user/login');
    }
};


exports.givecart = (req,res,next) => {
 
    if(req.session.per_id){
        var a=req.session.per_id;
        //console.log({jbd:req.session.username});
        Fcart.get_cart(a).then((data,fields) => {
            res.render('admin/user_cart', {
            pageTitle: 'Cart',
            path: '/cart',
            cart_items: data.rows,
            name : req.session.username,
            phone_num : req.session.phone,
            address : req.session.addr,
            editing: false
            });
        });
    }
    else{
        console.log({waste : 'not logged in'})
        res.redirect('/user/login');
    }
};

exports.placeorder = (req,res,next) => {
    try{
        if(req.session.per_id){
            var a = req.session.per_id;
            var b = req.body.name;
            var c = req.body.phone_num;
            var d = req.body.address;
            var l1 = req.body.cart_list;
            l1=l1.split(',');
            var l2 = req.body.quantity_list;
            l2 = l2.split(',');
            var l3 = req.body.price_list;
            l3 = l3.split(',');
            var price=0;
            for(i=0;i<l2.length;i++){
                price = price+parseInt(l2[i])*parseInt(l3[i]);
            }
            Order.order_insert(a,b,c,d,price).then((data,fields) => {
                a2=data.rows[0].order_no;
                Order.food_ordered_insert(a2,l1,l2,l3).then((data1,fields1) => {
                    res.redirect('/user/curr_ords');
                })
                .catch(err => {
                    console.log("there is an error in insertion");
                    res.redirect('/user/cart');
                    });
            })
            .catch(err => {
                    console.log("there is an error in insertion");
                    res.redirect('/user/cart');
                });
        }

        else{
            console.log({waste : 'not logged in'})
            res.redirect('/user/login');
        }
    }
    catch(err){
        console.log({waste : 'not logged in'})
        res.redirect('/user/login');
    }
};

exports.curr_ords = (req,res,next) => {
    if(req.session.per_id){
        var a =req.session.per_id;
        Order.get_user_curr_orders(a).then((data,fields) => {
            
            //console.log({hjvds:req.session.per_id});
            
            res.render('admin/user_current_orders', {
                pageTitle: 'Current orders',
                orders_now: data.rows,
                path: '/orders',
                editing: false
            });
        });
    }
    else{
        console.log({waste : 'not logged in'})
        res.redirect('/user/login');
    }
};

exports.curr_ord_det = (req,res,next) => {
    try{
        if(req.session.per_id){
            var a = req.body.order_no;
            res.redirect('/user/curr_order_items/?order_num='+a);
        }
        else{
            console.log({waste : 'not logged in'})
            res.redirect('/user/login');
        }
    }
    catch(err){
        console.log({waste : 'not logged in'})
        res.redirect('/user/login');
    }
};

exports.curr_order_items = (req,res,next) => {
    try{
        if(req.session.per_id){
            var a = req.query.order_num;
            Order.get_items(a).then((data,fields) => {
                res.render('admin/curr_ord_items', {
                    pageTitle: 'Order_items',
                    items: data.rows,
                    order_no: a,
                });
            })
            .catch(err => {
                res.redirect('/user/curr_ords');
            });
        }
        else{
            console.log({waste : 'not logged in'})
            res.redirect('/user/login');
        }
    }
    catch(err){
        console.log({waste : 'not logged in'})
        res.redirect('/user/login');
    }
};


exports.prev_ords = (req,res,next) => {
    if(req.session.per_id){
        var a =req.session.per_id;
        Order.get_user_prev_orders(a).then((data,fields) => {
            
            console.log({hjvds:req.session.per_id});
            
            res.render('admin/user_previous_orders', {
                pageTitle: 'Current orders',
                orders_now: data.rows,
                path: '/orders',
                editing: false
            });
        });
    }
    else{
        console.log({waste : 'not logged in'});
        res.redirect('/user/login');
    }
};

exports.order_det = (req,res,next) => {
    try{
        if(req.session.per_id){
            var a = req.body.order_no;
            //Order.get_items(a).then((data,fields) => {
             //   var s=data.rows;
            res.redirect('/user/order_items/?order_num='+a);
            //})
            // .catch(err => {
            //     res.redirect('/user/prev_ords');
            // });
        }
        else{
            console.log({waste : 'not logged in'});
            res.redirect('/user/login');
        }
    }
    catch(err){
        console.log({waste : 'not logged in'});
        res.redirect('/user/login');
    }
};

exports.order_items = (req,res,next) => {
    try{
        if(req.session.per_id){
            var a = req.query.order_num;
            Order.get_items1(a).then((data,fields) => {
                res.render('admin/ord_items', {
                    pageTitle: 'Order_items',
                    items: data.rows,
                    order_no: a,
                });
            })
            .catch(err => {
                res.redirect('/user/prev_ords');
            });
        }
        else{
            console.log({waste : 'not logged in'});
            res.redirect('/user/login');
        }
    }
    catch(err){
        console.log({waste : 'not logged in'});
        res.redirect('/user/login');
    }
};

exports.give_feedback = (req,res,next) => {
    try{
        if(req.session.per_id){
            var a = req.body.order_num;
            var l1 = req.body.item_list;
            var l2 = req.body.comments;
            var l3 = req.body.ratings;
            var l4 = req.body.skips;
            l3 = l3.split(',');
            l1 = l1.split(',');
            l4 = l4.split(',');
            l2 = l2.split('|');
            var i;var j;
            var q = 'update food_ordered set (rating,comment) = ($1,$2) where order_no=$3 and item_ID=$4;';
            var q1 = 'update food_ordered set skip_or_not = true where order_no=$1 and item_ID=$2;';
            for(i=0;i<l3.length;i++){
                l1[i]=parseInt(l1[i]);l3[i]=parseInt(l3[i]);l4[i]=parseInt(l4[i]);
                if(l4[i]==1){
                    var c = new Array(a,l1[i]);
                    Forder.skip_feedback(q1,c).then(() => {

                    })
                    .catch(err => {
                        console.log(err);
                        res.redirect('/user/prev_ords');
                    });
                }
                else{
                    var c = new Array(l3[i],l2[i],a,l1[i]);
                    Forder.give_feedback(q,c).then(() => {

                    })
                    .catch(err => {
                        console.log(err);
                        res.redirect('/user/prev_ords');
                    });
                }
            }
            res.redirect('/user/prev_ords');
        }
        else{
            console.log({waste : 'not logged in'});
            res.redirect('/user/login');
        }
    }
    catch(err){
        console.log({waste : 'not logged in'});
        res.redirect('/user/login');
    }
};

exports.order_completion = (req,res,next) => {
    try{
        if(req.session.per_id){
            var a = req.body.order_num;
            var q = 'update customer_order set stat=$1 where order_no=$2;';
            var c = new Array('completed',a);
            Forder.give_feedback(q,c).then((data,fields) => {
                res.redirect('/user/prev_ords');
            })
            .catch(err => {
                console.log(err.message);
                res.redirect('/user/curr_ords');
            });
        }
        else{
            console.log({waste : 'not logged in'});
            res.redirect('/user/login');
        }
    }
    catch(err){
        console.log(err.message);
        res.redirect('/user/login');
    }
};

exports.logoutapi1 = (req,res,next) => {
    try{
        if(req.session.per_id){
            req.session.destroy();
            res.redirect('/user/login');
        }
        else{
            console.log({waste:'not logged in or not allowed'});
            res.redirect('/user/login');
        }
    }
    catch(err){
        console.log(err);
        res.redirect('/user/login');
    }
};

exports.table_booking_get = (req, res, next) => {
    try{
        if(req.session.per_id){
            res.render('admin/user_table_booking', {
                pageTitle: 'Table Booking',
                path: '/user/table_booking'
            });
        }
        else{
            console.log({waste : 'not logged in'});
            res.redirect('/user/login');
        }
    }
    catch(err){
        console.log(err);
        res.redirect('/user/login');
    }
};

exports.table_booking_post = (req, res, next) => {
    try{
        if(req.session.per_id){
            var D = req.body.date;
            var start_hr = parseInt(req.body.start_hr);
            //var T = req.body.time;
            var num_hr = parseInt(req.body.num_hr);
            var people_count = parseInt(req.body.count);
            var ID1 = req.session.per_id;

            //Table.max_capacity().then((data, f) => {
            console.log(start_hr, typeof(start_hr));
            console.log(num_hr, typeof(num_hr));
            console.log(people_count, typeof(people_count));
            console.log(D, typeof(D));
            Forder.get_attendance(D, start_hr, num_hr).then((data1, f1) => {
                console.log("printing : ", data1.rows[0].npers, data1.rows.length);
                console.log(data1.rows);
                if(50 - parseInt(data1.rows[0].npers) >= people_count){
                    console.log("IN HERE.");
                    Forder.book_table(people_count, D, start_hr, ID1, num_hr).then((data2, f2) => {
                        // success
                        res.redirect('/user/table_booking');
                    })
                    .catch(err => {
                        console.log(err);
                        res.redirect('/user/table_booking');
                    });

                } else {
                    console.log({waste : 'Please change the timings'});
                    res.redirect('/user/table_booking');
                }
            })
            .catch(err => {
                console.log("ERR MSG : ", err.message);
                res.redirect('/user/table_booking');
            });
            //});

        }
        else{
            console.log({waste : 'not logged in'})
            res.redirect('/user/login');
        }
    }
    catch(err){
        console.log({waste : 'not logged in'})
        res.redirect('/user/login');
    }
};
