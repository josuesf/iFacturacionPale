var empty = require('empty-element');
var yo = require('yo-yo');

import { URL } from '../../../constantes_entorno/constantes'

function Ver(_escritura, Serie, variables) {
    var el = yo`
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
                            <div class="panel panel-default">
                                <div class="panel-heading">
                                    <p>A favor de : </p>
                                </div> 
                                <div class="panel-body">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <select class="form-control" id="Cod_TipoDocumentoBuscar">
                                                    ${variables.tipos_documento.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_TipoDoc}">${e.Nom_TipoDoc}</option>`)}
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="input-group">
                                                <input type="text" class="form-control" id="Nro_DocumentoBuscar" onkeypress=${()=>BusquedaClientePorNroDoc(variables,event)} onblur=${()=>BusquedaClientePorNroDoc(variables)}>
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
                                                    <button type="button" class="btn btn-success" id="AgregarCliente" onclick=${()=>NuevoCliente(variables)}><i class="fa fa-plus"></i></button>
                                                </div>
                                                <input type="text" class="form-control" id="txtNombreCliente" onblur=${()=>RecuperarDatosClientePorNombre(variables)}>
                                                <div class="input-group-btn">
                                                    <button type="button" class="btn btn-info" id="BuscarCliente" onclick=${()=>BuscarCliente(variables)}><i class="fa fa-search"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="panel panel-default">
                                <div class="panel-heading text-center">
                                    <div class="row">
                                        <h4 class="box-title" id="Ruc_Empresa"><strong> R.U.C. 20442625256 </strong></h4>
                                    </div>
                                    <div class="row">
                                        <h4><strong>COMPRA/VENTA ME</strong></h4>
                                    </div> 
                                    
                                    <div class="row">
                                        <div class="col-md-5">
                                            <div class="form-group">
                                                <select class="form-control" id="Serie">
                                                    <option style="text-transform:uppercase" value="${Serie}">${Serie}</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-7">
                                            <div class="form-group">
                                                <input type="text" class="form-control"  value="00000000${variables.siguiente_numero_comprobante[0].Numero}">
                                            </div>
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
                                        <input type="radio" value="c" id="TipoDestino" name="TipoDestino" checked onclick="${() => CambioTipoDestino()}" > En Caja
                                    </label>
                                </div>
                            </div>
                            <div class="col-sm-3">
                                <label></label>
                                <div class="radio">
                                    <label>
                                        <input type="radio" value="b" id="TipoDestino" name="TipoDestino" onclick="${() => CambioTipoDestino()}"> En Banco
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="Fecha">Fecha</label>
                                <input type="date" class="form-control" id="Fecha" placeholder='dd/mm/aaaa'>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="panel panel-default">

                            <div class="panel-heading text-center">
                                <p> Detalles</p>
                            </div>

                            <div class="panel-body">
                                <div class="row"> 
                                    <div class="col-md-12"> 
                                        <div class="col-md-6" id="formBanco" style="display:none">
                                            <div class="form-group">
                                                <label for="Cod_Producto">Banco</label>
                                                <select class="form-control" id="SelectEntidadFinanciera">
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
                                        <div class="col-md-6 col-md-offset-3" id="formVentaCompraME">
                                            <label>Tipo de Operacion</label>
                                            <div class="col-sm-12">
                                                <div class="col-sm-6">
                                                        <label class="radio-inline">
                                                            <input type="radio" id="TipoME" name="optionCV"> Compra ME
                                                        </label> 
                                                </div>
                                                <div class="col-sm-6">
                                                        <label class="radio-inline">
                                                            <input type="radio" id="TipoME" name="optionCV"> Venta ME
                                                        </label>
                                                </div>
                                            </div> 
                                            <br><br><br>
                                            <div class="form-group">
                                                <label for="Cod_Producto">Moneda</label>
                                                <select class="form-control">
                                                    ${variables.monedas_sinsoles.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_Moneda}">${e.Nom_Moneda}</option>`)}
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
                </div>
                <div class="modal-footer text-center"> 
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-info" id="btnGuardar" onclick=${()=>GuardarCompraVentaME()}>Guardar</button>
                </div>
            </div>
        </div>`

    var modal_proceso = document.getElementById('modal-proceso');
    empty(modal_proceso).appendChild(el);
    $('#modal-proceso').modal()
}

 

function VerNuevoCliente(variables) {
    var el = yo`
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h4 class="modal-title"><strong>Nuevo Cliente</strong></h4>
                </div>
                <div class="modal-body" id="modal_form">
                    <div class="row">
                        <div id="modal_error" class="callout callout-danger hidden">
                            <p> Es necesario llenar los campos marcados con rojo</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="Cod_TipoDocumento">Tipo de documento *</label>
                                <select id="Cod_TipoDocumento"  class="form-control required">
                                    ${variables.tipos_documento.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_TipoDoc}">${e.Nom_TipoDoc}</option>`)}
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="Nro_Documento">Numero de Documento *</label>
                                <input type="number"  class="form-control required" id="Nro_Documento">
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="Cliente">Nombre Completo *</label>
                                <input type="text"  class="form-control required" id="Cliente">
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="DireccioN">Direccion *</label>
                                <input type="text"  class="form-control required" id="DireccioN">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="Email1">Correo Electronico</label>
                                <input type="email"  class="form-control" id="Email1">
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="Telefono1">Telefono</label>
                                <input type="text"  class="form-control" id="Telefono1">
                            </div>
                        </div>
                    </div>
                     
                </div>
                <div class="modal-footer text-center"> 
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-info" id="btnGuardar" onclick=${()=>GuardarNuevoCliente()}>Aceptar</button>
                </div>
            </div>
        </div>`

    var modal_proceso = document.getElementById('modal-superior');
    empty(modal_proceso).appendChild(el);
    $('#modal-superior').modal()
}

function VerBuscarCliente(variables) {
    var el = yo`
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h4 class="modal-title"><strong>Buscar Cliente - Proveedor</strong></h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-sm-6">
                            <label></label>
                            <div class="radio">
                                <label>
                                    <input type="radio" id="optionsRadiosBuscar" name="optionsRadiosBuscar" value="nro"> Por Nro. Documento
                                </label>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <label></label>
                            <div class="radio">
                                <label>
                                    <input type="radio" id="optionsRadiosBuscar" name="optionsRadiosBuscar" checked="checked" value="nombre"> Por Nombre o Cliente
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="input-group">
                                <input type="text" class="form-control" id="txtBuscarCliente">
                                <div class="input-group-btn">
                                    <button type="button" id="BuscarClienteModal" class="btn btn-success" onclick=${()=>BusquedaClienteModal()}><i class="fa fa-search"></i> Buscar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="table-responsive" id="contenedorTablaClientes">

                        </div>
                    </div>
                </div>
                <div class="modal-footer text-center"> 
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-info" id="btnGuardar" data-dismiss="modal">Aceptar</button>
                </div>
            </div>
        </div>`

    var modal_proceso = document.getElementById('modal-superior');
    empty(modal_proceso).appendChild(el);
    $('#modal-superior').modal()
    $("#txtBuscarCliente").val($("#txtNombreCliente").val())
}

function AgregarTabla(clientes){
    var el = yo`<table id="example1" class="table table-bordered table-striped">
    <thead>
        <tr>
            <th>Documento</th>
            <th>Cliente</th> 
            <th>Acciones</th>
        </tr>
    </thead>
    <tbody>
        ${clientes.map(u => yo`
        <tr>
            <td>${u.Nro_Documento}</td>
            <td>${u.Cliente}</td> 
            <td><button class="btn btn-xs btn-primary" data-dismiss="modal" onclick="${()=>SeleccionarCliente(u)}"><i class="fa fa-check"></i> Elegir</button></td>
        </tr>`)}
    </tbody>

</table>`
    empty(document.getElementById('contenedorTablaClientes')).appendChild(el);
}


function BusquedaClientePorNroDoc(variables,event) { 
    if(event!=undefined){
        if(event.which == 13) {
            RecuperarDatosClientePorNroDoc(variables)
        }
    }else{
        RecuperarDatosClientePorNroDoc(variables)
    }
}

function RecuperarDatosClientePorNroDoc(variables){
    H5_loading.show(); 
    var Nro_Documento = $("#Nro_DocumentoBuscar").val()
    var Cod_TipoDocumento = $("#Cod_TipoDocumentoBuscar").val()
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({ 
            Nro_Documento,
            Cod_TipoDocumento
        })
    }
    fetch(URL+'/clientes_api/get_cliente_by_documento', parametros)
    .then(req => req.json())
    .then(res => {
        console.log(res)
        if (res.respuesta == 'ok') {
            $("#txtNombreCliente").val(res.data.cliente[0].Cliente)
            $("#txtNombreCliente").focus()
        }
        else{
            VerBuscarCliente(variables)
            $("#txtBuscarCliente").val($("#txtNombreCliente").val())
        }
        H5_loading.hide()
    })
}

function RecuperarDatosClientePorNombre(variables){
    H5_loading.show(); 
    var Cliente = $("#txtNombreCliente").val()
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({ 
            Cliente
        })
    }
    fetch(URL+'/clientes_api/get_cliente_by_nombre', parametros)
    .then(req => req.json())
    .then(res => { 
        VerBuscarCliente(variables)
        AgregarTabla(res.data.cliente)
        H5_loading.hide()
    })
}


function CambioTipoDestino() {
    if ($('input[name=TipoDestino]:checked').val() == 'c') {
        $('#formBanco').hide()
        $('#formVentaCompraME').removeClass()
        $('#formVentaCompraME').addClass("col-md-6 col-md-offset-3") 
    } else {
        $('#formBanco').show()
        $('#formVentaCompraME').removeClass()
        $('#formVentaCompraME').addClass("col-md-6") 
    }
}


function SeleccionarCliente(cliente){
    $("#Nro_DocumentoBuscar").val(cliente.Nro_Documento)
    $("#txtNombreCliente").val(cliente.Cliente)
    $("#txtNombreCliente").attr("data-id",cliente.Id_ClienteProveedor)
}

function GuardarCompraVentaME(){
    
}

function GuardarNuevoCliente(){
    if(ValidacionCampos("modal_error","modal_form")){
        H5_loading.show();
        var Cod_TipoDocumento = $("#Cod_TipoDocumento").val()
        var Nro_Documento = $("#Nro_Documento").val()
        var Cliente = $("#Cliente").val()
        var DireccioN = $("#DireccioN").val()
        var Email1 = $("#Email1").val()
        var Telefono1 = $("#Telefono1").val()
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                Cod_TipoDocumento,
                Nro_Documento,
                Cliente,
                DireccioN,
                Email1,
                Telefono1
            })
        }
        fetch(URL+'/clientes_api/guardar_cliente_2', parametros)
        .then(req => req.json())
        .then(res => {
            console.log(res)
            if (res.respuesta == 'ok') {               
                $('#modal-superior').modal('hide')
            }
            else{

            }
            H5_loading.hide()
        })
    }
}

function BusquedaClienteModal(e){
    var txtBuscarCliente = $("#txtBuscarCliente").val()
    if(txtBuscarCliente.length>4){
        if ($('input[name=optionsRadiosBuscar]:checked').val() == 'nombre') {
            var Cliente = txtBuscarCliente
            const parametros = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Cliente
                })
            }
            fetch(URL+'/clientes_api/get_cliente_by_nombre', parametros)
            .then(req => req.json())
            .then(res => {
                console.log(res)
                if (res.respuesta == 'ok') {
                    var clientes = res.data.cliente
                    if(clientes.length > 0)
                        AgregarTabla(clientes)
                    else  
                        empty(document.getElementById('contenedorTablaClientes'));
                }
                else
                    empty(document.getElementById('contenedorTablaClientes'));
            })
        }else{
            var Nro_Documento = txtBuscarCliente
            var Cod_TipoDocumento = ''
            const parametros = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Nro_Documento,
                    Cod_TipoDocumento
                })
            }
            fetch(URL+'/clientes_api/get_cliente_by_documento', parametros)
            .then(req => req.json())
            .then(res => {
                if (res.respuesta == 'ok') {
                    var clientes = res.data.cliente
                    if(clientes.length > 0)
                        AgregarTabla(clientes)
                    else  
                        empty(document.getElementById('contenedorTablaClientes'));
                }
                else
                    empty(document.getElementById('contenedorTablaClientes'));
            })
        }
    }
}



function NuevoCliente(variables){
    VerNuevoCliente(variables)
}

function BuscarCliente(variables){
    VerBuscarCliente(variables)
}

function NuevoCompraVentaME(_escritura, caja) {
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
                TraerSiguienteNumeroComprobante(_escritura, res.data.comprobante_caja[0].Serie)
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
                Ver(_escritura, Serie,variables) 
                //TraerCuentaBancariaEntidadFinanciera(_escritura, Serie, variables)
            }
            else { 
            }
            H5_loading.hide()
        })
}

function TraerCuentaBancariaEntidadFinanciera(Cod_EntidadFinaciera) {
    var Cod_EntidadFinaciera = Cod_EntidadFinaciera
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

                console.log(variables);
                Ver(_escritura, Serie,variables)
            }
            else {
            }
            H5_loading.hide()
        })
}


export { NuevoCompraVentaME }