CREATE TABLE Customers (
  id nvarchar(128) NOT NULL PRIMARY KEY,
  email nvarchar(320) NOT NULL,
  name nvarchar(160) NOT NULL,
  phone nvarchar(30) NULL,
  created_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE UNIQUE INDEX UX_Customers_Email ON Customers(email);

CREATE TABLE Orders (
  id uniqueidentifier NOT NULL PRIMARY KEY,
  customer_id nvarchar(128) NOT NULL REFERENCES Customers(id),
  total decimal(12,2) NOT NULL CHECK(total >= 0),
  status varchar(20) NOT NULL CHECK(status IN ('pending','paid','cancelled')),
  delivery_json nvarchar(max) NOT NULL,
  created_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
  paid_at datetime2 NULL
);

CREATE TABLE OrderItems (
  id bigint IDENTITY PRIMARY KEY,
  order_id uniqueidentifier NOT NULL REFERENCES Orders(id),
  product_id nvarchar(128) NOT NULL,
  name nvarchar(240) NOT NULL,
  unit_price decimal(12,2) NOT NULL CHECK(unit_price >= 0),
  quantity int NOT NULL CHECK(quantity > 0)
);

CREATE TABLE Loyalty (
  customer_id nvarchar(128) NOT NULL PRIMARY KEY REFERENCES Customers(id),
  purchase_count int NOT NULL DEFAULT 0 CHECK(purchase_count BETWEEN 0 AND 10),
  cycle_spend decimal(12,2) NOT NULL DEFAULT 0,
  updated_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE Benefits (
  id uniqueidentifier NOT NULL DEFAULT NEWID() PRIMARY KEY,
  customer_id nvarchar(128) NOT NULL REFERENCES Customers(id),
  source_order_id uniqueidentifier NOT NULL REFERENCES Orders(id),
  kind varchar(24) NOT NULL CHECK(kind IN ('free_shipping','credit','discount_10')),
  amount decimal(12,2) NOT NULL DEFAULT 0,
  created_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
  redeemed_at datetime2 NULL
);

CREATE INDEX IX_Orders_Customer ON Orders(customer_id,created_at DESC);
CREATE INDEX IX_Benefits_Customer ON Benefits(customer_id,redeemed_at);
