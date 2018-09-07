var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../../constantes_entorno/constantes'

function Ver(_escritura, contactos, Id_ClienteProveedor, documentos) {
    var el = yo`
        <div class="table-responsive">
            <div class="modal modal-danger fade" id="modal-danger-contactos" style="display: none;">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                            <h4 class="modal-title">¿Esta seguro que desea eliminar este contacto?</h4>
                        </div>
                        <div class="modal-body">
                            <p>Al eliminar este contacto no podra recuperarlo. Desea continuar de todas maneras?</p>
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
                            <h4 class="modal-title">Agregar o Editar Contacto</h4>
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
                <a class="btn btn-info pull-right" onclick="${() => AbrirContacto(_escritura, Id_ClienteProveedor, documentos)}" data-toggle="modal" data-target="#modal-nuevo">
                <i class="fa fa-plus"></i> Agregar Contacto</a>
            </div>
            <div class="col-md-12">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Documento</th>
                            <th>Numero</th>
                            <th>Paterno</th>
                            <th>Materno</th>
                            <th>Nombres</th>
                            <th>Telefono</th>
                            <th>Email</th>
                            <th>Celular</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${contactos.map(u => yo`
                        <tr>
                            <td>${u.Nom_TipoDoc}</td>
                            <td>${u.Nro_Documento}</td>
                            <td>${u.Ap_Paterno}</td>
                            <td>${u.Ap_Materno}</td>
                            <td>${u.Nombres}</td>
                            <td>${u.Telefono}</td>
                            <td>${u.Email_Personal}</td>
                            <td>${u.Celular}</td>
                            <td>
                                ${_escritura ? yo`<button class="btn btn-xs btn-success" onclick="${() => AbrirContacto(_escritura, Id_ClienteProveedor, documentos, u.Id_ClienteContacto)}"><i class="fa fa-edit"></i></button>` : yo``}
                                ${_escritura ? yo`<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger-contactos" onclick="${() => Eliminar(_escritura, u, documentos)}"><i class="fa fa-trash"></i></button>` : yo``}
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

function CargarFormulario(_escritura, tipos_relaciones, cod_telefonos, documentos, Id_ClienteProveedor, e) {
    const el = yo`
    <div class="panel-body" id="form_modal">
        <div class="row">
            <div class="alert alert-callout alert-danger hidden" id="divErrors_C">
                <p>Es necesario llenar todos los campos requeridos marcados con rojo</p>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-4">
                <div class="form-group">
                    <label>Tipo de Relacion *</label>
                    <select class="form-control required" id="C_Cod_TipoRelacion"> 
                        ${tipos_relaciones.map(u => yo`<option 
                            value=${u.Cod_TipoRelacion} 
                            ${(e) ? (u.Cod_TipoRelacion == e.Cod_TipoRelacion ? 'selected' : '') : ''}>
                            ${u.Nom_TipoRelacion}</option>`)}                                        
                    </select>
                </div>
            </div>
            <div class="col-sm-4">
                <div class="form-group">
                    <label>Tipo de Documento *</label>
                    <select class="form-control required" id="C_Cod_TipoDocumento"> 
                        ${documentos.map(u => yo`<option 
                            value=${u.Cod_TipoDoc} 
                            ${(e) ? (u.Cod_TipoDoc == e.Cod_TipoDocumento ? 'selected' : '') : ''}>
                            ${u.Nom_TipoDoc}</option>`)}                                        
                    </select>
                </div>
            </div>
            <div class="col-sm-4">
                <div class="form-group">
                    <label>Numero de Documento *</label>
                    <input class="form-control required" id="C_Nro_Documento" value="${e ? e.Nro_Documento : ''}">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-4">
                <div class="form-group">
                    <label>Apellido Paterno *</label>
                    <input class="form-control required" style="text-transform:uppercase" id="C_Ap_Paterno" value="${e ? e.Ap_Paterno : ''}">
                </div>
            </div>
            <div class="col-sm-4">
                <div class="form-group">
                    <label>Apellido Materno *</label>
                    <input class="form-control required" style="text-transform:uppercase" id="C_Ap_Materno" value="${e ? e.Ap_Materno : ''}">
                </div>
            </div>
            <div class="col-sm-4">
                <div class="form-group">
                    <label>Nombres *</label>
                    <input class="form-control required" style="text-transform:uppercase" id="C_Nombres" value="${e ? e.Nombres : ''}">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-4">
                <div class="form-group">
                    <label>Codigo de Ciudad</label>
                    <select class="form-control" id="C_Cod_Telefono">
                        ${cod_telefonos.map(u => yo`<option 
                            value=${u.Cod_Telefono} 
                            ${(e) ? (e.Cod_Telefono == u.Cod_Telefono ? 'selected' : '') : ''}>
                            ${u.Ciudad}</option>`)}
                    </select>
                </div>
            </div>
            <div class="col-sm-4">
                <div class="form-group">
                    <label>Telefono Fijo</label>
                    <input class="form-control" id="C_Nro_Telefono" value="${e ? e.Nro_Telefono : ''}">
                </div>
            </div>
            <div class="col-sm-2">
                <div class="form-group">
                    <label>Anexo</label>
                    <input class="form-control" id="C_Anexo" value="${e ? e.Anexo : ''}">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-4">
                <div class="form-group">
                    <label for="">Celular</label>
                    <input id="C_Celular" class="form-control" value=${e ? e.Celular : ''} >
                </div>
            </div>
            <div class="col-sm-4">
                <div class="form-group">
                    <label for="">Email Personal</label>
                    <input id="C_Email_Personal" class="form-control" value=${e ? e.Email_Personal : ''} >
                </div>
            </div>
            <div class="col-sm-4">
                <div class="form-group">
                    <label for="">Email Empresarial</label>
                    <input id="C_Email_Empresarial" class="form-control" value=${e ? e.Email_Empresarial : ''} >
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-4">
                <div class="form-group">
                    <label for="">Fecha de Incorporacion</label>
                    <input type="date" class="form-control" id="C_Fecha_Incorporacion" value="${e ? e.Fecha_Incorporacion.split('T')[0] : ''}" >
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn pull-left" data-dismiss="modal">Cancelar</button>
            <button type="button" onclick=${() => GuardarContacto(_escritura, Id_ClienteProveedor, documentos, e)} class="btn btn-primary" >Guardar</button>
        </div>
    </div>
    `
    var form = document.getElementById('form_modal');
    empty(form).appendChild(el);
}
function AbrirContacto(_escritura, Id_ClienteProveedor, documentos, Id_ClienteContacto) {

    run_waitMe($('#main-contenido'), 1, "ios");
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id_ClienteProveedor, Id_ClienteContacto })
    }
    fetch(URL + 'clientes_api/get_tiposRelaciones_codTelefonos', parametros)
        .then(r => r.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                CargarFormulario(_escritura, res.data.tipos_relaciones,
                    res.data.cod_telefonos, documentos, Id_ClienteProveedor,
                    res.data.contacto[0])
            } else {
                CargarFormulario(_escritura, [], [], documentos, Id_ClienteProveedor)
            }
            $('#main-contenido').waitMe('hide');
            $('#modal-abrir').modal()
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });

}
function GuardarContacto(_escritura, Id_ClienteProveedor, documentos, contacto) {
    if (ValidacionCampos('divErrors_C')) {
        $('#modal-abrir').modal("hide")
        run_waitMe($('#main-contenido'), 1, "ios","Guardando contacto...");
        const Id_ClienteContacto = contacto ? contacto.Id_ClienteContacto : '-1'
        const Cod_TipoRelacion = document.getElementById('C_Cod_TipoRelacion').value
        const Cod_TipoDocumento = document.getElementById('C_Cod_TipoDocumento').value
        const Nro_Documento = document.getElementById('C_Nro_Documento').value
        const Ap_Paterno = document.getElementById('C_Ap_Paterno').value.toUpperCase()
        const Ap_Materno = document.getElementById('C_Ap_Materno').value.toUpperCase()
        const Nombres = document.getElementById('C_Nombres').value.toUpperCase()
        const Cod_Telefono = document.getElementById('C_Cod_Telefono').value
        const Nro_Telefono = document.getElementById('C_Nro_Telefono').value
        const Anexo = document.getElementById('C_Anexo').value
        const Email_Empresarial = document.getElementById('C_Email_Empresarial').value
        const Email_Personal = document.getElementById('C_Email_Personal').value
        const Celular = document.getElementById('C_Celular').value
        const Fecha_Incorporacion = document.getElementById('C_Fecha_Incorporacion').value

        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                Id_ClienteProveedor, Id_ClienteContacto, Cod_TipoRelacion,
                Cod_TipoDocumento, Nro_Documento, Ap_Paterno, Ap_Materno, Nombres,
                Cod_Telefono, Nro_Telefono, Anexo, Email_Empresarial, Email_Personal,
                Celular, Fecha_Incorporacion
            })
        }
        fetch(URL + 'clientes_api/guardar_contacto_cliente', parametros)
            .then(r => r.json())
            .then(res => {
                Contactos(_escritura, Id_ClienteProveedor, documentos)
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
    }

}
function Eliminar(_escritura, contacto, documentos) {
    var btnEliminar = document.getElementById('btnEliminar')
    btnEliminar.addEventListener('click', function Eliminar(ev) {
        run_waitMe($('#main-contenido'), 1, "ios","Eliminando contacto...");
        const Id_ClienteProveedor = contacto.Id_ClienteProveedor
        const Id_ClienteContacto = contacto.Id_ClienteContacto

        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Id_ClienteProveedor, Id_ClienteContacto
            })
        }
        fetch(URL + 'clientes_api/eliminar_contacto_cliente', parametros)
            .then(r => r.json())
            .then(res => {
                Contactos(_escritura, contacto.Id_ClienteProveedor, documentos)
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
    })

}
function Contactos(_escritura, Id_ClienteProveedor, documentos) {
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
    fetch(URL + 'clientes_api/get_contactos_cliente', parametros)
        .then(r => r.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                Ver(_escritura, res.data.contactos, Id_ClienteProveedor, documentos)
            } else {
                Ver(_escritura, [], Id_ClienteProveedor, documentos)
            }
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
}

export { Contactos }