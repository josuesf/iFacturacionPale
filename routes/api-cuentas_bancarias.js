var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var {Ejecutar_Procedimientos} = require('../utility/exec_sp_sql')
// define the home page route
router.post('/get_cuentas', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'TamañoPagina',valor_parametro:input.TamanoPagina},
        {nom_parametro:'NumeroPagina',valor_parametro:input.NumeroPagina},
        {nom_parametro:'ScripOrden',valor_parametro:input.ScripOrden},
        {nom_parametro:'ScripWhere',tipo_parametro:sql.NVarChar,valor_parametro:input.ScripWhere}
    ]
    procedimientos =[
        {nom_respuesta:'cuentas',sp_name:'usp_BAN_CUENTA_BANCARIA_TP',parametros},
        {nom_respuesta:'num_filas',sp_name:'usp_BAN_CUENTA_BANCARIA_TNF',parametros:[{nom_parametro:'ScripWhere',valor_parametro:input.ScripWhere}]},
        {nom_respuesta:'sucursales',sp_name:'usp_PRI_SUCURSAL_TT',parametros:[]},
        {nom_respuesta:'entidades',sp_name:'USP_VIS_ENTIDADES_FINANCIERAS_TT',parametros:[]},
        {nom_respuesta:'tipos_cuentas',sp_name:'USP_VIS_TIPO_CUENTA_BANCARIA_TT',parametros:[]},
        {nom_respuesta:'monedas',sp_name:'USP_VIS_MONEDAS_TT',parametros:[]},
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});

router.post('/get_cuenta', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Cod_CuentaBancaria',valor_parametro:input.Cod_CuentaBancaria},
    ]
    procedimientos =[
        {nom_respuesta:'cuenta',sp_name:'usp_BAN_CUENTA_BANCARIA_TXPK',parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});

router.post('/get_cuenta_by_sucursal', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Sucursal',valor_parametro:req.app.locals.sucursal[0].Cod_Sucursal},
    ]
    procedimientos =[
        {nom_respuesta:'cuentas',sp_name:'USP_BAN_CUENTA_BANCARIA_TXSucursal',parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});

router.post('/get_cuenta_by_id_cliente', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Id_ClienteProveedor',valor_parametro:input.Id_ClienteProveedor},
    ]
    procedimientos =[
        {nom_respuesta:'cuentas',sp_name:'USP_PRI_CLIENTE_CUENTABANCARIA_TXId_ClienteProveedor',parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});


router.post('/get_cheques_by_cuenta_cliente', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Cod_CuentaBancaria',valor_parametro:input.Cod_CuentaBancaria},
        {nom_parametro:'Beneficiario',valor_parametro:input.Beneficiario},
        {nom_parametro:'Cod_Libro',valor_parametro:input.Cod_Libro},
    ]
    procedimientos =[
        {nom_respuesta:'cheques',sp_name:'USP_BAN_CUENTA_CHEQUESxCuentaCliente',parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});


router.post('/guardar_cuenta', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Cod_CuentaBancaria',valor_parametro:input.Cod_CuentaBancaria},
        {nom_parametro:'Cod_Sucursal',valor_parametro:input.Cod_Sucursal},
        {nom_parametro:'Cod_EntidadFinanciera',valor_parametro:input.Cod_EntidadFinanciera},
        {nom_parametro:'Des_CuentaBancaria',valor_parametro:input.Des_CuentaBancaria},
        {nom_parametro:'Cod_Moneda',valor_parametro:input.Cod_Moneda},
        {nom_parametro:'Flag_Activo',valor_parametro:input.Flag_Activo},
        {nom_parametro:'Saldo_Disponible',valor_parametro:input.Saldo_Disponible},
        {nom_parametro:'Cod_CuentaContable',valor_parametro:input.Cod_CuentaContable},
        {nom_parametro:'Cod_TipoCuentaBancaria',valor_parametro:input.Cod_TipoCuentaBancaria},
        {nom_parametro:'Cod_Usuario',valor_parametro:req.session.username},
    ]
    procedimientos =[
        {nom_respuesta:'cuenta',sp_name:'USP_BAN_CUENTA_BANCARIA_G',parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});

router.post('/guardar_cuenta_movimiento', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Id_MovimientoCuenta',valor_parametro:-1},
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
        {nom_respuesta:'cuenta',sp_name:'USP_BAN_CUENTA_M_G',parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});

router.post('/eliminar_cuenta', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Cod_CuentaBancaria',valor_parametro:input.Cod_CuentaBancaria},
    ]
    procedimientos =[
        {nom_respuesta:'cuenta',sp_name:'USP_BAN_CUENTA_BANCARIA_E',parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});

router.post('/get_by_cuenta_operacion', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Cod_CuentaBancaria',valor_parametro:input.Cod_CuentaBancaria},
        {nom_parametro:'Nro_Operacion',valor_parametro:input.Nro_Operacion}
    ]
    procedimientos =[
        {nom_respuesta:'cuentas',sp_name:'USP_BAN_CUENTA_M_XCuentaOperacion',parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});

module.exports = router;