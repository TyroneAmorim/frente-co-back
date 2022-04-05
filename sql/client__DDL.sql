CREATE TABLE frentecorret.client (
	id serial4 NOT NULL,
	"name" varchar NOT NULL,
	address_id int4 NULL,
	birth_date date NOT NULL,
	cpf varchar NOT NULL,
	email varchar NOT NULL,
	"password" varchar NOT NULL,
	deleted_at timestamp NULL,
	CONSTRAINT client_pk PRIMARY KEY (id),
	CONSTRAINT client_fk FOREIGN KEY (address_id) REFERENCES frentecorret.address(id)
);