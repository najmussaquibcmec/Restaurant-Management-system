
const pool= require('../utils/database');
module.exports = class Orders{

    constructor( customer_id, name, phoneno, addr, bill){
        this.customer_id = customer_id;
        this.name = name;
        this.phoneno = phoneno;
        this.addr = addr;
        this.bill = bill;
    }

    static check_and_update_area_code(cur_order_id, staff_id, area_code){
        return pool.query('update customer_order set (staff_id,area_code,stat) = ($2,$3,$4) where order_no=$1;', [cur_order_id, staff_id, area_code,'ready_to_dispatch']);
    }

    static get_confirm_orders_staff(){
        return pool.query('select * from customer_order where stat = $1 limit 10;',['yet_to_be']);
    }
    static get_previous_orders_staff(a){
        return pool.query('select * from customer_order where staff_id=$1 and stat=$2;',[a,'ready_to_dispatch']);
    }

    static add_prod(){
        // return pool.query('INSERT INTO products(title, price, image, quantity) VALUES ($1, $2, $3, $4);', [this.title, this.price, this.image, this.quantity]);
    }

    
    static check_and_update_delivery(order_id, delivery_person_id){
        return pool.query('update customer_order set (DP,stat)=($2,$3) where order_no=$1 and DP is NULL;', [order_id, delivery_person_id,'out_for_delivery']);
    }

    static get_available_orders(area_code){
        return pool.query('select order_no,cust_name,phone,addr,bill, from customer_order where area_code=$1 and stat= $2 limit 5;', [area_code,'ready_to_dispatch']);
    }

    static delivery_person_confirmed(order_id){
        return pool.query('update customer_order case begin '+ 
        'when customer_id is NULL then set (stat)=($2) '+
        'when stat = $4 then set (stat)=($3) '+
        'else set (stat)=($3) end where order_no=$1;', [order_id,'completed','delivered','out_for_delivery']);
    }

    //'update customer_order set stat = (case when customer_id is NULL then $2 when stat=$4 then $3 else $3 end) where order_no=$1;'

    static get_delivery_current(id1){
        return pool.query('select * from customer_order where DP = $1 and stat = $2;', [id1,'out_for_delivery']);
    }
    static get_delivery_past_orders(userid1){
        return pool.query('select order_no, addr, bill from customer_order where stat in ($2,$3) and DP = $1;', [userid1,'completed','delivered']);
    }


    static get_user_curr_orders(id1){
        return pool.query('with id_ords as (select * from customer_order where customer_ID=$1 and not stat=$2 order by time_stamp desc) select delivery_person.username,delivery_person.phone as phone1,id_ords.* from id_ords left outer join delivery_person on id_ords.DP=delivery_person.ID;',[id1,'completed']);
        //return pool.query('with cust_ords(numbs,name,addr,bill) as (select order_no,cust_name,addr,bill from customer_order where customer_ID = $1 and not stat=$2) select food_ordered.*,cust_ords.* from food_ordered,cust_ords where cust_ords.numbs=food_ordered.order_no;',[id,'completed']);
    }
    static get_user_prev_orders(id1){
        return pool.query('select * from customer_order where customer_ID = $1 and stat=$2;',[id1,'completed']);
    }
    static order_insert(a,b,c,d,price){
        //var i;
        //var price=0;
        // for(i=0;i<l2.length;i++){
        //     price = price+parseInt(l2[i])*parseInt(l3[i]);
        // }
        return pool.query('insert into customer_order(customer_ID,cust_name,time_stamp,phone,addr,bill,stat) values($1,$2,CURRENT_TIMESTAMP,$3,$4,$5,$6) returning order_no;',[a,b,c,d,price,'yet_to_be']);
    }
    static food_ordered_insert(a2,l1,l2,l3){
        //a2 = a1.rows[0].order_no;
        var q = 'insert into food_ordered (order_no,item_ID,price,order_date,quantity,skip_or_not) values';
        var i2,i3,i4;var j=1;
        var c = new Array(3*(l2.length) + 1);
        c[0]=a2;
        for(i=0;i<l2.length;i++){
            c[j]=parseInt(l1[i]);j=j+1;i2=j;
            c[j]=parseInt(l3[i]);j=j+1;i3=j;
            c[j]=parseInt(l2[i]);j=j+1;i4=j;
            q=q+' ($1,$'+i2+',$'+i3+',CURRENT_DATE,$'+i4+',false),';
        }
        q=q.slice(0,-1);
        q=q+';';
        return pool.query(q,c);
    }
    static get_items(a){
        return pool.query('with items(ID,price1,quan) as (select item_ID,price,quantity from food_ordered where order_no=$1) select menu_item.name,menu_item.tag,items.* from menu_item natural join items;',[a]);
    }
    static get_items1(a){
        return pool.query('with items(ID,price1,quan,comment,rating1,skip_or_not) as (select item_ID,price,quantity,comment,rating,skip_or_not from food_ordered where order_no=$1) select menu_item.name,menu_item.tag,items.* from menu_item natural join items;',[a]);
    }

    static get_revenue(date1,date2,a){
        if(a=='Monthly'){
            return pool.query('select date_part($1,time_stamp) as X,sum(bill) from customer_order where date(time_stamp) >= $2 and date(time_stamp) <= $3 group by X;',['month',date1,date2]);
        }
        else if(a=='Yearly'){
            return pool.query('select date_part($1,time_stamp) as X,sum(bill) from customer_order where date(time_stamp) >= $2 and date(time_stamp) <= $3 group by X;',['year',date1,date2]);
        }
        else if(a=='Weekly'){
            return pool.query('select date_part($1,time_stamp) as X,sum(bill) from customer_order where date(time_stamp) >= $2 and date(time_stamp) <= $3 group by X;',['week',date1,date2]);
        }
        else if(a=='Daily'){
            return pool.query('select date_part($1,time_stamp) as X,sum(bill) from customer_order where date(time_stamp) >= $2 and date(time_stamp) <= $3 group by X;',['day',date1,date2]);
        }
    }

    static most_selling(date1,date2,a){
        if(a=='Monthly'){
            return pool.query('select item_ID,date_part($1,order_date) as X,sum(quantity) as q1,sum(quantity*price) as p1 from food_ordered where date(order_date)>=date1 and date(order_date)<=date2 group by (item_ID,X) order by q1 desc limit 5;',['month',date1,date2]);
        }
        else if(a=='Yearly'){
            return pool.query('select item_ID,date_part($1,order_date) as X,sum(quantity) as q1,sum(quantity*price) as p1 from food_ordered where date(order_date)>=date1 and date(order_date)<=date2 group by (item_ID,X) order by q1 desc limit 5;',['year',date1,date2]);
        }
        else if(a=='Weekly'){
            return pool.query('select item_ID,date_part($1,order_date) as X,sum(quantity) as q1,sum(quantity*price) as p1 from food_ordered where date(order_date)>=date1 and date(order_date)<=date2 group by (item_ID,X) order by q1 desc limit 5;',['week',date1,date2]);
        }
        else if(a=='Daily'){
            return pool.query('select item_ID,date_part($1,order_date) as X,sum(quantity) as q1,sum(quantity*price) as p1 from food_ordered where date(order_date)>=date1 and date(order_date)<=date2 group by (item_ID,X) order by q1 desc limit 5;',['day',date1,date2]);
        }
    }
};
