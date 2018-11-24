var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var {Ejecutar_Procedimientos,EXEC_SQL} = require('../utility/exec_sp_sql')

router.post('/reporte_general', function (req, res){
    input = req.body 
    parametros = [
        { nom_parametro: 'Cod_Libro', valor_parametro: input.Cod_Libro },
        { nom_parametro: 'Cod_Sucursal', valor_parametro: input.Cod_Sucursal },
        { nom_parametro: 'Id_Cliente', valor_parametro: input.Id_Cliente },
        { nom_parametro: 'Cod_Caja', valor_parametro: input.Cod_Caja },
        { nom_parametro: 'Id_producto', valor_parametro: input.Id_producto,tipo_parametro:sql.Int },
        { nom_parametro: 'FechaInicio', valor_parametro: input.FechaInicio,tipo_parametro:sql.VarChar },
        { nom_parametro: 'FechaFin', valor_parametro: input.FechaFin,tipo_parametro:sql.VarChar },
        { nom_parametro: 'Cod_TurnoInicio', valor_parametro: input.Cod_TurnoInicio },
        { nom_parametro: 'Cod_TurnoFinal', valor_parametro: input.Cod_TurnoFin },
        { nom_parametro: 'Cod_Moneda', valor_parametro: input.Cod_Moneda },
        { nom_parametro: 'Cod_FormaPago', valor_parametro: input.Cod_FormaPago },
        { nom_parametro: 'Cod_TipoComprobante', valor_parametro: input.Cod_TipoComprobante},
        { nom_parametro: 'Serie', valor_parametro: input.Serie },
        { nom_parametro: 'Cod_Licitacion', valor_parametro: input.Cod_Licitacion },
        { nom_parametro: 'Cod_Categoria', valor_parametro: input.Cod_Categoria },
        { nom_parametro: 'Anulados', valor_parametro: input.Anulados }
    ]
     
    procedimientos = [
        { nom_respuesta: 'detalles', sp_name: 'URP_CAJ_COMPROBANTE_PAGO_ReporteGeneral', parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
})

router.post('/reporte_general_forma_pago', function (req, res){
    input = req.body 
    parametros = [
        { nom_parametro: 'Cod_Libro', valor_parametro: input.Cod_Libro },        
        { nom_parametro: 'Cod_Caja', valor_parametro: input.Cod_Caja },
        { nom_parametro: 'Cod_Moneda', valor_parametro: input.Cod_Moneda },
        { nom_parametro: 'Cod_TipoFormaPago', valor_parametro: input.Cod_FormaPago },
        { nom_parametro: 'Cod_TipoComprobante', valor_parametro: input.Cod_TipoComprobante},
        { nom_parametro: 'Serie', valor_parametro: input.Serie },
        { nom_parametro: 'Id_Cliente', valor_parametro: input.Id_Cliente },
        { nom_parametro: 'Id_ComprobantePago', valor_parametro: input.Id_ComprobantePago },
        { nom_parametro: 'FechaInicio', valor_parametro: input.FechaInicio },
        { nom_parametro: 'FechaFin', valor_parametro: input.FechaFin }
    ]
     
    procedimientos = [
        { nom_respuesta: 'detalles', sp_name: 'URP_CAJ_FORMA_PAGO_ReporteGeneral', parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
})

router.post('/reporte_general_almacen', function (req, res){
    input = req.body 
    parametros = [
        { nom_parametro: 'Cod_TipoComprobante', valor_parametro: input.Cod_TipoComprobante },
        { nom_parametro: 'FechaInicio', valor_parametro: input.FechaInicio,tipo_parametro:sql.VarChar },
        { nom_parametro: 'FechaFin', valor_parametro: input.FechaFin,tipo_parametro:sql.VarChar },
        { nom_parametro: 'Cod_Almacen', valor_parametro: input.Cod_Almacen },
        { nom_parametro: 'Cod_TipoOperacion', valor_parametro: input.Cod_TipoOperacion },
        { nom_parametro: 'Cod_Turno', valor_parametro: input.Cod_Turno }, 
        { nom_parametro: 'Serie', valor_parametro: input.Serie },
        { nom_parametro: 'Flag_Anulado', valor_parametro: input.Flag_Anulado }, 
        { nom_parametro: 'Flag_SoloConRef', valor_parametro: input.Flag_SoloConRef }
    ]
     
    procedimientos = [
        { nom_respuesta: 'detalles', sp_name: 'URP_ALM_ALMACEN_MOV_ReporteGeneral', parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
})

router.post('/reporte_general_kardex', function (req, res){
    input = req.body 
    parametros = [
        { nom_parametro: 'Flag_Contable', valor_parametro: input.Flag_Contable },
        { nom_parametro: 'FechaInicio', valor_parametro: input.FechaInicio,tipo_parametro:sql.VarChar },
        { nom_parametro: 'FechaFin', valor_parametro: input.FechaFin,tipo_parametro:sql.VarChar },
        { nom_parametro: 'Cod_Periodo', valor_parametro: input.Cod_Periodo },
        { nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor },
        { nom_parametro: 'Cod_Categoria', valor_parametro: input.Cod_Categoria },
        { nom_parametro: 'Id_producto', valor_parametro: input.Id_producto,tipo_parametro:sql.Int },
        { nom_parametro: 'Cod_Almacen', valor_parametro: input.Cod_Almacen },
    ]
     
    procedimientos = [
        { nom_respuesta: 'detalles', sp_name: 'URP_CAJ_COMPROBANTE_PAGO_Kardex', parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
})

router.post('/reporte_general_kardex_detallado', function (req, res){
    input = req.body 
    parametros = [
        { nom_parametro: 'Flag_Contable', valor_parametro: input.Flag_Contable },
        { nom_parametro: 'FechaInicio', valor_parametro: input.FechaInicio,tipo_parametro:sql.VarChar },
        { nom_parametro: 'FechaFin', valor_parametro: input.FechaFin,tipo_parametro:sql.VarChar },
        { nom_parametro: 'Cod_Periodo', valor_parametro: input.Cod_Periodo },
        { nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor },
        { nom_parametro: 'Cod_Categoria', valor_parametro: input.Cod_Categoria },
        { nom_parametro: 'Id_producto', valor_parametro: input.Id_producto,tipo_parametro:sql.Int },
        { nom_parametro: 'Cod_Almacen', valor_parametro: input.Cod_Almacen },
    ]
     
    procedimientos = [
        { nom_respuesta: 'detalles', sp_name: 'URP_CAJ_COMPROBANTE_PAGO_KardexDetallado', parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
})


router.post('/reporte_auxiliar', function (req, res){
    input = req.body 
    parametros = [
        { nom_parametro: 'Cod_Libro', valor_parametro: input.Cod_Libro },
        { nom_parametro: 'Cod_Sucursal', valor_parametro: input.Cod_Sucursal },
        { nom_parametro: 'Id_Cliente', valor_parametro: input.Id_Cliente },
        { nom_parametro: 'Cod_Caja', valor_parametro: input.Cod_Caja },
        { nom_parametro: 'FechaInicio', valor_parametro: input.FechaInicio,tipo_parametro:sql.VarChar },
        { nom_parametro: 'FechaFin', valor_parametro: input.FechaFin,tipo_parametro:sql.VarChar },
        { nom_parametro: 'Cod_TurnoInicio', valor_parametro: input.Cod_TurnoInicio },
        { nom_parametro: 'Cod_TurnoFinal', valor_parametro: input.Cod_TurnoFin },
        { nom_parametro: 'Cod_Moneda', valor_parametro: input.Cod_Moneda },
        { nom_parametro: 'Cod_FormaPago', valor_parametro: input.Cod_FormaPago },
        { nom_parametro: 'Cod_TipoComprobante', valor_parametro: input.Cod_TipoComprobante},
        { nom_parametro: 'Serie', valor_parametro: input.Serie },
    ]
     
    procedimientos = [
        { nom_respuesta: 'detalles', sp_name: 'URP_CAJ_COMPROBANTE_PAGO_ReporteAuxiliar', parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
})

router.post('/reporte_auxiliar_detallado', function (req, res){
    input = req.body 
    parametros = [
        { nom_parametro: 'Cod_Libro', valor_parametro: input.Cod_Libro },
        { nom_parametro: 'Cod_Sucursal', valor_parametro: input.Cod_Sucursal },
        { nom_parametro: 'Id_Cliente', valor_parametro: input.Id_Cliente },
        { nom_parametro: 'Cod_Caja', valor_parametro: input.Cod_Caja },
        { nom_parametro: 'FechaInicio', valor_parametro: input.FechaInicio,tipo_parametro:sql.VarChar },
        { nom_parametro: 'FechaFin', valor_parametro: input.FechaFin,tipo_parametro:sql.VarChar },
        { nom_parametro: 'Cod_TurnoInicio', valor_parametro: input.Cod_TurnoInicio },
        { nom_parametro: 'Cod_TurnoFinal', valor_parametro: input.Cod_TurnoFin },
        { nom_parametro: 'Cod_Moneda', valor_parametro: input.Cod_Moneda },
        { nom_parametro: 'Cod_FormaPago', valor_parametro: input.Cod_FormaPago },
        { nom_parametro: 'Cod_TipoComprobante', valor_parametro: input.Cod_TipoComprobante},
        { nom_parametro: 'Serie', valor_parametro: input.Serie },
        { nom_parametro: 'Id_producto', valor_parametro: input.Id_producto,tipo_parametro:sql.Int },
    ]
     
    procedimientos = [
        { nom_respuesta: 'detalles', sp_name: 'URP_CAJ_COMPROBANTE_PAGO_ReporteAuxiliarD', parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
})

router.post('/get_variables_reporte_comprobante', function (req, res){
    input = req.body
    procedimientos = [
        {nom_respuesta: 'sucursales', sp_name: 'USP_PRI_SUCURSAL_TT', parametros:[]},
        {nom_respuesta: 'categorias', sp_name: 'USP_PRI_CATEGORIA_TT', parametros:[]},
        {nom_respuesta: 'formas_pago', sp_name: 'USP_VIS_FORMAS_PAGO_TT', parametros:[]},
        {nom_respuesta: 'monedas', sp_name: 'USP_VIS_MONEDAS_TT', parametros:[]},
        {nom_respuesta: 'tipos_comprobantes', sp_name: 'USP_VIS_TIPO_COMPROBANTES_TT', parametros:[]}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
})

router.post('/get_variables_reporte_formas_pago', function (req, res){
    input = req.body
    procedimientos = [
        {nom_respuesta: 'cajas', sp_name: 'USP_CAJ_CAJAS_TT', parametros:[]}, 
        {nom_respuesta: 'formas_pago', sp_name: 'USP_VIS_FORMAS_PAGO_TT', parametros:[]},
        {nom_respuesta: 'monedas', sp_name: 'USP_VIS_MONEDAS_TT', parametros:[]},
        {nom_respuesta: 'tipos_comprobantes', sp_name: 'USP_VIS_TIPO_COMPROBANTES_TT', parametros:[]}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
})
 
router.post('/get_variables_reporte_movimientos_almacen', function (req, res){
    input = req.body
    parametros = [
        { nom_parametro: 'Cod_TipoComprobante', valor_parametro: input.Cod_TipoComprobante }
    ]
    procedimientos = [
        {nom_respuesta: 'almacenes', sp_name: 'USP_ALM_ALMACEN_TT', parametros:[]}, 
        {nom_respuesta: 'tipos_operaciones', sp_name: 'USP_VIS_TIPO_OPERACIONES_TXComprobante', parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
})

router.post('/get_variables_reporte_kardex', function (req, res){
    input = req.body
    procedimientos = [
        {nom_respuesta: 'categorias', sp_name: 'USP_PRI_CATEGORIA_TArbol', parametros:[]},
        {nom_respuesta: 'almacenes', sp_name: 'USP_ALM_ALMACEN_TT', parametros:[]}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
})

router.post('/get_variables_reporte_cajas', function (req, res){
    input = req.body
    procedimientos = [
        {nom_respuesta: 'sucursales', sp_name: 'USP_PRI_SUCURSAL_TT', parametros:[]},
        {nom_respuesta: 'categorias', sp_name: 'USP_PRI_CATEGORIA_TT', parametros:[]},
        {nom_respuesta: 'formas_pago', sp_name: 'USP_VIS_FORMAS_PAGO_TT', parametros:[]},
        {nom_respuesta: 'monedas', sp_name: 'USP_VIS_MONEDAS_TT', parametros:[]},
        {nom_respuesta: 'tipos_comprobantes', sp_name: 'USP_VIS_TIPO_COMPROBANTES_TT', parametros:[]},
        {nom_respuesta: 'tipos_conceptos', sp_name: 'USP_VIS_TIPO_CONCEPTO_TT', parametros:[]}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
})

router.post('/get_variables_conceptos_clase', function (req, res){
    input = req.body
    parametros = [
        { nom_parametro: 'Cod_ClaseConcepto', valor_parametro: input.Cod_clase}
    ]
    procedimientos = [
        {nom_respuesta: 'conceptos', sp_name: 'USP_CAJ_CONCEPTO_TXClase', parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
})

router.post('/reporte_general_cuentas', function (req, res){
    input = req.body 
    parametros = [
        { nom_parametro: 'Cod_Libro', valor_parametro: input.Cod_Libro },
        { nom_parametro: 'Cod_Sucursal', valor_parametro: input.Cod_Sucursal },
        { nom_parametro: 'Cod_Caja', valor_parametro: input.Cod_Caja },
        { nom_parametro: 'Cod_TipoComprobante', valor_parametro: input.Cod_TipoComprobante},
        { nom_parametro: 'Cod_Moneda', valor_parametro: input.Cod_Moneda },
        { nom_parametro: 'Id_Cliente', valor_parametro: input.Id_Cliente },
        { nom_parametro: 'FechaInicio', valor_parametro: input.FechaInicio},
        { nom_parametro: 'FechaFin', valor_parametro: input.FechaFin}
    ]
    procedimientos = [
        { nom_respuesta: 'detalles', sp_name: 'URP_CAJ_COMPROBANTE_PAGO_TXPendientesCobrarPagar', parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
})
router.post('/reporte_movimientos_caja', function (req, res){
    input = req.body 
    parametros = [
        { nom_parametro: 'Cod_Caja', valor_parametro: input.Cod_Caja },
        { nom_parametro: 'Cod_TurnoInicio', valor_parametro: input.Cod_TurnoInicio},
        { nom_parametro: 'Cod_TurnoFinal', valor_parametro: input.Cod_TurnoInicio},
        { nom_parametro: 'Id_Concepto', valor_parametro: input.Concepto },
        { nom_parametro: 'Cod_TipoConcepto', valor_parametro: input.Cod_TipoConcepto },
        { nom_parametro: 'Id_ClienteProvedor', valor_parametro: input.Id_Cliente },
        { nom_parametro: 'Cod_TipoComprobate', valor_parametro: input.Cod_TipoComprobante},
        { nom_parametro: 'Serie', valor_parametro: input.Serie },
        { nom_parametro: 'Numero', valor_parametro: input.Numero },
        { nom_parametro: 'FechaInicio', valor_parametro: input.FechaInicio},
        { nom_parametro: 'FechaFin', valor_parametro: input.FechaFin},
        { nom_parametro: 'Cod_UsuarioAct', valor_parametro: null},
        { nom_parametro: 'FechaInicioAct', valor_parametro: null},
        { nom_parametro: 'FechaFinAct', valor_parametro: null}
    ] 
    procedimientos = [
        { nom_respuesta: 'detalles', sp_name: 'URP_CAJ_CAJA_MOVIMIENTOS_ReporteGeneral', parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
})

router.post('/reporte_resumen_caja', function (req, res){
    input = req.body 
    parametros = [
        { nom_parametro: 'Cod_Caja', valor_parametro: input.Cod_Caja },
        { nom_parametro: 'Cod_Turno', valor_parametro: input.Cod_Turno}
       
    ]
    procedimientos = [
        { nom_respuesta: 'detalles', sp_name: 'URP_ResumenTurno', parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
})

router.post('/reporte_stock', function (req, res){
    input = req.body 
    parametros = [
        { nom_parametro: 'Cod_UnidadMedida', valor_parametro: input.Cod_UnidadMedida },
        { nom_parametro: 'Cod_Almacen', valor_parametro: input.Cod_Almacen},
        { nom_parametro: 'Cod_Moneda', valor_parametro: input. Cod_Moneda},
        { nom_parametro: 'Cod_Categoria', valor_parametro: input.Cod_Categoria_producto},
        { nom_parametro: 'Cod_Marca', valor_parametro: input.Cod_Marca},
        { nom_parametro: 'Flag_Activos', valor_parametro: input.Flag_Activos},
        { nom_parametro: 'Flag_IncluirCero', valor_parametro: input.Flag_IncluirCero},
        { nom_parametro: 'Flag_SoloNegativos', valor_parametro: input.Flag_SoloNegativos},
        { nom_parametro: 'Cod_Caja', valor_parametro: input.Cod_Caja},
        { nom_parametro: 'Fecha', valor_parametro: input.FechaLimite}
    ] 
    procedimientos = [
        { nom_respuesta: 'detalles', sp_name: 'URP_PRI_PRODUCTO_STOCK_ReporteGeneral', parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
})
 

module.exports = router;