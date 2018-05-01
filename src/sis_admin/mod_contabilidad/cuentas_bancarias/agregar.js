var empty = require('empty-element');
var yo = require('yo-yo');
import { ListarCuentasBancarias } from './listar'
import { URL } from '../../../constantes_entorno/constantes'

function Ver(_escritura, variables, cuenta) {


    var el = yo`
    <div>
        <section class="content-header">
            <h1>
                Cuentas Bancarias
                <small>Control cuentas bancarias</small>
            </h1>
            <ol class="breadcrumb">
                <li>
                    <a href="#">
                        <i class="fa fa-cog"></i> Contabilidad</a>
                </li>
                <li><a  onclick=${() => ListarCuentasBancarias(_escritura)} href="#">
                Cuentas Bancarias</a></li>
                <li class="active">${cuenta ? 'Editar' : 'Nuevo'}</li>
            </ol>
        </section>
        <section class="content">
            <div class="box">
                <div class="box-header">
                    <a onclick=${() => ListarCuentasBancarias(_escritura)}
                    class="btn btn-xs btn-warning">
                        <i class="fa fa-arrow-left"></i> Atras</a>
                    
                    
                </div>
                <!-- /.box-header -->
                <div class="box-body">
                    <div class="box box-primary">
                        <div class="box-header with-border">
                            <h3 class="box-title">${cuenta ? 'Editar' : 'Nuevo'} Cuenta Bancaria</h3>
                        </div>
                        <!-- form start -->
                        <div role="form">
                            <div class="box-body">
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="">Sucursal Responsable</label>
                                            <select id="Cod_Sucursal" class="form-control">
                                                ${variables.sucursales.map(e => yo`<option value="${e.Cod_Sucursal}" ${cuenta? cuenta.Cod_Sucursal == e.Cod_Sucursal ? 'selected' : '' : ''}>${e.Nom_Sucursal}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="">Entidad Financiera</label>
                                            <select id="Cod_EntidadFinanciera" class="form-control">
                                                ${variables.entidades.map(e => yo`<option value="${e.Cod_EntidadFinanciera}" ${cuenta? cuenta.Cod_EntidadFinanciera == e.Cod_EntidadFinanciera ? 'selected' : '' : ''}>${e.Nom_EntidadFinanciera}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    ${cuenta ? yo`` : yo`<div class="col-sm-6">
                                    <div class="form-group">
                                        <label >Cuenta Bancaria *</label>
                                        <input type="text" style="text-transform:uppercase" class="form-control" id="Cod_CuentaBancaria">
                                    </div>
                                    </div>`}
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="">Moneda</label>
                                            <select id="Cod_Moneda" class="form-control">
                                                ${variables.monedas.map(e => yo`<option value="${e.Cod_Moneda}" ${cuenta? cuenta.Cod_Moneda == e.Cod_Moneda ? 'selected' : '' : ''}>${e.Nom_Moneda}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="">Tipo de Cuenta</label>
                                            <select id="Cod_TipoCuentaBancaria" class="form-control">
                                                ${variables.tipos_cuentas.map(e => yo`<option value="${e.Cod_TipoCuentaBancaria}" ${cuenta? cuenta.Cod_TipoCuentaBancaria == e.Cod_TipoCuentaBancaria ? 'selected' : '' : ''}>${e.Nom_TipoCuentaBancaria}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="">Descripcion de la cuenta</label>
                                            <input type="text"  style="text-transform:uppercase" class="form-control" id="Des_CuentaBancaria" value="${cuenta ? cuenta.Des_CuentaBancaria : ''}">
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
                                            
                                            <div class="checkbox">
                                                <label>
                                                    <input type="checkbox" id="Flag_Activo" checked="${cuenta ? cuenta.Flag_Activo : 0}"> Es Activo?
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div class="box-footer">
                        <button onclick="${() => GuardarCuentaBancaria(_escritura,cuenta)}" class="btn btn-primary">Guardar</button>
                    </div>
            </div>
        </section>
    </div>`
    var main = document.getElementById('main-contenido');
    empty(main).appendChild(el);
    // $('.select2').select2();
}



function GuardarCuentaBancaria(_escritura, cuenta){
    //console.log(document.getElementById('Cod_Usuarios').value.toUpperCase())
    H5_loading.show();
    var Cod_CuentaBancaria = cuenta?cuenta.Cod_CuentaBancaria:document.getElementById('Cod_CuentaBancaria').value.toUpperCase()
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
            Cod_CuentaBancaria,Cod_Sucursal,Cod_EntidadFinanciera,
            Des_CuentaBancaria,Cod_Moneda,Saldo_Disponible,Cod_CuentaContable,
            Cod_TipoCuentaBancaria,Flag_Activo
        })
    }
    fetch(URL+'/cuentas_bancarias_api/guardar_cuenta', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                ListarCuentasBancarias(_escritura)
            }
            else{
                console.log('Error')
            }
            H5_loading.hide()
        })
}

function NuevaCuentaBancaria(_escritura, variables, cuenta) {
    if (cuenta != undefined) {
        H5_loading.show();
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
                    Ver(_escritura, variables,res.data.cuenta[0])
                }
                else {
                    console.log('Error')
                }
                H5_loading.hide();
            })
    } else Ver(_escritura, variables)
}
export { NuevaCuentaBancaria }