drop table if exists ingredients;
drop table if exists material_update;
drop table if exists raw_materials;
drop table if exists cart;
drop table if exists food_ordered;
drop table if exists customer_order;
drop table if exists menu_item;
drop table if exists table_slots;
drop table if exists staff;
drop table if exists delivery_person;
drop table if exists customer;
drop table if exists manager;
drop table if exists person;


create table person(
    ID serial PRIMARY KEY,
    username    varchar(200) UNIQUE NOT NULL,
    pswd        varchar NOT NULL,
    first_name  text,
    last_name   text,
    photo       text,
    email       text UNIQUE NOT NULL,
    phone       bigint NOT NULL,
    addr        text NOT NULL
);

create table customer(
    premium     boolean NOT NULL
) INHERITS (person);

create table manager(
)  INHERITS (person);

create table delivery_person(
    prim_region int NOT NULL,
    sec_region  int NOT NULL,
    rating      float 
    check(rating >= 0 and rating <= 5),
    date_joined timestamp NOT NULL
)  INHERITS (person);

create table staff(
    salary      int NOT NULL,
    date_joined timestamp NOT NULL,
    accepted  boolean NOT NULL
)  INHERITS (person);

ALTER TABLE staff ADD CONSTRAINT email_unique1 UNIQUE(email);
ALTER TABLE manager ADD CONSTRAINT email_unique2 UNIQUE(email);
ALTER TABLE delivery_person ADD CONSTRAINT email_unique3 UNIQUE(email);
ALTER TABLE customer ADD CONSTRAINT email_unique4 UNIQUE(email);
ALTER TABLE staff ADD CONSTRAINT id_unique1 UNIQUE(ID);
ALTER TABLE manager ADD CONSTRAINT id_unique2 UNIQUE(ID);
ALTER TABLE delivery_person ADD CONSTRAINT id_unique3 UNIQUE(id);
ALTER TABLE customer ADD CONSTRAINT id_unique4 UNIQUE(id);

create table menu_item(
    ID serial PRIMARY KEY,
    name text UNIQUE NOT NULL,
    price       int NOT NULL,
    tag         text[],
    discount    int,
    dis_prem    int,
    rating      float
    check(rating >= 0 and rating <= 5),
    available   boolean NOT NULL,
    num_orders      int NOT NULL
);

create table customer_order(
    order_no serial PRIMARY KEY,
    staff_ID    int,
    customer_ID int,
    cust_name   text NOT NULL,
    time_stamp  timestamp NOT NULL,
    phone       bigint NOT NULL,
    addr        text NOT NULL,
    area_code   int,
    DP          int,
    bill        int NOT NULL,
    stat        text
    check(stat in ('yet_to_be', 'ready_to_dispatch', 'out_for_delivery', 'delivered','completed')) NOT NULL,
    foreign key (customer_ID) references customer(ID),
    foreign key (staff_ID) references staff(ID),
    foreign key (DP) references delivery_person(ID)
);

create table food_ordered(
    order_no    int NOT NULL,
    item_ID     int NOT NULL,
    price       int NOT NULL,
    order_date  date NOT NULL,
    quantity    int NOT NULL,
    comment     text,
    rating      int
    check(rating in (0, 1, 2, 3, 4, 5)),
    skip_or_not boolean NOT NULL,
    primary key (order_no, item_ID),
    foreign key (order_no) references customer_order(order_no),
    foreign key (item_ID) references menu_item(ID)
);

create table cart(
    customer_ID int NOT NULL,
    item_ID     int NOT NULL,
    quantity    int NOT NULL,
    primary key (customer_ID, item_ID),
    foreign key (customer_ID) references customer(ID),
    foreign key (item_ID) references menu_item(ID)
);

create table raw_materials(
    mat_name    text PRIMARY KEY,
    chemistry   char(1)
    check(chemistry in ('S', 'L')) NOT NULL,
    remain      float NOT NULL
);

create table material_update(
    ID serial PRIMARY KEY,
    mat_name    text NOT NULL,
    quantity    float NOT NULL,
    time_stamp  timestamp NOT NULL,
    pos_or_neg  text 
    check(pos_or_neg in ('in', 'out')) NOT NULL,
    foreign key (mat_name) references raw_materials(mat_name)
);

create table ingredients(
    item_ID     int NOT NULL,
    mat_name    text NOT NULL,
    quantity    float NOT NULL,
    primary key (item_ID, mat_name),
    foreign key (mat_name) references raw_materials(mat_name),
    foreign key (item_ID) references menu_item(ID)
);

create table table_slots(
    ID serial PRIMARY KEY,
    num_persons     int NOT NULL,
    reserved_date   date NOT NULL,
    reserved_hour   int NOT NULL,
    customer_ID     int NOT NULL,
    time_allotted   int
    check(time_allotted in (1,2,3)) NOT NULL,
    foreign key (customer_ID) references customer(ID)
);

-- Indices

CREATE INDEX ind1 ON food_ordered(order_date);
CREATE INDEX ind2 ON customer_order(customer_id);
CREATE INDEX ind3 ON menu_item(tag);
CREATE INDEX ind4 ON customer_order(stat);

-- Delete functions

drop function if exists get_orders_count;
drop function if exists update_ordercount_in_menu;
drop function if exists delete_cart;
drop function if exists get_remain_raw_materials;
drop function if exists update_quantity_rem;

-- Functions

CREATE FUNCTION get_orders_count(item_id int)
  RETURNS int AS $$
DECLARE
  order_count integer;
BEGIN
	SELECT num_orders into order_count FROM menu_item WHERE id = item_id;
	RETURN order_count;
END;
$$ LANGUAGE PLPGSQL;

CREATE FUNCTION update_ordercount_in_menu()
  RETURNS TRIGGER AS $$
DECLARE
  order_count integer;
BEGIN
	order_count = get_orders_count(NEW.item_id);
	UPDATE menu_item SET num_orders = NEW.quantity + order_count where id = NEW.item_id;  

	RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;

CREATE FUNCTION delete_cart()
  RETURNS TRIGGER AS $$
DECLARE
  order_count integer;
BEGIN
    DELETE FROM cart where customer_ID = NEW.customer_ID; 
    RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;

CREATE FUNCTION get_remain_raw_materials(name text)
  RETURNS int AS $$
DECLARE
  remaining integer;
BEGIN
    SELECT remain into remaining FROM raw_materials WHERE mat_name = name;
    RETURN remaining;
END;
$$ LANGUAGE PLPGSQL;

CREATE FUNCTION update_quantity_rem()
  RETURNS TRIGGER AS $$
DECLARE
  remaining integer;
BEGIN
    remaining = get_remain_raw_materials(NEW.mat_name);
    IF NEW.pos_or_neg = 'in' THEN
        UPDATE raw_materials SET remain = remaining + NEW.quantity where mat_name = NEW.mat_name;
    ELSIF NEW.pos_or_neg = 'out' THEN
        IF remaining < NEW.quantity THEN
            RAISE EXCEPTION 'Cannot Spend quantity more than available in kitchen';
        ELSE
            UPDATE raw_materials SET remain = remaining - NEW.quantity where mat_name = NEW.mat_name;
        END IF;
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;

-- Triggers

CREATE TRIGGER change_order_count
  AFTER INSERT
  ON food_ordered
  FOR EACH ROW
  EXECUTE PROCEDURE update_ordercount_in_menu();

CREATE TRIGGER delete_cart_items
  AFTER INSERT
  ON customer_order
  FOR EACH ROW
  EXECUTE PROCEDURE delete_cart();

CREATE TRIGGER update_quant_rem
  AFTER INSERT
  ON material_update
  FOR EACH ROW
  EXECUTE PROCEDURE update_quantity_rem();
