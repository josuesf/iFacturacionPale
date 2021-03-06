 
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
        {nom_parametro:'Id_AlmacenMov', valor_parametro: input.Id_AlmacenMov?input.Id_AlmacenMov:-1,tipo_parametro:sql.Int, tipo:"output"},
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


router.post('/rechazar_mov_almacen', function (req, res){ 
    input = req.body
    arreglo = input.dataForm 
    parametros = [
        {nom_parametro:'Id_AlmacenMov', valor_parametro: input.Id_AlmacenMov?input.Id_AlmacenMov:-1,tipo_parametro:sql.Int, tipo:"output"},
        {nom_parametro:'Cod_Almacen', valor_parametro: input.Cod_Almacen},
        {nom_parametro:'Cod_TipoOperacion', valor_parametro: input.Cod_TipoOperacion},
        {nom_parametro:'Cod_Turno', valor_parametro: req.app.locals.turno[0].Cod_Turno},
        {nom_parametro:'Cod_TipoComprobante', valor_parametro: input.Cod_TipoComprobante},
        {nom_parametro:'Serie', valor_parametro: input.Serie,tipo_parametro:sql.VarChar,tipo:"output"},
        {nom_parametro:'Numero', valor_parametro: input.Numero,tipo_parametro:sql.VarChar,tipo:"output"},
        {nom_parametro:'Fecha', valor_parametro: input.Fecha},
        {nom_parametro:'Motivo', valor_parametro: input.Motivo},
        {nom_parametro:'Id_ComprobantePago', valor_parametro: input.Id_ComprobantePago,tipo_parametro:sql.Int},
        {nom_parametro:'Flag_Anulado', valor_parametro: input.Flag_Anulado},
        {nom_parametro:'Obs_AlmacenMov', valor_parametro: input.Obs_AlmacenMov},
        {nom_parametro:'Cod_Usuario',valor_parametro:req.session.username}
    ] 
    EXEC_SQL_OUTPUT('USP_ALM_ALMACEN_MOV_G', parametros , function (dataMov) {
        if (dataMov.error) return res.json({respuesta:"error",error:dataMov.error}) 
        
        parametrosR1 = [
            {nom_parametro:'Id_AlmacenMov', valor_parametro: dataMov.result['Id_AlmacenMov']},//dataMov.result[0].valor}, 
            {nom_parametro:'Cod_Usuario',valor_parametro:req.session.username}
        ] 
        EXEC_SQL_OUTPUT('USP_ALM_ALMACEN_MOV_EXTORNAR', parametrosR1 , function (dataMovE) {
            if (dataMovE.error) return res.json({respuesta:"error",error:dataMovE.error}) 

            parametrosR2 = [
                {nom_parametro:'Id_AlmacenMov', valor_parametro: input.Id_ComprobantePago}, 
                {nom_parametro:'Cod_Usuario',valor_parametro:req.session.username}
            ] 
            EXEC_SQL_OUTPUT('USP_ALM_ALMACEN_MOV_EXTORNAR', parametrosR2 , function (dataMovE) {
                if (dataMovE.error) return res.json({respuesta:"error",error:dataMovE.error}) 
                return res.json({respuesta:"ok",data:{}})
               
            }) 
           
        })  
    }) 
})

router.post('/guardar_mov_almacen_entrada', function (req, res){ 
    input = req.body
    arreglo = input.dataForm 
    parametros = [
        {nom_parametro:'Id_AlmacenMov', valor_parametro: input.Id_AlmacenMov?input.Id_AlmacenMov:-1,tipo_parametro:sql.Int, tipo:"output"},
        {nom_parametro:'Cod_Almacen', valor_parametro: input.Cod_Almacen},
        {nom_parametro:'Cod_TipoOperacion', valor_parametro: input.Cod_TipoOperacion},
        {nom_parametro:'Cod_Turno', valor_parametro: req.app.locals.turno[0].Cod_Turno},
        {nom_parametro:'Cod_TipoComprobante', valor_parametro: input.Cod_TipoComprobante},
        {nom_parametro:'Serie', valor_parametro: input.Serie,tipo_parametro:sql.VarChar,tipo:"output"},
        {nom_parametro:'Numero', valor_parametro: input.Numero,tipo_parametro:sql.VarChar, tipo:"output"},
        {nom_parametro:'Fecha', valor_parametro: input.Fecha},
        {nom_parametro:'Motivo', valor_parametro: input.Motivo},
        {nom_parametro:'Id_ComprobantePago', valor_parametro: input.Id_ComprobantePago,tipo_parametro:sql.Int},
        {nom_parametro:'Flag_Anulado', valor_parametro: input.Flag_Anulado},
        {nom_parametro:'Obs_AlmacenMov', valor_parametro: input.Obs_AlmacenMov},
        {nom_parametro:'Cod_Usuario',valor_parametro:req.session.username}
    ] 
    EXEC_SQL_OUTPUT('USP_ALM_ALMACEN_MOV_G', parametros , function (dataMov) {
        if (dataMov.error) return res.json({respuesta:"error",error:dataMov.error}) 
        if(arreglo.length>0){
            recorrerMovDetalles(arreglo,0,req,dataMov.result['Id_AlmacenMov'],function(mensaje,flag){
                if(flag){
                    return res.json({respuesta:"ok",data:{}})
                }else{
                    return res.json({respuesta:"error",detalle_error:mensaje})
                }
            })
        }else{
            return res.json({respuesta:"ok",data:{}})
        }
        
    }) 
})


router.post('/guardar_mov_almacen', function (req, res){ 
    input = req.body
    arreglo = input.dataForm 
    parametros = [
        {nom_parametro:'Id_AlmacenMov', valor_parametro: input.Id_AlmacenMov?input.Id_AlmacenMov:-1,tipo_parametro:sql.Int, tipo:"output"},
        {nom_parametro:'Cod_Almacen', valor_parametro: input.Cod_Almacen},
        {nom_parametro:'Cod_TipoOperacion', valor_parametro: input.Cod_TipoOperacion},
        {nom_parametro:'Cod_Turno', valor_parametro: req.app.locals.turno[0].Cod_Turno},
        {nom_parametro:'Cod_TipoComprobante', valor_parametro: input.Cod_TipoComprobante},
        {nom_parametro:'Serie', valor_parametro: input.Serie,tipo_parametro:sql.VarChar,tipo:"output"},
        {nom_parametro:'Numero', valor_parametro: input.Numero,tipo_parametro:sql.VarChar,tipo:"output"},
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
            var Id_AlmacenMov = dataMov.result['Id_AlmacenMov']//dataMov.result[0].valor  
            var contador = 1 
            //console.log(arreglo)
            for(var i=0;i<arreglo.length;i += 9){
                var Id_Producto = arreglo[i].value
                var Item = contador
                contador++
                var Des_Producto = arreglo[i+3].value
                var Precio_Unitario = arreglo[i+6].value
                var Cantidad = arreglo[i+4].value
                var Cod_UnidadMedida = arreglo[i+5].value
                var Obs_AlmacenMovD = arreglo[i+7].value
                var Series = JSON.parse(arreglo[i+8].value)
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
                    {nom_parametro:'Id_AlmacenMov', valor_parametro: 0,tipo_parametro:sql.Int, tipo:"output"},
                    {nom_parametro:'Cod_Almacen', valor_parametro: input.Cod_Destino},
                    {nom_parametro:'Cod_TipoOperacion', valor_parametro: "21"},
                    {nom_parametro:'Cod_Turno', valor_parametro: null},
                    {nom_parametro:'Cod_TipoComprobante', valor_parametro: "NE"},
                    {nom_parametro:'Serie', valor_parametro: "",tipo_parametro:sql.VarChar,tipo:"output"},
                    {nom_parametro:'Numero', valor_parametro:"",tipo_parametro:sql.VarChar,tipo:"output"},
                    {nom_parametro:'Fecha', valor_parametro: input.Fecha},
                    {nom_parametro:'Motivo', valor_parametro: input.Motivo},
                    {nom_parametro:'Id_ComprobantePago', valor_parametro: Id_AlmacenMov,tipo_parametro:sql.Int},
                    {nom_parametro:'Flag_Anulado', valor_parametro: input.Flag_Anulado},
                    {nom_parametro:'Obs_AlmacenMov', valor_parametro: input.Obs_AlmacenMov},
                    {nom_parametro:'Cod_Usuario',valor_parametro:req.session.username}
                ] 

                EXEC_SQL_OUTPUT('USP_ALM_ALMACEN_MOV_G', parametrosDestino , function (dataMov) {
                    if (dataMov.error) return res.json({respuesta:"error",error:dataMov.error}) 
                    var Id_AlmacenMov = dataMov.result['Id_AlmacenMov']//dataMov.result[0].valor  
                    var contador = 1 
                    for(var i=0;i<arreglo.length;i += 9){

                        var Id_Producto = arreglo[i].value
                        var Item = contador
                        contador++
                        var Des_Producto = arreglo[i+3].value
                        var Precio_Unitario = arreglo[i+6].value
                        var Cantidad = arreglo[i+4].value
                        var Cod_UnidadMedida = arreglo[i+5].value
                        var Obs_AlmacenMovD = arreglo[i+7].value
                        var Series = JSON.parse(arreglo[i+8].value)
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
                })
                return res.json({respuesta:"ok",data:{}}) 
            }else{
                return res.json({respuesta:"ok",data:{}}) 
            }
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


function recorrerMovDetalles(arreglo,indice,req,Id_AlmacenMov,callback){ 
    if(indice<arreglo.length){
        var Item = arreglo[indice+1].value
        var Obs_AlmacenMovD = arreglo[indice+7].value
        if(Item!=null && Item!=''){
            parametrosD = [
                {nom_parametro:'Id_AlmacenMov', valor_parametro: Id_AlmacenMov},
                {nom_parametro:'Item', valor_parametro: Item},
            ] 
            EXEC_SQL('USP_ALM_ALMACEN_MOV_D_TXPK', parametrosD , function (dataMovDet) {
                if (dataMovDet.error) callback(dataMovDet.error,false)
                parametrosR = [
                    { nom_parametro:'Id_AlmacenMov', valor_parametro: dataMovDet.result[0].Id_AlmacenMov},
                    { nom_parametro: 'Id_Producto', valor_parametro: dataMovDet.result[0].Id_Producto},
                    { nom_parametro: 'Item', valor_parametro: dataMovDet.result[0].Item},
                    { nom_parametro: 'Des_Producto', valor_parametro: dataMovDet.result[0].Des_Producto},
                    { nom_parametro: 'Precio_Unitario', valor_parametro:dataMovDet.result[0].Precio_Unitario},
                    { nom_parametro: 'Cantidad', valor_parametro:dataMovDet.result[0].Cantidad},
                    { nom_parametro: 'Cod_UnidadMedida', valor_parametro:dataMovDet.result[0].Cod_UnidadMedida},
                    { nom_parametro: 'Obs_AlmacenMovD', valor_parametro:Obs_AlmacenMovD},
                    { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username}
                ] 
                EXEC_SQL('USP_ALM_ALMACEN_MOV_D_G', parametrosR, function (dataAlmacen) {
                    if (dataAlmacen.error) callback(dataAlmacen.error,false)
                    recorrerMovDetalles(arreglo,indice+9,req,Id_AlmacenMov,callback)
                })
                
            })
        }else{
            recorrerMovDetalles(arreglo,indice+9,req,Id_AlmacenMov,callback)
        }
    }else{
        EXEC_SQL('USP_PRI_PRODUCTO_STOCK_ActualizarStockGeneral', [] , function (dataStock) {
            if (dataStock.error) callback(dataStock.error,false)
            callback('',true)
        })
    }
}


module.exports = router;