
const pool= require('../utils/database');
module.exports = class Car{

    constructor( user_id, item_id, quantity){
        this.user_id = user_id;
        this.item_id = item_id;
        this.quantity = quantity;
    }

    static add_car(){
        return pool.query('INSERT INTO cart(user_id, item_id, quantity) VALUES ($1, $2, $3);', [this.user_id, this.item_id, this.quantity]);
    }
    static add_ords(){
        return pool.query('INSERT into orders SELECT user_id, item_id, coalesce(orders.quantity,0)+coalesce(cart.quantity,0) as quantity from (cart full outer join orders using (user_id, item_id)) on conflict (user_id,item_id) do update set quantity=EXCLUDED.quantity;');
    }
    static update_creds(a){
        return pool.query('UPDATE users set credit = $1 where user_id=1;',[a]);
    }
    static rem_cart(){
        return pool.query('DELETE FROM cart');
    }
    static get_all(){
        return pool.query('SELECT title,price,cart.quantity as quan,image FROM cart,products where products.id=cart.item_id;SELECT credit FROM users');

    }
    static get_creds(){
        return pool.query('SELECT credit from users;');
    }
    static req_cred(){
        return pool.query('SELECT sum(cart.quantity * products.price) as reqs FROM cart,products where products.id=cart.item_id;');
    }
    static get_user(a,b){
        return pool.query('select * from customer where email=$1 and pswd=$2;',[a,b]);
    }
    static create_user(firstname,lastname,username,password,email,phone,address){
        return pool.query('insert into customer (username,pswd,first_name,last_name,email,phone,addr,premium) values($1,$2,$3,$4,$5,$6,$7,false) returning id;',[username,password,firstname,lastname,email,phone,address]);
    }
    static get_manager(a,b){
        return pool.query('select * from manager where email=$1 and pswd=$2;',[a,b]);
    }
    static get_staff(a,b){
        return pool.query('select * from staff where email=$1 and pswd=$2;',[a,b]);
    }
    static create_staff(firstname,lastname,username,password,email,phone,address){
        return pool.query('insert into staff (username,pswd,first_name,last_name,email,phone,addr,salary,date_joined,accepted) values($1,$2,$3,$4,$5,$6,$7,10000,CURRENT_DATE,false) returning id;',[username,password,firstname,lastname,email,phone,address]);
    }
    static get_delivery(a,b){
        return pool.query('select * from delivery_person where email=$1 and pswd=$2;',[a,b]);
    }
    static create_delivery(firstname,lastname,username,password,email,phone,address){
        return pool.query('insert into delivery_person (username,pswd,first_name,last_name,email,phone,addr,date_joined,prim_region,sec_region) values($1,$2,$3,$4,$5,$6,$7,CURRENT_TIMESTAMP,0,0) returning id;',[username,password,firstname,lastname,email,phone,address]);
    }
    static get_all_stf_reqs(){
        return pool.query('select * from staff where accepted=false order by date_joined desc;');
    }
    static update_staff(staff_id1,salary1){
        return pool.query('update staff set (salary,accepted)=($1,true) where ID=$2;',[salary1,staff_id1]);
    }
};
