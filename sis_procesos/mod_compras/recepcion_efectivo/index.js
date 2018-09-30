var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../../constantes_entorno/constantes'
import { refrescar_movimientos } from '../../movimientos_caja'
import { BuscarCliente } from '../../modales'
import { LimpiarEventoModales } from '../../../../utility/tools'

//var flag_button = false
//var total = 0 
//var totalMonto = 0
//var totalRecibido = 0 

var cantidad_tabs = 0
global.variablesR = {}

function Ver(variables) {
    //cantidad_tabs++
    const idTabR = "R_"+cantidad_tabs
    global.variablesR[idTabR]={idTab:idTabR,flag_button:false,total:0,totalMonto:0,totalRecibido:0}
    
    var tab = yo`
    <li class="" ><a href="#tab_${idTabR}" data-toggle="tab" aria-expanded="false" id="id_${idTabR}">Recepcion de Transferencia <a style="padding-left: 10px;"  onclick=${()=>CerrarTabR(idTabR)} class="btn"><i class="fa fa-close text-danger"></i></a></a></li>`


    var el = yo`
        <div class="tab-pane" id="tab_${idTabR}">
            <div class="panel">
                <div class="panel-body">
                    <div class="row" id="divRecepcionados_${idTabR}" style="overflow-x: auto;">
                        <table class="table table-bordered table-striped" id="tablaRecepciones_${idTabR}">
                            <thead>
                                <tr>
                                    <th>Turno</th>
                                    <th>Caja</th> 
                                    <th>Hora</th>
                                    <th>Movimiento</th>
                                    <th>M</th>
                                    <th>Monto</th>
                                    <th>Recibido</th>
                                    <th>Dif.</th>
                                    <th>Responsable</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${variables.movimientos_pendientes.map(u => yo`
                                <tr> 
                                    ${ActualizarMontosTotales(parseFloat(u.Ingreso) -parseFloat(u.Ingreso),u.Ingreso,u.Ingreso,idTabR)}
                                    <td>${u.Cod_Turno}</td>
                                    <td>${u.Des_Caja}</td>
                                    <td>${u.Fecha_Inicio}</td>
                                    <td>${u.Movimiento}</td>
                                    <td>${u.Simbolo}</td>
                                    <td> ${u.Ingreso}</td>
                                    <td><input type="number" value="${parseFloat(u.Ingreso) -parseFloat(u.Diferencia)}" onkeyup=${()=>CambioMonto(btoa(u.id_Movimiento).toString().replace(/=/g ,""),u.Ingreso,idTabR)} onchange=${()=>CambioMonto(btoa(u.id_Movimiento).toString().replace(/=/g ,""),u.Ingreso,idTabR)} class="form-control recibido" id="R${btoa(u.id_Movimiento).toString().replace(/=/g ,"")}_${idTabR}"></td>
                                    <td class="diferencia" id="D${btoa(u.id_Movimiento).toString().replace(/=/g ,"")}_${idTabR}">${u.Diferencia}</td> 
                                    <td><input value="${u.Responsable}" type="text" id="${btoa(u.id_Movimiento).toString().replace(/=/g ,"")}_${idTabR}" class="form-control" onchange=${()=>BuscarResponsable(btoa(u.id_Movimiento).replace(/=/g ,""),idTabR)} data-id="-1"></td>
                                    <td>
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-xs" data-toggle="tooltip" data-placement="top" title="" data-original-title="Poner como pendiente" onclick=${()=>Reactivar(u,btoa(u.id_Movimiento).replace(/=/g ,""),idTabR)}><i class="fa fa-share"></i> </button>
                                            <button class="btn btn-success btn-xs" data-toggle="tooltip" data-placement="top" title="" data-original-title="Recepcionar" onclick=${()=>RegistrarRecepcion(u,btoa(u.id_Movimiento).replace(/=/g ,""),idTabR)}><i class="fa fa-arrow-circle-down"></i> </button>
                                        </div>
                                    </td>
                                </tr>`)}
                            </tbody>
                        
                        </table>
                    </div>
                    <div class="row">
                        <div class="col-md-2">
                            <button type="button" class="btn btn-success" onclick=${()=>Recepcionados(idTabR)}><i class="fa fa-arrow-circle-down"></i> Recepcionados</button>
                        </div>
                        <div class="col-md-10">
                            <div class="row" id="divTotales_${idTabR}">
                                <div class="col-md-12">
                                    <div class="col-md-3">
                                        <label>Total Recepcion : </label>
                                    </div>
                                    <div class="col-md-3" >
                                        <input type="number" class="form-control" id="totalMonto_${idTabR}" value="${global.variablesR[idTabR].totalMonto}">
                                    </div>
                                    <div class="col-md-3" >
                                        <input type="number" class="form-control" id="totalRecibido_${idTabR}" value="${global.variablesR[idTabR].totalRecibido}">
                                    </div>
                                    <div class="col-md-3">
                                        <input type="number" class="form-control"  id="total_${idTabR}" value="${global.variablesR[idTabR].total}">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer text-center"> 
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                </div>
            </div>
        </div>`

    //var modal_proceso = document.getElementById('modal-proceso');
    //empty(modal_proceso).appendChild(el);
    //$('#modal-proceso').modal()

    if($("#tab_"+idTabR).length){   
        $('#tab_'+idTabR).remove()
        $('#id_'+idTabR).parents('li').remove()

        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    }else{
        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    } 
    $("#id_"+idTabR).click()
    console.log(global.variablesR)
}

function RefrescarVer(variables,idTabR) {
    global.variablesR[idTabR]={idTab:idTabR,flag_button:false,total:0,totalMonto:0,totalRecibido:0}
    var el = yo`
        <div class="tab-pane" id="tab_${idTabR}">
            <div class="panel">
                <div class="panel-body">
                    <div class="row" id="divRecepcionados_${idTabR}" style="overflow-x: auto;">
                        <table class="table table-bordered table-striped" id="tablaRecepciones_${idTabR}">
                            <thead>
                                <tr>
                                    <th>Turno</th>
                                    <th>Caja</th> 
                                    <th>Hora</th>
                                    <th>Movimiento</th>
                                    <th>M</th>
                                    <th>Monto</th>
                                    <th>Recibido</th>
                                    <th>Dif.</th>
                                    <th>Responsable</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${variables.movimientos_pendientes.map(u => yo`
                                <tr> 
                                    ${ActualizarMontosTotales(parseFloat(u.Ingreso) -parseFloat(u.Ingreso),u.Ingreso,u.Ingreso,idTabR)}
                                    <td>${u.Cod_Turno}</td>
                                    <td>${u.Des_Caja}</td>
                                    <td>${u.Fecha_Inicio}</td>
                                    <td>${u.Movimiento}</td>
                                    <td>${u.Simbolo}</td>
                                    <td> ${u.Ingreso}</td>
                                    <td><input type="number" value="${parseFloat(u.Ingreso) -parseFloat(u.Diferencia)}" onkeyup=${()=>CambioMonto(btoa(u.id_Movimiento).toString().replace(/=/g ,""),u.Ingreso,idTabR)} onchange=${()=>CambioMonto(btoa(u.id_Movimiento).toString().replace(/=/g ,""),u.Ingreso,idTabR)} class="form-control recibido" id="R${btoa(u.id_Movimiento).toString().replace(/=/g ,"")}_${idTabR}"></td>
                                    <td class="diferencia" id="D${btoa(u.id_Movimiento).toString().replace(/=/g ,"")}_${idTabR}">${u.Diferencia}</td> 
                                    <td><input value="${u.Responsable}" type="text" id="${btoa(u.id_Movimiento).toString().replace(/=/g ,"")}_${idTabR}" class="form-control" onchange=${()=>BuscarResponsable(btoa(u.id_Movimiento).replace(/=/g ,""),idTabR)} data-id="-1"></td>
                                    <td>
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-xs" data-toggle="tooltip" data-placement="top" title="" data-original-title="Poner en pendiente"  onclick=${()=>Reactivar(u,btoa(u.id_Movimiento).replace(/=/g ,""),idTabR)}><i class="fa fa-share"></i> </button>
                                            <button class="btn btn-success btn-xs"  data-toggle="tooltip" data-placement="top" title="" data-original-title="Recepcionar" onclick=${()=>RegistrarRecepcion(u,btoa(u.id_Movimiento).replace(/=/g ,""),idTabR)}><i class="fa fa-arrow-circle-down"></i> </button>
                                        </div>
                                    </td>
                                </tr>`)}
                            </tbody>
                        
                        </table>
                    </div>
                    <div class="row">
                        <div class="col-md-2">
                            <button type="button" class="btn btn-success" onclick=${()=>Recepcionados(idTabR)}><i class="fa fa-arrow-circle-down"></i> Recepcionados</button>
                        </div>
                        <div class="col-md-10">
                            <div class="row" id="divTotales_${idTabR}">
                                <div class="col-md-12">
                                    <div class="col-md-3">
                                        <label>Total Recepcion : </label>
                                    </div>
                                    <div class="col-md-3" >
                                        <input type="number" class="form-control" id="totalMonto_${idTabR}" value="${global.variablesR[idTabR].totalMonto}">
                                    </div>
                                    <div class="col-md-3" >
                                        <input type="number" class="form-control" id="totalRecibido_${idTabR}" value="${global.variablesR[idTabR].totalRecibido}">
                                    </div>
                                    <div class="col-md-3">
                                        <input type="number" class="form-control"  id="total_${idTabR}" value="${global.variablesR[idTabR].total}">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer text-center"> 
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                </div>
            </div>
        </div>`

    $('#tab_'+idTabR).html(el)
}


function CerrarTabR(idTab){ 
    $('#tab_'+idTab).remove()
    $('#id_'+idTab).parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show');
    delete global.variablesR[idTab]
}

function ActualizarMontosTotales(_total,_totalMonto,_totalRecibido,idTab){
    global.variablesR[idTab].total = global.variablesR[idTab].total + _total
    global.variablesR[idTab].totalMonto = global.variablesR[idTab].totalMonto + _totalMonto
    global.variablesR[idTab].totalRecibido = global.variablesR[idTab].totalRecibido+ _totalRecibido 
}


function CambioMonto(idInput,montoIngreso,idTab) {
    var montoR = parseFloat($("#R"+idInput+"_"+idTab).val())
    var montoDif =  montoR-parseFloat(montoIngreso)
    $("#D"+idInput+"_"+idTab).text(montoDif)
    global.variablesR[idTab].totalRecibido = 0
    global.variablesR[idTab].total = 0
    $('#tablaRecepciones_'+idTab+' > tbody  > tr').each(function(){
        global.variablesR[idTab].totalRecibido = global.variablesR[idTab].totalRecibido + parseFloat($(this).find("td > input.recibido").val())
        global.variablesR[idTab].total = global.variablesR[idTab].total + parseFloat($(this).find("td.diferencia").text())
    })
    $("#totalMonto_"+idTab).val(global.variablesR[idTab].totalMonto)
    $("#totalRecibido_"+idTab).val(global.variablesR[idTab].totalRecibido)
    $("#total_"+idTab).val(global.variablesR[idTab].total)
}

function BuscarResponsable(idInput,idTab) {
    BuscarCliente(idInput+"_"+idTab,null,null)
}

 

function refrescarTabla(recepcionados,idTab){
    var el = yo`<table class="table table-bordered table-striped">
    <thead>
        <tr>
            <th>Turno</th>
            <th>Caja</th> 
            <th>Hora</th>
            <th>Movimiento</th>
            <th>M</th>
            <th>Monto</th>
        </tr>
    </thead>
    <tbody>
        ${recepcionados.map(u => yo`
        <tr>
            <td>${u.Cod_Turno}</td>
            <td>${u.Des_Caja}</td>
            <td>${u.Fecha_Inicio}</td>
            <td>${u.Movimiento}</td>
            <td>${u.Simbolo}</td>
            <td>${u.Ingreso}</td>
        </tr>`)}
    </tbody>

</table>`
    empty(document.getElementById('divRecepcionados_'+idTab)).appendChild(el);
}

 function EsValido(idInputCliente){ 
    var Id_ClienteProveedor = $("#"+idInputCliente).attr("data-id")
    var Cliente = $("#"+idInputCliente).val()
    var Recibido = $("#R"+idInputCliente).val()
    var Diferencia = $("#D"+idInputCliente).text()
    if(parseFloat(Recibido)!=0){
        if(parseFloat(Diferencia)!=0){
            if(Id_ClienteProveedor=="-1"){
                return false
            }else{
                return true
            }
        }else{
            return true
        }
    }else{
        return true
    } 
 }
 


function RegistrarRecepcion(u,idInputCliente,idTab){
    var Id_ClienteProveedor = $("#"+idInputCliente+"_"+idTab).attr("data-id")
    var Cliente = $("#"+idInputCliente+"_"+idTab).val()
    var Recibido = $("#R"+idInputCliente+"_"+idTab).val()
    var Diferencia = $("#D"+idInputCliente+"_"+idTab).text()
    if(EsValido(idInputCliente+"_"+idTab)){
        run_waitMe($('#main-contenido'), 1, "ios","Registrando recepción...");
        var id_Movimiento = u.id_Movimiento
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                id_Movimiento,
                Diferencia,
                Id_ClienteProveedor,
                Recibido,
                Cliente
            })
        }
        fetch(URL + '/recepciones_api/recepcionar', parametros)
            .then(req => req.json())
            .then(res => {
                if (res.respuesta == 'ok') {
                    toastr.success('Se recepciono correctamente el movimiento de dinero','Confirmacion',{timeOut: 5000})
                    RefrescarRecepcion(idTab)
                    //refrescar_movimientos()
                }else{
                    toastr.error('No se pudo recepcionar correctamente el movimiento de dinero','Error',{timeOut: 5000})
                } 
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
        
    }else{
        toastr.error('No Existe un Responsable asignado para la Diferencia','Error',{timeOut: 5000})
    }
}


function Reactivar(u,idInputCliente,idTab){
    run_waitMe($('#main-contenido'), 1, "ios"); 
    var id_Movimiento = u.id_Movimiento
    var Recibido = $("#R"+idInputCliente+"_"+idTab).val()
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            id_Movimiento,
            Recibido
        })
    }
    fetch(URL + '/recepciones_api/reactivar', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                toastr.success('Se coloco como pendiente a esta Recepción','Confirmacion',{timeOut: 5000})
                RefrescarRecepcion(idTab)
            }else{
                toastr.error('No se pudo colocar como pendiente a esta recepcion','Error',{timeOut: 5000})
            }
            console.log(res.data)
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
}

function Recepcionados(idTab){
    if(!global.variablesR[idTab].flag_button){
        run_waitMe($('#main-contenido'), 1, "ios","Realizando operación...");
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            })
        }
        fetch(URL + '/recepciones_api/get_recepcionados', parametros)
            .then(req => req.json())
            .then(res => {
                console.log(res)
                var recepcionados = res.data.movimientos_recepcionados
                if (res.respuesta == 'ok') {
                    
                    refrescarTabla(recepcionados,idTab)
                }
                else { 
                    refrescarTabla([],idTab)
                }
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
        
            global.variablesR[idTab].flag_button = true
    }else{
        NuevaRecepcion()  
    }
}



function RefrescarRecepcion(idTab) {
    LimpiarEventoModales()
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
    fetch(URL + '/recepciones_api/get_variables_recepcion_transferencia', parametros)
        .then(req => req.json())
        .then(res => {
            var variables = res.data
            console.log(variables)
            if (res.respuesta == 'ok') {
                
                RefrescarVer(variables,idTab)
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

function NuevaRecepcion() {
    LimpiarEventoModales() 
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
    fetch(URL + '/recepciones_api/get_variables_recepcion_transferencia', parametros)
        .then(req => req.json())
        .then(res => {
            var variables = res.data
            console.log(variables)
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



export { NuevaRecepcion }