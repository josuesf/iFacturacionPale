var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var {Ejecutar_Procedimientos} = require('../utility/exec_sp_sql')
// define the home page route
router.post('/get_perfiles', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'TamañoPagina',valor_parametro:input.TamanoPagina},
        {nom_parametro:'NumeroPagina',valor_parametro:input.NumeroPagina},
        {nom_parametro:'ScripOrden',valor_parametro:input.ScripOrden},
        {nom_parametro:'ScripWhere',tipo_parametro:sql.NVarChar,valor_parametro:input.ScripWhere}
    ]
    procedimientos =[
        {nom_respuesta:'perfiles',sp_name:'usp_PRI_PERFIL_TP',parametros},
        {nom_respuesta:'num_filas',sp_name:'usp_PRI_PERFIL_TNF',parametros:[{nom_parametro:'ScripWhere',valor_parametro:input.ScripWhere}]},
        {nom_respuesta:'modulos',sp_name:'usp_PRI_MODULO_TT',parametros:[]},
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});
router.post('/guardar_sucursal', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Sucursal',valor_parametro:input.Cod_Sucursal},
        {nom_parametro:'Nom_Sucursal',valor_parametro:input.Nom_Sucursal},
        {nom_parametro:'Dir_Sucursal',valor_parametro:input.Dir_Sucursal},
        {nom_parametro:'Por_UtilidadMax',valor_parametro:input.Por_UtilidadMax},
        {nom_parametro:'Por_UtilidadMin',valor_parametro:input.Por_UtilidadMin},
        {nom_parametro:'Cod_UsuarioAdm',valor_parametro:input.Cod_UsuarioAdm},
        {nom_parametro:'Cabecera_Pagina',valor_parametro:input.Cabecera_Pagina},
        {nom_parametro:'Pie_Pagina',valor_parametro:input.Pie_Pagina},
        {nom_parametro:'Flag_Activo',valor_parametro:input.Flag_Activo},
        {nom_parametro:'Cod_Ubigeo',valor_parametro:input.Cod_Ubigeo},
        {nom_parametro:'Cod_Usuario',valor_parametro:input.Cod_Usuario},
    ]
    procedimientos =[
        {nom_respuesta:'sucursal',sp_name:'USP_PRI_SUCURSAL_G',parametros},
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});

router.post('/eliminar_sucursal', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Cod_Sucursal', valor_parametro: input.Cod_Sucursal}
    ]
    procedimientos = [
        {nom_respuesta:'sucursal',sp_name:'usp_PRI_SUCURSAL_E', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

module.exports = router;