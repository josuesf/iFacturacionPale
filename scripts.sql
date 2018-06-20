-- TABLA DE RESERVAS
CREATE TABLE HOT_RESERVAS(
	Cod_Reserva varchar(32) NOT NULL PRIMARY KEY,
	Des_Reserva varchar(500) NULL,
	Cod_Moneda varchar(32) NULL,
	Cod_TipoReserva varchar(32) NOT NULL,
	Fecha_Limite datetime,
	Cod_EstadoReserva varchar(32),
	Nro_Adultos int,
	Nro_ninos int,
	Nro_infantes int,
	CheckIn datetime,
	CheckOut datetime,
	Duracion int,
	Preferencias varchar(1024),
	ExtraCamas int,
	Proposito varchar(1024),
	Cod_Recurso varchar(32),
	Cod_TipoRecurso varchar(32),
	Cod_TipoLlegada varchar(32),
	Detalle_Llegada varchar(500),
	FechaHora_Llegada datetime,
	Cod_TipoPartida varchar(30),
	Detalle_Partida varchar(500),
	FechaHora_Partida datetime,
	Numero_Tarjeta varchar(32),
	Cod_TipoTarjeta varchar(32),
	Fecha_Vencimiento datetime,
	CVC varchar(8),
	Cod_EntidadFinanciera varchar(32),
	Nro_Deposito varchar(64),
	Monto numeric(38,2),
	Fecha_Cancelacion datetime,
	Motivo_Cancelacion varchar(512),
	Obs_Reserva varchar(1024),
	Cod_Grupo varchar(32),
	Cod_UsuarioReg varchar(32),
	Fecha_Reg datetime,
	Cod_UsuarioAct varchar(32),
	Fecha_Act datetime
)

-- TABLA MENSAJES DE LA RESERVA

CREATE TABLE HOT_MENSAJES(
	Cod_Reserva varchar(32),
	Item int,
	Para varchar(52),
	Mensaje varchar(1024),
	Cod_EstadoMensaje varchar(32),
	Cod_UsuarioReg varchar(32),
	Fecha_Reg datetime,
	Cod_UsuarioAct varchar(32),
	Fecha_Act datetime,
	PRIMARY KEY (Cod_Reserva,Item),
	FOREIGN KEY (Cod_Reserva) REFERENCES HOT_RESERVAS(Cod_Reserva)
)

-- TABLA  CONSUMOS


CREATE TABLE HOT_CONSUMOS(
	Cod_Reserva varchar(32),
	Id_Comprobante int,
	Flag_EsFactura bit,
	Cod_Moneda varchar(32),
	Monto numeric(38,2),
	Cod_UsuarioReg varchar(32),
	Fecha_Reg datetime,
	Cod_UsuarioAct varchar(32),
	Fecha_Act datetime,
	PRIMARY KEY (Cod_Reserva,Id_Comprobante),
	FOREIGN KEY (Cod_Reserva) REFERENCES HOT_RESERVAS(Cod_Reserva)
)


-- TABLA TAREAS


CREATE TABLE HOT_TAREAS(
	Cod_Reserva varchar(32),
	Item int,
	Para varchar(52),
	Mensaje varchar(1024),
	Cod_EstadoTarea varchar(32),
	Fecha_Alerta datetime,
	Cod_Proceso varchar(32),
	Cod_UsuarioReg varchar(32),
	Fecha_Reg datetime,
	Cod_UsuarioAct varchar(32),
	Fecha_Act datetime,
	PRIMARY KEY (Cod_Reserva,Item),
	FOREIGN KEY (Cod_Reserva) REFERENCES HOT_RESERVAS(Cod_Reserva)
)



-- TABLA RESERVAS HABITACION


CREATE TABLE HOT_RESERVAS_HABITACION(
	Cod_Reserva varchar(32),
	Item int,
	Cod_Habitacion varchar(32),
	Flag_Asignado bit,
	Cod_Tarifa varchar(32),
	Monto numeric(38,2),
	Fecha_Inicio datetime,
	Fecha_Fin datetime,
	Cod_UsuarioReg varchar(32),
	Fecha_Reg datetime,
	Cod_UsuarioAct varchar(32),
	Fecha_Act datetime,
	PRIMARY KEY (Cod_Reserva,Item),
	FOREIGN KEY (Cod_Reserva) REFERENCES HOT_RESERVAS(Cod_Reserva)
)

-- TABLA RESERVAS EXONERACIONES


CREATE TABLE HOT_RESERVAS_EXONERACION(
	Cod_Reserva varchar(32),
	Cod_Impuesto varchar(32),
	Cod_TipoExoneracion varchar(32),
	Justificacion varchar(32),
	Cod_UsuarioReg varchar(32),
	Fecha_Reg datetime,
	Cod_UsuarioAct varchar(32),
	Fecha_Act datetime,
	PRIMARY KEY (Cod_Reserva,Cod_Impuesto),
	FOREIGN KEY (Cod_Reserva) REFERENCES HOT_RESERVAS(Cod_Reserva)
)

-- TABLA RESERVAS GRUPOS


CREATE TABLE HOT_RESERVAS_GRUPO(
	Cod_Grupo varchar(32) NOT NULL PRIMARY KEY,
	Des_Grupo varchar(1024),
	Id_ClienteProveedor int,
	Cod_CondicionPago varchar(32),
	Cod_UsuarioReg varchar(32),
	Fecha_Reg datetime,
	Cod_UsuarioAct varchar(32),
	Fecha_Act datetime
)

-- TABLA HABITACIONES

CREATE TABLE HOT_HABITACIONES(
	Cod_Habitacion varchar(32) NOT NULL PRIMARY KEY,
	Des_Habitacion varchar(1024),
	Id_Producto int,
	Cod_EstadoHabitacion varchar(32),
	Sobre_Booking int,
	Cod_Torre varchar(32),
	Cod_Piso varchar(32),
	Flag_Activo varchar(32),
	Obs_Habitacion varchar(1024),
	Cod_UsuarioReg varchar(32),
	Fecha_Reg datetime,
	Cod_UsuarioAct varchar(32),
	Fecha_Act datetime
)


-- TABLA HABITACIONES RELACION ESPECIFICACION

CREATE TABLE HOT_HABITACIONES_REL_ESPEC(
	Cod_Habitacion varchar(32),
	Cod_Especificacion varchar(32),
	Flag_Activo varchar(32),
	Cod_UsuarioReg varchar(32),
	Fecha_Reg datetime,
	Cod_UsuarioAct varchar(32),
	Fecha_Act datetime
	PRIMARY KEY (Cod_Habitacion,Cod_Especificacion),
	FOREIGN KEY (Cod_Habitacion) REFERENCES HOT_HABITACIONES(Cod_Habitacion)
)

-- TABLA HABITACIONES ESPECIFICACIONES

CREATE TABLE HOT_HABITACIONES_ESPECIFICACION(
	Cod_Especificacion varchar(32) NOT NULL PRIMARY KEY,
	Descripcion varchar(1024),
	Observaciones varchar(1024), 
	Flag_Activo varchar(32),
	Cod_UsuarioReg varchar(32),
	Fecha_Reg datetime,
	Cod_UsuarioAct varchar(32),
	Fecha_Act datetime
)


-- TABLA HABITACIONES HUESPEDES

CREATE TABLE HOT_HUESPEDES(
    Cod_Reserva varchar(32),
	Id_Huesped int,
	Cod_TipoHuesped varchar(32),
	Preferencias varchar(1024),
	Fecha_Entrada datetime,
	Fecha_Salida datetime,
	Flag_Responsable bit,
	Cod_UsuarioReg varchar(32),
	Fecha_Reg datetime,
	Cod_UsuarioAct varchar(32),
	Fecha_Act datetime
)

-- TABLA HOUSEKEEPING

CREATE TABLE HOT_HOUSEKEEPING(
	Id_HouseKeeping int not null AUTO_INCREMENT,
	Cod_Habitacion varchar(32),
	Cod_EstadoHabitacion varchar(32),
	Fecha datetime,
	Cod_Personal varchar(32),
	Obs_HouseKeeping varchar(1024),
	Cod_UsuarioReg varchar(32),
	Fecha_Reg datetime,
	Cod_UsuarioAct varchar(32),
	Fecha_Act datetime,
	FOREIGN KEY (Cod_Habitacion) REFERENCES HOT_HABITACIONES(Cod_Habitacion)
)




