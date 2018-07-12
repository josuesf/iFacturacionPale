var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var {Ejecutar_Procedimientos} = require('../utility/exec_sp_sql')
// define the home page route
router.post('/get_conceptos', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'TamañoPagina',valor_parametro:input.TamanoPagina},
        {nom_parametro:'NumeroPagina',valor_parametro:input.NumeroPagina},
        {nom_parametro:'ScripOrden',valor_parametro:input.ScripOrden},
        {nom_parametro:'ScripWhere',tipo_parametro:sql.NVarChar,valor_parametro:input.ScripWhere}
    ]
    procedimientos =[
        {nom_respuesta:'conceptos',sp_name:'usp_CAJ_CONCEPTO_TP',parametros},
        {nom_respuesta:'num_filas',sp_name:'usp_CAJ_CONCEPTO_TNF',parametros:[{nom_parametro:'ScripWhere',valor_parametro:input.ScripWhere}]},
        {nom_respuesta:'tipos_conceptos',sp_name:'USP_VIS_TIPO_CONCEPTO_TT',parametros:[]},
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});
router.post('/guardar_concepto', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Id_Concepto',valor_parametro:input.Id_Concepto},
        {nom_parametro:'Des_Concepto',valor_parametro:input.Des_Concepto},
        {nom_parametro:'Cod_ClaseConcepto',valor_parametro:input.Cod_ClaseConcepto},
        {nom_parametro:'Id_ConceptoPadre',valor_parametro:input.Id_ConceptoPadre},
        {nom_parametro:'Flag_Activo',valor_parametro:input.Flag_Activo},
        {nom_parametro:'Cod_Usuario',valor_parametro:req.session.username}
    ]
    procedimientos =[
        {nom_respuesta:'concepto',sp_name:'USP_CAJ_CONCEPTO_G',parametros},
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});

router.post('/eliminar_concepto', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Id_Concepto', valor_parametro: input.Id_Concepto}
    ]
    procedimientos = [
        {nom_respuesta:'concepto',sp_name:'USP_CAJ_CONCEPTO_E', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

module.exports = router;