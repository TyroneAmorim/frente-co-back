CREATE TABLE frentecorret.operation (
	id serial4 NOT NULL,
	client_id int4 NOT NULL,
	value money NOT NULL,
	paper_money_type int4 NOT NULL,
	main_operation int4 NULL,
	package_id int4 NOT NULL,
	reserved bool NULL,
	closed bool NULL,
	opened_at timestamp NULL,
	closed_at timestamp NULL,
	CONSTRAINT operation_pk PRIMARY KEY (id),
	CONSTRAINT operation_fk FOREIGN KEY (package_id) REFERENCES frentecorret.package(id),
	CONSTRAINT operation_fk3 FOREIGN KEY (client_id) REFERENCES frentecorret.client(id)
);