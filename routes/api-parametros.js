var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var {Ejecutar_Procedimientos} = require('../utility/exec_sp_sql')
// define the home page route
router.post('/get_parametros', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'TamañoPagina',valor_parametro:input.TamanoPagina},
        {nom_parametro:'NumeroPagina',valor_parametro:input.NumeroPagina},
        {nom_parametro:'ScripOrden',valor_parametro:input.ScripOrden},
        {nom_parametro:'ScripWhere',tipo_parametro:sql.NVarChar,valor_parametro:input.ScripWhere}
    ]
    procedimientos =[
        {nom_respuesta:'parametros',sp_name:'usp_PAR_TABLA_TP',parametros},
        {nom_respuesta:'num_filas',sp_name:'usp_PAR_TABLA_TNF',parametros:[{nom_parametro:'ScripWhere',valor_parametro:input.ScripWhere}]}
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
        {nom_parametro:'Cod_Usuario',valor_parametro:req.session.username},
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

router.post('/get_par_columna_by_codtabla', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Cod_Tabla', valor_parametro: input.Cod_Tabla}
    ]
    procedimientos = [
        {nom_respuesta:'columnas',sp_name:'URP_PAR_COLUMNA_TXTabla', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

router.post('/get_par_vista', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'NombreVista', valor_parametro: input.NombreVista}
    ]
    procedimientos = [
        {nom_respuesta:'vistas',sp_name:'USP_PAR_Cargar_Vista', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})


router.post('/guardar_par_fila', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Cod_Tabla', valor_parametro: input.Cod_Tabla},
        {nom_parametro: 'Cod_Columna', valor_parametro: input.Cod_Columna},
        {nom_parametro: 'Cod_Fila', valor_parametro: input.Cod_Fila},
        {nom_parametro: input.Tipo_Columna, valor_parametro: input.Valor},
        {nom_parametro: 'Flag_Creacion', valor_parametro: 1},
        {nom_parametro: 'Cod_Usuario',valor_parametro:req.session.username}
    ]
    procedimientos = [
        {nom_respuesta:'filas',sp_name:'USP_PAR_FILA_G', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

module.exports = router;