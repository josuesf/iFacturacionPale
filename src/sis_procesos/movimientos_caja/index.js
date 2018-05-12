var yo = require('yo-yo')
var empty = require('empty-element');
import {URL} from '../../constantes_entorno/constantes'
function Ver(movimientos,saldos) {
    var el = yo`
        <div>
            <section class="content-header" id="sectionModals">
                <div class="modal modal-danger fade" id="modal-danger" style="display: none;">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                                <h4 class="modal-title">¿Esta seguro que desea eliminar este cliente/proveedor?</h4>
                            </div>
                            <div class="modal-body">
                                <p>Al eliminar el cliente no podra recuperarlo. Desea continuar de todas maneras?</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-outline pull-left" data-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-outline" id="btnEliminar" data-dismiss="modal">Si,Eliminar</button>
                            </div>
                        </div>
                        <!-- /.modal-content -->
                    </div>
                    <!-- /.modal-dialog -->
                </div>

                <div class="modal modal-default fade" id="modal-turno" style="display: none;">
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
                                            <input type="number" id="Gestion" class="form-control" onkeyup=${()=>TraerPeriodos()} onchange=${()=>TraerPeriodos()}>
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
                                <button type="button" class="btn btn-primary" id="btnCambiarTurno" onclick=${()=>GuardarCambioTurno()}>Aceptar</button>
                            </div>
                        </div>
                        <!-- /.modal-content -->
                    </div>
                    <!-- /.modal-dialog -->
                </div>


                <div class="modal modal-default fade" id="modal-manguera" style="display: none;">
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
                                <button type="button" class="btn btn-primary" id="btnCambiarTurno" onclick=${()=>GuardarManguera()}>Aceptar</button>
                            </div>
                        </div>
                        <!-- /.modal-content -->
                    </div>
                    <!-- /.modal-dialog -->
                </div>

                <div class="modal fade" id="modal-confirmacion">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                                <h4 class="modal-title" id="txtTituloConfirmacion"> </h4>
                            </div>
                            <div class="modal-body">
                                <p id="txtDescripcionConfirmacion"></p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-primary" id="btnConfirmacion" onclick=${()=>AceptarConfirmacion()}>Aceptar</button>
                            </div>
                        </div>
                        <!-- /.modal-content -->
                    </div>
                    <!-- /.modal-dialog -->
                </div>

                <div class="modal modal-default fade" id="modal-justificacion" style="display: none;">
                     
                </div>

                <div class="modal fade" id="modal-superior" style="display: none;z-index: 1051;" >
                     
                </div>
                <div class="modal fade" id="modal-proceso">
                    
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
                                    
                                    <div class="box">
                                        <div class="box-header">
                                            <h3 class="box-title">Movimientos de Caja</h3>
                                        </div>
                                        <!-- /.box-header -->
                                        <div class="box-body">
                                            <div class="table-responsive">
                                            <table id="example1" class="table table-bordered table-striped">
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
                                                    <div class="btn-group">
                                                        <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        Elegir una accion <span class="caret"></span>
                                                        </button>
                                                        <ul class="dropdown-menu">
                                                        <li><a href="javascript:void(0)" onclick=${()=>AbrirModalConfirmacion('extornar',u)} ><i class="fa fa-times-circle"></i>Anular</a></li>
                                                        <li><a href="javascript:void(0)"><i class="fa fa-print"></i>Re-Imprimir</a></li>
                                                        <li><a href="javascript:void(0)" onclick=${()=>AbrirModalManguera(u)} ><i class="fa fa-refresh"></i>Cambiar Plan</a></li>
                                                        <li><a href="javascript:void(0)" onclick=${()=>AbrirModalCambiarTurno(u)}><i class="fa fa-calendar"></i>Cambiar Turno</a></li>
                                                        <li><a href="javascript:void(0)" onclick=${()=>AbrirModalConfirmacion('eliminar',u)}><i class="fa fa-close"></i> Eliminar</a></li>
                                                        </ul>
                                                    </div>
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
}

function VerModalJustificacion(titulo,descripcion) {
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
                        <button type="button" class="btn btn-primary" id="btnExtornarAnular" onclick=${()=>ExtornarAnular()}>Aceptar</button>
                    </div>
                </div>
                <!-- /.modal-content -->
            </div>`

    var modal_justificacion = document.getElementById('modal-justificacion');
    empty(modal_justificacion).appendChild(el);
    $('#modal-justificacion').modal()
}


function VerTabCaja(movimientos,saldos) {
    var sectionModals = yo`
                <div>
                    <div class="modal modal-danger fade" id="modal-danger" style="display: none;">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">×</span>
                                    </button>
                                    <h4 class="modal-title">¿Esta seguro que desea eliminar este cliente/proveedor?</h4>
                                </div>
                                <div class="modal-body">
                                    <p>Al eliminar el cliente no podra recuperarlo. Desea continuar de todas maneras?</p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-outline pull-left" data-dismiss="modal">Cancelar</button>
                                    <button type="button" class="btn btn-outline" id="btnEliminar" data-dismiss="modal">Si,Eliminar</button>
                                </div>
                            </div>
                            <!-- /.modal-content -->
                        </div>
                        <!-- /.modal-dialog -->
                    </div>

                    <div class="modal modal-default fade" id="modal-turno" style="display: none;">
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
                                                <input type="number" id="Gestion" class="form-control" onkeyup=${()=>TraerPeriodos()} onchange=${()=>TraerPeriodos()}>
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
                                    <button type="button" class="btn btn-primary" id="btnCambiarTurno" onclick=${()=>GuardarCambioTurno()}>Aceptar</button>
                                </div>
                            </div>
                            <!-- /.modal-content -->
                        </div>
                        <!-- /.modal-dialog -->
                    </div>


                    <div class="modal modal-default fade" id="modal-manguera" style="display: none;">
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
                                    <button type="button" class="btn btn-primary" id="btnCambiarTurno" onclick=${()=>GuardarManguera()}>Aceptar</button>
                                </div>
                            </div>
                            <!-- /.modal-content -->
                        </div>
                        <!-- /.modal-dialog -->
                    </div>

                    <div class="modal fade" id="modal-confirmacion">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">×</span>
                                    </button>
                                    <h4 class="modal-title" id="txtTituloConfirmacion"> </h4>
                                </div>
                                <div class="modal-body">
                                    <p id="txtDescripcionConfirmacion"></p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>
                                    <button type="button" class="btn btn-primary" id="btnConfirmacion" onclick=${()=>AceptarConfirmacion()}>Aceptar</button>
                                </div>
                            </div>
                            <!-- /.modal-content -->
                        </div>
                        <!-- /.modal-dialog -->
                    </div>

                    <div class="modal modal-default fade" id="modal-justificacion" style="display: none;">
                        
                    </div>

                    <div class="modal fade" id="modal-superior" style="display: none;z-index: 1051;" >
                        
                    </div>
                    <div class="modal fade" id="modal-proceso">
                        
                    </div>
                </div>`

    var el = yo`<div class="box">
                    <div class="box-header">
                        <h3 class="box-title">Movimientos de Caja</h3>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body">
                        <div class="table-responsive">
                        <table id="example1" class="table table-bordered table-striped">
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
                                <div class="btn-group">
                                    <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Elegir una accion <span class="caret"></span>
                                    </button>
                                    <ul class="dropdown-menu">
                                    <li><a href="javascript:void(0)" onclick=${()=>AbrirModalConfirmacion('extornar',u)} ><i class="fa fa-times-circle"></i>Anular</a></li>
                                    <li><a href="javascript:void(0)"><i class="fa fa-print"></i>Re-Imprimir</a></li>
                                    <li><a href="javascript:void(0)" onclick=${()=>AbrirModalManguera(u)} ><i class="fa fa-refresh"></i>Cambiar Plan</a></li>
                                    <li><a href="javascript:void(0)" onclick=${()=>AbrirModalCambiarTurno(u)}><i class="fa fa-calendar"></i>Cambiar Turno</a></li>
                                    <li><a href="javascript:void(0)" onclick=${()=>AbrirModalConfirmacion('eliminar',u)}><i class="fa fa-close"></i> Eliminar</a></li>
                                    </ul>
                                </div>
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
    $('#content_footer').html(sectionFooter);
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

var flagOpciones = ''
var movimiento_elegido = null

function AbrirModalManguera(movimiento){
    movimiento_elegido = movimiento
    $("#modal-manguera").modal("show")
}


function AbrirModalCambiarTurno(movimiento){
    movimiento_elegido = movimiento
    $("#modal-turno").modal("show")
    const fecha = new Date()
    var anio = fecha.getFullYear() 
    $("#Gestion").val(anio)
    TraerPeriodos()
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

function GuardarCambioTurno(){ 
    var id_ComprobantePago = movimiento_elegido.ID
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
    switch (movimiento_elegido.Entidad) {
        case "CAJ_COMPROBANTE_PAGO":

            var id_ComprobantePago = movimiento_elegido.ID
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
                    $("#modal-turno").modal("hide") 
                    refrescar_movimientos_caja()
                    if (res.respuesta == 'ok') { 
                        toastr.success('Se modifico correctamente el turno','Confirmacion',{timeOut: 5000})
                    }else{
                        toastr.error('No se pudo modificar el turno','Error',{timeOut: 5000})
                    }
                })
            break;
        case "CAJ_CAJA_MOVIMIENTOS":
            
            var Id_MovimientoCaja = movimiento_elegido.ID
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
                    $("#modal-turno").modal("hide") 
                    refrescar_movimientos_caja()
                    if (res.respuesta == 'ok') { 
                        toastr.success('Se modifico correctamente el turno','Confirmacion',{timeOut: 5000})
                    }else{
                        toastr.error('No se pudo modificar el turno','Error',{timeOut: 5000})
                    }
                })
            break;
        case "ALM_ALMACEN_MOV":
            
            var Id_AlmacenMov = movimiento_elegido.ID
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
                    $("#modal-turno").modal("hide") 
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



function AbrirModalConfirmacion(flag,movimiento){
    $("#modal-confirmacion").modal("show")
    movimiento_elegido = movimiento
    flagOpciones = flag
    if(flag=="eliminar"){
        $("#txtTituloConfirmacion").text("Se eliminaran el dato seleccionado")
        $("#txtDescripcionConfirmacion").text("¿Esta seguro de extornar este comprobante?")
    }else{
        if(flag=="extornar"){
            $("#txtTituloConfirmacion").text("Se eliminaran el dato seleccionado")
            $("#txtDescripcionConfirmacion").text("¿Esta seguro de eliminar este comprobante?")
        }
    }
}

function AceptarConfirmacion(){
    $("#modal-confirmacion").modal("hide")
    if(flagOpciones=="eliminar"){
        VerModalJustificacion("Ingrese una justificacion de eliminacion","Por ejemplo : Por error de ingreso en monto")
    }else{
        if(flagOpciones=="extornar"){
            VerModalJustificacion("Ingrese una justificacion del extorno / anulacion","Por ejemplo : Por error de ingreso en")
        }
    }
}
 

function ExtornarAnular() {
    var id_Movimiento = movimiento_elegido.ID
    if(ValidacionCampos('modal_error','modal_form')){ 
        if(flagOpciones=="extornar"){
            const parametros = {
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
                        toastr.success('Se anulo correctamente el comprobante','Confirmacion',{timeOut: 5000})
                    }else{
                        toastr.error('No se pudo anular correctamente el comprobante','Error',{timeOut: 5000})
                    }
                })
        }else{
            const parametros = {
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
                        toastr.success('Se elimino correctamente el comprobante','Confirmacion',{timeOut: 5000})
                    }else{
                        toastr.error('No se pudo eliminar correctamente el comprobante','Error',{timeOut: 5000})
                    } 
                })
        }
    }
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

                VerTabCaja(res.data.movimientos,res.data.saldos)
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

                Ver(res.data.movimientos,res.data.saldos)
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