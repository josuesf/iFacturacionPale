var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../../constantes_entorno/constantes'

function Ver(_escritura, padrones, Id_ClienteProveedor) {
    var el = yo`
        <div class="table-responsive">
            <div class="modal modal-danger fade" id="modal-danger-padrones" style="display: none;">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                            <h4 class="modal-title">¿Esta seguro que desea eliminar este padron?</h4>
                        </div>
                        <div class="modal-body">
                            <p>Al eliminar este padron no podra recuperarlo. Desea continuar de todas maneras?</p>
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
                            <h4 class="modal-title">Agregar o Editar Padron</h4>
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
                <a class="btn btn-info pull-right" data-toggle="modal" onclick="${() => AbrirPadron(_escritura, Id_ClienteProveedor)}" data-target="#modal-nuevo">
                <i class="fa fa-plus"></i> Agregar Padron</a>
            </div>
            <div class="col-md-12">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Codigo</th>
                            <th>Padron</th>
                            <th>Tipo</th>
                            <th>Inicio</th>
                            <th>Finalizo</th>
                            <th>Nro Resolucion</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${padrones.map(u => yo`
                        <tr>
                            <td>${u.Cod_Padron ? 'SI' : 'NO'}</td>
                            <td>${u.Des_Padron}</td>
                            <td>${u.Cod_TipoPadron}</td>
                            <td>${u.Fecha_Inicio}</td>
                            <td>${u.Fecha_Fin}</td>
                            <td>${u.Nro_Resolucion}</td>
                            <td>
                                ${_escritura ? yo`<button class="btn btn-xs btn-success" onclick="${() => AbrirPadron(_escritura, Id_ClienteProveedor, u)}"><i class="fa fa-edit"></i></button>` : yo``}
                                ${_escritura ? yo`<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger-padrones" onclick="${() => Eliminar(_escritura, u)}"><i class="fa fa-trash"></i></button>` : yo``}
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
function CargarFormulario(_escritura, tipos_padrones, Id_ClienteProveedor, e) {
    const el = yo`
    <div class="panel-body" id="form_modal">
        <div class="row">
            <div class="alert alert-callout alert-danger hidden" id="divErrors_P">
                <p>Es necesario llenar todos los campos requeridos marcados con rojo</p>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-6">
                <div class="form-group">
                    <label>Codigo *</label>
                    <input style="text-transform:uppercase;" placeholder="" class="form-control required" id="P_Cod_Padron" value="${e ? e.Cod_Padron : ''}">
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-group">
                    <label>Tipo *</label>
                    <select class="form-control required" id="P_Cod_TipoPadron"> 
                        ${tipos_padrones.map(u => yo`<option 
                            value=${u.Cod_TipoPadron} 
                            ${(e) ? (e.Cod_TipoPadron == u.Cod_TipoPadron ? 'selected' : '') : ''}>
                            ${u.Nom_TipoPadron}</option>`)}                                        
                    </select>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-6">
                <div class="form-group">
                    <label>Descripcion *</label>
                    <input style="text-transform:uppercase;" class="form-control required" id="P_Des_Padron" value="${e ? e.Des_Padron : ''}">
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-group">
                    <label>Numero de Resolucion *</label>
                    <input style="text-transform:uppercase;" class="form-control required" id="P_Nro_Resolucion" value="${e ? e.Nro_Resolucion : ''}">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-6">
                <div class="form-group">
                    <label>Inicia</label>
                    <input type="date" class="form-control" id="P_Fecha_Inicio" value="${e ? e.Fecha_Inicio.split('T')[0] : ''}">
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-group">
                    <label for="">Termina</label>
                    <input type="date" class="form-control" id="P_Fecha_Fin" value="${e ? e.Fecha_Fin.split('T')[0] : ''}">
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn pull-left" data-dismiss="modal">Cancelar</button>
            <button type="button" onclick=${() => GuardarPadron(_escritura, Id_ClienteProveedor, e)} class="btn btn-primary">Guardar</button>
        </div>
    </div>
    `
    var form = document.getElementById('form_modal');
    empty(form).appendChild(el);
}
function AbrirPadron(_escritura, Id_ClienteProveedor, padron) {
    run_waitMe($('#main-contenido'), 1, "ios");
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
    }
    fetch(URL + 'clientes_api/get_tipos_padrones', parametros)
        .then(r => r.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                CargarFormulario(_escritura, res.data.tipos_padrones, Id_ClienteProveedor, padron)
            } else {
                CargarFormulario(_escritura, [], Id_ClienteProveedor, padron)
            }
            $('#main-contenido').waitMe('hide');
            $('#modal-abrir').modal()
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });

}
function GuardarPadron(_escritura, Id_ClienteProveedor, padron) {
    if (ValidacionCampos('divErrors_P')) {
        $('#modal-abrir').modal("hide")
        run_waitMe($('#main-contenido'), 1, "ios","Guardando padron...");
        const Cod_Padron = padron ? padron.Cod_Padron : document.getElementById('P_Cod_Padron').value.toUpperCase()
        const Cod_TipoPadron = document.getElementById('P_Cod_TipoPadron').value.toUpperCase()
        const Des_Padron = document.getElementById('P_Des_Padron').value.toUpperCase()
        const Fecha_Inicio = document.getElementById('P_Fecha_Inicio').value
        const Fecha_Fin = document.getElementById('P_Fecha_Fin').value
        const Nro_Resolucion = document.getElementById('P_Nro_Resolucion').value.toUpperCase()

        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                Id_ClienteProveedor, Cod_Padron, Cod_TipoPadron, Des_Padron,
                Fecha_Fin, Fecha_Inicio, Nro_Resolucion
            })
        }
        fetch(URL + 'clientes_api/guardar_padron_cliente', parametros)
            .then(r => r.json())
            .then(res => {
                Padrones(_escritura, Id_ClienteProveedor)
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
    }

}
function Eliminar(_escritura, padron) {
    var btnEliminar = document.getElementById('btnEliminar')
    btnEliminar.addEventListener('click', function Eliminar(ev) {
        run_waitMe($('#main-contenido'), 1, "ios","Eliminando...");
        const Id_ClienteProveedor = padron.Id_ClienteProveedor
        const Cod_Padron = padron.Cod_Padron

        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Id_ClienteProveedor, Cod_Padron
            })
        }
        fetch(URL + 'clientes_api/eliminar_padron_cliente', parametros)
            .then(r => r.json())
            .then(res => {
                Padrones(_escritura, padron.Id_ClienteProveedor)
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
    })

}

function Padrones(_escritura, Id_ClienteProveedor) {
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
    fetch(URL + 'clientes_api/get_padrones_cliente', parametros)
        .then(r => r.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                Ver(_escritura, res.data.padrones, Id_ClienteProveedor)
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
export { Padrones }