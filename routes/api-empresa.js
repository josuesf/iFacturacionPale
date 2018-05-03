var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var {Ejecutar_Procedimientos} = require('../utility/exec_sp_sql')
// define the home page route
router.post('/get_unica_empresa', function (req, res) {
    input = req.body
    parametros = []
    procedimientos =[
        {nom_respuesta:'empresa',sp_name:'USP_PRI_EMPRESA_TraerUnicaEmpresa',parametros},
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});
router.post('/get_empresa', function (req, res) {
    input = req.body
    parametros = [{nom_parametro:'Cod_Empresa',valor_parametro:input.Cod_Empresa},]
    procedimientos =[
        {nom_respuesta:'empresa_actual',sp_name:'usp_PRI_EMPRESA_TXPK',parametros},
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});
router.post('/guardar_modulo', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Modulo',valor_parametro:input.Cod_Modulo},
        {nom_parametro:'Des_Modulo',valor_parametro:input.Des_Modulo},
        {nom_parametro:'Padre_Modulo',valor_parametro:input.Padre_Modulo},
        {nom_parametro:'Cod_Usuario',valor_parametro:req.session.username}
    ]
    procedimientos =[
        {nom_respuesta:'modulo',sp_name:'USP_PRI_MODULO_G',parametros},
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});


module.exports = router;