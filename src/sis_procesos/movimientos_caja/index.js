var yo = require('yo-yo')
var empty = require('empty-element');
import {URL,URL_REPORT} from '../../constantes_entorno/constantes'
import { EnviarImpresion, ConvertirCadena } from '../../../utility/tools' 


function Ver(Flag_Cerrado,movimientos,saldos) {
    var el = yo`
        <div>
            <section class="content-header" id="sectionModals">
 
                <div class="modal fade" id="modal-alerta" style="z-index: 999999;">
                     
                </div>

                <div class="modal modal-default fade" id="modal-justificacion" style="display: none;overflow: auto;">
                     
                </div>

                <div class="modal fade" id="modal-superior" style="display: none;z-index: 1052;overflow: auto;" >
                     
                </div> 

                <div class="modal fade" id="modal-otros-procesos" style="display: none;z-index: 1051;overflow: auto;" >
                     
                </div>

                <div class="modal fade" id="modal-proceso" style="overflow: auto;">
                    
                </div>
            </section>
            <section class="content">
                <div class="row">
                    <div class="col-md-12"> 
                        <div class="nav-tabs-custom">
                            <ul class="nav nav-tabs" id="tabs">
                                <li class="active"><a href="#tab_1" id="id_1" data-toggle="tab" aria-expanded="true" onclick=${()=>refrescar_movimientos_caja()}>Movimientos</a></li>
                            </ul>
                            <div class="tab-content" id="tabs_contents">
                                <div class="tab-pane active" id="tab_1">
                                    
                                    <div class="box box-primary">
                                        <div class="box-header">
                                        <input type="button" title="test" onclick=${()=>generarPDF()} value="Get PDF Report"/>
                                            <h3 class="box-title">Movimientos de Caja ${Flag_Cerrado?' - EL TURNO ESTA CERRADO':''}>  
                                             </h3>
                                        </div>
                                        <!-- /.box-header -->
                                        <div class="box-body">
                                            <div class="table-responsive">
                                            <table id="tablaMovimientos" class="table table-bordered table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>E</th>
                                                        <th>Fecha/Hora</th>
                                                        <th>D</th>
                                                        <th>Documento</th>
                                                        <th>Cliente/Proveedor</th>
                                                        <th>Descripcion</th>
                                                        <th>Plan</th>
                                                        <th>Cantidad</th>
                                                        <th>PU</th>
                                                        <th>Ingreso</th>
                                                        <th>Egreso</th>
                                                        <th>Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                ${movimientos.map(u => yo`
                                                <tr>
                                                    <td>${u.ID}</td>
                                                    <td>${u.Fecha_Reg.split('.')[0]}</td>
                                                    <td>${u.ID}</td>
                                                    <td>${u.Documento}</td>
                                                    <td>${u.Cliente}</td>
                                                    <td>${u.Movimiento}</td>
                                                    <td>${u.Cod_Manguera}</td>
                                                    <td>${u.Cantidad}</td>
                                                    <td>${u.PrecioUnitario}</td>
                                                    <td>${u.Ingreso}</td>
                                                    <td>${u.Egreso}</td>
                                                    <td>
                                                    ${!Flag_Cerrado?
                                                    yo`<div class="btn-group">
                                                            <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            Elegir una accion <span class="caret"></span>
                                                            </button>
                                                            <ul class="dropdown-menu">
                                                                <li><a href="javascript:void(0)" onclick=${()=>AbrirModalConfirmacion('extornar',u)} ><i class="fa fa-times-circle"></i>Anular</a></li>
                                                                <li><a href="javascript:void(0)" onclick=${()=>VerFormatoDocumento(u)} ><i class="fa fa-print"></i>Reimprimir</a></li>
                                                                <li><a href="javascript:void(0)" ><i class="fa fa-refresh"></i>Cambiar Plan</a></li>
                                                                <li><a href="javascript:void(0)" onclick=${()=>AbrirModalCambiarTurno(u)}><i class="fa fa-calendar"></i>Cambiar Turno</a></li>
                                                                <li><a href="javascript:void(0)" onclick=${()=>AbrirModalConfirmacion('eliminar',u)}><i class="fa fa-close"></i> Eliminar</a></li>
                                                            </ul>
                                                        </div>`
                                                    :
                                                    yo`
                                                    <div class="btn-group">
                                                        <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" disabled>
                                                        Elegir una accion <span class="caret"></span>
                                                        </button>
                                                    </div>
                                                    `}
                                                    </td>
                                                </tr>`)}
                                                </tbody>
                    
                                            </table>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>`;
    var footer_element = yo`
        <div class="row">
            <div class="col-sm-7"></div>
            <div class="col-sm-5">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Moneda</th>
                            <th>Saldo Inicial</th>
                            <th>Ingresos</th>
                            <th>Egresos</th>
                            <th>Saldo Final</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${saldos.map(s=>yo`
                            <tr>
                                <td>${s.Moneda}</td>
                                <td>${s.SaldoInicial}</td>
                                <td>${s.Ingresos}</td>
                                <td>${s.Egresos}</td>
                                <td>${s.SaldoFinal}</td>
                            </tr>
                        `)}
                    </tbody>
                </table>
            </div>
        </div>`;
    var container = document.getElementById('main-contenido')
    empty(container).appendChild(el);
    var footer = document.getElementById('content_footer')
    empty(footer).appendChild(footer_element);
    $('#tablaMovimientos').DataTable({
        "lengthChange": false,
        "order": [[ 1, "desc" ]],
        "oLanguage": {
            "sSearch": "Buscar:"
        }
    });
     

}


function CargarPDFModal(titulo,subtitulo,callback){
    var el = yo`
    
        <div class="modal-dialog" style="height: 80%;">
            <div class="modal-content modal-lg" style="height: 100%;">
                <div class="modal-header text-center">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h4 class="modal-title">${titulo}</h4>
                    <h4 class="modal-title">${subtitulo}</h4>
                </div>
                <div class="modal-body text-center" id="divPDF" style="height: 78%;">
                    <i class="fa fa-refresh fa-spin fa-5x"></i><br/><br/>
                    <label>Cargando vista previa....</label>
                </div>
                <div class="modal-footer">
                    <div class="btn-toolbar pull-right">
                        <div class="btn-group">
                            <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button> 
                        </div>
                    </div>
                </div>
            </div>
            <!-- /.modal-content -->
        </div>`


    var modal_proceso = document.getElementById('modal-alerta');
    empty(modal_proceso).appendChild(el);
    $('#modal-alerta').modal()

    $("#modal-alerta").off('shown.bs.modal').on("shown.bs.modal", function () {
        callback(true)
    });

}


function generarPDF(){ 
     
    CargarPDFModal("FACTURA","SERIE-NUMERO",function(flag){
        if(flag){
            jsreport.serverUrl = URL_REPORT; 
            var request = {
                template: {
                name:  'TicketFactura',
                recipe: "chrome-pdf",
                engine: 'handlebars',
                chrome: { 
                    width:  '2.00in',
                    height: '5.5in'
                }
                },
                data:{
                "URL_LOGO":"https://www.sparksuite.com/images/logo.png",
                "FLAG":false,
                "NOMBRE":"NOMBRE",
                "DIRECCION":"DIRECCION",
                "RUC":"RUC",
                "COD_TIPOCOMPROBANTE": "COD_TIPOCOMPROBANTE",
                "DOCUMENTO": "DOCUMENTO",
                "SERIE": "SERIE",
                "NUMERO": "NUMERO",
                "FLAG_ANULADO": "FLAG_ANULADO",
                "MOTIVO_ANULACION" : "MOTIVO_ANULACION",
                "CLIENTE": "CLIENTE",
                "COD_DOCCLIENTE":"COD_DOCCLIENTE",
                "RUC_CLIENTE": "RUC_CLIENTE",
                "DIRECCION_CLIENTE": "DIRECCION_CLIENTE",
                "FECHA_EMISION": "FECHA_EMISION",
                "FECHA_VENCIMIENTO": "FECHA_VENCIMIENTO",
                "FORMA_PAGO": "FORMA_PAGO",
                "GLOSA": "GLOSA",
                "OBSERVACIONES": "OBSERVACIONES",
                "CAJERO": "USUARIO",
                "MONEDA": "MONEDA",
                "ESCRITURA_MONTO": "SON: "+"ESCRITURA_MONTO",
                "GRAVADAS": "GRAVADAS",
                "EXONERADAS": "EXONERADAS",
                "GRATUITAS": "GRATUITAS",
                "INAFECTAS": "INAFECTAS",
                "DESCUENTO": "DESCUENTO",
                "IGV": "IGV",
                "TOTAL": "TOTAL",
                "PIE_DE_PAGINA":"Representación impresa del comprobante electrónico, consulte su documento en www.ifacturacion.pe",
                "VERSION_SISTEMA":"F|9.1.4"
                }
            };
            
            jsreport.renderAsync(request).then(function(res) {
                jsreport.render(document.getElementById('divPDF'), request);
                
            });
        }
    })
   
    
}

function VerModalJustificacion(titulo,descripcion,movimiento,flag) {
    var el = yo` 
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                        <h4 class="modal-title">${titulo}</h4>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div id="modal_error" class="callout callout-danger hidden">
                                <p> Es necesario llenar los campos marcados con rojo</p>
                            </div>
                        </div>
                        <p>${descripcion}</p>
                        <div class="row" id="modal_form">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <input type="text" id="txtJustificacion" class="form-control required">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="btnExtornarAnular" onclick=${()=>ExtornarAnular(movimiento,flag)}>Aceptar</button>
                    </div>
                </div>
                <!-- /.modal-content -->
            </div>`

    var modal_justificacion = document.getElementById('modal-justificacion');
    empty(modal_justificacion).appendChild(el);
    $('#modal-justificacion').modal()
}


function VerTabCaja(Flag_Cerrado,movimientos,saldos) {
    var sectionModals = yo`
                <div>
                    
                    <div class="modal fade" id="modal-alerta" style="z-index: 999999;">
                     
                    </div>

                    <div class="modal modal-default fade" id="modal-justificacion" style="display: none;overflow: auto;">
                        
                    </div>

                    <div class="modal fade" id="modal-otros-procesos" style="display: none;z-index: 1051;overflow: auto;">
                     
                    </div>

                    <div class="modal fade" id="modal-superior" style="display: none;z-index: 1051;overflow: auto;" >
                        
                    </div>
                    <div class="modal fade" id="modal-proceso" style="overflow: auto;">
                        
                    </div>
                </div>`

    var el = yo`<div class="box box-primary">
                    <div class="box-header">
                        <h3 class="box-title">Movimientos de Caja ${Flag_Cerrado?' - EL TURNO ESTA CERRADO':''}</h3>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body">
                        <div class="table-responsive">
                        <table id="tablaMovimientos" class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>E</th>
                                    <th>Fecha/Hora</th>
                                    <th>D</th>
                                    <th>Documento</th>
                                    <th>Cliente/Proveedor</th>
                                    <th>Descripcion</th>
                                    <th>Plan</th>
                                    <th>Cantidad</th>
                                    <th>PU</th>
                                    <th>Ingreso</th>
                                    <th>Egreso</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="context-menu-one">
                            ${movimientos.map(u => yo`
                            <tr>
                                <td>${u.ID}</td>
                                <td>${u.Fecha_Reg.split('.')[0]}</td>
                                <td>${u.ID}</td>
                                <td>${u.Documento}</td>
                                <td>${u.Cliente}</td>
                                <td>${u.Movimiento}</td>
                                <td>${u.Cod_Manguera}</td>
                                <td>${u.Cantidad}</td>
                                <td>${u.PrecioUnitario}</td>
                                <td>${u.Ingreso}</td>
                                <td>${u.Egreso}</td>
                                <td>

                                ${!Flag_Cerrado?
                                yo`<div class="btn-group">
                                        <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Elegir una accion <span class="caret"></span>
                                        </button>
                                        <ul class="dropdown-menu">
                                            <li><a href="javascript:void(0)" onclick=${()=>AbrirModalConfirmacion('extornar',u)} ><i class="fa fa-times-circle"></i>Anular</a></li>
                                            <li><a href="javascript:void(0)" onclick=${()=>VerFormatoDocumento(u)} ><i class="fa fa-print"></i>Reimprimir</a></li>
                                            <li><a href="javascript:void(0)"  ><i class="fa fa-refresh"></i>Cambiar Plan</a></li>
                                            <li><a href="javascript:void(0)" onclick=${()=>AbrirModalCambiarTurno(u)}><i class="fa fa-calendar"></i>Cambiar Turno</a></li>
                                            <li><a href="javascript:void(0)" onclick=${()=>AbrirModalConfirmacion('eliminar',u)}><i class="fa fa-close"></i> Eliminar</a></li>
                                        </ul>
                                    </div>`
                                :
                                yo`
                                <div class="btn-group">
                                    <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" disabled>
                                    Elegir una accion <span class="caret"></span>
                                    </button>
                                </div>
                                `}
                                </td>
                            </tr>`)}
                            </tbody>

                        </table>
                        </div>
                    </div>
                </div>`;


    var sectionFooter = yo`
                <div class="row">
                    <div class="col-sm-7"></div>
                    <div class="col-sm-5">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Moneda</th>
                                    <th>Saldo Inicial</th>
                                    <th>Ingresos</th>
                                    <th>Egresos</th>
                                    <th>Saldo Final</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${saldos.map(s=>yo`
                                    <tr>
                                        <td>${s.Moneda}</td>
                                        <td>${s.SaldoInicial}</td>
                                        <td>${s.Ingresos}</td>
                                        <td>${s.Egresos}</td>
                                        <td>${s.SaldoFinal}</td>
                                    </tr>
                                `)}
                            </tbody>
                        </table>
                    </div>
                </div>`;
     
    var sectionModalsElement = document.getElementById('sectionModals')
    empty(sectionModalsElement).appendChild(sectionModals);
    var container = document.getElementById('tab_1')
    empty(container).appendChild(el);
    $("#tab_1").click()
    $('#content_footer').html(sectionFooter);

    $('#tablaMovimientos').DataTable({
        "lengthChange": false,
        "order": [[ 1, "desc" ]],
        "oLanguage": {
            "sSearch": "Buscar:"
        }
    });
 

}

function AbrirModalManguera(movimiento){
    var el = yo`
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h4 class="modal-title" id="txtTitulo">Cambiar Manguera </h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="Manguera">Seleccione una manguera</label>
                                <select id="Manguera" class="form-control">
                                </select>
                            </div>
                        </div>
                    </div>
                        
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="btnCambiarTurno" onclick=${()=>GuardarManguera(movimiento)}>Aceptar</button>
                </div>
            </div>
            <!-- /.modal-content -->
        </div>`
        var modal_proceso = document.getElementById('modal-alerta');
        empty(modal_proceso).appendChild(el);
        $('#modal-alerta').modal()
}


function AbrirModalCambiarTurno(movimiento){

    const fecha = new Date()
    var anio = fecha.getFullYear() 

    var el = yo`
    <div class="modal-dialog modal-sm">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
                <h4 class="modal-title">Seleccione el turno </h4>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-group">
                        <label for="Gestion">Gestion</label>
                            <input type="number" id="Gestion" value=${anio} class="form-control" onkeyup=${()=>TraerPeriodos()} onchange=${()=>TraerPeriodos()}>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-group">
                        <label for="Periodo">Periodo</label>
                            <select id="Periodo" class="form-control" onchange=${()=>TraerTurnos()}>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-group">
                        <label for="Turno">Turno</label>
                            <select id="Turno" class="form-control">
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="btnCambiarTurno" onclick=${()=>GuardarCambioTurno(movimiento)}>Aceptar</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>`
    var modal_proceso = document.getElementById('modal-alerta');
    empty(modal_proceso).appendChild(el);
    $('#modal-alerta').modal()
    TraerPeriodos()
}


function AbrirModalConfirmacion(flag,movimiento){
    var el=''
    if(flag=="eliminar"){
        el = yo`
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                        <h4 class="modal-title">Se eliminara el dato seleccionado</h4>
                    </div>
                    <div class="modal-body">
                        <p>¿Esta seguro de eliminar este comprobante?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick=${()=>AceptarConfirmacion(flag,movimiento)}>Aceptar</button>
                    </div>
                </div>
                <!-- /.modal-content -->
            </div>`
    }else{ 
        el = yo`
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                        <h4 class="modal-title">Se eliminara el dato seleccionado</h4>
                    </div>
                    <div class="modal-body">
                        <p>¿Esta seguro de extornar este comprobante?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick=${()=>AceptarConfirmacion(flag,movimiento)}>Aceptar</button>
                    </div>
                </div>
                <!-- /.modal-content -->
            </div>` 
    }


    var modal_proceso = document.getElementById('modal-alerta');
    empty(modal_proceso).appendChild(el);
    $('#modal-alerta').modal()
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
        ${turnos.map(e => yo`
             <option value="${e.Cod_Turno}">${e.Des_Turno}</option>
        `)}`   
    $("#"+idSelect).html('')
    $("#"+idSelect).html(el) 
}

function LlenarManguera(mangueras,idSelect){
    var el = yo`
    ${mangueras.map(e => yo`
         <option value="${e.Cod_Turno}">${e.Des_Turno}</option>
    `)}`   
    $("#"+idSelect).html('')
    $("#"+idSelect).html(el) 
}



function TraerPeriodos(){
    var Gestion = $("#Gestion").val()  
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
            LlenarPeriodo(res.data.periodos,'Periodo')
            TraerTurnos()
        })
}

function TraerTurnos(){
    var Cod_Periodo = $("#Periodo").val()
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
            LlenarTurnos(res.data.turnos,'Turno')
        })
}

function GuardarCambioTurno(movimiento){ 
    var id_ComprobantePago = movimiento.ID
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            id_ComprobantePago
        })
    }
    switch (movimiento.Entidad) {
        case "CAJ_COMPROBANTE_PAGO":

            var id_ComprobantePago = movimiento.ID
            var Cod_Turno = $("#Turno").val()
            const parametrosCP = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    id_ComprobantePago,
                    Cod_Turno
                })
            }
             
            fetch(URL + '/turnos_api/cambiar_comprobante_by_turno', parametrosCP)
                .then(req => req.json())
                .then(res => {
                    $("#modal-alerta").modal("hide") 
                    refrescar_movimientos_caja()
                    if (res.respuesta == 'ok') { 
                        toastr.success('Se modifico correctamente el turno','Confirmacion',{timeOut: 5000})
                    }else{
                        toastr.error('No se pudo modificar el turno','Error',{timeOut: 5000})
                    }
                })
            break;
        case "CAJ_CAJA_MOVIMIENTOS":
            
            var Id_MovimientoCaja = movimiento.ID
            var Cod_TurnoActual = $("#Turno").val()
            const parametrosCM = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    Id_MovimientoCaja,
                    Cod_TurnoActual
                })
            }

            fetch(URL + '/turnos_api/cambiar_movimientos_by_turno', parametrosCM)
                .then(req => req.json())
                .then(res => {
                    $("#modal-alerta").modal("hide") 
                    refrescar_movimientos_caja()
                    if (res.respuesta == 'ok') { 
                        toastr.success('Se modifico correctamente el turno','Confirmacion',{timeOut: 5000})
                    }else{
                        toastr.error('No se pudo modificar el turno','Error',{timeOut: 5000})
                    }
                })
            break;
        case "ALM_ALMACEN_MOV":
            
            var Id_AlmacenMov = movimiento.ID
            var Cod_TurnoActual = $("#Turno").val()
            const parametrosAM = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    Id_AlmacenMov,
                    Cod_TurnoActual
                })
            }

            fetch(URL + '/turnos_api/cambiar_almacen_by_turno', parametrosAM)
                .then(req => req.json())
                .then(res => {
                    $("#modal-alerta").modal("hide") 
                    refrescar_movimientos_caja()
                    if (res.respuesta == 'ok') { 
                        toastr.success('Se modifico correctamente el turno','Confirmacion',{timeOut: 5000})
                    }else{
                        toastr.error('No se pudo modificar el turno','Error',{timeOut: 5000})
                    }
                })
            break;
    }
}

 
 

function AceptarConfirmacion(flag,movimiento){
    $("#modal-alerta").modal("hide")
    if(flag=="eliminar"){
        VerModalJustificacion("Ingrese una justificacion de eliminacion","Por ejemplo : Por error de ingreso en monto",movimiento,flag)
    }else{ 
        VerModalJustificacion("Ingrese una justificacion del extorno / anulacion","Por ejemplo : Por error de ingreso en",movimiento,flag)
    }
}

function VerFormatoDocumento(movimiento){
    var entidad = movimiento.Entidad
    var id_Movimiento = movimiento.ID
    switch (entidad){
        case 'CAJ_CAJA_MOVIMIENTOS':
            var descripcion = movimiento.Descripcion
            if(descripcion!='REQUIERE DE AUTORIZACION'){
                
            }else{
                toastr.error('No Puede imprimir un documento que Requiere de Autorizacion. Comuniquese con su Administrador.','Error',{timeOut: 5000})
            }
            break
        case 'CAJ_COMPROBANTE_PAGO':
            PrepararImpresion(id_Movimiento,function(flag){
                if(!flag){
                    toastr.error('No Puede imprimir el comprobante. Comuniquese con su Administrador.','Error',{timeOut: 5000})
                }
            })
            break
        case 'ALM_ALMACEN_MOV':
            break
    }
}
 

function ExtornarAnular(movimiento,flag) {
    var id_Movimiento = movimiento.ID
    var entidad = movimiento.Entidad
    var MotivoAnulacion = $("#txtJustificacion").val()
    const fecha = new Date()
    const mes = fecha.getMonth() + 1
    const dia = fecha.getDate() 
    var fecha_format = fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia) + ' '+ [(fecha.getHours()>9?fecha.getHours():'0'+fecha.getHours()), (fecha.getMinutes()>9?fecha.getMinutes():'0'+fecha.getMinutes())].join(':');
    
    var parametros = {} 
    if(ValidacionCampos('modal_error','modal_form')){ 
        if(flag=="extornar"){ 
            switch (entidad){
                case "CAJ_CAJA_MOVIMIENTOS":
                    parametros = {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        credentials: 'same-origin',
                        body: JSON.stringify({
                            id_Movimiento
                        })
                    }
                    fetch(URL + '/movimientos_caja_api/extornar_movimiento', parametros)
                        .then(req => req.json())
                        .then(res => {
                            $("#modal-justificacion").modal("hide") 
                            //refrescar_movimientos_caja()
                            if (res.respuesta == 'ok') { 
                                refrescar_movimientos_caja()
                                toastr.success('Se anulo correctamente el movimiento','Confirmacion',{timeOut: 5000})
                            }else{
                                toastr.error('No se pudo anular correctamente el movimiento','Error',{timeOut: 5000})
                            }
                        })
                    break;
                case "CAJ_COMPROBANTE_PAGO":
                    console.log("CAJ_COMPROBANTE_PAGO")
                    parametros = {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        credentials: 'same-origin',
                        body: JSON.stringify({
                            id_ComprobantePago:id_Movimiento
                        })
                    }
                    fetch(URL + '/comprobantes_pago_api/get_comprobante_pago', parametros)
                        .then(req => req.json())
                        .then(res => {
                            var comprobante_pago = res.data.comprobante_pago[0]
                            var id_ComprobantePago = comprobante_pago.id_ComprobantePago
                            if(comprobante_pago.Cod_TipoComprobante=='TKF' || comprobante_pago.Cod_TipoComprobante=='TKB'){
                                parametros = {
                                    method: 'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',
                                    },
                                    credentials: 'same-origin',
                                    body: JSON.stringify({
                                        id_ComprobantePago:id_Movimiento,
                                        Fecha:fecha_format,
                                        MotivoAnulacion
                                    })
                                }
                                fetch(URL + '/comprobantes_pago_api/extornar_comprobante_pago', parametros)
                                    .then(req => req.json())
                                    .then(res => {
                                        $("#modal-justificacion").modal("hide")
                                        if(res.respuesta=='ok'){
                                            PrepararImpresion(id_ComprobantePago,function(flag){
                                                if(flag)
                                                    toastr.success('Se anulo correctamente el comprobante','Confirmacion',{timeOut: 5000})
                                                refrescar_movimientos_caja()
                                            })
                                            
                                        }else{
                                            toastr.error('No se pudo anular correctamente el comprobante','Error',{timeOut: 5000})
                                        }
                                    })
                            }else{
                                if(comprobante_pago.Cod_TipoComprobante=='FE' || comprobante_pago.Cod_TipoComprobante=='BE'){
                                    parametros = {
                                        method: 'POST',
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        credentials: 'same-origin',
                                        body: JSON.stringify({
                                            id_ComprobantePago:id_Movimiento,
                                            Fecha:fecha_format,
                                            MotivoAnulacion
                                        })
                                    }
                                    fetch(URL + '/comprobantes_pago_api/extornar_comprobante_pago', parametros)
                                        .then(req => req.json())
                                        .then(res => {
                                            $("#modal-justificacion").modal("hide")
                                            if(res.respuesta=='ok'){
                                                PrepararImpresion(id_ComprobantePago,function(flag){
                                                    if(flag)
                                                        toastr.success('Se anulo correctamente el comprobante','Confirmacion',{timeOut: 5000})
                                                    refrescar_movimientos_caja()
                                                })
                                            }else{
                                                toastr.error('No se pudo anular correctamente el comprobante','Error',{timeOut: 5000})
                                            }
                                        })
                                }else{
                                    
                                    parametros = {
                                        method: 'POST',
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        credentials: 'same-origin',
                                        body: JSON.stringify({
                                            id_ComprobantePago:id_Movimiento,
                                            Fecha:fecha_format,
                                            MotivoAnulacion
                                        })
                                    }
                                    fetch(URL + '/comprobantes_pago_api/extornar_comprobante_pago', parametros)
                                        .then(req => req.json())
                                        .then(res => {
                                            $("#modal-justificacion").modal("hide")
                                            if(res.respuesta=='ok'){
                                                PrepararImpresion(id_ComprobantePago,function(flag){
                                                    if(flag)
                                                        toastr.success('Se anulo correctamente el comprobante','Confirmacion',{timeOut: 5000})
                                                    refrescar_movimientos_caja()
                                                })
                                            }else{
                                                toastr.error('No se pudo anular correctamente el comprobante','Error',{timeOut: 5000})
                                            }
                                        })


                                }
                            }
                            /*$("#modal-justificacion").modal("hide")  
                            if (res.respuesta == 'ok') { 
                                refrescar_movimientos_caja()
                                toastr.success('Se anulo correctamente el comprobante','Confirmacion',{timeOut: 5000})
                            }else{
                                toastr.error('No se pudo anular correctamente el comprobante','Error',{timeOut: 5000})
                            }*/
                        })
                    break;
                case "ALM_ALMACEN_MOV":
                    var Id_Almacen_Mov = id_Movimiento 
                    parametros = {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        credentials: 'same-origin',
                        body: JSON.stringify({
                            Id_Almacen_Mov
                        })
                    }
                    fetch(URL + '/movimientos_caja_api/extornar_movimiento_almacen', parametros)
                        .then(req => req.json())
                        .then(res => {
                            $("#modal-justificacion").modal("hide") 
                            //refrescar_movimientos_caja()
                            if (res.respuesta == 'ok') { 
                                refrescar_movimientos_caja()
                                toastr.success('Se anulo correctamente el movimiento','Confirmacion',{timeOut: 5000})
                            }else{
                                toastr.error('No se pudo anular correctamente el movimiento','Error',{timeOut: 5000})
                            }
                        })
                    break;
                case "CAJ_FORMA_PAGO":
                    var id_ComprobantePago = id_Movimiento 
                    var Item = movimiento.Item
                    parametros = {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        credentials: 'same-origin',
                        body: JSON.stringify({
                            id_ComprobantePago,
                            Item
                        })
                    }
                    fetch(URL + '/movimientos_caja_api/extornar_movimiento_almacen', parametros)
                        .then(req => req.json())
                        .then(res => {
                            $("#modal-justificacion").modal("hide") 
                            //refrescar_movimientos_caja()
                            if (res.respuesta == 'ok') { 
                                refrescar_movimientos_caja()
                                toastr.success('Se anulo correctamente el movimiento','Confirmacion',{timeOut: 5000})
                            }else{
                                toastr.error('No se pudo anular correctamente el movimiento','Error',{timeOut: 5000})
                            }
                        })
                    break;


            }



            
        }else{

            switch (entidad){
                case "CAJ_CAJA_MOVIMIENTOS":
                    parametros = {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        credentials: 'same-origin',
                        body: JSON.stringify({
                            id_Movimiento

                        })
                    }
                    fetch(URL + '/movimientos_caja_api/eliminar_movimiento', parametros)
                        .then(req => req.json())
                        .then(res => {
                            $("#modal-justificacion").modal("hide")
                            //refrescar_movimientos_caja()
                            if (res.respuesta == 'ok') { 
                                refrescar_movimientos_caja()
                                toastr.success('Se elimino correctamente el movimiento','Confirmacion',{timeOut: 5000})
                            }else{
                                toastr.error('No se pudo eliminar correctamente el movimiento','Error',{timeOut: 5000})
                            } 
                        })
                    break;
                case "CAJ_COMPROBANTE_PAGO":
                    var Justificacion = $("#txtJustificacion").val() 
                    var id_ComprobantePago = id_Movimiento
                    parametros = {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        credentials: 'same-origin',
                        body: JSON.stringify({
                            id_ComprobantePago,
                            Justificacion
                        })
                    }
                    fetch(URL + '/movimientos_caja_api/eliminar_movimiento', parametros)
                        .then(req => req.json())
                        .then(res => {
                            $("#modal-justificacion").modal("hide")
                            //refrescar_movimientos_caja()
                            if (res.respuesta == 'ok') { 
                                refrescar_movimientos_caja()
                                toastr.success('Se elimino correctamente el comprobante','Confirmacion',{timeOut: 5000})
                            }else{
                                toastr.error('No se pudo eliminar correctamente el comprobante','Error',{timeOut: 5000})
                            } 
                        })
                    break;
                case "ALM_ALMACEN_MOV": 
                    var Id_AlmacenMov = id_Movimiento
                    parametros = {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        credentials: 'same-origin',
                        body: JSON.stringify({
                            Id_AlmacenMov
                        })
                    }
                    fetch(URL + '/movimientos_caja_api/eliminar_movimiento_almacen', parametros)
                        .then(req => req.json())
                        .then(res => {
                            $("#modal-justificacion").modal("hide")
                            //refrescar_movimientos_caja()
                            if (res.respuesta == 'ok') { 
                                refrescar_movimientos_caja()
                                toastr.success('Se elimino correctamente el movimiento','Confirmacion',{timeOut: 5000})
                            }else{
                                toastr.error('No se pudo eliminar correctamente el movimiento','Error',{timeOut: 5000})
                            } 
                        })
                    break;

            }


            
        }
    }
}

function RecuperarNombreComprobante(CodTipoComprobante){
    switch (CodTipoComprobante){
        case "BE":
            return "BOLETA ELECTRONICA";
        case "FE":
            return "FACTURA ELECTRONICA";
        case "NCE":
            return "NOTA DE CREDITO ELECTRONICA";
        case "NDE":
            return "NOTA DE DEBITO ELECTRONICO";
        case "TKB":
            return "TICKET BOLETA";
        case "TKF":
            return "TICKET FACTURA";
        case "NP":
            return "NOTA DE PEDIDO";
        default:
            return " ";
    }
}

function FormatearDataDetalles(indiceDetalles,arrayDetalles,arrayNuevo,callback){
    if(indiceDetalles<arrayDetalles.length){
        arrayNuevo.push({
            'DESCRIPCION':arrayDetalles[indiceDetalles].Descripcion,
            'UNIDAD':arrayDetalles[indiceDetalles].Nom_UnidadMedida,
            'CANTIDAD':arrayDetalles[indiceDetalles].Cantidad,
            'PRECIO_UNITARIO':arrayDetalles[indiceDetalles].PrecioUnitario,
            'DESCUENTO':arrayDetalles[indiceDetalles].Descuento,
            'SUBTOTAL':arrayDetalles[indiceDetalles].Sub_Total
        })
        FormatearDataDetalles(indiceDetalles+1,arrayDetalles,arrayNuevo,callback)
    }else{
        callback(arrayNuevo)
    }
}

function FormatearDataObservaciones(obs_string,indiceObs,obs_xml,callback){
    var xml = obs_xml!=null?obs_xml:'' 
    var xmlDoc = parser.parseFromString(xml, "text/xml");
    if (xmlDoc.getElementsByTagName('REGISTRO').length > 0 && indiceObs<xmlDoc.getElementsByTagName('REGISTRO')[0].childNodes.length > 0) {
        obs_string = obs_string + ' '+ xmlDoc.getElementsByTagName('REGISTRO')[0].childNodes[indiceObs].nodeName + ':'+ xmlDoc.getElementsByTagName('REGISTRO')[0].childNodes[indiceObs].nodeValue
        FormatearDataObservaciones(obs_string,indexedDB+1,obs_xml,callback)
       // return xmlDoc.getElementsByTagName(TAG)[0].childNodes[0].nodeValue
    } else {
        callback(obs_string)
    }
}

function PrepararImpresion(id_ComprobantePago,callback){
    const parametrosC = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id_ComprobantePago:id_ComprobantePago
        })
    }
    fetch(URL+'/comprobantes_pago_api/get_comprobante_pago', parametrosC)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var dataComprobante = res.data.comprobante_pago[0]

                const parametrosDC = {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id_ComprobantePago:id_ComprobantePago
                    })
                }
                fetch(URL+'/comprobantes_pago_api/get_comprobante_pago', parametrosDC)
                    .then(req => req.json())
                    .then(res => {
                        if(res.respuesta=='ok'){
                            callback(true)
                            var dataDetallesComprobante = res.data.detalles_comprobante_pago
                            var dataEmpresa = res.empresa[0]
                            var arrayNuevo = []
                            var obs_string = ''
                            FormatearDataDetalles(0,dataDetallesComprobante,arrayNuevo,function(arrayJson){
                                FormatearDataObservaciones(obs_string,0,dataComprobante.Obs_Comprobante,function(data_string){
                                    EnviarImpresion(dataComprobante.Cod_Libro,
                                        dataComprobante.Cod_TipoComprobante,
                                        RecuperarNombreComprobante(dataComprobante.Cod_TipoComprobante),
                                        dataComprobante.Serie,
                                        dataComprobante.Numero,
                                        true,
                                        dataComprobante.MotivoAnulacion,
                                        dataComprobante.Nom_Cliente,
                                        dataComprobante.Cod_TipoDoc,
                                        dataComprobante.Doc_Cliente,
                                        dataComprobante.Direccion_Cliente,
                                        dataComprobante.FechaEmision,
                                        dataComprobante.FechaVencimiento,
                                        dataComprobante.Cod_FormaPago,
                                        dataComprobante.Glosa,
                                        data_string,
                                        dataComprobante.Cod_Moneda,
                                        ConvertirCadena(parseFloat(dataComprobante.Total),dataComprobante.Cod_Moneda=="PEN" ? "S/" : "$"),
                                        (parseFloat(dataComprobante.Total) - parseFloat(dataComprobante.Impuesto)).toFixed(2),'0','0','0','0',
                                        dataEmpresa.Des_Impuesto,
                                        dataEmpresa.Por_Impuesto,
                                        parseFloat(dataComprobante.Impuesto).toFixed(2),
                                        parseFloat(dataComprobante.Total).toFixed(2),
                                        arrayJson)

                                })
                                
                                /*EnviarImpresion(dataComprobante.Cod_Libro,
                                                dataComprobante.Cod_TipoComprobante,
                                                RecuperarNombreComprobante(dataComprobante.Cod_TipoComprobante),
                                                dataComprobante.Serie,
                                                dataComprobante.Numero,
                                                true,
                                                dataComprobante.MotivoAnulacion,
                                                dataComprobante.Nom_Cliente,
                                                dataComprobante.COd_TipoDoc,
                                                dataComprobante.Doc_Cliente,
                                                dataComprobante.Direccion_Cliente,
                                                dataComprobante.FechaEmision,
                                                dataComprobante.FechaVencimiento,
                                                dataComprobante.Cod_FormaPago,
                                                dataComprobante.Glosa,*/



                            })
                        }else{
                            toastr.error('No se pudo recuperar los detalles del comprobante','Error',{timeOut: 5000})  
                            callback(false)
                        }
                    })

            }
            else{
                toastr.error('No se pudo recuperar el comprobante','Error',{timeOut: 5000}) 
                callback(false)
            }
          
        }) 
}

function refrescar_movimientos_caja(){
    H5_loading.show();
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        })
    }
    fetch(URL+'/movimientos_caja_api/get_movimientos', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {

                VerTabCaja(res.arqueo!=null?res.arqueo.Flag_Cerrado:true,res.data.movimientos,res.data.saldos)
            }
            else
                VerTabCaja([])
            H5_loading.hide()
        }) 
}


module.exports = function movimientos_caja(ctx, next) {
    H5_loading.show();
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        })
    }
    fetch(URL+'/movimientos_caja_api/get_movimientos', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                Ver(res.arqueo!=null?res.arqueo.Flag_Cerrado:true,res.data.movimientos,res.data.saldos)
            }
            else
                Ver([])
            H5_loading.hide()
        })
    next();
}

module.exports.refrescar_movimientos = function refrescar_movimientos(){
    refrescar_movimientos_caja()
}