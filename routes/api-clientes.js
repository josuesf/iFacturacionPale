var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var {Ejecutar_Procedimientos} = require('../utility/exec_sp_sql')
// define the home page route
router.post('/get_clientes', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'TamañoPagina',valor_parametro:input.TamanoPagina},
        {nom_parametro:'NumeroPagina',valor_parametro:input.NumeroPagina},
        {nom_parametro:'ScripOrden',valor_parametro:input.ScripOrden},
        {nom_parametro:'ScripWhere',tipo_parametro:sql.NVarChar,valor_parametro:input.ScripWhere}
    ]
    procedimientos =[
        {nom_respuesta:'clientes',sp_name:'usp_PRI_CLIENTE_PROVEEDOR_TP',parametros},
        {nom_respuesta:'num_filas',sp_name:'usp_PRI_CLIENTE_PROVEEDOR_TNF',parametros:[{nom_parametro:'ScripWhere',valor_parametro:input.ScripWhere}]},
        {nom_respuesta:'documentos',sp_name:'USP_VIS_TIPO_DOCUMENTOS_TT',parametros:[]},
        {nom_respuesta:'estados',sp_name:'USP_VIS_ESTADO_CLIENTE_TT',parametros:[]},
        {nom_respuesta:'condiciones',sp_name:'USP_VIS_CONDICION_CLIENTE_TT',parametros:[]},
        {nom_respuesta:'tipos_clientes',sp_name:'USP_VIS_TIPO_CLIENTES_TT',parametros:[]},
        {nom_respuesta:'tipos_comprobantes',sp_name:'USP_VIS_TIPO_COMPROBANTES_TT',parametros:[]},
        {nom_respuesta:'paises',sp_name:'USP_VIS_PAISES_TT',parametros:[]},
        {nom_respuesta:'departamentos',sp_name:'USP_VIS_DEPARTAMENTOS_TT',parametros:[]},
        {nom_respuesta:'formas_pago',sp_name:'USP_VIS_FORMAS_PAGO_TT',parametros:[]},
        {nom_respuesta:'sexos',sp_name:'USP_VIS_SEXOS_TT',parametros:[]},
        {nom_respuesta:'diagramas',sp_name:'USP_VIS_DIAGRAMAS_XML_TXCodTabla',parametros:[{nom_parametro:'Cod_Tabla',valor_parametro:'PRI_CLIENTE_PROVEEDOR'},]},
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});
router.post('/guardar_cliente', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Id_ClienteProveedor',valor_parametro:input.Id_ClienteProveedor},
        {nom_parametro:'Cod_TipoDocumento',valor_parametro:input.Cod_TipoDocumento},
        {nom_parametro:'Nro_Documento',valor_parametro:input.Nro_Documento},
        {nom_parametro:'Cliente',valor_parametro:input.Cliente},
        {nom_parametro:'Ap_Paterno',valor_parametro:input.Ap_Paterno},
        {nom_parametro:'Ap_Materno',valor_parametro:input.Ap_Materno},
        {nom_parametro:'Nombres',valor_parametro:input.Nombres},
        {nom_parametro:'Direccion',valor_parametro:input.Direccion},
        {nom_parametro:'Cod_EstadoCliente',valor_parametro:input.Cod_EstadoCliente},
        {nom_parametro:'Cod_CondicionCliente',valor_parametro:input.Cod_CondicionCliente},
        {nom_parametro:'Cod_TipoCliente',valor_parametro:input.Cod_TipoCliente},
        {nom_parametro:'RUC_Natural',valor_parametro:input.RUC_Natural},
        {nom_parametro:'Cod_TipoComprobante',valor_parametro:input.Cod_TipoComprobante},
        {nom_parametro:'Cod_Nacionalidad',valor_parametro:input.Cod_Nacionalidad},
        {nom_parametro:'Fecha_Nacimiento',valor_parametro:input.Fecha_Nacimiento},
        {nom_parametro:'Cod_Sexo',valor_parametro:input.Cod_Sexo},
        {nom_parametro:'Email1',valor_parametro:input.Email1},
        {nom_parametro:'Email2',valor_parametro:input.Email2},
        {nom_parametro:'Telefono1',valor_parametro:input.Telefono1},
        {nom_parametro:'Telefono2',valor_parametro:input.Telefono2},
        {nom_parametro:'Fax',valor_parametro:input.Fax},
        {nom_parametro:'PaginaWeb',valor_parametro:input.PaginaWeb},
        {nom_parametro:'Cod_Ubigeo',valor_parametro:input.Cod_Ubigeo},
        {nom_parametro:'Cod_FormaPago',valor_parametro:input.Cod_FormaPago},
        {nom_parametro:'Limite_Credito',valor_parametro:input.Limite_Credito},
        {nom_parametro:'Obs_Cliente',valor_parametro:input.Obs_Cliente},
        {nom_parametro:'Num_DiaCredito',valor_parametro:input.Num_DiaCredito},
        {nom_parametro:'Cod_Usuario',valor_parametro:req.session.username}

    ]
    procedimientos =[
        {nom_respuesta:'cliente',sp_name:'USP_PRI_CLIENTE_PROVEEDOR_G_2',parametros},
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});

router.post('/eliminar_usuario', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Cod_Usuarios', valor_parametro: input.Cod_Usuarios}
    ]
    procedimientos = [
        {nom_respuesta:'usuario',sp_name:'usp_PRI_USUARIO_E', parametros}
    ]
    Ejecutar_Procedimientos(res, procedimientos)
})

router.post('/get_provincias', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Cod_Departamento', valor_parametro: input.Cod_Departamento}
    ]
    procedimientos = [
        {nom_respuesta:'provincias',sp_name:'USP_VIS_PROVINCIAS_TT', parametros}
    ]
    Ejecutar_Procedimientos(res, procedimientos)
})
router.post('/get_distritos', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Cod_Provincia', valor_parametro: input.Cod_Provincia},
        {nom_parametro: 'Cod_Departamento', valor_parametro: input.Cod_Departamento}
    ]
    procedimientos = [
        {nom_respuesta:'distritos',sp_name:'USP_VIS_DISTRITOS_TT', parametros}
    ]
    Ejecutar_Procedimientos(res, procedimientos)
})
//get_one_cliente
router.post('/get_one_cliente', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor}
    ]
    procedimientos = [
        {nom_respuesta:'cliente',sp_name:'usp_PRI_CLIENTE_PROVEEDOR_TXPK', parametros}
    ]
    Ejecutar_Procedimientos(res, procedimientos)
})

router.post('/get_cuentas_cliente', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor}
    ]
    procedimientos = [
        {nom_respuesta:'cuentas',sp_name:'USP_PRI_CLIENTE_CUENTABANCARIA_TXId_ClienteProveedor', parametros}
    ]
    Ejecutar_Procedimientos(res, procedimientos)
})
router.post('/get_entidades_tiposcuentas', function (req, res){
    input = req.body
    parametros = []
    procedimientos = [
        {nom_respuesta:'entidades',sp_name:'USP_VIS_ENTIDADES_FINANCIERAS_TT', parametros},
        {nom_respuesta:'tipos_cuenta',sp_name:'USP_VIS_TIPO_CUENTA_BANCARIA_TT', parametros}
    ]
    Ejecutar_Procedimientos(res, procedimientos)
})
router.post('/guardar_cuenta_bancaria_cliente', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor},
        {nom_parametro: 'NroCuenta_Bancaria', valor_parametro: input.NroCuenta_Bancaria},
        {nom_parametro: 'Cod_EntidadFinanciera', valor_parametro: input.Cod_EntidadFinanciera},
        {nom_parametro: 'Cod_TipoCuentaBancaria', valor_parametro: input.Cod_TipoCuentaBancaria},
        {nom_parametro: 'Des_CuentaBancaria', valor_parametro: input.Des_CuentaBancaria},
        {nom_parametro: 'Flag_Principal', valor_parametro: input.Flag_Principal},
        {nom_parametro: 'Cuenta_Interbancaria', valor_parametro: input.Cuenta_Interbancaria},
        {nom_parametro: 'Obs_CuentaBancaria', valor_parametro: input.Obs_CuentaBancaria},
        {nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username},
    ]
    procedimientos = [
        {nom_respuesta:'cuenta',sp_name:'USP_PRI_CLIENTE_CUENTABANCARIA_G', parametros},
    ]
    Ejecutar_Procedimientos(res, procedimientos)
})
router.post('/eliminar_cuenta_bancaria_cliente', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor},
        {nom_parametro: 'NroCuenta_Bancaria', valor_parametro: input.NroCuenta_Bancaria}
    ]
    procedimientos = [
        {nom_respuesta:'cuenta',sp_name:'usp_PRI_CLIENTE_CUENTABANCARIA_E', parametros},
    ]
    Ejecutar_Procedimientos(res, procedimientos)
})
module.exports = router;