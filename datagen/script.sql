\i DDL.sql
\i customer.sql
\i staff.sql
\i delivery_person.sql
\i manager.sql
\i menu.sql
\i orders.sql
\copy food_ordered from 'food_ordered.csv' DELIMITER ',' CSV HEADER;
\copy cart from 'cart.csv' DELIMITER ',' CSV HEADER;
\copy raw_materials from 'raw_materials.csv' DELIMITER ',' CSV HEADER;
\i material_update.sql
\copy ingredients from 'ingredients.csv' DELIMITER ',' CSV HEADER;
