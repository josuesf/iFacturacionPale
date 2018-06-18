/*
NOMBRE : USP_HABITACION_G
PROPOSITO : GUARDA LOS DATOS DE UN PRODUCTO
CREADO POR : OMAR
*/


CREATE PROCEDURE USP_HABITACION_G 
	@Cod_Habitacion varchar(32),
	@Des_Habitacion varchar(1024),
	@Id_Producto int,
	@Cod_EstadoHabitacion varchar(32),
	@Sobre_Booking int,
	@Cod_Torre varchar(32),
	@Cod_Piso varchar(32),
	@Flag_Activo varchar(32),
	@Cod_Tipo varchar(32),
	@Capacidad int,
	@Obs_Habitacion varchar(1024),
	@Cod_Usuario varchar(32),
	@Fecha datetime
	
AS 
BEGIN
	IF NOT EXISTS(SELECT Cod_Habitacion FROM HOT_HABITACIONES WHERE Cod_Habitacion=@Cod_Habitacion) 
	BEGIN
		INSERT INTO HOT_HABITACIONES(Cod_Habitacion,Des_Habitacion,Id_Producto,Cod_EstadoHabitacion,Sobre_Booking,Cod_Torre,Cod_Piso, Flag_Activo,Cod_Tipo,Capacidad,Obs_Habitacion,Cod_UsuarioReg,Fecha_Reg)
		VALUES (@Cod_Habitacion,@Des_Habitacion,@Id_Producto,@Cod_EstadoHabitacion,@Sobre_Booking,@Cod_Torre,@Cod_Piso,@Flag_Activo,@Cod_Tipo,@Capacidad,@Obs_Habitacion,@Cod_Usuario,@Fecha)
	END
	ELSE
	BEGIN
		UPDATE HOT_HABITACIONES SET
			Des_Habitacion=@Des_Habitacion,
			Id_Producto=@Id_Producto,
			Cod_EstadoHabitacion=@Cod_EstadoHabitacion,
			Sobre_Booking=@Sobre_Booking,
			Cod_Torre=@Cod_Torre,
			Cod_Piso=@Cod_Piso,
			Flag_Activo=@Flag_Activo,
			Cod_Tipo=@Cod_Tipo,
			Capacidad=@Capacidad,
			Obs_Habitacion=@Obs_Habitacion,
			Cod_UsuarioAct = @Cod_Usuario,
			Fecha_Act =@Fecha
		WHERE Cod_Habitacion=@Cod_Habitacion
	END 
	SELECT * FROM HOT_HABITACIONES WHERE Cod_Habitacion = @Cod_Habitacion
END


/*
NOMBRE : USP_HABITACION_DETALLE_G
PROPOSITO : GUARDAR LOS DETALLES DE UNA HABITACION (WIFI, ENTRE OTROS)
CREADO POR : OMAR
*/


CREATE PROCEDURE USP_HABITACION_DETALLE_G 
	@Cod_Especificacion varchar(32),
	@Cod_Habitacion varchar(32),
	@Cantidad int
AS 
BEGIN
	INSERT INTO HOT_HABITACIONES_RELAC_ESPEC(Cod_Especificacion,Cod_Habitacion,Cantidad)
	VALUES(@Cod_Especificacion,@Cod_Habitacion,@Cantidad)
END


/*
NOMBRE : USP_HABITACION_TT
PROPOSITO : RECUPERA LA INFORMACION DE LAS HABITACIONES
EJECUCION : EXEC USP_HABITACION_TT 
CREADO POR : OMAR
*/


CREATE PROCEDURE USP_HABITACION_TT
AS 
BEGIN
	SELECT HAB.*,HAB_ESPEC.Cod_Especificacion FROM HOT_HABITACIONES HAB LEFT JOIN HOT_HABITACIONES_RELAC_ESPEC HAB_ESPEC ON HAB.Cod_Habitacion = HAB_ESPEC.Cod_Habitacion
END


/*
NOMBRE : USP_VIS_PAISES_TT2
PROPOSITO : RECUPERA LA INFORMACION DE TODOS LOS PAISES
EJECUCION : EXEC USP_VIS_PAISES_TT2
CREADO POR : OMAR
*/


CREATE PROCEDURE USP_VIS_PAISES_TT2
AS 
BEGIN
	SELECT * FROM VIS_PAISES
END
 



