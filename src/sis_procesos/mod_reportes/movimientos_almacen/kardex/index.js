var empty = require('empty-element');
var yo = require('yo-yo'); 

import { URL, URL_REPORT } from '../../../../constantes_entorno/constantes'
import { BuscarCliente, BuscarProducto } from '../../../modales' 
import { MesActual } from '../../../../../utility/tools'  
import { ReporteGeneralEmail,ReporteDetalladoEmail } from './functions' 

var cantidad_tabs = 0
var arrayValidacion = [null,'null','',undefined]
global.variablesReporteKardex = {}
var IdTabSeleccionado = null

function Ver(variables) {

    global.objCliente = ''
    global.objProducto = ''

    //cantidad_tabs++
    const idTabReporteKardex =  "ReporteKardex_"+cantidad_tabs
    IdTabSeleccionado = idTabReporteKardex
    global.variablesReporteKardex[idTabReporteKardex]={idTab:idTabReporteKardex,flag_cliente:false,flag_producto:false,excel:null, dataBase64:[]}
    
    var tab = yo`
    <li class="" onclick=${()=>TabSeleccionado(idTabReporteKardex)}><a href="#tab_${idTabReporteKardex}" data-toggle="tab" aria-expanded="false" id="id_${idTabReporteKardex}"> Reporte Kardex <a style="padding-left: 10px;"  onclick=${()=>CerrarTabReporteKardex(idTabReporteKardex)} class="btn"><i class="fa fa-close text-danger"></i></a></a></li>`


    var el = yo`
        <div class="tab-pane" id="tab_${idTabReporteKardex}">
            <div class="panel">

                <div class="modal"> 
                    <div id="dialogo_docker_${idTabReporteKardex}">
                        
                    </div> 
                </div> 

                <div class="panel-body">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="row">
                                <div class="form-group"> 
                                    <label>Seleccione un tipo de reporte</label>
                                    <select id="Cod_Opcion_${idTabReporteKardex}" class="form-control"> 
                                        <option style="text-transform:uppercase" value="01">Kardex valorizado Administrativo</option> 
                                        <option style="text-transform:uppercase" value="02">Kardex valorizado Detallado</option> 
                                    </select>
                                </div>
                            </div>

                            <div class="row text-center">
                                <div class="col-md-6">
                                    <div class="radio radio-styled">
                                        <label>
                                            <input type="radio" name="rbOpciones_${idTabReporteKardex}" value="Administrativo_${idTabReporteKardex}" id="chbAdministrativo_${idTabReporteKardex}" checked>
                                            <span>Administrativo</span>
                                        </label>
                                    </div>
                                </div>
                                <div class="col-md-6">  
                                    <div class="radio radio-styled">
                                        <label>
                                            <input type="radio" name="rbOpciones_${idTabReporteKardex}" value="Contable_${idTabReporteKardex}" id="chbContable_${idTabReporteKardex}">
                                            <span>Contable</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="panel-group" id="accordion3_${idTabReporteKardex}">
                                    <div class="card panel expanded">
                                        <div class="card-head card-head-sm collapsed" data-toggle="collapse" data-parent="#accordion3_${idTabReporteKardex}" data-target="#accordion3-2_${idTabReporteKardex}" aria-expanded="false">
                                            <header><i class="fa fa-filter"></i> Filtro de Fechas y Periodos</header>
                                            <div class="tools">
                                                <a class="btn btn-icon-toggle"><i class="fa fa-angle-down"></i></a>
                                            </div>
                                        </div>
                                        <div id="accordion3-2_${idTabReporteKardex}" class="collapse in" aria-expanded="true">
                                            <div class="card-body">	
                                                <form class="form">
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <div class="radio radio-styled">
                                                                <label>
                                                                    <input type="radio" name="optionsRadiosFF_${idTabReporteKardex}" id="optPorPeriodo_${idTabReporteKardex}" onchange=${()=>CambioOpcionesFecha(idTabReporteKardex)}>
                                                                    <span>Por Periodo</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="radio radio-styled">
                                                                <label>
                                                                    <input type="radio" name="optionsRadiosFF_${idTabReporteKardex}" id="optPorFechas_${idTabReporteKardex}" onchange=${()=>CambioOpcionesFecha(idTabReporteKardex)} checked>
                                                                    <span>Por fechas</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row" id="divFiltroFechas_${idTabReporteKardex}">
                                                    </div>
                                                </form>
                                            </div> 
                                        </div>
                                    </div><!--end .panel -->
                                    <div class="card panel">
                                        <div class="card-head card-head-sm" data-toggle="collapse" data-parent="#accordion3_${idTabReporteKardex}" data-target="#accordion3-1_${idTabReporteKardex}" aria-expanded="true">
                                            <header><i class="fa fa-filter"></i> Filtro de Almacenes</header>
                                            <div class="tools">
                                                <a class="btn btn-icon-toggle"><i class="fa fa-angle-down"></i></a>
                                            </div>
                                        </div>
                                        <div id="accordion3-1_${idTabReporteKardex}" class="collapse" aria-expanded="true" style="">
                                            <div class="card-body">						
                                                <form class="form">
                                                    <div class="form-group">
                                                        <select id="Cod_Almacen_${idTabReporteKardex}" class="form-control">
                                                            <option value="">Seleccione Almacen</option>
                                                            ${variables.almacenes.map(m=>
                                                                yo`<option value=${m.Cod_Almacen}>${m.Des_Almacen}</option>`
                                                            )}
                                                        </select>
                                                        <label>Almacen</label>
                                                    </div>
                                                </form>
                                            </div> 
                                        </div>
                                    </div><!--end .panel -->
                                    <div class="card panel">
                                        <div class="card-head card-head-sm collapsed" data-toggle="collapse" data-parent="#accordion3_${idTabReporteKardex}" data-target="#accordion3-3_${idTabReporteKardex}" aria-expanded="false">
                                            <header><i class="fa fa-filter"></i> Filtro Cliente/Proveedor y Producto/Servicio </header>
                                            <div class="tools">
                                                <a class="btn btn-icon-toggle"><i class="fa fa-angle-down"></i></a>
                                            </div>
                                        </div>
                                        <div id="accordion3-3_${idTabReporteKardex}" class="collapse" aria-expanded="false">
                                            <div class="card-body">	
                                                <form class="form">	
                                                    <div class="form-group">
                                                        <div class="input-group">
                                                            <div class="input-group-content">
                                                                <input type="text" class="form-control" id="Cliente_${idTabReporteKardex}" onkeyup=${()=>CambioNombreClienteReporte(event,idTabReporteKardex)}> 
                                                                <label>Cliente/Proveedor</label>
                                                            </div>
                                                            <div class="input-group-btn">
                                                                <button class="btn btn-success" type="button" onclick=${()=>BuscarCliente("Cliente_"+idTabReporteKardex,null,null)}><i class="fa fa-search"></i> Buscar</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div class="form-group">
                                                        <select id="Cod_Categoria_${idTabReporteKardex}" class="form-control">
                                                            <option value="">Seleccione Categoria</option>
                                                            ${variables.categorias.map(m=>
                                                                yo`<option value=${m.Cod_Categoria}>${m.Des_Categoria}</option>`
                                                            )}
                                                        </select>
                                                        <label>Categoria</label>
                                                    </div>

                                                    <div class="form-group">
                                                        <div class="input-group">
                                                            <div class="input-group-content">
                                                                <input type="text" class="form-control" id="Producto_${idTabReporteKardex}" onkeyup=${()=>CambioNombreProductoReporte(event,idTabReporteKardex)}> 
                                                                <label>Producto/Servicio</label>
                                                            </div>
                                                            <div class="input-group-btn">
                                                                <button class="btn btn-success" type="button" onclick=${()=>BuscarProducto(true, $("#Producto_"+idTabReporteKardex).val())}><i class="fa fa-search"></i> Buscar</button>
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
                                    <button type="button" class="btn btn-primary btn-block" onclick=${()=>GenerarReporte(idTabReporteKardex,true,'Excel')}><i class="fa fa-file-excel-o"></i> Ver vista previa Excel del documento</button>
                                </div>
                            </div> 
                            <br>
                            <div class="row">
                                <div class="col-xs-12">
                                    <button type="button" class="btn btn-danger btn-block" onclick=${()=>GenerarReporte(idTabReporteKardex,true,'PDF')}><i class="fa fa-file-pdf-o"></i> Ver vista previa PDF del documento</button>
                                </div>
                            </div> 
                            <br>
                            <div class="row">
                                <div class="col-xs-12">
                                    <button type="button" class="btn btn-info btn-block hidden" id="btnAbrirNavegador_${idTabReporteKardex}" onclick=${()=>AbrirReporte(idTabReporteKardex)}><i class="fa fa-eye"></i> Abrir documento en otra pestaña</button>
                                </div>
                            </div> 
                            <br>
                            <div class="row">
                                <div class="col-xs-12">
                                    <button type="button" class="btn btn-success btn-block hidden" id="btnEnviarCorreo_${idTabReporteKardex}" onclick=${()=>AbrirDialogoEnviarMensaje(idTabReporteKardex)} ><i class="fa fa-envelope"></i> Enviar por correo</button>
                                </div>
                            </div> 
                        </div>
                        <div class="col-md-8"> 
                            <br>
                            <div class="row">
                                <div class="col-xs-12">
                                    <div id="divExcel_${idTabReporteKardex}" class="text-center hidden" style="height: 600px;" >
                            
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
 

    if($("#tab_"+idTabReporteKardex).length){   
        $('#tab_'+idTabReporteKardex).remove()
        $('#id_'+idTabReporteKardex).parents('li').remove()

        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    }else{
        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    } 
    $("#id_"+idTabReporteKardex).click() 

    $('#modal-superior').off('hidden.bs.modal').on('hidden.bs.modal', function () {
        if(global.objProducto!=''){
            $("#Producto_"+IdTabSeleccionado).val(global.objProducto.Nom_Producto)
            $("#Producto_"+IdTabSeleccionado).attr("data-id",global.objProducto.Id_Producto)
            global.variablesReporteKardex[IdTabSeleccionado].flag_producto = true 
        }

        if(global.objCliente!=''){
            $("#Cliente_"+IdTabSeleccionado).val(global.objCliente.Cliente)
            $("#Cliente_"+IdTabSeleccionado).attr("data-id",global.objCliente.Id_ClienteProveedor)
            global.variablesReporteKardex[IdTabSeleccionado].flag_cliente = true
        }
    })
 
    CambioOpcionesFecha(idTabReporteKardex) 
}

function AbrirDialogoEnviarMensaje(idTab){

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
                    console.log(global.variablesReporteKardex[idTab].dataBase64)
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
                            arregloAttachment:global.variablesReporteKardex[idTab].dataBase64
                        })
                    }
                    fetch(URL + '/empresa_api/send_email_report', parametros)
                        .then(req => req.json())
                        .then(res => {
                            console.log(res)
                            if(res.respuesta=='ok'){
                                dialog.dockmodal("close");
                                global.variablesReporteKardex[idTab].dataBase64=[] 
                                toastr.success('Se envio correctamente el mensaje','Confirmacion',{timeOut: 5000})
                            }else{
                                $("#divError_"+idTab).removeClass("hidden")
                                if(res.detalle_error.code=='EENVELOPE'){
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
    GenerarReporteEmail(idTab,false)
}

function LlenarReportesCorreo(idTab,tituloReporte){
    var el = yo`<ul class="list divider-full-bleed" id="listReportes_${idTab}">
            ${global.variablesReporteKardex[idTab].dataBase64.map((e,index) => 
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
    for (var i in global.variablesReporteKardex[idTab].dataBase64) { 
        if (global.variablesReporteKardex[idTab].dataBase64[i].tipo == reporte.tipo) {
            global.variablesReporteKardex[idTab].dataBase64.splice(i, 1)
            break 
        }
    } 
    LlenarReportesCorreo(idTab,titulo) 
}

function GenerarReporteEmail(idTab,flag_preview){
    global.variablesReporteKardex[idTab].dataBase64=[]
    run_waitMe($('#dialogo_docker_'+idTab), 1, "ios","Subiendo reporte para su envio....");
    switch($("#Cod_Opcion_"+idTab).val()){
        case '01':
            ReporteGeneralEmail(idTab,"ReporteKardex_Excel",'Cod_Producto',flag_preview,"Excel",function(flag,result){ 
                if(flag){
                    ReporteGeneralEmail(idTab,"ReporteKardex_PDF",'Cod_Producto',flag_preview,"PDF",function(flag,result){ 
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
            ReporteDetalladoEmail(idTab,"ReporteKardex_Excel",'Cod_Producto',flag_preview,"Excel",function(flag,result){ 
                if(flag){
                    ReporteDetalladoEmail(idTab,"ReporteKardex_PDF",'Cod_Producto',flag_preview,"PDF",function(flag,result){ 
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

function CambioOpcionesFecha(idTab){
    const fecha = new Date()
    var anio = fecha.getFullYear() 

    if ($('#optPorPeriodo_'+idTab).is(':checked')) {
        let el = yo`
        <div>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group"> 
                        <input type="number" class="form-control" id="DeGestion_${idTab}" value=${anio}  onkeyup=${()=>TraerPeriodos(idTab,1)} onchange=${()=>TraerPeriodos(idTab,1)}> 
                        <label>Gestion</label>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group"> 
                        <label>Periodo</label>
                        <select id="DePeriodo_${idTab}" class="form-control"> 
                            <option style="text-transform:uppercase"></option>
                        </select>
                    </div>
                </div>
            </div> 
        </div>
        `
        let contenedor = document.getElementById('divFiltroFechas_'+idTab);
        empty(contenedor).appendChild(el); 
        TraerPeriodos(idTab) 
    }else{
        let el = yo`
        <div>
            <div class="row">
                <div class="col-md-12">
                    <div class="form-group"> 
                        <input type="date" class="form-control" id="FechaInicio_${idTab}" value="${MesActual('I')}"> 
                        <label>De la fecha:</label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="form-group"> 
                        <input type="date" class="form-control" id="FechaFin_${idTab}" value="${MesActual('F')}"> 
                        <label>Hasta la fecha:</label>
                    </div>
                </div>
            </div>
        </div>
        `
        let contenedor = document.getElementById('divFiltroFechas_'+idTab);
        empty(contenedor).appendChild(el); 
    }
}

function LlenarPeriodo(periodos,idTab){
    var el = yo`
        ${periodos.map(e => yo`
             <option value="${e.Cod_Periodo}">${e.Nom_Periodo}</option>
        `)}`   
    $("#DePeriodo_"+idTab).html('')
    $("#DePeriodo_"+idTab).html(el) 
   
}
 
function CambioNombreClienteReporte(e,idTab){ 
    if(e.which == 46 || e.which == 8){ 
        if(global.variablesReporteKardex[idTab].flag_cliente){
            $("#Cliente_"+idTab).val("")
            $("#Cliente_"+idTab).attr("data-id",null)
            global.variablesReporteKardex[idTab].flag_cliente=false
        }
    } 
}

function CambioNombreProductoReporte(e,idTab){ 
    if(e.which == 46 || e.which == 8){ 
        if(global.variablesReporteKardex[idTab].flag_producto){
            $("#Producto_"+idTab).val("")
            $("#Producto_"+idTab).attr("data-id",null)
            global.variablesReporteKardex[idTab].flag_producto=false
        }
    } 
}

function TraerPeriodos(idTab){ 
    var Gestion =  $("#DeGestion_"+idTab).val()
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
            LlenarPeriodo(res.data.periodos,idTab) 
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos. Inténtelo nuevamente refrescando la pantalla','Error',{timeOut: 5000})
        });
} 

function TabSeleccionado(idTab){ 
    global.objCliente = ''
    global.objProducto = ''
    IdTabSeleccionado = idTab 
}

 
function CerrarTabReporteKardex(idTab){ 
    $('#tab_'+idTab).remove()
    $('#id_'+idTab).parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show');
    delete global.variablesReporteKardex[idTab]
    $("#dialogo_docker_"+idTab).dockmodal("close");
    IdTabSeleccionado = null
}

function AbrirReporte(idTab){
   
    if(global.variablesReporteKardex[idTab].excel){
        if(global.variablesReporteKardex[idTab].excel!=null){
            var tabOrWindow = window.open(global.variablesReporteKardex[idTab].excel, '_blank');
            tabOrWindow.focus();
        }else{
            if(global.variablesReporteKardex[idTab].pdf!=null){
                let pdfWindow = window.open("")
                pdfWindow.document.write("<iframe width='100%' height='100%' src='"+global.variablesReporteKardex[idTab].pdf.replace('data:null','data:application/pdf')+"'></iframe>")
            }else{
                toastr.error('No se puede abrir el documento','Error',{timeOut: 5000}) 
            } 
        }
    }else{
        if(global.variablesReporteKardex[idTab].pdf){
            if(global.variablesReporteKardex[idTab].pdf!=null){ 
                let pdfWindow = window.open("")
                pdfWindow.document.write("<iframe width='100%' height='100%' src='"+global.variablesReporteKardex[idTab].pdf.replace('data:null','data:application/pdf')+"'></iframe>")
            }else{
                toastr.error('No se puede abrir el documento','Error',{timeOut: 5000}) 
            }
        }else{
            toastr.error('No se puede abrir el documento','Error',{timeOut: 5000}) 
        }
    }
}   

function ReporteGeneral(idTab,TipoReporte,ParametroOrden,flag_preview,Tipo){
    $("#btnAbrirNavegador_"+idTab).addClass("hidden") 
    $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
    $("#divExcel_"+idTab).removeClass("hidden")
    $("#divExcel_"+idTab).html('<div style="margin-top:100px">'+
        '<br/><br/>'+
        '<i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i><br/><br/>'+
        '<label>Cargando vista previa....</label>'+
    '</div>') 
    var Flag_Contable = ($('input[name=rbOpciones_'+idTab+']:checked').val()=="Contable_"+idTab)?'1':'0'
    var Id_ClienteProveedor = arrayValidacion.includes($("#Cliente_"+idTab).attr("data-id"))?0:parseInt($("#Cliente_"+idTab).attr("data-id"))
    var Id_producto = arrayValidacion.includes($("#Producto_"+idTab).attr("data-id"))?0:parseInt($("#Producto_"+idTab).attr("data-id"))
    var FechaInicio = arrayValidacion.includes($("#FechaInicio_"+idTab).val())?null:$("#FechaInicio_"+idTab).val()
    var FechaFin = arrayValidacion.includes($("#FechaFin_"+idTab).val())?null:$("#FechaFin_"+idTab).val()
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
            console.log(res)
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
                        switch(Tipo){
                            case 'Excel':
                                var html = $(res.toString())  
                                if(html[1]){  
                                    $('#divExcel_'+idTab).html(html[1]) 
                                    $("#btnAbrirNavegador_"+idTab).removeClass("hidden") 
                                    $("#btnEnviarCorreo_"+idTab).removeClass("hidden")
                                    global.variablesReporteKardex[idTab].excel = html[1].src
                                }else{
                                    $('#divExcel_'+idTab).html(res.toString())
                                    global.variablesReporteKardex[idTab].excel = null
                                }
                                break
                            case 'PDF':
                                $('#divExcel_'+idTab).html('<iframe src="'+res.toDataURI().replace("data:null","data:application/pdf;base64")+'" height="100%" width="100%"></iframe>') 
                                $("#btnEnviarCorreo_"+idTab).removeClass("hidden")
                                $("#btnAbrirNavegador_"+idTab).removeClass("hidden")
                                global.variablesReporteKardex[idTab].excel = null
                                global.variablesReporteKardex[idTab].pdf = res.toDataURI()
                                break
                        }    
                    }).catch(function (e) { 
                        console.log(e)
                        $("#divExcel_"+idTab).addClass("hidden")
                        $("#btnAbrirNavegador_"+idTab).addClass("hidden")
                        $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
                        global.variablesReporteKardex[idTab].excel = null
                        global.variablesReporteKardex[idTab].pdf = null
                        toastr.error('Hubo un error al generar el documento. Tipo error : '+e.statusText,'Error',{timeOut: 5000}) 
                    });
                }else{
                    toastr.warning("No existen datos para mostrar",'Error',{timeOut: 5000})
                    $("#btnAbrirNavegador_"+idTab).addClass("hidden")
                    $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
                    $("#divExcel_"+idTab).addClass("hidden")
                    global.variablesReporteKardex[idTab].excel = null
                    global.variablesReporteKardex[idTab].pdf = null
                }
            }else{
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+res.detalle_error,'Error',{timeOut: 5000})
                $("#btnAbrirNavegador_"+idTab).addClass("hidden")
                $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
                $("#divExcel_"+idTab).addClass("hidden")
                global.variablesReporteKardex[idTab].excel = null
                global.variablesReporteKardex[idTab].pdf = null
            } 
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $("#btnAbrirNavegador_"+idTab).addClass("hidden")
            $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
            $("#divExcel_"+idTab).addClass("hidden")
            global.variablesReporteKardex[idTab].excel = null
            global.variablesReporteKardex[idTab].pdf = null
        });
}
 
function ReporteDetallado(idTab,TipoReporte,ParametroOrden,flag_preview,Tipo){
    $("#btnAbrirNavegador_"+idTab).addClass("hidden") 
    $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
    $("#divExcel_"+idTab).removeClass("hidden")
    $("#divExcel_"+idTab).html('<div style="margin-top:100px">'+
        '<br/><br/>'+
        '<i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i><br/><br/>'+
        '<label>Cargando vista previa....</label>'+
    '</div>') 
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
            console.log(res)
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
                        switch(Tipo){
                            case 'Excel':
                                var html = $(res.toString())  
                                if(html[1]){  
                                    $('#divExcel_'+idTab).html(html[1]) 
                                    $("#btnAbrirNavegador_"+idTab).removeClass("hidden") 
                                    $("#btnEnviarCorreo_"+idTab).removeClass("hidden")
                                    global.variablesReporteKardex[idTab].excel = html[1].src
                                }else{
                                    $('#divExcel_'+idTab).html(res.toString())
                                    global.variablesReporteKardex[idTab].excel = null
                                }
                                break
                            case 'PDF':
                                $('#divExcel_'+idTab).html('<iframe src="'+res.toDataURI().replace("data:null","data:application/pdf;base64")+'" height="100%" width="100%"></iframe>') 
                                $("#btnEnviarCorreo_"+idTab).removeClass("hidden")
                                $("#btnAbrirNavegador_"+idTab).removeClass("hidden")
                                global.variablesReporteKardex[idTab].excel = null
                                global.variablesReporteKardex[idTab].pdf = res.toDataURI()
                                break
                        }    
                    }).catch(function (e) { 
                        console.log(e)
                        $("#divExcel_"+idTab).addClass("hidden")
                        $("#btnAbrirNavegador_"+idTab).addClass("hidden")
                        $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
                        global.variablesReporteKardex[idTab].excel = null
                        global.variablesReporteKardex[idTab].pdf = null
                        toastr.error('Hubo un error al generar el documento. Tipo error : '+e.statusText,'Error',{timeOut: 5000}) 
                    });
                }else{
                    toastr.warning("No existen datos para mostrar",'Error',{timeOut: 5000})
                    $("#btnAbrirNavegador_"+idTab).addClass("hidden")
                    $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
                    $("#divExcel_"+idTab).addClass("hidden")
                    global.variablesReporteKardex[idTab].excel = null
                    global.variablesReporteKardex[idTab].pdf = null
                }
            }else{
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+res.detalle_error,'Error',{timeOut: 5000})
                $("#btnAbrirNavegador_"+idTab).addClass("hidden")
                $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
                $("#divExcel_"+idTab).addClass("hidden")
                global.variablesReporteKardex[idTab].excel = null
                global.variablesReporteKardex[idTab].pdf = null
            } 
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $("#btnAbrirNavegador_"+idTab).addClass("hidden")
            $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
            $("#divExcel_"+idTab).addClass("hidden")
            global.variablesReporteKardex[idTab].excel = null
            global.variablesReporteKardex[idTab].pdf = null
        });
}

function GenerarReporte(idTab,flag_preview,Tipo){  
    switch($("#Cod_Opcion_"+idTab).val()){
        case '01':
            ReporteGeneral(idTab,"ReporteKardex_"+Tipo,'Cod_Producto',flag_preview,Tipo)
            break
        case '02':
            ReporteDetallado(idTab,"ReporteKardex_"+Tipo,'Cod_Producto',flag_preview,Tipo)
            break
    }
}

function NuevoReporteKardex() { 
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
    fetch(URL + '/reporte_api/get_variables_reporte_kardex', parametros)
        .then(req => req.json())
        .then(res => { 
            var variables = res.data 
            if (res.respuesta == 'ok') {
                Ver(variables)
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

export { NuevoReporteKardex }