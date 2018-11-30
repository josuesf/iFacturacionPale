import { URL, URL_REPORT } from '../../../../constantes_entorno/constantes'
var arrayValidacion = [null,'null','',undefined]

function ReporteGeneralEmail(idTab,TipoReporte,ParametroOrden,flag_preview,Tipo,callback){
 
    var Flag_Contable = ($('input[name=rbOpciones_'+idTab+']:checked').val()=="Contable_"+idTab)?'1':'0'
    var Id_ClienteProveedor = arrayValidacion.includes($("#Cliente_"+idTab).attr("data-id"))?0:parseInt($("#Cliente_"+idTab).attr("data-id"))
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
    var Cod_Periodo = arrayValidacion.includes($("#DePeriodo_"+idTab).val())?null:$("#DePeriodo_"+idTab).val() 
    var Cod_Almacen = arrayValidacion.includes($("#Cod_Almacen_"+idTab).val())?null:$("#Cod_Almacen_"+idTab).val()
    var Cod_Categoria = arrayValidacion.includes($("#Cod_Categoria_"+idTab).val())?null:$("#Cod_Categoria_"+idTab).val()
    
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            Flag_Contable,
            FechaInicio,
            FechaFin,
            Cod_Periodo,
            Id_ClienteProveedor,
            Cod_Categoria,
            Id_producto,
            Cod_Almacen
        })
    }
    //console.log(parametros)
    fetch(URL + '/reporte_api/reporte_general_kardex', parametros)
        .then(req => req.json())
        .then(res => { 
            if(res.respuesta=='ok'){
                if(res.data.detalles.length>0){ 
                    jsreport.serverUrl = URL_REPORT;  
                    let Cod_Almacen_Filtro = arrayValidacion.includes($("#Cod_Almacen_"+idTab).val())?"Todos":$("#Cod_Almacen_"+idTab+" option:selected").text()
                    let Id_Cliente_Filtro = arrayValidacion.includes($("#Cliente_"+idTab).attr("data-id"))?"Todos":$("#Cliente_"+idTab).val()
                    let Id_producto_Filtro = arrayValidacion.includes($("#Producto_"+idTab).attr("data-id"))?"Todos":$("#Producto_"+idTab).val()
                    let FechaInicio_Filtro = arrayValidacion.includes($("#FechaInicio_"+idTab).val())?"Todos":$("#FechaInicio_"+idTab).val()
                    let FechaFin_Filtro = arrayValidacion.includes($("#FechaFin_"+idTab).val())?"Todos":$("#FechaFin_"+idTab).val()
                    let Cod_Periodo_Filtro = arrayValidacion.includes($("#DePeriodo_"+idTab).val())?"Todos":$("#DePeriodo_"+idTab+" option:selected").text()
                    let Cod_Categoria_Filtro = arrayValidacion.includes($("#Cod_Categoria_"+idTab).val())?"Todos":$("#Cod_Categoria_"+idTab+" option:selected").text()

                    var request = {
                        data:{
                            'FLAG_PREVIEW':flag_preview,
                            'COD_TIPO_DOCUMENTO':TipoReporte,
                            'FILTRO': `Almacen: ${Cod_Almacen_Filtro}; Cliente/Proveedor: ${Id_Cliente_Filtro};Producto:${Id_producto_Filtro}; Fecha Inicio: ${FechaInicio_Filtro}; Fecha Fin: ${FechaFin_Filtro}; Periodo: ${Cod_Periodo_Filtro}; Categoria: ${Cod_Categoria_Filtro}`,
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
                            global.variablesReporteKardex[idTab].dataBase64.push({filename: TipoReporte+'.xlsx',content:res.toDataURI().replace("data:null;base64, ",""),encoding: 'base64',tipo:TR})                          
                        else
                            global.variablesReporteKardex[idTab].dataBase64.push({filename: TipoReporte+'.pdf',content:res.toDataURI().replace("data:null;base64, ",""),encoding: 'base64',tipo:TR})                          
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
 
function ReporteDetalladoEmail(idTab,TipoReporte,ParametroOrden,flag_preview,Tipo,callback){
    
    var Flag_Contable = ($('input[name=rbOpciones_'+idTab+']:checked').val()=="Contable_"+idTab)?'1':'0'
    var Id_ClienteProveedor = arrayValidacion.includes($("#Cliente_"+idTab).attr("data-id"))?0:parseInt($("#Cliente_"+idTab).attr("data-id"))
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
    var Cod_Periodo = arrayValidacion.includes($("#DePeriodo_"+idTab).val())?null:$("#DePeriodo_"+idTab).val() 
    var Cod_Almacen = arrayValidacion.includes($("#Cod_Almacen_"+idTab).val())?null:$("#Cod_Almacen_"+idTab).val()
    var Cod_Categoria = arrayValidacion.includes($("#Cod_Categoria_"+idTab).val())?null:$("#Cod_Categoria_"+idTab).val()
    
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            Flag_Contable,
            FechaInicio,
            FechaFin,
            Cod_Periodo,
            Id_ClienteProveedor,
            Cod_Categoria,
            Id_producto,
            Cod_Almacen
        })
    }
    //console.log(parametros)
    fetch(URL + '/reporte_api/reporte_general_kardex_detallado', parametros)
        .then(req => req.json())
        .then(res => { 
            if(res.respuesta=='ok'){
                if(res.data.detalles.length>0){ 
                    jsreport.serverUrl = URL_REPORT;  
                    let Cod_Almacen_Filtro = arrayValidacion.includes($("#Cod_Almacen_"+idTab).val())?"Todos":$("#Cod_Almacen_"+idTab+" option:selected").text()
                    let Id_Cliente_Filtro = arrayValidacion.includes($("#Cliente_"+idTab).attr("data-id"))?"Todos":$("#Cliente_"+idTab).val()
                    let Id_producto_Filtro = arrayValidacion.includes($("#Producto_"+idTab).attr("data-id"))?"Todos":$("#Producto_"+idTab).val()
                    let FechaInicio_Filtro = arrayValidacion.includes($("#FechaInicio_"+idTab).val())?"Todos":$("#FechaInicio_"+idTab).val()
                    let FechaFin_Filtro = arrayValidacion.includes($("#FechaFin_"+idTab).val())?"Todos":$("#FechaFin_"+idTab).val()
                    let Cod_Periodo_Filtro = arrayValidacion.includes($("#DePeriodo_"+idTab).val())?"Todos":$("#DePeriodo_"+idTab+" option:selected").text()
                    let Cod_Categoria_Filtro = arrayValidacion.includes($("#Cod_Categoria_"+idTab).val())?"Todos":$("#Cod_Categoria_"+idTab+" option:selected").text()

                    var request = {
                        data:{
                            'FLAG_PREVIEW':flag_preview,
                            'COD_TIPO_DOCUMENTO':TipoReporte,
                            'FILTRO': `Almacen: ${Cod_Almacen_Filtro}; Cliente/Proveedor: ${Id_Cliente_Filtro};Producto:${Id_producto_Filtro}; Fecha Inicio: ${FechaInicio_Filtro}; Fecha Fin: ${FechaFin_Filtro}; Periodo: ${Cod_Periodo_Filtro}; Categoria: ${Cod_Categoria_Filtro}`,
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
                            global.variablesReporteKardex[idTab].dataBase64.push({filename: TipoReporte+'.xlsx',content:res.toDataURI().replace("data:null;base64, ",""),encoding: 'base64',tipo:TR})                          
                        else
                            global.variablesReporteKardex[idTab].dataBase64.push({filename: TipoReporte+'.pdf',content:res.toDataURI().replace("data:null;base64, ",""),encoding: 'base64',tipo:TR})                          
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

export { ReporteGeneralEmail,ReporteDetalladoEmail }