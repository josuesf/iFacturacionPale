var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var {Ejecutar_Procedimientos} = require('../utility/exec_sp_sql')
// define the home page route
router.post('/get_movimientos', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Caja',valor_parametro:'100'},
        {nom_parametro:'Cod_Turno',valor_parametro:'T0002'},
        {nom_parametro:'Flag_Resumen',valor_parametro:'0'},
    ]
    parametros2 = [
        {nom_parametro:'Cod_Caja',valor_parametro:'100'},
        {nom_parametro:'Cod_Turno',valor_parametro:'T0002'},
    ]
    procedimientos =[
        {nom_respuesta:'movimientos',sp_name:'USP_MovimientosCajaTurno',parametros},
        {nom_respuesta:'saldos',sp_name:'USP_SaldosXCajaTurno',parametros:parametros2},
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});

router.post('/extornar_movimiento', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'id_Movimiento',valor_parametro:input.id_Movimiento},
        {nom_parametro:'Cod_Caja',valor_parametro:'100'},
        {nom_parametro:'Cod_Turno',valor_parametro:'T0002'},
        {nom_parametro:'Cod_Usuario',valor_parametro: req.session.username}
    ]
    
    procedimientos =[
        {nom_respuesta:'movimientos',sp_name:'USP_CAJ_CAJA_MOVIMIENTOS_EXTORNAR',parametros}
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});


router.post('/eliminar_movimiento', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'id_Movimiento',valor_parametro:input.id_Movimiento}
    ]
    
    procedimientos =[
        {nom_respuesta:'movimientos',sp_name:'usp_CAJ_CAJA_MOVIMIENTOS_E',parametros}
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});


module.exports = router;