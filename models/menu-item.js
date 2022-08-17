const pool= require('../utils/database');
module.exports = class menu_item{

    constructor(name, price, tag_list, desc, discount, discount_prem, rating, available, num_orders){
        this.name = name;
        this.price = price;
        this.tag_list = tag_list;
        this.desc = desc;
        this.discount = discount;
        this.discount_prem = discount_prem;
        this.rating = rating;
        this.available = available;
        this.num_orders = num_orders;
    }

    static add_new(){
        var str = "ARRAY[";
        this.tag_list.forEach(element => {
            str += ( "'"+ element + "', ");
        });
        str += "]";
        console.log(str);
        return pool.query('insert into menu_item (name, price, tag, discount, discount_premium) values ($1, $2, $3, $4, $5, $6, $7, $8)', 
        [this.name, this.price, this.desc, str, this.discount, this.discount_prem, this.rating, this.available, this.num_orders]);
    }

    static update(name, new_name, new_price, new_tag_list, new_desc, new_discont, new_disc_prem, new_available){
        var str = "ARRAY[";
        new_tag_list.forEach(element => {
            str += ( "'"+ element + "', ");
        });
        str += "]";
        return pool.query('update menu_item set (name,price,tag, desc, discount, dis_prem, available) = ($1, $2, $3, $4, $5, $6, $7) where name=$8;', 
            [new_name, new_price, str, new_desc, new_discount, new_discount_prem, new_available, name]);
    }

    static get_all(){
        return pool.query('select name from menu_item;');
    }
    static get_all1(){
        return pool.query('select * from menu_item where available = true;');
    }

    static get_similar(key1){
        return pool.query('select * from menu_item where name like %$1%;',[key1]);
    }

    static get_itemtags(tag){
        return pool.query('select * from menu_item where $1= ANY(tag);',[tag]);
        // return pool.query('select * from menu_item where $1= ANY(tag);',[tag]);
    }
    
    static create_menu_item(name1,price1,tag1){
        var q = 'insert into menu_item(name,price,tag,rating,available,num_orders) values($1,$2,ARRAY[';
        tag1=tag1.split(',');
        var tag2 = new Array(tag1.length + 2);
        tag2[0] = name1;
        tag2[1] = price1;
        var i;var j=3;
        for(i=0;i<tag1.length;i++){
            q=q+'$'+j+',';
            j=j+1;
            tag2[i + 2] = tag1[i];
        }
        q=q.slice(0,-1);
        q=q+'],3,true,0)';
        // tag1.ushift(price1);tag1.ushift(name1);
        return pool.query(q,tag2);
    }

    static get_all_menus(){
        return pool.query('select ID,name,price,tag from menu_item;');
    }

    static update_menu(a,b,c,d){
        var d1;
        if(d==1){
            d1=true;
        }
        else{
            d1=false;
        }
        var q='update menu_item set (price,tag,available) = ($1,ARRAY[';
        var b=b.split(',');
        var b1 = new Array(b.length + 3);
        b1[0] = c;
        b1[1] = d1;
        b1[2] = a;
        for(i=0;i<b.length;i++){
            b1[i + 3] = b[i];
        }
        var i;var j=4;
        console.log("update_menu : ", a, b, c, d);
        for(i=0;i<b.length;i++){
            q=q+'$'+j+',';
            j=j+1;
        }
        q=q.slice(0,-1);
        q=q+'],$2) where ID=$3';
        // b.ushift(a);b.ushift(d1);b.ushift(c);
        return pool.query(q,b1);
    }


}

// https://projectsplaza.com/login-logout-nodejs-express/
// https://codeforgeek.com/manage-session-using-node-js-express-4/
