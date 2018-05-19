var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var {Ejecutar_Procedimientos} = require('../utility/exec_sp_sql')
// define the home page route
router.post('/get_almacenes', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'TamañoPagina',valor_parametro:input.TamanoPagina},
        {nom_parametro:'NumeroPagina',valor_parametro:input.NumeroPagina},
        {nom_parametro:'ScripOrden',valor_parametro:input.ScripOrden},
        {nom_parametro:'ScripWhere',tipo_parametro:sql.NVarChar,valor_parametro:input.ScripWhere}
    ]
    procedimientos =[
        {nom_respuesta:'almacenes',sp_name:'usp_ALM_ALMACEN_TP',parametros},
        {nom_respuesta:'num_filas',sp_name:'usp_ALM_ALMACEN_TNF',parametros:[{nom_parametro:'ScripWhere',valor_parametro:input.ScripWhere}]},
        {nom_respuesta:'tipo_almacenes',sp_name:'USP_VIS_TIPO_ALMACENES_TT',parametros:[]},
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});

router.post('/get_cajas_by_almacen', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Almacen',valor_parametro:input.Cod_Almacen},
    ]
    procedimientos =[
        {nom_respuesta:'cajas_almacen',sp_name:'USP_CAJ_CAJA_ALMACEN_TXAlmacen',parametros}
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});
router.post('/guardar_almacen', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Almacen',valor_parametro:input.Cod_Almacen},
        {nom_parametro:'Des_Almacen',valor_parametro:input.Des_Almacen},
        {nom_parametro:'Des_CortaAlmacen',valor_parametro:input.Des_CortaAlmacen},
        {nom_parametro:'Cod_TipoAlmacen',valor_parametro:input.Cod_TipoAlmacen},
        {nom_parametro:'Flag_Principal',valor_parametro:input.Flag_Principal},
        {nom_parametro:'Cod_Usuario',valor_parametro:req.session.username},
    ]
    procedimientos =[
        {nom_respuesta:'almacen',sp_name:'USP_ALM_ALMACEN_G',parametros}
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});
router.post('/eliminar_almacen', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Almacen',valor_parametro:input.Cod_Almacen},
    ]
    procedimientos =[
        {nom_respuesta:'almacen',sp_name:'USP_ALM_ALMACEN_E',parametros}
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});
router.post('/eliminar_caja_almacen', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Caja', valor_parametro: input.Cod_Caja},
        {nom_parametro:'Cod_Almacen', valor_parametro: input.Cod_Almacen}
    ]
    procedimientos = [
        {nom_respuesta: 'caja_almacen', sp_name: 'usp_CAJ_CAJA_ALMACEN_E', parametros}
    ]
    Ejecutar_Procedimientos(res, procedimientos)
})
router.post('/guardar_caja_almacen', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Caja', valor_parametro: input.Cod_Caja},
        {nom_parametro:'Cod_Almacen', valor_parametro: input.Cod_Almacen},
        {nom_parametro:'Flag_Principal', valor_parametro: input.Flag_Principal},
        {nom_parametro:'Cod_Usuario', valor_parametro: req.session.username}
    ]
    procedimientos = [
        {nom_respuesta: 'caja_almacen', sp_name: 'USP_CAJ_CAJA_ALMACEN_G', parametros}
    ]
    Ejecutar_Procedimientos(res, procedimientos)
})
router.post('/get_cajas_activas', function (req, res){
    input = req.body
    procedimientos = [
        {nom_respuesta: 'cajas_activas', sp_name: 'USP_CAJ_CAJAS_TActivos', parametros:[]}
    ]
    Ejecutar_Procedimientos(res, procedimientos)
})

router.post('/get_almacen_by_producto', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro:'Id_Producto', valor_parametro: input.Id_Producto}
    ]
    procedimientos = [
        {nom_respuesta: 'almacenes', sp_name: 'USP_PRI_PRODUCTO_TAlamcenXProducto', parametros}
    ]
    Ejecutar_Procedimientos(res, procedimientos)
})

module.exports = router;