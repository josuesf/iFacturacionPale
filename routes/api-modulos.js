var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var {Ejecutar_Procedimientos} = require('../utility/exec_sp_sql')
// define the home page route
router.post('/get_modulos', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'TamañoPagina',valor_parametro:input.TamanoPagina},
        {nom_parametro:'NumeroPagina',valor_parametro:input.NumeroPagina},
        {nom_parametro:'ScripOrden',valor_parametro:input.ScripOrden},
        {nom_parametro:'ScripWhere',tipo_parametro:sql.NVarChar,valor_parametro:input.ScripWhere}
    ]
    procedimientos =[
        {nom_respuesta:'modulos',sp_name:'usp_PRI_MODULO_TP',parametros},
        {nom_respuesta:'num_filas',sp_name:'usp_PRI_MODULO_TNF',parametros:[{nom_parametro:'ScripWhere',valor_parametro:input.ScripWhere}]},
        {nom_respuesta:'raices',sp_name:'USP_PRI_MODULO_TRAICES',parametros:[]},
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
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
    Ejecutar_Procedimientos(req,res,procedimientos)
});

router.post('/eliminar_modulo', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Cod_Modulo', valor_parametro: input.Cod_Modulo}
    ]
    procedimientos = [
        {nom_respuesta:'modulo',sp_name:'usp_PRI_MODULO_E', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

module.exports = router;