var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var { Ejecutar_Procedimientos, EXEC_SQL, EXEC_SQL_OUTPUT } = require('../utility/exec_sp_sql')
// define the home page route
router.post('/get_variables_cambio_precio', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Caja',valor_parametro: req.app.locals.caja[0].Cod_Caja},
    ]
    parametros_ = [
        {nom_parametro:'ScripWhere',valor_parametro:null},
    ]
    procedimientos =[
        {nom_respuesta:'almacenes',sp_name:'USP_CAJ_CAJA_ALMACEN_TXCaja',parametros},
        {nom_respuesta:'precios',sp_name:'USP_VIS_PRECIOS_TT',parametros:[]},
        {nom_respuesta:'productos',sp_name:'usp_PRI_PRODUCTO_PRECIO_TNF',parametros:parametros_},
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});

router.post('/guardar_cambio_precio', function (req, res) {
    input = req.body   
    parametros = [
        {nom_parametro:'Id_Producto',valor_parametro:input.Id_Producto,tipo_parametro:sql.Int},
        {nom_parametro:'Cod_UnidadMedida',valor_parametro:input.Cod_UnidadMedida},
        {nom_parametro:'Cod_Almacen',valor_parametro:input.Cod_Almacen},
    ] 
    EXEC_SQL('usp_PRI_PRODUCTO_STOCK_TXPK',parametros, function (dataProductosStock) {
        if (dataProductosStock.err){
            return res.json({respuesta:"error",detalle_error:dataProductosStock.err})  
        }else{
            var dataProductos = dataProductosStock.result[0]
            parametrosProductos = [
                {nom_parametro:'Id_Producto',valor_parametro:input.Id_Producto,tipo_parametro:sql.Int},
                {nom_parametro:'Cod_UnidadMedida',valor_parametro:input.Cod_UnidadMedida},
                {nom_parametro:'Cod_Almacen',valor_parametro:input.Cod_Almacen},
                {nom_parametro:'Cod_Moneda',valor_parametro:dataProductos.Cod_Moneda},
                {nom_parametro:'Precio_Compra',valor_parametro:dataProductos.Precio_Compra},
                {nom_parametro:'Precio_Venta',valor_parametro:input.Valor},
                {nom_parametro:'Stock_Min',valor_parametro:dataProductos.Stock_Min},
                {nom_parametro:'Stock_Max',valor_parametro:dataProductos.Stock_Max},
                {nom_parametro:'Stock_Act',valor_parametro:dataProductos.Stock_Act},
                {nom_parametro:'Cod_UnidadMedidaMin',valor_parametro:dataProductos.Cod_UnidadMedidaMin},
                {nom_parametro:'Cantidad_Min',valor_parametro:dataProductos.Cantidad_Min},
                {nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username}
            ] 
            EXEC_SQL('USP_PRI_PRODUCTO_STOCK_G',parametrosProductos, function (dataResult) {
                if (dataResult.err){
                    return res.json({respuesta:"error",detalle_error:dataResult.err})  
                }else{
                    parametrosProductoPrecio = [
                        {nom_parametro:'Id_Producto',valor_parametro:input.Id_Producto,tipo_parametro:sql.Int},
                        {nom_parametro:'Cod_UnidadMedida',valor_parametro:input.Cod_UnidadMedida},
                        {nom_parametro:'Cod_Almacen',valor_parametro:input.Cod_Almacen},
                        {nom_parametro:'Cod_TipoPrecio',valor_parametro:input.Cod_TipoPrecio}
                    ] 
                    EXEC_SQL('usp_PRI_PRODUCTO_PRECIO_TXPK',parametrosProductoPrecio, function (dataProductoPrecio) {
                        if (dataProductoPrecio.err){
                            return res.json({respuesta:"error",detalle_error:dataProductoPrecio.err})  
                        }else{
                            parametrosProductoPrecio_ = [
                                {nom_parametro:'Id_Producto',valor_parametro:dataProductoPrecio.result[0].Id_Producto,tipo_parametro:sql.Int},
                                {nom_parametro:'Cod_UnidadMedida',valor_parametro:dataProductoPrecio.result[0].Cod_UnidadMedida},
                                {nom_parametro:'Cod_Almacen',valor_parametro:dataProductoPrecio.result[0].Cod_Almacen},
                                {nom_parametro:'Cod_TipoPrecio',valor_parametro:dataProductoPrecio.result[0].Cod_TipoPrecio},
                                {nom_parametro:'Valor',valor_parametro:input.Valor},
                                {nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username}
                            ] 
                            EXEC_SQL('USP_PRI_PRODUCTO_PRECIO_G',parametrosProductoPrecio_, function (dataResultPrecio) {
                                if (dataResultPrecio.err){
                                    return res.json({respuesta:"error",detalle_error:dataResultPrecio.err})  
                                }else{
                                    return res.json({respuesta:"ok"})
                                }   
                            })  
                        }   
                    })  
                }   
            })  
        }   
    })  
});
 

module.exports = router;