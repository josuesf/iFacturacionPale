var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../../constantes_entorno/constantes'

function Ver(_escritura, vehiculos, Id_ClienteProveedor) {
    var el = yo`
        <div class="table-responsive">
            <div class="modal modal-danger fade" id="modal-danger-vehiculos" style="display: none;">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                            <h4 class="modal-title">¿Esta seguro que desea eliminar este vehiculo?</h4>
                        </div>
                        <div class="modal-body">
                            <p>Al eliminar este vehiculo no podra recuperarlo. Desea continuar de todas maneras?</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-success" id="btnEliminar" data-dismiss="modal">Si,Eliminar</button>
                        </div>
                    </div>
                    <!-- /.modal-content -->
                </div>
                <!-- /.modal-dialog -->
            </div>
            <div class="modal modal-default fade" id="modal-abrir" style="display: none;">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                            <h4 class="modal-title">Agregar o Editar Vehiculo</h4>
                        </div>
                        <div class="modal-body">
                            <div class="panel">
                                <div class="panel-heading">
                                </div>
                                <div class="panel-body" id="form_modal">
                                    
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div class="panel-heading">
                <a class="btn btn-info pull-right" data-toggle="modal"  onclick="${() => AbrirVehiculo(_escritura, Id_ClienteProveedor)}" data-target="#modal-nuevo">
                <i class="fa fa-plus"></i> Agregar Vehiculo</a>
            </div>
            <div class="col-md-12">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Placa</th>
                            <th>Color</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Placa Vigente</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${vehiculos.map(u => yo`
                        <tr>
                            <td>${u.Cod_Placa}</td>
                            <td>${u.Color}</td>
                            <td>${u.Marca}</td>
                            <td>${u.Modelo}</td>
                            <td>${u.Placa_Vigente}</td>
                            <td>
                                ${_escritura ? yo`<button class="btn btn-xs btn-success" onclick="${() => AbrirVehiculo(_escritura, Id_ClienteProveedor, u)}"><i class="fa fa-edit"></i></button>` : yo``}
                                ${_escritura ? yo`<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger-vehiculos" onclick="${() => Eliminar(_escritura, u)}"><i class="fa fa-trash"></i></button>` : yo``}
                            </td>
                        </tr>`)}
                    </tbody>
                </table>
            </div>
        </div>
    `
    var main = document.getElementById('tab_current');
    empty(main).appendChild(el);
}
function CargarFormulario(_escritura, Id_ClienteProveedor, e) {
    const el = yo`
    <div class="panel-body" id="form_modal">
        <div class="row">
            <div class="alert alert-callout alert-danger hidden" id="divErrors_V">
                <p>Es necesario llenar todos los campos requeridos marcados con rojo</p>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-6">
                <div class="form-group">
                    <label>Placa *</label>
                    <input style="text-transform:uppercase;" placeholder="Ejem: X1S303 sin (-) guion" class="form-control required" id="V_Cod_Placa" value="${e ? e.Cod_Placa : ''}">
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-group">
                    <label>Color *</label>
                    <input style="text-transform:uppercase;" class="form-control required" id="V_Color" value="${e ? e.Color : ''}">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-6">
                <div class="form-group">
                    <label>Marca</label>
                    <input style="text-transform:uppercase;" class="form-control" id="V_Marca" value="${e ? e.Marca : ''}">
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-group">
                    <label>Modelo</label>
                    <input style="text-transform:uppercase;" class="form-control" id="V_Modelo" value="${e ? e.Modelo : ''}">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-6">
                <div class="form-group">
                    <label>Sede</label>
                    <input style="text-transform:uppercase;" class="form-control" id="V_Sede" value="${e ? e.Sede : ''}">
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-group">
                    <label for="">Placa Vigente</label>
                    <input style="text-transform:uppercase;" class="form-control" id="V_Placa_Vigente" value="${e ? e.Placa_Vigente : ''}">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-6">
                <div class="form-group">
                    <label for="">Propietarios</label>
                    <textarea id="V_Propiestarios" class="form-control">${e ? e.Propiestarios : ''}</textarea>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn pull-left" data-dismiss="modal">Cancelar</button>
            <button type="button" onclick=${() => GuardarVehiculo(_escritura, Id_ClienteProveedor, e)} class="btn btn-primary" >Guardar</button>
        </div>
    </div>
    `
    var form = document.getElementById('form_modal');
    empty(form).appendChild(el);
}
function AbrirVehiculo(_escritura, Id_ClienteProveedor, vehiculo) {

    CargarFormulario(_escritura, Id_ClienteProveedor, vehiculo)
    $('#modal-abrir').modal()
}
function GuardarVehiculo(_escritura, Id_ClienteProveedor, vehiculo) {
    if (ValidacionCampos('divErrors_V')) {
        $('#modal-abrir').modal("hide")
        run_waitMe($('#main-contenido'), 1, "ios","Guardando...");
        const Cod_Placa = vehiculo ? vehiculo.Cod_Placa : document.getElementById('V_Cod_Placa').value.toUpperCase()
        const Color = document.getElementById('V_Color').value.toUpperCase()
        const Marca = document.getElementById('V_Marca').value.toUpperCase()
        const Modelo = document.getElementById('V_Modelo').value.toUpperCase()
        const Propiestarios = document.getElementById('V_Propiestarios').value
        const Sede = document.getElementById('V_Sede').value.toUpperCase()
        const Placa_Vigente = document.getElementById('V_Placa_Vigente').value.toUpperCase()

        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                Id_ClienteProveedor, Cod_Placa, Color, Marca,
                Modelo, Propiestarios, Sede, Placa_Vigente
            })
        }
        fetch(URL + 'clientes_api/guardar_vehiculo_cliente', parametros)
            .then(r => r.json())
            .then(res => {
                Vehiculos(_escritura, Id_ClienteProveedor)
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
    }
}
function Eliminar(_escritura, vehiculo) {
    var btnEliminar = document.getElementById('btnEliminar')
    btnEliminar.addEventListener('click', function Eliminar(ev) {
        run_waitMe($('#main-contenido'), 1, "ios","Eliminando...");
        const Id_ClienteProveedor = vehiculo.Id_ClienteProveedor
        const Cod_Placa = vehiculo.Cod_Establecimientos

        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Id_ClienteProveedor, Cod_Placa
            })
        }
        fetch(URL + 'clientes_api/eliminar_vehiculo_cliente', parametros)
            .then(r => r.json())
            .then(res => {
                Vehiculos(_escritura, vehiculo.Id_ClienteProveedor)
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
    })

}

function Vehiculos(_escritura, Id_ClienteProveedor) {
    run_waitMe($('#main-contenido'), 1, "ios");
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Id_ClienteProveedor
        })
    }
    fetch(URL + 'clientes_api/get_vehiculos_cliente', parametros)
        .then(r => r.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                Ver(_escritura, res.data.vehiculos, Id_ClienteProveedor)
            } else {
                Ver(_escritura, [], Id_ClienteProveedor)
            }
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
}

export { Vehiculos }