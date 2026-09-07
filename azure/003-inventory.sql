/* Ejecutar una vez en la base de datos goldenbloom. No elimina datos. */
SET XACT_ABORT ON;
GO

IF OBJECT_ID(N'dbo.InventoryItems', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.InventoryItems (
    id uniqueidentifier NOT NULL DEFAULT NEWID() PRIMARY KEY,
    sku varchar(100) NOT NULL,
    name nvarchar(240) NOT NULL,
    item_type varchar(20) NOT NULL CHECK(item_type IN ('product','component')),
    unit varchar(30) NOT NULL DEFAULT 'unidad',
    current_stock decimal(12,2) NOT NULL DEFAULT 0,
    minimum_stock decimal(12,2) NOT NULL DEFAULT 0,
    is_active bit NOT NULL DEFAULT 1,
    updated_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME()
  );
  CREATE UNIQUE INDEX UX_InventoryItems_Sku ON dbo.InventoryItems(sku);
END;
GO

IF OBJECT_ID(N'dbo.InventoryMovements', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.InventoryMovements (
    id bigint IDENTITY PRIMARY KEY,
    inventory_item_id uniqueidentifier NOT NULL REFERENCES dbo.InventoryItems(id),
    movement_type varchar(20) NOT NULL CHECK(movement_type IN ('purchase','sale','damage','adjustment')),
    quantity decimal(12,2) NOT NULL CHECK(quantity <> 0),
    order_id uniqueidentifier NULL REFERENCES dbo.Orders(id),
    notes nvarchar(400) NULL,
    created_by nvarchar(320) NULL,
    created_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME()
  );
  CREATE INDEX IX_InventoryMovements_ItemDate ON dbo.InventoryMovements(inventory_item_id,created_at DESC);
  CREATE INDEX IX_InventoryMovements_Order ON dbo.InventoryMovements(order_id) WHERE order_id IS NOT NULL;
END;
GO

MERGE dbo.InventoryItems AS target
USING (
  SELECT p.sku,p.name,'product' item_type,'unidad' unit FROM dbo.Products p WHERE p.is_active=1
  UNION ALL
  SELECT b.sku,CONCAT(b.name,CASE WHEN NULLIF(b.color_name,'') IS NULL THEN '' ELSE CONCAT(' ',b.color_name) END),'component','unidad'
  FROM dbo.BuilderOptions b WHERE b.is_active=1
) AS source
ON target.sku=source.sku
WHEN MATCHED THEN UPDATE SET name=source.name,item_type=source.item_type,unit=source.unit,is_active=1,updated_at=SYSUTCDATETIME()
WHEN NOT MATCHED THEN INSERT(sku,name,item_type,unit) VALUES(source.sku,source.name,source.item_type,source.unit);
GO
