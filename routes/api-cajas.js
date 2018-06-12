var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var {Ejecutar_Procedimientos,EXEC_SQL_OUTPUT,EXEC_SQL} = require('../utility/exec_sp_sql')
// define the home page route

router.post('/guardar_caja', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Caja', valor_parametro: input.Cod_Caja},
        {nom_parametro:'Des_Caja', valor_parametro: input.Des_Caja},
        {nom_parametro:'Cod_Sucursal', valor_parametro: input.Cod_Sucursal},
        {nom_parametro:'Cod_UsuarioCajero', valor_parametro: input.Cod_UsuarioCajero},
        {nom_parametro:'Cod_CuentaContable', valor_parametro: input.Cod_CuentaContable},
        {nom_parametro:'Flag_Activo', valor_parametro: input.Flag_Activo},
        {nom_parametro:'Cod_Usuario', valor_parametro: req.session.username}
    ]
    procedimientos = [
        {nom_respuesta: 'caja', sp_name: 'USP_CAJ_CAJAS_G', parametros}
    ]
    Ejecutar_Procedimientos(res,procedimientos)
})

router.post('/eliminar_caja', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'Cod_Caja', valor_parametro: input.Cod_Caja }
    ]
    procedimientos = [
        { nom_respuesta: 'caja', sp_name: 'USP_CAJ_CAJAS_E', parametros }
    ]
    Ejecutar_Procedimientos(res, procedimientos)
})

router.post('/get_cajas', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'TamañoPagina',valor_parametro:input.TamanoPagina},
        {nom_parametro:'NumeroPagina',valor_parametro:input.NumeroPagina},
        {nom_parametro:'ScripOrden',valor_parametro:input.ScripOrden},
        {nom_parametro:'ScripWhere',tipo_parametro:sql.NVarChar,valor_parametro:input.ScripWhere}
    ]
    procedimientos =[
        {nom_respuesta:'cajas',sp_name:'usp_CAJ_CAJAS_TP',parametros},
        {nom_respuesta:'num_filas',sp_name:'usp_CAJ_CAJAS_TNF',parametros:[{nom_parametro:'ScripWhere',valor_parametro:input.ScripWhere}]},
        {nom_respuesta:'sucursales',sp_name:'usp_PRI_SUCURSAL_TT',parametros:[]},
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});

router.post('/get_documents_by_caja', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Caja',valor_parametro:input.Cod_Caja},
    ]
    procedimientos =[
        {nom_respuesta:'documentos',sp_name:'USP_CAJ_CAJAS_DOC_TXCod_Caja',parametros},
        {nom_respuesta:'productos',sp_name:'USP_VIS_CAJA_PRODUCTOS_TxCaja',parametros}
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});

router.post('/buscar_usuarios', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro:'TamañoPagina',valor_parametro:input.TamanoPagina},
        {nom_parametro:'NumeroPagina',valor_parametro:input.NumeroPagina},
        {nom_parametro:'ScripOrden',valor_parametro:input.ScripOrden},
        {nom_parametro:'ScripWhere',tipo_parametro:sql.NVarChar,valor_parametro:input.ScripWhere}
    ]
    procedimientos = [
        {nom_respuesta:'usuarios',sp_name:'usp_PRI_USUARIO_TP',parametros}
    ]
    Ejecutar_Procedimientos(res,procedimientos)
})

router.post('/get_comprobantes', function (req, res){
    input = req.body
    parametros = []
    procedimientos = [
        {nom_respuesta:'comprobantes',sp_name:'USP_VIS_TIPO_COMPROBANTES_TT',parametros}
    ]
    Ejecutar_Procedimientos(res,procedimientos)
})

router.post('/get_series_by_cod_caja_comprobante', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Caja',valor_parametro:req.locals.caja[0].Cod_Caja},
        {nom_parametro:'Cod_TipoComprobante',valor_parametro:input.Cod_TipoComprobante}
    ]
    procedimientos = [
        {nom_respuesta:'series',sp_name:'USP_CAJ_CAJAS_DOC_TXCodCajaComprobante',parametros}
    ]
    Ejecutar_Procedimientos(res,procedimientos)
})

router.post('/get_next_comprobante_by_tipo_serie_libro', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro:'Cod_TipoComprobante',valor_parametro:input.Cod_TipoComprobante},
        {nom_parametro:'Serie',valor_parametro:input.Serie},
        {nom_parametro:'CodLibro',valor_parametro:input.CodLibro}
    ]
    procedimientos = [
        {nom_respuesta:'comprobante',sp_name:'USP_CAJ_COMPROBANTE_PAGO_NumeroXTipoSerieLibro',parametros}
    ]
    Ejecutar_Procedimientos(res,procedimientos)
})

router.post('/guardar_documento', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Caja', valor_parametro: input.Cod_Caja},
        {nom_parametro:'Item', valor_parametro: input.Item},
        {nom_parametro:'Cod_TipoComprobante', valor_parametro: input.Cod_TipoComprobante},
        {nom_parametro:'Serie', valor_parametro: input.Serie},
        {nom_parametro:'Impresora', valor_parametro: input.Impresora},
        {nom_parametro:'Flag_Imprimir', valor_parametro: input.Flag_Imprimir},
        {nom_parametro:'Flag_FacRapida', valor_parametro: input.Flag_FacRapida},
        {nom_parametro:'Nom_Archivo', valor_parametro: input.Nom_Archivo},
        {nom_parametro:'Nro_SerieTicketera', valor_parametro: input.Nro_SerieTicketera},
        {nom_parametro:'Nom_ArchivoPublicar', valor_parametro: input.Nom_ArchivoPublicar},
        {nom_parametro:'Limite', valor_parametro: input.Limite},
        {nom_parametro:'Cod_Usuario', valor_parametro: req.session.username}
    ]
    procedimientos = [
        {nom_respuesta: 'documento', sp_name: 'USP_CAJ_CAJAS_DOC_G', parametros}
    ]
    Ejecutar_Procedimientos(res,procedimientos)
})

router.post('/eliminar_documento', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Caja', valor_parametro: input.Cod_Caja},
        {nom_parametro:'Item', valor_parametro: input.Item}
    ]
    procedimientos = [
        {nom_respuesta: 'documento', sp_name: 'usp_CAJ_CAJAS_DOC_E', parametros}
    ]
    Ejecutar_Procedimientos(res, procedimientos)
})

router.post('/opciones_buscar_producto', function (req, res){
    input = req.body 
    procedimientos = [
        {nom_respuesta: 'categorias', sp_name: 'USP_PRI_CATEGORIA_TArbol ', parametros: []},
        {nom_respuesta: 'tipoprecio', sp_name: 'USP_VIS_PRECIOS_TT', parametros: []}
    ]
    Ejecutar_Procedimientos(res, procedimientos)
})

router.post('/buscar_producto', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Cod_Caja', valor_parametro: input.Cod_Caja},
        {nom_parametro: 'Buscar', valor_parametro: input.Buscar},
        {nom_parametro: 'Cod_Categoria', valor_parametro: input.Cod_Categoria},
        {nom_parametro: 'Cod_Precio', valor_parametro: input.Cod_Precio},
        {nom_parametro: 'Flag_RequiereStock', valor_parametro: input.Flag_RequiereStock},

    ]
    procedimientos = [
        {nom_respuesta: 'productos', sp_name: 'USP_PRI_PRODUCTOS_Buscar', parametros}
    ]
    Ejecutar_Procedimientos(res, procedimientos)
})

router.post('/guardar_favorito', function (req, res){
    input = req.body
    parametros1 = [
        {nom_parametro:'Cod_Caja',valor_parametro:input.Cod_Caja},
    ]
    parametros2 = [
        {nom_parametro:'Cod_Caja',valor_parametro:input.Cod_Caja},
        {nom_parametro:'Id_Producto',valor_parametro:input.Id_Producto},
        {nom_parametro:'Cod_Almacen',valor_parametro:input.Cod_Almacen},
        {nom_parametro:'Cod_UnidadMedida',valor_parametro:input.Cod_UnidadMedida},
        {nom_parametro:'Cod_Precio',valor_parametro:input.Cod_Precio}
    ]
    procedimientos =[
        {nom_respuesta:'guardar', sp_name: 'USP_VIS_CAJA_PRODUCTOS_G',parametros:parametros2},
        {nom_respuesta:'productos',sp_name:'USP_VIS_CAJA_PRODUCTOS_TxCaja',parametros:parametros1}
        
    ]
    Ejecutar_Procedimientos(res,procedimientos)
})

router.post('/eliminar_favorito', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Caja', valor_parametro:input.Cod_Caja},
        {nom_parametro:'Id_Producto', valor_parametro:input.Id_Producto}
    ]
    parametros1 = [
        {nom_parametro:'Cod_Caja',valor_parametro:input.Cod_Caja},
    ]
    procedimientos = [
        {nom_respuesta:'eliminar', sp_name: 'USP_VIS_CAJA_PRODUCTO_E',parametros},
        {nom_respuesta:'productos',sp_name:'USP_VIS_CAJA_PRODUCTOS_TxCaja',parametros:parametros1}
        
    ]
    Ejecutar_Procedimientos(res,procedimientos)
})



router.post('/get_caja_actual', function (req, res) {
    input = req.body
    res.json({caja:req.app.locals.caja[0],turno:req.app.locals.turno[0],arqueo:req.app.locals.arqueo[0]})
})

router.post('/get_empresa', function (req, res) {
    input = req.body
    res.json({empresa:req.app.locals.empresa[0]})
})

router.post('/arqueo_caja', function (req, res){
    input = req.body
    
    parametros1 = [
        {nom_parametro:'Cod_Caja',valor_parametro:req.app.locals.caja[0].Cod_Caja},
        {nom_parametro:'Cod_Turno',valor_parametro:req.app.locals.turno[0].Cod_Turno},
        {nom_parametro:'Cod_Moneda',valor_parametro:'PEN'}
    ]
    parametros2 = [
        {nom_parametro:'Cod_Caja',valor_parametro:req.app.locals.caja[0].Cod_Caja},
        {nom_parametro:'Cod_Turno',valor_parametro:req.app.locals.turno[0].Cod_Turno},
        {nom_parametro:'Cod_Moneda',valor_parametro:'USD'}
    ]
    procedimientos =[
        {nom_respuesta:'resumenpen', sp_name: 'USP_CAJ_COMPROBANTE_P_RESUMENxCajaTurno',parametros:parametros1},
        {nom_respuesta:'resumenusd', sp_name: 'USP_CAJ_COMPROBANTE_P_RESUMENxCajaTurno',parametros:parametros2}
    ]
    Ejecutar_Procedimientos(res,procedimientos)
})


router.post('/get_billetes', function (req, res){
    input = req.body
     
    procedimientos =[
        {nom_respuesta:'billetes', sp_name: 'USP_VIS_BILLETES_TT',parametros:[]}
    ]
    Ejecutar_Procedimientos(res,procedimientos)
})

router.post('/get_detalle_arqueo', function (req, res){
    input = req.body
    
    parametros = [
        {nom_parametro:'id_ArqueoFisico',valor_parametro:req.app.locals.arqueo[0].idArqueoFisico}
    ]
    procedimientos =[
        {nom_respuesta:'billetes', sp_name: 'USP_CAJ_ARQUEOFISICO_D_TXid_ArqueoFisico',parametros:[]}
    ]
    Ejecutar_Procedimientos(res,procedimientos)
})

router.post('/guardar_arqueo', function (req, res){
    input = req.body 
    console.log(input.dataFormTS)
    console.log(input.dataBS)
    p = [
        { nom_parametro: 'id_ArqueoFisico', valor_parametro: -1, tipo:"output"},
        { nom_parametro: 'Cod_Caja', valor_parametro: req.app.locals.caja[0].Cod_Caja},
        { nom_parametro: 'Cod_Turno', valor_parametro:req.app.locals.turno[0].Cod_Turno},
        { nom_parametro: 'Numero', valor_parametro: req.app.locals.arqueo[0].Numero},
        { nom_parametro: 'Des_ArqueoFisico', valor_parametro: req.app.locals.arqueo[0].Des_ArqueoFisico},
        { nom_parametro: 'Obs_ArqueoFisico', valor_parametro: ''},
        { nom_parametro: 'Fecha', valor_parametro: input.Fecha},
        { nom_parametro: 'Flag_Cerrado', valor_parametro: 1},
        { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username}
      ]
  
      EXEC_SQL_OUTPUT('USP_CAJ_ARQUEOFISICO_G', p , function (dataArqueoFisico) {
        for(var i=0;i<input.dataFormTS.length;i += 2){
            var tipo=input.dataFormTS[i].value
            var monto = input.dataFormTS[i+1].value
            var parametros = [
                { nom_parametro: 'id_ArqueoFisico', valor_parametro: dataArqueoFisico.result},
                { nom_parametro: 'Cod_Moneda', valor_parametro: 'PEN'},
                { nom_parametro: 'Tipo', valor_parametro: tipo},
                { nom_parametro: 'Monto', valor_parametro:monto},
                { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username}
              ]
            

            EXEC_SQL_OUTPUT('USP_CAJ_ARQUEOFISICO_SALDO_G', parametros , function (dataArqueoFisicoSaldo) {
            })

            /*procedimientos =[
                {nom_respuesta:'arqueo', sp_name: 'USP_CAJ_ARQUEOFISICO_SALDO_G',parametros}
            ]*/
        }

        for(var i=0;i<input.dataFormTD.length;i += 2){ 
            var tipo=input.dataFormTS[i].value
            var monto = input.dataFormTS[i+1].value
            var parametros = [
                { nom_parametro: 'id_ArqueoFisico', valor_parametro: dataArqueoFisico.result},
                { nom_parametro: 'Cod_Moneda', valor_parametro: 'USD'},
                { nom_parametro: 'Tipo', valor_parametro: tipo},
                { nom_parametro: 'Monto', valor_parametro:monto},
                { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username}
              ]
            
            EXEC_SQL_OUTPUT('USP_CAJ_ARQUEOFISICO_SALDO_G', parametros , function (dataArqueoFisicoSaldo) {
            })

            /*
            procedimientos =[
                {nom_respuesta:'arqueo', sp_name: 'USP_CAJ_ARQUEOFISICO_SALDO_G',parametros}
            ]*/
        }

        var parametros = [
            { nom_parametro: 'id_ArqueoFisico', valor_parametro: dataArqueoFisico.result},
            { nom_parametro: 'Cod_Moneda', valor_parametro: 'PEN'},
            { nom_parametro: 'Tipo', valor_parametro: "SALDO FINAL"},
            { nom_parametro: 'Monto', valor_parametro:input.totalBilletesSoles},
            { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username}
        ]

        EXEC_SQL_OUTPUT('USP_CAJ_ARQUEOFISICO_SALDO_G', parametros , function (dataArqueoFisicoSaldo) {
        })

        
        /*procedimientos =[
            {nom_respuesta:'arqueo', sp_name: 'USP_CAJ_ARQUEOFISICO_SALDO_G',parametros}
        ]*/

        var parametros = [
            { nom_parametro: 'id_ArqueoFisico', valor_parametro: dataArqueoFisico.result},
            { nom_parametro: 'Cod_Moneda', valor_parametro: 'USD'},
            { nom_parametro: 'Tipo', valor_parametro: "SALDO FINAL"},
            { nom_parametro: 'Monto', valor_parametro:input.totalBilletesDolares},
            { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username}
        ]

        EXEC_SQL_OUTPUT('USP_CAJ_ARQUEOFISICO_SALDO_G', parametros , function (dataArqueoFisicoSaldo) {
        })

        
        /*procedimientos =[
            {nom_respuesta:'arqueo', sp_name: 'USP_CAJ_ARQUEOFISICO_SALDO_G',parametros}
        ]*/

        for(var i=0;i<input.dataBS.length;i += 4){ 
            var Cod_Billete=input.dataBS[i].value
            var Valor_Billete = input.dataBS[i+1].value
            var Cantidad = input.dataBS[i+2].value
            var Total = input.dataBS[i+3].value
            var parametros = [
                { nom_parametro: 'id_ArqueoFisico', valor_parametro: dataArqueoFisico.result},
                { nom_parametro: 'Cod_Billete', valor_parametro: Cod_Billete},
                { nom_parametro: 'Cantidad', valor_parametro: Cantidad},
                { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username}
              ]
            

            EXEC_SQL_OUTPUT('USP_CAJ_ARQUEOFISICO_D_G', parametros , function (dataArqueoFisicoDetalles) {
            })

            /*procedimientos =[
                {nom_respuesta:'arqueo_fisico', sp_name: 'USP_CAJ_ARQUEOFISICO_D_G',parametros}
            ]*/
        }

        for(var i=0;i<input.dataBD.length;i += 4){ 
            var Cod_Billete=input.dataBD[i].value
            var Valor_Billete = input.dataBD[i+1].value
            var Cantidad = input.dataBD[i+2].value
            var Total = input.dataBD[i+3].value
            var parametros = [
                { nom_parametro: 'id_ArqueoFisico', valor_parametro: dataArqueoFisico.result},
                { nom_parametro: 'Cod_Billete', valor_parametro: Cod_Billete},
                { nom_parametro: 'Cantidad', valor_parametro: Cantidad},
                { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username}
              ]
            
            EXEC_SQL_OUTPUT('USP_CAJ_ARQUEOFISICO_D_G', parametros , function (dataArqueoFisicoDetalles) {
            })

            /*procedimientos =[
                {nom_respuesta:'arqueo_fisico', sp_name: 'USP_CAJ_ARQUEOFISICO_D_G',parametros}
            ]*/
        }

        res.json({ respuesta: 'ok', data: dataArqueoFisico.result })
       
      })
     
})

module.exports = router;