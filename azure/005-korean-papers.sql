/* Ejecutar en goldenbloom antes de publicar las nuevas envolturas. Reejecutable. */
SET XACT_ABORT ON;
BEGIN TRANSACTION;

DECLARE @papers TABLE (sku varchar(100) PRIMARY KEY, color nvarchar(100), display_order int);
INSERT INTO @papers(sku,color,display_order) VALUES
('WRP-KOR-IMG-4161',N'Verde menta',101),
('WRP-KOR-IMG-4163',N'Verde petróleo',102),
('WRP-KOR-IMG-4164',N'Verde menta y dorado',103),
('WRP-KOR-IMG-4165',N'Lila geométrico dorado',104),
('WRP-KOR-IMG-4166',N'Lila claro',105),
('WRP-KOR-IMG-4167',N'Blanco geométrico dorado',106),
('WRP-KOR-IMG-4168',N'Morado y fucsia',107),
('WRP-KOR-IMG-4169',N'Fucsia y rosa',108),
('WRP-KOR-IMG-4170',N'Rosa y crema',109),
('WRP-KOR-IMG-4171',N'Celeste claro',110),
('WRP-KOR-IMG-4172',N'Blanco geométrico negro',111),
('WRP-KOR-IMG-4173',N'Azul grisáceo y plata',112),
('WRP-KOR-IMG-4174',N'Negro y blanco',113),
('WRP-KOR-IMG-4175',N'Negro y rosa claro',114),
('WRP-KOR-IMG-4176',N'Negro geométrico dorado',115),
('WRP-KOR-IMG-4177',N'Negro con borde dorado',116),
('WRP-KOR-IMG-4178',N'Rosa geométrico dorado',117),
('WRP-KOR-IMG-4179',N'Rosa liso',118),
('WRP-KOR-IMG-4180',N'Rosa con puntos dorados',119),
('WRP-KOR-IMG-4181',N'Morado y blanco',120),
('WRP-KOR-IMG-4182',N'Negro y fucsia',121),
('WRP-KOR-IMG-4183',N'Blanco con borde dorado',122),
('WRP-KOR-IMG-4184',N'Blanco con puntos dorados',123);

UPDATE b SET option_group='wrap', name=N'Papel coreano', color_name=p.color,
  unit_price=0, min_quantity=0, max_quantity=1, display_order=p.display_order, is_active=1
FROM dbo.BuilderOptions b JOIN @papers p ON p.sku=b.sku;

INSERT INTO dbo.BuilderOptions(id,sku,option_group,name,color_name,unit_price,min_quantity,max_quantity,display_order,is_active)
SELECT NEWID(),p.sku,'wrap',N'Papel coreano',p.color,0,0,1,p.display_order,1
FROM @papers p WHERE NOT EXISTS (SELECT 1 FROM dbo.BuilderOptions b WHERE b.sku=p.sku);

/* Las cinco opciones antiguas sin foto se sustituyen por estas variantes fotografiadas. */
UPDATE dbo.BuilderOptions SET is_active=0
WHERE sku IN ('WRP-KOR-ROSA','WRP-KOR-BLANCO','WRP-KOR-NEGRO','WRP-KOR-ROJO','WRP-KOR-LILA');

IF OBJECT_ID(N'dbo.InventoryItems',N'U') IS NOT NULL
BEGIN
  UPDATE i SET name=CONCAT(N'Papel coreano ',p.color),item_type='component',unit='unidad',is_active=1,updated_at=SYSUTCDATETIME()
  FROM dbo.InventoryItems i JOIN @papers p ON p.sku=i.sku;

  INSERT INTO dbo.InventoryItems(sku,name,item_type,unit,current_stock,minimum_stock,is_active)
  SELECT p.sku,CONCAT(N'Papel coreano ',p.color),'component','unidad',0,0,1
  FROM @papers p WHERE NOT EXISTS (SELECT 1 FROM dbo.InventoryItems i WHERE i.sku=p.sku);

  UPDATE dbo.InventoryItems SET is_active=0,updated_at=SYSUTCDATETIME()
  WHERE sku IN ('WRP-KOR-ROSA','WRP-KOR-BLANCO','WRP-KOR-NEGRO','WRP-KOR-ROJO','WRP-KOR-LILA');
END;

COMMIT TRANSACTION;
