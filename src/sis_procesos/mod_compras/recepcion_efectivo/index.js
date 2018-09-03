var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../../constantes_entorno/constantes'
import { refrescar_movimientos } from '../../movimientos_caja'
import { BuscarCliente } from '../../modales'

var flag_button = false
var total = 0 
var totalMonto = 0
var totalRecibido = 0 

function Ver(variables) {
    var el = yo`
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h4 class="modal-title"><strong>Recepcion de Transferencia</strong></h4>
                </div>
                <div class="modal-body">
                    <div class="row" id="divRecepcionados" style="overflow-x: auto;">
                        <table class="table table-bordered table-striped" id="tablaRecepciones">
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
                                    ${ActualizarMontosTotales(parseFloat(u.Ingreso) -parseFloat(u.Ingreso),u.Ingreso,u.Ingreso)}
                                    <td>${u.Cod_Turno}</td>
                                    <td>${u.Des_Caja}</td>
                                    <td>${u.Fecha_Inicio}</td>
                                    <td>${u.Movimiento}</td>
                                    <td>${u.Simbolo}</td>
                                    <td> ${u.Ingreso}</td>
                                    <td><input type="number" value="${parseFloat(u.Ingreso) -parseFloat(u.Diferencia)}" onkeyup=${()=>CambioMonto(btoa(u.id_Movimiento).toString().replace(/=/g ,""),u.Ingreso)} onchange=${()=>CambioMonto(btoa(u.id_Movimiento).toString().replace(/=/g ,""),u.Ingreso)} class="form-control recibido" id="R${btoa(u.id_Movimiento).toString().replace(/=/g ,"")}"></td>
                                    <td class="diferencia" id="D${btoa(u.id_Movimiento).toString().replace(/=/g ,"")}">${u.Diferencia}</td> 
                                    <td><input value="${u.Responsable}" type="text" id="${btoa(u.id_Movimiento).toString().replace(/=/g ,"")}" class="form-control" onchange=${()=>BuscarResponsable(btoa(u.id_Movimiento).replace(/=/g ,""))} data-id="-1"></td>
                                    <td>
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-xs" onclick=${()=>Reactivar(u,btoa(u.id_Movimiento).replace(/=/g ,""))}><i class="fa fa-share"></i> </button>
                                            <button class="btn btn-success btn-xs" onclick=${()=>RegistrarRecepcion(u,btoa(u.id_Movimiento).replace(/=/g ,""))}><i class="fa fa-arrow-circle-down"></i> </button>
                                        </div>
                                    </td>
                                </tr>`)}
                            </tbody>
                        
                        </table>
                    </div>
                    <div class="row">
                        <div class="col-md-2">
                            <button type="button" class="btn btn-success" onclick=${()=>Recepcionados()}><i class="fa fa-arrow-circle-down"></i> Recepcionados</button>
                        </div>
                        <div class="col-md-10">
                            <div class="row" id="divTotales">
                                <div class="col-md-12">
                                    <div class="col-md-3">
                                        <label>Total Recepcion : </label>
                                    </div>
                                    <div class="col-md-3" >
                                        <input type="number" class="form-control" id="totalMonto" value="${totalMonto}">
                                    </div>
                                    <div class="col-md-3" >
                                        <input type="number" class="form-control" id="totalRecibido" value="${totalRecibido}">
                                    </div>
                                    <div class="col-md-3">
                                        <input type="number" class="form-control"  id="total" value="${total}">
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

    var modal_proceso = document.getElementById('modal-proceso');
    empty(modal_proceso).appendChild(el);
    $('#modal-proceso').modal()
}

function ActualizarMontosTotales(_total,_totalMonto,_totalRecibido){
    total = total + _total
    totalMonto = totalMonto + _totalMonto
    totalRecibido = totalRecibido+ _totalRecibido 
}


function CambioMonto(idInput,montoIngreso) {
    var montoR = parseFloat($("#R"+idInput).val())
    var montoDif =  montoR-parseFloat(montoIngreso)
    $("#D"+idInput).text(montoDif)
    totalRecibido = 0
    total = 0
    $('#tablaRecepciones > tbody  > tr').each(function(){
        totalRecibido = totalRecibido + parseFloat($(this).find("td > input.recibido").val())
        total = total + parseFloat($(this).find("td.diferencia").text())
    })
    $("#totalMonto").val(totalMonto)
    $("#totalRecibido").val(totalRecibido)
    $("#total").val(total)
}

function BuscarResponsable(idInput) {
    BuscarCliente(idInput,null,null)
}

 

function refrescarTabla(recepcionados){
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
    empty(document.getElementById('divRecepcionados')).appendChild(el);
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
 


function RegistrarRecepcion(u,idInputCliente){
    var Id_ClienteProveedor = $("#"+idInputCliente).attr("data-id")
    var Cliente = $("#"+idInputCliente).val()
    var Recibido = $("#R"+idInputCliente).val()
    var Diferencia = $("#D"+idInputCliente).text()
    if(EsValido(idInputCliente)){
        run_waitMe($('#modal-proceso'), 1, "ios","Registrando recepción...");
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
                    refrescar_movimientos()
                }else{
                    toastr.error('No se pudo recepcionar correctamente el movimiento de dinero','Error',{timeOut: 5000})
                }
                $('#modal-proceso').modal('hide')
                $('#modal-proceso').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#modal-proceso').waitMe('hide');
            });
        
    }else{
        toastr.error('No Existe un Responsable asignado para la Diferencia','Error',{timeOut: 5000})
    }
}


function Reactivar(u,idInputCliente){
    run_waitMe($('#modal-proceso'), 1, "ios"); 
    var id_Movimiento = u.id_Movimiento
    var Recibido = $("#R"+idInputCliente).val()
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
                NuevaRecepcion()
            }else{
                toastr.error('No se pudo colocar como pendiente a esta recepcion','Error',{timeOut: 5000})
            }
            console.log(res.data)
            $('#modal-proceso').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#modal-proceso').waitMe('hide');
        });
}

function Recepcionados(){
    if(!flag_button){
        run_waitMe($('#modal-proceso'), 1, "ios","Realizando operación...");
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
                    
                    refrescarTabla(recepcionados)
                }
                else { 
                    refrescarTabla([])
                }
                $('#modal-proceso').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#modal-proceso').waitMe('hide');
            });
        
        flag_button = true
    }else{
        NuevaRecepcion()  
    }
}

function NuevaRecepcion() {
    totalMonto = 0
    totalRecibido = 0
    total = 0
    flag_button = false
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
            }
            else { 
                
            }
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
}



export { NuevaRecepcion }