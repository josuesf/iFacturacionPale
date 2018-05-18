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

    parametros2 [
        {nom_parametro: 'Cod_Caja', valor_parametro: input.Cod_Caja}
    ]
    
    parametrosFinales=[]
    var nombreProcedimientFinal=""
    if(input.Cod_Libro=="08"){
        parametrosFinales=parametros1
        nombreProcedimientFinal = 'USP_VIS_TIPO_COMPROBANTES_TXLibro'
    }else{
        parametrosFinales=parametros2
        nombreProcedimientFinal = 'USP_CAJ_CAJAS_DOC_TXCodCaja'
    }
     
    procedimientos = [
        { nom_respuesta: 'usuarios', sp_name: 'usp_PRI_USUARIO_TT', parametros },
        { nom_respuesta: 'documentos', sp_name: 'USP_VIS_TIPO_DOCUMENTOS_TT', parametros },
        { nom_respuesta: 'formaspago', sp_name: 'USP_VIS_FORMAS_PAGO_TT', parametros },
        { nom_respuesta: 'monedas', sp_name: 'USP_VIS_MONEDAS_TT',parametros }, 
        { nom_respuesta: 'tipocomprobantes', sp_name: nombreProcedimientFinal,parametros : parametrosFinales },
    ]  
    Ejecutar_Procedimientos(res, procedimientos)
         
});

router.post('/get_diagramas_xml_comprobante', function (req, res) {
    input = req.body 
    parametros = [
        {nom_parametro: 'Cod_Tabla', valor_parametro: input.Cod_Tabla}
    ]
     
    procedimientos = [
        { nom_respuesta: 'diagramas', sp_name: 'USP_VIS_DIAGRAMAS_XML_TXCodTabla', parametros }
        
    ]  
    Ejecutar_Procedimientos(res, procedimientos)
         
});

router.post('/get_pago_adelantado', function (req, res) {
    input = req.body 
    parametros = [
        {nom_parametro: 'id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor}
    ]
     
    procedimientos = [
        { nom_respuesta: 'pagos_adelantados', sp_name: 'USP_CAJ_FORMA_PAGO_TXPagoAdelantado', parametros }
        
    ]  
    Ejecutar_Procedimientos(res, procedimientos)
         
});


router.post('/get_variables_formas_pago', function (req, res) {
    
    input = req.body 

    parametros = [
        {nom_parametro: 'Cod_Moneda', valor_parametro: input.Cod_Moneda},
        {nom_parametro: 'FechaHora', valor_parametro: input.FechaHora}
    ]
     
    procedimientos = [
        { nom_respuesta: 'tipos_cambios', sp_name: 'USP_CAJ_TIPOCAMBIO_TXFechaMoneda', parametros}
        
    ]  
    Ejecutar_Procedimientos(res, procedimientos)
         
});

 
module.exports = router;