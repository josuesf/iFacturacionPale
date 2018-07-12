var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var {Ejecutar_Procedimientos} = require('../utility/exec_sp_sql')
// define the home page route
router.post('/guardar_forma_pago', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'id_ComprobantePago',valor_parametro:input.id_ComprobantePago},
        {nom_parametro:'Item',valor_parametro:input.Item},
        {nom_parametro:'Des_FormaPago',valor_parametro:input.Des_FormaPago},
        {nom_parametro:'Cod_TipoFormaPago',valor_parametro:input.Cod_TipoFormaPago},
        {nom_parametro:'Cuenta_CajaBanco',valor_parametro:input.Cuenta_CajaBanco},
        {nom_parametro:'Id_Movimiento',valor_parametro:input.Id_Movimiento},
        {nom_parametro:'TipoCambio',valor_parametro:input.TipoCambio},
        {nom_parametro:'Cod_Moneda',valor_parametro:input.Cod_Moneda},
        {nom_parametro:'Monto',valor_parametro:input.Monto},
        {nom_parametro:'Cod_Caja',valor_parametro:req.app.locals.caja[0].Cod_Caja},
        {nom_parametro:'Cod_Turno',valor_parametro:req.app.locals.turno[0].Cod_Turno},
        {nom_parametro:'Cod_Plantilla',valor_parametro:input.Cod_Plantilla},
        {nom_parametro:'Obs_FormaPago',valor_parametro:input.Obs_FormaPago},
        {nom_parametro:'Fecha',valor_parametro:input.Fecha},
        {nom_parametro:'Cod_Usuario',valor_parametro:req.session.username},
    ]
    procedimientos =[
        {nom_respuesta:'formas_pago',sp_name:'USP_CAJ_FORMA_PAGO_G',parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});
 

router.post('/traer_siguiente_item', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'id_ComprobantePago',valor_parametro:input.id_ComprobantePago},
    ]
    procedimientos =[
        {nom_respuesta:'item',sp_name:'USP_CAJ_FORMA_PAGO_SiguienteItem',parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});
 

module.exports = router;