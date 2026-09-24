-- Run once in the goldenbloom database before deploying the new loyalty rules.
BEGIN TRY
  BEGIN TRANSACTION;
  DECLARE @constraint sysname;
  DECLARE @statement nvarchar(max);
  SELECT @constraint = cc.name
  FROM sys.check_constraints cc
  WHERE cc.parent_object_id = OBJECT_ID(N'dbo.Benefits') AND cc.definition LIKE N'%kind%';
  IF @constraint IS NOT NULL
  BEGIN
    SET @statement = N'ALTER TABLE dbo.Benefits DROP CONSTRAINT ' + QUOTENAME(@constraint);
    EXEC sys.sp_executesql @statement;
  END;
  ALTER TABLE dbo.Benefits ADD CONSTRAINT CK_Benefits_Kind CHECK (kind IN ('free_shipping','credit','discount_10'));
  COMMIT TRANSACTION;
END TRY
BEGIN CATCH
  IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
  THROW;
END CATCH;
