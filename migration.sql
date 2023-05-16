DROP TABLE IF EXISTS contacts;

CREATE TABLE contacts (
    id SERIAL PRIMARY KEY ,
    first_name TEXT ,
    last_name TEXT ,
    phone_number VARCHAR(10) ,
    address TEXT 
);

