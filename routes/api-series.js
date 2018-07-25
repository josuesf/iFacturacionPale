var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var { Ejecutar_Procedimientos, EXEC_SQL } = require('../utility/exec_sp_sql')

router.post('/get_variables_series', function (req, res) {
    input = req.body

    parametros1 = [
        { nom_parametro: 'Id_Producto', valor_parametro: input.Id_Producto }, 
    ]

    parametros2 = [
        { nom_parametro: 'Cod_Almacen', valor_parametro: input.Cod_Almacen }, 
    ]
     
    procedimientos = [
        { nom_respuesta: 'producto', sp_name: 'usp_PRI_PRODUCTOS_TXPK', parametros:parametros1 },
        { nom_respuesta: 'almacen', sp_name: 'usp_ALM_ALMACEN_TXPK', parametros: parametros2 },
    ]  
    Ejecutar_Procedimientos(req,res, procedimientos)
         
}); 

router.post('/guardar_serie', function (req, res) {
    input = req.body

    parametros = [
        { nom_parametro: 'Cod_Tabla', valor_parametro: input.Cod_Tabla }, 
        { nom_parametro: 'Id_Tabla', valor_parametro: input.Id_Tabla },
        { nom_parametro: 'Item', valor_parametro: input.Item },
        { nom_parametro: 'Serie', valor_parametro: input.Serie },
        { nom_parametro: 'Fecha_Vencimiento', valor_parametro: input.Fecha_Vencimiento },
        { nom_parametro: 'Obs_Serie', valor_parametro: input.Obs_Serie },
        { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username }
    ]
     
    procedimientos = [
        { nom_respuesta: 'series', sp_name: 'USP_CAJ_SERIES_G', parametros }
    ]  
    Ejecutar_Procedimientos(req,res, procedimientos)
         
}); 
 

router.post('/get_TOP_by_serie', function (req, res) {
    input = req.body

    parametros = [
        { nom_parametro: 'Serie', valor_parametro: input.Serie }, 
        { nom_parametro: 'Cod_Almacen', valor_parametro: input.Cod_Almacen }
    ]
     
    procedimientos = [
        { nom_respuesta: 'productos', sp_name: 'USP_CAJ_SERIES_TOPxSerie', parametros }
    ]  
    Ejecutar_Procedimientos(req,res, procedimientos)
         
}); 

router.post('/get_series_by_idproducto', function (req, res) {
    input = req.body

    parametros = [
        { nom_parametro: 'Id_Producto', valor_parametro: input.Id_Producto, tipo_parametro: sql.Int }
    ]
     
    procedimientos = [
        { nom_respuesta: 'series', sp_name: 'USP_VIS_SERIES_ExisteProducto', parametros }
    ]  
    Ejecutar_Procedimientos(req,res, procedimientos)
         
}); 
 
module.exports = router;