import csv
import random
import string
import datetime

# To generate persons
with open('data/Indian-Male-Names.csv','r') as f:
	reader = csv.reader(f)
	next(reader)
	with open('persons.csv','w') as file:
		writer = csv.writer(file)
		writer.writerow(["username","password","firstname","lastname","photo","email","phone","address"])
		writer.writerow(["bargavsai","Ulfa@123","Bargav Sai","Telu","","telubargavsai@gmail.com",8309699854,"Andhra Pradesh"])
		counter = 0
		for row in reader:
			if counter > 149:
				break
			counter += 1
			id = counter
			name = row[0]
			name = name.split()
			firstname = name[0]
			number = '{:03d}'.format(random.randrange(1, 999))
			username = firstname + number
			password = ''.join(random.choices(string.ascii_uppercase + string.ascii_lowercase + string.digits, k = 8))	
			email = username + "@email.com"
			phone = '{:03d}'.format(random.randrange(5000000000,9999999999))
			address = random.choice(["H6, IIT POWAI, 500076","H5, IIT POWAI, 500076","H4, IIT POWAI, 500076"])
			writer.writerow([username,password,firstname,"","",email,phone,address])

# To generate customers
with open('persons.csv','r') as f:
	reader = csv.reader(f)
	next(reader)
	with open('customers.csv','w') as file:
		writer = csv.writer(file)
		writer.writerow(["username","password","firstname","lastname","photo","email","phone","address","premium"])
		counter = 0
		for row in reader:
			if counter > 99:
				break
			counter += 1
			premium = random.choice([True,False])
			writer.writerow([row[0],row[1],row[2],row[3],row[4],row[5],row[6],row[7],premium])


#To generate managers
with open('managers.csv','w') as file:
		writer = csv.writer(file)
		writer.writerow(["username","password","firstname","lastname","photo","email","phone","address"])
		writer.writerow(["bargavsai","ulfa@123","Bargav Sai","Telu","","telubargavsai@gmail.com",8309699854,"IIT POWAI"])


#To generate delivery persons
with open('persons.csv','r') as f:
	reader = csv.reader(f)
	for _ in range(100):
		next(reader)
	with open('delivery_persons.csv','w') as file:
		writer = csv.writer(file)
		writer.writerow(["username","password","firstname","lastname","photo","email","phone","address","prim_region","sec_region","rating","date_joined"])
		counter = 0
		for row in reader:
			if counter > 19:
				break
			counter += 1
			rating = '{}'.format(float(random.randrange(30,51))/10)
			date_joined = datetime.datetime(2021,3,18,0,0,0)
			prim_region = counter%10 + 1
			sec_region = (counter+1)%10 + 1
			writer.writerow([row[0],row[1],row[2],row[3],row[4],row[5],row[6],row[7],prim_region,sec_region,rating,date_joined])


#To generate staff
with open('persons.csv','r') as f:
	reader = csv.reader(f)
	for _ in range(120):
		next(reader)
	with open('staff.csv','w') as file:
		writer = csv.writer(file)
		writer.writerow(["username","password","firstname","lastname","photo","email","phone","address","salary","date_joined"])
		counter = 0
		for row in reader:
			if counter > 9:
				break
			counter += 1
			salaries = [25000,30000,35000,40000,45000,50000]
			salary = '{}'.format(salaries[random.randrange(0,6)])
			date_joined = datetime.datetime(2021,3,18,0,0,0)
			writer.writerow([row[0],row[1],row[2],row[3],row[4],row[5],row[6],row[7],salary,date_joined])


#To generate menu in restaurant
with open('data/indian_food.csv','r') as f:
	raw_mater_dict = {}
	raw_mat_id = 1
	counter1 = 1
	# ingredients = set()

	reader = csv.reader(f)
	next(reader)
	with open('material_update.csv', 'w') as f1:
		writer1 = csv.writer(f1)
		writer1.writerow(["material_name", "quantity", "timestamp", "pos_or_neg"])

		with open('raw_materials.csv','w') as f2:
			writer2 = csv.writer(f2)
			writer2.writerow(["material_name","state","quantity_rem"])

			with open('ingredients.csv', 'w') as f3:
				writer3 = csv.writer(f3)
				writer3.writerow(["item_id","material_name","quantity"])
			
				with open('menu.csv','w') as file:
					writer = csv.writer(file)
					writer.writerow(["name","price","tag","desc","discount","discount_prem","rating","availability","order_count"])
					counter = 1
					for row in reader:
						id = counter
						counter += 1
						name = row[0]
						price = '{:03d}'.format(random.randrange(200,400))
						tag = set()
						tag.add(row[2])
						tag.add(row[5])
						tag.add(row[6])
						# tag = list([row[2],row[5],row[6]])
						# tag = row[2]
						desc = row[5] + ' ' + row[6]
						rating = '{}'.format(float(random.randrange(30,51))/10)
						availability = bool(random.choice([True,False]))
						writer.writerow([name,price,tag,desc,0,0,rating,availability,0])

						s = row[1]
						s = s.split(',')
						s = [i.strip() for i in s]
						for i in s:
							i = i.lower()
							try: 
								raw_mater_dict[i]
								pass
							except :
								raw_mater_dict[i] = raw_mat_id
								raw_mat_id += 1
								x = random.randrange(1,10)
								y = random.randrange(1,5)
								writer2.writerow([i, random.choice(["S","L"]), x])
								# Timestamp - choose what to write.
								# Also every used has the first menu item it used.
								writer1.writerow([i, x + y, datetime.datetime.now(), 'in'])
								writer1.writerow([i, y, datetime.datetime.now(), 'out'])
								counter1 += 2

							quantity3 = random.randrange(1,4)
							writer3.writerow([id, i, quantity3])



#To generate Food Cart
with open('cart.csv','w') as file:
	writer = csv.writer(file)
	writer.writerow(["customer_id","item_id","quantity"])
	for i in range(1,100):
		for _ in range(random.randrange(0,4)):
			writer.writerow([i,random.randrange(1,256),random.randrange(4)])


#To generate orders and food_ordered
file1 = open('food_ordered.csv','w')
writer1 = csv.writer(file1)
writer1.writerow(["order_id","item_id","price","timestamp","quantity","comment","rating","skip_or_not"])
file2 = open('menu.csv','r')
reader1 = csv.reader(file2)
next(reader1)
menu_items = {}
no_of_orders = {}
items = []
for row in reader1:
	items.append(row[0])
	menu_items[row[0]] = row[1]
	no_of_orders[row[0]] = row[8]

# print(len(items))

with open('customers.csv','r') as f:
	reader = csv.reader(f)
	next(reader)
	with open('orders.csv','w') as file:
		writer = csv.writer(file)
		writer.writerow(["staff_id","customer_id","name","timestamp","phone","address","area_code","delivery_person","bill","status"])
		counter = 1
		year = 2021
		month = 4
		day = 1
		hour = 10
		minute = 0
		order_no = counter
		for row in reader:
			if counter > 25:
				break
			# order_no = counter
			customer_id = counter
			counter += 1
			name = row[0]
			phone = row[6]
			address = row[7]
			status = ['yet_to_be', 'ready_to_dispatch', 'delivered', 'completed']
			
			for i in range(4):
				order_date = datetime.datetime(year,month,(day+i)%27+1,hour,minute)
				staff_id = random.randrange(152,157)
				area_code = random.randrange(1,6)
				delivery_person = random.choice([156+area_code,157+area_code%5])
				item_id = random.randrange(1,200)
				rating = '{}'.format(random.randrange(0,6))
				quantity = random.randrange(1,4)
				total_price = int(menu_items[items[item_id]])*quantity
				bill = total_price
				skip_or_not = random.choice([True,False])
				if i==0 or i==1:
					delivery_person = 'null'
				writer.writerow([staff_id,customer_id,name,order_date,phone,address,area_code,delivery_person,bill,status[i]])
				writer1.writerow([order_no+i,item_id,total_price,order_date,quantity,"",rating,skip_or_not])
			day += 1
			if day == 28:
				month += 1
				day = 1
			order_no = order_no + 4
		

file1.close()
#To change no of orders in menu
file3 = open('food_ordered.csv','r')
reader3 = csv.reader(file3)
next(reader3)

for row in reader3:
	no_of_orders[row[1]] = int(row[4])

r = csv.reader(open('menu.csv'))
lines = list(r)

for l in lines[1:]:
	l[8] = no_of_orders[l[0]]

writer = csv.writer(open('menu.csv','w'))
writer.writerows(lines)

#To generate Tables
# with open('tables.csv','w') as file:
# 	writer = csv.writer(file)
# 	writer.writerow(["num_persons","reserved_date","reserved_hour","customer_id","time_allotted"])
# 	reserved_date = datetime.date(2021,3,19)
# 	for i in range(1,21):
# 		reserved_hour = random.randrange(9,19)
# 		customer_id = random.randrange(1,101)
# 		time_allotted = random.randrange(1,4)
# 		num_persons = random.randrange(1,7)
# 		writer.writerow([num_persons,reserved_date,reserved_hour,customer_id,time_allotted])

		
