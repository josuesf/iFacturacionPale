var empty = require('empty-element');
var yo = require('yo-yo'); 
import { URL, URL_REPORT } from '../../../../constantes_entorno/constantes'
import { BuscarCliente, BuscarProducto } from '../../../modales' 
import { MesActual } from '../../../../../utility/tools' 

var cantidad_tabs = 1
var arrayValidacion = [null,'null','',undefined]
global.variablesReporteMovimientosCaja = {}
var IdTabSeleccionado = null

function Ver(variables) {

    global.objCliente = ''
    global.objProducto = ''
    //cantidad_tabs++
    const idTabReporteMovimientosCaja = "ReporteMovimientoCaja_"+cantidad_tabs
    IdTabSeleccionado = idTabReporteMovimientosCaja

    global.variablesReporteMovimientosCaja[idTabReporteMovimientosCaja]={idTab:idTabReporteMovimientosCaja,flag_cliente:false,flag_producto:false,excel:null,dataBase64:[]}
    
    var tab = yo`
    <li class="" onclick=${()=>TabSeleccionado(idTabReporteMovimientosCaja)}><a href="#tab_${idTabReporteMovimientosCaja}" data-toggle="tab" aria-expanded="false" id="id_${idTabReporteMovimientosCaja}">Movimientos de Caja<a style="padding-left: 10px;"  onclick=${()=>CerrarTabMovimientosCaja(idTabReporteMovimientosCaja)} class="btn"><i class="fa fa-close text-danger"></i></a></a></li>`

    var el = yo`
    <div class="tab-pane" id="tab_${idTabReporteMovimientosCaja}">
        <div class="panel">
        <div class="modal"> 
                <div id="dialogo_docker_${idTabReporteMovimientosCaja}">
                    
                </div> 
        </div> 
            <div class="panel-body">
                <div class="row">
                    <div class="col-md-4">
                        <div class="row">
                            <div class="form-group"> 
                                <header>Movimientos de Caja</header>
                            </div>
                        </div>

                        <div class="row">
                            <div class="panel-group" id="accordion3_${idTabReporteMovimientosCaja}">
                                <div class="card panel expanded">
                                    <div class="card-head card-head-sm collapsed" data-toggle="collapse" data-parent="#accordion3_${idTabReporteMovimientosCaja}" data-target="#accordion3-2_${idTabReporteMovimientosCaja}" aria-expanded="false">
                                        <header><i class="fa fa-filter"></i> Filtro de Fechas y Turnos</header>
                                        <div class="tools">
                                            <a class="btn btn-icon-toggle"><i class="fa fa-angle-down"></i></a>
                                        </div>
                                    </div>
                                    <div id="accordion3-2_${idTabReporteMovimientosCaja}" class="collapse in" aria-expanded="true">
                                        <div class="card-body">	
                                            <form class="form">
                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <div class="radio radio-styled">
                                                            <label>
                                                                <input type="radio" name="optionsRadiosFF_${idTabReporteMovimientosCaja}" id="optPorTurno_${idTabReporteMovimientosCaja}" onchange=${()=>CambioOpcionesFecha(idTabReporteMovimientosCaja)}>
                                                                <span>Por turno</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="radio radio-styled">
                                                            <label>
                                                                <input type="radio" name="optionsRadiosFF_${idTabReporteMovimientosCaja}" id="optPorFechas_${idTabReporteMovimientosCaja}" onchange=${()=>CambioOpcionesFecha(idTabReporteMovimientosCaja)} checked>
                                                                <span>Por fechas</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row" id="divFiltroFechas_${idTabReporteMovimientosCaja}">
                                                </div>
                                            </form>
                                        </div> 
                                    </div>
                                </div><!--end .panel -->
                                <div class="card panel">
                                    <div class="card-head card-head-sm" data-toggle="collapse" data-parent="#accordion3_${idTabReporteMovimientosCaja}" data-target="#accordion3-1_${idTabReporteMovimientosCaja}" aria-expanded="true">
                                        <header><i class="fa fa-filter"></i> Filtro de Oficinas y Documentos</header>
                                        <div class="tools">
                                            <a class="btn btn-icon-toggle"><i class="fa fa-angle-down"></i></a>
                                        </div>
                                    </div>
                                    <div id="accordion3-1_${idTabReporteMovimientosCaja}" class="collapse" aria-expanded="true" style="">
                                        <div class="card-body">						
                                            <form class="form">
                                                <div class="form-group">
                                                    <select id="Cod_Sucursal_${idTabReporteMovimientosCaja}" class="form-control" onchange=${()=>CambioSucursalReporte(idTabReporteMovimientosCaja)}>
                                                        <option value="">Seleccione Sucursal</option>
                                                        ${variables.sucursales.map(m=>
                                                            yo`<option value=${m.Cod_Sucursal}>${m.Nom_Sucursal}</option>`
                                                        )}
                                                    </select>
                                                    <label>Sucursal</label>
                                                </div>
                                                <div class="form-group">
                                                    <select id="Cod_Caja_${idTabReporteMovimientosCaja}" class="form-control">
                                                        
                                                    </select>
                                                    <label>Caja</label>
                                                </div>
                                                <div class="form-group">
                                                    <select id="Cod_Comprobante_${idTabReporteMovimientosCaja}" class="form-control">
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
                                                            <select id="Cod_Moneda_${idTabReporteMovimientosCaja}" class="form-control">
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
                                                            <input type="text" class="form-control" id="Serie_${idTabReporteMovimientosCaja}">
                                                            <label>Serie</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div> 
                                    </div>
                                </div><!--end .panel -->
                                <div class="card panel">
                                    <div class="card-head card-head-sm collapsed" data-toggle="collapse" data-parent="#accordion3_${idTabReporteMovimientosCaja}" data-target="#accordion3-3_${idTabReporteMovimientosCaja}" aria-expanded="false">
                                        <header><i class="fa fa-filter"></i> Filtro Cliente y Conceptos </header>
                                        <div class="tools">
                                            <a class="btn btn-icon-toggle"><i class="fa fa-angle-down"></i></a>
                                        </div>
                                    </div>
                                    <div id="accordion3-3_${idTabReporteMovimientosCaja}" class="collapse" aria-expanded="false">
                                        <div class="card-body">	
                                            <form class="form">	
                                                <div class="form-group">
                                                    <div class="input-group">
                                                        <div class="input-group-content">
                                                            <input type="text" class="form-control" id="Cliente_${idTabReporteMovimientosCaja}" onkeyup=${()=>CambioNombreClienteReporte(event,idTabReporteMovimientosCaja)}> 
                                                            <label>Cliente/Proveedor</label>
                                                        </div>
                                                        <div class="input-group-btn">
                                                            <button class="btn btn-success" type="button" onclick=${()=>BuscarCliente("Cliente_"+idTabReporteMovimientosCaja,null,null)}><i class="fa fa-search"></i> Buscar</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <select id="Cod_TipoConcepto_${idTabReporteMovimientosCaja}" class="form-control" onchange=${()=>TraerConceptos(idTabReporteMovimientosCaja,1)}>
                                                       <option value="">Seleccione el tipo concepto</option>
                                                        ${variables.tipos_conceptos.map(m=>
                                                    yo`<option value=${m.Cod_TipoConcepto}>${m.Nom_TipoConcepto}</option>`
                                                    )}
                                                    </select>
                                                    <label>Todos Los Tipo Concepto</label>
                                                </div>

                                                <div class="form-group">
                                                    <select id="conceptos_${idTabReporteMovimientosCaja}" class="form-control">
                                                    <option style="text-transform:uppercase"></option>
                                                    </select>
                                                    <label>Todos Los Concepto</label>
                                                </div>
                                              
                                            </form>
                                        </div>
                                    </div>
                                </div><!--end .panel -->
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-xs-12">
                                <button type="button" class="btn btn-primary btn-block" onclick=${()=>GenerarReporte(idTabReporteMovimientosCaja,'',true,'Excel')}><i class="fa fa-file-o"></i> Ver vista previa Excel del documento</button>
                            </div>
                        </div> 
                        <br>
                        <div class="row">
                            <div class="col-xs-12">
                                <button type="button" class="btn btn-danger btn-block" onclick=${()=>GenerarReporte(idTabReporteMovimientosCaja,'',true,'PDF')}><i class="fa fa-file-pdf-o"></i> Ver vista previa PDF del documento</button>
                            </div>
                        </div> 
                        <br>
                        <div class="row">
                            <div class="col-xs-12">
                                <button type="button" class="btn btn-info btn-block hidden" id="btnAbrirNavegador_${idTabReporteMovimientosCaja}" onclick=${()=>AbrirReporte(idTabReporteMovimientosCaja,'')}><i class="fa fa-eye"></i> Abrir documento en otra pestaña</button>
                            </div>
                        </div> 
                        <br>
                        <div class="row">
                            <div class="col-xs-12">
                                <button type="button" class="btn btn-success btn-block hidden" id="btnEnviarCorreo_${idTabReporteMovimientosCaja}" onclick=${()=>AbrirDialogoEnviarMensaje(idTabReporteMovimientosCaja,'')} ><i class="fa fa-envelope"></i> Enviar por correo</button>
                            </div>
                        </div> 
                    </div>
                    <div class="col-md-8"> 
                        <br>
                        <div class="row">
                            <div class="col-xs-12">
                                <div id="divExcel_${idTabReporteMovimientosCaja}" class="text-center hidden" style="height: 600px;" >
                        
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>`

    if($("#tab_"+idTabReporteMovimientosCaja).length){   
        $('#tab_'+idTabReporteMovimientosCaja).remove()
        $('#id_'+idTabReporteMovimientosCaja).parents('li').remove()

        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    }else{
        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    } 
    $("#id_"+idTabReporteMovimientosCaja).click() 

    $('#modal-superior').off('hidden.bs.modal').on('hidden.bs.modal', function () {
        if(global.objProducto!=''){
            $("#Producto_"+IdTabSeleccionado).val(global.objProducto.Nom_Producto)
            $("#Producto_"+IdTabSeleccionado).attr("data-id",global.objProducto.Id_Producto)
            global.variablesReporteMovimientosCaja[IdTabSeleccionado].flag_producto = true 
        }

        if(global.objCliente!=''){
            $("#Cliente_"+IdTabSeleccionado).val(global.objCliente.Cliente)
            $("#Cliente_"+IdTabSeleccionado).attr("data-id",global.objCliente.Id_ClienteProveedor)
            global.variablesReporteMovimientosCaja[IdTabSeleccionado].flag_cliente = true
        }
    })

    TraerPeriodos(idTabReporteMovimientosCaja,1)
    TraerPeriodos(idTabReporteMovimientosCaja,2)
    CambioOpcionesFecha(idTabReporteMovimientosCaja)

}

function LlenarCajas(cajas,idTab){
    $("#Cod_Caja_"+idTab).html('')
    var html = '<option value="">Seleccione Caja</option>'
    for(var i=0; i<cajas.length; i++){
        html = html+'<option value="'+cajas[i].Cod_Caja+'">'+cajas[i].Des_Caja+'</option>'
    }
    $("#Cod_Caja_"+idTab).html(html) 
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

function LlenarTipoConcepto(conceptos,idTab)
{
    var el = yo`
        ${conceptos.map(e => yo`
             <option value="${e.Id_Concepto}">${e.Des_Concepto}</option>
        `)}` 
        $("#conceptos_"+idTab).html('')
        $("#conceptos_"+idTab).html(el)

}
function CambioNombreClienteReporte(e,idTab){ 
    if(e.which == 46 || e.which == 8){ 
        if(global.variablesReporteMovimientosCaja[idTab].flag_cliente){
            $("#Cliente_"+idTab).val("")
            $("#Cliente_"+idTab).attr("data-id",null)
            global.variablesReporteMovimientosCaja[idTab].flag_cliente=false
        }
    } 
}

function TraerConceptos(idTab){ 
    var Cod_clase = $("#Cod_TipoConcepto_"+idTab).val()
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            Cod_clase
        })
    }
    fetch(URL + '/reporte_api/get_variables_conceptos_clase', parametros)
        .then(req => req.json())
        .then(res => { 
            LlenarTipoConcepto(res.data.conceptos,idTab)
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos. Inténtelo nuevamente refrescando la pantalla','Error',{timeOut: 5000})
        });
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

function CerrarTabMovimientosCaja(idTab){ 
    $('#tab_'+idTab).remove()
    $('#id_'+idTab).parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show');
    delete global.variablesReporteMovimientosCaja[idTab]
    IdTabSeleccionado = null
}
function AbrirReporte(idTab,Cod_Libro){
   
    if(global.variablesReporteMovimientosCaja[idTab].excel){
        if(global.variablesReporteMovimientosCaja[idTab].excel!=null){
            var tabOrWindow = window.open(global.variablesReporteMovimientosCaja[idTab].excel, '_blank');
            tabOrWindow.focus();
        }else{
            if(global.variablesReporteMovimientosCaja[idTab].pdf!=null){
                let pdfWindow = window.open("")
                pdfWindow.document.write("<iframe width='100%' height='100%' src='"+global.variablesReporteMovimientosCaja[idTab].pdf.replace('data:null','data:application/pdf')+"'></iframe>")
            }else{
                toastr.error('No se puede abrir el documento','Error',{timeOut: 5000}) 
            } 
        }
    }else{
        if(global.variablesReporteMovimientosCaja[idTab].pdf){
            if(global.variablesReporteMovimientosCaja[idTab].pdf!=null){ 
                let pdfWindow = window.open("")
                pdfWindow.document.write("<iframe width='100%' height='100%' src='"+global.variablesReporteMovimientosCaja[idTab].pdf.replace('data:null','data:application/pdf')+"'></iframe>")
            }else{
                toastr.error('No se puede abrir el documento','Error',{timeOut: 5000}) 
            }
        }else{
            toastr.error('No se puede abrir el documento','Error',{timeOut: 5000}) 
        }
    }
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
                        <input type="text" class="form-control dirty" id="asunto_${idTab}" value="Reporte Movimientos por caja">
                        <label>Asunto</label>
                    </div>
                    <div class="form-group floating-label">
                        <textarea type="text" class="form-control dirty" id="mensaje_${idTab}">Se le adjunta el formato pdf y excel del reporte Movimientos por caja</textarea>
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
                html: "<i class='md md-send'></i> Enviar",
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
                            arregloAttachment:global.variablesReporteMovimientosCaja[idTab].dataBase64
                        })
                        
                    }
                    fetch(URL + '/empresa_api/send_email_report', parametros)
                        .then(req => req.json())
                        .then(res => {
                            console.log(res)
                            if(res.respuesta=='ok'){
                                dialog.dockmodal("close");
                                global.variablesReporteMovimientosCaja[idTab].dataBase64=[] 
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
function LlenarReportesCorreo(idTab,tituloReporte){
    var el = yo`<ul class="list divider-full-bleed" id="listReportes_${idTab}">
            ${global.variablesReporteMovimientosCaja[idTab].dataBase64.map((e,index) => 
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
                                <i class="md md-delete"></i>
                            </a>
                        </li>`
            )}
            </ul>`
        var container = document.getElementById('listReportes_'+idTab)
        empty(container).appendChild(el);
}

function EliminarReporteCorreo(idTab,reporte,titulo){
    for (var i in global.variablesReporteMovimientosCaja[idTab].dataBase64) { 
        if (global.variablesReporteMovimientosCaja[idTab].dataBase64[i].tipo == reporte.tipo) {
            global.variablesReporteMovimientosCaja[idTab].dataBase64.splice(i, 1)
            break 
        }
    } 
    LlenarReportesCorreo(idTab,titulo) 
}
function GenerarReporteEmail(idTab,Cod_Libro,flag_preview){
    global.variablesReporteMovimientosCaja[idTab].dataBase64=[]
    run_waitMe($('#dialogo_docker_'+idTab), 1, "ios","Subiendo reporte para su envio....");
    ReporteGeneralEmail(idTab,Cod_Libro,"MovimientosXcaja_Excel",null,flag_preview,function(flag,result){ 
        if(flag){
            ReporteGeneralEmail(idTab,Cod_Libro,"MovimientosXcaja_PDF",null,flag_preview,function(flag,result){
                if(flag){
                    LlenarReportesCorreo(idTab,'Movimientos por caja')
                    $('#dialogo_docker_'+idTab).waitMe('hide');
                }else{
                    $('#dialogo_docker_'+idTab).waitMe('hide');
                }
            })
        }else{
            $('#dialogo_docker_'+idTab).waitMe('hide');
        }
    })
}
function ReporteGeneralEmail(idTab,Cod_Libro,TipoReporte,ParametroOrden,flag_preview,callback){
    var Cod_Sucursal = arrayValidacion.includes($("#Cod_Sucursal_"+idTab).val())?null:$("#Cod_Sucursal_"+idTab).val()
    var Id_Cliente = arrayValidacion.includes($("#Cliente_"+idTab).attr("data-id"))?0:parseInt($("#Cliente_"+idTab).attr("data-id"))
    var Cod_Caja = arrayValidacion.includes($("#Cod_Caja_"+idTab).val())?null:$("#Cod_Caja_"+idTab).val()
    var FechaInicio = arrayValidacion.includes($("#FechaInicio_"+idTab).val())?null:$("#FechaInicio_"+idTab).val()
    
    if(FechaInicio!=null){
        let arregloFechaInicio = FechaInicio.split('T')[0]
        FechaInicio = arregloFechaInicio
    }
    var FechaFin = arrayValidacion.includes($("#FechaFin_"+idTab).val())?null:$("#FechaFin_"+idTab).val()
    if(FechaFin!=null){
        let arregloFechaFin = FechaFin.split('T')[0]
        FechaFin = arregloFechaFin
    }
    var Cod_TurnoInicio = arrayValidacion.includes($("#DeTurno_"+idTab).val())?null:$("#DeTurno_"+idTab).val()
    var Cod_TurnoFinal =  arrayValidacion.includes($("#AlTurno_"+idTab).val())?null:$("#AlTurno_"+idTab).val()
    if(Cod_TurnoInicio != null || Cod_TurnoFinal != null)
    {
        FechaInicio = null
        FechaFin = null
    }
    var Cod_Moneda = arrayValidacion.includes($("#Cod_Moneda_"+idTab).val())?null:$("#Cod_Moneda_"+idTab).val()
    var Cod_TipoComprobante = arrayValidacion.includes($("#Cod_Comprobante_"+idTab).val())?null:$("#Cod_Comprobante_"+idTab).val()
    var Cod_TipoConcepto = arrayValidacion.includes($("#Cod_TipoConcepto_"+idTab).val())?null:$("#Cod_TipoConcepto_"+idTab).val()
    var Concepto = arrayValidacion.includes($("#conceptos_"+idTab).val())?0:$("#conceptos_"+idTab).val()
    var Id_Cliente = arrayValidacion.includes($("#Cliente_"+idTab).attr("data-id"))?0:parseInt($("#Cliente_"+idTab).attr("data-id"))
    var Serie = arrayValidacion.includes($("#Serie_"+idTab).val())?null:$("#Serie_"+idTab).val()
    var Numero =null
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Cod_Libro,
            Cod_Sucursal,
            Cod_Caja,
            Cod_TipoComprobante,
            Cod_Moneda,
            Id_Cliente,
            Cod_TurnoInicio,
            Cod_TurnoFinal,
            Cod_TipoConcepto,
            Concepto,
            Serie,
            Numero,
            FechaInicio,
            FechaFin
        })
    }
    //console.log(parametros)
    fetch(URL + '/reporte_api/reporte_movimientos_caja', parametros)
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
                    let Cod_Moneda_Filtro = arrayValidacion.includes($("#Cod_Moneda_"+idTab).val())?"Todos":$("#Cod_Moneda_"+idTab+" option:selected").text()
                    let Cod_TipoComprobante_Filtro = arrayValidacion.includes($("#Cod_Comprobante_"+idTab).val())?"Todos":$("#Cod_Comprobante_"+idTab+" option:selected").text()

                    var request = {
                        data:{
                            'FLAG_PREVIEW':flag_preview,
                            'COD_LIBRO':Cod_Libro,
                            'COD_TIPO_DOCUMENTO':TipoReporte,
                            "EMPRESA": res.empresa.Nom_Comercial,
                            "RUC": res.empresa.RUC,
                            "DIRECCION":res.empresa.Direccion,
                            "TIPO_REPORTE":"REPORTE CUENTAS POR COBRAR Y POR PAGAR",
                            "FECHA_SIS":MesActual(''),
                            "USUARIO":res.turno.Cod_UsuarioReg,
                            "IMPUESTO":res.empresa.Por_Impuesto,
                            "FILTRO": `Sucursal: ${Cod_Sucursal_Filtro}; Cliente/Proveedor: ${Id_Cliente_Filtro}; Caja: ${Cod_Caja_Filtro}; Fecha Inicio: ${FechaInicio_Filtro}; Fecha Fin: ${FechaFin_Filtro}; Moneda: ${Cod_Moneda_Filtro}; Comprobante: ${Cod_TipoComprobante_Filtro}`,
                            DETALLES:res.data.detalles.sort(function (a, b) {
                                if(ParametroOrden)
                                {
                                    var detA = a[ParametroOrden] 
                                    var detB = b[ParametroOrden] 
                                    if (detA < detB) 
                                        {
                                            return -1;
                                        }
                                    if (detA > detB)
                                        {
                                            return 1;
                                        } 
                                    return 0;
                                }
                                else
                                {
                                    return 0;
                                }
                            })
                        }
                    }
                    jsreport.renderAsync(request).then(function(res) {
                        let TR = TipoReporte.split('_')[TipoReporte.split('_').length-1]  
                        if(TR=='Excel')
                            global.variablesReporteMovimientosCaja[idTab].dataBase64.push({filename: TipoReporte+'.xlsx',content:res.toDataURI().replace("data:null;base64, ",""),encoding: 'base64',tipo:TR})                          
                        else
                            global.variablesReporteMovimientosCaja[idTab].dataBase64.push({filename: TipoReporte+'.pdf',content:res.toDataURI().replace("data:null;base64, ",""),encoding: 'base64',tipo:TR})                          
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
    var FechaInicio = arrayValidacion.includes($("#FechaInicio_"+idTab).val())?null:$("#FechaInicio_"+idTab).val()
    
    if(FechaInicio!=null){
        let arregloFechaInicio = FechaInicio.split('T')[0]
        FechaInicio = arregloFechaInicio
    }
    var FechaFin = arrayValidacion.includes($("#FechaFin_"+idTab).val())?null:$("#FechaFin_"+idTab).val()
    if(FechaFin!=null){
        let arregloFechaFin = FechaFin.split('T')[0]
        FechaFin = arregloFechaFin
    }
    var Cod_TurnoInicio = arrayValidacion.includes($("#DeTurno_"+idTab).val())?null:$("#DeTurno_"+idTab).val()
    var Cod_TurnoFinal =  arrayValidacion.includes($("#AlTurno_"+idTab).val())?null:$("#AlTurno_"+idTab).val()
    if(Cod_TurnoInicio != null || Cod_TurnoFinal != null)
    {
        FechaInicio = null
        FechaFin = null
    }
    var Cod_Moneda = arrayValidacion.includes($("#Cod_Moneda_"+idTab).val())?null:$("#Cod_Moneda_"+idTab).val()
    var Cod_TipoComprobante = arrayValidacion.includes($("#Cod_Comprobante_"+idTab).val())?null:$("#Cod_Comprobante_"+idTab).val()
    var Cod_TipoConcepto = arrayValidacion.includes($("#Cod_TipoConcepto_"+idTab).val())?null:$("#Cod_TipoConcepto_"+idTab).val()
    var Concepto = arrayValidacion.includes($("#conceptos_"+idTab).val())?0:$("#conceptos_"+idTab).val()
    var Id_Cliente = arrayValidacion.includes($("#Cliente_"+idTab).attr("data-id"))?0:parseInt($("#Cliente_"+idTab).attr("data-id"))
    var Serie = arrayValidacion.includes($("#Serie_"+idTab).val())?null:$("#Serie_"+idTab).val()
    var Numero =null
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Cod_Libro,
            Cod_Sucursal,
            Cod_Caja,
            Cod_TipoComprobante,
            Cod_Moneda,
            Id_Cliente,
            Cod_TurnoInicio,
            Cod_TurnoFinal,
            Cod_TipoConcepto,
            Concepto,
            Serie,
            Numero,
            FechaInicio,
            FechaFin
        })
    }
    fetch(URL + '/reporte_api/reporte_movimientos_caja', parametros)
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
                    let Cod_Moneda_Filtro = arrayValidacion.includes($("#Cod_Moneda_"+idTab).val())?"Todos":$("#Cod_Moneda_"+idTab+" option:selected").text()
                    let Cod_TipoComprobante_Filtro = arrayValidacion.includes($("#Cod_Comprobante_"+idTab).val())?"Todos":$("#Cod_Comprobante_"+idTab+" option:selected").text()

                    var request = {
                        data:{
                            'FLAG_PREVIEW':flag_preview,
                            'COD_LIBRO':Cod_Libro,
                            'COD_TIPO_DOCUMENTO':TipoReporte,
                            "EMPRESA": res.empresa.Nom_Comercial,
                            "RUC": res.empresa.RUC,
                            "DIRECCION":res.empresa.Direccion,
                            "TIPO_REPORTE":"REPORTE CUENTAS POR COBRAR Y POR PAGAR",
                            "FECHA_SIS":MesActual(''),
                            "USUARIO":res.turno.Cod_UsuarioReg,
                            "IMPUESTO":res.empresa.Por_Impuesto,
                            "FILTRO": `Sucursal: ${Cod_Sucursal_Filtro}; Cliente/Proveedor: ${Id_Cliente_Filtro}; Caja: ${Cod_Caja_Filtro}; Fecha Inicio: ${FechaInicio_Filtro}; Fecha Fin: ${FechaFin_Filtro}; Moneda: ${Cod_Moneda_Filtro}; Comprobante: ${Cod_TipoComprobante_Filtro}`,
                            DETALLES:res.data.detalles.sort(function (a, b) {
                                if(ParametroOrden)
                                {
                                    var detA = a[ParametroOrden] 
                                    var detB = b[ParametroOrden] 
                                    if (detA < detB) 
                                        {
                                            return -1;
                                        }
                                    if (detA > detB)
                                        {
                                            return 1;
                                        } 
                                    return 0;
                                }
                                else
                                {
                                    return 0;
                                }
                            })
                        }
                    } 
                    jsreport.renderAsync(request).then(function(res) {  
                        switch(Tipo){
                            case 'Excel':
                                var html = $(res.toString())  
                                if(html[1]){  
                                    $('#divExcel_'+idTab).html(html[1]) 
                                    $("#btnAbrirNavegador_"+idTab).removeClass("hidden") 
                                    $("#btnEnviarCorreo_"+idTab).removeClass("hidden")
                                    global.variablesReporteMovimientosCaja[idTab].excel = html[1].src
                                }else{
                                    $('#divExcel_'+idTab).html(res.toString())
                                    global.variablesReporteMovimientosCaja[idTab].excel = null
                                }
                                break
                            case 'PDF':
                                $('#divExcel_'+idTab).html('<iframe src="'+res.toDataURI().replace("data:null","data:application/pdf;base64")+'" height="100%" width="100%"></iframe>') 
                                $("#btnEnviarCorreo_"+idTab).removeClass("hidden") 
                                $("#btnAbrirNavegador_"+idTab).removeClass("hidden")
                                global.variablesReporteMovimientosCaja[idTab].excel = null
                                global.variablesReporteMovimientosCaja[idTab].pdf = res.toDataURI()
                                break
                        }    
                    }).catch(function (e) { 
                        console.log(e)
                       $("#btnAbrirNavegador_"+idTab).addClass("hidden")
                       $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
                       $("#divExcel_"+idTab).addClass("hidden")
                       global.variablesReporteMovimientosCaja[idTab].excel = null
                       global.variablesReporteMovimientosCaja[idTab].pdf = null
                       toastr.error('Hubo un error al generar el documento. Tipo error : '+e.statusText,'Error',{timeOut: 5000}) 
                    });
                }else{
                    toastr.warning("No existen datos para mostrar",'Error',{timeOut: 5000})
                    $("#btnAbrirNavegador_"+idTab).addClass("hidden")
                    $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
                    $("#divExcel_"+idTab).addClass("hidden")
                    global.variablesReporteMovimientosCaja[idTab].excel = null
                    global.variablesReporteMovimientosCaja[idTab].pdf = null
                }
            }else{
                toastr.warning("No existen datos para mostrar",'Error',{timeOut: 5000})
                $("#btnAbrirNavegador_"+idTab).addClass("hidden")
                $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
                $("#divExcel_"+idTab).addClass("hidden")
                global.variablesReporteMovimientosCaja[idTab].excel = null
                global.variablesReporteMovimientosCaja[idTab].pdf = null
            } 
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $("#btnAbrirNavegador_"+idTab).addClass("hidden")
            $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
            $("#divExcel_"+idTab).addClass("hidden")
            global.variablesReporteMovimientosCaja[idTab].excel = null
            global.variablesReporteMovimientosCaja[idTab].pdf = null
        })
}

function GenerarReporte(idTab,Cod_Libro,flag_preview,Tipo){
            ReporteGeneral(idTab,Cod_Libro,"MovimientosXcaja_"+Tipo,"",flag_preview,Tipo)
}
 
function ReporteMovimientosCaja() { 
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
    fetch(URL + '/reporte_api/get_variables_reporte_cajas', parametros)
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

export { ReporteMovimientosCaja }