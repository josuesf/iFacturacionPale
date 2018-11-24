import { URL, URL_REPORT } from '../../../../constantes_entorno/constantes'
var arrayValidacion = [null,'null','',undefined]

function ReporteGeneralEmail(idTab,Cod_TipoComprobante,TipoReporte,ParametroOrden,flag_preview,Tipo,callback){
   
    var Cod_Almacen = arrayValidacion.includes($("#Cod_Almacen_"+idTab).val())?null:$("#Cod_Almacen_"+idTab).val() 
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
    var Cod_TipoOperacion = arrayValidacion.includes($("#Cod_TipoOperacion_"+idTab).val())?null:$("#Cod_TipoOperacion_"+idTab).val()
    var Cod_Turno = arrayValidacion.includes($("#Turno_"+idTab).val())?null:$("#Turno_"+idTab).val()
    var Serie = arrayValidacion.includes($("#Serie_"+idTab).val())?null:$("#Serie_"+idTab).val()
    var Flag_SoloConRef = $('#chbReferencia_'+idTab).is(':checked')?'1':'0'
    var Flag_Anulado = $('#chbAnulados_'+idTab).is(':checked')?'1':'0'

    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Cod_TipoComprobante,
            FechaInicio,
            FechaFin,
            Cod_Almacen,
            Cod_TipoOperacion,
            Cod_Turno,
            Serie,
            Flag_SoloConRef,
            Flag_Anulado
        })
    }
    //console.log(parametros)
    fetch(URL + '/reporte_api/reporte_general_almacen', parametros)
        .then(req => req.json())
        .then(res => {
            console.log(res)
            if(res.respuesta=='ok'){
                if(res.data.detalles.length>0){ 
                    jsreport.serverUrl = URL_REPORT;  
                    let Cod_Almacen_Filtro = arrayValidacion.includes($("#Cod_Almacen_"+idTab).val())?"Todos":$("#Cod_Almacen_"+idTab+" option:selected").text()
                    let FechaInicio_Filtro = arrayValidacion.includes($("#FechaInicio_"+idTab).val())?"Todos":$("#FechaInicio_"+idTab).val()
                    let FechaFin_Filtro = arrayValidacion.includes($("#FechaFin_"+idTab).val())?"Todos":$("#FechaFin_"+idTab).val()
                    let Cod_TipoOperacion_Filtro = arrayValidacion.includes($("#Cod_TipoOperacion_"+idTab).val())?"Todos":$("#Cod_TipoOperacion_"+idTab+" option:selected").text()
                    let Cod_Turno_Filtro = arrayValidacion.includes($("#Turno_"+idTab).val())?"Todos":$("#Turno_"+idTab+" option:selected").text()
                    let Serie_Filtro = arrayValidacion.includes($("#Serie_"+idTab).val())?"Todos":$("#Serie_"+idTab).val() 

                    var request = {
                        data:{
                            'FLAG_PREVIEW':flag_preview,
                            'COD_TIPOCOMPROBANTE':Cod_TipoComprobante,
                            'COD_TIPO_DOCUMENTO':TipoReporte,
                            'FILTRO': `Almacen: ${Cod_Almacen_Filtro}; Fecha Inicio: ${FechaInicio_Filtro}; Fecha Fin: ${FechaFin_Filtro}; Operacion: ${Cod_TipoOperacion_Filtro}; Turno: ${Cod_Turno_Filtro}; Serie: ${Serie_Filtro}`,
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
                            global.variablesReporteMovAlmacenes[idTab].dataBase64.push({filename: TipoReporte+'.xlsx',content:res.toDataURI().replace("data:null;base64, ",""),encoding: 'base64',tipo:TR})                          
                        else
                            global.variablesReporteMovAlmacenes[idTab].dataBase64.push({filename: TipoReporte+'.pdf',content:res.toDataURI().replace("data:null;base64, ",""),encoding: 'base64',tipo:TR})                          
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

export { ReporteGeneralEmail }
