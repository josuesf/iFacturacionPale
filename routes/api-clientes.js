var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var { Ejecutar_Procedimientos } = require('../utility/exec_sp_sql')
//CONSULTAS DE CLIENTES PROVEEDORES LISTA, AGREGAR Y ELIMINAR
router.post('/get_clientes', function (req, res) {
    input = req.body
    parametros = [
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
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
});
router.post('/guardar_cliente', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor },
        { nom_parametro: 'Cod_TipoDocumento', valor_parametro: input.Cod_TipoDocumento },
        { nom_parametro: 'Nro_Documento', valor_parametro: input.Nro_Documento },
        { nom_parametro: 'Cliente', valor_parametro: input.Cliente },
        { nom_parametro: 'Ap_Paterno', valor_parametro: input.Ap_Paterno },
        { nom_parametro: 'Ap_Materno', valor_parametro: input.Ap_Materno },
        { nom_parametro: 'Nombres', valor_parametro: input.Nombres },
        { nom_parametro: 'Direccion', valor_parametro: input.Direccion },
        { nom_parametro: 'Cod_EstadoCliente', valor_parametro: input.Cod_EstadoCliente },
        { nom_parametro: 'Cod_CondicionCliente', valor_parametro: input.Cod_CondicionCliente },
        { nom_parametro: 'Cod_TipoCliente', valor_parametro: input.Cod_TipoCliente },
        { nom_parametro: 'RUC_Natural', valor_parametro: input.RUC_Natural },
        { nom_parametro: 'Cod_TipoComprobante', valor_parametro: input.Cod_TipoComprobante },
        { nom_parametro: 'Cod_Nacionalidad', valor_parametro: input.Cod_Nacionalidad },
        { nom_parametro: 'Fecha_Nacimiento', valor_parametro: input.Fecha_Nacimiento },
        { nom_parametro: 'Cod_Sexo', valor_parametro: input.Cod_Sexo },
        { nom_parametro: 'Email1', valor_parametro: input.Email1 },
        { nom_parametro: 'Email2', valor_parametro: input.Email2 },
        { nom_parametro: 'Telefono1', valor_parametro: input.Telefono1 },
        { nom_parametro: 'Telefono2', valor_parametro: input.Telefono2 },
        { nom_parametro: 'Fax', valor_parametro: input.Fax },
        { nom_parametro: 'PaginaWeb', valor_parametro: input.PaginaWeb },
        { nom_parametro: 'Cod_Ubigeo', valor_parametro: input.Cod_Ubigeo },
        { nom_parametro: 'Cod_FormaPago', valor_parametro: input.Cod_FormaPago },
        { nom_parametro: 'Limite_Credito', valor_parametro: input.Limite_Credito },
        { nom_parametro: 'Obs_Cliente', valor_parametro: input.Obs_Cliente },
        { nom_parametro: 'Num_DiaCredito', valor_parametro: input.Num_DiaCredito },
        { nom_parametro: 'Foto', tipo_parametro: sql.VarBinary,valor_parametro: null },
        { nom_parametro: 'Firma', tipo_parametro: sql.VarBinary,valor_parametro: null },
        { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username }

    ]
    procedimientos = [
        //{ nom_respuesta: 'cliente', sp_name: 'USP_PRI_CLIENTE_PROVEEDOR_G_2', parametros },
        { nom_respuesta: 'cliente', sp_name: 'USP_PRI_CLIENTE_PROVEEDOR_G', parametros },
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
});

router.post('/guardar_cliente_2', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'Id_ClienteProveedor', valor_parametro: '-1' },
        { nom_parametro: 'Cod_TipoDocumento', valor_parametro: input.Cod_TipoDocumento },
        { nom_parametro: 'Nro_Documento', valor_parametro: input.Nro_Documento },
        { nom_parametro: 'Cliente', valor_parametro: input.Cliente },
        { nom_parametro: 'Ap_Paterno', valor_parametro: '' },
        { nom_parametro: 'Ap_Materno', valor_parametro: '' },
        { nom_parametro: 'Nombres', valor_parametro: input.Cliente },
        { nom_parametro: 'DireccioN', valor_parametro: input.DireccioN },
        { nom_parametro: 'Cod_EstadoCliente', valor_parametro: '001' },
        { nom_parametro: 'Cod_CondicionCliente', valor_parametro: '01' },
        { nom_parametro: 'Cod_TipoCliente', valor_parametro: '003' },
        { nom_parametro: 'RUC_Natural', valor_parametro: '' },
        { nom_parametro: 'Foto', tipo_parametro: sql.VarBinary,valor_parametro: null },
        { nom_parametro: 'Firma', tipo_parametro: sql.VarBinary,valor_parametro: null },
        { nom_parametro: 'Cod_TipoComprobante', valor_parametro: 'TKB' },
        { nom_parametro: 'Cod_Nacionalidad', valor_parametro: '156' },
        { nom_parametro: 'Fecha_Nacimiento', valor_parametro: input.Fecha_Nacimiento },
        { nom_parametro: 'Cod_Sexo', valor_parametro: '01' },
        { nom_parametro: 'Email1', valor_parametro: input.Email1 },
        { nom_parametro: 'Email2', valor_parametro: '' },
        { nom_parametro: 'Telefono1', valor_parametro: input.Telefono1 },
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
    procedimientos = [
        { nom_respuesta: 'cliente', sp_name: 'USP_PRI_CLIENTE_PROVEEDOR_G', parametros },
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
});

router.post('/get_cliente_by_documento', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'Cod_TipoCliente' , valor_parametro: input.Cod_TipoCliente },
        { nom_parametro: 'Nro_Documento', valor_parametro: input.Nro_Documento },
        { nom_parametro: 'Cod_TipoDocumento', valor_parametro: input.Cod_TipoDocumento },
        { nom_parametro: 'Cod_TipoComprobante'}
    ]
    procedimientos = [
        { nom_respuesta: 'cliente', sp_name: 'USP_PRI_CLIENTE_TXDocumento', parametros },
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
});
 

router.post('/get_cliente_by_nombre', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'Cod_TipoCliente', valor_parametro: input.Cod_TipoCliente,tipo_parametro:sql.VarChar },
        { nom_parametro: 'Cliente', valor_parametro: input.Cliente }
    ]
    procedimientos = [
        { nom_respuesta: 'cliente', sp_name: 'USP_PRI_CLIENTE_TXCliente', parametros },
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
});

router.post('/eliminar_cliente', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor }
    ]
    procedimientos = [
        { nom_respuesta: 'cliente', sp_name: 'usp_PRI_CLIENTE_PROVEEDOR_E', parametros }
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

router.post('/get_provincias', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'Cod_Departamento', valor_parametro: input.Cod_Departamento }
    ]
    procedimientos = [
        { nom_respuesta: 'provincias', sp_name: 'USP_VIS_PROVINCIAS_TT', parametros }
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})
router.post('/get_distritos', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'Cod_Provincia', valor_parametro: input.Cod_Provincia },
        { nom_parametro: 'Cod_Departamento', valor_parametro: input.Cod_Departamento }
    ]
    procedimientos = [
        { nom_respuesta: 'distritos', sp_name: 'USP_VIS_DISTRITOS_TT', parametros }
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})
//get_one_cliente
router.post('/get_one_cliente', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor }
    ]
    procedimientos = [
        { nom_respuesta: 'cliente', sp_name: 'usp_PRI_CLIENTE_PROVEEDOR_TXPK', parametros }
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

router.post('/get_clientes_varios', function (req, res) {
    input = req.body
    procedimientos = [
        { nom_respuesta: 'cliente', sp_name: 'USP_PRI_CLIENTE_PROVEEDOR_TClientesVarios', parametros:[] },
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
});

 
router.post('/get_cuentas_cliente', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor }
    ]
    procedimientos = [
        { nom_respuesta: 'cuentas', sp_name: 'USP_PRI_CLIENTE_CUENTABANCARIA_TXId_ClienteProveedor', parametros }
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})
router.post('/get_entidades_tiposcuentas', function (req, res) {
    input = req.body
    parametros = []
    procedimientos = [
        { nom_respuesta: 'entidades', sp_name: 'USP_VIS_ENTIDADES_FINANCIERAS_TT', parametros },
        { nom_respuesta: 'tipos_cuenta', sp_name: 'USP_VIS_TIPO_CUENTA_BANCARIA_TT', parametros }
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})


router.post('/get_licitaciones_by_cliente', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor }
    ]
    procedimientos = [
        { nom_respuesta: 'licitaciones', sp_name: 'USP_PRI_LICITACIONES_TXIdClienteProveedor', parametros }
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

router.post('/get_entidades_tiposcuentas', function (req, res) {
    input = req.body
    parametros = []
    procedimientos = [
        { nom_respuesta: 'entidades', sp_name: 'USP_VIS_ENTIDADES_FINANCIERAS_TT', parametros },
        { nom_respuesta: 'tipos_cuenta', sp_name: 'USP_VIS_TIPO_CUENTA_BANCARIA_TT', parametros }
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

router.post('/guardar_cuenta_bancaria_cliente', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor },
        { nom_parametro: 'NroCuenta_Bancaria', valor_parametro: input.NroCuenta_Bancaria },
        { nom_parametro: 'Cod_EntidadFinanciera', valor_parametro: input.Cod_EntidadFinanciera },
        { nom_parametro: 'Cod_TipoCuentaBancaria', valor_parametro: input.Cod_TipoCuentaBancaria },
        { nom_parametro: 'Des_CuentaBancaria', valor_parametro: input.Des_CuentaBancaria },
        { nom_parametro: 'Flag_Principal', valor_parametro: input.Flag_Principal },
        { nom_parametro: 'Cuenta_Interbancaria', valor_parametro: input.Cuenta_Interbancaria },
        { nom_parametro: 'Obs_CuentaBancaria', valor_parametro: input.Obs_CuentaBancaria },
        { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username },
    ]
    procedimientos = [
        { nom_respuesta: 'cuenta', sp_name: 'USP_PRI_CLIENTE_CUENTABANCARIA_G', parametros },
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})


router.post('/eliminar_cuenta_bancaria_cliente', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor },
        { nom_parametro: 'NroCuenta_Bancaria', valor_parametro: input.NroCuenta_Bancaria }
    ]
    procedimientos = [
        { nom_respuesta: 'cuenta', sp_name: 'usp_PRI_CLIENTE_CUENTABANCARIA_E', parametros },
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})
//CONTACTOS POR CLIENTE
router.post('/get_contactos_cliente', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor }
    ]
    procedimientos = [
        { nom_respuesta: 'contactos', sp_name: 'USP_PRI_CLIENTE_CONTACTO_TXId_ClienteProveedor', parametros }
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})
router.post('/get_tiposRelaciones_codTelefonos', function (req, res) {
    input = req.body

    parametros = []
    var procedimientos = []
    if (typeof input.Id_ClienteContacto != undefined) {
        procedimientos = [
            { nom_respuesta: 'tipos_relaciones', sp_name: 'USP_VIS_TIPO_RELACION_TT', parametros },
            { nom_respuesta: 'cod_telefonos', sp_name: 'USP_VIS_CODIGO_TELEFONO_TT', parametros },
            {
                nom_respuesta: 'contacto', sp_name: 'usp_PRI_CLIENTE_CONTACTO_TXPK',
                parametros: [
                    { nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor },
                    { nom_parametro: 'Id_ClienteContacto', valor_parametro: input.Id_ClienteContacto },
                ]
            }
        ]
    }
    else {
        procedimientos = [
            { nom_respuesta: 'tipos_relaciones', sp_name: 'USP_VIS_TIPO_RELACION_TT', parametros },
            { nom_respuesta: 'cod_telefonos', sp_name: 'USP_VIS_CODIGO_TELEFONO_TT', parametros }]
    }
    Ejecutar_Procedimientos(req,res, procedimientos)
})
router.post('/guardar_contacto_cliente', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor },
        { nom_parametro: 'Id_ClienteContacto', valor_parametro: input.Id_ClienteContacto },
        { nom_parametro: 'Cod_TipoDocumento', valor_parametro: input.Cod_TipoDocumento },
        { nom_parametro: 'Nro_Documento', valor_parametro: input.Nro_Documento },
        { nom_parametro: 'Ap_Paterno', valor_parametro: input.Ap_Paterno },
        { nom_parametro: 'Ap_Materno', valor_parametro: input.Ap_Materno },
        { nom_parametro: 'Nombres', valor_parametro: input.Nombres },
        { nom_parametro: 'Cod_Telefono', valor_parametro: input.Cod_Telefono },
        { nom_parametro: 'Nro_Telefono', valor_parametro: input.Nro_Telefono },
        { nom_parametro: 'Anexo', valor_parametro: input.Anexo },
        { nom_parametro: 'Email_Empresarial', valor_parametro: input.Email_Empresarial },
        { nom_parametro: 'Email_Personal', valor_parametro: input.Email_Personal },
        { nom_parametro: 'Celular', valor_parametro: input.Celular },
        { nom_parametro: 'Cod_TipoRelacion', valor_parametro: input.Cod_TipoRelacion },
        { nom_parametro: 'Fecha_Incorporacion', valor_parametro: input.Fecha_Incorporacion },
        { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username },
    ]
    procedimientos = [
        { nom_respuesta: 'contacto', sp_name: 'USP_PRI_CLIENTE_CONTACTO_G_2', parametros },
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})
router.post('/eliminar_contacto_cliente', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor },
        { nom_parametro: 'Id_ClienteContacto', valor_parametro: input.Id_ClienteContacto }
    ]
    procedimientos = [
        { nom_respuesta: 'contacto', sp_name: 'usp_PRI_CLIENTE_CONTACTO_E', parametros },
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})
//Establecimiento por cliente
router.post('/get_establecimientos_cliente', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor }
    ]
    procedimientos = [
        { nom_respuesta: 'establecimientos', sp_name: 'USP_PRI_ESTABLECIMIENTOS_TXId_ClienteProveedor', parametros }
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})
router.post('/get_tipos_establecimientos', function (req, res) {
    input = req.body
    parametros = []
    procedimientos = [
        { nom_respuesta: 'tipos_establecimientos', sp_name: 'USP_VIS_TIPO_ESTABLECIMIENTOS_TT', parametros }
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})
router.post('/guardar_establecimiento_cliente', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor },
        { nom_parametro: 'Cod_Establecimientos', valor_parametro: input.Cod_Establecimientos },
        { nom_parametro: 'Des_Establecimiento', valor_parametro: input.Des_Establecimiento },
        { nom_parametro: 'Cod_TipoEstablecimiento', valor_parametro: input.Cod_TipoEstablecimiento },
        { nom_parametro: 'Direccion', valor_parametro: input.Direccion },
        { nom_parametro: 'Telefono', valor_parametro: input.Telefono },
        { nom_parametro: 'Obs_Establecimiento', valor_parametro: input.Obs_Establecimiento },
        { nom_parametro: 'Cod_Ubigeo', valor_parametro: input.Cod_Ubigeo },
        { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username },
    ]
    procedimientos = [
        { nom_respuesta: 'establecimiento', sp_name: 'USP_PRI_ESTABLECIMIENTOS_G', parametros },
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})
router.post('/eliminar_establecimiento_cliente', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor },
        { nom_parametro: 'Cod_Establecimientos', valor_parametro: input.Cod_Establecimientos }
    ]
    procedimientos = [
        { nom_respuesta: 'establecimiento', sp_name: 'usp_PRI_ESTABLECIMIENTOS_E', parametros },
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})
//ProductosxCliente falta informacion
//Vehiculos por cliente
router.post('/get_vehiculos_cliente', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor }
    ]
    procedimientos = [
        { nom_respuesta: 'vehiculos', sp_name: 'USP_PRI_CLIENTE_VEHICULOS_TXId_ClienteProveedor', parametros }
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})
router.post('/guardar_vehiculo_cliente', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor },
        { nom_parametro: 'Cod_Placa', valor_parametro: input.Cod_Placa },
        { nom_parametro: 'Color', valor_parametro: input.Color },
        { nom_parametro: 'Marca', valor_parametro: input.Marca },
        { nom_parametro: 'Modelo', valor_parametro: input.Modelo },
        { nom_parametro: 'Propiestarios', valor_parametro: input.Propiestarios },
        { nom_parametro: 'Sede', valor_parametro: input.Sede },
        { nom_parametro: 'Placa_Vigente', valor_parametro: input.Placa_Vigente },
        { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username },
    ]
    procedimientos = [
        { nom_respuesta: 'vehiculo', sp_name: 'USP_PRI_CLIENTE_VEHICULOS_G', parametros },
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})
router.post('/eliminar_vehiculo_cliente', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor },
        { nom_parametro: 'Cod_Placa', valor_parametro: input.Cod_Placa }
    ]
    procedimientos = [
        { nom_respuesta: 'vehiculo', sp_name: 'usp_PRI_CLIENTE_VEHICULOS_E', parametros },
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})
// Padrones X Cliente
router.post('/get_padrones_cliente', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor }
    ]
    procedimientos = [
        { nom_respuesta: 'padrones', sp_name: 'USP_PRI_PADRONES_TxId_ClienteProveedor', parametros }
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})
router.post('/get_tipos_padrones', function (req, res) {
    input = req.body
    parametros = []
    procedimientos = [
        { nom_respuesta: 'tipos_padrones', sp_name: 'USP_VIS_TIPO_PADRON_TT', parametros }
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})
router.post('/guardar_padron_cliente', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor },
        { nom_parametro: 'Cod_Padron', valor_parametro: input.Cod_Padron },
        { nom_parametro: 'Des_Padron', valor_parametro: input.Des_Padron },
        { nom_parametro: 'Cod_TipoPadron', valor_parametro: input.Cod_TipoPadron },
        { nom_parametro: 'Fecha_Inicio', valor_parametro: input.Fecha_Inicio },
        { nom_parametro: 'Fecha_Fin', valor_parametro: input.Fecha_Fin },
        { nom_parametro: 'Nro_Resolucion', valor_parametro: input.Nro_Resolucion },
        { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username },
    ]
    procedimientos = [
        { nom_respuesta: 'padron', sp_name: 'USP_PRI_PADRONES_G', parametros },
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})
router.post('/eliminar_padron_cliente', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor },
        { nom_parametro: 'Cod_Padron', valor_parametro: input.Cod_Padron },
    ]
    procedimientos = [
        { nom_respuesta: 'padron', sp_name: 'USP_PRI_PADRONES_E', parametros },
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})
 
router.post('/get_credito_cliente', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'Id_ClienteProveedor', valor_parametro: input.Id_ClienteProveedor },
        { nom_parametro: 'Cod_Libro', valor_parametro: input.Cod_Libro },
    ]
    procedimientos = [
        { nom_respuesta: 'creditos', sp_name: 'USP_PRI_CLIENTE_PROVEEDOR_TCredito', parametros },
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})
 

module.exports = router;