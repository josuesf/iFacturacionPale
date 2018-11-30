import { URL, URL_REPORT } from '../../../constantes_entorno/constantes'

var arrayValidacion = [null,'null','',undefined]
function ReporteGeneralEmail(idTab,Cod_Libro,TipoReporte,ParametroOrden,flag_preview,callback){
    var Cod_Sucursal = arrayValidacion.includes($("#Cod_Sucursal_"+idTab).val())?null:$("#Cod_Sucursal_"+idTab).val()
    var Id_Cliente = arrayValidacion.includes($("#Cliente_"+idTab).attr("data-id"))?0:parseInt($("#Cliente_"+idTab).attr("data-id"))
    var Cod_Caja = arrayValidacion.includes($("#Cod_Caja_"+idTab).val())?null:$("#Cod_Caja_"+idTab).val()
    var Id_producto = arrayValidacion.includes($("#Producto_"+idTab).attr("data-id"))?0:parseInt($("#Producto_"+idTab).attr("data-id"))
    var FechaInicio = arrayValidacion.includes($("#FechaInicio_"+idTab).val())?null:$("#FechaInicio_"+idTab).val()
    if(FechaInicio!=null){
        let arregloFechaInicio = FechaInicio.split('-')
        FechaInicio = arregloFechaInicio[2]+'/'+arregloFechaInicio[1]+'/'+arregloFechaInicio[0]
    }
    var FechaFin = arrayValidacion.includes($("#FechaFin_"+idTab).val())?null:$("#FechaFin_"+idTab).val()
    if(FechaFin!=null){
        let arregloFechaFin = FechaFin.split('-')
        FechaFin = arregloFechaFin[2]+'/'+arregloFechaFin[1]+'/'+arregloFechaFin[0]
    }
    var Cod_TurnoInicio = arrayValidacion.includes($("#DeTurno_"+idTab).val())?null:$("#DeTurno_"+idTab).val()
    var Cod_TurnoFinal =  arrayValidacion.includes($("#AlTurno_"+idTab).val())?null:$("#AlTurno_"+idTab).val()
    var Cod_Moneda = arrayValidacion.includes($("#Cod_Moneda_"+idTab).val())?null:$("#Cod_Moneda_"+idTab).val()
    var Cod_FormaPago = $('#Todos_'+idTab).is(':checked')?null:$("#Credito_"+idTab).is(':checked')?'999':$("#Contado_"+idTab).is(':checked')?$("#Cod_Forma_Pago_"+idTab).val():null
    var Cod_TipoComprobante = arrayValidacion.includes($("#Cod_Comprobante_"+idTab).val())?null:$("#Cod_Comprobante_"+idTab).val()
    var Serie = arrayValidacion.includes($("#Serie_"+idTab).val())?null:$("#Serie_"+idTab).val()
    var Cod_Licitacion = null
    var Cod_Categoria = arrayValidacion.includes($("#Cod_Categoria_"+idTab).val())?null:$("#Cod_Categoria_"+idTab).val()
    var Anulados = $("#Cod_Opcion_"+idTab).val()=="08"?'1':'0'
    
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Cod_Libro,
            Cod_Sucursal,
            Id_Cliente,
            Cod_Caja,
            Id_producto,
            FechaInicio,
            FechaFin,
            Cod_TurnoInicio,
            Cod_TurnoFinal,
            Cod_Moneda,
            Cod_FormaPago,
            Cod_TipoComprobante,
            Serie,
            Cod_Licitacion,
            Cod_Categoria,
            Anulados
        })
    }
    //console.log(parametros)
    fetch(URL + '/reporte_api/reporte_general', parametros)
        .then(req => req.json())
        .then(res => { 
            if(res.respuesta=='ok'){
                if(res.data.detalles.length>0){ 
                    jsreport.serverUrl = URL_REPORT;  
                    let Cod_Sucursal_Filtro = arrayValidacion.includes($("#Cod_Sucursal_"+idTab).val())?"Todos":$("#Cod_Sucursal_"+idTab+" option:selected").text()
                    let Id_Cliente_Filtro = arrayValidacion.includes($("#Cliente_"+idTab).attr("data-id"))?"Todos":$("#Cliente_"+idTab).val()
                    let Cod_Caja_Filtro = arrayValidacion.includes($("#Cod_Caja_"+idTab).val())?"Todos":$("#Cod_Caja_"+idTab+" option:selected").text()
                    let Id_producto_Filtro = arrayValidacion.includes($("#Producto_"+idTab).attr("data-id"))?"Todos":$("#Producto_"+idTab).val()
                    let FechaInicio_Filtro = arrayValidacion.includes($("#FechaInicio_"+idTab).val())?"Todos":$("#FechaInicio_"+idTab).val()
                    let FechaFin_Filtro = arrayValidacion.includes($("#FechaFin_"+idTab).val())?"Todos":$("#FechaFin_"+idTab).val()
                    let Cod_TurnoInicio_Filtro = arrayValidacion.includes($("#DeTurno_"+idTab).val())?"Todos":$("#DeTurno_"+idTab+" option:selected").text()
                    let Cod_TurnoFinal_Filtro =  arrayValidacion.includes($("#AlTurno_"+idTab).val())?"Todos":$("#AlTurno_"+idTab+" option:selected").text()
                    let Cod_Moneda_Filtro = arrayValidacion.includes($("#Cod_Moneda_"+idTab).val())?"Todos":$("#Cod_Moneda_"+idTab+" option:selected").text()
                    let Cod_FormaPago_Filtro = $('#Todos_'+idTab).is(':checked')?"Todos":$("#Credito_"+idTab).is(':checked')?'CREDITO':$("#Contado_"+idTab).is(':checked')?$("#Cod_Forma_Pago_"+idTab+" option:selected").text():null
                    let Cod_TipoComprobante_Filtro = arrayValidacion.includes($("#Cod_Comprobante_"+idTab).val())?"Todos":$("#Cod_Comprobante_"+idTab+" option:selected").text()
                    let Serie_Filtro = arrayValidacion.includes($("#Serie_"+idTab).val())?"Todos":$("#Serie_"+idTab).val() 
                    let Cod_Categoria_Filtro = arrayValidacion.includes($("#Cod_Categoria_"+idTab).val())?"Todos":$("#Cod_Categoria_"+idTab+" option:selected").text()

                    var request = {
                        data:{
                            'FLAG_PREVIEW':flag_preview,
                            'COD_LIBRO':Cod_Libro,
                            'COD_TIPO_DOCUMENTO':TipoReporte,
                            'FILTRO': `Sucursal: ${Cod_Sucursal_Filtro}; Cliente/Proveedor: ${Id_Cliente_Filtro}; Caja: ${Cod_Caja_Filtro}; Producto:${Id_producto_Filtro}; Fecha Inicio: ${FechaInicio_Filtro}; Fecha Fin: ${FechaFin_Filtro}; Turno Inicio: ${Cod_TurnoInicio_Filtro}; Turno Fin: ${Cod_TurnoFinal_Filtro}; Moneda: ${Cod_Moneda_Filtro}; Forma de Pago: ${Cod_FormaPago_Filtro}; Comprobante: ${Cod_TipoComprobante_Filtro}; Serie: ${Serie_Filtro}; Categoria: ${Cod_Categoria_Filtro}`,
                            DETALLES:res.data.detalles.sort(function (a, b) {
                                if(ParametroOrden){
                                    var detA = a[ParametroOrden] 
                                    var detB = b[ParametroOrden] 
                                    if (detA < detB) {
                                        return -1;
                                    }
                                    if (detA > detB) {
                                        return 1;
                                    } 
                                    return 0;
                                }else{
                                    return 0;
                                }
                            })
                        }
                    }; 
                    jsreport.renderAsync(request).then(function(res) {
                        let TR = TipoReporte.split('_')[TipoReporte.split('_').length-1]  
                        if(TR=='Excel')
                            global.variablesReporteComprobante[idTab].dataBase64.push({filename: TipoReporte+'.xlsx',content:res.toDataURI().replace("data:null;base64, ",""),encoding: 'base64',tipo:TR})                          
                        else
                            global.variablesReporteComprobante[idTab].dataBase64.push({filename: TipoReporte+'.pdf',content:res.toDataURI().replace("data:null;base64, ",""),encoding: 'base64',tipo:TR})                          
                        callback(true,"ok")
                    }).catch(function (e) {
                        console.log(e) 
                        callback(false,e)
                    });
                }else{
                    callback(true,"no existe datos para el reporte")
                }
            }else{
                callback(false,'Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+res.detalle_error)
            } 
        }).catch(function (e) {
            console.log(e);
            callback(false,'Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e)
        });
}

function ReporteAuxiliarEmail(idTab,Cod_Libro,TipoReporte,ParametroOrden,flag_preview,callback){
   var Cod_Sucursal = arrayValidacion.includes($("#Cod_Sucursal_"+idTab).val())?null:$("#Cod_Sucursal_"+idTab).val()
   var Id_Cliente = arrayValidacion.includes($("#Cliente_"+idTab).attr("data-id"))?0:parseInt($("#Cliente_"+idTab).attr("data-id"))
   var Cod_Caja = arrayValidacion.includes($("#Cod_Caja_"+idTab).val())?null:$("#Cod_Caja_"+idTab).val() 
   var FechaInicio = arrayValidacion.includes($("#FechaInicio_"+idTab).val())?null:$("#FechaInicio_"+idTab).val()
   if(FechaInicio!=null){
       let arregloFechaInicio = FechaInicio.split('-')
       FechaInicio = arregloFechaInicio[2]+'/'+arregloFechaInicio[1]+'/'+arregloFechaInicio[0]
   }
   var FechaFin = arrayValidacion.includes($("#FechaFin_"+idTab).val())?null:$("#FechaFin_"+idTab).val()
   if(FechaFin!=null){
       let arregloFechaFin = FechaFin.split('-')
       FechaFin = arregloFechaFin[2]+'/'+arregloFechaFin[1]+'/'+arregloFechaFin[0]
   }
   var Cod_TurnoInicio = arrayValidacion.includes($("#DeTurno_"+idTab).val())?null:$("#DeTurno_"+idTab).val()
   var Cod_TurnoFinal =  arrayValidacion.includes($("#AlTurno_"+idTab).val())?null:$("#AlTurno_"+idTab).val()
   var Cod_Moneda = arrayValidacion.includes($("#Cod_Moneda_"+idTab).val())?null:$("#Cod_Moneda_"+idTab).val()
   var Cod_FormaPago = $('#Todos_'+idTab).is(':checked')?null:$("#Credito_"+idTab).is(':checked')?'999':$("#Contado_"+idTab).is(':checked')?$("#Cod_Forma_Pago_"+idTab).val():null
   var Cod_TipoComprobante = arrayValidacion.includes($("#Cod_Comprobante_"+idTab).val())?null:$("#Cod_Comprobante_"+idTab).val()
   var Serie = arrayValidacion.includes($("#Serie_"+idTab).val())?null:$("#Serie_"+idTab).val()
   
   const parametros = {
       method: 'POST',
       headers: {
           Accept: 'application/json',
           'Content-Type': 'application/json',
       },
       body: JSON.stringify({
           Cod_Libro,
           Cod_Sucursal,
           Id_Cliente,
           Cod_Caja, 
           FechaInicio,
           FechaFin,
           Cod_TurnoInicio,
           Cod_TurnoFinal,
           Cod_Moneda,
           Cod_FormaPago,
           Cod_TipoComprobante,
           Serie
       })
   } 
   fetch(URL + '/reporte_api/reporte_auxiliar', parametros)
       .then(req => req.json())
       .then(res => { 
           if(res.respuesta=='ok'){
               if(res.data.detalles.length>0){ 
                   jsreport.serverUrl = URL_REPORT;  
                   let Cod_Sucursal_Filtro = arrayValidacion.includes($("#Cod_Sucursal_"+idTab).val())?"Todos":$("#Cod_Sucursal_"+idTab+" option:selected").text()
                   let Id_Cliente_Filtro = arrayValidacion.includes($("#Cliente_"+idTab).attr("data-id"))?"Todos":$("#Cliente_"+idTab).val()
                   let Cod_Caja_Filtro = arrayValidacion.includes($("#Cod_Caja_"+idTab).val())?"Todos":$("#Cod_Caja_"+idTab+" option:selected").text()
                   let FechaInicio_Filtro = arrayValidacion.includes($("#FechaInicio_"+idTab).val())?"Todos":$("#FechaInicio_"+idTab).val()
                   let FechaFin_Filtro = arrayValidacion.includes($("#FechaFin_"+idTab).val())?"Todos":$("#FechaFin_"+idTab).val()
                   let Cod_TurnoInicio_Filtro = arrayValidacion.includes($("#DeTurno_"+idTab).val())?"Todos":$("#DeTurno_"+idTab+" option:selected").text()
                   let Cod_TurnoFinal_Filtro =  arrayValidacion.includes($("#AlTurno_"+idTab).val())?"Todos":$("#AlTurno_"+idTab+" option:selected").text()
                   let Cod_Moneda_Filtro = arrayValidacion.includes($("#Cod_Moneda_"+idTab).val())?"Todos":$("#Cod_Moneda_"+idTab+" option:selected").text()
                   let Cod_FormaPago_Filtro = $('#Todos_'+idTab).is(':checked')?"Todos":$("#Credito_"+idTab).is(':checked')?'CREDITO':$("#Contado_"+idTab).is(':checked')?$("#Cod_Forma_Pago_"+idTab+" option:selected").text():null
                   let Cod_TipoComprobante_Filtro = arrayValidacion.includes($("#Cod_Comprobante_"+idTab).val())?"Todos":$("#Cod_Comprobante_"+idTab+" option:selected").text()
                   let Serie_Filtro = arrayValidacion.includes($("#Serie_"+idTab).val())?"Todos":$("#Serie_"+idTab).val() 
                   let Cod_Categoria_Filtro = arrayValidacion.includes($("#Cod_Categoria_"+idTab).val())?"Todos":$("#Cod_Categoria_"+idTab+" option:selected").text()

                   var request = {
                       data:{
                           'FLAG_PREVIEW':flag_preview,
                           'COD_LIBRO':Cod_Libro,
                           'COD_TIPO_DOCUMENTO':TipoReporte,
                           'FILTRO': `Sucursal: ${Cod_Sucursal_Filtro}; Cliente/Proveedor: ${Id_Cliente_Filtro}; Caja: ${Cod_Caja_Filtro}; Fecha Inicio: ${FechaInicio_Filtro}; Fecha Fin: ${FechaFin_Filtro}; Turno Inicio: ${Cod_TurnoInicio_Filtro}; Turno Fin: ${Cod_TurnoFinal_Filtro}; Moneda: ${Cod_Moneda_Filtro}; Forma de Pago: ${Cod_FormaPago_Filtro}; Comprobante: ${Cod_TipoComprobante_Filtro}; Serie: ${Serie_Filtro}; Categoria: ${Cod_Categoria_Filtro}`,
                           DETALLES:res.data.detalles.sort(function (a, b) {
                               if(ParametroOrden){
                                   var detA = a[ParametroOrden] 
                                   var detB = b[ParametroOrden] 
                                   if (detA < detB) {
                                       return -1;
                                   }
                                   if (detA > detB) {
                                       return 1;
                                   } 
                                   return 0;
                               }else{
                                   return 0;
                               }
                           })
                       }
                   }; 
                   jsreport.renderAsync(request).then(function(res) {  
                        let TR = TipoReporte.split('_')[TipoReporte.split('_').length-1]  
                        if(TR=='Excel')
                            global.variablesReporteComprobante[idTab].dataBase64.push({filename: TipoReporte+'.xlsx',content:res.toDataURI().replace("data:null;base64, ",""),encoding: 'base64',tipo:TR})                          
                        else
                            global.variablesReporteComprobante[idTab].dataBase64.push({filename: TipoReporte+'.pdf',content:res.toDataURI().replace("data:null;base64, ",""),encoding: 'base64',tipo:TR})
                    callback(true,"ok")
                   }).catch(function (e) { 
                       console.log(e)
                       callback(false,e)
                   });
               }else{
                    callback(true,"No existen datos para mostrar")
               }
           }else{
                callback(false,"Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : "+res.detalle_error)
           } 
       }).catch(function (e) {
            console.log(e);
            callback(false,'Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e)
       });
}

function ReporteAuxiliarDetalladoEmail(idTab,Cod_Libro,TipoReporte,ParametroOrden,flag_preview,callback){  
   var Cod_Sucursal = arrayValidacion.includes($("#Cod_Sucursal_"+idTab).val())?null:$("#Cod_Sucursal_"+idTab).val()
   var Id_Cliente = arrayValidacion.includes($("#Cliente_"+idTab).attr("data-id"))?0:parseInt($("#Cliente_"+idTab).attr("data-id"))
   var Cod_Caja = arrayValidacion.includes($("#Cod_Caja_"+idTab).val())?null:$("#Cod_Caja_"+idTab).val() 
   var FechaInicio = arrayValidacion.includes($("#FechaInicio_"+idTab).val())?null:$("#FechaInicio_"+idTab).val()
   if(FechaInicio!=null){
       let arregloFechaInicio = FechaInicio.split('-')
       FechaInicio = arregloFechaInicio[2]+'/'+arregloFechaInicio[1]+'/'+arregloFechaInicio[0]
   }
   var FechaFin = arrayValidacion.includes($("#FechaFin_"+idTab).val())?null:$("#FechaFin_"+idTab).val()
   if(FechaFin!=null){
       let arregloFechaFin = FechaFin.split('-')
       FechaFin = arregloFechaFin[2]+'/'+arregloFechaFin[1]+'/'+arregloFechaFin[0]
   }
   var Cod_TurnoInicio = arrayValidacion.includes($("#DeTurno_"+idTab).val())?null:$("#DeTurno_"+idTab).val()
   var Cod_TurnoFinal =  arrayValidacion.includes($("#AlTurno_"+idTab).val())?null:$("#AlTurno_"+idTab).val()
   var Cod_Moneda = arrayValidacion.includes($("#Cod_Moneda_"+idTab).val())?null:$("#Cod_Moneda_"+idTab).val()
   var Cod_FormaPago = $('#Todos_'+idTab).is(':checked')?null:$("#Credito_"+idTab).is(':checked')?'999':$("#Contado_"+idTab).is(':checked')?$("#Cod_Forma_Pago_"+idTab).val():null
   var Cod_TipoComprobante = arrayValidacion.includes($("#Cod_Comprobante_"+idTab).val())?null:$("#Cod_Comprobante_"+idTab).val()
   var Serie = arrayValidacion.includes($("#Serie_"+idTab).val())?null:$("#Serie_"+idTab).val()
   var Id_producto = arrayValidacion.includes($("#Producto_"+idTab).attr("data-id"))?0:parseInt($("#Producto_"+idTab).attr("data-id"))
   
   const parametros = {
       method: 'POST',
       headers: {
           Accept: 'application/json',
           'Content-Type': 'application/json',
       },
       body: JSON.stringify({
           Cod_Libro,
           Cod_Sucursal,
           Id_Cliente,
           Cod_Caja, 
           FechaInicio,
           FechaFin,
           Cod_TurnoInicio,
           Cod_TurnoFinal,
           Cod_Moneda,
           Cod_FormaPago,
           Cod_TipoComprobante,
           Serie,
           Id_producto
       })
   }
   //console.log(parametros)
   fetch(URL + '/reporte_api/reporte_auxiliar_detallado', parametros)
       .then(req => req.json())
       .then(res => { 
           if(res.respuesta=='ok'){
               if(res.data.detalles.length>0){ 
                   jsreport.serverUrl = URL_REPORT;  
                   let Cod_Sucursal_Filtro = arrayValidacion.includes($("#Cod_Sucursal_"+idTab).val())?"Todos":$("#Cod_Sucursal_"+idTab+" option:selected").text()
                   let Id_Cliente_Filtro = arrayValidacion.includes($("#Cliente_"+idTab).attr("data-id"))?"Todos":$("#Cliente_"+idTab).val()
                   let Cod_Caja_Filtro = arrayValidacion.includes($("#Cod_Caja_"+idTab).val())?"Todos":$("#Cod_Caja_"+idTab+" option:selected").text()
                   let FechaInicio_Filtro = arrayValidacion.includes($("#FechaInicio_"+idTab).val())?"Todos":$("#FechaInicio_"+idTab).val()
                   let FechaFin_Filtro = arrayValidacion.includes($("#FechaFin_"+idTab).val())?"Todos":$("#FechaFin_"+idTab).val()
                   let Cod_TurnoInicio_Filtro = arrayValidacion.includes($("#DeTurno_"+idTab).val())?"Todos":$("#DeTurno_"+idTab+" option:selected").text()
                   let Cod_TurnoFinal_Filtro =  arrayValidacion.includes($("#AlTurno_"+idTab).val())?"Todos":$("#AlTurno_"+idTab+" option:selected").text()
                   let Cod_Moneda_Filtro = arrayValidacion.includes($("#Cod_Moneda_"+idTab).val())?"Todos":$("#Cod_Moneda_"+idTab+" option:selected").text()
                   let Cod_FormaPago_Filtro = $('#Todos_'+idTab).is(':checked')?"Todos":$("#Credito_"+idTab).is(':checked')?'CREDITO':$("#Contado_"+idTab).is(':checked')?$("#Cod_Forma_Pago_"+idTab+" option:selected").text():null
                   let Cod_TipoComprobante_Filtro = arrayValidacion.includes($("#Cod_Comprobante_"+idTab).val())?"Todos":$("#Cod_Comprobante_"+idTab+" option:selected").text()
                   let Serie_Filtro = arrayValidacion.includes($("#Serie_"+idTab).val())?"Todos":$("#Serie_"+idTab).val() 
                   let Cod_Categoria_Filtro = arrayValidacion.includes($("#Cod_Categoria_"+idTab).val())?"Todos":$("#Cod_Categoria_"+idTab+" option:selected").text()
                   let Id_producto_Filtro = arrayValidacion.includes($("#Producto_"+idTab).attr("data-id"))?"Todos":$("#Producto_"+idTab).val()

                   var request = {
                       data:{
                           'FLAG_PREVIEW':flag_preview,
                           'COD_LIBRO':Cod_Libro,
                           'COD_TIPO_DOCUMENTO':TipoReporte,
                           'FILTRO': `Sucursal: ${Cod_Sucursal_Filtro}; Cliente/Proveedor: ${Id_Cliente_Filtro}; Caja: ${Cod_Caja_Filtro}; Producto:${Id_producto_Filtro}; Fecha Inicio: ${FechaInicio_Filtro}; Fecha Fin: ${FechaFin_Filtro}; Turno Inicio: ${Cod_TurnoInicio_Filtro}; Turno Fin: ${Cod_TurnoFinal_Filtro}; Moneda: ${Cod_Moneda_Filtro}; Forma de Pago: ${Cod_FormaPago_Filtro}; Comprobante: ${Cod_TipoComprobante_Filtro}; Serie: ${Serie_Filtro}; Categoria: ${Cod_Categoria_Filtro}`,
                           DETALLES:res.data.detalles.sort(function (a, b) {
                               if(ParametroOrden){
                                   var detA = a[ParametroOrden] 
                                   var detB = b[ParametroOrden] 
                                   if (detA < detB) {
                                       return -1;
                                   }
                                   if (detA > detB) {
                                       return 1;
                                   } 
                                   return 0;
                               }else{
                                   return 0;
                               }
                           })
                       }
                   }; 
                   jsreport.renderAsync(request).then(function(res) {  
                        let TR = TipoReporte.split('_')[TipoReporte.split('_').length-1]  
                        if(TR=='Excel')
                            global.variablesReporteComprobante[idTab].dataBase64.push({filename: TipoReporte+'.xlsx',content:res.toDataURI().replace("data:null;base64, ",""),encoding: 'base64',tipo:TR})                          
                        else
                            global.variablesReporteComprobante[idTab].dataBase64.push({filename: TipoReporte+'.pdf',content:res.toDataURI().replace("data:null;base64, ",""),encoding: 'base64',tipo:TR})
                        callback(true,"ok")
                   }).catch(function (e) { 
                        callback(true,e)
                   });
               }else{
                    callback(true,"No existen datos para mostrar")
               }
           }else{
                callback(true,'Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+res.detalle_error)
           } 
       }).catch(function (e) {
            console.log(e);
            callback(true,'Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e)
       });
}

function ReporteAuxiliarDetalladoFormaPagoEmail(idTab,Cod_Libro,TipoReporte,ParametroOrden,flag_preview,callback){
   var Cod_Sucursal = arrayValidacion.includes($("#Cod_Sucursal_"+idTab).val())?null:$("#Cod_Sucursal_"+idTab).val()
   var Id_Cliente = arrayValidacion.includes($("#Cliente_"+idTab).attr("data-id"))?0:parseInt($("#Cliente_"+idTab).attr("data-id"))
   var Cod_Caja = arrayValidacion.includes($("#Cod_Caja_"+idTab).val())?null:$("#Cod_Caja_"+idTab).val()
   var Id_producto = arrayValidacion.includes($("#Producto_"+idTab).attr("data-id"))?0:parseInt($("#Producto_"+idTab).attr("data-id"))
   var FechaInicio = arrayValidacion.includes($("#FechaInicio_"+idTab).val())?null:$("#FechaInicio_"+idTab).val()
   if(FechaInicio!=null){
       let arregloFechaInicio = FechaInicio.split('-')
       FechaInicio = arregloFechaInicio[2]+'/'+arregloFechaInicio[1]+'/'+arregloFechaInicio[0]
   }
   var FechaFin = arrayValidacion.includes($("#FechaFin_"+idTab).val())?null:$("#FechaFin_"+idTab).val()
   if(FechaFin!=null){
       let arregloFechaFin = FechaFin.split('-')
       FechaFin = arregloFechaFin[2]+'/'+arregloFechaFin[1]+'/'+arregloFechaFin[0]
   }
   var Cod_TurnoInicio = arrayValidacion.includes($("#DeTurno_"+idTab).val())?null:$("#DeTurno_"+idTab).val()
   var Cod_TurnoFinal =  arrayValidacion.includes($("#AlTurno_"+idTab).val())?null:$("#AlTurno_"+idTab).val()
   var Cod_Moneda = arrayValidacion.includes($("#Cod_Moneda_"+idTab).val())?null:$("#Cod_Moneda_"+idTab).val()
   var Cod_FormaPago = $('#Todos_'+idTab).is(':checked')?null:$("#Credito_"+idTab).is(':checked')?'999':$("#Contado_"+idTab).is(':checked')?$("#Cod_Forma_Pago_"+idTab).val():null
   var Cod_TipoComprobante = arrayValidacion.includes($("#Cod_Comprobante_"+idTab).val())?null:$("#Cod_Comprobante_"+idTab).val()
   var Serie = arrayValidacion.includes($("#Serie_"+idTab).val())?null:$("#Serie_"+idTab).val()
   var Cod_Licitacion = null
   var Cod_Categoria = arrayValidacion.includes($("#Cod_Categoria_"+idTab).val())?null:$("#Cod_Categoria_"+idTab).val()
   var Anulados = $("#Cod_Opcion_"+idTab).val()=="08"?'1':'0'
   
   const parametros = {
       method: 'POST',
       headers: {
           Accept: 'application/json',
           'Content-Type': 'application/json',
       },
       body: JSON.stringify({
           Cod_Libro,
           Cod_Sucursal,
           Id_Cliente,
           Cod_Caja,
           Id_producto,
           FechaInicio,
           FechaFin,
           Cod_TurnoInicio,
           Cod_TurnoFinal,
           Cod_Moneda,
           Cod_FormaPago,
           Cod_TipoComprobante,
           Serie,
           Cod_Licitacion,
           Cod_Categoria,
           Anulados
       })
   }
   //console.log(parametros)
   fetch(URL + '/reporte_api/reporte_general', parametros)
       .then(req => req.json())
       .then(res => { 
           if(res.respuesta=='ok'){
               if(res.data.detalles.length>0){ 
                   jsreport.serverUrl = URL_REPORT;  
                   let Cod_Sucursal_Filtro = arrayValidacion.includes($("#Cod_Sucursal_"+idTab).val())?"Todos":$("#Cod_Sucursal_"+idTab+" option:selected").text()
                   let Id_Cliente_Filtro = arrayValidacion.includes($("#Cliente_"+idTab).attr("data-id"))?"Todos":$("#Cliente_"+idTab).val()
                   let Cod_Caja_Filtro = arrayValidacion.includes($("#Cod_Caja_"+idTab).val())?"Todos":$("#Cod_Caja_"+idTab+" option:selected").text()
                   let Id_producto_Filtro = arrayValidacion.includes($("#Producto_"+idTab).attr("data-id"))?"Todos":$("#Producto_"+idTab).val()
                   let FechaInicio_Filtro = arrayValidacion.includes($("#FechaInicio_"+idTab).val())?"Todos":$("#FechaInicio_"+idTab).val()
                   let FechaFin_Filtro = arrayValidacion.includes($("#FechaFin_"+idTab).val())?"Todos":$("#FechaFin_"+idTab).val()
                   let Cod_TurnoInicio_Filtro = arrayValidacion.includes($("#DeTurno_"+idTab).val())?"Todos":$("#DeTurno_"+idTab+" option:selected").text()
                   let Cod_TurnoFinal_Filtro =  arrayValidacion.includes($("#AlTurno_"+idTab).val())?"Todos":$("#AlTurno_"+idTab+" option:selected").text()
                   let Cod_Moneda_Filtro = arrayValidacion.includes($("#Cod_Moneda_"+idTab).val())?"Todos":$("#Cod_Moneda_"+idTab+" option:selected").text()
                   let Cod_FormaPago_Filtro = $('#Todos_'+idTab).is(':checked')?"Todos":$("#Credito_"+idTab).is(':checked')?'CREDITO':$("#Contado_"+idTab).is(':checked')?$("#Cod_Forma_Pago_"+idTab+" option:selected").text():null
                   let Cod_TipoComprobante_Filtro = arrayValidacion.includes($("#Cod_Comprobante_"+idTab).val())?"Todos":$("#Cod_Comprobante_"+idTab+" option:selected").text()
                   let Serie_Filtro = arrayValidacion.includes($("#Serie_"+idTab).val())?"Todos":$("#Serie_"+idTab).val() 
                   let Cod_Categoria_Filtro = arrayValidacion.includes($("#Cod_Categoria_"+idTab).val())?"Todos":$("#Cod_Categoria_"+idTab+" option:selected").text()

                   var request = {
                       data:{
                           'FLAG_PREVIEW':flag_preview,
                           'COD_LIBRO':Cod_Libro,
                           'COD_TIPO_DOCUMENTO':TipoReporte,
                           'FILTRO': `Sucursal: ${Cod_Sucursal_Filtro}; Cliente/Proveedor: ${Id_Cliente_Filtro}; Caja: ${Cod_Caja_Filtro}; Producto:${Id_producto_Filtro}; Fecha Inicio: ${FechaInicio_Filtro}; Fecha Fin: ${FechaFin_Filtro}; Turno Inicio: ${Cod_TurnoInicio_Filtro}; Turno Fin: ${Cod_TurnoFinal_Filtro}; Moneda: ${Cod_Moneda_Filtro}; Forma de Pago: ${Cod_FormaPago_Filtro}; Comprobante: ${Cod_TipoComprobante_Filtro}; Serie: ${Serie_Filtro}; Categoria: ${Cod_Categoria_Filtro}`,
                           DETALLES:res.data.detalles.sort(function (a, b) {
                               if(ParametroOrden){
                                   var detA = a[ParametroOrden] 
                                   var detB = b[ParametroOrden] 
                                   if (detA < detB) {
                                       return -1;
                                   }
                                   if (detA > detB) {
                                       return 1;
                                   } 
                                   return 0;
                               }else{
                                   return 0;
                               }
                           })
                       }
                   }; 
                   jsreport.renderAsync(request).then(function(res) {  
                        let TR = TipoReporte.split('_')[TipoReporte.split('_').length-1]  
                        if(TR=='Excel')
                            global.variablesReporteComprobante[idTab].dataBase64.push({filename: TipoReporte+'.xlsx',content:res.toDataURI().replace("data:null;base64, ",""),encoding: 'base64',tipo:TR})                          
                        else
                            global.variablesReporteComprobante[idTab].dataBase64.push({filename: TipoReporte+'.pdf',content:res.toDataURI().replace("data:null;base64, ",""),encoding: 'base64',tipo:TR})
                        callback(true,"ok")
                   }).catch(function (e) { 
                       console.log(e)
                       callback(false,e)
                   });
               }else{
                    callback(true,"No existen datos para mostrar")
               }
           }else{
                callback(false,'Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+res.detalle_error)
           } 
       }).catch(function (e) {
            console.log(e);
            callback(false,'Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e)
       });
}

export { ReporteGeneralEmail, ReporteAuxiliarEmail, ReporteAuxiliarDetalladoEmail, ReporteAuxiliarDetalladoFormaPagoEmail }