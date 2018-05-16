var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var { Ejecutar_Procedimientos, EXEC_SQL } = require('../utility/exec_sp_sql')

router.post('/get_variable_registro_compra', function (req, res) {
    input = req.body

    parametros = []
    parametros1 = [
        {nom_parametro: 'Cod_Liro', valor_parametro: input.Cod_Libro}
    ]
     
    procedimientos = [
        { nom_respuesta: 'usuarios', sp_name: 'usp_PRI_USUARIO_TT', parametros },
        { nom_respuesta: 'documentos', sp_name: 'USP_VIS_TIPO_DOCUMENTOS_TT', parametros },
        { nom_respuesta: 'formaspago', sp_name: 'USP_VIS_FORMAS_PAGO_TT', parametros },
        { nom_respuesta: 'monedas', sp_name: 'USP_VIS_MONEDAS_TT',parametros },
        { nom_respuesta: 'tipocomprobantes', sp_name: 'USP_VIS_TIPO_COMPROBANTES_TXLibro',parametros : parametros1 },
    ]  
    Ejecutar_Procedimientos(res, procedimientos)
         
});
 
module.exports = router;