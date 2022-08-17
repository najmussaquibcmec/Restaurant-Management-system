const pool= require('../utils/database');
module.exports = class food_cart{

    constructor(customer_ID,item_ID,quantity){
        this.customer_ID = customer_ID;
        this.item_ID = item_ID;
        this.quantity = quantity;
    }

    static add_to(customer_id,item_id,quantity){
        return pool.query('insert into cart (customer_ID,item_ID,quantity) values ($1, $2, $3) on conflict (customer_ID,item_ID) DO update set quantity=excluded.quantity', 
        [this.customer_id, this.item_id, this.quantity]);
    }

    static get_most_selled_today(){
        return pool.query('with ids(itemid, cnt) as (select item_ID,sum(quantity) as ordcnt from food_ordered where order_date=current_date group by item_ID order by ordcnt desc limit 10),'+
        'id_list(item_id) as (select itemid from ids) select menu_item.* from menu_item, id_list where menu_item.ID = id_list.item_id;');
    }
    
    static get_cart(a){
        return pool.query('with tab1(ids1,quan) as (select item_ID,quantity from cart where customer_ID=$1) select menu_item.*,tab1.quan from menu_item,tab1 where menu_item.ID=tab1.ids1;',[a]);
    }

    static get_popular(){
        return pool.query('select * from menu_item order by num_orders desc limit 4;');
    }
    
    static insert_in_cart(a,b){
        var q='insert into cart(customer_id,item_id,quantity) values';
        var i,j;
        for(i=0;i<b.length;i++){
            j=i+2;
            q=q+' ($1,$' + j +',0),';
        }
        q=q.slice(0,-1);
        q=q+' on conflict (customer_id,item_id) DO update set quantity=excluded.quantity';
        q=q+';';
        var c=b;
        c.unshift(a);
        return pool.query(q,c);
    } 

}
