var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var {Ejecutar_Procedimientos,EXEC_SQL_OUTPUT,EXEC_SQL} = require('../utility/exec_sp_sql')

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
 

module.exports = router;