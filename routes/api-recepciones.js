var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var { Ejecutar_Procedimientos, EXEC_SQL } = require('../utility/exec_sp_sql')
// define the home page route
router.post('/get_variables_recepcion_transferencia', function (req, res) {
    input = req.body

    parametros = [
        { nom_parametro: 'Cod_Caja', valor_parametro: req.app.locals.caja[0].Cod_Caja },
        { nom_parametro: 'Cod_Turno', valor_parametro: req.app.locals.turno[0].Cod_Turno }
    ]
     
    procedimientos = [
        { nom_respuesta: 'conceptos', sp_name: 'USP_CAJ_CONCEPTO_VEfectivo ', parametros: []},
        { nom_respuesta: 'movimientos_pendientes', sp_name: 'USP_CAJ_CAJA_MOVIMIENTOS_TPendientes', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)

});

router.post('/get_recepcionados', function (req, res) {
    input = req.body

    parametros = [
        { nom_parametro: 'Cod_Caja', valor_parametro: req.app.locals.caja[0].Cod_Caja },
        { nom_parametro: 'Cod_Turno', valor_parametro: req.app.locals.turno[0].Cod_Turno }
    ]
     
    procedimientos = [
        { nom_respuesta: 'movimientos_recepcionados', sp_name: 'USP_CAJ_CAJA_MOVIMIENTOS_TRecepcionados', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)

});


router.post('/recepcionar', function (req, res) {
    input = req.body
    var Diferencia_ = input.Diferencia
    var Recibido_ = input.Recibido
    var Id_ClienteProveedor_ = input.Id_ClienteProveedor
    const fecha = new Date()
    const mes = fecha.getMonth() + 1
    const dia = fecha.getDate()
    var Fecha_Aut = fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)

    var Cliente_ = input.Cliente
    p = [
        { nom_parametro: 'id_Movimiento', valor_parametro: input.id_Movimiento }
    ]
    EXEC_SQL('usp_CAJ_CAJA_MOVIMIENTOS_TXPK', p, function (dataMovimiento) {
        if (dataMovimiento.error) return res.json({ respuesta: 'error', detalle_error: dataMovimiento.error })

        var id_MovimientoM = dataMovimiento.result[0].id_Movimiento
        var id_MovimientoRefM = dataMovimiento.result[0].Id_MovimientoRef
        var Id_ConceptoM = dataMovimiento.result[0].Id_Concepto
        var ClienteM = dataMovimiento.result[0].Cliente
        var Id_ClienteProveedorM = dataMovimiento.result[0].Id_ClienteProveedor
        var Des_MovimientoM = dataMovimiento.result[0].Des_Movimiento
        var Cod_TipoComprobanteM = dataMovimiento.result[0].Cod_TipoComprobante
        var SerieM = dataMovimiento.result[0].Serie
        var NumeroM = dataMovimiento.result[0].Numero
        var FechaM = Fecha_Aut
        var Obs_MovimientoM = dataMovimiento.result[0].Obs_Movimiento
        var IngresoM = Recibido_
        var EgresoM = dataMovimiento.result[0].Egreso
        var Cod_MonedaIngM = dataMovimiento.result[0].Cod_MonedaIng
        var Cod_MonedaEgrM = dataMovimiento.result[0].Cod_MonedaEgr
        var Tipo_CambioM = dataMovimiento.result[0].Tipo_Cambio 
                
        parametros = [
            { nom_parametro: 'id_Movimiento', valor_parametro: id_MovimientoM },
            { nom_parametro: 'Cod_Caja', valor_parametro: req.app.locals.caja[0].Cod_Caja },
            { nom_parametro: 'Cod_Turno', valor_parametro: req.app.locals.turno[0].Cod_Turno },
            { nom_parametro: 'Id_Concepto', valor_parametro: Id_ConceptoM },
            { nom_parametro: 'Id_ClienteProveedor', valor_parametro: Id_ClienteProveedorM },
            { nom_parametro: 'Cliente', valor_parametro: ClienteM },
            { nom_parametro: 'Des_Movimiento', valor_parametro: Des_MovimientoM },
            { nom_parametro: 'Cod_TipoComprobante', valor_parametro: Cod_TipoComprobanteM },
            { nom_parametro: 'Serie', valor_parametro: SerieM },
            { nom_parametro: 'Numero', valor_parametro: NumeroM },
            { nom_parametro: 'Fecha', valor_parametro: FechaM },
            { nom_parametro: 'Tipo_Cambio', valor_parametro: Tipo_CambioM },
            { nom_parametro: 'Ingreso', valor_parametro: IngresoM },
            { nom_parametro: 'Cod_MonedaIng', valor_parametro: Cod_MonedaIngM },
            { nom_parametro: 'Egreso', valor_parametro: EgresoM },
            { nom_parametro: 'Cod_MonedaEgr', valor_parametro: Cod_MonedaEgrM },
            { nom_parametro: 'Flag_Extornado', valor_parametro: 0 },
            { nom_parametro: 'Cod_UsuarioAut', valor_parametro: req.session.username },
            { nom_parametro: 'Fecha_Aut', valor_parametro: Fecha_Aut },
            { nom_parametro: 'Obs_Movimiento', valor_parametro: Obs_MovimientoM },
            { nom_parametro: 'Id_MovimientoRef', valor_parametro: id_MovimientoRefM },
            { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username }
    
        ]
        EXEC_SQL('USP_CAJ_CAJA_MOVIMIENTOS_G', parametros, function (dataMovimientoIngreso) {
            if (dataMovimientoIngreso.error) return res.json({ respuesta: 'error', detalle_error: dataMovimientoIngreso.error })
            p = [
                { nom_parametro: 'id_Movimiento', valor_parametro: id_MovimientoRefM }
            ]

            EXEC_SQL('usp_CAJ_CAJA_MOVIMIENTOS_TXPK', p, function (dataMovimiento) {
                if (dataMovimiento.error) return res.json({ respuesta: 'error', detalle_error: dataMovimiento.error })
                var id_Movimiento = dataMovimiento.result[0].id_Movimiento
                var Cod_Caja = dataMovimiento.result[0].Cod_Caja
                var Cod_Turno = dataMovimiento.result[0].Cod_Turno
                var Id_Concepto = dataMovimiento.result[0].Id_Concepto
                var Id_ClienteProveedor = dataMovimiento.result[0].Id_ClienteProveedor
                var Cliente = dataMovimiento.result[0].Cliente
                var Des_Movimiento = dataMovimiento.result[0].Des_Movimiento
                var Cod_TipoComprobante = dataMovimiento.result[0].Cod_TipoComprobante
                var Serie = dataMovimiento.result[0].Serie
                var Numero = dataMovimiento.result[0].Numero
                var Fecha = Fecha_Aut
                var Tipo_Cambio = dataMovimiento.result[0].Tipo_Cambio
                var Ingreso = dataMovimiento.result[0].Ingreso
                var Egreso = Recibido_
                var id_MovimientoRef = 0
                var Cod_MonedaIng = dataMovimiento.result[0].Cod_MonedaIng
                var Cod_MonedaEgr = dataMovimiento.result[0].Cod_MonedaEgr
                var Obs_Movimiento = dataMovimiento.result[0].Obs_Movimiento 
                parametros = [
                    { nom_parametro: 'id_Movimiento', valor_parametro: id_Movimiento },
                    { nom_parametro: 'Cod_Caja', valor_parametro: Cod_Caja },
                    { nom_parametro: 'Cod_Turno', valor_parametro: Cod_Turno },
                    { nom_parametro: 'Id_Concepto', valor_parametro: Id_Concepto },
                    { nom_parametro: 'Id_ClienteProveedor', valor_parametro: Id_ClienteProveedor },
                    { nom_parametro: 'Cliente', valor_parametro: Cliente },
                    { nom_parametro: 'Des_Movimiento', valor_parametro: Des_Movimiento },
                    { nom_parametro: 'Cod_TipoComprobante', valor_parametro: Cod_TipoComprobante },
                    { nom_parametro: 'Serie', valor_parametro: Serie },
                    { nom_parametro: 'Numero', valor_parametro: Numero,tipo_parametro:sql.VarChar },
                    { nom_parametro: 'Fecha', valor_parametro: Fecha },
                    { nom_parametro: 'Tipo_Cambio', valor_parametro: Tipo_Cambio },
                    { nom_parametro: 'Ingreso', valor_parametro: Ingreso },
                    { nom_parametro: 'Cod_MonedaIng', valor_parametro: Cod_MonedaIng },
                    { nom_parametro: 'Egreso', valor_parametro: Egreso },
                    { nom_parametro: 'Cod_MonedaEgr', valor_parametro: Cod_MonedaEgr },
                    { nom_parametro: 'Flag_Extornado', valor_parametro: 0 },
                    { nom_parametro: 'Cod_UsuarioAut', valor_parametro: req.session.username },
                    { nom_parametro: 'Fecha_Aut', valor_parametro: Fecha_Aut },
                    { nom_parametro: 'Obs_Movimiento', valor_parametro: Obs_Movimiento },
                    { nom_parametro: 'Id_MovimientoRef', valor_parametro: id_MovimientoRef },
                    { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username }
                ]

                EXEC_SQL('USP_CAJ_CAJA_MOVIMIENTOS_G', parametros, function (dataMovimientoEgreso) {
                    console.log(dataMovimientoEgreso)
                    if (dataMovimientoEgreso.error) return res.json({ respuesta: 'error', detalle_error: dataMovimientoEgreso.error })
                        if(parseFloat(Diferencia_)>0){
                            parametros = [
                                { nom_parametro: 'id_Movimiento', valor_parametro: id_Movimiento },
                                { nom_parametro: 'Cod_Caja', valor_parametro: Cod_Caja },
                                { nom_parametro: 'Cod_Turno', valor_parametro: Cod_Turno },
                                { nom_parametro: 'Id_Concepto', valor_parametro: 67306 },
                                { nom_parametro: 'Id_ClienteProveedor', valor_parametro: Id_ClienteProveedor_ },
                                { nom_parametro: 'Cliente', valor_parametro: Cliente_ },
                                { nom_parametro: 'Des_Movimiento', valor_parametro: "SOBRANTE DE EFECTIVO" },
                                { nom_parametro: 'Cod_TipoComprobante', valor_parametro: "RI" },
                                { nom_parametro: 'Serie', valor_parametro: Serie },
                                { nom_parametro: 'Numero', valor_parametro: Numero,tipo_parametro:sql.VarChar },
                                { nom_parametro: 'Fecha', valor_parametro: Fecha_Aut },
                                { nom_parametro: 'Tipo_Cambio', valor_parametro: 1 },
                                { nom_parametro: 'Ingreso', valor_parametro: Diferencia_ },
                                { nom_parametro: 'Cod_MonedaIng', valor_parametro: Cod_MonedaIngM },
                                { nom_parametro: 'Egreso', valor_parametro: 0 },
                                { nom_parametro: 'Cod_MonedaEgr', valor_parametro: Cod_MonedaEgrM },
                                { nom_parametro: 'Flag_Extornado', valor_parametro: 0 },
                                { nom_parametro: 'Cod_UsuarioAut', valor_parametro: req.session.username },
                                { nom_parametro: 'Fecha_Aut', valor_parametro: Fecha_Aut },
                                { nom_parametro: 'Obs_Movimiento', valor_parametro: "" },
                                { nom_parametro: 'Id_MovimientoRef', valor_parametro: id_MovimientoRef },
                                { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username }
                            ]
                            procedimientos = [
                                { nom_respuesta: 'movimientos', sp_name: 'USP_CAJ_CAJA_MOVIMIENTOS_G', parametros}
                            ]
                            Ejecutar_Procedimientos(req,res, procedimientos)
                        }else{
                            if(parseFloat(Diferencia_)<0){
                                parametros = [
                                    { nom_parametro: 'id_Movimiento', valor_parametro: id_Movimiento },
                                    { nom_parametro: 'Cod_Caja', valor_parametro: Cod_Caja },
                                    { nom_parametro: 'Cod_Turno', valor_parametro: Cod_Turno },
                                    { nom_parametro: 'Id_Concepto', valor_parametro: 7005 },
                                    { nom_parametro: 'Id_ClienteProveedor', valor_parametro: Id_ClienteProveedor_ },
                                    { nom_parametro: 'Cliente', valor_parametro: Cliente_ },
                                    { nom_parametro: 'Des_Movimiento', valor_parametro: "FALTANTE DE EFECTIVO" },
                                    { nom_parametro: 'Cod_TipoComprobante', valor_parametro: "RE" },
                                    { nom_parametro: 'Serie', valor_parametro: Serie },
                                    { nom_parametro: 'Numero', valor_parametro: Numero,tipo_parametro:sql.VarChar },
                                    { nom_parametro: 'Fecha', valor_parametro: Fecha_Aut },
                                    { nom_parametro: 'Tipo_Cambio', valor_parametro: 1 },
                                    { nom_parametro: 'Ingreso', valor_parametro: 0 },
                                    { nom_parametro: 'Cod_MonedaIng', valor_parametro: Cod_MonedaIngM },
                                    { nom_parametro: 'Egreso', valor_parametro: Diferencia_},
                                    { nom_parametro: 'Cod_MonedaEgr', valor_parametro: Cod_MonedaEgrM },
                                    { nom_parametro: 'Flag_Extornado', valor_parametro: 0 },
                                    { nom_parametro: 'Cod_UsuarioAut', valor_parametro: req.session.username },
                                    { nom_parametro: 'Fecha_Aut', valor_parametro: Fecha_Aut },
                                    { nom_parametro: 'Obs_Movimiento', valor_parametro: "" },
                                    { nom_parametro: 'Id_MovimientoRef', valor_parametro: id_MovimientoRef },
                                    { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username }
                                ]
                                procedimientos = [
                                    { nom_respuesta: 'movimientos', sp_name: 'USP_CAJ_CAJA_MOVIMIENTOS_G', parametros}
                                ]
                                Ejecutar_Procedimientos(req,res, procedimientos)  
                            }else{
                                res.json({ respuesta: 'ok', data: dataMovimientoEgreso })
                            }
                        }
                    }
                )

            })  
        })
       

    })
 
});
 

router.post('/reactivar', function (req, res) {
    input = req.body
    var Recibido_ = input.Recibido
    p = [
        { nom_parametro: 'id_Movimiento', valor_parametro: input.id_Movimiento }
    ]
    const fecha = new Date()
    const mes = fecha.getMonth() + 1
    const dia = fecha.getDate()
    var Fecha_Aut = fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)
    EXEC_SQL('usp_CAJ_CAJA_MOVIMIENTOS_TXPK', p, function (dataMovimiento) {
        if (dataMovimiento.error) return res.json({ respuesta: 'error', detalle_error: dataMovimiento.error })
        
        var id_MovimientoM = dataMovimiento.result[0].id_Movimiento
        var id_MovimientoRefM = dataMovimiento.result[0].Id_MovimientoRef
        var Id_ConceptoM = dataMovimiento.result[0].Id_Concepto
        var ClienteM = dataMovimiento.result[0].Cliente
        var Id_ClienteProveedorM = dataMovimiento.result[0].Id_ClienteProveedor
        var Des_MovimientoM = dataMovimiento.result[0].Des_Movimiento
        var Cod_TipoComprobanteM = dataMovimiento.result[0].Cod_TipoComprobante
        var SerieM = dataMovimiento.result[0].Serie
        var NumeroM = dataMovimiento.result[0].Numero
        var FechaM = Fecha_Aut
        var Obs_MovimientoM = dataMovimiento.result[0].Obs_Movimiento
        var IngresoM = Recibido_
        var EgresoM = dataMovimiento.result[0].Egreso
        var Cod_MonedaIngM = dataMovimiento.result[0].Cod_MonedaIng
        var Cod_MonedaEgrM = dataMovimiento.result[0].Cod_MonedaEgr
        var Tipo_CambioM = dataMovimiento.result[0].Tipo_Cambio 

        parametros = [
            { nom_parametro: 'id_Movimiento', valor_parametro: id_MovimientoM },
            { nom_parametro: 'Cod_Caja', valor_parametro: req.app.locals.caja[0].Cod_Caja },
            { nom_parametro: 'Cod_Turno', valor_parametro: null },
            { nom_parametro: 'Id_Concepto', valor_parametro: Id_ConceptoM },
            { nom_parametro: 'Id_ClienteProveedor', valor_parametro: Id_ClienteProveedorM },
            { nom_parametro: 'Cliente', valor_parametro: ClienteM },
            { nom_parametro: 'Des_Movimiento', valor_parametro: Des_MovimientoM },
            { nom_parametro: 'Cod_TipoComprobante', valor_parametro: Cod_TipoComprobanteM },
            { nom_parametro: 'Serie', valor_parametro: SerieM },
            { nom_parametro: 'Numero', valor_parametro: NumeroM,tipo_parametro:sql.VarChar },
            { nom_parametro: 'Fecha', valor_parametro: FechaM },
            { nom_parametro: 'Tipo_Cambio', valor_parametro: Tipo_CambioM },
            { nom_parametro: 'Ingreso', valor_parametro: IngresoM },
            { nom_parametro: 'Cod_MonedaIng', valor_parametro: Cod_MonedaIngM },
            { nom_parametro: 'Egreso', valor_parametro: EgresoM },
            { nom_parametro: 'Cod_MonedaEgr', valor_parametro: Cod_MonedaEgrM },
            { nom_parametro: 'Flag_Extornado', valor_parametro: 0 },
            { nom_parametro: 'Cod_UsuarioAut', valor_parametro: req.session.username },
            { nom_parametro: 'Fecha_Aut', valor_parametro: Fecha_Aut },
            { nom_parametro: 'Obs_Movimiento', valor_parametro: Obs_MovimientoM },
            { nom_parametro: 'Id_MovimientoRef', valor_parametro: id_MovimientoRefM },
            { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username }
    
        ]
        Ejecutar_Procedimientos(req,res, procedimientos)
    })

 
});
 



module.exports = router;