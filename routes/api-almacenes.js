var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var {Ejecutar_Procedimientos, EXEC_SQL, EXEC_SQL_OUTPUT} = require('../utility/exec_sp_sql')
// define the home page route
router.post('/get_almacenes', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'TamañoPagina',valor_parametro:input.TamanoPagina},
        {nom_parametro:'NumeroPagina',valor_parametro:input.NumeroPagina},
        {nom_parametro:'ScripOrden',valor_parametro:input.ScripOrden},
        {nom_parametro:'ScripWhere',tipo_parametro:sql.NVarChar,valor_parametro:input.ScripWhere}
    ]
    procedimientos =[
        {nom_respuesta:'almacenes',sp_name:'usp_ALM_ALMACEN_TP',parametros},
        {nom_respuesta:'num_filas',sp_name:'usp_ALM_ALMACEN_TNF',parametros:[{nom_parametro:'ScripWhere',valor_parametro:input.ScripWhere}]},
        {nom_respuesta:'tipo_almacenes',sp_name:'USP_VIS_TIPO_ALMACENES_TT',parametros:[]},
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});

router.post('/get_cajas_by_almacen', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Almacen',valor_parametro:input.Cod_Almacen},
    ]
    procedimientos =[
        {nom_respuesta:'cajas_almacen',sp_name:'USP_CAJ_CAJA_ALMACEN_TXAlmacen',parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});
router.post('/guardar_almacen', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Almacen',valor_parametro:input.Cod_Almacen},
        {nom_parametro:'Des_Almacen',valor_parametro:input.Des_Almacen},
        {nom_parametro:'Des_CortaAlmacen',valor_parametro:input.Des_CortaAlmacen},
        {nom_parametro:'Cod_TipoAlmacen',valor_parametro:input.Cod_TipoAlmacen},
        {nom_parametro:'Flag_Principal',valor_parametro:input.Flag_Principal},
        {nom_parametro:'Cod_Usuario',valor_parametro:req.session.username},
    ]
    procedimientos =[
        {nom_respuesta:'almacen',sp_name:'USP_ALM_ALMACEN_G',parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});
router.post('/eliminar_almacen', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Almacen',valor_parametro:input.Cod_Almacen},
    ]
    procedimientos =[
        {nom_respuesta:'almacen',sp_name:'USP_ALM_ALMACEN_E',parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});
router.post('/eliminar_caja_almacen', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Caja', valor_parametro: input.Cod_Caja},
        {nom_parametro:'Cod_Almacen', valor_parametro: input.Cod_Almacen}
    ]
    procedimientos = [
        {nom_respuesta: 'caja_almacen', sp_name: 'usp_CAJ_CAJA_ALMACEN_E', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})
router.post('/guardar_caja_almacen', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Caja', valor_parametro: input.Cod_Caja},
        {nom_parametro:'Cod_Almacen', valor_parametro: input.Cod_Almacen},
        {nom_parametro:'Flag_Principal', valor_parametro: input.Flag_Principal},
        {nom_parametro:'Cod_Usuario', valor_parametro: req.session.username}
    ]
    procedimientos = [
        {nom_respuesta: 'caja_almacen', sp_name: 'USP_CAJ_CAJA_ALMACEN_G', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})
router.post('/get_cajas_activas', function (req, res){
    input = req.body
    procedimientos = [
        {nom_respuesta: 'cajas_activas', sp_name: 'USP_CAJ_CAJAS_TActivos', parametros:[]}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

router.post('/get_almacen_by_producto', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro:'Id_Producto', valor_parametro: input.Id_Producto}
    ]
    procedimientos = [
        {nom_respuesta: 'almacenes', sp_name: 'USP_PRI_PRODUCTO_TAlamcenXProducto', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})


router.post('/get_almacenes_distinto', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Almacen', valor_parametro: input.Cod_Almacen}
    ]
    procedimientos = [
        {nom_respuesta: 'almacenes', sp_name: 'USP_ALM_ALMACEN_TDistintoDe', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

router.post('/get_mov_pendiente_almacenes', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Almacen', valor_parametro: input.Cod_Almacen}
    ]
    procedimientos = [
        {nom_respuesta: 'pendientes', sp_name: 'USP_ALM_ALMACEN_MOV_TPendiente', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

router.post('/get_almacen_mov_by_id', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro:'Id_AlmacenMov', valor_parametro: input.Id_AlmacenMov}
    ]
    procedimientos = [
        {nom_respuesta: 'movimientos_almacen', sp_name: 'usp_ALM_ALMACEN_MOV_TXPK', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

router.post('/get_almacen_mov_detalle_by_id', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro:'Id_AlmacenMov', valor_parametro: input.Id_AlmacenMov}
    ]
    procedimientos = [
        {nom_respuesta: 'movimientos_detalle_almacen', sp_name: 'USP_ALM_ALMACEN_MOV_D_TXIdMovimiento', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})



router.post('/get_almacenes_by_caja', function (req, res) {
    input = req.body

    parametros = [
        { nom_parametro: 'Cod_Caja', valor_parametro: req.app.locals.caja[0].Cod_Caja }, 
    ] 
     
    procedimientos = [
        { nom_respuesta: 'almacenes', sp_name: 'USP_CAJ_CAJA_ALMACEN_TXCaja', parametros }
    ]  
    Ejecutar_Procedimientos(req,res, procedimientos)
         
}); 

router.post('/guardar_mov_almacen_', function (req, res){ 
    input = req.body
    parametros = [
        {nom_parametro:'Id_AlmacenMov', valor_parametro: -1, tipo:"output"},
        {nom_parametro:'Cod_Almacen', valor_parametro: input.Cod_Almacen},
        {nom_parametro:'Cod_TipoOperacion', valor_parametro: input.Cod_TipoOperacion},
        {nom_parametro:'Cod_Turno', valor_parametro: req.app.locals.turno[0].Cod_Turno},
        {nom_parametro:'Cod_TipoComprobante', valor_parametro: input.Cod_TipoComprobante},
        {nom_parametro:'Serie', valor_parametro: input.Serie},
        {nom_parametro:'Numero', valor_parametro: input.Numero,tipo_parametro:sql.VarChar},
        {nom_parametro:'Fecha', valor_parametro: input.Fecha},
        {nom_parametro:'Motivo', valor_parametro: input.Motivo},
        {nom_parametro:'Id_ComprobantePago', valor_parametro: input.Id_ComprobantePago,tipo_parametro:sql.Int},
        {nom_parametro:'Flag_Anulado', valor_parametro: input.Flag_Anulado},
        {nom_parametro:'Obs_AlmacenMov', valor_parametro: input.Obs_AlmacenMov},
        {nom_parametro:'Cod_Usuario',valor_parametro:req.session.username}
    ] 
    

    EXEC_SQL_OUTPUT('USP_ALM_ALMACEN_MOV_G', parametros , function (dataMov) {
         
    })
})




router.post('/guardar_mov_almacen', function (req, res){ 
    input = req.body
    parametros = [
        {nom_parametro:'Id_AlmacenMov', valor_parametro: -1, tipo:"output"},
        {nom_parametro:'Cod_Almacen', valor_parametro: input.Cod_Almacen},
        {nom_parametro:'Cod_TipoOperacion', valor_parametro: input.Cod_TipoOperacion},
        {nom_parametro:'Cod_Turno', valor_parametro: req.app.locals.turno[0].Cod_Turno},
        {nom_parametro:'Cod_TipoComprobante', valor_parametro: input.Cod_TipoComprobante},
        {nom_parametro:'Serie', valor_parametro: input.Serie},
        {nom_parametro:'Numero', valor_parametro: input.Numero,tipo_parametro:sql.VarChar},
        {nom_parametro:'Fecha', valor_parametro: input.Fecha},
        {nom_parametro:'Motivo', valor_parametro: input.Motivo},
        {nom_parametro:'Id_ComprobantePago', valor_parametro: input.Id_ComprobantePago,tipo_parametro:sql.Int},
        {nom_parametro:'Flag_Anulado', valor_parametro: input.Flag_Anulado},
        {nom_parametro:'Obs_AlmacenMov', valor_parametro: input.Obs_AlmacenMov},
        {nom_parametro:'Cod_Usuario',valor_parametro:req.session.username}
    ] 
    

    EXEC_SQL_OUTPUT('USP_ALM_ALMACEN_MOV_G', parametros , function (dataMov) {
        if (dataMov.error) return res.json({respuesta:"error",error:dataMov.error}) 
        else{
            var Id_AlmacenMov = dataMov.result[0].valor  
            var contador = 1 
            //console.log(input.dataForm)
            for(var i=0;i<input.dataForm.length;i += 9){
                var Id_Producto = input.dataForm[i].value
                var Item = contador
                contador++
                var Des_Producto = input.dataForm[i+3].value
                var Precio_Unitario = input.dataForm[i+6].value
                var Cantidad = input.dataForm[i+4].value
                var Cod_UnidadMedida = input.dataForm[i+5].value
                var Obs_AlmacenMovD = input.dataForm[i+7].value
                var Series = JSON.parse(input.dataForm[i+8].value)
                var Cod_Usuario = req.session.username

                var parametros = [
                    {nom_parametro:'Id_AlmacenMov', valor_parametro: Id_AlmacenMov},
                    { nom_parametro: 'Id_Producto', valor_parametro: Id_Producto},
                    { nom_parametro: 'Item', valor_parametro: Item},
                    { nom_parametro: 'Des_Producto', valor_parametro: Des_Producto},
                    { nom_parametro: 'Precio_Unitario', valor_parametro:Precio_Unitario},
                    { nom_parametro: 'Cantidad', valor_parametro:Cantidad},
                    { nom_parametro: 'Cod_UnidadMedida', valor_parametro:Cod_UnidadMedida},
                    { nom_parametro: 'Obs_AlmacenMovD', valor_parametro:Obs_AlmacenMovD},
                    { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username}
                ]
                
                /*var procedimientos = [
                    {nom_respuesta: 'almacen_mov', sp_name: 'USP_ALM_ALMACEN_MOV_D_G', parametros}
                ]*/

                EXEC_SQL('USP_ALM_ALMACEN_MOV_D_G', parametros, function (dataAlmacen) {
                    if (dataAlmacen.error) return res.json({ respuesta: 'error', detalle_error: dataAlmacen.error })
                    else{
                        if(Series.length>0){
                            for(var j=0;j<Series.length;j ++){
                                var p = [
                                    {nom_parametro:'Cod_Tabla', valor_parametro: "ALM_ALMACEN_MOV"},
                                    { nom_parametro: 'Id_Tabla', valor_parametro: Id_AlmacenMov},
                                    { nom_parametro: 'Item', valor_parametro: Item},
                                    { nom_parametro: 'Serie', valor_parametro: Series[j].Serie},
                                    { nom_parametro: 'Fecha_Vencimiento', valor_parametro:Series[j].Fecha},
                                    { nom_parametro: 'Obs_Serie', valor_parametro:Series[j].Observacion},
                                    { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username}
                                ]

                                EXEC_SQL('USP_CAJ_SERIES_G', p, function (dataAlmacen) {
                                    //console.log()
                                })
                                
                            }
                        }
                    }
                })
            }

            if(input.Cod_Destino!=null && input.Cod_Destino!=""){

                var parametrosDestino = [
                    {nom_parametro:'Id_AlmacenMov', valor_parametro: -1, tipo:"output"},
                    {nom_parametro:'Cod_Almacen', valor_parametro: input.Cod_Destino},
                    {nom_parametro:'Cod_TipoOperacion', valor_parametro: "NE"},
                    {nom_parametro:'Cod_Turno', valor_parametro: null},
                    {nom_parametro:'Cod_TipoComprobante', valor_parametro: "21"},
                    {nom_parametro:'Serie', valor_parametro: ""},
                    {nom_parametro:'Numero', valor_parametro:""},
                    {nom_parametro:'Fecha', valor_parametro: input.Fecha},
                    {nom_parametro:'Motivo', valor_parametro: input.Motivo},
                    {nom_parametro:'Id_ComprobantePago', valor_parametro: Id_AlmacenMov,tipo_parametro:sql.Int},
                    {nom_parametro:'Flag_Anulado', valor_parametro: input.Flag_Anulado},
                    {nom_parametro:'Obs_AlmacenMov', valor_parametro: input.Obs_AlmacenMov},
                    {nom_parametro:'Cod_Usuario',valor_parametro:req.session.username}
                ] 

                EXEC_SQL_OUTPUT('USP_ALM_ALMACEN_MOV_G', parametrosDestino , function (dataMov) {
                    if (dataMov.error) return res.json({respuesta:"error",error:dataMov.error}) 
                    var Id_AlmacenMov = dataMov.result[0].valor  
                    var contador = 1 
                    for(var i=0;i<input.dataForm.length;i += 9){

                        var Id_Producto = input.dataForm[i].value
                        var Item = contador
                        contador++
                        var Des_Producto = input.dataForm[i+3].value
                        var Precio_Unitario = input.dataForm[i+6].value
                        var Cantidad = input.dataForm[i+4].value
                        var Cod_UnidadMedida = input.dataForm[i+5].value
                        var Obs_AlmacenMovD = input.dataForm[i+7].value
                        var Series = JSON.parse(input.dataForm[i+8].value)
                        var Cod_Usuario = req.session.username

                        var parametros = [
                            {nom_parametro:'Id_AlmacenMov', valor_parametro: Id_AlmacenMov},
                            { nom_parametro: 'Id_Producto', valor_parametro: Id_Producto},
                            { nom_parametro: 'Item', valor_parametro: Item},
                            { nom_parametro: 'Des_Producto', valor_parametro: Des_Producto},
                            { nom_parametro: 'Precio_Unitario', valor_parametro:Precio_Unitario},
                            { nom_parametro: 'Cantidad', valor_parametro:Cantidad},
                            { nom_parametro: 'Cod_UnidadMedida', valor_parametro:Cod_UnidadMedida},
                            { nom_parametro: 'Obs_AlmacenMovD', valor_parametro:Obs_AlmacenMovD},
                            { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username}
                        ]
                        
                        /*var procedimientos = [
                            {nom_respuesta: 'almacen_mov', sp_name: 'USP_ALM_ALMACEN_MOV_D_G', parametros}
                        ]*/

                        EXEC_SQL('USP_ALM_ALMACEN_MOV_D_G', parametros, function (dataAlmacen) {
                            if (dataAlmacen.error) return res.json({ respuesta: 'error', detalle_error: dataAlmacen.error })
                            else{
                                if(Series.length>0){
                                    for(var j=0;j<Series.length;j ++){
                                        var p = [
                                            {nom_parametro:'Cod_Tabla', valor_parametro: "ALM_ALMACEN_MOV"},
                                            { nom_parametro: 'Id_Tabla', valor_parametro: Id_AlmacenMov},
                                            { nom_parametro: 'Item', valor_parametro: Item},
                                            { nom_parametro: 'Serie', valor_parametro: Series[j].Serie},
                                            { nom_parametro: 'Fecha_Vencimiento', valor_parametro:Series[j].Fecha},
                                            { nom_parametro: 'Obs_Serie', valor_parametro:Series[j].Observacion},
                                            { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username}
                                        ]
        
                                        EXEC_SQL('USP_CAJ_SERIES_G', p, function (dataAlmacen) {
                                            //console.log()
                                        })
                                        
                                    }
                                }
                            }
                        })

                        /*Ejecutar_Procedimientos(req,res, procedimientos) 

                        if(Series.length>0){
                            for(var j=0;j<Series.length;j ++){
                                var p = [
                                    {nom_parametro:'Cod_Tabla', valor_parametro: "ALM_ALMACEN_MOV"},
                                    { nom_parametro: 'Id_Tabla', valor_parametro: Id_AlmacenMov},
                                    { nom_parametro: 'Item', valor_parametro: Item},
                                    { nom_parametro: 'Serie', valor_parametro: Series[j].Serie},
                                    { nom_parametro: 'Fecha_Vencimiento', valor_parametro:Series[j].Fecha},
                                    { nom_parametro: 'Obs_Serie', valor_parametro:Series[j].Observacion},
                                    { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username}
                                ]
                                var procedimientos = [
                                    {nom_respuesta: 'series', sp_name: 'USP_CAJ_SERIES_G', parametros:p}
                                ]
                                Ejecutar_Procedimientos(req,res, procedimientos)
                                
                            }
                        }*/

                    }
                })
            }
            return res.json({respuesta:"ok",data:{}}) 
        }
    })
})

 
router.post('/get_variables_entradas_salidas', function (req, res){
    try{
        var data = {}
        input = req.body
        parametros = [
            {nom_parametro:'Cod_Caja', valor_parametro: req.app.locals.caja[0].Cod_Caja}
        ]

        EXEC_SQL('USP_CAJ_CAJA_ALMACEN_TXCaja', parametros, function (dataAlmacen) {
            if (dataAlmacen.error) return res.json({ respuesta: 'error', detalle_error: dataAlmacen.error })
            data['dataAlmacen'] = dataAlmacen.result
            parametros = [
                {nom_parametro:'Cod_TipoComprobante', valor_parametro: input.Cod_TipoComprobante} 
            ]

            EXEC_SQL('USP_VIS_TIPO_OPERACIONES_TXComprobante', parametros, function (dataTiposOperaciones) {
                if (dataTiposOperaciones.error) return res.json({ respuesta: 'error', detalle_error: dataTiposOperaciones.error })
                data['dataTiposOperaciones'] = dataTiposOperaciones.result
                parametros = [
                    {nom_parametro:'Cod_Caja', valor_parametro: req.app.locals.caja[0].Cod_Caja}
                ]

                EXEC_SQL('USP_CAJ_CAJAS_DOC_TXCodCaja', parametros, function (dataDocumentos) {
                    if (dataDocumentos.error) return res.json({ respuesta: 'error', detalle_error: dataDocumentos.error })
                    data['dataDocumentos'] = dataDocumentos.result
                    parametros = [
                        {nom_parametro:'Cod_Caja', valor_parametro: req.app.locals.caja[0].Cod_Caja},
                        {nom_parametro:'Cod_TipoComprobante', valor_parametro: input.Cod_TipoComprobante} 
                    ]
                    
                    EXEC_SQL('USP_CAJ_CAJAS_DOC_TXCodCajaComprobante', parametros, function (dataComprobante) {
                        if (dataComprobante.error) return res.json({ respuesta: 'error', detalle_error: dataComprobante.error })
                        if(dataComprobante.result.length>0){
                            data['dataComprobante'] = dataComprobante.result
                            parametros = [
                                {nom_parametro:'Cod_TipoComprobante', valor_parametro: input.Cod_TipoComprobante},
                                {nom_parametro:'Serie', valor_parametro: dataComprobante.result[0].Serie} 
                            ]
                            EXEC_SQL('USP_ALM_ALMACEN_MOV_TSiguienteNumero', parametros, function (dataMov) {
                                if (dataMov.error) return res.json({ respuesta: 'error', detalle_error: dataMov.error })
                                data['dataMov'] = dataMov.result
                                return res.json({ respuesta: 'ok', data })
                                
                            })
                        }else{
                            return res.json({ respuesta: 'error', detalle_error: 'no existen comprobantes configurados' })
                        }
                    })
                })
            })
        
        })
    }catch(e){
        res.json({ respuesta: 'error', detalle_error: e })
    }
})



module.exports = router;