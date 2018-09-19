var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var {Ejecutar_Procedimientos} = require('../utility/exec_sp_sql')
// define the home page route

router.post('/get_by_script_productos_serv', function (req, res) {
    parametros = [
        {nom_parametro:'TamañoPagina',valor_parametro:input.TamanoPagina},
        {nom_parametro:'NumeroPagina',valor_parametro:input.NumeroPagina},
        {nom_parametro:'ScripOrden',valor_parametro:input.ScripOrden},
        {nom_parametro:'ScripWhere',tipo_parametro:sql.NVarChar,valor_parametro:input.ScripWhere}
    ]
    procedimientos =[
        {nom_respuesta:'productos',sp_name:'usp_PRI_PRODUCTOS_TP',parametros} 
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});


router.post('/get_producto_by_codalm_codprec_stock', function (req, res) {
    parametros = [
        {nom_parametro:'CodCategoria',valor_parametro:input.CodCategoria},
        {nom_parametro:'CodAlmacen',valor_parametro:input.CodAlmacen},
        {nom_parametro:'CodPrecio',valor_parametro:input.CodPrecio}
    ]
    procedimientos =[
        {nom_respuesta:'productos',sp_name:'USP_PRODUCTOS_TXCodCat_CodAlm_CodPrec_Stock',parametros} 
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});


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
    Ejecutar_Procedimientos(req,res,procedimientos)
});

router.post('/get_lista_stock', function (req, res) {
    input = req.body
    parametros1 = [
        {nom_parametro:'Tipo',valor_parametro:'BASICO'} 
    ]
    parametros2 = [
        {nom_parametro:'Id_Producto',valor_parametro:input.Id_Producto}, 
        {nom_parametro:'Cod_Categoria',valor_parametro:input.Cod_Categoria}
    ]
    parametros = []
    procedimientos =[
        {nom_respuesta:'almacenes',sp_name:'usp_ALM_ALMACEN_TT ',parametros},
        {nom_respuesta:'unidades_medida',sp_name:'USP_VIS_UNIDADES_DE_MEDIDA_TT',parametros},
        {nom_respuesta:'unidades_medida_tipo', sp_name:'USP_VIS_UNIDADES_DE_MEDIDA_TXTipo', parametros:parametros1},
        {nom_respuesta:'monedas',sp_name:'USP_VIS_MONEDAS_TT', parametros},
        {nom_respuesta:'precio_categoria',sp_name:'USP_PRI_PRODUCTO_PRECIO_TXCategoria', parametros:parametros2},
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});

router.post('/guardar_presentacion_ubicacion', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Id_Producto', valor_parametro: input.Id_Producto},
        {nom_parametro: 'Cod_UnidadMedida', valor_parametro: input.Cod_UnidadMedida},
        {nom_parametro: 'Cod_Almacen', valor_parametro: input.Cod_Almacen},
        {nom_parametro: 'Cod_Moneda', valor_parametro: input.Cod_Moneda},
        {nom_parametro: 'Precio_Compra', valor_parametro: input.Precio_Compra},
        {nom_parametro: 'Precio_Venta', valor_parametro: input.Precio_Venta},
        {nom_parametro: 'Stock_Min', valor_parametro: input.Stock_Min},
        {nom_parametro: 'Stock_Max', valor_parametro: input.Stock_Max},
        {nom_parametro: 'Stock_Act', valor_parametro: input.Stock_Act},
        {nom_parametro: 'Cod_UnidadMedidaMin', valor_parametro: input.Cod_UnidadMedidaMin},
        {nom_parametro: 'Cantidad_Min', tipo_parametro: sql.Numeric(5,2), valor_parametro: input.Cantidad_Min},
        {nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username}
    ]
    parametros1 = [
        {nom_parametro:'Id_Producto',valor_parametro:input.Id_Producto},
        {nom_parametro:'Cod_UnidadMedida',valor_parametro:input.Cod_UnidadMedida},
        {nom_parametro:'Cod_Almacen',valor_parametro:input.Cod_Almacen},
        {nom_parametro:'Cod_TipoPrecio',valor_parametro:input.Cod_TipoPrecio},
        {nom_parametro:'Valor',valor_parametro:input.Valor},
        {nom_parametro:'Cod_Usuario',valor_parametro:req.session.username}
    ]
    procedimientos = [
        {nom_respuesta: 'presentacion_ubicacion_stock', sp_name: 'USP_PRI_PRODUCTO_STOCK_G', parametros},
        {nom_respuesta:'presentacion_ubicacion_precio',sp_name:'USP_PRI_PRODUCTO_PRECIO_G',parametros:parametros1}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

router.post('/get_categoriaspadre', function (req, res){
    input = req.body
    parametros = []
    procedimientos = [
        {nom_respuesta: 'categoriaspadre', sp_name: 'USP_PRI_CATEGORIA_TArbol', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
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
        //{nom_respuesta: 'producto', sp_name: 'USP_PRI_PRODUCTOS_G_2', parametros}
        {nom_respuesta: 'producto', sp_name: 'USP_PRI_PRODUCTOS_G', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})


router.post('/get_producto_by_pk', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Id_Producto', valor_parametro: input.Id_Producto}
    ]
    procedimientos = [
        {nom_respuesta: 'producto', sp_name: 'usp_PRI_PRODUCTOS_TXPK', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

router.post('/get_producto_stock', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Id_Producto', valor_parametro: input.Id_Producto},
        {nom_parametro: 'Cod_UnidadMedida', valor_parametro: input.Cod_UnidadMedida},
        {nom_parametro: 'Cod_Almacen', valor_parametro: input.Cod_Almacen}
    ]
    procedimientos = [
        {nom_respuesta: 'producto', sp_name: 'usp_PRI_PRODUCTO_STOCK_TXPK', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})


router.post('/get_producto_precio', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Id_Producto', valor_parametro: input.Id_Producto},
        {nom_parametro: 'Cod_Almacen', valor_parametro: input.Cod_Almacen},
        {nom_parametro: 'Cod_UnidadMedida', valor_parametro: input.Cod_UnidadMedida},
    ]
    procedimientos = [
        {nom_respuesta: 'productos', sp_name: 'USP_PRI_PRODUCTO_PRECIO_TXProductoAlmacenUnidad', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

router.post('/eliminar_producto', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Id_Producto', valor_parametro: input.Id_Producto}
    ]
    procedimientos = [
        {nom_respuesta: 'producto', sp_name: 'usp_PRI_PRODUCTOS_E', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

router.post('/buscar_producto_caja_actual', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Cod_Caja', valor_parametro: req.app.locals.caja[0].Cod_Caja},
        {nom_parametro: 'Buscar', valor_parametro: input.Buscar},
        {nom_parametro: 'CodTipoProducto', valor_parametro: input.CodTipoProducto},
        {nom_parametro: 'Cod_Categoria', valor_parametro: input.Cod_Categoria},
        {nom_parametro: 'Cod_Precio', valor_parametro: input.Cod_Precio},
        {nom_parametro: 'Flag_RequiereStock', valor_parametro: input.Flag_RequiereStock},

    ]
    procedimientos = [
        {nom_respuesta: 'productos', sp_name: 'USP_PRI_PRODUCTOS_Buscar', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

router.post('/buscar_producto_by_id_cliente_caja_actual', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Cod_Caja', valor_parametro: req.app.locals.caja[0].Cod_Caja},
        {nom_parametro: 'Buscar', valor_parametro: input.Buscar},
        {nom_parametro: 'IdClienteProveedor', valor_parametro: input.CodTipoProducto},
        {nom_parametro: 'Cod_Categoria', valor_parametro: input.Cod_Categoria}

    ]
    procedimientos = [
        {nom_respuesta: 'productos', sp_name: 'USP_PRI_PRODUCTOS_BuscarXIdClienteProveedor', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

router.post('/get_precios', function (req, res){
    input = req.body
    parametros = []
    procedimientos = [
        {nom_respuesta: 'precios', sp_name: 'USP_VIS_PRECIOS_TT', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})


router.post('/get_unidad_medida_by_producto_almacen', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Id_Producto', valor_parametro: input.Id_Producto,tipo_parametro:sql.Int},
        {nom_parametro: 'Cod_Almacen', valor_parametro: input.Cod_Almacen}

    ]
    procedimientos = [
        {nom_respuesta: 'unidades_medidas', sp_name: 'USP_PRI_PRODUCTO_TUnidadMedidaXProductoAlmacen', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})


router.post('/get_presentacion_ubicacion', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Id_Producto', valor_parametro: input.Id_Producto}
    ]
    procedimientos = [
        {nom_respuesta: 'presentacionubicacion', sp_name: 'USP_PRI_PRODUCTO_STOCK_TXIdProducto', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
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
    Ejecutar_Procedimientos(req,res, procedimientos)
})


router.post('/get_producto_by_almacen', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Cod_Almacen', valor_parametro: input.Cod_Almacen}
    ]
    procedimientos = [
        {nom_respuesta: 'productos', sp_name: 'USP_PRI_PRODUCTO_TXCodAlmacen', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

router.post('/update_producto_stock', function (req, res){
    input = req.body 
    procedimientos = [
        {nom_respuesta: 'stock', sp_name: 'USP_PRI_PRODUCTO_STOCK_ActualizarStockGeneral', parametros:[]}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})


router.post('/get_codigo_unidad_by_codP_codA_codTP', function (req, res){
    input = req.body 
    parametros = [
        {nom_parametro: 'Cod_Producto', valor_parametro: input.Cod_Producto},
        {nom_parametro: 'Cod_Almacen', valor_parametro: input.Cod_Almacen},
        {nom_parametro: 'Cod_TipoPrecio', valor_parametro: input.Cod_TipoPrecio}
    ]
    procedimientos = [
        {nom_respuesta: 'producto', sp_name: 'USP_PRI_PRODUCTO_PRECIO_TPreciosXCodProd_CodAlm_CodPre', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})


router.post('/buscar_cuenta_contable', function (req, res){
    input = req.body 
    parametros = [
        {nom_parametro: 'TextoBuscar', valor_parametro: input.TextoBuscar}
    ]
    procedimientos = [
        {nom_respuesta: 'cuentas', sp_name: 'USP_PRI_CUENTA_CONTABLE_Buscar', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})


module.exports = router;