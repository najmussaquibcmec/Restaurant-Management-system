import csv

with open("persons.csv","r") as file:
	csvreader = csv.reader(file)
	fields = next(csvreader)
	with open("persons.sql","w") as f:
		for row in csvreader:
			str1 = "insert into person (username,pswd,first_name,last_name,photo,email,phone,addr) values(" + "'"+row[0]+"'," + "'"+row[1]+"'," + "'"+row[2]+"'," + "'"+row[3]+"'," + "'"+row[4]+"'," + "'"+row[5]+"'," + row[6] + ",'"+row[7]+"'" +");\n"
			f.write(str1)

with open("persons.csv","r") as file:
	csvreader = csv.reader(file)
	fields = next(csvreader)
	with open("customer.sql","w") as f:
		for row in csvreader:
			str1 = "insert into customer (username,pswd,first_name,last_name,photo,email,phone,addr,premium) values(" + "'"+row[0]+"'," + "'"+row[1]+"'," + "'"+row[2]+"'," + "'"+row[3]+"'," + "'"+row[4]+"'," + "'"+row[5]+"'," + row[6] + ",'"+row[7]+"',"+ str(False) +");\n"
			f.write(str1)

with open("staff.sql","w") as f:
	str1 = "insert into staff (username,pswd,first_name,last_name,photo,email,phone,addr,salary,date_joined,accepted) values('staff1','staff1','staff1_name','','','staff1@email.com',9999999999,'POWAI',30000,CURRENT_TIMESTAMP,True);\n"	
	str2 = "insert into staff (username,pswd,first_name,last_name,photo,email,phone,addr,salary,date_joined,accepted) values('staff2','staff2','staff2_name','','','staff2@email.com',9999999999,'POWAI',30000,CURRENT_TIMESTAMP,True);\n"	
	str3 = "insert into staff (username,pswd,first_name,last_name,photo,email,phone,addr,salary,date_joined,accepted) values('staff3','staff3','staff3_name','','','staff3@email.com',9999999999,'POWAI',30000,CURRENT_TIMESTAMP,True);\n"	
	str4 = "insert into staff (username,pswd,first_name,last_name,photo,email,phone,addr,salary,date_joined,accepted) values('staff4','staff4','staff4_name','','','staff4@email.com',9999999999,'POWAI',30000,CURRENT_TIMESTAMP,True);\n"	
	str5 = "insert into staff (username,pswd,first_name,last_name,photo,email,phone,addr,salary,date_joined,accepted) values('staff5','staff5','staff5_name','','','staff5@email.com',9999999999,'POWAI',30000,CURRENT_TIMESTAMP,True);\n"	
	f.write(str1)
	f.write(str2)
	f.write(str3)
	f.write(str4)
	f.write(str5)

with open("delivery_person.sql","w") as f:
	str1 = "insert into delivery_person (username,pswd,first_name,last_name,photo,email,phone,addr,prim_region,sec_region,rating,date_joined) values('delivery1','delivery1','delivery1_name','','','delivery1@email.com',9999999999,'POWAI',1,5,0,CURRENT_TIMESTAMP);\n"	
	str2 = "insert into delivery_person (username,pswd,first_name,last_name,photo,email,phone,addr,prim_region,sec_region,rating,date_joined) values('delivery2','delivery2','delivery2_name','','','delivery2@email.com',9999999999,'POWAI',2,4,0,CURRENT_TIMESTAMP);\n"	
	str3 = "insert into delivery_person (username,pswd,first_name,last_name,photo,email,phone,addr,prim_region,sec_region,rating,date_joined) values('delivery3','delivery3','delivery3_name','','','delivery3@email.com',9999999999,'POWAI',3,3,0,CURRENT_TIMESTAMP);\n"	
	str4 = "insert into delivery_person (username,pswd,first_name,last_name,photo,email,phone,addr,prim_region,sec_region,rating,date_joined) values('delivery4','delivery4','delivery4_name','','','delivery4@email.com',9999999999,'POWAI',4,2,0,CURRENT_TIMESTAMP);\n"	
	str5 = "insert into delivery_person (username,pswd,first_name,last_name,photo,email,phone,addr,prim_region,sec_region,rating,date_joined) values('delivery5','delivery5','delivery5_name','','','delivery5@email.com',9999999999,'POWAI',5,1,0,CURRENT_TIMESTAMP);\n"	
	f.write(str1)
	f.write(str2)
	f.write(str3)
	f.write(str4)
	f.write(str5)

with open("manager.sql","w") as f:
	str1 = "insert into manager (username,pswd,first_name,last_name,photo,email,phone,addr) values('manager','manager','manager_name','','','manager@email.com',9999999999,'POWAI');\n"	
	f.write(str1)

with open("menu.csv","r") as file:
	csvreader = csv.reader(file)
	fields = next(csvreader)
	with open("menu.sql","w") as f:
		for row in csvreader:
			tag = row[2]
			tag = tag[1:-1]
			# print(tag[1:-1])
			# print(type(tag))
			# for i in tag:
			# 	print(i)
			tag = tag.split(',')
			# tag.replace("'",'"')
			tag = [i.replace("'",'"') for i in tag]
			# print(tag)
			str1 = "'{"
			for i in tag:
				# str1 += '"'
				str1 += i
				str1 += ',' 
			str1 = str1[:-1]
			str1 += "}'"
			# print(str1)
			str2 = "insert into menu_item (name, price, tag, discount, dis_prem, rating, available, num_orders) values (" + "'"+row[0]+"'," + row[1]+"," + str1 +',' + row[4]+"," + row[5]+"," + row[6]+"," + row[7] + ","+ row[8] +");\n"
			f.write(str2)


with open("orders.csv","r") as file:
	csvreader = csv.reader(file)
	fields = next(csvreader)
	# print(fields)
	with open("orders.sql","w") as f:
		for row in csvreader:
			# print(row[5])
			str1 = "insert into customer_order (staff_ID,customer_ID,cust_name,time_stamp,phone,addr,area_code,DP,bill,stat) values(" + row[0]+"," + row[1]+"," + "'"+row[2]+"','" + row[3]+"'," + row[4]+"," + "'"+row[5]+"'," + row[6] + ","+row[7] + ","+ row[8] + "," + "'" +row[9] +"');\n"
			f.write(str1)


with open("material_update.csv","r") as file:
	csvreader = csv.reader(file)
	fields = next(csvreader)
	with open("material_update.sql","w") as f:
		for row in csvreader:
			str1 = "insert into material_update (mat_name, quantity, time_stamp, pos_or_neg) values (" + "'" + row[0] + "'," + row[1] + ",'" + row[2] + "','" + row[3] + "'" + ");\n"
			f.write(str1)


# with open("tables.csv","r") as file:
# 	csvreader = csv.reader(file)
# 	fields = next(csvreader)
# 	with open("tables.sql","w") as f:
# 		for row in csvreader:
# 			str1 = "insert into table_slots (num_persons, reserved_date, reserved_hour, customer_ID, time_allotted) values(" + row[0]+",'" + row[1]+"','" + row[2]+"'," + row[3]+"," + row[4]+ ");\n"
# 			f.write(str1)
