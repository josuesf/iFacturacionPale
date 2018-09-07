var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../../constantes_entorno/constantes'

function Ver(_escritura, establecimientos, Id_ClienteProveedor) {
    var el = yo`
        <div class="table-responsive">
            <div class="modal modal-danger fade" id="modal-danger-establecimientos" style="display: none;">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                            <h4 class="modal-title">¿Esta seguro que desea eliminar este establecimiento?</h4>
                        </div>
                        <div class="modal-body">
                            <p>Al eliminar este establecimiento no podra recuperarlo. Desea continuar de todas maneras?</p>
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
                            <h4 class="modal-title">Agregar o Editar Establecimiento</h4>
                        </div>
                        <div class="modal-body">
                            <div class="panel"> 
                                <div class="panel-body" id="form_modal">
                                    
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div class="panel-heading">
                <a class="btn btn-info pull-right" data-toggle="modal" onclick="${() => AbrirEstablecimiento(_escritura, Id_ClienteProveedor)}" data-target="#modal-nuevo">
                <i class="fa fa-plus"></i> Agregar Establecimiento</a>
            </div>
            <div class="col-md-12">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Codigo</th>
                            <th>Establecimiento</th>
                            <th>Tipo</th>
                            <th>Direccion</th>
                            <th>Telefono</th>
                            <th>Obs</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${establecimientos.map(u => yo`
                        <tr>
                            <td>${u.Cod_Establecimientos}</td>
                            <td>${u.Des_Establecimiento}</td>
                            <td>${u.Nom_TipoEstablecimiento}</td>
                            <td>${u.Direccion}</td>
                            <td>${u.Telefono}</td>
                            <td>${u.Obs_Establecimiento}</td>
                            <td>
                                ${_escritura ? yo`<button class="btn btn-xs btn-success" onclick="${() => AbrirEstablecimiento(_escritura, Id_ClienteProveedor, u)}"><i class="fa fa-edit"></i></button>` : yo``}
                                ${_escritura ? yo`<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger-establecimientos" onclick="${() => Eliminar(_escritura, u)}"><i class="fa fa-trash"></i></button>` : yo``}
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
function CargarFormulario(_escritura, tipos_establecimientos, Id_ClienteProveedor, e) {
    const el = yo`
    <div class="panel-body" id="form_modal">
        <div class="row">
            <div class="alert alert-callout alert-danger hidden" id="divErrors_E">
                <p>Es necesario llenar todos los campos requeridos marcados con rojo</p>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-6">
                <div class="form-group">
                    <label>Tipo Establecimiento *</label>
                    <select class="form-control required" id="E_Cod_TipoEstablecimiento"> 
                        ${tipos_establecimientos.map(u => yo`<option 
                            value=${u.Cod_TipoEstablecimiento} 
                            ${(e) ? (e.Cod_TipoEstablecimiento == u.Cod_TipoEstablecimiento ? 'selected' : '') : ''}>
                            ${u.Nom_TipoEstablecimiento}</option>`)}                                        
                    </select>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-group">
                    <label>Codigo Establecimiento *</label>
                    <input style="text-transform:uppercase;" class="form-control required" id="E_Cod_Establecimientos" value="${e ? e.Cod_Establecimientos : ''}">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-6">
                <div class="form-group">
                    <label>Descripcion Establecimiento *</label>
                    <input style="text-transform:uppercase;" class="form-control required" id="E_Des_Establecimiento" value="${e ? e.Des_Establecimiento : ''}">
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-group">
                    <label>Direccion</label>
                    <input style="text-transform:uppercase;" class="form-control" id="E_Direccion" value="${e ? e.Direccion : ''}">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-6">
                <div class="form-group">
                    <label>Telefono</label>
                    <input class="form-control" id="E_Telefono" value="${e ? e.Telefono : ''}">
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-group">
                    <label for="">Observaciones</label>
                    <textarea id="E_Obs_Establecimiento" class="form-control">${e ? e.Obs_Establecimiento : ''}</textarea>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn pull-left" data-dismiss="modal">Cancelar</button>
            <button type="button" onclick=${() => GuardarEstablecimiento(_escritura, Id_ClienteProveedor, e)} class="btn btn-primary" >Guardar</button>
        </div>
    </div>
    `
    var form = document.getElementById('form_modal');
    empty(form).appendChild(el);
}
function AbrirEstablecimiento(_escritura, Id_ClienteProveedor, establecimiento) {

    run_waitMe($('#main-contenido'), 1, "ios");
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
    }
    fetch(URL + 'clientes_api/get_tipos_establecimientos', parametros)
        .then(r => r.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                CargarFormulario(_escritura, res.data.tipos_establecimientos, Id_ClienteProveedor, establecimiento)
            } else {
                CargarFormulario(_escritura, [], Id_ClienteProveedor, establecimiento)
            }
            $('#main-contenido').waitMe('hide');
            $('#modal-abrir').modal()
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });

}
function GuardarEstablecimiento(_escritura, Id_ClienteProveedor, establecimiento) {
    if (ValidacionCampos('divErrors_E')) {
        $('#modal-abrir').modal("hide")
        run_waitMe($('#main-contenido'), 1, "ios","Guardando establecimiento...");
        const Cod_Establecimientos = establecimiento ? establecimiento.Cod_Establecimientos : document.getElementById('E_Cod_Establecimientos').value.toUpperCase()
        const Des_Establecimiento = document.getElementById('E_Des_Establecimiento').value.toUpperCase()
        const Cod_TipoEstablecimiento = document.getElementById('E_Cod_TipoEstablecimiento').value
        const Direccion = document.getElementById('E_Direccion').value.toUpperCase()
        const Telefono = document.getElementById('E_Telefono').value
        const Obs_Establecimiento = document.getElementById('E_Obs_Establecimiento').value
        const Cod_Ubigeo = null

        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                Id_ClienteProveedor, Cod_Establecimientos, Des_Establecimiento, Cod_TipoEstablecimiento,
                Direccion, Telefono, Obs_Establecimiento, Cod_Ubigeo
            })
        }
        fetch(URL + 'clientes_api/guardar_establecimiento_cliente', parametros)
            .then(r => r.json())
            .then(res => {
                Establecimientos(_escritura, Id_ClienteProveedor)
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
    }
}
function Eliminar(_escritura, establecimiento) {
    var btnEliminar = document.getElementById('btnEliminar')
    btnEliminar.addEventListener('click', function Eliminar(ev) {
        run_waitMe($('#main-contenido'), 1, "ios","Guardando establecimiento...");
        const Id_ClienteProveedor = establecimiento.Id_ClienteProveedor
        const Cod_Establecimientos = establecimiento.Cod_Establecimientos

        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Id_ClienteProveedor, Cod_Establecimientos
            })
        }
        fetch(URL + 'clientes_api/eliminar_establecimiento_cliente', parametros)
            .then(r => r.json())
            .then(res => {
                Establecimientos(_escritura, establecimiento.Id_ClienteProveedor)
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
    })

}
function Establecimientos(_escritura, Id_ClienteProveedor) {
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
    fetch(URL + 'clientes_api/get_establecimientos_cliente', parametros)
        .then(r => r.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                Ver(_escritura, res.data.establecimientos, Id_ClienteProveedor)
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

export { Establecimientos }