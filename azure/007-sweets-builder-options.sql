/* Ejecutar en goldenbloom antes de publicar los dulces del constructor. Reejecutable. */
SET XACT_ABORT ON;
BEGIN TRANSACTION;

DECLARE @sweets TABLE (sku varchar(100) PRIMARY KEY, variant nvarchar(180), unit_price decimal(12,2), display_order int);
INSERT INTO @sweets(sku,variant,unit_price,display_order) VALUES
('ADD-DULCE-PROD-5',N'Caja Ferrero Rocher 12 und',6900,301),
('ADD-DULCE-PROD-11',N'Ferrero Rocher 8 und',5500,302),
('ADD-DULCE-PROD-10',N'Ferrero Rocher 4 und',3500,303),
('ADD-DULCE-PROD-9',N'Ferrero Rocher 3 und',2500,304),
('ADD-DULCE-PROD-6',N'Caja Chocolate Vizzio 120g',3500,305),
('ADD-DULCE-PROD-18',N'Hershey’s Giant Cokies & Cream',3500,306),
('ADD-DULCE-PROD-17',N'Hershey’s Giant Almendras',3500,307),
('ADD-DULCE-PROD-16',N'Hershey’s Giant',3500,308),
('ADD-DULCE-PROD-20',N'M&M’s Maní 92g',1900,309),
('ADD-DULCE-PROD-22',N'M&M’s Original 92g',1900,310),
('ADD-DULCE-PROD-39',N'Snickers Original',1300,311),
('ADD-DULCE-PROD-42',N'Snickers con Maní',1000,312),
('ADD-DULCE-PROD-40',N'Snickers con Almendra',1300,313),
('ADD-DULCE-PROD-41',N'Snickers Chocolate Blanco',1300,314),
('ADD-DULCE-PROD-43',N'Snickers Pequeño Unidad',200,315),
('ADD-DULCE-PROD-44',N'Chocolate Tutto con Arandano',1600,316),
('ADD-DULCE-PROD-46',N'Chocolate Tutto con Crocante Belga',3000,317),
('ADD-DULCE-PROD-45',N'Chocolate Blanco Tutto Mix Nueces',1600,318),
('ADD-DULCE-PROD-47',N'Chocolate Tutto Mix Nueces',1600,319),
('ADD-DULCE-PROD-48',N'Chocolate Tutto Sin Azúcar',15000,320),
('ADD-DULCE-PROD-32',N'Chocolate Milka Leche',3200,321),
('ADD-DULCE-PROD-31',N'Chocolate Blanco Milka',1200,322),
('ADD-DULCE-PROD-30',N'Chocolate Milka Arroz Inflado',15000,323),
('ADD-DULCE-PROD-34',N'Chocolate MilkyWay',1200,324),
('ADD-DULCE-PROD-7',N'Chocolate Choys Arroz Inflado',600,325),
('ADD-DULCE-PROD-8',N'Chocolate Choys Mani',600,326),
('ADD-DULCE-PROD-37',N'Skittles Original',1300,327),
('ADD-DULCE-PROD-38',N'Skittles Wild Berry',1300,328),
('ADD-DULCE-PROD-36',N'Gomitas Perlitas',800,329),
('ADD-DULCE-PROD-14',N'Gomitas Gusanos',850,330),
('ADD-DULCE-PROD-15',N'Gomitas Gusanos Acidos',850,331),
('ADD-DULCE-PROD-13',N'Gomita Fresitas',850,332),
('ADD-DULCE-PROD-12',N'Gomitas Aros',850,333),
('ADD-DULCE-PROD-23',N'Maní con Chocolate',1900,334),
('ADD-DULCE-PROD-35',N'Pasas Chocolate',2000,335),
('ADD-DULCE-PROD-26',N'Maní Limón y Sal',1000,336),
('ADD-DULCE-PROD-24',N'Maní Garapinado',1000,337),
('ADD-DULCE-PROD-25',N'Maní Japonés',1000,338),
('ADD-DULCE-PROD-28',N'Maní Salado',1000,339),
('ADD-DULCE-PROD-27',N'Maní Pasas',1000,340),
('ADD-DULCE-PROD-29',N'Semillas Mixtas',1500,341);

UPDATE option_row SET option_group='addon',name=N'Dulce',color_name=sweet.variant,
  unit_price=sweet.unit_price,min_quantity=0,max_quantity=5,display_order=sweet.display_order,is_active=1
FROM dbo.BuilderOptions option_row JOIN @sweets sweet ON sweet.sku=option_row.sku;

INSERT INTO dbo.BuilderOptions(id,sku,option_group,name,color_name,unit_price,min_quantity,max_quantity,display_order,is_active)
SELECT NEWID(),sweet.sku,'addon',N'Dulce',sweet.variant,sweet.unit_price,0,5,sweet.display_order,1
FROM @sweets sweet
WHERE NOT EXISTS (SELECT 1 FROM dbo.BuilderOptions option_row WHERE option_row.sku=sweet.sku);

UPDATE dbo.BuilderOptions SET is_active=0
WHERE sku IN ('ADD-CHO-FERRERO-4','ADD-CHO-FERRERO-8','ADD-CHO-HERSHEY','ADD-CHO-KITKAT');

IF OBJECT_ID(N'dbo.InventoryItems',N'U') IS NOT NULL
BEGIN
  UPDATE inventory SET name=sweet.variant,item_type='component',unit='unidad',is_active=1,updated_at=SYSUTCDATETIME()
  FROM dbo.InventoryItems inventory JOIN @sweets sweet ON sweet.sku=inventory.sku;

  INSERT INTO dbo.InventoryItems(sku,name,item_type,unit,current_stock,minimum_stock,is_active)
  SELECT sweet.sku,sweet.variant,'component','unidad',0,0,1
  FROM @sweets sweet
  WHERE NOT EXISTS (SELECT 1 FROM dbo.InventoryItems inventory WHERE inventory.sku=sweet.sku);

  UPDATE dbo.InventoryItems SET is_active=0,updated_at=SYSUTCDATETIME()
  WHERE sku IN ('ADD-CHO-FERRERO-4','ADD-CHO-FERRERO-8','ADD-CHO-HERSHEY','ADD-CHO-KITKAT');
END;

COMMIT TRANSACTION;
