const pool= require('../utils/database');
module.exports = class raw_materials{

    constructor( name, chem, quantity){
        this.name = name;
        this.chem = chem;
        this.quantity = quantity;
    }

    static add_new(a,b,c){
        return pool.query('insert into raw_materials (mat_name, chemistry, remain) values ($1, $2, $3);', [a,b,c]);
    }

    static update(name, quantity, flag){
        if(flag != 'Used'){
            var c = [name,quantity,'in'];
            return pool.query('insert into material_update (mat_name, quantity, time_stamp, pos_or_neg) values ($1, $2, CURRENT_TIMESTAMP, $3);', c);
        } else {
            return pool.query('insert into material_update (mat_name, quantity, time_stamp, pos_or_neg) values ($1, $2, CURRENT_TIMESTAMP, $3);', [name, quantity,'out']);
        }
    }

    static get_all(){
        return pool.query('select * from raw_materials;');
    }

    static get_all_names(){
        return pool.query('select mat_name from raw_materials;');
    }

    static get_recent(){
        return pool.query('select * from material_update order by time_stamp desc limit 5;');
    }
}
