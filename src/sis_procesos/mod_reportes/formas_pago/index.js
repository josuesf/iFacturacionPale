var empty = require('empty-element');
var yo = require('yo-yo'); 

import { URL, URL_REPORT } from '../../../constantes_entorno/constantes'
import { BuscarCliente } from '../../modales' 
import { BuscarComprobantePago } from '../../modales/comprobante_pago' 
import { MesActual } from '../../../../utility/tools'  
import { ReporteGeneralEmail } from './functions'

var cantidad_tabs = 0
var arrayValidacion = [null,'null','',undefined]
global.variablesReporteFormaPago = {}
var IdTabSeleccionado = null
function Ver(variables,CodLibro) {

    global.objCliente = ''
    global.objComprobantePago = '' 
    global.objComprobantePagoDetalle = '' 

    //cantidad_tabs++
    const idTabReporteFormaPago = CodLibro=='08'?("ReporteFormaPagoCompra_"+cantidad_tabs):"ReporteFormaPagoVenta_"+cantidad_tabs
    IdTabSeleccionado = idTabReporteFormaPago
    global.variablesReporteFormaPago[idTabReporteFormaPago]={idTab:idTabReporteFormaPago,flag_cliente:false, flag_comprobante:false, dataBase64:[]}
    
    var tab = yo`
    <li class="" onclick=${()=>TabSeleccionado(idTabReporteFormaPago)}><a href="#tab_${idTabReporteFormaPago}" data-toggle="tab" aria-expanded="false" id="id_${idTabReporteFormaPago}">${CodLibro=='08'?'Formas de Pago':'Formas de Cobro'} <a style="padding-left: 10px;"  onclick=${()=>CerrarTabReporteFormaPago(idTabReporteFormaPago)} class="btn"><i class="fa fa-close text-danger"></i></a></a></li>`


    var el = yo`
        <div class="tab-pane" id="tab_${idTabReporteFormaPago}">
            <div class="panel">

                <div class="modal"> 
                    <div id="dialogo_docker_${idTabReporteFormaPago}">
                        
                    </div> 
                </div> 

                <div class="panel-body">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="row">
                                <div class="form-group"> 
                                    <label>Seleccione un tipo de reporte</label>
                                    <select id="Cod_Opcion_${idTabReporteFormaPago}" class="form-control">                                         
                                        <option style="text-transform:uppercase" value="01">Agrupado por cliente</option> 
                                        <option style="text-transform:uppercase" value="02">Agrupado por Movimiento</option> 
                                    </select>
                                </div>
                            </div>

                            <div class="row">
                                <div class="panel-group" id="accordion3_${idTabReporteFormaPago}">
                                    <div class="card panel expanded">
                                        <div class="card-head card-head-sm collapsed" data-toggle="collapse" data-parent="#accordion3_${idTabReporteFormaPago}" data-target="#accordion3-2_${idTabReporteFormaPago}" aria-expanded="false">
                                            <header><i class="fa fa-filter"></i> Filtro por Fechas</header>
                                            <div class="tools">
                                                <a class="btn btn-icon-toggle"><i class="fa fa-angle-down"></i></a>
                                            </div>
                                        </div>
                                        <div id="accordion3-2_${idTabReporteFormaPago}" class="collapse in" aria-expanded="true">
                                            <div class="card-body">	
                                                <form class="form">
                                                    <div class="row">
                                                        <div class="col-md-12">
                                                            <div class="form-group"> 
                                                                <input type="date" class="form-control" id="FechaInicio_${idTabReporteFormaPago}" value="${MesActual('I')}"> 
                                                                <label>De la fecha:</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-12">
                                                            <div class="form-group"> 
                                                                <input type="date" class="form-control" id="FechaFin_${idTabReporteFormaPago}" value="${MesActual('F')}"> 
                                                                <label>Hasta la fecha:</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div> 
                                        </div>
                                    </div><!--end .panel -->
                                    <div class="card panel">
                                        <div class="card-head card-head-sm" data-toggle="collapse" data-parent="#accordion3_${idTabReporteFormaPago}" data-target="#accordion3-1_${idTabReporteFormaPago}" aria-expanded="true">
                                            <header><i class="fa fa-filter"></i> Filtro de Oficinas y Cuentas</header>
                                            <div class="tools">
                                                <a class="btn btn-icon-toggle"><i class="fa fa-angle-down"></i></a>
                                            </div>
                                        </div>
                                        <div id="accordion3-1_${idTabReporteFormaPago}" class="collapse" aria-expanded="true" style="">
                                            <div class="card-body">						
                                                <form class="form">
                                                    <div class="form-group">
                                                        <select id="Cod_Caja_${idTabReporteFormaPago}" class="form-control">
                                                            <option value="">Seleccione Caja</option>
                                                            ${variables.cajas.map(m=>
                                                                yo`<option value=${m.Cod_Caja}>${m.Des_Caja}</option>`
                                                            )}
                                                        </select>
                                                        <label>Cajas</label>
                                                    </div>
                                                    <div class="form-group">
                                                        <select id="Cod_Comprobante_${idTabReporteFormaPago}" class="form-control">
                                                            <option value="">Seleccione Comprobante</option>
                                                            ${variables.tipos_comprobantes.map(m=>
                                                                yo`<option value=${m.Cod_TipoComprobante}>${m.Nom_TipoComprobante}</option>`
                                                            )}
                                                        </select>
                                                        <label>Comprobante</label>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <div class="form-group">
                                                                <select id="Cod_Moneda_${idTabReporteFormaPago}" class="form-control">
                                                                    <option value="">Seleccione moneda</option>
                                                                    ${variables.monedas.map(m=>
                                                                        yo`<option value=${m.Cod_Moneda}>${m.Nom_Moneda}</option>`
                                                                    )}
                                                                </select>
                                                                <label>Moneda</label>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="form-group">
                                                                <input type="text" class="form-control" id="Serie_${idTabReporteFormaPago}">
                                                                <label>Serie</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-4">
                                                            <div class="radio radio-styled">
                                                                <label>
                                                                    <input type="radio" name="optionsRadios_${idTabReporteFormaPago}" onchange=${()=>CambioOpciones(idTabReporteFormaPago)} id="Todos_${idTabReporteFormaPago}" value="todos" checked>
                                                                    <span>Todos</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-4">
                                                            <div class="radio radio-styled">
                                                                <label>
                                                                    <input type="radio" name="optionsRadios_${idTabReporteFormaPago}" id="Contado_${idTabReporteFormaPago}" onchange=${()=>CambioOpciones(idTabReporteFormaPago)} value="contado">
                                                                    <span>Contado</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-4">
                                                            <div class="radio radio-styled">
                                                                <label>
                                                                    <input type="radio" name="optionsRadios_${idTabReporteFormaPago}" id="Credito_${idTabReporteFormaPago}" onchange=${()=>CambioOpciones(idTabReporteFormaPago)} value="credito">
                                                                    <span>Credito</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group" id="divFormaPago_${idTabReporteFormaPago}" style="display:none">
                                                        <select id="Cod_Forma_Pago_${idTabReporteFormaPago}" class="form-control"> 
                                                            ${variables.formas_pago.map(m=>
                                                                yo`<option value=${m.Cod_FormaPago}>${m.Nom_FormaPago}</option>`
                                                            )}
                                                        </select>
                                                        <label>Forma de Pago</label>
                                                    </div>
                                                </form>
                                            </div> 
                                        </div>
                                    </div><!--end .panel -->
                                    <div class="card panel">
                                        <div class="card-head card-head-sm collapsed" data-toggle="collapse" data-parent="#accordion3_${idTabReporteFormaPago}" data-target="#accordion3-3_${idTabReporteFormaPago}" aria-expanded="false">
                                            <header><i class="fa fa-filter"></i> Filtro Cliente/Proveedor y Comprobante</header>
                                            <div class="tools">
                                                <a class="btn btn-icon-toggle"><i class="fa fa-angle-down"></i></a>
                                            </div>
                                        </div>
                                        <div id="accordion3-3_${idTabReporteFormaPago}" class="collapse" aria-expanded="false">
                                            <div class="card-body">	
                                                <form class="form">	
                                                    <div class="form-group">
                                                        <div class="input-group">
                                                            <div class="input-group-content">
                                                                <input type="text" class="form-control" id="Cliente_${idTabReporteFormaPago}" onkeyup=${()=>CambioNombreClienteReporte(event,idTabReporteFormaPago)}> 
                                                                <label>Cliente/Proveedor</label>
                                                            </div>
                                                            <div class="input-group-btn">
                                                                <button class="btn btn-success" type="button" onclick=${()=>BuscarCliente("Cliente_"+idTabReporteFormaPago,null,null)}><i class="fa fa-search"></i> Buscar</button>
                                                            </div>
                                                        </div>
                                                    </div>
 
                                                    <div class="form-group">
                                                        <div class="input-group">
                                                            <div class="input-group-content">
                                                                <input type="text" class="form-control" id="ComprobanteFacturado_${idTabReporteFormaPago}" onkeyup=${()=>CambioComprobanteReporte(event,idTabReporteFormaPago)}> 
                                                                <label>Comprobante Facturado</label>
                                                            </div>
                                                            <div class="input-group-btn">
                                                                <button class="btn btn-success" type="button" onclick=${()=>BuscarComprobantePago(CodLibro)}><i class="fa fa-search"></i> Buscar</button>
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
                                    <button type="button" class="btn btn-primary btn-block" onclick=${()=>GenerarReporte(idTabReporteFormaPago,CodLibro,true,'Excel')}><i class="fa fa-file-excel-o"></i> Ver vista previa Excel del documento</button>
                                </div>
                            </div> 
                            <br>
                            <div class="row">
                                <div class="col-xs-12">
                                    <button type="button" class="btn btn-danger btn-block" onclick=${()=>GenerarReporte(idTabReporteFormaPago,CodLibro,true,'PDF')}><i class="fa fa-file-pdf-o"></i> Ver vista previa PDF del documento</button>
                                </div>
                            </div> 
                            <br>
                            <div class="row">
                                <div class="col-xs-12">
                                    <button type="button" class="btn btn-info btn-block hidden" id="btnAbrirNavegador_${idTabReporteFormaPago}" onclick=${()=>AbrirReporte(idTabReporteFormaPago,CodLibro)}><i class="fa fa-eye"></i> Abrir documento en otra pestaña</button>
                                </div>
                            </div> 
                            <br>
                            <div class="row">
                                <div class="col-xs-12">
                                    <button type="button" class="btn btn-success btn-block hidden" id="btnEnviarCorreo_${idTabReporteFormaPago}" onclick=${()=>AbrirDialogoEnviarMensaje(idTabReporteFormaPago,CodLibro)} ><i class="fa fa-envelope"></i> Enviar por correo</button>
                                </div>
                            </div> 
                        </div>
                        <div class="col-md-8"> 
                            <br>
                            <div class="row">
                                <div class="col-xs-12">
                                    <div id="divExcel_${idTabReporteFormaPago}" class="text-center hidden" style="height: 600px;" >
                            
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
 

    if($("#tab_"+idTabReporteFormaPago).length){   
        $('#tab_'+idTabReporteFormaPago).remove()
        $('#id_'+idTabReporteFormaPago).parents('li').remove()

        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    }else{
        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    } 
    $("#id_"+idTabReporteFormaPago).click() 
    
    $('#modal-superior').off('hidden.bs.modal').on('hidden.bs.modal', function () {
         
        if(global.objCliente!=''){
            $("#Cliente_"+IdTabSeleccionado).val(global.objCliente.Cliente)
            $("#Cliente_"+IdTabSeleccionado).attr("data-id",global.objCliente.Id_ClienteProveedor)
            global.variablesReporteFormaPago[IdTabSeleccionado].flag_cliente = true 
        }
    })
    
    $('#modal-otros-procesos').off('hidden.bs.modal').on('hidden.bs.modal', function () {
        
        if(global.objComprobantePago!='' && global.objComprobantePago && global.objComprobantePagoDetalle!='' && global.objComprobantePagoDetalle){
            $("#ComprobanteFacturado_"+IdTabSeleccionado).attr("data-id",global.objComprobantePago.id_ComprobantePago)
            $("#ComprobanteFacturado_"+IdTabSeleccionado).val(global.objComprobantePagoDetalle.DocCliente+" "+global.objComprobantePagoDetalle.Cod_TipoComprobante+" "+global.objComprobantePagoDetalle.Serie+" "+global.objComprobantePagoDetalle.Numero)
            global.variablesReporteFormaPago[IdTabSeleccionado].flag_comprobante = true
        }
    })

}

function AbrirDialogoEnviarMensaje(idTab,Cod_Libro){

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
                            arregloAttachment:global.variablesReporteFormaPago[idTab].dataBase64
                        })
                    }
                    fetch(URL + '/empresa_api/send_email_report', parametros)
                        .then(req => req.json())
                        .then(res => {
                            console.log(res)
                            if(res.respuesta=='ok'){
                                dialog.dockmodal("close");
                                global.variablesReporteFormaPago[idTab].dataBase64=[] 
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
    GenerarReporteEmail(idTab,Cod_Libro,false)
}

function LlenarReportesCorreo(idTab,tituloReporte){
    var el = yo`<ul class="list divider-full-bleed" id="listReportes_${idTab}">
            ${global.variablesReporteFormaPago[idTab].dataBase64.map((e,index) => 
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
    for (var i in global.variablesReporteFormaPago[idTab].dataBase64) { 
        if (global.variablesReporteFormaPago[idTab].dataBase64[i].tipo == reporte.tipo) {
            global.variablesReporteFormaPago[idTab].dataBase64.splice(i, 1)
            break 
        }
    } 
    LlenarReportesCorreo(idTab,titulo) 
}

function TabSeleccionado(idTab){ 
    global.objCliente = ''
    global.objComprobantePago = '' 
    global.objComprobantePagoDetalle = '' 
    IdTabSeleccionado = idTab 
}


function CerrarTabReporteFormaPago(idTab){ 
    $('#tab_'+idTab).remove()
    $('#id_'+idTab).parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show');
    delete global.variablesReporteFormaPago[idTab]
    $("#dialogo_docker_"+idTab).dockmodal("close");
    IdTabSeleccionado = null
}

function CambioNombreClienteReporte(e,idTab){  
    if(e.which == 46 || e.which == 8){ 
        if(global.variablesReporteFormaPago[idTab].flag_cliente){
            $("#Cliente_"+idTab).val("")
            $("#Cliente_"+idTab).attr("data-id",null)
            global.variablesReporteFormaPago[idTab].flag_cliente=false
        }
    } 
}

function CambioComprobanteReporte(e,idTab){ 
    if(e.which == 46 || e.which == 8){ 
        if(global.variablesReporteFormaPago[idTab].flag_comprobante){
            $("#ComprobanteFacturado_"+idTab).val("")
            $("#ComprobanteFacturado_"+idTab).attr("data-id",null)
            global.variablesReporteFormaPago[idTab].flag_comprobante=false
        }
    } 
}


function CambioOpciones(idTab){
    if ($('#Credito_'+idTab).is(':checked')) {
        $("#divFormaPago_"+idTab).css("display","block")
    }else{
        $("#divFormaPago_"+idTab).css("display","none")
    }
}

function AbrirReporte(idTab,Cod_Libro){
   
    if(global.variablesReporteFormaPago[idTab].excel){
        if(global.variablesReporteFormaPago[idTab].excel!=null){
            var tabOrWindow = window.open(global.variablesReporteFormaPago[idTab].excel, '_blank');
            tabOrWindow.focus();
        }else{
            if(global.variablesReporteFormaPago[idTab].pdf!=null){
                let pdfWindow = window.open("")
                pdfWindow.document.write("<iframe width='100%' height='100%' src='"+global.variablesReporteFormaPago[idTab].pdf.replace('data:null','data:application/pdf')+"'></iframe>")
            }else{
                toastr.error('No se puede abrir el documento','Error',{timeOut: 5000}) 
            } 
        }
    }else{
        if(global.variablesReporteFormaPago[idTab].pdf){
            if(global.variablesReporteFormaPago[idTab].pdf!=null){ 
                let pdfWindow = window.open("")
                pdfWindow.document.write("<iframe width='100%' height='100%' src='"+global.variablesReporteFormaPago[idTab].pdf.replace('data:null','data:application/pdf')+"'></iframe>")
            }else{
                toastr.error('No se puede abrir el documento','Error',{timeOut: 5000}) 
            }
        }else{
            toastr.error('No se puede abrir el documento','Error',{timeOut: 5000}) 
        }
    }
}   


function ReporteGeneral(idTab,Cod_Libro,TipoReporte,ParametroOrden,flag_preview,Tipo){
    $("#btnAbrirNavegador_"+idTab).addClass("hidden") 
    $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
    $("#divExcel_"+idTab).removeClass("hidden")
    $("#divExcel_"+idTab).html('<div style="margin-top:100px">'+
        '<br/><br/>'+
        '<i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i><br/><br/>'+
        '<label>Cargando vista previa....</label>'+
    '</div>')  
    var Id_Cliente = arrayValidacion.includes($("#Cliente_"+idTab).attr("data-id"))?0:parseInt($("#Cliente_"+idTab).attr("data-id"))
    var Id_ComprobantePago = arrayValidacion.includes($("#ComprobanteFacturado_"+idTab).attr("data-id"))?0:parseInt($("#ComprobanteFacturado_"+idTab).attr("data-id"))
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
    var Cod_Moneda = arrayValidacion.includes($("#Cod_Moneda_"+idTab).val())?null:$("#Cod_Moneda_"+idTab).val()
    var Cod_TipoFormaPago = $('#Todos_'+idTab).is(':checked')?null:$("#Credito_"+idTab).is(':checked')?'999':$("#Contado_"+idTab).is(':checked')?$("#Cod_Forma_Pago_"+idTab).val():null
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
            Id_Cliente,
            Id_ComprobantePago,
            Cod_Caja,
            FechaInicio,
            FechaFin,
            Cod_Moneda,
            Cod_TipoFormaPago,
            Cod_TipoComprobante,
            Serie
        })
    }
    //console.log(parametros)
    fetch(URL + '/reporte_api/reporte_general_forma_pago', parametros)
        .then(req => req.json())
        .then(res => {
            console.log(res)
            if(res.respuesta=='ok'){
                if(res.data.detalles.length>0){ 
                    jsreport.serverUrl = URL_REPORT;  
                    let Id_Cliente_Filtro = arrayValidacion.includes($("#Cliente_"+idTab).attr("data-id"))?"Todos":$("#Cliente_"+idTab).val()
                    let Id_Comprobante_Filtro = arrayValidacion.includes($("#ComprobanteFacturado_"+idTab).attr("data-id"))?"Todos":$("#ComprobanteFacturado_"+idTab).val()
                    let Cod_Caja_Filtro = arrayValidacion.includes($("#Cod_Caja_"+idTab).val())?"Todos":$("#Cod_Caja_"+idTab+" option:selected").text()
                    let FechaInicio_Filtro = arrayValidacion.includes($("#FechaInicio_"+idTab).val())?"Todos":$("#FechaInicio_"+idTab).val()
                    let FechaFin_Filtro = arrayValidacion.includes($("#FechaFin_"+idTab).val())?"Todos":$("#FechaFin_"+idTab).val()
                    let Cod_Moneda_Filtro = arrayValidacion.includes($("#Cod_Moneda_"+idTab).val())?"Todos":$("#Cod_Moneda_"+idTab+" option:selected").text()
                    let Cod_TipoFormaPago_Filtro = $('#Todos_'+idTab).is(':checked')?"Todos":$("#Credito_"+idTab).is(':checked')?'CREDITO':$("#Contado_"+idTab).is(':checked')?$("#Cod_Forma_Pago_"+idTab+" option:selected").text():null
                    let Cod_TipoComprobante_Filtro = arrayValidacion.includes($("#Cod_Comprobante_"+idTab).val())?"Todos":$("#Cod_Comprobante_"+idTab+" option:selected").text()
                    let Serie_Filtro = arrayValidacion.includes($("#Serie_"+idTab).val())?"Todos":$("#Serie_"+idTab).val() 

                    var request = {
                        data:{
                            'FLAG_PREVIEW':flag_preview,
                            'COD_LIBRO':Cod_Libro,
                            'COD_TIPO_DOCUMENTO':TipoReporte,
                            'FILTRO': `Cliente/Proveedor: ${Id_Cliente_Filtro};Comprobante Facturado: ${Id_Comprobante_Filtro}; Caja: ${Cod_Caja_Filtro}; Fecha Inicio: ${FechaInicio_Filtro}; Fecha Fin: ${FechaFin_Filtro}; Moneda: ${Cod_Moneda_Filtro}; Forma de Pago: ${Cod_TipoFormaPago_Filtro}; Comprobante: ${Cod_TipoComprobante_Filtro}; Serie: ${Serie_Filtro}`,
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
                                    global.variablesReporteFormaPago[idTab].excel = html[1].src
                                }else{
                                    $('#divExcel_'+idTab).html(res.toString())
                                    global.variablesReporteFormaPago[idTab].excel = null
                                }
                                break
                            case 'PDF':
                                $('#divExcel_'+idTab).html('<iframe src="'+res.toDataURI().replace("data:null","data:application/pdf;base64")+'" height="100%" width="100%"></iframe>') 
                                $("#btnEnviarCorreo_"+idTab).removeClass("hidden")
                                $("#btnAbrirNavegador_"+idTab).removeClass("hidden")
                                global.variablesReporteFormaPago[idTab].excel = null
                                global.variablesReporteFormaPago[idTab].pdf = res.toDataURI()
                                break
                        }    
                    }).catch(function (e) { 
                        console.log(e)
                        $("#divExcel_"+idTab).addClass("hidden")
                        $("#btnAbrirNavegador_"+idTab).addClass("hidden")
                        $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
                        global.variablesReporteFormaPago[idTab].excel = null
                        global.variablesReporteFormaPago[idTab].pdf = null
                        toastr.error('Hubo un error al generar el documento. Tipo error : '+e.statusText,'Error',{timeOut: 5000}) 
                    });
                }else{
                    toastr.warning("No existen datos para mostrar",'Error',{timeOut: 5000})
                    $("#btnAbrirNavegador_"+idTab).addClass("hidden")
                    $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
                    $("#divExcel_"+idTab).addClass("hidden")
                    global.variablesReporteFormaPago[idTab].excel = null
                    global.variablesReporteFormaPago[idTab].pdf = null
                }
            }else{
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+res.detalle_error,'Error',{timeOut: 5000})
                $("#btnAbrirNavegador_"+idTab).addClass("hidden")
                $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
                $("#divExcel_"+idTab).addClass("hidden")
                global.variablesReporteFormaPago[idTab].excel = null
                global.variablesReporteFormaPago[idTab].pdf = null
            } 
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $("#btnAbrirNavegador_"+idTab).addClass("hidden")
            $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
            $("#divExcel_"+idTab).addClass("hidden")
            global.variablesReporteFormaPago[idTab].excel = null
            global.variablesReporteFormaPago[idTab].pdf = null
        });
}

function GenerarReporte(idTab,Cod_Libro,flag_preview,Tipo){  
    switch($("#Cod_Opcion_"+idTab).val()){
        case '01':
            ReporteGeneral(idTab,Cod_Libro,"FormaPagoXClienteDoc_"+Tipo,"FechaEmision",flag_preview,Tipo)
            break
        case '02':
            ReporteGeneral(idTab,Cod_Libro,"ReporteFormaPagoXMov_"+Tipo,null,flag_preview,Tipo)
            break
    }
}

function GenerarReporteEmail(idTab,Cod_Libro,flag_preview){
    global.variablesReporteFormaPago[idTab].dataBase64=[]
    run_waitMe($('#dialogo_docker_'+idTab), 1, "ios","Subiendo reporte para su envio....");
    switch($("#Cod_Opcion_"+idTab).val()){
        case '01': 
            ReporteGeneralEmail(idTab,Cod_Libro,"FormaPagoXClienteDoc_Excel",null,flag_preview,"Excel",function(flag,result){ 
                if(flag){
                    ReporteGeneralEmail(idTab,Cod_Libro,"FormaPagoXClienteDoc_PDF",null,flag_preview,"PDF",function(flag,result){
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
        case '02':
            ReporteGeneralEmail(idTab,Cod_Libro,"ReporteFormaPagoXMov_Excel",null,flag_preview,"Excel",function(flag,result){ 
                if(flag){
                    ReporteGeneralEmail(idTab,Cod_Libro,"ReporteFormaPagoXMov_PDF",null,flag_preview,"PDF",function(flag,result){
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
 
function NuevoReporteFormasPagos(CodLibro) { 
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
    fetch(URL + '/reporte_api/get_variables_reporte_formas_pago', parametros)
        .then(req => req.json())
        .then(res => { 
            var variables = res.data 
            if (res.respuesta == 'ok') {
                Ver(variables,CodLibro)
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

export { NuevoReporteFormasPagos }