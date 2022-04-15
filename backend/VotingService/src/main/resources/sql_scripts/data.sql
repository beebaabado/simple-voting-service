DROP TABLE VOTER;
DROP TABLE QUESTION;

CREATE TABLE question (id bigint not null, count_no integer, count_yes integer, description varchar(255), primary key (id));
CREATE TABLE voter (id bigint not null, name varchar(255), questions bit varying(255), primary key (id));

INSERT INTO QUESTION (id, description) VALUES (id_val, "Do you eat french fries with ketchup?");

INSERT INTO QUESTION (id, description) VALUES (id_val, "Do drink coffee every day?");

INSERT INTO QUESTION (id, description) VALUES (id_val, "If you found a $100 bill would you keep it?");

INSERT INTO QUESTION (id, description) VALUES (id_val, "Does your dog bark at the mailperson?");

INSERT INTO QUESTION (id, description) VALUES (id_val, "Do you like your current job?");

