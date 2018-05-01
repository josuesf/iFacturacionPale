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
    Ejecutar_Procedimientos(res,procedimientos)
});

router.post('/get_cuenta', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Cod_CuentaBancaria',valor_parametro:input.Cod_CuentaBancaria},
    ]
    procedimientos =[
        {nom_respuesta:'cuenta',sp_name:'usp_BAN_CUENTA_BANCARIA_TXPK',parametros}
    ]
    Ejecutar_Procedimientos(res,procedimientos)
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
    Ejecutar_Procedimientos(res,procedimientos)
});
router.post('/eliminar_cuenta', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Cod_CuentaBancaria',valor_parametro:input.Cod_CuentaBancaria},
    ]
    procedimientos =[
        {nom_respuesta:'cuenta',sp_name:'USP_BAN_CUENTA_BANCARIA_E',parametros}
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});

module.exports = router;