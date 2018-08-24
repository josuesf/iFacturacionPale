var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var {Ejecutar_Procedimientos, EXEC_SQL} = require('../utility/exec_sp_sql')
// define the home page route
router.post('/get_movimientos', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Caja',valor_parametro: req.app.locals.caja[0].Cod_Caja },
        {nom_parametro:'Cod_Turno',valor_parametro: req.app.locals.turno[0].Cod_Turno },
        {nom_parametro:'Flag_Resumen',valor_parametro:'0'},
    ]
    parametros2 = [
        {nom_parametro:'Cod_Caja',valor_parametro: req.app.locals.caja[0].Cod_Caja},
        {nom_parametro:'Cod_Turno',valor_parametro: req.app.locals.turno[0].Cod_Turno},
    ]
    procedimientos =[
        {nom_respuesta:'movimientos',sp_name:'USP_MovimientosCajaTurno',parametros},
        {nom_respuesta:'saldos',sp_name:'USP_SaldosXCajaTurno',parametros:parametros2},
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});

router.post('/get_movimiento_by_pk', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'id_Movimiento',valor_parametro: input.id_Movimiento }
    ]
   
    procedimientos =[
        {nom_respuesta:'movimiento',sp_name:'USP_CAJ_CAJA_MOVIMIENTOS_TXPK',parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});



router.post('/guardar_movimiento_caja', function (req, res) {
    
    input = req.body 

    parametros = [
        {nom_parametro: 'id_Movimiento', valor_parametro:  -1},
        {nom_parametro: 'Cod_Caja', valor_parametro:  req.app.locals.caja[0].Cod_Caja},
        {nom_parametro: 'Cod_Turno', valor_parametro:  req.app.locals.turno[0].Cod_Turno},
        {nom_parametro: 'Id_Concepto', valor_parametro:  input.Id_Concepto},
        {nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor},
        {nom_parametro: 'Cliente', valor_parametro: input.Cliente},
        {nom_parametro: 'Des_Movimiento', valor_parametro: input.Des_Movimiento},
        {nom_parametro: 'Cod_TipoComprobante', valor_parametro: input.Cod_TipoComprobante},
        {nom_parametro: 'Serie', valor_parametro: input.Serie},
        {nom_parametro: 'Numero', valor_parametro: input.Numero,tipo_parametro:sql.VarChar},
        {nom_parametro: 'Fecha', valor_parametro: input.Fecha},
        {nom_parametro: 'Tipo_Cambio', valor_parametro: input.Tipo_Cambio},
        {nom_parametro: 'Ingreso', valor_parametro: input.Ingreso},
        {nom_parametro: 'Cod_MonedaIng', valor_parametro: input.Cod_MonedaIng},
        {nom_parametro: 'Egreso', valor_parametro: input.Egreso},
        {nom_parametro: 'Cod_MonedaEgr', valor_parametro: input.Cod_MonedaEgr},
        {nom_parametro: 'Flag_Extornado', valor_parametro: input.Flag_Extornado},
        {nom_parametro: 'Cod_UsuarioAct', valor_parametro: req.session.username},
        {nom_parametro: 'Fecha_Aut', valor_parametro: new Date()},
        {nom_parametro: 'Obs_Movimiento', valor_parametro: input.Obs_Movimiento},
        {nom_parametro: 'Id_MovimientoRef', valor_parametro: input.id_MovimientoRef},
        {nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username},
    ]
     
    procedimientos = [
        { nom_respuesta: 'movimiento', sp_name: 'USP_CAJ_CAJA_MOVIMIENTOS_G', parametros}
        
    ]  
    Ejecutar_Procedimientos(req,res, procedimientos)
});


router.post('/extornar_movimiento', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'id_Movimiento',valor_parametro:parseInt(input.id_Movimiento)},
        {nom_parametro:'Cod_Caja',valor_parametro: req.app.locals.caja[0].Cod_Caja},
        {nom_parametro:'Cod_Turno',valor_parametro: req.app.locals.turno[0].Cod_Turno},
        {nom_parametro:'Cod_Usuario',valor_parametro: req.session.username}
    ]
    
    procedimientos =[
        {nom_respuesta:'movimientos',sp_name:'USP_CAJ_CAJA_MOVIMIENTOS_EXTORNAR',parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});


router.post('/extornar_movimiento_almacen', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Id_AlmacenMov',valor_parametro:parseInt(input.Id_Almacen_Mov)}, 
        {nom_parametro:'Cod_Usuario',valor_parametro: req.session.username}
    ]
    
    procedimientos =[
        {nom_respuesta:'movimientos',sp_name:'USP_ALM_ALMACEN_MOV_EXTORNAR',parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});

router.post('/extornar_movimiento_forma_pago', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'id_ComprobantePago',valor_parametro:parseInt(input.id_ComprobantePago)}, 
        {nom_parametro:'Item',valor_parametro: parseInt(input.Item)}
    ]
    
    procedimientos =[
        {nom_respuesta:'movimientos',sp_name:'USP_CAJ_FORMA_PAGO_E',parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});


router.post('/eliminar_movimiento', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'id_Movimiento',valor_parametro:parseInt(input.id_Movimiento)}
    ]
    
    procedimientos =[
        {nom_respuesta:'movimientos',sp_name:'usp_CAJ_CAJA_MOVIMIENTOS_E',parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});


router.post('/eliminar_comprobante_pago', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'id_ComprobantePago',valor_parametro:parseInt(input.id_Movimiento)},
        {nom_parametro:'Cod_Usuario',valor_parametro: req.session.username},
        {nom_parametro:'Justificacion',valor_parametro: input.Justificacion}
    ]
    
    procedimientos =[
        {nom_respuesta:'movimientos',sp_name:'USP_CAJ_COMPROBANTE_PAGO_E',parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});


router.post('/eliminar_movimiento_almacen', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Id_AlmacenMov',valor_parametro:parseInt(input.Id_AlmacenMov)}
    ]

    EXEC_SQL('usp_ALM_ALMACEN_MOV_TXPK', parametros , function (dataMovimiento) {
        if (dataMovimiento.error) return res.json({ respuesta: 'error' }) 
        if (dataMovimiento.result.length>0){
            procedimientos =[
                {nom_respuesta:'movimientos',sp_name:'usp_ALM_ALMACEN_MOV_E',parametros}
            ]
            Ejecutar_Procedimientos(req,res,procedimientos)
        }else{
            return res.json({ respuesta: 'error' })
        }
    })
     
});


module.exports = router;