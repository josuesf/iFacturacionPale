var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var {Ejecutar_Procedimientos} = require('../utility/exec_sp_sql')
// define the home page route
router.post('/get_usuarios', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'TamañoPagina',valor_parametro:input.TamanoPagina},
        {nom_parametro:'NumeroPagina',valor_parametro:input.NumeroPagina},
        {nom_parametro:'ScripOrden',valor_parametro:input.ScripOrden},
        {nom_parametro:'ScripWhere',tipo_parametro:sql.NVarChar,valor_parametro:input.ScripWhere}
    ]
    procedimientos =[
        {nom_respuesta:'usuarios',sp_name:'usp_PRI_USUARIO_TP',parametros},
        {nom_respuesta:'num_filas',sp_name:'usp_PRI_USUARIO_TNF',parametros:[{nom_parametro:'ScripWhere',valor_parametro:input.ScripWhere}]},
        {nom_respuesta:'perfiles',sp_name:'usp_PRI_PERFIL_TT',parametros:[]},
        {nom_respuesta:'estados',sp_name:'USP_VIS_ESTADO_TRABAJADOR_TT',parametros:[]},
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});
router.post('/guardar_usuario', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Usuarios',valor_parametro:input.Cod_Usuarios},
        {nom_parametro:'Nick',valor_parametro:input.Nick},
        {nom_parametro:'Contrasena',valor_parametro:md5(input.Contrasena)},
        {nom_parametro:'Foto',tipo_parametro:sql.Binary,valor_parametro:null},
        {nom_parametro:'Pregunta',valor_parametro:input.Pregunta},
        {nom_parametro:'Respuesta',valor_parametro:input.Respuesta},
        {nom_parametro:'Cod_Estado',valor_parametro:input.Cod_Estado},
        {nom_parametro:'Cod_Perfil',valor_parametro:input.Cod_Perfil},
        {nom_parametro:'Cod_Usuario',valor_parametro:input.Cod_Usuario}
    ]
    procedimientos =[
        {nom_respuesta:'usuario',sp_name:'USP_PRI_USUARIO_G',parametros},
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});

module.exports = router;