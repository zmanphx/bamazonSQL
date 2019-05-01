create database bamazon;

use bamazon;
create Table products(
                      item_id  INTEGER AUTO_INCREMENT NOT NULL,
                     
                      product_name varchar(50) NOT NULl,
                      department_name varchar(50) NOT NULL,
                      price decimal (7,2) ,
                      stock_quantity integer ,
                       PRIMARY KEY(item_id)
                      


);

use bamazon;
select * from products;
Insert into products (product_name, department_name, price, stock_quantity) values ("backpack", "camping", 65.00, 10);
Insert into products (product_name, department_name, price, stock_quantity) values ("snow boots", "camping", 165.00, 12);
Insert into products (product_name, department_name, price, stock_quantity) values ("fleece Jacket", "camping", 85.00, 15);
Insert into products (product_name, department_name, price, stock_quantity) values ("Leather Gloves", "camping", 35.00, 12);
Insert into products (product_name, department_name, price, stock_quantity) values ("shovel", "gardening", 22.00, 20);
Insert into products (product_name, department_name, price, stock_quantity) values ("shears", "gardening", 10.00, 15);
Insert into products (product_name, department_name, price, stock_quantity) values ("AA battery", "electronics", 5.00, 10);
Insert into products (product_name, department_name, price, stock_quantity) values ("flash light", "electronics", 15.00, 5);
Insert into products (product_name, department_name, price, stock_quantity) values ("white paint", "painting", 25.00, 20);
Insert into products (product_name, department_name, price, stock_quantity) values ("paint brush", "painting", 10.00, 18);

use bamazon;
CREATE PROCEDURE allproducts()
BEGIN
   SELECT item_id as id , product_name as item ,price, stock_quantity as available   
   FROM products;
END;

