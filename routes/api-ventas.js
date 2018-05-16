var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var { Ejecutar_Procedimientos, EXEC_SQL } = require('../utility/exec_sp_sql')

router.post('/get_variables_ventas', function (req, res) {
    input = req.body

    parametros = [
        { nom_parametro: 'Cod_Caja', valor_parametro: req.app.locals.caja[0].Cod_Caja }, 
    ]
     
    procedimientos = [
        { nom_respuesta: 'almacenes', sp_name: 'USP_CAJ_CAJA_ALMACEN_TXCaja', parametros },
        { nom_respuesta: 'precios', sp_name: 'USP_VIS_PRECIOS_TT', parametros: [] },
        { nom_respuesta: 'monedas', sp_name: 'USP_VIS_MONEDAS_TT', parametros: [] },
        { nom_respuesta: 'documentos', sp_name: 'USP_VIS_TIPO_DOCUMENTOS_TT ',parametros: [] },
        { nom_respuesta: 'formaspago', sp_name: 'USP_VIS_FORMAS_PAGO_TT ',parametros: [] },
    ]  
    Ejecutar_Procedimientos(res, procedimientos)
         
});
 
module.exports = router;