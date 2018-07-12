var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var {Ejecutar_Procedimientos} = require('../utility/exec_sp_sql')
// define the home page route

router.post('/get_turnos', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'TamañoPagina',valor_parametro:input.TamanoPagina},
        {nom_parametro:'NumeroPagina',valor_parametro:input.NumeroPagina},
        {nom_parametro:'ScripOrden',valor_parametro:input.ScripOrden},
        {nom_parametro:'ScripWhere',tipo_parametro:sql.NVarChar,valor_parametro:input.ScripWhere}
    ]
    procedimientos =[
        {nom_respuesta:'turnos',sp_name:'usp_CAJ_TURNO_ATENCION_TP',parametros},
        {nom_respuesta:'num_filas',sp_name:'usp_CAJ_TURNO_ATENCION_TNF',parametros:[{nom_parametro:'ScripWhere',valor_parametro:input.ScripWhere}]}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});


router.post('/guardar_turno', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Cod_Turno', valor_parametro: input.Cod_Turno},
        {nom_parametro: 'Des_Turno', valor_parametro: input.Des_Turno},
        {nom_parametro: 'Fecha_Inicio', valor_parametro: input.Fecha_Inicio},
        {nom_parametro: 'Fecha_Fin', valor_parametro: input.Fecha_Fin},
        {nom_parametro: 'Flag_Cerrado', valor_parametro: input.Flag_Cerrado},
        {nom_parametro: 'Cod_Usuario', valor_parametro: input.Cod_Usuario},
    ]
    procedimientos = [
        {nom_respuesta: 'turno', sp_name: 'USP_CAJ_TURNO_ATENCION_G', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

router.post('/cambiar_comprobante_by_turno', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'id_ComprobantePago', valor_parametro: input.id_ComprobantePago},
        {nom_parametro: 'Cod_Turno', valor_parametro: input.Cod_Turno},
        {nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username},
    ]
    procedimientos = [
        {nom_respuesta: 'turno', sp_name: 'USP_CAJ_COMPROBANTE_PAGO_CambiarTurno', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

router.post('/cambiar_movimientos_by_turno', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Id_MovimientoCaja', valor_parametro: input.Id_MovimientoCaja},
        {nom_parametro: 'Cod_TurnoActual', valor_parametro: input.Cod_TurnoActual},
        {nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username},
    ]
    procedimientos = [
        {nom_respuesta: 'turno', sp_name: 'USP_CAJ_CAJA_MOVIMIENTOS_CambiarTurno', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

router.post('/cambiar_almacen_by_turno', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Id_AlmacenMov', valor_parametro: input.Id_AlmacenMov},
        {nom_parametro: 'Cod_TurnoActual', valor_parametro: input.Cod_TurnoActual},
        {nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username},
    ]
    procedimientos = [
        {nom_respuesta: 'turno', sp_name: 'USP_ALM_ALMACEN_MOV_CambiarTurno', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

router.post('/eliminar_turno', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Cod_Turno', valor_parametro: input.Cod_Turno}
    ]
    procedimientos = [
        {nom_respuesta: 'turno', sp_name: 'usp_CAJ_TURNO_ATENCION_E', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})



module.exports = router;