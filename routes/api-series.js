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
    Ejecutar_Procedimientos(res, procedimientos)
         
}); 
 
 
 
module.exports = router;