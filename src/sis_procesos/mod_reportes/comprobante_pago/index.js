var empty = require('empty-element');
var yo = require('yo-yo'); 

import { URL, URL_REPORT } from '../../../constantes_entorno/constantes'
import { BuscarCliente, BuscarProducto } from '../../modales' 
import { MesActual } from '../../../../utility/tools' 
import { ReporteGeneralEmail,ReporteAuxiliarDetalladoEmail,ReporteAuxiliarEmail,ReporteAuxiliarDetalladoFormaPagoEmail } from './functions'

var cantidad_tabs = 0
var arrayValidacion = [null,'null','',undefined]
global.variablesReporteComprobante = {}
var IdTabSeleccionado = null

function Ver(variables,CodLibro) {

    global.objCliente = ''
    global.objProducto = ''

    //cantidad_tabs++
    const idTabReporteComprobante = CodLibro=='08'?("ReporteComprobanteCompra_"+cantidad_tabs):"ReporteComprobanteVenta_"+cantidad_tabs
    IdTabSeleccionado = idTabReporteComprobante
    global.variablesReporteComprobante[idTabReporteComprobante]={idTab:idTabReporteComprobante,flag_cliente:false,flag_producto:false,excel:null, dataBase64:[]}
    
    var tab = yo`
    <li class=""  onclick=${()=>TabSeleccionado(idTabReporteComprobante)}><a href="#tab_${idTabReporteComprobante}" data-toggle="tab" aria-expanded="false" id="id_${idTabReporteComprobante}">${CodLibro=='08'?'Reporte de Compras':'Reporte de Ventas'} <a style="padding-left: 10px;"  onclick=${()=>CerrarTabReporteComprobante(idTabReporteComprobante)} class="btn"><i class="fa fa-close text-danger"></i></a></a></li>`


    var el = yo`
        <div class="tab-pane" id="tab_${idTabReporteComprobante}">
            <div class="panel">

                <div class="modal"> 
                    <div id="dialogo_docker_${idTabReporteComprobante}">
                        
                    </div> 
                </div> 

                <div class="panel-body">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="row">
                                <div class="form-group"> 
                                    <label>Seleccione un tipo de reporte</label>
                                    <select id="Cod_Opcion_${idTabReporteComprobante}" class="form-control"> 
                                        <option style="text-transform:uppercase" value="01">${CodLibro=='08'?'Planilla de compras diarias':'Planilla de venta diarias'}</option>
                                        <option style="text-transform:uppercase" value="02">Total por cliente</option> 
                                        <option style="text-transform:uppercase" value="03">Total por documento</option> 
                                        <option style="text-transform:uppercase" value="04">Total por producto</option> 
                                        <option style="text-transform:uppercase" value="05">Detallado por cliente</option> 
                                        <option style="text-transform:uppercase" value="06">Detallado por documento</option> 
                                        <option style="text-transform:uppercase" value="07">Detallado por producto</option> 
                                        <option style="text-transform:uppercase" value="08">Documentos anulados</option> 
                                        <option style="text-transform:uppercase" value="09">Registro auxiliar</option> 
                                        <option style="text-transform:uppercase" value="10">Registro auxiliar detallado</option> 
                                        <option style="text-transform:uppercase" value="11">Registro auxiliar con forma de pago</option> 
                                    </select>
                                </div>
                            </div>

                            <div class="row">
                                <div class="panel-group" id="accordion3_${idTabReporteComprobante}">
                                    <div class="card panel expanded">
                                        <div class="card-head card-head-sm collapsed" data-toggle="collapse" data-parent="#accordion3_${idTabReporteComprobante}" data-target="#accordion3-2_${idTabReporteComprobante}" aria-expanded="false">
                                            <header><i class="fa fa-filter"></i> Filtro de Fechas y Turnos</header>
                                            <div class="tools">
                                                <a class="btn btn-icon-toggle"><i class="fa fa-angle-down"></i></a>
                                            </div>
                                        </div>
                                        <div id="accordion3-2_${idTabReporteComprobante}" class="collapse in" aria-expanded="true">
                                            <div class="card-body">	
                                                <form class="form">
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <div class="radio radio-styled">
                                                                <label>
                                                                    <input type="radio" name="optionsRadiosFF_${idTabReporteComprobante}" id="optPorTurno_${idTabReporteComprobante}" onchange=${()=>CambioOpcionesFecha(idTabReporteComprobante)}>
                                                                    <span>Por turno</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="radio radio-styled">
                                                                <label>
                                                                    <input type="radio" name="optionsRadiosFF_${idTabReporteComprobante}" id="optPorFechas_${idTabReporteComprobante}" onchange=${()=>CambioOpcionesFecha(idTabReporteComprobante)} checked>
                                                                    <span>Por fechas</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row" id="divFiltroFechas_${idTabReporteComprobante}">
                                                    </div>
                                                </form>
                                            </div> 
                                        </div>
                                    </div><!--end .panel -->
                                    <div class="card panel">
                                        <div class="card-head card-head-sm" data-toggle="collapse" data-parent="#accordion3_${idTabReporteComprobante}" data-target="#accordion3-1_${idTabReporteComprobante}" aria-expanded="true">
                                            <header><i class="fa fa-filter"></i> Filtro de Oficinas y Cuentas</header>
                                            <div class="tools">
                                                <a class="btn btn-icon-toggle"><i class="fa fa-angle-down"></i></a>
                                            </div>
                                        </div>
                                        <div id="accordion3-1_${idTabReporteComprobante}" class="collapse" aria-expanded="true" style="">
                                            <div class="card-body">						
                                                <form class="form">
                                                    <div class="form-group">
                                                        <select id="Cod_Sucursal_${idTabReporteComprobante}" class="form-control" onchange=${()=>CambioSucursalReporte(idTabReporteComprobante)}>
                                                            <option value="">Seleccione Sucursal</option>
                                                            ${variables.sucursales.map(m=>
                                                                yo`<option value=${m.Cod_Sucursal}>${m.Nom_Sucursal}</option>`
                                                            )}
                                                        </select>
                                                        <label>Sucursal</label>
                                                    </div>
                                                    <div class="form-group">
                                                        <select id="Cod_Caja_${idTabReporteComprobante}" class="form-control">
                                                            
                                                        </select>
                                                        <label>Caja</label>
                                                    </div>
                                                    <div class="form-group">
                                                        <select id="Cod_Comprobante_${idTabReporteComprobante}" class="form-control">
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
                                                                <select id="Cod_Moneda_${idTabReporteComprobante}" class="form-control">
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
                                                                <input type="text" class="form-control" id="Serie_${idTabReporteComprobante}">
                                                                <label>Serie</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <select id="Cod_Categoria_${idTabReporteComprobante}" class="form-control">
                                                            <option value="">Seleccione Categoria</option>
                                                            ${variables.categorias.map(m=>
                                                                yo`<option value=${m.Cod_Categoria}>${m.Des_Categoria}</option>`
                                                            )}
                                                        </select>
                                                        <label>Categoria</label>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-4">
                                                            <div class="radio radio-styled">
                                                                <label>
                                                                    <input type="radio" name="optionsRadios_${idTabReporteComprobante}" onchange=${()=>CambioOpciones(idTabReporteComprobante)} id="Todos_${idTabReporteComprobante}" value="todos" checked>
                                                                    <span>Todos</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-4">
                                                            <div class="radio radio-styled">
                                                                <label>
                                                                    <input type="radio" name="optionsRadios_${idTabReporteComprobante}" id="Contado_${idTabReporteComprobante}" onchange=${()=>CambioOpciones(idTabReporteComprobante)} value="contado">
                                                                    <span>Contado</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-4">
                                                            <div class="radio radio-styled">
                                                                <label>
                                                                    <input type="radio" name="optionsRadios_${idTabReporteComprobante}" id="Credito_${idTabReporteComprobante}" onchange=${()=>CambioOpciones(idTabReporteComprobante)} value="credito">
                                                                    <span>Credito</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group" id="divFormaPago_${idTabReporteComprobante}" style="display:none">
                                                        <select id="Cod_Forma_Pago_${idTabReporteComprobante}" class="form-control"> 
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
                                        <div class="card-head card-head-sm collapsed" data-toggle="collapse" data-parent="#accordion3_${idTabReporteComprobante}" data-target="#accordion3-3_${idTabReporteComprobante}" aria-expanded="false">
                                            <header><i class="fa fa-filter"></i> Filtro Cliente/Proveedor y Producto/Servicio </header>
                                            <div class="tools">
                                                <a class="btn btn-icon-toggle"><i class="fa fa-angle-down"></i></a>
                                            </div>
                                        </div>
                                        <div id="accordion3-3_${idTabReporteComprobante}" class="collapse" aria-expanded="false">
                                            <div class="card-body">	
                                                <form class="form">	
                                                    <div class="form-group">
                                                        <div class="input-group">
                                                            <div class="input-group-content">
                                                                <input type="text" class="form-control" id="Cliente_${idTabReporteComprobante}" onkeyup=${()=>CambioNombreClienteReporte(event,idTabReporteComprobante)}> 
                                                                <label>Cliente/Proveedor</label>
                                                            </div>
                                                            <div class="input-group-btn">
                                                                <button class="btn btn-success" type="button" onclick=${()=>BuscarCliente("Cliente_"+idTabReporteComprobante,null,null)}><i class="fa fa-search"></i> Buscar</button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="form-group">
                                                        <div class="input-group">
                                                            <div class="input-group-content">
                                                                <input type="text" class="form-control" id="Producto_${idTabReporteComprobante}" onkeyup=${()=>CambioNombreProductoReporte(event,idTabReporteComprobante)}> 
                                                                <label>Producto/Servicio</label>
                                                            </div>
                                                            <div class="input-group-btn">
                                                                <button class="btn btn-success" type="button" onclick=${()=>BuscarProducto(true, $("#Producto_"+idTabReporteComprobante).val())}><i class="fa fa-search"></i> Buscar</button>
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
                                    <button type="button" class="btn btn-primary btn-block" onclick=${()=>GenerarReporte(idTabReporteComprobante,CodLibro,true,'Excel')}><i class="fa fa-file-excel-o"></i> Ver vista previa Excel del documento</button>
                                </div>
                            </div> 
                            <br>
                            <div class="row">
                                <div class="col-xs-12">
                                    <button type="button" class="btn btn-danger btn-block" onclick=${()=>GenerarReporte(idTabReporteComprobante,CodLibro,true,'PDF')}><i class="fa fa-file-pdf-o"></i> Ver vista previa PDF del documento</button>
                                </div>
                            </div> 
                            <br>
                            <div class="row">
                                <div class="col-xs-12">
                                    <button type="button" class="btn btn-info btn-block hidden" id="btnAbrirNavegador_${idTabReporteComprobante}" onclick=${()=>AbrirReporte(idTabReporteComprobante,CodLibro)}><i class="fa fa-eye"></i> Abrir documento en otra pestaña</button>
                                </div>
                            </div> 
                            <br>
                            <div class="row">
                                <div class="col-xs-12">
                                    <button type="button" class="btn btn-success btn-block hidden" id="btnEnviarCorreo_${idTabReporteComprobante}" onclick=${()=>AbrirDialogoEnviarMensaje(idTabReporteComprobante,CodLibro)} ><i class="fa fa-envelope"></i> Enviar por correo</button>
                                </div>
                            </div> 
                        </div>
                        <div class="col-md-8"> 
                            <br>
                            <div class="row">
                                <div class="col-xs-12">
                                    <div id="divExcel_${idTabReporteComprobante}" class="text-center hidden" style="height: 600px;" >
                            
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
 

    if($("#tab_"+idTabReporteComprobante).length){   
        $('#tab_'+idTabReporteComprobante).remove()
        $('#id_'+idTabReporteComprobante).parents('li').remove()

        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    }else{
        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    } 
    $("#id_"+idTabReporteComprobante).click() 

    $('#modal-superior').off('hidden.bs.modal').on('hidden.bs.modal', function () {
        if(global.objProducto!=''){
            $("#Producto_"+IdTabSeleccionado).val(global.objProducto.Nom_Producto)
            $("#Producto_"+IdTabSeleccionado).attr("data-id",global.objProducto.Id_Producto)
            global.variablesReporteComprobante[IdTabSeleccionado].flag_producto = true 
        }

        if(global.objCliente!=''){
            $("#Cliente_"+IdTabSeleccionado).val(global.objCliente.Cliente)
            $("#Cliente_"+IdTabSeleccionado).attr("data-id",global.objCliente.Id_ClienteProveedor)
            global.variablesReporteComprobante[IdTabSeleccionado].flag_cliente = true
        }
    })

    TraerPeriodos(idTabReporteComprobante,1)
    TraerPeriodos(idTabReporteComprobante,2)
    CambioOpcionesFecha(idTabReporteComprobante) 
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
                            arregloAttachment:global.variablesReporteComprobante[idTab].dataBase64
                        })
                    }
                    fetch(URL + '/empresa_api/send_email_report', parametros)
                        .then(req => req.json())
                        .then(res => { 
                            if(res.respuesta=='ok'){
                                dialog.dockmodal("close");
                                global.variablesReporteComprobante[idTab].dataBase64=[] 
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
    GenerarReporteEmail(idTab,Cod_Libro,false)
}

function LlenarCajas(cajas,idTab){
    $("#Cod_Caja_"+idTab).html('')
    var html = '<option value="">Seleccione Caja</option>'
    for(var i=0; i<cajas.length; i++){
        html = html+'<option value="'+cajas[i].Cod_Caja+'">'+cajas[i].Des_Caja+'</option>'
    }
    $("#Cod_Caja_"+idTab).html(html) 
}

function CambioOpciones(idTab){

    if ($('#Credito_'+idTab).is(':checked')) {
        $("#divFormaPago_"+idTab).css("display","block")
    }else{
        $("#divFormaPago_"+idTab).css("display","none")
    }
}

function LlenarReportesCorreo(idTab,tituloReporte){
    var el = yo`<ul class="list divider-full-bleed" id="listReportes_${idTab}">
            ${global.variablesReporteComprobante[idTab].dataBase64.map((e,index) => 
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
    for (var i in global.variablesReporteComprobante[idTab].dataBase64) { 
        if (global.variablesReporteComprobante[idTab].dataBase64[i].tipo == reporte.tipo) {
            global.variablesReporteComprobante[idTab].dataBase64.splice(i, 1)
            break 
        }
    } 
    LlenarReportesCorreo(idTab,titulo) 
}

function GenerarReporteEmail(idTab,Cod_Libro,flag_preview){
    global.variablesReporteComprobante[idTab].dataBase64=[]
    run_waitMe($('#dialogo_docker_'+idTab), 1, "ios","Subiendo reporte para su envio....");
    switch($("#Cod_Opcion_"+idTab).val()){
        case '01': 
            ReporteGeneralEmail(idTab,Cod_Libro,"ReportePlanillaDiaria_Excel",null,flag_preview,function(flag,result){ 
                if(flag){
                    ReporteGeneralEmail(idTab,Cod_Libro,"ReportePlanillaDiaria_PDF",null,flag_preview,function(flag,result){
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
            ReporteGeneralEmail(idTab,Cod_Libro,"ReporteXTotalCliente_Excel",null,flag_preview,function(flag,result){ 
                if(flag){
                    ReporteGeneralEmail(idTab,Cod_Libro,"ReporteXTotalCliente_PDF",null,flag_preview,function(flag,result){
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
        case '03':
            ReporteGeneralEmail(idTab,Cod_Libro,"ReporteXTotalDocumento_Excel",null,flag_preview,function(flag,result){ 
                if(flag){
                    ReporteGeneralEmail(idTab,Cod_Libro,"ReporteXTotalDocumento_PDF",null,flag_preview,function(flag,result){
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
        case '04':
            ReporteGeneralEmail(idTab,Cod_Libro,"ReporteXTotalDocumento_Excel",null,flag_preview,function(flag,result){ 
                if(flag){
                    ReporteGeneralEmail(idTab,Cod_Libro,"ReporteXTotalDocumento_PDF",null,flag_preview,function(flag,result){
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
        case '05':
            ReporteGeneralEmail(idTab,Cod_Libro,"ReporteXCliente_Excel",null,flag_preview,function(flag,result){ 
                if(flag){
                    ReporteGeneralEmail(idTab,Cod_Libro,"ReporteXCliente_PDF",null,flag_preview,function(flag,result){
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
        case '06':
            ReporteGeneralEmail(idTab,Cod_Libro,"ReporteXDocumento_Excel",null,flag_preview,function(flag,result){ 
                if(flag){
                    ReporteGeneralEmail(idTab,Cod_Libro,"ReporteXDocumento_PDF",null,flag_preview,function(flag,result){
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
        case '07':
            ReporteGeneralEmail(idTab,Cod_Libro,"ReporteXProducto_Excel",null,flag_preview,function(flag,result){ 
                if(flag){
                    ReporteGeneralEmail(idTab,Cod_Libro,"ReporteXProducto_PDF",null,flag_preview,function(flag,result){
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
        case '08':
            ReporteGeneralEmail(idTab,Cod_Libro,"ReporteXAnulados_Excel",null,flag_preview,function(flag,result){ 
                if(flag){
                    ReporteGeneralEmail(idTab,Cod_Libro,"ReporteXAnulados_PDF",null,flag_preview,function(flag,result){
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
        case '09':
            ReporteAuxiliarEmail(idTab,Cod_Libro,"ReporteComprobanteCompra_Excel",null,flag_preview,function(flag,result){ 
                if(flag){
                    ReporteAuxiliarEmail(idTab,Cod_Libro,"ReporteComprobanteCompra_PDF",null,flag_preview,function(flag,result){
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
        case '10':
            ReporteAuxiliarDetalladoEmail(idTab,Cod_Libro,"ReporteRegistroAuxiliarDetallado_Excel",null,flag_preview,function(flag,result){ 
                if(flag){
                    ReporteAuxiliarDetalladoEmail(idTab,Cod_Libro,"ReporteRegistroAuxiliarDetallado_PDF",null,flag_preview,function(flag,result){
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
        case '11':
            ReporteAuxiliarDetalladoFormaPagoEmail(idTab,Cod_Libro,"ReporteRegistroAuxiliarDetalladoFormaPago_Excel",null,flag_preview,function(flag,result){ 
                if(flag){
                    ReporteAuxiliarDetalladoFormaPagoEmail(idTab,Cod_Libro,"ReporteRegistroAuxiliarDetalladoFormaPago_PDF",null,flag_preview,function(flag,result){
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

    if ($('#optPorTurno_'+idTab).is(':checked')) {
        let el = yo`
        <div>
            <div class="row">
                <div class="col-md-12">
                    <label>De:</label>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group"> 
                        <input type="number" class="form-control" id="DeGestion_${idTab}" value=${anio}  onkeyup=${()=>TraerPeriodos(idTab,1)} onchange=${()=>TraerPeriodos(idTab,1)}> 
                        <label>Gestion</label>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group"> 
                        <label>Periodo</label>
                        <select id="DePeriodo_${idTab}" class="form-control" onchange=${()=>TraerTurnos(idTab,1)}> 
                            <option style="text-transform:uppercase"></option>
                        </select>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group"> 
                        <label>Turno</label>
                        <select id="DeTurno_${idTab}" class="form-control"> 
                            <option style="text-transform:uppercase"></option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <label>Al:</label>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group"> 
                        <input type="number" class="form-control" id="AlGestion_${idTab}" value=${anio}  onkeyup=${()=>TraerPeriodos(idTab,2)} onchange=${()=>TraerPeriodos(idTab,2)}> 
                        <label>Gestion</label>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group"> 
                        <label>Periodo</label>
                        <select id="AlPeriodo_${idTab}" class="form-control" onchange=${()=>TraerTurnos(idTab,2)}> 
                            <option style="text-transform:uppercase"></option>
                        </select>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group"> 
                        <label>Turno</label>
                        <select id="AlTurno_${idTab}" class="form-control"> 
                            <option style="text-transform:uppercase"></option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        `
        let contenedor = document.getElementById('divFiltroFechas_'+idTab);
        empty(contenedor).appendChild(el); 
        TraerPeriodos(idTab,1)
        TraerPeriodos(idTab,2)
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

function LlenarPeriodo(periodos,idTab,opcion){
    var el = yo`
        ${periodos.map(e => yo`
             <option value="${e.Cod_Periodo}">${e.Nom_Periodo}</option>
        `)}`
    if(opcion==1){   
        $("#DePeriodo_"+idTab).html('')
        $("#DePeriodo_"+idTab).html(el) 
    }else{
        $("#AlPeriodo_"+idTab).html('')
        $("#AlPeriodo_"+idTab).html(el) 
    }
}

function LlenarTurnos(turnos,idTab,opcion){
    var el = yo`
        ${turnos.map(e => yo`
             <option value="${e.Cod_Turno}">${e.Des_Turno}</option>
        `)}` 
    if(opcion==1){  
        $("#DeTurno_"+idTab).html('')
        $("#DeTurno_"+idTab).html(el)
    }else{
        $("#AlTurno_"+idTab).html('')
        $("#AlTurno_"+idTab).html(el)
    }
}

function CambioNombreClienteReporte(e,idTab){ 
    if(e.which == 46 || e.which == 8){ 
        if(global.variablesReporteComprobante[idTab].flag_cliente){
            $("#Cliente_"+idTab).val("")
            $("#Cliente_"+idTab).attr("data-id",null)
            global.variablesReporteComprobante[idTab].flag_cliente=false
        }
    } 
}

function CambioNombreProductoReporte(e,idTab){ 
    if(e.which == 46 || e.which == 8){ 
        if(global.variablesReporteComprobante[idTab].flag_producto){
            $("#Producto_"+idTab).val("")
            $("#Producto_"+idTab).attr("data-id",null)
            global.variablesReporteComprobante[idTab].flag_producto=false
        }
    } 
}

function TraerPeriodos(idTab,opcion){ 
    var Gestion = (opcion==1?$("#DeGestion_"+idTab).val():$("#AlGestion_"+idTab).val()) 
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
            LlenarPeriodo(res.data.periodos,idTab,opcion)
            TraerTurnos(idTab,opcion)
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos. Inténtelo nuevamente refrescando la pantalla','Error',{timeOut: 5000})
        });
}

function TraerTurnos(idTab,opcion){
    var Cod_Periodo = opcion==1?$("#DePeriodo_"+idTab).val():$("#AlPeriodo_"+idTab).val()
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
            LlenarTurnos(res.data.turnos,idTab,opcion)
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos. Inténtelo nuevamente refrescando la pantalla','Error',{timeOut: 5000})
        });
}

function CambioSucursalReporte(idTab){
    var Cod_Sucursal = $("#Cod_Sucursal_"+idTab).val()
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Cod_Sucursal
        })
    }
    fetch(URL + '/cajas_api/get_caja_by_sucursal', parametros)
        .then(req => req.json())
        .then(res => { 
            if(res.respuesta=='ok'){
                LlenarCajas(res.data.cajas,idTab)
            }else{
                $("#Cod_Caja_"+idTab).html('')
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos',{timeOut: 5000}) 
            }
        }).catch(function (e) {
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000}) 
        });
}

function TabSeleccionado(idTab){
    global.objCliente = ''
    global.objProducto = ''
    IdTabSeleccionado = idTab 
}


function CerrarTabReporteComprobante(idTab){ 
    $('#tab_'+idTab).remove()
    $('#id_'+idTab).parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show');
    delete global.variablesReporteComprobante[idTab]
    $("#dialogo_docker_"+idTab).dockmodal("close");
    IdTabSeleccionado = null
}

function AbrirReporte(idTab,Cod_Libro){
   
    if(global.variablesReporteComprobante[idTab].excel){
        if(global.variablesReporteComprobante[idTab].excel!=null){
            var tabOrWindow = window.open(global.variablesReporteComprobante[idTab].excel, '_blank');
            tabOrWindow.focus();
        }else{
            if(global.variablesReporteComprobante[idTab].pdf!=null){
                let pdfWindow = window.open("")
                pdfWindow.document.write("<iframe width='100%' height='100%' src='"+global.variablesReporteComprobante[idTab].pdf.replace('data:null','data:application/pdf')+"'></iframe>")
            }else{
                toastr.error('No se puede abrir el documento','Error',{timeOut: 5000}) 
            } 
        }
    }else{
        if(global.variablesReporteComprobante[idTab].pdf){
            if(global.variablesReporteComprobante[idTab].pdf!=null){ 
                let pdfWindow = window.open("")
                pdfWindow.document.write("<iframe width='100%' height='100%' src='"+global.variablesReporteComprobante[idTab].pdf.replace('data:null','data:application/pdf')+"'></iframe>")
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
                        switch(Tipo){
                            case 'Excel':
                                var html = $(res.toString())  
                                if(html[1]){  
                                    $('#divExcel_'+idTab).html(html[1]) 
                                    $("#btnAbrirNavegador_"+idTab).removeClass("hidden") 
                                    $("#btnEnviarCorreo_"+idTab).removeClass("hidden")
                                    global.variablesReporteComprobante[idTab].excel = html[1].src
                                }else{
                                    $('#divExcel_'+idTab).html(res.toString())
                                    global.variablesReporteComprobante[idTab].excel = null
                                }
                                break
                            case 'PDF':
                                $('#divExcel_'+idTab).html('<iframe src="'+res.toDataURI().replace("data:null","data:application/pdf;base64")+'" height="100%" width="100%"></iframe>') 
                                $("#btnEnviarCorreo_"+idTab).removeClass("hidden")
                                $("#btnAbrirNavegador_"+idTab).removeClass("hidden")
                                global.variablesReporteComprobante[idTab].excel = null
                                global.variablesReporteComprobante[idTab].pdf = res.toDataURI()
                                break
                        }    
                    }).catch(function (e) { 
                        console.log(e)
                        $("#divExcel_"+idTab).addClass("hidden")
                        $("#btnAbrirNavegador_"+idTab).addClass("hidden")
                        $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
                        global.variablesReporteComprobante[idTab].excel = null
                        global.variablesReporteComprobante[idTab].pdf = null
                        toastr.error('Hubo un error al generar el documento. Tipo error : '+e.statusText,'Error',{timeOut: 5000}) 
                    });
                }else{
                    toastr.warning("No existen datos para mostrar",'Error',{timeOut: 5000})
                    $("#btnAbrirNavegador_"+idTab).addClass("hidden")
                    $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
                    $("#divExcel_"+idTab).addClass("hidden")
                    global.variablesReporteComprobante[idTab].excel = null
                    global.variablesReporteComprobante[idTab].pdf = null
                }
            }else{
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+res.detalle_error,'Error',{timeOut: 5000})
                $("#btnAbrirNavegador_"+idTab).addClass("hidden")
                $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
                $("#divExcel_"+idTab).addClass("hidden")
                global.variablesReporteComprobante[idTab].excel = null
                global.variablesReporteComprobante[idTab].pdf = null
            } 
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $("#btnAbrirNavegador_"+idTab).addClass("hidden")
            $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
            $("#divExcel_"+idTab).addClass("hidden")
            global.variablesReporteComprobante[idTab].excel = null
            global.variablesReporteComprobante[idTab].pdf = null
        });
}

function ReporteAuxiliar(idTab,Cod_Libro,TipoReporte,ParametroOrden,flag_preview,Tipo){
    $("#btnAbrirNavegador_"+idTab).addClass("hidden")
    $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
    $("#divExcel_"+idTab).removeClass("hidden")
    $("#divExcel_"+idTab).html('<div style="margin-top:100px">'+
       '<br/><br/>'+
       '<i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i><br/><br/>'+
       '<label>Cargando vista previa....</label>'+
    '</div>') 
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
   //console.log(parametros)
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
                        switch(Tipo){
                            case 'Excel':
                                var html = $(res.toString())  
                                if(html[1]){  
                                    $('#divExcel_'+idTab).html(html[1]) 
                                    $("#btnAbrirNavegador_"+idTab).removeClass("hidden") 
                                    $("#btnEnviarCorreo_"+idTab).removeClass("hidden")
                                    global.variablesReporteComprobante[idTab].excel = html[1].src
                                }else{
                                    $('#divExcel_'+idTab).html(res.toString())
                                    global.variablesReporteComprobante[idTab].excel = null
                                }
                                break
                            case 'PDF':
                                $('#divExcel_'+idTab).html('<iframe src="'+res.toDataURI().replace("data:null","data:application/pdf;base64")+'" height="100%" width="100%"></iframe>') 
                                $("#btnEnviarCorreo_"+idTab).removeClass("hidden") 
                                $("#btnAbrirNavegador_"+idTab).removeClass("hidden")
                                global.variablesReporteComprobante[idTab].excel = null
                                global.variablesReporteComprobante[idTab].pdf = res.toDataURI()
                                break
                        }    
                   }).catch(function (e) { 
                       console.log(e)
                       $("#btnAbrirNavegador_"+idTab).addClass("hidden")
                       $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
                       $("#divExcel_"+idTab).addClass("hidden")
                       global.variablesReporteComprobante[idTab].excel = null
                       global.variablesReporteComprobante[idTab].pdf = null
                       toastr.error('Hubo un error al generar el documento. Tipo error : '+e.statusText,'Error',{timeOut: 5000}) 
                   });
               }else{
                   toastr.warning("No existen datos para mostrar",'Error',{timeOut: 5000})
                   $("#btnAbrirNavegador_"+idTab).addClass("hidden")
                   $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
                   $("#divExcel_"+idTab).addClass("hidden")
                   global.variablesReporteComprobante[idTab].excel = null
                   global.variablesReporteComprobante[idTab].pdf = null
               }
           }else{
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+res.detalle_error,'Error',{timeOut: 5000})
                $("#btnAbrirNavegador_"+idTab).addClass("hidden")
                $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
                $("#divExcel_"+idTab).addClass("hidden")
                global.variablesReporteComprobante[idTab].excel = null
                global.variablesReporteComprobante[idTab].pdf = null
           } 
       }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $("#btnAbrirNavegador_"+idTab).addClass("hidden")
            $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
            $("#divExcel_"+idTab).addClass("hidden")
            global.variablesReporteComprobante[idTab].excel = null
            global.variablesReporteComprobante[idTab].pdf = null
       });
}

function ReporteAuxiliarDetallado(idTab,Cod_Libro,TipoReporte,ParametroOrden,flag_preview,Tipo){
    $("#btnAbrirNavegador_"+idTab).addClass("hidden")
    $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
    $("#divExcel_"+idTab).removeClass("hidden")
    $("#divExcel_"+idTab).html('<div style="margin-top:100px">'+ 
       '<br/><br/>'+
       '<i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i><br/><br/>'+
       '<label>Cargando vista previa....</label>'+
    '</div>') 
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
                        switch(Tipo){
                            case 'Excel':
                                var html = $(res.toString())  
                                if(html[1]){  
                                    $('#divExcel_'+idTab).html(html[1]) 
                                    $("#btnAbrirNavegador_"+idTab).removeClass("hidden") 
                                    $("#btnEnviarCorreo_"+idTab).removeClass("hidden")
                                    global.variablesReporteComprobante[idTab].excel = html[1].src
                                }else{
                                    $('#divExcel_'+idTab).html(res.toString())
                                    global.variablesReporteComprobante[idTab].excel = null
                                }
                                break
                            case 'PDF':
                                $('#divExcel_'+idTab).html('<iframe src="'+res.toDataURI().replace("data:null","data:application/pdf;base64")+'" height="100%" width="100%"></iframe>') 
                                $("#btnEnviarCorreo_"+idTab).removeClass("hidden") 
                                $("#btnAbrirNavegador_"+idTab).removeClass("hidden")
                                global.variablesReporteComprobante[idTab].excel = null
                                global.variablesReporteComprobante[idTab].pdf = res.toDataURI()
                                break
                        }    
                   }).catch(function (e) { 
                       console.log(e)
                       $("#btnAbrirNavegador_"+idTab).addClass("hidden")
                       $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
                       $("#divExcel_"+idTab).addClass("hidden")
                       global.variablesReporteComprobante[idTab].excel = null
                       global.variablesReporteComprobante[idTab].pdf = null
                       toastr.error('Hubo un error al generar el documento. Tipo error : '+e.statusText,'Error',{timeOut: 5000}) 
                   });
               }else{
                    toastr.warning("No existen datos para mostrar",'Error',{timeOut: 5000})
                    $("#btnAbrirNavegador_"+idTab).addClass("hidden")
                    $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
                    $("#divExcel_"+idTab).addClass("hidden")
                    global.variablesReporteComprobante[idTab].excel = null
                    global.variablesReporteComprobante[idTab].pdf = null
               }
           }else{
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+res.detalle_error,'Error',{timeOut: 5000})
                $("#btnAbrirNavegador_"+idTab).addClass("hidden")
                $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
                $("#divExcel_"+idTab).addClass("hidden")
                global.variablesReporteComprobante[idTab].excel = null
                global.variablesReporteComprobante[idTab].pdf = null
           } 
       }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $("#btnAbrirNavegador_"+idTab).addClass("hidden")  
            $("#btnEnviarCorreo_"+idTab).addClass("hidden")    
            $("#divExcel_"+idTab).addClass("hidden")
            global.variablesReporteComprobante[idTab].excel = null
            global.variablesReporteComprobante[idTab].pdf = null
       });
}

function ReporteAuxiliarDetalladoFormaPago(idTab,Cod_Libro,TipoReporte,ParametroOrden,flag_cliente,flag_preview,Tipo){
    $("#btnAbrirNavegador_"+idTab).addClass("hidden")
    $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
    $("#divExcel_"+idTab).removeClass("hidden")
    $("#divExcel_"+idTab).html('<div style="margin-top:100px">'+ 
       '<br/><br/>'+
       '<i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i><br/><br/>'+
       '<label>Cargando vista previa....</label>'+
    '</div>') 
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
                        switch(Tipo){
                            case 'Excel':
                                var html = $(res.toString())  
                                if(html[1]){  
                                    $('#divExcel_'+idTab).html(html[1]) 
                                    $("#btnAbrirNavegador_"+idTab).removeClass("hidden") 
                                    $("#btnEnviarCorreo_"+idTab).removeClass("hidden")
                                    global.variablesReporteComprobante[idTab].excel = html[1].src
                                }else{
                                    $('#divExcel_'+idTab).html(res.toString())
                                    global.variablesReporteComprobante[idTab].excel = null
                                }
                                break
                            case 'PDF':
                                $('#divExcel_'+idTab).html('<iframe src="'+res.toDataURI().replace("data:null","data:application/pdf;base64")+'" height="100%" width="100%"></iframe>') 
                                $("#btnEnviarCorreo_"+idTab).removeClass("hidden") 
                                $("#btnAbrirNavegador_"+idTab).removeClass("hidden")
                                global.variablesReporteComprobante[idTab].excel = null
                                global.variablesReporteComprobante[idTab].pdf = res.toDataURI()
                                break
                        }    
                   }).catch(function (e) { 
                       console.log(e)
                       $("#btnAbrirNavegador_"+idTab).addClass("hidden")
                       $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
                       $("#divExcel_"+idTab).addClass("hidden")
                       global.variablesReporteComprobante[idTab].excel = null
                       global.variablesReporteComprobante[idTab].pdf = null
                       toastr.error('Hubo un error al generar el documento. Tipo error : '+e.statusText,'Error',{timeOut: 5000}) 
                   });
               }else{
                   toastr.warning("No existen datos para mostrar",'Error',{timeOut: 5000})
                   $("#btnAbrirNavegador_"+idTab).addClass("hidden")
                   $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
                   $("#divExcel_"+idTab).addClass("hidden")
                   global.variablesReporteComprobante[idTab].excel = null
                   global.variablesReporteComprobante[idTab].pdf = null
               }
           }else{
               toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+res.detalle_error,'Error',{timeOut: 5000})
               $("#btnAbrirNavegador_"+idTab).addClass("hidden")
               $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
               $("#divExcel_"+idTab).addClass("hidden")
               global.variablesReporteComprobante[idTab].excel = null
               global.variablesReporteComprobante[idTab].pdf - null
           } 
       }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $("#btnAbrirNavegador_"+idTab).addClass("hidden")
            $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
            $("#divExcel_"+idTab).addClass("hidden")
            global.variablesReporteComprobante[idTab].excel = null
            global.variablesReporteComprobante[idTab].pdf = null
       });
}

function GenerarReporte(idTab,Cod_Libro,flag_preview,Tipo){  
    switch($("#Cod_Opcion_"+idTab).val()){
        case '01':
            ReporteGeneral(idTab,Cod_Libro,"ReportePlanillaDiaria_"+Tipo,null,flag_preview,Tipo)
            break
        case '02':
            ReporteGeneral(idTab,Cod_Libro,"ReporteXTotalCliente_"+Tipo,"Id_Cliente",flag_preview,Tipo)
            break
        case '03':
            ReporteGeneral(idTab,Cod_Libro,"ReporteXTotalDocumento_"+Tipo,null,flag_preview,Tipo)
            break
        case '04':
            ReporteGeneral(idTab,Cod_Libro,"ReporteXTotalProducto_"+Tipo,"Cod_Producto",flag_preview,Tipo)
            break
        case '05':
            ReporteGeneral(idTab,Cod_Libro,"ReporteXCliente_"+Tipo,null,flag_preview,Tipo)
            break
        case '06':
            ReporteGeneral(idTab,Cod_Libro,"ReporteXDocumento_"+Tipo,null,flag_preview,Tipo)
            break
        case '07':
            ReporteGeneral(idTab,Cod_Libro,"ReporteXProducto_"+Tipo,null,flag_preview,Tipo)
            break
        case '08':
            ReporteGeneral(idTab,Cod_Libro,"ReporteXAnulados_"+Tipo,null,flag_preview,Tipo)
            break
        case '09':
            ReporteAuxiliar(idTab,Cod_Libro,Cod_Libro=='08'?"ReporteRegistroAuxiliarCompra_"+Tipo:"ReporteRegistroAuxiliarVenta_"+Tipo,null,flag_preview,Tipo)
            break
        case '10':
            ReporteAuxiliarDetallado(idTab,Cod_Libro,"ReporteRegistroAuxiliarDetallado_"+Tipo,null,flag_preview,Tipo)
            break
        case '11':
            ReporteAuxiliarDetalladoFormaPago(idTab,Cod_Libro,"ReporteRegistroAuxiliarDetalladoFormaPago_"+Tipo,null,flag_preview,Tipo)
            break
    }
}

function NuevoReporteComprobante(CodLibro) { 
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
    fetch(URL + '/reporte_api/get_variables_reporte_comprobante', parametros)
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

export { NuevoReporteComprobante }