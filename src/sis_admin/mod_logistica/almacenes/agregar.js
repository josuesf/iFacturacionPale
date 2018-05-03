var empty = require('empty-element');
var yo = require('yo-yo');
import { ListarAlmacenes } from './listar'
import { URL } from '../../../constantes_entorno/constantes'

function Ver(_escritura, tipo_almacenes, almacen, cajas_almacen) {


    var el = yo`
    <div>
        <div class="modal modal-danger fade" id="modal-danger-caja_almacen" style="display: none;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                        <h4 class="modal-title">¿Esta seguro que desea eliminar esta caja de este almacen?</h4>
                    </div>
                    <div class="modal-body">
                        <p>Al eliminar se perderan este dato permanentemente.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline pull-left" data-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-outline" id="btnEliminar-caja_almacen" data-dismiss="modal">Si, eliminar</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="modal-nuevo-editar-caja_almacen" style="display: none;">
            
        </div>
        <section class="content-header">
            <h1>
                Alamcenes
                <small>Control almacenes</small>
            </h1>
            <ol class="breadcrumb">
                <li>
                    <a href="#">
                        <i class="fa fa-cog"></i> Logistica</a>
                </li>
                <li><a  onclick=${() => ListarAlmacenes(_escritura)} href="#">
                Alamacenes</a></li>
                <li class="active">${almacen ? 'Editar' : 'Nuevo'}</li>
            </ol>
        </section>
        <section class="content">
            <div class="box">
                <div class="box-header">
                    <a onclick=${() => ListarAlmacenes(_escritura)}
                    class="btn btn-xs btn-warning">
                        <i class="fa fa-arrow-left"></i> Atras</a>
                    
                    
                </div>
                <!-- /.box-header -->
                <div class="box-body">
                    <div class="box box-primary">
                        <div class="box-header with-border">
                            <h3 class="box-title">${almacen ? 'Editar' : 'Nuevo'} Almacen</h3>
                        </div>
                        <!-- form start -->
                        <div role="form">
                            <div class="box-body">
                                <div class="row">
                                    <div class="callout callout-danger hidden" id="divErrors">
                                        <p>Es necesario llenar todos los campos requeridos marcados con rojo</p>
                                    </div>
                                </div>
                                <div class="row">
                                    ${almacen ? yo`` : yo`<div class="col-sm-6">
                                    <div class="form-group">
                                        <label for="Cod_Almacen">Codigo de Almacen *</label>
                                        <input type="text" style="text-transform:uppercase" class="form-control required" id="Cod_Almacen" placeholder="Ingrese codigo almacen" >
                                    </div>
                                </div>`}
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Flag_Principal"></label>
                                            
                                            <div class="checkbox">
                                                <label>
                                                    <input type="checkbox" id="Flag_Principal" checked="${almacen ? almacen.Flag_Principal : 0}"> Es Principal?
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Des_Almacen">Descripcion *</label>
                                            <input type="text"  style="text-transform:uppercase" class="form-control required" id="Des_Almacen" placeholder="Ingrese descripcion de almacen" value="${almacen ? almacen.Des_Almacen : ''}">
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Des_CortaAlmacen">Almacen</label>
                                            <input type="text"  style="text-transform:uppercase" class="form-control" id="Des_CortaAlmacen" placeholder="Ingrese nombre de almacen" value="${almacen ? almacen.Des_CortaAlmacen : ''}">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Cod_TipoAlmacen">Tipo de Almacen *</label>
                                            <select id="Cod_TipoAlmacen" class="form-control required">
                                                <option style="text-transform:uppercase" value=null></option>
                                                ${tipo_almacenes.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_TipoAlmacen}" ${almacen ? almacen.Cod_TipoAlmacen == e.Cod_TipoAlmacen ? 'selected' : '' : ''}>${e.Nom_TipoAlmacen}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                ${almacen != undefined ? yo`
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <div class="nav-tabs-custom">
                                                <ul class="nav nav-tabs">
                                                    <li class="active">
                                                        <a href="#tab_1" data-toggle="tab" aria-expanded="true">
                                                            <i class="fa fa-file"></i> Relacion con Caja</a>
                                                    </li>
                                                </ul>
                                                <div class="tab-content">
                                                    <div class="tab-pane active" id="tab_1">
                                                        <div class="box-header">
                                                            <a class="btn btn-info pull-right" data-toggle="modal" data-target="#modal-nuevo-editar-caja_almacen" onclick="${() => AgregarCaja(_escritura, tipo_almacenes, almacen)}">
                                                                <i class="fa fa-plus"></i> Agregar</a>
                                                        </div>
                                                        <div class="table-responsive">
                                                            <table class="table table-bordered table-striped">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Caja</th>
                                                                        <th>Almacen</th>
                                                                        <th>Principal</th>
                                                                        <th>Usuario</th>
                                                                        <th>Fecha</th>
                                                                        <th>Acciones</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    ${cajas_almacen.map(u => yo`
                                                                    <tr>
                                                                        <td>${u.Des_Caja}</td>
                                                                        <td>${u.Cod_Almacen}</td>
                                                                        <td>${u.Flag_Principal ? 'Si' : 'No'}</td>
                                                                        <td>${u.Cod_UsuarioReg}</td>
                                                                        <td>${u.Fecha_Reg}</td>
                                                                        <td>
                                                                            ${_escritura ? yo`
                                                                            <button class="btn btn-xs btn-success" data-toggle="modal" data-target="#modal-nuevo-editar-caja_almacen"
                                                                                onclick="${() => AgregarCaja(_escritura, tipo_almacenes, almacen, u)}">
                                                                                <i class="fa fa-edit"></i>
                                                                            </button>` : yo``} ${_escritura ? yo`
                                                                            <button class="btn btn-xs btn-danger" data-toggle="modal"
                                                                                data-target="#modal-danger-caja_almacen" onclick="${() => EliminarCajaAlmacen(_escritura, tipo_almacenes, almacen, u)}">
                                                                                <i class="fa fa-trash"></i>
                                                                            </button>` : yo``}
                                    
                                                                        </td>
                                                                    </tr>`)}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- /.tab-content -->
                                            </div>
                                        </div>
                                    </div>
                                    `: yo``}
                                
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div class="box-footer">
                        <button onclick="${() => GuardarAlmacen(_escritura, almacen)}" class="btn btn-primary">Guardar</button>
                    </div>
            </div>
        </section>
    </div>`
    var main = document.getElementById('main-contenido');
    empty(main).appendChild(el);
    // $('.select2').select2();
}



function EliminarCajaAlmacen(_escritura, tipo_almacenes, almacen, u) {
    var btnEliminar = document.getElementById('btnEliminar-caja_almacen')
    btnEliminar.addEventListener('click', function Eliminar(ev) {
        H5_loading.show();
        var Cod_Caja = u.Cod_Caja
        var Cod_Almacen = almacen.Cod_Almacen
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Cod_Caja,
                Cod_Almacen,
            })
        }
        fetch(URL + '/almacenes_api/eliminar_caja_almacen', parametros)
            .then(req => req.json())
            .then(res => {

                if (res.respuesta == 'ok') {
                    NuevoAlmacen(_escritura, tipo_almacenes, almacen)
                    this.removeEventListener('click', Eliminar)
                }
                else {
                    this.removeEventListener('click', Eliminar)
                }
                H5_loading.hide()
            })
    })
}


function AgregarCaja(_escritura, tipo_almacenes, almacen, caja_almacen) {
    H5_loading.show()
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
    }
    fetch(URL + '/almacenes_api/get_cajas_activas', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var cajas_activas = res.data.cajas_activas
                FormularioAgregaCaja(_escritura, tipo_almacenes, almacen, cajas_activas, caja_almacen)

            } else {
                console.log("ERR")
            }
            H5_loading.hide()
        })
}

function FormularioAgregaCaja(_escritura, tipo_almacenes, almacen, cajas_activas, caja_almacen) {
    var el = yo`
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
                <h4 class="modal-title">Caja - Almacen</h4>
            </div>
            <div class="modal-body">
                <div class="box box-primary">
                    <div class="box-header with-border">
                    </div>
                    <!-- /.box-header -->
                    <!-- form start -->
                    <div role="form">
                        <div class="box-body">
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label>Caja</label>
                                        <select class="form-control" id="CA_Cod_Caja">
                                            ${cajas_activas.map(u => yo`
                                            <option value="${u.Cod_Caja}" ${caja_almacen ? caja_almacen.Cod_Caja == u.Cod_Caja ? 'selected' : '' : ''}>${u.Des_Caja}</option>`)}
                                        </select>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label for="CA_Flag_Principal"></label>
                                        <div class="checkbox">
                                            <label>
                                                <input type="checkbox" id="CA_Flag_Principal" checked="${caja_almacen ? caja_almacen.Flag_Principal : 0}"> Es Principal?
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            <div class="modal-footer">
                <button onclick="${() => GuardarCajaAlmacen(_escritura, tipo_almacenes, almacen)}" class="btn btn-primary"  data-dismiss="modal">Guardar</button>
                <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>`

    var modal_nuevo_editar_documento = document.getElementById('modal-nuevo-editar-caja_almacen')
    empty(modal_nuevo_editar_documento).appendChild(el)
}

function GuardarCajaAlmacen(_escritura, tipo_almacenes, almacen) {
    var Cod_Almacen = almacen.Cod_Almacen
    var Cod_Caja = document.getElementById('CA_Cod_Caja').value
    var Flag_Principal = document.getElementById('CA_Flag_Principal').checked
    var Cod_Usuario = 'ADMINISTRADOR'
    H5_loading.show()
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            Cod_Almacen,
            Cod_Caja,
            Flag_Principal,
            Cod_Usuario
        })
    }
    fetch(URL + '/almacenes_api/guardar_caja_almacen', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                NuevoAlmacen(_escritura, tipo_almacenes, almacen)
            }
            else {
                console.log('Error')
            }
            H5_loading.hide();
        })

}

function GuardarAlmacen(_escritura, almacen) {
    if (ValidacionCampos()) {
        //console.log(document.getElementById('Cod_Usuarios').value.toUpperCase())
        H5_loading.show();
        var Cod_Almacen = almacen ? almacen.Cod_Almacen : document.getElementById('Cod_Almacen').value.toUpperCase()
        var Des_Almacen = document.getElementById('Des_Almacen').value.toUpperCase()
        var Des_CortaAlmacen = document.getElementById('Des_CortaAlmacen').value.toUpperCase()
        var Cod_TipoAlmacen = document.getElementById('Cod_TipoAlmacen').value
        var Flag_Principal = document.getElementById('Flag_Principal').checked
        var Cod_Usuario = 'ADMINISTRADOR'

        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                Cod_Almacen,
                Des_Almacen,
                Des_CortaAlmacen,
                Cod_TipoAlmacen,
                Flag_Principal,
                Cod_Usuario
            })
        }
        fetch(URL + '/almacenes_api/guardar_almacen', parametros)
            .then(req => req.json())
            .then(res => {
                if (res.respuesta == 'ok') {
                    ListarAlmacenes(_escritura)
                }
                else {
                    console.log('Error')
                }
                H5_loading.hide()
            })
    }
}

function NuevoAlmacen(_escritura, tipo_almacenes, almacen) {
    if (almacen != undefined) {
        H5_loading.show();
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Cod_Almacen: almacen.Cod_Almacen })
        }
        fetch(URL + '/almacenes_api/get_cajas_by_almacen', parametros)
            .then(req => req.json())
            .then(res => {
                if (res.respuesta == 'ok') {
                    Ver(_escritura, tipo_almacenes, almacen, res.data.cajas_almacen)
                }
                else {
                    console.log('Error')
                }
                H5_loading.hide();
            })
    } else Ver(_escritura, tipo_almacenes, almacen, [])
}
export { NuevoAlmacen }