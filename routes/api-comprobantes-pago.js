var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var {Ejecutar_Procedimientos} = require('../utility/exec_sp_sql')
// define the home page route
router.post('/get_comprobante_pago', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'id_ComprobantePago',valor_parametro:input.id_ComprobantePago},
    ]
    procedimientos =[
        {nom_respuesta:'comprobante_pago',sp_name:'USP_CAJ_COMPROBANTE_PAGO_TXPK',parametros}
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});
 
 

module.exports = router;