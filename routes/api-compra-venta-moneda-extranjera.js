var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var {Ejecutar_Procedimientos} = require('../utility/exec_sp_sql')

router.post('/get_comprobante_by_caja', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Caja',valor_parametro:input.Cod_Caja},
        {nom_parametro:'Cod_TipoComprobante',valor_parametro:'CV'}
    ]
    procedimientos =[
        {nom_respuesta:'comprobante_caja',sp_name:'USP_CAJ_CAJAS_DOC_TXCodCajaComprobante',parametros}
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});
 

router.post('/get_next_number_comprobante', function (req, res) {
    input = req.body
    parametros=[]
    parametros1 = [
        {nom_parametro:'Cod_TipoComprobante',valor_parametro:'CV'},
        {nom_parametro:'Serie',valor_parametro:input.Serie}
    ]
    procedimientos =[
        {nom_respuesta:'siguiente_numero_comprobante',sp_name:'USP_CAJ_MOVIMIENTOS_NumeroXTipoSerie',parametros:parametros1},
        {nom_respuesta:'monedas_sinsoles',sp_name:'USP_VIS_MONEDAS_SinSoles',parametros},
        {nom_respuesta:'tipos_documento',sp_name:'USP_VIS_TIPO_DOCUMENTOS_TT',parametros},
        {nom_respuesta:'entidades_financieras',sp_name:'USP_VIS_ENTIDADES_FINANCIERAS_TT ',parametros}
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});

router.post('/get_cuenta_bancaria_by_entidad_financiera', function (req, res) {
    input = req.body
    parametros=[]
    parametros1 = [
        {nom_parametro:'Cod_EntidadFinanciera',valor_parametro:input.Cod_EntidadFinanciera},
        {nom_parametro:'Cod_Moneda',valor_parametro:'PEN'}
    ]
    parametros2 = [
        {nom_parametro:'Cod_EntidadFinanciera',valor_parametro:input.Cod_EntidadFinanciera},
        {nom_parametro:'Cod_Moneda',valor_parametro:'USD'}
    ]
    procedimientos =[
        {nom_respuesta:'cuenta_bancaria_pen',sp_name:'USP_BAN_CUENTA_BANCARIA_TxEntidadFinanciera',parametros:parametros1},
        {nom_respuesta:'cuenta_bancaria_usd',sp_name:'USP_BAN_CUENTA_BANCARIA_TxEntidadFinanciera',parametros:parametros2}
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});


module.exports = router;