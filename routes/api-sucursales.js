var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var {Ejecutar_Procedimientos} = require('../utility/exec_sp_sql')
// define the home page route
router.post('/get_sucursales', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'TamañoPagina',valor_parametro:input.TamanoPagina},
        {nom_parametro:'NumeroPagina',valor_parametro:input.NumeroPagina},
        {nom_parametro:'ScripOrden',valor_parametro:input.ScripOrden},
        {nom_parametro:'ScripWhere',tipo_parametro:sql.NVarChar,valor_parametro:input.ScripWhere}
    ]
    procedimientos =[
        {nom_respuesta:'sucursales',sp_name:'usp_PRI_SUCURSAL_TP',parametros},
        {nom_respuesta:'num_filas',sp_name:'usp_PRI_SUCURSAL_TNF',parametros:[{nom_parametro:'ScripWhere',valor_parametro:input.ScripWhere}]},
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});
router.post('/guardar_sucursal', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Modulo',valor_parametro:input.Cod_Modulo},
        {nom_parametro:'Des_Modulo',valor_parametro:input.Des_Modulo},
        {nom_parametro:'Padre_Modulo',valor_parametro:input.Padre_Modulo},
        {nom_parametro:'Cod_Usuario',valor_parametro:input.Cod_Usuario}
    ]
    procedimientos =[
        {nom_respuesta:'sucursal',sp_name:'USP_PRI_MODULO_G',parametros},
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});

router.post('/eliminar_sucursal', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Cod_Sucursal', valor_parametro: input.Cod_Modulo}
    ]
    procedimientos = [
        {nom_respuesta:'sucursal',sp_name:'usp_PRI_MODULO_E', parametros}
    ]
    Ejecutar_Procedimientos(res, procedimientos)
})

module.exports = router;