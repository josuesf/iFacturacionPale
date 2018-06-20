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
 


/*
NOMBRE : USP_RESERVA_UNICA_G
PROPOSITO : GUARDA LOS DATOS DE LA RESERVA
EJECUCION : EXEC USP_RESERVA_UNICA_G
CREADO POR : OMAR
*/
 


CREATE PROCEDURE USP_RESERVA_UNICA_G
	@Cod_Reserva varchar(32),
	@Cod_Habitacion varchar(32),
	@Id_Huesped int,
	@Cod_TipoHuesped varchar(32),
	@Item int,
	@Cod_Tarifa varchar(32),
	@Monto numeric(38,2),
	@Des_Reserva varchar(500),
	@Cod_Moneda varchar(32),
	@Cod_TipoReserva varchar(32),
	@Fecha_Inicio datetime,
	@Fecha_Fin datetime,
	@Cod_EstadoReserva varchar(32),
	@Nro_Adultos int,
	@Nro_ninos int,
	@Nro_infantes int,
	@CheckIn datetime,
	@CheckOut datetime,
	@Duracion int,
	@Preferencias varchar(1024),
	@ExtraCamas int,
	@Proposito varchar(1024),
	@Cod_Recurso varchar(32),
	@Cod_TipoRecurso varchar(32), 
	@Cod_TipoLlegada varchar(32),
	@Detalle_Llegada varchar(500),
	@FechaHora_Llegada datetime,
	@Cod_TipoPartida varchar(30),
	@Detalle_Partida varchar(500),
	@FechaHora_Partida datetime,
	@Numero_Tarjeta varchar(32),
	@Cod_TipoTarjeta varchar(32),
	@Fecha_Vencimiento datetime,
	@CVC varchar(32),
	@Cod_EntidadFinanciera varchar(32),
	@Nro_Deposito varchar(64), 
	@Fecha_Cancelacion datetime,
	@Motivo_Cancelacion varchar(512),
	@Obs_Reserva varchar(1024),
	@Cod_Grupo varchar(32) NULL,
	@Cod_UsuarioReg varchar(32),
	@Fecha_Reg datetime
AS 
BEGIN 
	BEGIN TRY
	
		BEGIN TRANSACTION;
			INSERT INTO HOT_RESERVAS (Cod_Reserva,Des_Reserva,Cod_Moneda,Cod_TipoReserva,Fecha_Limite,Cod_EstadoReserva,Nro_Adultos,Nro_ninos,Nro_infantes,CheckIn,CheckOut,Duracion,Preferencias,ExtraCamas,Proposito,Cod_Recurso,Cod_TipoRecurso, Cod_TipoLlegada,Detalle_Llegada,FechaHora_Llegada,Cod_TipoPartida,Detalle_Partida,FechaHora_Partida,Numero_Tarjeta,Cod_TipoTarjeta,Fecha_Vencimiento,CVC,Cod_EntidadFinanciera,Nro_Deposito,Monto,Fecha_Cancelacion,Motivo_Cancelacion,Obs_Reserva,Cod_Grupo,Cod_UsuarioReg,Fecha_Reg)
			VALUES (@Cod_Reserva,@Des_Reserva,@Cod_Moneda,@Cod_TipoReserva,@Fecha_Fin,@Cod_EstadoReserva,@Nro_Adultos,@Nro_ninos,@Nro_infantes,@CheckIn,@CheckOut,@Duracion,@Preferencias,@ExtraCamas,@Proposito,@Cod_Recurso,@Cod_TipoRecurso, @Cod_TipoLlegada,@Detalle_Llegada,@FechaHora_Llegada,@Cod_TipoPartida,@Detalle_Partida,@FechaHora_Partida,@Numero_Tarjeta,@Cod_TipoTarjeta,@Fecha_Vencimiento,@CVC,@Cod_EntidadFinanciera,@Nro_Deposito,@Monto,@Fecha_Cancelacion,@Motivo_Cancelacion,@Obs_Reserva,@Cod_Grupo,@Cod_UsuarioReg,@Fecha_Reg)
	
			INSERT INTO HOT_RESERVAS_HABITACION (Cod_Reserva,Item,Cod_Habitacion,Flag_Asignado,Cod_Tarifa,Monto,Fecha_Inicio,Fecha_Fin,Cod_UsuarioReg,Fecha_Reg)
			VALUES (@Cod_Reserva,@Item,@Cod_Habitacion,'1',@Cod_Tarifa,@Monto,@Fecha_Inicio,@Fecha_Fin,@Cod_UsuarioReg,@Fecha_Reg)
 
			INSERT INTO HOT_HUESPEDES(Cod_Reserva,Id_Huesped,Cod_TipoHuesped,Preferencias,Fecha_Entrada,Fecha_Salida,Flag_Responsable,Cod_UsuarioReg,Fecha_Reg)
			VALUES (@Cod_Reserva,@Id_Huesped,@Cod_TipoHuesped,@Preferencias,@CheckIn,@CheckOut,'1',@Cod_UsuarioReg,@Fecha_Reg)

		COMMIT

	END TRY	
	BEGIN CATCH
		ROLLBACK 
    END CATCH 
END
 


/*
NOMBRE : USP_RESERVAS_TXFECHAS
PROPOSITO : RECUPERA LAS RESERVAS POR FECHAS
EJECUCION : EXEC USP_RESERVAS_TXFECHAS '2018-06-20T00:00:00','2018-07-20T00:00:00'
CREADO POR : OMAR
*/
  
CREATE PROCEDURE USP_RESERVAS_TXFECHAS
	@Fecha_Inicio datetime,
	@Fecha_Fin datetime
AS 
BEGIN 
	SELECT HR.*,HRH.Cod_Habitacion,HRH.Cod_Tarifa,HRH.Fecha_Inicio,HRH.Fecha_Fin,HH.Id_Huesped,HH.Cod_TipoHuesped FROM HOT_RESERVAS HR INNER JOIN HOT_RESERVAS_HABITACION HRH ON HR.Cod_Reserva=HRH.Cod_Reserva INNER JOIN HOT_HUESPEDES HH ON HR.Cod_Reserva=HH.Cod_Reserva WHERE CONVERT(DATE,HRH.Fecha_Fin)>=CONVERT(DATE,@Fecha_Inicio) OR CONVERT(DATE,HRH.Fecha_Inicio)<=CONVERT(DATE,@Fecha_Fin)
END

