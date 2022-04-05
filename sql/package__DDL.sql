CREATE TABLE frentecorret.package (
	id serial4 NOT NULL,
	paper_money_type int4 NOT NULL,
	opened_at timestamp NOT NULL DEFAULT now(),
	closed_at timestamp NULL,
	paper_money_total int4 NULL,
	CONSTRAINT package_pk PRIMARY KEY (id)
);