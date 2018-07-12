var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var { Ejecutar_Procedimientos, EXEC_SQL } = require('../utility/exec_sp_sql')
// define the home page route
 


router.post('/guardar_reserva',function(req,res){
    input =req.body
    parametros = [
        { nom_parametro: 'Cod_Reserva', valor_parametro: input.Cod_Reserva },
        { nom_parametro: 'Cod_Habitacion', valor_parametro: input.Cod_Habitacion },
        { nom_parametro: 'Id_Huesped', valor_parametro: input.Id_Huesped },
        { nom_parametro: 'Cod_TipoHuesped', valor_parametro: input.Cod_TipoHuesped },
        { nom_parametro: 'Item', valor_parametro: input.Item },
        { nom_parametro: 'Cod_Tarifa', valor_parametro: input.Cod_Tarifa },
        { nom_parametro: 'Monto', valor_parametro: input.Monto },
        { nom_parametro: 'Des_Reserva', valor_parametro: input.Des_Reserva },
        { nom_parametro: 'Cod_Moneda', valor_parametro: input.Cod_Moneda },
        { nom_parametro: 'Cod_TipoReserva', valor_parametro: input.Cod_TipoReserva },
        { nom_parametro: 'Fecha_Inicio', valor_parametro: input.Fecha_Inicio },
        { nom_parametro: 'Fecha_Fin', valor_parametro: input.Fecha_Fin },
        { nom_parametro: 'Cod_EstadoReserva', valor_parametro: input.Cod_EstadoReserva },
        { nom_parametro: 'Nro_Adultos', valor_parametro: input.Nro_Adultos },
        { nom_parametro: 'Nro_ninos', valor_parametro: input.Nro_ninos },
        { nom_parametro: 'Nro_infantes', valor_parametro: input.Nro_infantes },
        { nom_parametro: 'CheckIn', valor_parametro: input.CheckIn },
        { nom_parametro: 'CheckOut', valor_parametro: input.CheckOut },
        { nom_parametro: 'Duracion', valor_parametro: input.Duracion },
        { nom_parametro: 'Preferencias', valor_parametro: input.Preferencias },
        { nom_parametro: 'ExtraCamas', valor_parametro: input.ExtraCamas },
        { nom_parametro: 'Proposito', valor_parametro: input.Proposito },
        { nom_parametro: 'Cod_Recurso', valor_parametro: input.Cod_Recurso },
        { nom_parametro: 'Cod_TipoRecurso', valor_parametro: input.Cod_TipoRecurso },
        { nom_parametro: 'Cod_TipoLlegada', valor_parametro: input.Cod_TipoLlegada },
        { nom_parametro: 'Detalle_Llegada', valor_parametro: input.Detalle_Llegada },
        { nom_parametro: 'FechaHora_Llegada', valor_parametro: input.FechaHora_Llegada },
        { nom_parametro: 'Cod_TipoPartida', valor_parametro: input.Cod_TipoPartida },
        { nom_parametro: 'Detalle_Partida', valor_parametro: input.Detalle_Partida },
        { nom_parametro: 'FechaHora_Partida', valor_parametro: input.FechaHora_Partida },
        { nom_parametro: 'Numero_Tarjeta', valor_parametro: input.Numero_Tarjeta },
        { nom_parametro: 'Cod_TipoTarjeta', valor_parametro: input.Cod_TipoTarjeta },
        { nom_parametro: 'Fecha_Vencimiento', valor_parametro: input.Fecha_Vencimiento },
        { nom_parametro: 'CVC', valor_parametro: input.CVC },
        { nom_parametro: 'Cod_EntidadFinanciera', valor_parametro: input.Cod_EntidadFinanciera },
        { nom_parametro: 'Nro_Deposito', valor_parametro: input.Nro_Deposito },
        { nom_parametro: 'Fecha_Cancelacion', valor_parametro: input.Fecha_Cancelacion },
        { nom_parametro: 'Motivo_Cancelacion', valor_parametro: input.Motivo_Cancelacion },
        { nom_parametro: 'Obs_Reserva', valor_parametro: input.Obs_Reserva },
        { nom_parametro: 'Cod_Grupo', valor_parametro: input.Cod_Grupo },
        { nom_parametro: 'Cod_UsuarioReg', valor_parametro: req.session.username },
        { nom_parametro: 'Fecha_Reg', valor_parametro: input.Fecha },
    ]
    
    procedimientos = [
        { nom_respuesta: 'reservas', sp_name: 'USP_RESERVA_UNICA_G', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
 
})

router.post('/guardar_habitacion',function(req,res){
    input =req.body
    parametros = [
        { nom_parametro: 'Cod_Habitacion', valor_parametro: input.Cod_Habitacion },
        { nom_parametro: 'Des_Habitacion', valor_parametro: input.Des_Habitacion },
        { nom_parametro: 'Id_Producto', valor_parametro: input.Id_Producto },
        { nom_parametro: 'Cod_EstadoHabitacion', valor_parametro: input.Cod_EstadoHabitacion },
        { nom_parametro: 'Sobre_Booking', valor_parametro: input.Sobre_Booking },
        { nom_parametro: 'Cod_Torre', valor_parametro: input.Cod_Torre },
        { nom_parametro: 'Cod_Piso', valor_parametro: input.Cod_Piso },
        { nom_parametro: 'Flag_Activo', valor_parametro: input.Flag_Activo },
        { nom_parametro: 'Cod_Tipo', valor_parametro: input.Cod_Tipo },
        { nom_parametro: 'Capacidad', valor_parametro: input.Capacidad },
        { nom_parametro: 'Obs_Habitacion', valor_parametro: input.Obs_Habitacion },
        { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username },
        { nom_parametro: 'Fecha', valor_parametro: input.Fecha }
    ]

    EXEC_SQL('USP_HABITACION_G', parametros , function (dataHabitacion) {
        if (dataHabitacion.error) return null
        if(input.Detalles.length>0){
            for(var i=0; i<input.Detalles.length;i++){
                var parametros_ = [
                    { nom_parametro: 'Cod_Especificacion', valor_parametro: input.Detalles[0] },
                    { nom_parametro: 'Cod_Habitacion', valor_parametro: input.Cod_Habitacion },
                    { nom_parametro: 'Cantidad', valor_parametro: 1 },
                ] 
                EXEC_SQL('USP_HABITACION_DETALLE_G', parametros_ , function (dataDetalles) {
                    if (dataDetalles.error) return null
                    return res.json({ respuesta: 'ok', data:dataHabitacion })
                })
            }
        }else{
            return res.json({ respuesta: 'ok', data:dataHabitacion })
        } 
    })
 
})


router.post('/get_habitaciones',function(req,res){
    input =req.body
    procedimientos = [
        { nom_respuesta: 'habitaciones', sp_name: 'USP_HABITACION_TT', parametros:[]}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})
 

router.post('/get_reservas',function(req,res){
    input =req.body
    parametros = [
        { nom_parametro: 'Fecha_Inicio', valor_parametro: input.Fecha_Inicio },
        { nom_parametro: 'Fecha_Fin', valor_parametro: input.Fecha_Fin },
    ]
    procedimientos = [
        { nom_respuesta: 'reservas', sp_name: 'USP_RESERVAS_TXFECHAS', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})
 

router.post('/get_variables_reserva', function (req, res) {
    input = req.body
 
    procedimientos = [
        { nom_respuesta: 'usuarios', sp_name: 'usp_PRI_USUARIO_TT', parametros:[] },
        { nom_respuesta: 'documentos', sp_name: 'USP_VIS_TIPO_DOCUMENTOS_TT', parametros:[] }, 
        { nom_respuesta: 'monedas', sp_name: 'USP_VIS_MONEDAS_TT',parametros:[] },
        { nom_respuesta: 'paises', sp_name: 'USP_VIS_PAISES_TT2',parametros:[] }

    ]  
    Ejecutar_Procedimientos(req,res, procedimientos)
         
});

module.exports = router;