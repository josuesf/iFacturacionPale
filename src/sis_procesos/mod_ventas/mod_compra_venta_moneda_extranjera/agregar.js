var empty = require('empty-element');
var yo = require('yo-yo');

import { URL } from '../../../constantes_entorno/constantes'

function Ver(_escritura, Serie, variables) {
    var el = yo`
    <div> 
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h4 class="modal-title"><strong>Compra ME</strong></h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-8">
                            <div class="box">
                                <div class="box-header with-border">
                                    <h3 class="box-title">A favor de : </h3>
                                </div> 
                                <div class="box-body">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <select class="form-control">
                                                    ${variables.tipos_documento.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_TipoDoc}">${e.Nom_TipoDoc}</option>`)}
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="input-group">
                                                <input type="text" class="form-control">
                                                <div class="input-group-btn">
                                                    <button type="button" class="btn btn-success" data-toggle="modal" data-target="#modal-buscar-doc-proveedor" id="BuscarDoc"
                                                    ><i class="fa fa-globe"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="input-group">
                                                <div class="input-group-btn">
                                                    <button type="button" class="btn btn-success" data-toggle="modal" data-target="#modal-buscar-doc-proveedor" id="BuscarDoc"
                                                    ><i class="fa fa-plus"></i></button>
                                                </div>
                                                <input type="text" class="form-control">
                                                <div class="input-group-btn">
                                                    <button type="button" class="btn btn-info" data-toggle="modal" data-target="#modal-buscar-doc-proveedor" id="BuscarDoc"
                                                    ><i class="fa fa-search"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="box">
                                <div class="box-header with-border text-center">
                                    <h4 class="box-title" id="Ruc_Empresa"><strong> R.U.C. 20442625256 </strong></h4>
                                </div>
                                <div class="box-body text-center">
                                    <h4><strong>COMPRA/VENTA ME</strong></h4>
                                </div> 
                                <div class="box-footer">
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <select class="form-control">
                                                <option style="text-transform:uppercase" value="${Serie}">${Serie}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-8">
                                        <div class="form-group">
                                            <input type="text" class="form-control" value>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="col-sm-3">
                                <label></label>
                                <div class="radio">
                                    <label>
                                        <input type="radio" id="TipoOperacion" name="optionsRadios" checked> En Caja
                                    </label>
                                </div>
                            </div>
                            <div class="col-sm-3">
                                <label></label>
                                <div class="radio">
                                    <label>
                                        <input type="radio" id="TipoOperacion" name="optionsRadios"> En Banco
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Fecha</label>
                
                                <div class="input-group date">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                    <input type="text" class="form-control pull-right required" id="Fecha">
                                </div>
                                <!-- /.input group -->
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="box box-solid">
                            <div class="box-body">
                                <div class="row"> 
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="Cod_Producto">Banco</label>
                                            <select class="form-control">
                                                ${variables.entidades_financieras.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_EntidadFinaciera}">${e.Nom_EntidadFinanciera}</option>`)}
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="Cod_Producto">Cuenta Soles</label>
                                            <select class="form-control">
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="Cod_Producto">Cuenta ME</label>
                                            <select class="form-control">
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="Cod_Producto">Operacion</label>
                                            <input type="text" class="form-control" >
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label>Tipo de Operacion</label>
                                        <div class="col-sm-12">
                                            <div class="col-sm-6">
                                                <div class="checkbox">
                                                    <label>
                                                        <input type="radio" id="TipoME" name="optionCV"> Compra ME
                                                    </label>
                                                </div>
                                            </div>
                                            <div class="col-sm-6">
                                                <label></label>
                                                <div class="checkbox">
                                                    <label>
                                                        <input type="radio" id="TipoME" name="optionCV"> Venta ME
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label for="Cod_Producto">Moneda</label>
                                            <select class="form-control">
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="Cod_Producto">Monto</label>
                                            <input type="number" class="form-control" >
                                        </div>
                                        <div class="form-group">
                                            <label for="Cod_Producto">Tipo de Cambio</label>
                                            <input type="number" class="form-control" >
                                        </div>
                                        <div class="form-group">
                                            <label for="Cod_Producto">Soles</label>
                                            <input type="number" class="form-control" >
                                        </div>
                                    </div>
                                </div>
                            </div> 
                        </div>
                    </div>
                </div>
                <div class="modal-footer text-center"> 
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-info" id="btnGuardar" data-dismiss="modal">Aceptar</button>
                </div>
            </div>
        </div> 
    </div>`

    var main = document.getElementById('main-contenido');
    empty(main).appendChild(el);

}




function NuevoCompraVentaDolar(_escritura, caja) {
    H5_loading.show();
    var Cod_Caja = '100'//caja.Cod_Caja
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Cod_Caja
        })
    }
    fetch(URL + '/compra_venta_moneda_extranjera_api/get_comprobante_by_caja', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                TraerSiguienteNumeroComprobante(_escritura, res.data.serie)
            }
            else {
                H5_loading.hide()
            }
        })
}

function TraerSiguienteNumeroComprobante(_escritura, Serie) {
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Serie
        })
    }
    fetch(URL + '/compra_venta_moneda_extranjera_api/get_next_number_comprobante', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var variables = res.data
                //var entidad_financiera = res.data.entidades_financieras[0]
                TraerCuentaBancariaEntidadFinanciera(_escritura, Serie, variables)
            }
            else {
                H5_loading.hide()
            }
        })
}

function TraerCuentaBancariaEntidadFinanciera(_escritura, Serie, variables) {
    var Cod_EntidadFinaciera = variables.entidades_financieras[0].Cod_EntidadFinaciera
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Cod_EntidadFinaciera
        })
    }
    fetch(URL + '/compra_venta_moneda_extranjera_api/get_cuenta_bancaria_by_entidad_financiera', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                variables['cuenta_bancaria_pen'] = res.data.cuenta_bancaria_pen
                variables['cuenta_bancaria_usd'] = res.data.cuenta_bancaria_usd
                Ver(_escritura, Serie,variables)
            }
            else {
            }
            H5_loading.hide()
        })
}


export { NuevoCompraVentaDolar }