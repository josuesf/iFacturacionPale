var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var { Ejecutar_Procedimientos, EXEC_SQL, EXEC_SQL_OUTPUT } = require('../utility/exec_sp_sql')
// define the home page route
router.post('/get_comprobante_pago', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'id_ComprobantePago',valor_parametro:input.id_ComprobantePago},
    ]
    procedimientos =[
        {nom_respuesta:'comprobante_pago',sp_name:'USP_CAJ_COMPROBANTE_PAGO_TXPK',parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});
 

router.post('/extornar_comprobante_pago', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'id_ComprobantePago',valor_parametro:input.id_ComprobantePago},
        {nom_parametro:'Cod_Caja',valor_parametro:req.app.locals.caja[0].Cod_Caja},
        {nom_parametro:'Cod_Turno',valor_parametro:req.app.locals.turno[0].Cod_Turno},
        {nom_parametro:'Fecha',valor_parametro:input.Fecha},
        {nom_parametro:'Cod_Usuario',valor_parametro:req.session.username},
        {nom_parametro:'MotivoAnulacion',valor_parametro:input.MotivoAnulacion},
    ]
    procedimientos =[
        {nom_respuesta:'comprobante_pago',sp_name:'USP_CAJ_COMPROBANTE_PAGO_EXTORNAR',parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});



router.post('/get_detalle_by_comprobante_pago', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'id_ComprobantePago',valor_parametro:input.id_ComprobantePago},
    ]
    procedimientos =[
        {nom_respuesta:'detalles_comprobante_pago',sp_name:'USP_CAJ_COMPROBANTE_PAGO_TDetalleXIdComprobantePago',parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});
 

router.post('/get_variable_comprobante_pago', function (req, res) {
    input = req.body

    parametros = []
    parametros1 = [
        {nom_parametro: 'Cod_Liro', valor_parametro: input.Cod_Libro}
    ]

    parametros2 = [
        {nom_parametro: 'Cod_Caja', valor_parametro: req.app.locals.caja[0].Cod_Caja}
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
    Ejecutar_Procedimientos(req,res, procedimientos)
         
});

router.post('/get_diagramas_xml_comprobante', function (req, res) {
    input = req.body 
    parametros = [
        {nom_parametro: 'Cod_Tabla', valor_parametro: input.Cod_Tabla}
    ]
     
    procedimientos = [
        { nom_respuesta: 'diagramas', sp_name: 'USP_VIS_DIAGRAMAS_XML_TXCodTabla', parametros }
        
    ]  
    Ejecutar_Procedimientos(req,res, procedimientos)
         
});

router.post('/get_pago_adelantado', function (req, res) {
    input = req.body 
    parametros = [
        {nom_parametro: 'id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor}
    ]
     
    procedimientos = [
        { nom_respuesta: 'pagos_adelantados', sp_name: 'USP_CAJ_FORMA_PAGO_TXPagoAdelantado', parametros }
        
    ]  
    Ejecutar_Procedimientos(req,res, procedimientos)
         
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
    Ejecutar_Procedimientos(req,res, procedimientos)
         
});

router.post('/get_tipos_comprobantes', function (req, res) {
    
    input = req.body 

    parametros = [
        {nom_parametro: 'Cod_Liro', valor_parametro: input.CodLibro}
    ]
     
    procedimientos = [
        { nom_respuesta: 'tipos_comprobantes', sp_name: 'USP_VIS_TIPO_COMPROBANTES_TXLibro', parametros}
        
    ]  
    Ejecutar_Procedimientos(req,res, procedimientos)
});


router.post('/get_comprobante_by_cliente', function (req, res) {
    
    input = req.body 

    parametros = [
        {nom_parametro: 'Id_Cliente', valor_parametro: input.Id_Cliente},
        {nom_parametro: 'Cod_TipoComprobante', valor_parametro: input.Cod_TipoComprobante},
        {nom_parametro: 'Serie', valor_parametro: input.Serie},
        {nom_parametro: 'Numero', valor_parametro: input.Numero},
    ]
     
    procedimientos = [
        { nom_respuesta: 'comprobante', sp_name: 'USP_CAJ_COMPROBANTE_PAGO_TXClienteTipoSerieNumero', parametros}
        
    ]  
    Ejecutar_Procedimientos(req,res, procedimientos)
});



router.post('/get_variables_ventas', function (req, res) {
    input = req.body

    parametros = [
        { nom_parametro: 'Cod_Caja', valor_parametro: req.app.locals.caja[0].Cod_Caja }, 
    ]
     
    procedimientos = [
        { nom_respuesta: 'almacenes', sp_name: 'USP_CAJ_CAJA_ALMACEN_TXCaja', parametros },
        { nom_respuesta: 'precios', sp_name: 'USP_VIS_PRECIOS_TT', parametros: [] },
        { nom_respuesta: 'monedas', sp_name: 'USP_VIS_MONEDAS_TT', parametros: [] },
        { nom_respuesta: 'documentos', sp_name: 'USP_VIS_TIPO_DOCUMENTOS_TT',parametros: [] },
        { nom_respuesta: 'formaspago', sp_name: 'USP_VIS_FORMAS_PAGO_TT',parametros: [] },
        { nom_respuesta: 'favoritos', sp_name: 'USP_VIS_FAVORITOS_TXCaja',parametros },
        { nom_respuesta: 'categorias', sp_name: 'USP_PRI_CATEGORIA_TArbol',parametros:[] },
    ]  
    Ejecutar_Procedimientos(req,res, procedimientos)
         
});

router.post('/get_licitacion_detallado', function (req, res) {
    input = req.body

    parametros = [
        { nom_parametro: 'Cod_Licitacion', valor_parametro: input.Cod_Licitacion }, 
        { nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor }, 
    ]
     
    procedimientos = [
        { nom_respuesta: 'licitaciones', sp_name: 'USP_PRI_LICITACIONES_TDetalladoXLicitacion', parametros }
    ]  
    Ejecutar_Procedimientos(req,res, procedimientos)
         
});

router.post('/get_comprobante_by_tipo', function (req, res) {
    
    input = req.body 

    parametros = [
        {nom_parametro: 'Cod_TipoComprobante', valor_parametro: input.Cod_TipoComprobante},
        {nom_parametro: 'Serie', valor_parametro: input.Serie},
        {nom_parametro: 'Numero', valor_parametro: input.Numero},
    ]
     
    procedimientos = [
        { nom_respuesta: 'comprobante', sp_name: 'USP_CAJ_COMPROBANTE_PAGO_TXTipoSerieNumero', parametros}
        
    ]  
    Ejecutar_Procedimientos(req,res, procedimientos)
});

router.post('/get_monedas', function (req, res) {
    input = req.body
    procedimientos = [ 
        { nom_respuesta: 'monedas', sp_name: 'USP_VIS_MONEDAS_TT', parametros: [] }
    ]  
    Ejecutar_Procedimientos(req,res, procedimientos)
         
});


router.post('/guardar_licitacion_comprobante', function (req, res) {
    
    input = req.body 

    parametros = [
        {nom_parametro: 'Id_Movimiento', valor_parametro: -1},
        {nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor},
        {nom_parametro: 'Cod_Licitacion', valor_parametro: input.Cod_Licitacion},
        {nom_parametro: 'Nro_Detalle', valor_parametro: input.Nro_Detalle},
        {nom_parametro: 'id_ComprobantePago', valor_parametro: input.id_ComprobantePago},
        {nom_parametro: 'Flag_Cancelado', valor_parametro: input.Flag_Cancelado},
        {nom_parametro: 'Obs_LicitacionesM', valor_parametro: input.Obs_LicitacionesM},
        {nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username},
    ]
     
    procedimientos = [
        { nom_respuesta: 'licitaciones', sp_name: 'USP_PRI_LICITACIONES_M_G', parametros}
        
    ]  
    Ejecutar_Procedimientos(req,res, procedimientos)
});


router.post('/get_nro_detalle_by_licitacion_producto', function (req, res) {
    
    input = req.body 

    parametros = [
        {nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor},
        {nom_parametro: 'Cod_Licitacion', valor_parametro: input.Cod_Licitacion},
        {nom_parametro: 'Id_Producto', valor_parametro: input.Id_Producto},
    ]
     
    procedimientos = [
        { nom_respuesta: 'nro_detalle', sp_name: 'USP_PRI_LICITACIONES_NroDetalleXClienteLicitacionProducto', parametros}
        
    ]  
    Ejecutar_Procedimientos(req,res, procedimientos)
});


router.post('/guardar_comprobante_pago', function (req, res) {
    var input = req.body
    var parametros = [
        { nom_parametro: 'id_ComprobantePago', valor_parametro: -1, tipo:"output",tipo_parametro:sql.Int},
        { nom_parametro: 'Cod_Libro', valor_parametro: input.Cod_Libro },
        { nom_parametro: 'Cod_Periodo', valor_parametro: req.session.periodo },
        { nom_parametro: 'Cod_Caja', valor_parametro: req.app.locals.caja[0].Cod_Caja },
        { nom_parametro: 'Cod_Turno', valor_parametro: req.app.locals.turno[0].Cod_Turno },
        { nom_parametro: 'Cod_TipoOperacion', valor_parametro: input.Cod_TipoOperacion },
        { nom_parametro: 'Cod_TipoComprobante', valor_parametro: input.Cod_TipoComprobante },
        { nom_parametro: 'Serie', valor_parametro: input.Serie },
        { nom_parametro: 'Numero', valor_parametro: input.Numero ,tipo:"output",tipo_parametro:sql.VarChar},
        { nom_parametro: 'Id_Cliente', valor_parametro: input.Id_Cliente },
        { nom_parametro: 'Cod_TipoDoc', valor_parametro: input.Cod_TipoDoc },
        { nom_parametro: 'Doc_Cliente', valor_parametro: input.Doc_Cliente },
        { nom_parametro: 'Nom_Cliente', valor_parametro: input.Nom_Cliente },
        { nom_parametro: 'Direccion_Cliente', valor_parametro: input.Direccion_Cliente },
        { nom_parametro: 'FechaEmision', valor_parametro: input.FechaEmision },
        { nom_parametro: 'FechaVencimiento', valor_parametro: input.FechaVencimiento },
        { nom_parametro: 'FechaCancelacion', valor_parametro: input.FechaCancelacion },
        { nom_parametro: 'Glosa', valor_parametro: input.Glosa },
        { nom_parametro: 'TipoCambio', valor_parametro: input.TipoCambio, tipo_parametro: sql.Numeric },
        { nom_parametro: 'Flag_Anulado', valor_parametro: input.Flag_Anulado },
        { nom_parametro: 'Flag_Despachado', valor_parametro: input.Flag_Despachado },
        { nom_parametro: 'Cod_FormaPago', valor_parametro: input.Cod_FormaPago },
        { nom_parametro: 'Descuento_Total', valor_parametro: input.Descuento_Total, tipo_parametro: sql.Numeric },
        { nom_parametro: 'Cod_Moneda', valor_parametro: input.Cod_Moneda },
        { nom_parametro: 'Impuesto', valor_parametro: input.Impuesto,tipo_parametro: sql.Numeric },
        { nom_parametro: 'Total', valor_parametro: input.Total, tipo_parametro: sql.Numeric },
        { nom_parametro: 'Obs_Comprobante', valor_parametro: input.Obs_Comprobante },
        { nom_parametro: 'Id_GuiaRemision', valor_parametro: input.Id_GuiaRemision },
        { nom_parametro: 'GuiaRemision', valor_parametro: input.GuiaRemision },
        { nom_parametro: 'id_ComprobanteRef', valor_parametro: input.id_ComprobanteRef },
        { nom_parametro: 'Cod_Plantilla', valor_parametro: input.Cod_Plantilla },
        { nom_parametro: 'Nro_Ticketera', valor_parametro: input.Nro_Ticketera },
        { nom_parametro: 'Cod_UsuarioVendedor', valor_parametro: req.session.username },
        { nom_parametro: 'Cod_RegimenPercepcion', valor_parametro: input.Cod_RegimenPercepcion },
        { nom_parametro: 'Tasa_Percepcion', valor_parametro: input.Tasa_Percepcion, tipo_parametro: sql.Numeric },
        { nom_parametro: 'Placa_Vehiculo', valor_parametro: input.Placa_Vehiculo },
        { nom_parametro: 'Cod_TipoDocReferencia', valor_parametro: input.Cod_TipoDocReferencia },
        { nom_parametro: 'Nro_DocReferencia', valor_parametro: input.Nro_DocReferencia },
        { nom_parametro: 'Valor_Resumen', valor_parametro: input.Valor_Resumen },
        { nom_parametro: 'Valor_Firma', valor_parametro: input.Valor_Firma },
        { nom_parametro: 'Cod_EstadoComprobante', valor_parametro: input.Cod_EstadoComprobante },
        { nom_parametro: 'MotivoAnulacion', valor_parametro: input.Motivo_Anulacion },
        { nom_parametro: 'Otros_Cargos', valor_parametro: input.Otros_Cargos },
        { nom_parametro: 'Otros_Tributos', valor_parametro: input.Otros_Tributos, tipo_parametro: sql.Numeric },
        { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username },
    ]

    EXEC_SQL_OUTPUT('USP_CAJ_COMPROBANTE_PAGO_G',parametros, function (dataComprobante) {
        if (dataComprobante.err){
            return res.json({respuesta:"error",detalle_error:dataComprobante.err})  
        }else{
            return res.json({respuesta:"ok",data:dataComprobante.result})
        }
    })
})



router.post('/guardar_comprobante_pago_detalle', function (req, res) {
    var input = req.body
    var parametrosComprobanteDetalles = [
        { nom_parametro: 'id_ComprobantePago', valor_parametro: input.id_ComprobantePago,tipo_parametro:sql.Int},
        { nom_parametro: 'id_Detalle', valor_parametro: input.id_Detalle,tipo_parametro:sql.Int},
        { nom_parametro: 'Id_Producto', valor_parametro: input.Id_Producto,tipo_parametro:sql.Int},
        { nom_parametro: 'Cod_Almacen', valor_parametro: input.Cod_Almacen},
        { nom_parametro: 'Cantidad', valor_parametro: input.Cantidad},
        { nom_parametro: 'Cod_UnidadMedida', valor_parametro: input.Cod_UnidadMedida},
        { nom_parametro: 'Despachado', valor_parametro: input.Despachado},
        { nom_parametro: 'Descripcion', valor_parametro: input.Descripcion},
        { nom_parametro: 'PrecioUnitario', valor_parametro: input.PrecioUnitario},
        { nom_parametro: 'Descuento', valor_parametro: input.Descuento},
        { nom_parametro: 'Sub_Total', valor_parametro: input.Sub_Total},
        { nom_parametro: 'Tipo', valor_parametro: input.Tipo},
        { nom_parametro: 'Obs_ComprobanteD', valor_parametro:  input.Obs_ComprobanteD},
        { nom_parametro: 'Cod_Manguera', valor_parametro: input.Cod_Manguera},
        { nom_parametro: 'Flag_AplicaImpuesto', valor_parametro: input.Flag_AplicaImpuesto},
        { nom_parametro: 'Formalizado', valor_parametro: input.Formalizado},
        { nom_parametro: 'Valor_NoOneroso', valor_parametro: input.Valor_NoOneroso},
        { nom_parametro: 'Cod_TipoISC', valor_parametro: input.Cod_TipoISC},
        { nom_parametro: 'Porcentaje_ISC', valor_parametro: input.Porcentaje_ISC},
        { nom_parametro: 'ISC', valor_parametro: input.ISC},
        { nom_parametro: 'Cod_TipoIGV', valor_parametro: input.Cod_TipoIGV},
        { nom_parametro: 'Porcentaje_IGV', valor_parametro: input.Porcentaje_IGV},
        { nom_parametro: 'IGV', valor_parametro: input.IGV},
        { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username}
    ]

    EXEC_SQL('USP_CAJ_COMPROBANTE_D_G',parametrosComprobanteDetalles, function (dataComprobanteDetalle) {
        if (dataComprobanteDetalle.err){
            return res.json({respuesta:"error",detalle_error:dataComprobanteDetalle.err})  
        }else{
            return res.json({respuesta:"ok"})
        }   
    }) 
})

router.post('/venta_simple', function (req, res) {
    var input = req.body
      
    var parametros = [
        { nom_parametro: 'Cod_TipoDocumento', valor_parametro: req.body.Cliente == null? '99':req.body.Cliente.Cod_TipoDocumento},
        { nom_parametro: 'Cod_Caja', valor_parametro: req.app.locals.caja[0].Cod_Caja }
    ]

    EXEC_SQL('USP_CAJ_CAJAS_DOC_TX_DOCCLIENTE',parametros, function (dataFacRapida) {
        if (dataFacRapida.err){
            return res.json({respuesta:"error",detalle_error:dataFacRapida.err})  
        }
        
        var Cod_Periodo = req.session.periodo
        var Cod_Caja = req.app.locals.caja[0].Cod_Caja
        var Cod_Turno = req.app.locals.turno[0].Cod_Turno
        var Cod_TipoOperacion = '01'

        if(dataFacRapida.result.length>0){
            var Serie = dataFacRapida.result[0].Serie
            var Cod_TipoComprobante = dataFacRapida.result[0].Cod_TipoComprobante
            var Nro_Ticketera = ""
            if(Cod_TipoComprobante == "TKB" || Cod_TipoComprobante == "TKF"){
                Nro_Ticketera = dataFacRapida.result[0].Nro_SerieTicketera   
            } 
            
            DataCliente(req,res,function(Id_Cliente,Cod_TipoDoc,Doc_Cliente,Nom_Cliente,Direccion_Cliente){
                
                var FechaEmision = input.Fecha_Emision
                var FechaVencimiento = input.Fecha_Emision
                var FechaCancelacion = input.Fecha_Emision
                var Glosa = 'POR LA VENTA DE MERCADERIA'
                var TipoCambio = 1
                var Flag_Anulado = '0'
                var Flag_Despachado = '1'
                var Cod_FormaPago =  (input.FormaPago.length == 0 || input.FormaPago==null)? '999':input.FormaPago[0].Cod_FormaPago
                var Descuento_Total = 0
                var Cod_Moneda = input.Cod_Moneda


                var impuesto = 0
                var total = 0  
                DeterminarImpuesto(0,req,impuesto,total,req.app.locals.empresa[0].Flag_ExoneradoImpuesto,function(Impuesto,Total){
                    var Obs_Comprobante = input.Obs_Comprobante
                    var Id_GuiaRemision = 0
                    var GuiaRemision = ''
                    var id_ComprobanteRef = 0
                    var Cod_Plantilla = null
                    var Numero = ''
                    var Cod_UsuarioVendedor = null
                    var Cod_RegimenPercepcion = null
                    var Tasa_Percepcion = 0
                    var Placa_Vehiculo = ''
                    var Cod_TipoDocReferencia = null
                    var Nro_DocReferencia = null
                    var Valor_Resumen = null
                    var Valor_Firma = null
                    var Cod_EstadoComprobante = 'EMI'
                    var MotivoAnulacion = null
                    var Otros_Cargos = 0
                    var Otros_Tributos = 0
                    var Cod_Usuario = req.session.username 
                    var parametrosComprobante = [
                        { nom_parametro: 'id_ComprobantePago', valor_parametro: -1, tipo:"output"},
                        { nom_parametro: 'Cod_Libro', valor_parametro: '14'},
                        { nom_parametro: 'Cod_Periodo', valor_parametro:Cod_Periodo},
                        { nom_parametro: 'Cod_Caja', valor_parametro: Cod_Caja},
                        { nom_parametro: 'Cod_Turno', valor_parametro: Cod_Turno},
                        { nom_parametro: 'Cod_TipoOperacion', valor_parametro: Cod_TipoOperacion},
                        { nom_parametro: 'Cod_TipoComprobante', valor_parametro: Cod_TipoComprobante},
                        { nom_parametro: 'Serie', valor_parametro: Serie},
                        { nom_parametro: 'Numero', valor_parametro: Numero,tipo_parametro:sql.VarChar,tipo:"output"},
                        { nom_parametro: 'Id_Cliente', valor_parametro: Id_Cliente},
                        { nom_parametro: 'Cod_TipoDoc', valor_parametro: Cod_TipoDoc},
                        { nom_parametro: 'Doc_Cliente', valor_parametro: Doc_Cliente},
                        { nom_parametro: 'Nom_Cliente', valor_parametro: Nom_Cliente},
                        { nom_parametro: 'Direccion_Cliente', valor_parametro: Direccion_Cliente},
                        { nom_parametro: 'FechaEmision', valor_parametro: FechaEmision},
                        { nom_parametro: 'FechaVencimiento', valor_parametro: FechaEmision},
                        { nom_parametro: 'FechaCancelacion', valor_parametro: FechaEmision},
                        { nom_parametro: 'Glosa', valor_parametro: Glosa},
                        { nom_parametro: 'TipoCambio', valor_parametro: TipoCambio},
                        { nom_parametro: 'Flag_Anulado', valor_parametro: Flag_Anulado},
                        { nom_parametro: 'Flag_Despachado', valor_parametro: Flag_Despachado},
                        { nom_parametro: 'Cod_FormaPago', valor_parametro: Cod_FormaPago},
                        { nom_parametro: 'Descuento_Total', valor_parametro: Descuento_Total},
                        { nom_parametro: 'Cod_Moneda', valor_parametro: Cod_Moneda},
                        { nom_parametro: 'Impuesto', valor_parametro: Impuesto},
                        { nom_parametro: 'Total', valor_parametro: Total},
                        { nom_parametro: 'Obs_Comprobante', valor_parametro: Obs_Comprobante},
                        { nom_parametro: 'Id_GuiaRemision', valor_parametro: Id_GuiaRemision},
                        { nom_parametro: 'GuiaRemision', valor_parametro: GuiaRemision},
                        { nom_parametro: 'id_ComprobanteRef', valor_parametro: id_ComprobanteRef},
                        { nom_parametro: 'Cod_Plantilla', valor_parametro: Cod_Plantilla},
                        { nom_parametro: 'Nro_Ticketera', valor_parametro: Nro_Ticketera},
                        { nom_parametro: 'Cod_UsuarioVendedor', valor_parametro: Cod_UsuarioVendedor},
                        { nom_parametro: 'Cod_RegimenPercepcion', valor_parametro: Cod_RegimenPercepcion},
                        { nom_parametro: 'Tasa_Percepcion', valor_parametro: Tasa_Percepcion},
                        { nom_parametro: 'Placa_Vehiculo', valor_parametro: Placa_Vehiculo},
                        { nom_parametro: 'Cod_TipoDocReferencia', valor_parametro: Cod_TipoDocReferencia},
                        { nom_parametro: 'Nro_DocReferencia', valor_parametro: Nro_DocReferencia},
                        { nom_parametro: 'Valor_Resumen', valor_parametro: Valor_Resumen},
                        { nom_parametro: 'Valor_Firma', valor_parametro: Valor_Firma},
                        { nom_parametro: 'Cod_EstadoComprobante', valor_parametro: Cod_EstadoComprobante},
                        { nom_parametro: 'MotivoAnulacion', valor_parametro: MotivoAnulacion},
                        { nom_parametro: 'Otros_Cargos', valor_parametro: Otros_Cargos},
                        { nom_parametro: 'Otros_Tributos', valor_parametro: Otros_Tributos},
                        { nom_parametro: 'Cod_Usuario', valor_parametro: Cod_Usuario},
                    ] 
                    
                    EXEC_SQL_OUTPUT('USP_CAJ_COMPROBANTE_PAGO_G',parametrosComprobante, function (dataComprobante) {
                        if (dataComprobante.err){
                            console.log(dataComprobante.err)
                            return res.json({respuesta:"error",detalle_error:'No se pudo guardar correctamente la venta'})
                        }
                        
                        DataDetalles(0,req,res,dataComprobante.result[0].valor,function(flag){ 
                            if(flag){
                                 
                                let FormaPago = req.body.FormaPago 
                                if(FormaPago!=null){
                                    let id_ComprobantePago = dataComprobante.result[0].valor
                                    GuardarCuentaBancaria(req,res,FormaPago,FechaEmision,Nom_Cliente,id_ComprobantePago,function(Id_Movimiento){

                                        if(Id_Movimiento!=null){
    
                                            const parametrosFormaPago = [
                                                {nom_parametro:'id_ComprobantePago',valor_parametro:id_ComprobantePago},
                                                {nom_parametro:'Item',valor_parametro:FormaPago[0].Item},
                                                {nom_parametro:'Des_FormaPago',valor_parametro:FormaPago[0].Des_FormaPago},
                                                {nom_parametro:'Cod_TipoFormaPago',valor_parametro:FormaPago[0].Cod_FormaPago},
                                                {nom_parametro:'Cuenta_CajaBanco',valor_parametro:FormaPago[0].CuentaCajaBanco},
                                                {nom_parametro:'Id_Movimiento',valor_parametro:Id_Movimiento},
                                                {nom_parametro:'TipoCambio',valor_parametro:FormaPago[0].TipoCambio},
                                                {nom_parametro:'Cod_Moneda',valor_parametro:FormaPago[0].Cod_Moneda},
                                                {nom_parametro:'Monto',valor_parametro:FormaPago[0].Monto},
                                                {nom_parametro:'Cod_Caja',valor_parametro:req.app.locals.caja[0].Cod_Caja},
                                                {nom_parametro:'Cod_Turno',valor_parametro:req.app.locals.turno[0].Cod_Turno},
                                                {nom_parametro:'Cod_Plantilla',valor_parametro:''},
                                                {nom_parametro:'Obs_FormaPago',valor_parametro:''},
                                                {nom_parametro:'Fecha',valor_parametro:FechaEmision},        
                                                {nom_parametro:'Cod_Usuario',valor_parametro:req.session.username},
                                            ]
            
                                            EXEC_SQL('USP_CAJ_FORMA_PAGO_G',parametrosFormaPago, function (dataFormaPago) {
                                                if (dataFormaPago.err){
                                                    console.log(dataFormaPago.err)
                                                    return res.json({respuesta:"error",detalle_error:'No se pudo guardar correctamente la forma de pago'})
                                                } else{
                                                    return res.json({respuesta:"ok",data:id_ComprobantePago})
                                                }
                                            })
        
        
                                        }else{
                                            return res.json({respuesta:"error",detalle_error:'No se pudo guardar correctamente la cuenta bancaria'})
                                        }
                                       

                                    })
                                    
                                } 
                            }else{
                                return res.json({respuesta:"error"})
                            }
                        })
                         
                    })
                

                })
            })

        }else{
            return res.json({respuesta:"error",detalle_error:'No se puede continuar ya que no se configuro un documento para emision rapida'})  
        }
    })
       
});

function GuardarCuentaBancaria(req,res,FormaPago,Fecha,Nom_Cliente,Id_ComprobantePago,callback){
    if(FormaPago[0].Cod_FormaPago== '11' || FormaPago[0].Cod_FormaPago== '003'){
        let Cod_CuentaBancaria = FormaPago[0].CuentaCajaBanco.split('|')[0]
        let Nro_Operacion = FormaPago[0].CuentaCajaBanco.split('|')[1]
        let Des_Movimiento = FormaPago[0].Des_FormaPago
        let Cod_TipoOperacionBancaria = '001'
        let Monto = (Cod_Libro =='08'?-1:1)*parseFloat(input.Total)
        let TipoCambio = FormaPago[0].TipoCambio
        
        
        const parametrosCtaBancaria = [
            {nom_parametro:'Id_MovimientoCuenta',valor_parametro:-1,tipo:"output"},
            {nom_parametro:'Cod_CuentaBancaria',valor_parametro:Cod_CuentaBancaria},
            {nom_parametro:'Nro_Operacion',valor_parametro:Nro_Operacion},
            {nom_parametro:'Des_Movimiento',valor_parametro:Des_Movimiento},
            {nom_parametro:'Cod_TipoOperacionBancaria',valor_parametro:Cod_TipoOperacionBancaria},
            {nom_parametro:'Fecha',valor_parametro:Fecha},
            {nom_parametro:'Monto',valor_parametro:Monto},
            {nom_parametro:'TipoCambio',valor_parametro:TipoCambio},
            {nom_parametro:'Cod_Caja',valor_parametro:req.app.locals.caja[0].Cod_Caja},
            {nom_parametro:'Cod_Turno',valor_parametro:req.app.locals.turno[0].Cod_Turno},
            {nom_parametro:'Cod_Plantilla',valor_parametro:''},
            {nom_parametro:'Nro_Cheque',valor_parametro:''},
            {nom_parametro:'Beneficiario',valor_parametro:Nom_Cliente},
            {nom_parametro:'Id_ComprobantePago',valor_parametro:Id_ComprobantePago},
            {nom_parametro:'Obs_Movimiento',valor_parametro:''},        
            {nom_parametro:'Cod_Usuario',valor_parametro:req.session.username},
        ]
        
        EXEC_SQL_OUTPUT('USP_BAN_CUENTA_M_G',parametrosComprobante, function (dataCuentaBancaria) {
            if (dataCuentaBancaria.err){
                callback(null)
            }else{
                callback(dataCuentaBancaria.result[0].valor)
            } 
        })
    }else{
        callback(0)
    }
}

function DeterminarImpuesto(i,req,impuesto,total,flagImpuesto,callback){
    if(i<req.body.Detalles.length){
        var SubTotal = (parseFloat(req.body.Detalles[i].Importe) * (1 - parseFloat(req.body.Detalles[i].Descuento)/100)).toFixed(2)
        total += parseFloat(req.body.Detalles[i].Cantidad) * parseFloat(req.body.Detalles[i].PU) * (1 - parseFloat(req.body.Detalles[i].Descuento)/100)
        if(flagImpuesto && req.body.Detalles[i].Tipo=="GRA"){
            impuesto += ((parseFloat(SubTotal) / (1+parseFloat(req.app.locals.empresa[0].Por_Impuesto))) * (parseFloat(req.app.locals.empresa[0].Por_Impuesto)/100))
        }
        DeterminarImpuesto(i+1,req,impuesto,total,flagImpuesto,callback)
    }else{ 
        callback(impuesto,total)
    }
}

function DeterminarTipoIGV(req,res,flagImpuesto,flagExportacion,Tipo,SubTotal,callback){
    var IGV = 0
    var Cod_TipoIGV = ''
    if(flagImpuesto == true){
        if(Tipo=='GRA'){
            Cod_TipoIGV = '10'
            IGV = ((parseFloat(SubTotal) / (1+parseFloat(req.app.locals.empresa[0].Por_Impuesto))) * (parseFloat(req.app.locals.empresa[0].Por_Impuesto)/100)).toFixed(2)
        }

        if(Tipo == 'GRT'){
            Cod_TipoIGV = '13'
        }
    }else{
        if(Tipo == 'GRA'){
            Cod_TipoIGV = '20'
        }
        if(Tipo == 'GRT'){
            Cod_TipoIGV = '21'
        }
    }   

    if(Tipo == 'INA'){
        Cod_TipoIGV = '30'
    }

    if(Tipo == 'EXO'){
        Cod_TipoIGV = '20'
    }

    if(flagExportacion){
        Cod_TipoIGV = '40'
        IGV = 0
    }
    callback(IGV,Cod_TipoIGV)
}

function DataDetalles(i,req,res,idComprobante,callback){
    if(i<req.body.Detalles.length){
        DeterminarTipoIGV(req,res,req.app.locals.empresa[0].Flag_ExoneradoImpuesto,false,req.body.Detalles[i].Tipo,req.body.Detalles[i].Importe,function(IGV,Cod_TipoIGV){
            var parametrosComprobanteDetalles = [
                { nom_parametro: 'id_ComprobantePago', valor_parametro: idComprobante},
                { nom_parametro: 'id_Detalle', valor_parametro: req.body.Detalles[i].id_Detalle},
                { nom_parametro: 'Id_Producto', valor_parametro:req.body.Detalles[i].Id_Producto},
                { nom_parametro: 'Cod_Almacen', valor_parametro: req.body.Detalles[i].Almacen},
                { nom_parametro: 'Cantidad', valor_parametro: req.body.Detalles[i].Cantidad},
                { nom_parametro: 'Cod_UnidadMedida', valor_parametro: req.body.Detalles[i].UM},
                { nom_parametro: 'Despachado', valor_parametro: req.body.Detalles[i].Despachado},
                { nom_parametro: 'Descripcion', valor_parametro: req.body.Detalles[i].Descripcion},
                { nom_parametro: 'PrecioUnitario', valor_parametro: req.body.Detalles[i].PU},
                { nom_parametro: 'Descuento', valor_parametro: req.body.Detalles[i].Descuento},
                { nom_parametro: 'Sub_Total', valor_parametro: req.body.Detalles[i].Importe},
                { nom_parametro: 'Tipo', valor_parametro: req.body.Detalles[i].Tipo},
                { nom_parametro: 'Obs_ComprobanteD', valor_parametro:  req.body.Detalles[i].Obs_ComprobanteD},
                { nom_parametro: 'Cod_Manguera', valor_parametro: '001'},
                { nom_parametro: 'Flag_AplicaImpuesto', valor_parametro: req.app.locals.empresa[0].Flag_ExoneradoImpuesto},
                { nom_parametro: 'Formalizado', valor_parametro: 1},
                { nom_parametro: 'Valor_NoOneroso', valor_parametro: 0},
                { nom_parametro: 'Cod_TipoISC', valor_parametro: null},
                { nom_parametro: 'Porcentaje_ISC', valor_parametro: 0},
                { nom_parametro: 'ISC', valor_parametro: 0},
                { nom_parametro: 'Cod_TipoIGV', valor_parametro: Cod_TipoIGV},
                { nom_parametro: 'Porcentaje_IGV', valor_parametro: req.app.locals.empresa[0].Por_Impuesto},
                { nom_parametro: 'IGV', valor_parametro: IGV},
                { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username}
            ]
    
            EXEC_SQL('USP_CAJ_COMPROBANTE_D_G',parametrosComprobanteDetalles, function (dataComprobanteDetalle) {
                if (dataComprobanteDetalle.err){
                    console.log(dataComprobanteDetalle.err)
                    callback(false)
                }else{
                    DataDetalles(i+1,req,res,idComprobante,callback)
                }   
            }) 
        })
      
    }else{
        callback(true)
    }
    
}

function DataCliente(req,res,callback){
    var Id_Cliente = req.body.Cliente == null? -1:req.body.Cliente.Id_Cliente
    var Cod_TipoDoc = req.body.Cliente == null? '99':req.body.Cliente.Cod_TipoDocumento//input.Cod_TipoDoc
    var Doc_Cliente =  req.body.Cliente == null? '':req.body.Cliente.Doc_Cliente
    var Nom_Cliente =  req.body.Cliente == null? '':req.body.Cliente.Nom_Cliente
    var Direccion_Cliente =  req.body.Cliente == null? '':req.body.Cliente.Direccion_Cliente

    /*if(Id_Cliente== -1){
        if(Cod_TipoDoc=='99'){
            Id_Cliente = 1 
            Doc_Cliente = '00000001'
            Nom_Cliente = 'CLIENTES VARIOS'
            Direccion_Cliente = ''
            callback(Id_Cliente,Cod_TipoDoc,Doc_Cliente,Nom_Cliente,Direccion_Cliente)
        }else{*/
            var parametrosCliente = [
                { nom_parametro: 'Id_ClienteProveedor',valor_parametro: -1, tipo:"output"},
                { nom_parametro: 'Cod_TipoDocumento', valor_parametro: Cod_TipoDoc },
                { nom_parametro: 'Nro_Documento', valor_parametro: Doc_Cliente },
                { nom_parametro: 'Cliente', valor_parametro: Nom_Cliente },
                { nom_parametro: 'Ap_Paterno', valor_parametro: '' },
                { nom_parametro: 'Ap_Materno', valor_parametro: '' },
                { nom_parametro: 'Nombres', valor_parametro: Nom_Cliente },
                { nom_parametro: 'DireccioN', valor_parametro: Direccion_Cliente },
                { nom_parametro: 'Cod_EstadoCliente', valor_parametro: '001' },
                { nom_parametro: 'Cod_CondicionCliente', valor_parametro: '01' },
                { nom_parametro: 'Cod_TipoCliente', valor_parametro: '003' },
                { nom_parametro: 'RUC_Natural', valor_parametro: '' },
                { nom_parametro: 'Foto', tipo_parametro: sql.VarBinary,valor_parametro: null },
                { nom_parametro: 'Firma', tipo_parametro: sql.VarBinary,valor_parametro: null },
                { nom_parametro: 'Cod_TipoComprobante', valor_parametro: 'TKB' },
                { nom_parametro: 'Cod_Nacionalidad', valor_parametro: '156' },
                { nom_parametro: 'Fecha_Nacimiento', valor_parametro: null },
                { nom_parametro: 'Cod_Sexo', valor_parametro: '01' },
                { nom_parametro: 'Email1', valor_parametro: '' },
                { nom_parametro: 'Email2', valor_parametro: '' },
                { nom_parametro: 'Telefono1', valor_parametro: '' },
                { nom_parametro: 'Telefono2', valor_parametro: ''},
                { nom_parametro: 'Fax', valor_parametro: '' },
                { nom_parametro: 'PaginaWeb', valor_parametro: '' },
                { nom_parametro: 'Cod_Ubigeo', valor_parametro: '080101' },
                { nom_parametro: 'Cod_FormaPago', valor_parametro: '008' },
                { nom_parametro: 'Limite_Credito', valor_parametro: 0 },
                { nom_parametro: 'Obs_Cliente', valor_parametro: null},
                { nom_parametro: 'Num_DiaCredito', valor_parametro: 0 },
                { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username }
            ]

            EXEC_SQL_OUTPUT('USP_PRI_CLIENTE_PROVEEDOR_G',parametrosCliente, function (dataCliente) {
                if (dataCliente.err)
                    return res.json({respuesta:"error",detalle_error:'No se pudo registrar el cliente correctamente'})  
                
                Id_Cliente = dataCliente.result[0].valor 
                callback(Id_Cliente,Cod_TipoDoc,Doc_Cliente,Nom_Cliente,Direccion_Cliente)
            })
        /*}
    }else{
        callback(Id_Cliente,Cod_TipoDoc,Doc_Cliente,Nom_Cliente,Direccion_Cliente)
    }*/

}


module.exports = router;