var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../../constantes_entorno/constantes'

function Ver(_escritura, cuentas, Id_ClienteProveedor) {
    var el = yo`
        <div class="table-responsive">
            <div class="modal modal-danger fade" id="modal-danger-cuentas-bancarias" style="display: none;">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                            <h4 class="modal-title">¿Esta seguro que desea eliminar esta cuenta?</h4>
                        </div>
                        <div class="modal-body">
                            <p>Al eliminar la cuenta no podra recuperarla. Desea continuar de todas maneras?</p>
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
                            <h4 class="modal-title">Agregar o Editar Cuenta</h4>
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
                <a class="btn btn-info pull-right" onclick="${() => AbrirCuenta(_escritura, Id_ClienteProveedor)}" data-toggle="modal" data-target="#modal-nuevo">
                <i class="fa fa-plus"></i> Agregar Cuenta</a>
            </div>
            <div class="col-md-12">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Principal</th>
                            <th>Entidad Financiera</th>
                            <th>Nro Cuenta</th>
                            <th>Cuenta</th>
                            <th>Cuenta Privada</th>
                            <th>Observaciones</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cuentas.map(u => yo`
                        <tr>
                            <td>${u.Flag_Principal ? 'SI' : 'NO'}</td>
                            <td>${u.Nom_EntidadFinanciera}</td>
                            <td>${u.NroCuenta_Bancaria}</td>
                            <td>${u.Des_CuentaBancaria}</td>
                            <td>${u.Cuenta_Interbancaria}</td>
                            <td>${u.Obs_CuentaBancaria}</td>
                            <td>
                                ${_escritura ? yo`<button class="btn btn-xs btn-success" onclick="${() => AbrirCuenta(_escritura, Id_ClienteProveedor, u)}"><i class="fa fa-edit"></i></button>` : yo``}
                                ${_escritura ? yo`<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger-cuentas-bancarias" onclick="${() => Eliminar(_escritura, u)}"><i class="fa fa-trash"></i></button>` : yo``}
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
function CargarFormulario(_escritura, entidades, tipos_cuenta, Id_ClienteProveedor, e) {
    const el = yo`
    <div class="panel-body" id="form_modal">
        <div class="row">
            <div class="alert alert-callout alert-danger hidden" id="divErrors_CB">
                <p>Es necesario llenar todos los campos requeridos marcados con rojo</p>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-6">
                <div class="form-group">
                    <label>Entidad Financiera *</label>
                    <select class="form-control required" id="CB_Cod_EntidadFinanciera">
                        <option value=""></option>
                        ${entidades.map(u => yo`<option 
                            value=${u.Cod_EntidadFinanciera} 
                            ${(e) ? (e.Cod_EntidadFinanciera == u.Cod_EntidadFinanciera ? 'selected' : '') : ''}>
                            ${u.Nom_EntidadFinanciera}</option>`)}                                        
                    </select>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-group">
                    <label>Numero de Cuenta *</label>
                    <input class="form-control required" id="CB_NroCuenta_Bancaria" value="${e ? e.NroCuenta_Bancaria : ''}">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-6">
                <div class="form-group">
                    <label>Cuenta Interbancaria</label>
                    <input class="form-control" id="CB_Cuenta_Interbancaria" value="${e ? e.Cuenta_Interbancaria : ''}">
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-group">
                    <label>Tipo de Cuenta *</label>
                    <select class="form-control required" id="CB_Cod_TipoCuentaBancaria">
                        <option value=""></option>
                        ${tipos_cuenta.map(u => yo`<option 
                            value=${u.Cod_TipoCuentaBancaria} 
                            ${(e) ? (e.Cod_TipoCuentaBancaria == u.Cod_TipoCuentaBancaria ? 'selected' : '') : ''}>
                            ${u.Nom_TipoCuentaBancaria}</option>`)}
                    </select>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-6">
                <div class="form-group">
                    <label>Descripcion Cuenta</label>
                    <input class="form-control" id="CB_Des_CuentaBancaria" value="${e ? e.Des_CuentaBancaria : ''}">
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-group">
                    <label></label>
                    <div class="checkbox checkbox-inline checkbox-styled">
                        <label>
                            <input type="checkbox" id="CB_Flag_Principal" checked=${e ? e.Flag_Principal : '0'}> <span> Es Principal?</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-6">
                <div class="form-group">
                    <label for="">Observaciones</label>
                    <textarea id="CB_Obs_CuentaBancaria" class="form-control">${e ? e.Obs_CuentaBancaria : ''}</textarea>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn pull-left" data-dismiss="modal">Cancelar</button>
            <button type="button" onclick=${() => GuardarCuenta(_escritura, Id_ClienteProveedor, e)} class="btn btn-primary">Guardar</button>
        </div>
    </div>
    `
    var form = document.getElementById('form_modal');
    empty(form).appendChild(el);
}
function AbrirCuenta(_escritura, Id_ClienteProveedor, cuenta) {

    run_waitMe($('#main-contenido'), 1, "ios");
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
    }
    fetch(URL + 'clientes_api/get_entidades_tiposcuentas', parametros)
        .then(r => r.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                CargarFormulario(_escritura, res.data.entidades, res.data.tipos_cuenta, Id_ClienteProveedor, cuenta)
            } else {
                CargarFormulario(_escritura, [], [], Id_ClienteProveedor, cuenta)
            }
            $('#main-contenido').waitMe('hide');
            $('#modal-abrir').modal()
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });

}
function GuardarCuenta(_escritura, Id_ClienteProveedor, cuenta) {
    if (ValidacionCampos('divErrors_CB')) {
        $('#modal-abrir').modal("hide")
        run_waitMe($('#main-contenido'), 1, "ios","Guardando cuenta...");
        const NroCuenta_Bancaria = cuenta ? cuenta.NroCuenta_Bancaria : document.getElementById('CB_NroCuenta_Bancaria').value
        const Cod_EntidadFinanciera = document.getElementById('CB_Cod_EntidadFinanciera').value
        const Cod_TipoCuentaBancaria = document.getElementById('CB_Cod_TipoCuentaBancaria').value
        const Des_CuentaBancaria = document.getElementById('CB_Des_CuentaBancaria').value
        const Flag_Principal = document.getElementById('CB_Flag_Principal').checked
        const Cuenta_Interbancaria = document.getElementById('CB_Cuenta_Interbancaria').value
        const Obs_CuentaBancaria = document.getElementById('CB_Obs_CuentaBancaria').value

        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                Id_ClienteProveedor, NroCuenta_Bancaria, Cod_EntidadFinanciera,
                Cod_TipoCuentaBancaria, Des_CuentaBancaria, Flag_Principal,
                Cuenta_Interbancaria, Obs_CuentaBancaria
            })
        }
        fetch(URL + 'clientes_api/guardar_cuenta_bancaria_cliente', parametros)
            .then(r => r.json())
            .then(res => {
                CuentasBancarias(_escritura, Id_ClienteProveedor)
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
    }

}
function Eliminar(_escritura, cuenta) {
    var btnEliminar = document.getElementById('btnEliminar')
    btnEliminar.addEventListener('click', function Eliminar(ev) {
        run_waitMe($('#main-contenido'), 1, "ios","Eliminando cuenta...");
        const Id_ClienteProveedor = cuenta.Id_ClienteProveedor
        const NroCuenta_Bancaria = cuenta.NroCuenta_Bancaria

        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Id_ClienteProveedor, NroCuenta_Bancaria
            })
        }
        fetch(URL + 'clientes_api/eliminar_cuenta_bancaria_cliente', parametros)
            .then(r => r.json())
            .then(res => {
                CuentasBancarias(_escritura, cuenta.Id_ClienteProveedor)
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
    })

}
function CuentasBancarias(_escritura, Id_ClienteProveedor) {
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
    fetch(URL + 'clientes_api/get_cuentas_cliente', parametros)
        .then(r => r.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                Ver(_escritura, res.data.cuentas, Id_ClienteProveedor)
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

export { CuentasBancarias }