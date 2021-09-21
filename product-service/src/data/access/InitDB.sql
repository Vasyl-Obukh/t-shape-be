create extension if not exists "uuid-ossp";

CREATE TABLE if not exists public.products (
	id uuid DEFAULT uuid_generate_v4(),
	title text  NOT NULL,
    description text ,
    price integer NOT NULL,
    "imgUrl" text ,
    ram integer,
    storage text ,
    display text ,
    CONSTRAINT products_pkey PRIMARY KEY (id)
);

CREATE TABLE if not exists public.stocks (
	product_id uuid NOT NULL,
    count int4 NOT NULL,
	CONSTRAINT stocks_pkey PRIMARY KEY (product_id),
    CONSTRAINT product_id FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

INSERT INTO public.products(
	id, title, description, price, "imgUrl", ram, storage, display)
	VALUES (
        '7567ec4b-b10c-48c5-9345-fc73c48a80a1',
        'iPhone 13 Pro Max',
        'Apple iPhone 13 Pro Max',
        1599,
        'https://content2.rozetka.com.ua/goods/images/big/221301345.jpg',
        6,
        '1 TB storage',
        '6.7 inches Super Retina XDR OLED, 120Hz'
    ),
    (
        '7567ec4b-b10c-48c5-9345-fc73c48a80a1',
        'iPhone 13 Pro Max',
        'Apple iPhone 13 Pro Max',
        1399,
        'https://content2.rozetka.com.ua/goods/images/big/221301345.jpg',
        6,
        '512 GB storage',
        '6.7 inches Super Retina XDR OLED, 120Hz'
    ),
    (
        '7567ec4b-b10c-48c5-9345-fc73c48a80a2',
        'iPhone 13 Pro',
        'Apple iPhone 13 Pro',
        1299,
        'https://content.rozetka.com.ua/goods/images/big/221201562.jpg',
        6,
        '512 GB storage',
        '6.1 inches Super Retina XDR OLED, 120Hz'
    ),
    (
        '7567ec4b-b10c-48c5-9345-fc73c48a80a2',
        'iPhone 13 Pro',
        'Apple iPhone 13 Pro',
        1599,
        'https://content.rozetka.com.ua/goods/images/big/221201562.jpg',
        6,
        '1 TB storage',
        '6.1 inches Super Retina XDR OLED, 120Hz'
    ),
    (
        '7567ec4b-b10c-48c5-9345-fc73c48a80a3',
        'iPhone 13',
        'Apple iPhone 13',
        799,
        'https://content.rozetka.com.ua/goods/images/big/221214143.jpg',
        4,
        '128 GB storage',
        '6.1 inches Super Retina XDR OLED'
    ),
    (
        '7567ec4b-b10c-48c5-9345-fc73c48a80a4',
        'iPhone 13 mini',
        'Apple iPhone 13 mini',
        699,
        'https://content1.rozetka.com.ua/goods/images/big/221268379.jpg',
        4,
        '128 GB storage',
        '5.4 inches Super Retina XDR OLED'
    );

insert into stocks (product_id, count) select id, trunc(10 + random() * 25) from products;
