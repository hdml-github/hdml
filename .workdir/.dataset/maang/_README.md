https://www.kaggle.com/datasets/soumendraprasad/stock

## Postgres:

```sql
CREATE TABLE amazon_stock (
    open numeric,
    high numeric,
    low numeric,
    close numeric,
    adj_close numeric,
    volume bigint,
    date date,
    PRIMARY KEY (date)
);
COPY amazon_stock FROM '/dataset/maang/amazon.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE apple_stock (
    open numeric,
    high numeric,
    low numeric,
    close numeric,
    adj_close numeric,
    volume bigint,
    date date,
    PRIMARY KEY (date)
);
COPY apple_stock FROM '/dataset/maang/apple.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE google_stock (
    open numeric,
    high numeric,
    low numeric,
    close numeric,
    adj_close numeric,
    volume bigint,
    date date,
    PRIMARY KEY (date)
);
COPY google_stock FROM '/dataset/maang/google.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE microsoft_stock (
    open numeric,
    high numeric,
    low numeric,
    close numeric,
    adj_close numeric,
    volume bigint,
    date date,
    PRIMARY KEY (date)
);
COPY microsoft_stock FROM '/dataset/maang/microsoft.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE netflix_stock (
    open numeric,
    high numeric,
    low numeric,
    close numeric,
    adj_close numeric,
    volume bigint,
    date date,
    PRIMARY KEY (date)
);
COPY netflix_stock FROM '/dataset/maang/netflix.csv' DELIMITER ',' CSV HEADER;
```

## MySQL

```sql
CREATE TABLE amazon_stock (
    open DECIMAL(22, 20),
    high DECIMAL(22, 20),
    low DECIMAL(22, 20),
    close DECIMAL(22, 20),
    adj_close DECIMAL(22, 20),
    volume BIGINT,
    date DATE,
    PRIMARY KEY (date)
);
LOAD DATA INFILE '/dataset/maang/amazon.csv'
INTO TABLE amazon_stock
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

CREATE TABLE apple_stock (
    open DECIMAL(22, 20),
    high DECIMAL(22, 20),
    low DECIMAL(22, 20),
    close DECIMAL(22, 20),
    adj_close DECIMAL(22, 20),
    volume BIGINT,
    date DATE,
    PRIMARY KEY (date)
);
LOAD DATA INFILE '/dataset/maang/apple.csv'
INTO TABLE apple_stock
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

CREATE TABLE google_stock (
    open DECIMAL(22, 20),
    high DECIMAL(22, 20),
    low DECIMAL(22, 20),
    close DECIMAL(22, 20),
    adj_close DECIMAL(22, 20),
    volume BIGINT,
    date DATE,
    PRIMARY KEY (date)
);
LOAD DATA INFILE '/dataset/maang/google.csv'
INTO TABLE google_stock
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;

CREATE TABLE microsoft_stock (
    open DECIMAL(22, 20),
    high DECIMAL(22, 20),
    low DECIMAL(22, 20),
    close DECIMAL(22, 20),
    adj_close DECIMAL(22, 20),
    volume BIGINT,
    date DATE,
    PRIMARY KEY (date)
);
LOAD DATA INFILE '/dataset/maang/microsoft.csv'
INTO TABLE microsoft_stock
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;

CREATE TABLE netflix_stock (
    open DECIMAL(22, 20),
    high DECIMAL(22, 20),
    low DECIMAL(22, 20),
    close DECIMAL(22, 20),
    adj_close DECIMAL(22, 20),
    volume BIGINT,
    date DATE,
    PRIMARY KEY (date)
);
LOAD DATA INFILE '/dataset/maang/netflix.csv'
INTO TABLE netflix_stock
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;
```