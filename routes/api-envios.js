var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var { Ejecutar_Procedimientos,EXEC_SQL_OUTPUT } = require('../utility/exec_sp_sql')

router.post('/get_cajas_envios', function (req, res) {
    input = req.body
    parametros=[]
    parametros1 = [
        { nom_parametro: 'Cod_Caja', valor_parametro: req.app.locals.caja[0].Cod_Caja }
    ]

    parametros2 = [
        { nom_parametro: 'Cod_Sucursal', valor_parametro: req.app.locals.sucursal[0].Cod_Sucursal }
    ]

    parametros3 = [
        { nom_parametro: 'Cod_Caja', valor_parametro: req.app.locals.caja[0].Cod_Caja },
        { nom_parametro: 'Cod_TipoComprobante', valor_parametro: 'RT' }
    ]


    procedimientos = [
        { nom_respuesta: 'cajas', sp_name: 'USP_CAJ_CAJAS_TT ', parametros },
        { nom_respuesta: 'cajas_diferentes', sp_name: 'USP_CAJ_CAJAS_TDiferenteCaja', parametros : parametros1},
        { nom_respuesta: 'monedas', sp_name: 'USP_VIS_MONEDAS_TT ', parametros },
        { nom_respuesta: 'cuentas_bancarias', sp_name: 'USP_BAN_CUENTA_BANCARIA_TXSucursal ', parametros : parametros2},
        { nom_respuesta: 'serie', sp_name: 'USP_CAJ_CAJAS_DOC_TXCodCajaComprobante ', parametros:parametros3 },
    ]
   
    Ejecutar_Procedimientos(req,res, procedimientos)
});


router.post('/guardar_movimientos_egreso_caja', function (req, res) {
    input = req.body 
    parametros = [
        { nom_parametro: 'id_Movimiento', valor_parametro: -1,  tipo:"output"},
        { nom_parametro: 'Cod_Caja', valor_parametro: req.app.locals.caja[0].Cod_Caja },
        { nom_parametro: 'Cod_Turno', valor_parametro: req.app.locals.turno[0].Cod_Turno },
        { nom_parametro: 'Id_Concepto', valor_parametro: input.Id_Concepto },
        { nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor },
        { nom_parametro: 'Cliente', valor_parametro: input.Cliente },
        { nom_parametro: 'Des_Movimiento', valor_parametro: input.Des_Movimiento },
        { nom_parametro: 'Cod_TipoComprobante', valor_parametro: 'RT' },
        { nom_parametro: 'Serie', valor_parametro: input.Serie},
        { nom_parametro: 'Numero', valor_parametro: '' , tipo_parametro:sql.VarChar},
        { nom_parametro: 'Fecha', valor_parametro: input.Fecha },
        { nom_parametro: 'Tipo_Cambio', valor_parametro: input.Tipo_Cambio },
        { nom_parametro: 'Ingreso', valor_parametro: input.Ingreso },
        { nom_parametro: 'Cod_MonedaIng', valor_parametro: input.Cod_MonedaIng },
        { nom_parametro: 'Egreso', valor_parametro: input.Egreso },
        { nom_parametro: 'Cod_MonedaEgr', valor_parametro: input.Cod_MonedaEgr },
        { nom_parametro: 'Flag_Extornado', valor_parametro: input.Flag_Extornado },
        { nom_parametro: 'Cod_UsuarioAut', valor_parametro: req.session.username },
        { nom_parametro: 'Fecha_Aut', valor_parametro: input.Fecha_Aut },
        { nom_parametro: 'Obs_Movimiento', valor_parametro: input.Obs_Movimiento },
        { nom_parametro: 'Id_MovimientoRef', valor_parametro:  input.Id_MovimientoRef },
        { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username }
    ]

    EXEC_SQL_OUTPUT('USP_CAJ_CAJA_MOVIMIENTOS_G', parametros , function (dataResult) {
        if (dataResult.error) return res.json({ respuesta: 'error', detalle_error: dataResult.error })
        res.json({ respuesta: 'ok', data:dataResult.result[0].valor })
    })
});

router.post('/guardar_movimientos_ingreso_otra_caja', function (req, res) {
    input = req.body 
    parametros = [
        { nom_parametro: 'id_Movimiento', valor_parametro: -1},
        { nom_parametro: 'Cod_Caja', valor_parametro: input.Cod_Caja },
        { nom_parametro: 'Cod_Turno', valor_parametro: input.Cod_Turno },
        { nom_parametro: 'Id_Concepto', valor_parametro: input.Id_Concepto },
        { nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor },
        { nom_parametro: 'Cliente', valor_parametro: input.Cliente },
        { nom_parametro: 'Des_Movimiento', valor_parametro: input.Des_Movimiento },
        { nom_parametro: 'Cod_TipoComprobante', valor_parametro: 'RT' },
        { nom_parametro: 'Serie', valor_parametro: input.Serie },
        { nom_parametro: 'Numero', valor_parametro: '' },
        { nom_parametro: 'Fecha', valor_parametro: input.Fecha },
        { nom_parametro: 'Tipo_Cambio', valor_parametro: input.Tipo_Cambio },
        { nom_parametro: 'Ingreso', valor_parametro: input.Ingreso },
        { nom_parametro: 'Cod_MonedaIng', valor_parametro: input.Cod_MonedaIng },
        { nom_parametro: 'Egreso', valor_parametro: input.Egreso },
        { nom_parametro: 'Cod_MonedaEgr', valor_parametro: input.Cod_MonedaEgr },
        { nom_parametro: 'Flag_Extornado', valor_parametro: input.Flag_Extornado },
        { nom_parametro: 'Cod_UsuarioAut', valor_parametro: req.session.username },
        { nom_parametro: 'Fecha_Aut', valor_parametro: input.Fecha_Aut },
        { nom_parametro: 'Obs_Movimiento', valor_parametro: input.Obs_Movimiento },
        { nom_parametro: 'Id_MovimientoRef', valor_parametro:  input.Id_MovimientoRef },
        { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username }
    ]
 
    procedimientos = [
        { nom_respuesta: 'cajas', sp_name: 'USP_CAJ_CAJA_MOVIMIENTOS_G ', parametros }
    ]
    
    Ejecutar_Procedimientos(req,res, procedimientos)
});

router.post('/guardar_movimientos_cuenta_bancaria', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'Id_MovimientoCuenta', valor_parametro: input.Id_MovimientoCuenta},
        { nom_parametro: 'Cod_CuentaBancaria', valor_parametro: input.Cod_CuentaBancaria },
        { nom_parametro: 'Nro_Operacion', valor_parametro: input.Nro_Operacion },
        { nom_parametro: 'Des_Movimiento', valor_parametro: input.Des_Movimiento },
        { nom_parametro: 'Cod_TipoOperacionBancaria', valor_parametro: input.Cod_TipoOperacionBancaria },
        { nom_parametro: 'Fecha', valor_parametro: input.Fecha },
        { nom_parametro: 'Monto', valor_parametro: input.Monto },
        { nom_parametro: 'TipoCambio', valor_parametro: input.TipoCambio },
        { nom_parametro: 'Cod_Caja', valor_parametro: req.app.locals.caja[0].Cod_Caja },
        { nom_parametro: 'Cod_Turno', valor_parametro: req.app.locals.turno[0].Cod_Turno },
        { nom_parametro: 'Cod_Plantilla', valor_parametro: input.Cod_Plantilla },
        { nom_parametro: 'Nro_Cheque', valor_parametro: input.Nro_Cheque },
        { nom_parametro: 'Beneficiario', valor_parametro: input.Beneficiario },
        { nom_parametro: 'Id_ComprobantePago', valor_parametro: input.Id_ComprobantePago },
        { nom_parametro: 'Obs_Movimiento', valor_parametro: input.Obs_Movimiento },
        { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username }
    ]
 

    procedimientos = [
        { nom_respuesta: 'cuenta_bancaria', sp_name: 'USP_BAN_CUENTA_M_G ', parametros },
    ]
    /*parametros = [
        { nom_parametro: 'TamañoPagina', valor_parametro: input.TamanoPagina },
        { nom_parametro: 'NumeroPagina', valor_parametro: input.NumeroPagina },
        { nom_parametro: 'ScripOrden', valor_parametro: input.ScripOrden },
        { nom_parametro: 'ScripWhere', tipo_parametro: sql.NVarChar, valor_parametro: input.ScripWhere }
    ]
    procedimientos = [
        { nom_respuesta: 'clientes', sp_name: 'usp_PRI_CLIENTE_PROVEEDOR_TP', parametros },
        { nom_respuesta: 'num_filas', sp_name: 'usp_PRI_CLIENTE_PROVEEDOR_TNF', parametros: [{ nom_parametro: 'ScripWhere', valor_parametro: input.ScripWhere }] },
        { nom_respuesta: 'documentos', sp_name: 'USP_VIS_TIPO_DOCUMENTOS_TT', parametros: [] },
        { nom_respuesta: 'estados', sp_name: 'USP_VIS_ESTADO_CLIENTE_TT', parametros: [] },
        { nom_respuesta: 'condiciones', sp_name: 'USP_VIS_CONDICION_CLIENTE_TT', parametros: [] },
        { nom_respuesta: 'tipos_clientes', sp_name: 'USP_VIS_TIPO_CLIENTES_TT', parametros: [] },
        { nom_respuesta: 'tipos_comprobantes', sp_name: 'USP_VIS_TIPO_COMPROBANTES_TT', parametros: [] },
        { nom_respuesta: 'paises', sp_name: 'USP_VIS_PAISES_TT', parametros: [] },
        { nom_respuesta: 'departamentos', sp_name: 'USP_VIS_DEPARTAMENTOS_TT', parametros: [] },
        { nom_respuesta: 'formas_pago', sp_name: 'USP_VIS_FORMAS_PAGO_TT', parametros: [] },
        { nom_respuesta: 'sexos', sp_name: 'USP_VIS_SEXOS_TT', parametros: [] },
        { nom_respuesta: 'diagramas', sp_name: 'USP_VIS_DIAGRAMAS_XML_TXCodTabla', parametros: [{ nom_parametro: 'Cod_Tabla', valor_parametro: 'PRI_CLIENTE_PROVEEDOR' },] },
    ]*/
    Ejecutar_Procedimientos(req,res, procedimientos)
});

module.exports = router;