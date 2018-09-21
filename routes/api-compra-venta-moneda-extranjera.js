var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var {Ejecutar_Procedimientos, EXEC_SQL_OUTPUT} = require('../utility/exec_sp_sql')

router.post('/guardar_compra_venta_me', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'id_Movimiento',valor_parametro:input.id_Movimiento,tipo:"output"},
        {nom_parametro:'Cod_Caja',valor_parametro:req.app.locals.caja[0].Cod_Caja},
        {nom_parametro:'Cod_Turno',valor_parametro:req.app.locals.turno[0].Cod_Turno},
        {nom_parametro:'Id_Concepto',valor_parametro:input.Id_Concepto},
        {nom_parametro:'Id_ClienteProveedor',valor_parametro:input.Id_ClienteProveedor},
        {nom_parametro:'Cliente',valor_parametro:input.Cliente},
        {nom_parametro:'Des_Movimiento',valor_parametro:input.Des_Movimiento},
        {nom_parametro:'Cod_TipoComprobante',valor_parametro:input.Cod_TipoComprobante},
        {nom_parametro:'Serie',valor_parametro:input.Serie},
        {nom_parametro:'Numero',valor_parametro:input.Numero,tipo_parametro:sql.VarChar},
        {nom_parametro:'Fecha',valor_parametro:input.Fecha},
        {nom_parametro:'Tipo_Cambio',valor_parametro:input.Tipo_Cambio},
        {nom_parametro:'Ingreso',valor_parametro:input.Ingreso},
        {nom_parametro:'Cod_MonedaIng',valor_parametro:input.Cod_MonedaIng},
        {nom_parametro:'Egreso',valor_parametro:input.Egreso},
        {nom_parametro:'Cod_MonedaEgr',valor_parametro:input.Cod_MonedaEgr},
        {nom_parametro:'Flag_Extornado',valor_parametro:input.Flag_Extornado},
        {nom_parametro:'Cod_UsuarioAut',valor_parametro:req.session.username},
        {nom_parametro:'Fecha_Aut',valor_parametro:input.Fecha_Aut},
        {nom_parametro:'Obs_Movimiento',valor_parametro:input.Obs_Movimiento},
        {nom_parametro:'Id_MovimientoRef',valor_parametro:input.Id_MovimientoRef},
        {nom_parametro:'Cod_Usuario',valor_parametro:req.session.username},
    ]
    /*procedimientos =[
        {nom_respuesta:'compra_venta_me',sp_name:'USP_CAJ_CAJA_MOVIMIENTOS_G',parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)*/
    
    EXEC_SQL_OUTPUT('USP_CAJ_CAJA_MOVIMIENTOS_G', parametros , function (dataMov) {
        if (dataMov.error) return res.json({respuesta:"error",error:dataMov.error}) 
        return res.json({respuesta:"ok",data:{movimiento:{ id_Movimiento:dataMov.result[0].valor }}}) 
    })
});


router.post('/guardar_cuenta_bancaria_compra_venta_me', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Id_MovimientoCuenta',valor_parametro:input.Id_MovimientoCuenta},
        {nom_parametro:'Cod_CuentaBancaria',valor_parametro:input.Cod_CuentaBancaria},
        {nom_parametro:'Nro_Operacion',valor_parametro:input.Nro_Operacion},
        {nom_parametro:'Des_Movimiento',valor_parametro:input.Des_Movimiento},
        {nom_parametro:'Cod_TipoOperacionBancaria',valor_parametro:input.Cod_TipoOperacionBancaria},
        {nom_parametro:'Fecha',valor_parametro:input.Fecha},
        {nom_parametro:'Monto',valor_parametro:input.Monto},
        {nom_parametro:'TipoCambio',valor_parametro:input.TipoCambio},
        {nom_parametro:'Cod_Caja',valor_parametro:req.app.locals.caja[0].Cod_Caja},
        {nom_parametro:'Cod_Turno',valor_parametro:req.app.locals.turno[0].Cod_Turno},
        {nom_parametro:'Cod_Plantilla',valor_parametro:input.Cod_Plantilla},
        {nom_parametro:'Nro_Cheque',valor_parametro:input.Nro_Cheque},
        {nom_parametro:'Beneficiario',valor_parametro:input.Beneficiario},
        {nom_parametro:'Id_ComprobantePago',valor_parametro:input.Id_ComprobantePago},
        {nom_parametro:'Obs_Movimiento',valor_parametro:input.Obs_Movimiento},
        {nom_parametro:'Cod_Usuario',valor_parametro:req.session.username},
    ]
    procedimientos =[
        {nom_respuesta:'cuenta_bancaria_compra_venta_me',sp_name:'USP_BAN_CUENTA_M_G',parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});

router.post('/get_comprobante_by_caja', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Caja',valor_parametro:req.app.locals.caja[0].Cod_Caja},
        {nom_parametro:'Cod_TipoComprobante',valor_parametro:'CV'}
    ]
    procedimientos =[
        {nom_respuesta:'comprobante_caja',sp_name:'USP_CAJ_CAJAS_DOC_TXCodCajaComprobante',parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
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
        {nom_respuesta:'entidades_financieras',sp_name:'USP_VIS_ENTIDADES_FINANCIERAS_TT ',parametros},
        {nom_respuesta: 'diagramas', sp_name: 'USP_VIS_DIAGRAMAS_XML_TXCodTabla',parametros: [{ nom_parametro: 'Cod_Tabla', valor_parametro: 'CAJ_CAJA_MOVIMIENTOS' }] },
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
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
    Ejecutar_Procedimientos(req,res,procedimientos)
});


module.exports = router;