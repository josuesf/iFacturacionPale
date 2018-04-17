var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var {Ejecutar_Procedimientos} = require('../utility/exec_sp_sql')
// define the home page route
router.post('/get_cajas', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'TamañoPagina',valor_parametro:input.TamanoPagina},
        {nom_parametro:'NumeroPagina',valor_parametro:input.NumeroPagina},
        {nom_parametro:'ScripOrden',valor_parametro:input.ScripOrden},
        {nom_parametro:'ScripWhere',tipo_parametro:sql.NVarChar,valor_parametro:input.ScripWhere}
    ]
    procedimientos =[
        {nom_respuesta:'cajas',sp_name:'usp_CAJ_CAJAS_TP',parametros},
        {nom_respuesta:'num_filas',sp_name:'usp_CAJ_CAJAS_TNF',parametros:[{nom_parametro:'ScripWhere',valor_parametro:input.ScripWhere}]},
        {nom_respuesta:'sucursales',sp_name:'usp_PRI_SUCURSAL_TT',parametros:[]},
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});

router.post('/get_documents_by_caja', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Caja',valor_parametro:input.Cod_Caja},
    ]
    procedimientos =[
        {nom_respuesta:'documentos',sp_name:'USP_CAJ_CAJAS_DOC_TXCod_Caja',parametros},
        {nom_respuesta:'productos',sp_name:'USP_VIS_CAJA_PRODUCTOS_TxCaja',parametros}
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});

router.post('/buscar_usuarios', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro:'TamañoPagina',valor_parametro:input.TamanoPagina},
        {nom_parametro:'NumeroPagina',valor_parametro:input.NumeroPagina},
        {nom_parametro:'ScripOrden',valor_parametro:input.ScripOrden},
        {nom_parametro:'ScripWhere',tipo_parametro:sql.NVarChar,valor_parametro:input.ScripWhere}
    ]
    procedimientos = [
        {nom_respuesta:'usuarios',sp_name:'usp_PRI_USUARIO_TP',parametros}
    ]
    Ejecutar_Procedimientos(res,procedimientos)
})

module.exports = router;