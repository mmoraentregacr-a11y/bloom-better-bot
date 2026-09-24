/* Ejecutar en goldenbloom antes de publicar los globos del constructor. Reejecutable. */
SET XACT_ABORT ON;
BEGIN TRANSACTION;

DECLARE @balloons TABLE (sku varchar(100) PRIMARY KEY, variant nvarchar(100), display_order int);
INSERT INTO @balloons(sku,variant,display_order) VALUES
('ADD-GLOBO-MAMA-1',N'Feliz Día Mamá 1',201),
('ADD-GLOBO-MAMA-2',N'Feliz Día Mamá 2',202),
('ADD-GLOBO-MAMA-3',N'Feliz Día Mamá 3',203),
('ADD-GLOBO-MAMA-4',N'Feliz Día Mamá 4',204),
('ADD-GLOBO-MAMA-5',N'Feliz Día Mamá 5',205),
('ADD-GLOBO-GRAD-1',N'Graduación 1',206),
('ADD-GLOBO-GRAD-2',N'Graduación 2',207),
('ADD-GLOBO-GRAD-3',N'Graduación 3',208),
('ADD-GLOBO-GRAD-4',N'Graduación 4',209),
('ADD-GLOBO-GRAD-5',N'Graduación 5',210),
('ADD-GLOBO-CUMPLE-1',N'Feliz Cumpleaños 1',211),
('ADD-GLOBO-CUMPLE-2',N'Feliz Cumpleaños 2',212),
('ADD-GLOBO-CUMPLE-3',N'Feliz Cumpleaños 3',213),
('ADD-GLOBO-CUMPLE-4',N'Feliz Cumpleaños 4',214),
('ADD-GLOBO-CUMPLE-5',N'Feliz Cumpleaños 5',215),
('ADD-GLOBO-CUMPLE-6',N'Feliz Cumpleaños 6',216),
('ADD-GLOBO-AMOR-1',N'Amor 1',217),
('ADD-GLOBO-AMOR-2',N'Amor 2',218),
('ADD-GLOBO-AMOR-3',N'Amor 3',219),
('ADD-GLOBO-AMOR-4',N'Amor 4',220),
('ADD-GLOBO-AMOR-5',N'Amor 5',221),
('ADD-GLOBO-AMOR-6',N'Amor 6',222);

UPDATE option_row SET option_group='addon',name=N'Globo',color_name=balloon.variant,
  unit_price=1500,min_quantity=0,max_quantity=5,display_order=balloon.display_order,is_active=1
FROM dbo.BuilderOptions option_row JOIN @balloons balloon ON balloon.sku=option_row.sku;

INSERT INTO dbo.BuilderOptions(id,sku,option_group,name,color_name,unit_price,min_quantity,max_quantity,display_order,is_active)
SELECT NEWID(),balloon.sku,'addon',N'Globo',balloon.variant,1500,0,5,balloon.display_order,1
FROM @balloons balloon
WHERE NOT EXISTS (SELECT 1 FROM dbo.BuilderOptions option_row WHERE option_row.sku=balloon.sku);

UPDATE dbo.BuilderOptions SET is_active=0
WHERE sku IN ('ADD-GLOBO-ROJO','ADD-GLOBO-ROSA','ADD-GLOBO-DORADO');

IF OBJECT_ID(N'dbo.InventoryItems',N'U') IS NOT NULL
BEGIN
  UPDATE inventory SET name=CONCAT(N'Globo ',balloon.variant),item_type='component',unit='unidad',is_active=1,updated_at=SYSUTCDATETIME()
  FROM dbo.InventoryItems inventory JOIN @balloons balloon ON balloon.sku=inventory.sku;

  INSERT INTO dbo.InventoryItems(sku,name,item_type,unit,current_stock,minimum_stock,is_active)
  SELECT balloon.sku,CONCAT(N'Globo ',balloon.variant),'component','unidad',0,0,1
  FROM @balloons balloon
  WHERE NOT EXISTS (SELECT 1 FROM dbo.InventoryItems inventory WHERE inventory.sku=balloon.sku);

  UPDATE dbo.InventoryItems SET is_active=0,updated_at=SYSUTCDATETIME()
  WHERE sku IN ('ADD-GLOBO-ROJO','ADD-GLOBO-ROSA','ADD-GLOBO-DORADO');
END;

COMMIT TRANSACTION;
