var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var { Ejecutar_Procedimientos, EXEC_SQL } = require('../utility/exec_sp_sql')
// define the home page route
 
router.post('/guardar_habitacion',function(req,res){
    input =req.body
    parametros = [
        { nom_parametro: 'Cod_Habitacion', valor_parametro: -1 },
        { nom_parametro: 'Des_Habitacion', valor_parametro: req.app.locals.caja[0].Cod_Caja },
        { nom_parametro: 'Id_Producto', valor_parametro: req.app.locals.caja[0].Cod_Caja },
        { nom_parametro: 'Cod_EstadoHabitacion', valor_parametro: req.app.locals.turno[0].Cod_Turno },
        { nom_parametro: 'Sobre_Booking', valor_parametro: input.Id_Concepto },
        { nom_parametro: 'Cod_Torre', valor_parametro: input.Id_ClienteProveedor },
        { nom_parametro: 'Cod_Piso', valor_parametro: input.Cliente },
        { nom_parametro: 'Flag_Activo', valor_parametro: input.Des_Movimiento },
        { nom_parametro: 'Cod_Tipo', valor_parametro: input.Cod_TipoComprobante },
        { nom_parametro: 'Capacidad', valor_parametro: input.Serie},
        { nom_parametro: 'Obs_Habitacion', valor_parametro: input.Numero },
        { nom_parametro: 'Cod_UsuarioReg', valor_parametro: req.session.username },
        { nom_parametro: 'Fecha_Reg', valor_parametro: input.Fecha }
    ]
    procedimientos = [
        { nom_respuesta: 'habitacion', sp_name: 'USP_HABITACION_G', parametros}
    ]
    Ejecutar_Procedimientos(res, procedimientos)
})
 

module.exports = router;