/* Ejecutar una vez en la base de datos goldenbloom. No elimina datos. */
SET XACT_ABORT ON;
GO
IF COL_LENGTH(N'dbo.Orders', N'invoice_number') IS NULL ALTER TABLE dbo.Orders ADD invoice_number varchar(40) NULL;
GO
IF COL_LENGTH(N'dbo.Orders', N'subtotal') IS NULL ALTER TABLE dbo.Orders ADD subtotal decimal(12,2) NULL;
GO
IF COL_LENGTH(N'dbo.Orders', N'tax_rate') IS NULL ALTER TABLE dbo.Orders ADD tax_rate decimal(6,5) NULL;
GO
IF COL_LENGTH(N'dbo.Orders', N'tax_amount') IS NULL ALTER TABLE dbo.Orders ADD tax_amount decimal(12,2) NULL;
GO
UPDATE dbo.Orders SET invoice_number=COALESCE(invoice_number,'GB-'+UPPER(LEFT(CONVERT(varchar(36),id),8))),subtotal=COALESCE(subtotal,total),tax_rate=COALESCE(tax_rate,0),tax_amount=COALESCE(tax_amount,0) WHERE invoice_number IS NULL OR subtotal IS NULL OR tax_rate IS NULL OR tax_amount IS NULL;
GO
IF NOT EXISTS(SELECT 1 FROM sys.indexes WHERE name=N'UX_Orders_InvoiceNumber' AND object_id=OBJECT_ID(N'dbo.Orders')) CREATE UNIQUE INDEX UX_Orders_InvoiceNumber ON dbo.Orders(invoice_number) WHERE invoice_number IS NOT NULL;
GO
