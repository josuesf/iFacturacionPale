var empty = require('empty-element');
var yo = require('yo-yo');
import { ListarCuentasBancarias } from './listar'
import { URL } from '../../../constantes_entorno/constantes'

function Ver(_escritura, variables, cuenta) {

    var tab = yo`
    <li class=""><a href="#tab_crear_cuentas_bancarias_2" data-toggle="tab" aria-expanded="false" id="id_tab_crear_cuentas_bancarias_2">Nueva Cuenta<a style="padding-left: 10px;" class="btn" onclick=${()=>CerrarTab()}><i class="fa fa-close text-danger"></i></a></a></li>`


    var el = yo`
    <div class="tab-pane" id="tab_crear_cuentas_bancarias_2">
        
        <section class="content">
            <div class="card">
                <div class="card-head">
                    <header>
                    <a onclick=${() => ListarCuentasBancarias(_escritura)}
                    class="btn btn-xs btn-icon-toggle">
                        <i class="fa fa-arrow-left"></i></a>
                        ${cuenta ? 'Editar' : 'Nuevo'} Cuenta Bancaria
                    </header>
                    
                </div> 
                <div class="card-body">
                    <div class="panel">
                        
                        <!-- form start -->
                        <div role="form">
                            <div class="panel-body">
                                <div class="row">
                                    <div class="alert alert-callout alert-danger hidden" id="divErrors">
                                        <p>Es necesario llenar todos los campos requeridos marcados con rojo</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="">Sucursal Responsable *</label>
                                            <select id="Cod_Sucursal" class="form-control required">
                                                <option value=""></option>
                                                ${variables.sucursales.map(e => yo`<option value="${e.Cod_Sucursal}" ${cuenta ? cuenta.Cod_Sucursal == e.Cod_Sucursal ? 'selected' : '' : ''}>${e.Nom_Sucursal}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="">Entidad Financiera *</label>
                                            <select id="Cod_EntidadFinanciera" class="form-control required">
                                                <option value=""></option>
                                                ${variables.entidades.map(e => yo`<option value="${e.Cod_EntidadFinanciera}" ${cuenta ? cuenta.Cod_EntidadFinanciera == e.Cod_EntidadFinanciera ? 'selected' : '' : ''}>${e.Nom_EntidadFinanciera}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    ${cuenta ? yo`` : yo`<div class="col-sm-6">
                                    <div class="form-group">
                                        <label >Cuenta Bancaria *</label>
                                        <input type="text" style="text-transform:uppercase" class="form-control required" id="Cod_CuentaBancaria">
                                    </div>
                                    </div>`}
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="">Moneda *</label>
                                            <select id="Cod_Moneda" class="form-control required">
                                                <option value=""></option>
                                                ${variables.monedas.map(e => yo`<option value="${e.Cod_Moneda}" ${cuenta ? cuenta.Cod_Moneda == e.Cod_Moneda ? 'selected' : '' : ''}>${e.Nom_Moneda}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="">Tipo de Cuenta *</label>
                                            <select id="Cod_TipoCuentaBancaria" class="form-control required">
                                                <option value=""></option>
                                                ${variables.tipos_cuentas.map(e => yo`<option value="${e.Cod_TipoCuentaBancaria}" ${cuenta ? cuenta.Cod_TipoCuentaBancaria == e.Cod_TipoCuentaBancaria ? 'selected' : '' : ''}>${e.Nom_TipoCuentaBancaria}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="">Descripcion de la cuenta *</label>
                                            <input type="text"  style="text-transform:uppercase" class="form-control required" id="Des_CuentaBancaria" value="${cuenta ? cuenta.Des_CuentaBancaria : ''}">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="">Cuenta Contable</label>
                                            <input type="text"  style="text-transform:uppercase" class="form-control" id="Cod_CuentaContable" value="${cuenta ? cuenta.Cod_CuentaContable : ''}">
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="">Saldo Disponible</label>
                                            <input type="number" class="form-control" id="Saldo_Disponible" value="${cuenta ? cuenta.Saldo_Disponible : ''}">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for=""></label>
                                            
                                            <div class="checkbox checkbox-inline checkbox-styled">
                                                <label>
                                                    <input type="checkbox" id="Flag_Activo" checked="${cuenta ? cuenta.Flag_Activo : 0}"><span> Es Activo? </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div class="card-actionbar">
                        <button onclick="${() => GuardarCuentaBancaria(_escritura, cuenta)}" class="btn btn-primary">Guardar</button>
                    </div>
            </div>
        </section>
    </div>`
    //var main = document.getElementById('main-contenido');
    //empty(main).appendChild(el);
    // $('.select2').select2();
    if($("#tab_crear_cuentas_bancarias_2").length){  

        $('#tab_crear_cuentas_bancarias_2').remove()
        $('#id_tab_crear_cuentas_bancarias_2').parents('li').remove()

        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    }else{
        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    } 
    $("#id_tab_crear_cuentas_bancarias_2").click()
}

function CerrarTab(){
    $('#tab_crear_cuentas_bancarias_2').remove()
    $('#id_tab_crear_cuentas_bancarias_2').parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show'); 
}


function GuardarCuentaBancaria(_escritura, cuenta) {
    if (ValidacionCampos()) {
        run_waitMe($('#main-contenido'), 1, "ios","Guardar cuenta bancaria...");
        var Cod_CuentaBancaria = cuenta ? cuenta.Cod_CuentaBancaria : document.getElementById('Cod_CuentaBancaria').value.toUpperCase()
        var Cod_Sucursal = document.getElementById('Cod_Sucursal').value
        var Cod_EntidadFinanciera = document.getElementById('Cod_EntidadFinanciera').value
        var Des_CuentaBancaria = document.getElementById('Des_CuentaBancaria').value.toUpperCase()
        var Cod_Moneda = document.getElementById('Cod_Moneda').value
        var Saldo_Disponible = document.getElementById('Saldo_Disponible').value
        var Cod_CuentaContable = document.getElementById('Cod_CuentaContable').value
        var Cod_TipoCuentaBancaria = document.getElementById('Cod_TipoCuentaBancaria').value
        var Flag_Activo = document.getElementById('Flag_Activo').checked

        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                Cod_CuentaBancaria, Cod_Sucursal, Cod_EntidadFinanciera,
                Des_CuentaBancaria, Cod_Moneda, Saldo_Disponible, Cod_CuentaContable,
                Cod_TipoCuentaBancaria, Flag_Activo
            })
        }
        fetch(URL + '/cuentas_bancarias_api/guardar_cuenta', parametros)
            .then(req => req.json())
            .then(res => {
                if (res.respuesta == 'ok') {
                    ListarCuentasBancarias(_escritura)
                }
                else {
                    console.log('Error')
                }
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
    }
}

function NuevaCuentaBancaria(_escritura, variables, cuenta) {
    if (cuenta != undefined) {
        run_waitMe($('#main-contenido'), 1, "ios");
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Cod_CuentaBancaria: cuenta.Cod_CuentaBancaria })
        }
        fetch(URL + '/cuentas_bancarias_api/get_cuenta', parametros)
            .then(req => req.json())
            .then(res => {
                if (res.respuesta == 'ok') {
                    Ver(_escritura, variables, res.data.cuenta[0])
                }
                else {
                    console.log('Error')
                }
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
    } else Ver(_escritura, variables)
}
export { NuevaCuentaBancaria }