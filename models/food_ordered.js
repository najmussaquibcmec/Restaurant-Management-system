
const pool= require('../utils/database');
module.exports = class food_ord{

	constructor( user_id, item_id, quantity){
        this.order_num = order_num;
        this.item_id = item_id;
        this.quantity = quantity;
    }

	static skip_feedback(q1,c){
		return pool.query(q1,c);
	}

	static give_feedback(q,c){
		return pool.query(q,c);
	}

	static get_attendance(date, from, num_hr){
		console.log(from, typeof(from));
		console.log(num_hr, typeof(num_hr));
		return pool.query('select coalesce(sum(num_persons),0) as npers from table_slots where reserved_date=$1 and $3 > reserved_hour and $2<reserved_hour+time_allotted;',[date, from, from + num_hr]);
	}

	static book_table(persons, date, from, id, num_hr){
		console.log("book_table : ", persons, date, from, id, num_hr);
		console.log("book_table : ", typeof(persons), typeof(date), typeof(from), typeof(id), typeof(num_hr));
		return pool.query('insert into table_slots(num_persons, reserved_date, reserved_hour, customer_id, time_allotted) values($1, $2, $3, $4, $5);', [persons, date, from, id, num_hr]);
	}

	static delete_table_rows(){
		return pool.query('delete from table_slots where reserved_date<CURRENT_DATE;')
	}
};
