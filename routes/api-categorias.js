var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var {Ejecutar_Procedimientos} = require('../utility/exec_sp_sql')
// define the home page route

router.post('/get_categorias', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'TamañoPagina',valor_parametro:input.TamanoPagina},
        {nom_parametro:'NumeroPagina',valor_parametro:input.NumeroPagina},
        {nom_parametro:'ScripOrden',valor_parametro:input.ScripOrden},
        {nom_parametro:'ScripWhere',tipo_parametro:sql.NVarChar,valor_parametro:input.ScripWhere}
    ]
    procedimientos =[
        {nom_respuesta:'categorias',sp_name:'usp_PRI_CATEGORIA_TP',parametros},
        {nom_respuesta:'num_filas',sp_name:'usp_PRI_CATEGORIA_TNF',parametros:[{nom_parametro:'ScripWhere',valor_parametro:input.ScripWhere}]}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});

router.post('/get_categoriaspadre', function (req, res){
    input = req.body
    parametros = []
    procedimientos = [
        {nom_respuesta: 'categoriaspadre', sp_name: 'USP_PRI_CATEGORIA_TArbol', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

router.post('/guardar_categoria', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Cod_Categoria', valor_parametro: input.Cod_Categoria},
        {nom_parametro: 'Des_Categoria', valor_parametro: input.Des_Categoria},
        {nom_parametro: 'Foto', tipo_parametro: sql.Binary, valor_parametro: input.Foto},
        {nom_parametro: 'Cod_CategoriaPadre', valor_parametro: input.Cod_CategoriaPadre},
        {nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username},
    ]
    procedimientos = [
        {nom_respuesta: 'categoria', sp_name: 'USP_PRI_CATEGORIA_G', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

router.post('/eliminar_categoria', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Cod_Categoria', valor_parametro: input.Cod_Categoria}
    ]
    procedimientos = [
        {nom_respuesta: 'categoria', sp_name: 'usp_PRI_CATEGORIA_E', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})



module.exports = router;