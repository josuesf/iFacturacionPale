CREATE PROCEDURE USP_CAJ_TURNO_ATENCION_TXCAJA
@Cod_Caja varchar(32)
AS
BEGIN
	DECLARE @FechaActual datetime;
	SET @FechaActual= GETDATE()
	SELECT	CA.Cod_Turno, 
			CONCAT(CASE WHEN CA.Flag_Cerrado='1' THEN 'C' ELSE 'A' END,' ',CA.Cod_Turno) AS 'Des_Turno'
			FROM CAJ_ARQUEOFISICO CA WHERE CA.Cod_Caja=@Cod_Caja
	UNION ALL
	
	SELECT	CT.Cod_Turno,
			CONCAT('N',' ',CT.Des_Turno) AS 'Des_Turno'
			FROM CAJ_TURNO_ATENCION CT WHERE CT.Cod_Turno NOT IN (	SELECT CA.Cod_Turno
																	FROM CAJ_ARQUEOFISICO CA WHERE CA.Cod_Caja=@Cod_Caja) AND
											 CT.Fecha_Inicio<=@FechaActual AND CT.Fecha_Fin>=@FechaActual

			 
END