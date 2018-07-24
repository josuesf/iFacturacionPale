var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var { Ejecutar_Procedimientos, EXEC_SQL } = require('../utility/exec_sp_sql')
// define the home page route
router.post('/get_variables_recibo_iegreso', function (req, res) {
    input = req.body

    parametros = [
        { nom_parametro: 'Cod_Caja', valor_parametro: req.app.locals.caja[0].Cod_Caja },
        { nom_parametro: 'Cod_TipoComprobante', valor_parametro: input.Cod_TipoComprobante },
    ]
    EXEC_SQL('USP_CAJ_CAJAS_DOC_TXCodCajaComprobante', parametros, function (o) {
        if (o.error) return res.json({ respuesta: 'error', detalle_error: o.error })
        p = [
            { nom_parametro: 'Serie', valor_parametro: o.result[0].Serie },
            { nom_parametro: 'Cod_TipoComprobante', valor_parametro: o.result[0].Cod_TipoComprobante }
        ]
        EXEC_SQL('USP_CAJ_MOVIMIENTOS_NumeroXTipoSerie', p, function (m) {
            parametros2 = [
                { nom_parametro: 'Cod_ClaseConcepto', valor_parametro: input.Cod_ClaseConcepto },
                { nom_parametro: 'Flag_Activo', valor_parametro: '1' },
            ]
            procedimientos = [
                { nom_respuesta: 'monedas', sp_name: 'USP_VIS_MONEDAS_TT', parametros: [] },
                { nom_respuesta: 'documentos', sp_name: 'USP_VIS_TIPO_DOCUMENTOS_TT', parametros: [] },
                { nom_respuesta: 'conceptos', sp_name: 'USP_CAJ_CONCEPTO_TXClaseConcepto', parametros: parametros2 },
                { nom_respuesta: 'diagrama', sp_name: 'USP_VIS_DIAGRAMAS_XML_TXCodTabla',parametros: [{ nom_parametro: 'Cod_Tabla', valor_parametro: 'CAJ_CAJA_MOVIMIENTOS' }] },
            ]
            var respuesta_previa = [
                { nombre: 'Serie', valor: o.result },
                { nombre: 'Numero', valor: m.result[0].Numero }
            ]
            Ejecutar_Procedimientos(req,res, procedimientos, respuesta_previa)
        })
    })

});
router.post('/get_cliente_by_nro_documento',function(req,res){
    input =req.body
    parametros = [
        { nom_parametro: 'Nro_Documento', valor_parametro: input.Nro_Documento },
        { nom_parametro: 'Cod_TipoDocumento', valor_parametro: input.Cod_TipoDocumento },
    ]
    procedimientos = [
        { nom_respuesta: 'cliente', sp_name: 'USP_PRI_CLIENTE_TXDocumento', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})
router.post('/guardar_recibo',function(req,res){
    input =req.body
    parametros = [
        { nom_parametro: 'id_Movimiento', valor_parametro: -1 },
        { nom_parametro: 'Cod_Caja', valor_parametro: req.app.locals.caja[0].Cod_Caja },
        { nom_parametro: 'Cod_Turno', valor_parametro: req.app.locals.turno[0].Cod_Turno },
        { nom_parametro: 'Id_Concepto', valor_parametro: input.Id_Concepto },
        { nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor },
        { nom_parametro: 'Cliente', valor_parametro: input.Cliente },
        { nom_parametro: 'Des_Movimiento', valor_parametro: input.Des_Movimiento },
        { nom_parametro: 'Cod_TipoComprobante', valor_parametro: input.Cod_TipoComprobante },
        { nom_parametro: 'Serie', valor_parametro: input.Serie},
        { nom_parametro: 'Numero', valor_parametro: input.Numero,tipo_parametro:sql.VarChar },
        { nom_parametro: 'Fecha', valor_parametro: input.Fecha },
        { nom_parametro: 'Tipo_Cambio', valor_parametro: '1' },
        { nom_parametro: 'Ingreso', valor_parametro: input.MontoIngreso },
        { nom_parametro: 'Cod_MonedaIng', valor_parametro: input.Cod_Moneda },
        { nom_parametro: 'Egreso', valor_parametro:  input.MontoEgreso },
        { nom_parametro: 'Cod_MonedaEgr', valor_parametro: input.Cod_Moneda},
        { nom_parametro: 'Flag_Extornado', valor_parametro: '0' },
        { nom_parametro: 'Cod_UsuarioAut', valor_parametro: req.session.username },
        { nom_parametro: 'Fecha_Aut', valor_parametro: input.Fecha },
        { nom_parametro: 'Obs_Movimiento',tipo_parametro:sql.Xml, valor_parametro: input.Obs_Movimiento },
        { nom_parametro: 'Id_MovimientoRef', valor_parametro: '0' },
        { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username },
    ]
    procedimientos = [
        { nom_respuesta: 'cliente', sp_name: 'USP_CAJ_CAJA_MOVIMIENTOS_G', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})


router.post('/get_comprobante_by_cliente', function (req, res) {
    
    input = req.body 

    parametros = [
        {nom_parametro: 'Id_Cliente', valor_parametro: input.Id_Cliente},
        {nom_parametro: 'Cod_TipoComprobante', valor_parametro: input.Cod_TipoComprobante},
        {nom_parametro: 'Serie', valor_parametro: input.Serie},
        {nom_parametro: 'Numero', valor_parametro: input.Numero,tipo_parametro:sql.VarChar},
    ]
     
    procedimientos = [
        { nom_respuesta: 'comprobante', sp_name: 'USP_CAJ_COMPROBANTE_PAGO_TXClienteTipoSerieNumero', parametros}
        
    ]  
    Ejecutar_Procedimientos(req,res, procedimientos)
});


router.post('/get_cuentas_by_cobrar_pagar', function (req, res) {
    
    input = req.body 

    parametros = [
        {nom_parametro: 'Id_Cliente', valor_parametro:  input.Id_Cliente},
        {nom_parametro: 'Cod_Libro', valor_parametro:  input.Cod_Libro},
        {nom_parametro: 'FechaInicio', valor_parametro:  input.FechaInicio},
        {nom_parametro: 'FechaFin', valor_parametro:  input.FechaFin},
        {nom_parametro: 'Cod_Moneda', valor_parametro: input.Cod_Moneda},
        {nom_parametro: 'Vencimiento', valor_parametro: input.Vencimiento},
        {nom_parametro: 'Cod_Licitacion', valor_parametro: input.Cod_Licitacion},
    ]
     
    procedimientos = [
        { nom_respuesta: 'cuentas', sp_name: 'USP_CAJ_COMPROBANTE_PAGO_TXPagarCobrar', parametros}
        
    ]  
    Ejecutar_Procedimientos(req,res, procedimientos)
});



router.post('/get_variables_cuentas_cobrar_pagar', function (req, res) {
    
    var data = {}
    
    input = req.body 

    parametros = [
        {nom_parametro: 'Cod_Caja', valor_parametro: req.app.locals.caja[0].Cod_Caja},
        {nom_parametro: 'Cod_TipoComprobante', valor_parametro: input.Cod_TipoComprobante}
    ]

     
    EXEC_SQL('USP_VIS_TIPO_DOCUMENTOS_TT', [], function (dataDocumentos) {
        if (dataDocumentos.error) return res.json({ respuesta: 'error', detalle_error: dataDocumentos.error })
        data['dataDocumentos'] = dataDocumentos.result
        EXEC_SQL('USP_VIS_FORMAS_PAGO_TT', [], function (dataFormasPago) {
            if (dataFormasPago.error) return res.json({ respuesta: 'error', detalle_error: dataFormasPago.error })
            data['dataFormasPago'] = dataFormasPago.result            
            EXEC_SQL('USP_VIS_MONEDAS_TT', [], function (dataMonedas) {
                if (dataMonedas.error) return res.json({ respuesta: 'error', detalle_error: dataMonedas.error })
                data['dataMonedas'] = dataMonedas.result
                EXEC_SQL('USP_CAJ_CAJAS_DOC_TXCodCajaComprobante', parametros, function (dataComprobante) {
                    if (dataComprobante.error) return res.json({ respuesta: 'error', detalle_error: dataComprobante.error })
                    data['dataComprobante'] = dataComprobante.result
                    var parametros1 = [
                        {nom_parametro: 'Cod_TipoComprobante', valor_parametro: input.Cod_TipoComprobante},
                        {nom_parametro: 'Serie', valor_parametro: dataComprobante.result[0].Serie},
                    ] 

                    EXEC_SQL('USP_CAJ_MOVIMIENTOS_NumeroXTipoSerie', parametros1, function (dataMov) {
                        if (dataMov.error) return res.json({ respuesta: 'error', detalle_error: dataMov.error })
                        
                        /*parametros2 = [
                            {nom_parametro: 'Id_Cliente', valor_parametro:  input.Id_Cliente},
                            {nom_parametro: 'Cod_Libro', valor_parametro:  input.Cod_Libro},
                            {nom_parametro: 'FechaInicio', valor_parametro:  input.FechaInicio},
                            {nom_parametro: 'FechaFin', valor_parametro:  input.FechaFin},
                            {nom_parametro: 'Cod_Moneda', valor_parametro: input.Cod_Moneda},
                            {nom_parametro: 'Vencimiento', valor_parametro: input.Vencimiento},
                            {nom_parametro: 'Cod_Licitacion', valor_parametro: input.Cod_Licitacion},
                        ]*/

                        data['dataMov'] = dataMov.result
                        return res.json({ respuesta: 'ok', data })
                        /*EXEC_SQL('USP_CAJ_COMPROBANTE_PAGO_TXPagarCobrar', parametros2, function (dataPagarCobrar) {
                            if (dataPagarCobrar.error) return res.json({ respuesta: 'error', detalle_error: dataPagarCobrar.error })
                            data['dataPagarCobrar'] = dataPagarCobrar.result
                            return res.json({ respuesta: 'ok', data })
                        })*/
                    })
                })
            })
        })
    })

    
});

module.exports = router;