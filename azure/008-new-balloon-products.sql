/* Ejecutar en goldenbloom para incorporar los nuevos globos al constructor. Reejecutable. */
SET XACT_ABORT ON;
BEGIN TRANSACTION;

DECLARE @balloons TABLE (sku varchar(100) PRIMARY KEY, variant nvarchar(100), display_order int);
INSERT INTO @balloons(sku,variant,display_order) VALUES
('ADD-GLOBO-SB-1',N'Estrella Rosa Claro',223),
('ADD-GLOBO-SB-2',N'Estrella Fucsia',224),
('ADD-GLOBO-SB-3',N'Estrella Fucsia Holográfica',225),
('ADD-GLOBO-SG-1',N'Estrella Oro Rosa',226),
('ADD-GLOBO-SG-2',N'Estrella Morada',227),
('ADD-GLOBO-SG-3',N'Estrella Morada Holográfica',228),
('ADD-GLOBO-SP-1',N'Estrella Champán',229),
('ADD-GLOBO-SP-2',N'Estrella Plateada',230),
('ADD-GLOBO-SP-3',N'Estrella Dorada Holográfica',231),
('ADD-GLOBO-SP-4',N'Estrella Dorada',232),
('ADD-GLOBO-SP-5',N'Estrella Roja',233),
('ADD-GLOBO-SP-6',N'Estrella Turquesa',234),
('ADD-GLOBO-SP-7',N'Estrella Azul',235),
('ADD-GLOBO-SR-1',N'Estrella Verde',236),
('ADD-GLOBO-SS-1',N'Estrella Negra',237);

UPDATE option_row SET option_group='addon',name=N'Globo',color_name=balloon.variant,
  unit_price=1500,min_quantity=0,max_quantity=5,display_order=balloon.display_order,is_active=1
FROM dbo.BuilderOptions option_row JOIN @balloons balloon ON balloon.sku=option_row.sku;

INSERT INTO dbo.BuilderOptions(id,sku,option_group,name,color_name,unit_price,min_quantity,max_quantity,display_order,is_active)
SELECT NEWID(),balloon.sku,'addon',N'Globo',balloon.variant,1500,0,5,balloon.display_order,1
FROM @balloons balloon
WHERE NOT EXISTS (SELECT 1 FROM dbo.BuilderOptions option_row WHERE option_row.sku=balloon.sku);

IF OBJECT_ID(N'dbo.InventoryItems',N'U') IS NOT NULL
BEGIN
  UPDATE inventory SET name=CONCAT(N'Globo ',balloon.variant),item_type='component',unit='unidad',is_active=1,updated_at=SYSUTCDATETIME()
  FROM dbo.InventoryItems inventory JOIN @balloons balloon ON balloon.sku=inventory.sku;

  INSERT INTO dbo.InventoryItems(sku,name,item_type,unit,current_stock,minimum_stock,is_active)
  SELECT balloon.sku,CONCAT(N'Globo ',balloon.variant),'component','unidad',0,0,1
  FROM @balloons balloon
  WHERE NOT EXISTS (SELECT 1 FROM dbo.InventoryItems inventory WHERE inventory.sku=balloon.sku);
END;

COMMIT TRANSACTION;
