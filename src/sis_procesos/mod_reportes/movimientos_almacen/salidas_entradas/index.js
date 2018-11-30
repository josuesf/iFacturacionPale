var empty = require('empty-element');
var yo = require('yo-yo'); 

import { URL, URL_REPORT } from '../../../../constantes_entorno/constantes'
import { BuscarCliente } from '../../../modales' 
import { BuscarComprobantePago } from '../../../modales/comprobante_pago' 
import { MesActual } from '../../../../../utility/tools'  
import { ReporteGeneralEmail } from './functions' 

var cantidad_tabs = 0
var arrayValidacion = [null,'null','',undefined]
global.variablesReporteMovAlmacenes = {}
var IdTabSeleccionado = null

function Ver(variables,Cod_TipoComprobante) {
    const fecha = new Date()
    var anio = fecha.getFullYear() 
    //cantidad_tabs++
    const idTabReporteMovAlmacenes= Cod_TipoComprobante=='NS'?("ReporteSalidaAlmacen_"+cantidad_tabs):"ReporteEntradaAlmacen_"+cantidad_tabs
    IdTabSeleccionado = idTabReporteMovAlmacenes
    global.variablesReporteMovAlmacenes[idTabReporteMovAlmacenes]={idTab:idTabReporteMovAlmacenes,excel:null, dataBase64:[]}
    
    var tab = yo`
    <li class="" onclick=${()=>TabSeleccionado(idTabReporteMovAlmacenes)}><a href="#tab_${idTabReporteMovAlmacenes}" data-toggle="tab" aria-expanded="false" id="id_${idTabReporteMovAlmacenes}">${Cod_TipoComprobante=='NS'?'Notas de Salida':'Notas de Entrada'} <a style="padding-left: 10px;"  onclick=${()=>CerrarTabReporteMovAlmacen(idTabReporteMovAlmacenes)} class="btn"><i class="fa fa-close text-danger"></i></a></a></li>`


    var el = yo`
        <div class="tab-pane" id="tab_${idTabReporteMovAlmacenes}">
            <div class="panel">

                <div class="modal"> 
                    <div id="dialogo_docker_${idTabReporteMovAlmacenes}">
                        
                    </div> 
                </div> 

                <div class="panel-body">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="row">
                                <div class="form-group"> 
                                    <label>Seleccione un tipo de reporte</label>
                                    <select id="Cod_Opcion_${idTabReporteMovAlmacenes}" class="form-control">       
                                        <option style="text-transform:uppercase" value="03">Lista movimientos</option> 
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="checkbox checkbox-styled">
                                        <label>
                                            <input type="checkbox" id="chbReferencia_${idTabReporteMovAlmacenes}">
                                            <span>Solo con referencia</span>
                                        </label>
                                    </div>
                                    <div class="checkbox checkbox-styled">
                                        <label>
                                            <input type="checkbox" id="chbAnulados_${idTabReporteMovAlmacenes}">
                                            <span>Solo anulados</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="panel-group" id="accordion3_${idTabReporteMovAlmacenes}">
                                    <div class="card panel expanded">
                                        <div class="card-head card-head-sm collapsed" data-toggle="collapse" data-parent="#accordion3_${idTabReporteMovAlmacenes}" data-target="#accordion3-2_${idTabReporteMovAlmacenes}" aria-expanded="false">
                                            <header><i class="fa fa-filter"></i> Filtro por Fechas</header>
                                            <div class="tools">
                                                <a class="btn btn-icon-toggle"><i class="fa fa-angle-down"></i></a>
                                            </div>
                                        </div>
                                        <div id="accordion3-2_${idTabReporteMovAlmacenes}" class="collapse in" aria-expanded="true">
                                            <div class="card-body">	
                                                <form class="form">
                                                    <div class="row">
                                                        <div class="col-md-12">
                                                            <div class="form-group"> 
                                                                <input type="date" class="form-control" id="FechaInicio_${idTabReporteMovAlmacenes}" value="${MesActual('I')}"> 
                                                                <label>De la fecha:</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-12">
                                                            <div class="form-group"> 
                                                                <input type="date" class="form-control" id="FechaFin_${idTabReporteMovAlmacenes}" value="${MesActual('F')}"> 
                                                                <label>Hasta la fecha:</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div> 
                                        </div>
                                    </div><!--end .panel -->
                                    <div class="card panel">
                                        <div class="card-head card-head-sm" data-toggle="collapse" data-parent="#accordion3_${idTabReporteMovAlmacenes}" data-target="#accordion3-1_${idTabReporteMovAlmacenes}" aria-expanded="true">
                                            <header><i class="fa fa-filter"></i> Filtro de Almacen y Turno</header>
                                            <div class="tools">
                                                <a class="btn btn-icon-toggle"><i class="fa fa-angle-down"></i></a>
                                            </div>
                                        </div>
                                        <div id="accordion3-1_${idTabReporteMovAlmacenes}" class="collapse" aria-expanded="true" style="">
                                            <div class="card-body">						
                                                <form class="form">
                                                    <div class="form-group">
                                                        <select id="Cod_Almacen_${idTabReporteMovAlmacenes}" class="form-control">
                                                            <option value="">Seleccione Almacen</option>
                                                            ${variables.almacenes.map(m=>
                                                                yo`<option value=${m.Cod_Almacen}>${m.Des_Almacen}</option>`
                                                            )}
                                                        </select>
                                                        <label>Cajas</label>
                                                    </div>
                                                    <div class="form-group">
                                                        <select id="Cod_TipoOperacion_${idTabReporteMovAlmacenes}" class="form-control">
                                                            <option value="">Seleccione tipo de operacion</option>
                                                            ${variables.tipos_operaciones.map(m=>
                                                                yo`<option value=${m.Cod_TipoOperacion}>${m.Nom_TipoOperacion}</option>`
                                                            )}
                                                        </select>
                                                        <label>Comprobante</label>
                                                    </div> 
                                                    <div class="form-group">
                                                        <input type="text" class="form-control" id="Serie_${idTabReporteMovAlmacenes}">
                                                        <label>Serie</label>
                                                    </div> 
                                                    <div class="form-group">
                                                        <input type="number" class="form-control" id="Gestion_${idTabReporteMovAlmacenes}" value=${anio} onkeyup=${()=>TraerPeriodos(idTabReporteMovAlmacenes)} onchange=${()=>TraerPeriodos(idTabReporteMovAlmacenes)}>
                                                        <label>Gestion</label>
                                                    </div> 
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <div class="form-group">
                                                                <select id="Periodo_${idTabReporteMovAlmacenes}" class="form-control" onchange=${()=>TraerTurnos(idTabReporteMovAlmacenes)}> 
                                                                </select>
                                                                <label>Periodo</label>
                                                            </div> 
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="form-group">
                                                                <select id="Turno_${idTabReporteMovAlmacenes}" class="form-control"> 
                                                                    <option value="">Seleccione un turno</option>
                                                                </select>
                                                                <label>Turno</label>
                                                            </div> 
                                                        </div>
                                                        
                                                    </div>
                                                   
                                                </form>
                                            </div> 
                                        </div>
                                    </div><!--end .panel -->
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-xs-12">
                                    <button type="button" class="btn btn-primary btn-block" onclick=${()=>GenerarReporte(idTabReporteMovAlmacenes,Cod_TipoComprobante,true,'Excel')}><i class="fa fa-file-excel-o"></i> Ver vista previa Excel del documento</button>
                                </div>
                            </div> 
                            <br>
                            <div class="row">
                                <div class="col-xs-12">
                                    <button type="button" class="btn btn-danger btn-block" onclick=${()=>GenerarReporte(idTabReporteMovAlmacenes,Cod_TipoComprobante,true,'PDF')}><i class="fa fa-file-pdf-o"></i> Ver vista previa PDF del documento</button>
                                </div>
                            </div> 
                            <br>
                            <div class="row">
                                <div class="col-xs-12">
                                    <button type="button" class="btn btn-info btn-block hidden" id="btnAbrirNavegador_${idTabReporteMovAlmacenes}" onclick=${()=>AbrirReporte(idTabReporteMovAlmacenes)}><i class="fa fa-eye"></i> Abrir documento en otra pestaña</button>
                                </div>
                            </div> 
                            <br>
                            <div class="row">
                                <div class="col-xs-12">
                                    <button type="button" class="btn btn-success btn-block hidden" id="btnEnviarCorreo_${idTabReporteMovAlmacenes}" onclick=${()=>AbrirDialogoEnviarMensaje(idTabReporteMovAlmacenes,Cod_TipoComprobante)} ><i class="fa fa-envelope"></i> Enviar por correo</button>
                                </div>
                            </div> 
                        </div>
                        <div class="col-md-8"> 
                            <br>
                            <div class="row">
                                <div class="col-xs-12">
                                    <div id="divExcel_${idTabReporteMovAlmacenes}" class="text-center hidden" style="height: 600px;" >
                            
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
 

    if($("#tab_"+idTabReporteMovAlmacenes).length){   
        $('#tab_'+idTabReporteMovAlmacenes).remove()
        $('#id_'+idTabReporteMovAlmacenes).parents('li').remove()

        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    }else{
        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    } 
    $("#id_"+idTabReporteMovAlmacenes).click()
    TraerPeriodos(idTabReporteMovAlmacenes) 
}

function LlenarReportesCorreo(idTab,tituloReporte){
    var el = yo`<ul class="list divider-full-bleed" id="listReportes_${idTab}">
            ${global.variablesReporteMovAlmacenes[idTab].dataBase64.map((e,index) => 
                     yo`<li class="tile">
                            <a class="tile-content ink-reaction">
                                <div class="tile-icon">
                                    <i class=${e.tipo=="Excel"?"fa fa-file-excel-o":"fa fa-file-pdf-o"}></i> 
                                </div>
                                <div class="tile-text">
                                    ${tituloReporte} ${e.tipo=="Excel"?"(EXCEL)":"(PDF)"}
                                    <div class="progress progress-hairline">
                                        <div class="progress-bar progress-bar-primary-dark" style="width:100%"></div>
                                    </div>
                                </div>
                            </a>
                            <a class="btn btn-flat ink-reaction" onclick=${()=>EliminarReporteCorreo(idTab,e,tituloReporte)}>
                                <i class="fa fa-trash"></i>
                            </a>
                        </li>`
            )}
            </ul>`
        var container = document.getElementById('listReportes_'+idTab)
        empty(container).appendChild(el);
}

function EliminarReporteCorreo(idTab,reporte,titulo){
    for (var i in global.variablesReporteMovAlmacenes[idTab].dataBase64) { 
        if (global.variablesReporteMovAlmacenes[idTab].dataBase64[i].tipo == reporte.tipo) {
            global.variablesReporteMovAlmacenes[idTab].dataBase64.splice(i, 1)
            break 
        }
    } 
    LlenarReportesCorreo(idTab,titulo) 
}

function LlenarPeriodo(periodos,idSelect){
    var el = yo`
        ${periodos.map(e => yo`
             <option value="${e.Cod_Periodo}">${e.Nom_Periodo}</option>
        `)}`   
    $("#"+idSelect).html('')
    $("#"+idSelect).html(el) 
}

function LlenarTurnos(turnos,idSelect){
    var el = yo`
        ${turnos.map((e,index) => yo` 
             <option value="${e.Cod_Turno}">${e.Des_Turno}</option>
        `)}`   
    $("#"+idSelect).html('')
    $("#"+idSelect).html(el) 
}

function AbrirReporte(idTab){
   
    if(global.variablesReporteMovAlmacenes[idTab].excel){
        if(global.variablesReporteMovAlmacenes[idTab].excel!=null){
            var tabOrWindow = window.open(global.variablesReporteMovAlmacenes[idTab].excel, '_blank');
            tabOrWindow.focus();
        }else{
            if(global.variablesReporteMovAlmacenes[idTab].pdf!=null){
                let pdfWindow = window.open("")
                pdfWindow.document.write("<iframe width='100%' height='100%' src='"+global.variablesReporteMovAlmacenes[idTab].pdf.replace('data:null','data:application/pdf')+"'></iframe>")
            }else{
                toastr.error('No se puede abrir el documento','Error',{timeOut: 5000}) 
            } 
        }
    }else{
        if(global.variablesReporteMovAlmacenes[idTab].pdf){
            if(global.variablesReporteMovAlmacenes[idTab].pdf!=null){ 
                let pdfWindow = window.open("")
                pdfWindow.document.write("<iframe width='100%' height='100%' src='"+global.variablesReporteMovAlmacenes[idTab].pdf.replace('data:null','data:application/pdf')+"'></iframe>")
            }else{
                toastr.error('No se puede abrir el documento','Error',{timeOut: 5000}) 
            }
        }else{
            toastr.error('No se puede abrir el documento','Error',{timeOut: 5000}) 
        }
    }
}   

function AbrirDialogoEnviarMensaje(idTab,Cod_TipoComprobante){

    var el = yo`
        <div class="row" id="dialogo_${idTab}">
            <div class="col-sm-12 col-md-12 col-lg-12">
                <div class="alert alert-callout alert-danger hidden" id="divError_${idTab}">
                    <p id="textError_${idTab}"> </p>
                </div>
            </div>
            <div class="col-sm-12 col-md-12 col-lg-12">
                <form class="form" id="formCompose">
                    <div class="form-group floating-label">
                        <input type="email" class="form-control dirty" id="email_${idTab}">
                        <label>Para</label>
                    </div>
                    <div class="form-group floating-label">
                        <input type="text" class="form-control dirty" id="asunto_${idTab}" value="Reporte ${$("#Cod_Opcion_"+idTab+" option:selected").text()}">
                        <label>Asunto</label>
                    </div>
                    <div class="form-group floating-label">
                        <textarea type="text" class="form-control dirty" id="mensaje_${idTab}">Se le adjunta el formato pdf y excel del reporte ${$("#Cod_Opcion_"+idTab+" option:selected").text()}</textarea>
                        <label>Mensaje</label>
                    </div>
                    <div class="form-group">
                    </div>
                </form>
            </div>
            <div class="col-sm-12 col-md-12 col-lg-12"> 
                <em class="text-caption">Archivos para enviar:</em>
            </div>
            <div class="col-sm-12 col-md-12 col-lg-12" id="listReportes_${idTab}">
            </div> 

        </div>`
    var container = document.getElementById('dialogo_docker_'+idTab)
    empty(container).appendChild(el);

    $("#dialogo_docker_"+idTab).dockmodal({
        id: idTab,
        initialState: "docked",
        title: "Mensaje Nuevo",
        buttons: [
            {
                html: "<i class='fa fa-paper-plane'></i> Enviar",
                buttonClass: "btn btn-sm btn-primary ink-reaction",
                click: function (e, dialog) {  
                    run_waitMe($('#dialogo_docker_'+idTab), 1, "ios","Enviando correo espere un momento....");

                    const parametros = {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        credentials: 'same-origin',
                        body: JSON.stringify({
                            email:$("#email_"+idTab).val(),
                            subject:$("#asunto_"+idTab).val(),
                            message:$("#mensaje_"+idTab).val(),
                            arregloAttachment:global.variablesReporteMovAlmacenes[idTab].dataBase64
                        })
                    }
                    fetch(URL + '/empresa_api/send_email_report', parametros)
                        .then(req => req.json())
                        .then(res => { 
                            if(res.respuesta=='ok'){
                                dialog.dockmodal("close");
                                global.variablesReporteMovAlmacenes[idTab].dataBase64=[] 
                                toastr.success('Se envio correctamente el mensaje','Confirmacion',{timeOut: 5000})
                            }else{
                                $("#divError_"+idTab).removeClass("hidden")
                                if(res.detalle_error.code=='ENVELOPE'){
                                    $("#textError_"+idTab).text("Necesita un email de destinatario")
                                }else{
                                    $("#textError_"+idTab).text(res.detalle_error.command)
                                }
                                $("#divError_"+idTab).focus()
                            }
                            $('#dialogo_docker_'+idTab).waitMe('hide');
                        }).catch(function (e) {
                            $("#divError_"+idTab).removeClass("hidden")
                            $("#textError_"+idTab).text(e)
                            $('#dialogo_docker_'+idTab).waitMe('hide');
                        });
                }
            }
        ]
    }); 
    GenerarReporteEmail(idTab,Cod_TipoComprobante,false)
}

function ReporteGeneral(idTab,Cod_TipoComprobante,TipoReporte,ParametroOrden,flag_preview,Tipo){
    $("#btnAbrirNavegador_"+idTab).addClass("hidden") 
    $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
    $("#divExcel_"+idTab).removeClass("hidden")
    $("#divExcel_"+idTab).html('<div style="margin-top:100px">'+
        '<br/><br/>'+
        '<i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i><br/><br/>'+
        '<label>Cargando vista previa....</label>'+
    '</div>')  
    var Cod_Almacen = arrayValidacion.includes($("#Cod_Almacen_"+idTab).val())?null:$("#Cod_Almacen_"+idTab).val() 
    var FechaInicio = arrayValidacion.includes($("#FechaInicio_"+idTab).val())?null:$("#FechaInicio_"+idTab).val()
    var FechaFin = arrayValidacion.includes($("#FechaFin_"+idTab).val())?null:$("#FechaFin_"+idTab).val()
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
                        switch(Tipo){
                            case 'Excel':
                                var html = $(res.toString())  
                                if(html[1]){  
                                    $('#divExcel_'+idTab).html(html[1]) 
                                    $("#btnAbrirNavegador_"+idTab).removeClass("hidden") 
                                    $("#btnEnviarCorreo_"+idTab).removeClass("hidden")
                                    global.variablesReporteMovAlmacenes[idTab].excel = html[1].src
                                }else{
                                    $('#divExcel_'+idTab).html(res.toString())
                                    global.variablesReporteMovAlmacenes[idTab].excel = null
                                }
                                break
                            case 'PDF':
                                $('#divExcel_'+idTab).html('<iframe src="'+res.toDataURI().replace("data:null","data:application/pdf;base64")+'" height="100%" width="100%"></iframe>') 
                                $("#btnEnviarCorreo_"+idTab).removeClass("hidden")
                                $("#btnAbrirNavegador_"+idTab).removeClass("hidden")
                                global.variablesReporteMovAlmacenes[idTab].excel = null
                                global.variablesReporteMovAlmacenes[idTab].pdf = res.toDataURI()
                                break
                        }    
                    }).catch(function (e) { 
                        console.log(e)
                        $("#divExcel_"+idTab).addClass("hidden")
                        $("#btnAbrirNavegador_"+idTab).addClass("hidden")
                        $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
                        global.variablesReporteMovAlmacenes[idTab].excel = null
                        global.variablesReporteMovAlmacenes[idTab].pdf = null
                        toastr.error('Hubo un error al generar el documento. Tipo error : '+e.statusText,'Error',{timeOut: 5000}) 
                    });
                }else{
                    toastr.warning("No existen datos para mostrar",'Error',{timeOut: 5000})
                    $("#btnAbrirNavegador_"+idTab).addClass("hidden")
                    $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
                    $("#divExcel_"+idTab).addClass("hidden")
                    global.variablesReporteMovAlmacenes[idTab].excel = null
                    global.variablesReporteMovAlmacenes[idTab].pdf = null
                }
            }else{
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+res.detalle_error,'Error',{timeOut: 5000})
                $("#btnAbrirNavegador_"+idTab).addClass("hidden")
                $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
                $("#divExcel_"+idTab).addClass("hidden")
                global.variablesReporteMovAlmacenes[idTab].excel = null
                global.variablesReporteMovAlmacenes[idTab].pdf = null
            } 
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $("#btnAbrirNavegador_"+idTab).addClass("hidden")
            $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
            $("#divExcel_"+idTab).addClass("hidden")
            global.variablesReporteMovAlmacenes[idTab].excel = null
            global.variablesReporteMovAlmacenes[idTab].pdf = null
        });
}

function GenerarReporteEmail(idTab,Cod_TipoComprobante,flag_preview){
    global.variablesReporteMovAlmacenes[idTab].dataBase64=[]
    run_waitMe($('#dialogo_docker_'+idTab), 1, "ios","Subiendo reporte para su envio....");
    switch($("#Cod_Opcion_"+idTab).val()){
        case '01': 
            break 
        case '02':
            break
        case '03':
            ReporteGeneralEmail(idTab,Cod_TipoComprobante,"ReporteMovAlmacenLista_Excel",null,flag_preview,"Excel",function(flag,result){ 
                if(flag){
                    ReporteGeneralEmail(idTab,Cod_TipoComprobante,"ReporteMovAlmacenLista_PDF",null,flag_preview,"PDF",function(flag,result){
                        if(flag){
                            LlenarReportesCorreo(idTab,$("#Cod_Opcion_"+idTab+" option:selected").text())
                            $('#dialogo_docker_'+idTab).waitMe('hide');
                        }else{
                            $('#dialogo_docker_'+idTab).waitMe('hide');
                        }
                    })
                }else{
                    $('#dialogo_docker_'+idTab).waitMe('hide');
                }
            })
            break 
    }
}

function GenerarReporte(idTab,Cod_TipoComprobante,flag_preview,Tipo){  
    switch($("#Cod_Opcion_"+idTab).val()){
        case '01':
            break
        case '02':
            break
        case '03':
            ReporteGeneral(idTab,Cod_TipoComprobante,"ReporteMovAlmacenLista_"+Tipo,null,flag_preview,Tipo)
            break
    }
}

function TabSeleccionado(idTab){  
    IdTabSeleccionado = idTab 
}
 
function CerrarTabReporteMovAlmacen(idTab){ 
    $('#tab_'+idTab).remove()
    $('#id_'+idTab).parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show');
    delete global.variablesReporteMovAlmacenes[idTab]
    $("#dialogo_docker_"+idTab).dockmodal("close");
    IdTabSeleccionado = null
}

function TraerPeriodos(idTab){
    var Gestion = $("#Gestion_"+idTab).val()  
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            Gestion
        })
    }
    fetch(URL + '/empresa_api/get_periodos_by_gestion', parametros)
        .then(req => req.json())
        .then(res => {
            LlenarPeriodo(res.data.periodos,'Periodo_'+idTab)
            TraerTurnos(idTab)
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos. Inténtelo nuevamente refrescando la pantalla','Error',{timeOut: 5000})
        });
}

function TraerTurnos(idTab){
    var Cod_Periodo = $("#Periodo_"+idTab).val()
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            Cod_Periodo
        })
    }
    fetch(URL + '/empresa_api/get_turnos_by_periodo', parametros)
        .then(req => req.json())
        .then(res => { 
            LlenarTurnos(res.data.turnos,'Turno_'+idTab)
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos. Inténtelo nuevamente refrescando la pantalla','Error',{timeOut: 5000})
        });
}

function NuevoReporteMovimientoAlmacen(Cod_TipoComprobante) { 
    run_waitMe($('#main-contenido'), 1, "ios"); 
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        })
    }
    fetch(URL + '/reporte_api/get_variables_reporte_movimientos_almacen', parametros)
        .then(req => req.json())
        .then(res => { 
            var variables = res.data 
            if (res.respuesta == 'ok') {
                Ver(variables,Cod_TipoComprobante)
            }else{
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+res.detalle_error,'Error',{timeOut: 5000})
            }
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
}

export { NuevoReporteMovimientoAlmacen }