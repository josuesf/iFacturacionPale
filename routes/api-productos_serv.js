var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var {Ejecutar_Procedimientos} = require('../utility/exec_sp_sql')
// define the home page route

router.post('/get_productos_serv', function (req, res) {
    input = req.body
    parametros1 = [
        {nom_parametro:'TamañoPagina',valor_parametro:input.TamanoPagina},
        {nom_parametro:'NumeroPagina',valor_parametro:input.NumeroPagina},
        {nom_parametro:'ScripOrden',valor_parametro:input.ScripOrden},
        {nom_parametro:'ScripWhere',tipo_parametro:sql.NVarChar,valor_parametro:input.ScripWhere}
    ]
    parametros2 = [
        {nom_parametro:'ScripWhere',tipo_parametro:sql.NVarChar,valor_parametro:input.ScripWhere}
    ]
    parametros3 = [
        {nom_parametro:'Cod_Tabla',valor_parametro:input.Cod_Tabla}
    ]
    parametros = []
    procedimientos =[
        {nom_respuesta:'productos_serv',sp_name:'usp_PRI_PRODUCTOS_TP',parametros:parametros1},
        {nom_respuesta:'num_filas',sp_name:'usp_PRI_PRODUCTOS_TNF',parametros:parametros2},
        {nom_respuesta:'categoria_arbol', sp_name:'USP_PRI_CATEGORIA_TArbol', parametros},
        {nom_respuesta:'marca',sp_name:'USP_VIS_MARCA_TT', parametros},
        {nom_respuesta:'tipo_producto',sp_name:'USP_VIS_TIPO_PRODUCTO_TT', parametros},
        {nom_respuesta:'garantias', sp_name:'USP_VIS_GARANTIAS_TT', parametros},
        {nom_respuesta:'tipo_existencia', sp_name:'USP_VIS_TIPO_EXISTENCIAS_TT', parametros},
        {nom_respuesta:'tipo_operatividad', sp_name:'USP_VIS_TIPO_OPERATIVIDAD_TT', parametros},
        {nom_respuesta:'tipo_imagen', sp_name:'USP_VIS_TIPO_IMAGEN_TT', parametros},
        {nom_respuesta:'diagramas_xml', sp_name:'USP_VIS_DIAGRAMAS_XML_TXCodTabla', parametros: parametros3}
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});

router.post('/get_categoriaspadre', function (req, res){
    input = req.body
    parametros = []
    procedimientos = [
        {nom_respuesta: 'categoriaspadre', sp_name: 'USP_PRI_CATEGORIA_TArbol', parametros}
    ]
    Ejecutar_Procedimientos(res, procedimientos)
})

router.post('/guardar_producto', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Id_Producto', valor_parametro: input.Id_Producto},
        {nom_parametro: 'Cod_Producto', valor_parametro: input.Cod_Producto},
        {nom_parametro: 'Cod_Categoria', valor_parametro: input.Cod_Categoria},
        {nom_parametro: 'Cod_Marca', valor_parametro: input.Cod_Marca},
        {nom_parametro: 'Cod_TipoProducto', valor_parametro: input.Cod_TipoProducto},
        {nom_parametro: 'Nom_Producto', valor_parametro: input.Nom_Producto},
        {nom_parametro: 'Des_CortaProducto', valor_parametro: input.Des_CortaProducto},
        {nom_parametro: 'Des_LargaProducto', valor_parametro: input.Des_LargaProducto},
        {nom_parametro: 'Caracteristicas', valor_parametro: input.Caracteristicas},
        {nom_parametro: 'Porcentaje_Utilidad', tipo_parametro: sql.Numeric(5,2), valor_parametro: input.Porcentaje_Utilidad},
        {nom_parametro: 'Cuenta_Contable', valor_parametro: input.Cuenta_Contable},
        {nom_parametro: 'Contra_Cuenta', valor_parametro: input.Contra_Cuenta},
        {nom_parametro: 'Cod_Garantia', valor_parametro: input.Cod_Garantia},
        {nom_parametro: 'Cod_TipoExistencia', valor_parametro: input.Cod_TipoExistenci},
        {nom_parametro: 'Cod_TipoOperatividad', valor_parametro: input.Cod_TipoOperatividad},
        {nom_parametro: 'Flag_Activo', valor_parametro: input.Flag_Activo},
        {nom_parametro: 'Flag_Stock', valor_parametro: input.Flag_Stock},
        {nom_parametro: 'Cod_Fabricante', valor_parametro: input.Cod_Fabricante},
        {nom_parametro: 'Obs_Producto', valor_parametro: input.Obs_Producto},
        {nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username},
    ]
    procedimientos = [
        {nom_respuesta: 'producto', sp_name: 'USP_PRI_PRODUCTOS_G_2', parametros}
    ]
    Ejecutar_Procedimientos(res, procedimientos)
})

router.post('/editar_producto', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Id_Producto', valor_parametro: input.Id_Producto}
    ]
    procedimientos = [
        {nom_respuesta: 'producto', sp_name: 'usp_PRI_PRODUCTOS_TXPK', parametros}
    ]
    Ejecutar_Procedimientos(res, procedimientos)
})
router.post('/get_presentacion_ubicacion', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Id_Producto', valor_parametro: input.Id_Producto}
    ]
    procedimientos = [
        {nom_respuesta: 'presentacionubicacion', sp_name: 'USP_PRI_PRODUCTO_STOCK_TXIdProducto', parametros}
    ]
    Ejecutar_Procedimientos(res, procedimientos)
})

router.post('/eliminar_presentacion_ubicacion', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Id_Producto', valor_parametro: input.Id_Producto},
        {nom_parametro: 'Cod_UnidadMedida', valor_parametro: input.Cod_UnidadMedida},
        {nom_parametro: 'Cod_Almacen', valor_parametro: input.Cod_Almacen}
    ]
    procedimientos = [
        {nom_respuesta: 'presentacionubicacion', sp_name: 'usp_PRI_PRODUCTO_STOCK_E', parametros}
    ]
    Ejecutar_Procedimientos(res, procedimientos)
})


module.exports = router;