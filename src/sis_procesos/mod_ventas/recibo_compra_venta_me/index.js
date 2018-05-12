var empty = require('empty-element');
var yo = require('yo-yo');

import { URL } from '../../../constantes_entorno/constantes'
import { refrescar_movimientos } from '../../movimientos_caja'

function Ver(_escritura, Serie, variables,fecha_actual) {
    var el = yo`
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h4 class="modal-title"><strong id="tituloModal">Compra ME</strong></h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="callout callout-danger hidden" id="divErrors">
                            <p>Es necesario llenar todos los campos requeridos y el Importe mayor a cero</p>
                        </div>
                    </div>
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
                                                <input type="text" class="form-control" id="Nro_DocumentoBuscar" onblur=${()=>BusquedaClientePorNroDoc(variables)}>
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
                                                    <button type="button" class="btn btn-success" id="AgregarCliente" onclick=${()=>VerNuevoCliente(variables)}><i class="fa fa-plus"></i></button>
                                                </div>
                                                <input type="text" class="form-control" id="txtNombreCliente">
                                                <div class="input-group-btn">
                                                    <button type="button" class="btn btn-info" id="BuscarCliente" onclick=${()=>VerBuscarCliente(variables)}><i class="fa fa-search"></i></button>
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
                                                <input type="text" class="form-control" id="Numero" value="00000000${variables.siguiente_numero_comprobante[0].Numero}">
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
                                <input type="date" class="form-control" id="Fecha" placeholder='dd/mm/aaaa' value="${fecha_actual}">
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
                                        <div class="col-md-6"> 
                                             
                                            <div class="col-md-12" id="formBanco" style="display:none">
                                                <div class="form-group">
                                                    <label for="Cod_Producto">Banco</label>
                                                    <select class="form-control" id="SelectEntidadFinanciera" onchange=${()=>TraerCuentaBancariaEntidadFinanciera()}>
                                                        ${variables.entidades_financieras.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_EntidadFinanciera}">${e.Nom_EntidadFinanciera}</option>`)}
                                                    </select>
                                                </div>
                                                <div class="form-group">
                                                    <label for="Cod_CuentaSoles">Cuenta Soles</label>
                                                    <select class="form-control" id="Cod_CuentaSoles">
                                                    </select>
                                                </div>
                                                <div class="form-group">
                                                    <label for="Cod_CuentaME">Cuenta ME</label>
                                                    <select class="form-control" id="Cod_CuentaME">
                                                    </select>
                                                </div>
                                                <div class="form-group">
                                                    <label for="Operacion">Operacion</label>
                                                    <input type="text" class="form-control" id="Operacion">
                                                </div>
                                            </div>
                                            
                                            <div class="col-md-12"> 
                                                <div class="form-group" id="obs_body_xml">
                                                  
                                                </div>
                                            </div>

                                        </div>
                                        <div class="col-md-6" id="formVentaCompraME">
                                            <label>Tipo de Operacion</label>
                                            <div class="col-sm-12">
                                                <div class="col-sm-6">
                                                        <label class="radio-inline">
                                                            <input type="radio" id="optionCV" name="optionCV" value="c"  onclick="${() => CambioCompraVentaME()}" checked> Compra ME
                                                        </label> 
                                                </div>
                                                <div class="col-sm-6">
                                                        <label class="radio-inline">
                                                            <input type="radio" id="optionCV" name="optionCV" value="v" onclick="${() => CambioCompraVentaME()}"> Venta ME
                                                        </label>
                                                </div>
                                            </div> 
                                            <br><br><br>
                                            <div class="form-group">
                                                <label for="Cod_Moneda">Moneda</label>
                                                <select class="form-control" id="Cod_Moneda">
                                                    ${variables.monedas_sinsoles.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_Moneda}">${e.Nom_Moneda}</option>`)}
                                                </select>
                                            </div>
                                            <div class="form-group">
                                                <label for="Monto">Monto</label>
                                                <input type="number" class="form-control required" id="Monto" onkeypress=${()=>CambioSoles()}>
                                            </div>
                                            <div class="form-group">
                                                <label for="TipoCambio">Tipo de Cambio</label>
                                                <input type="number" class="form-control required" id="TipoCambio" onkeypress=${()=>CambioSoles()}>
                                            </div>
                                            <div class="form-group">
                                                <label for="Soles">Soles</label>
                                                <input type="number" class="form-control required" id="Soles" onkeypress=${()=>CambioMonto()}>
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
                    <button type="button" class="btn btn-info" id="btnGuardar" onclick=${()=>GuardarCompraVentaME(variables,fecha_actual)}>Guardar</button>
                </div>
            </div>
        </div>`

    var modal_proceso = document.getElementById('modal-proceso')
    empty(modal_proceso).appendChild(el)
    $('#modal-proceso').modal()
    TraerCuentaBancariaEntidadFinanciera()
    ObservacionesXML(variables.diagramas)
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
                                <label for="Cliente_NC">Nombre Completo *</label>
                                <input type="text"  class="form-control required" id="Cliente_NC">
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

function LlenarCuenta(cuenta,idSelect){
    var el = yo`
        ${cuenta.map(e => yo`
             <option value="${e.Cod_CuentaBancaria}">${e.Des_CuentaBancaria}</option>
        `)}`   
    $("#"+idSelect).html('')
    $("#"+idSelect).html(el)
}


var Id_ClienteProveedor = null

function CambioSoles(){ 
    $("#Soles").val(parseFloat($("#Monto").val())*parseFloat($("#TipoCambio").val()))
}

function CambioMonto(){
    $("#Monto").val(parseFloat($("#Soles").val())/parseFloat($("#TipoCambio").val()))
}

function BusquedaClientePorNroDoc(variables,event) { 
   RecuperarDatosClientePorNroDoc(variables) 
}

function getValueXML(xmlDoc, TAG) {
    if (xmlDoc.getElementsByTagName(TAG).length > 0 && xmlDoc.getElementsByTagName(TAG)[0].childNodes.length > 0) {
        return xmlDoc.getElementsByTagName(TAG)[0].childNodes[0].nodeValue
    } else {
        return ''
    }
}

function ObservacionesXML(diagrama) {
    var xml = ''
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xml, "text/xml");
    var el = yo`<div> 
        ${diagrama.map(e => yo`
        <div class="row">
            <div class="col-sm-12">
                <div class="form-group">
                    <label for="">${e.Nom_Elemento}</label>
                    <input id="${e.Cod_Elemento}"
                    value=${getValueXML(xmlDoc, e.Cod_Elemento)}
                    class="form-control" />
                </div>
            </div>
        </div>`)}
    </div>`;
    var obs_xml = document.getElementById('obs_body_xml')
    empty(obs_xml).appendChild(el) 
}


function RecuperarDatosClientePorNroDoc(variables){
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
        if (res.respuesta == 'ok') {
            $("#txtNombreCliente").val(res.data.cliente[0].Cliente)
            $("#txtNombreCliente").focus()
            Id_ClienteProveedor = res.data.cliente[0].Id_ClienteProveedor
        }
        else{
            VerBuscarCliente(variables)
            $("#txtBuscarCliente").val($("#txtNombreCliente").val())
        }
    })
}

function RecuperarDatosClientePorNombre(variables){
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
    })
}


function CambioTipoDestino() {
    if ($('input[name=TipoDestino]:checked').val() == 'c') {
        $('#formBanco').hide() 
    } else {
        $('#formBanco').show()
    }
}

function CambioCompraVentaME() {
    if ($('input[name=optionCV]:checked').val() == 'c') {
        $('#tituloModal').text("Compra ME") 
    } else {
        $('#tituloModal').text("Venta ME")
    }
}


function SeleccionarCliente(cliente){
    $("#Nro_DocumentoBuscar").val(cliente.Nro_Documento)
    $("#txtNombreCliente").val(cliente.Cliente)
    Id_ClienteProveedor =  cliente.Id_ClienteProveedor
}

function GuardarCompraVentaME(variables,fecha_actual){
    if(ValidacionCampos()){
        H5_loading.show()
        if ($('input[name=TipoDestino]:checked').val() == 'c') {
            var OBS = '<Registro>'
            for (var i = 0; i < variables.diagramas.length; i++) {
                OBS += '<' + variables.diagramas[i].Cod_Elemento + '>' + document.getElementById(variables.diagramas[i].Cod_Elemento).value + '</' + variables.diagramas[i].Cod_Elemento + '>'
            }
            var Obs_Movimiento = OBS+'</Registro>'
            var Des_Movimiento = null         
            var id_Movimiento = -1
            var Cod_Caja = '100'
            var Cod_Turno = 'T0002'
            var Id_Concepto = 3000 
            var Cliente = $("#txtNombreCliente").val()
            var _nom_moneda = $("#Cod_Moneda").val() == "USD" ? "DOLARES" : "EUROS";
            
            var Cod_TipoComprobante = 'CV'
            var Serie = $("#Serie").val()
            var Numero = $("#Numero").val()
            var Fecha = fecha_actual
            var Tipo_Cambio = $("#TipoCambio").val()
            var Ingreso = null
            var Cod_MonedaIng = null
            var Egreso = null
            var Cod_MonedaEgr = null
            var Flag_Extornado = 0
            var Fecha_Aut = fecha_actual
            var Id_MovimientoRef=0

            if ($('input[name=optionCV]:checked').val() == 'c') {
                Des_Movimiento = "Compra ME " +_nom_moneda + " : " +
                parseFloat($("#Monto").val()).toFixed(2) + " T/C: " + parseFloat($("#TipoCambio").val()).toFixed(3) + " SOLES: " + parseFloat($("#Soles").val()).toFixed(3);
                Ingreso = parseFloat($("#Monto").val()).toFixed(3)
                Cod_MonedaIng = $("#Cod_Moneda").val()
                Egreso = $("#Soles").val()
                Cod_MonedaEgr = 'PEN'
            }else{
                Des_Movimiento = "Venta ME " +_nom_moneda + " : " +
                parseFloat($("#Monto").val()).toFixed(2) + " T/C: " + parseFloat($("#TipoCambio").val()).toFixed(2) + " SOLES: " + parseFloat($("#Soles").val()).toFixed(2);
                Ingreso = parseFloat($("#Soles").val()).toFixed(3)
                Cod_MonedaIng = 'PEN'
                Egreso = $("#Monto").val()
                Cod_MonedaEgr = $("#Cod_Moneda").val()
            }

            const parametros = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    id_Movimiento,
                    Cod_Caja,
                    Cod_Turno,
                    Id_Concepto,
                    Id_ClienteProveedor,
                    Cliente,
                    Des_Movimiento,
                    Cod_TipoComprobante,
                    Serie,
                    Numero,
                    Fecha,
                    Tipo_Cambio,
                    Ingreso,
                    Cod_MonedaIng,
                    Egreso,
                    Cod_MonedaEgr,
                    Flag_Extornado,
                    Fecha_Aut,
                    Obs_Movimiento,
                    Id_MovimientoRef
                })
            }
            fetch(URL+'/compra_venta_moneda_extranjera_api/guardar_compra_venta_me', parametros)
            .then(req => req.json())
            .then(res => {
                $('#modal-proceso').modal('hide')
                H5_loading.hide()
                if (res.respuesta == 'ok') {               
                    toastr.success('Se registro correctamente el movimiento','Confirmacion',{timeOut: 5000}) 
                    refrescar_movimientos()
                }
                else{
                    toastr.error('No se pudo registrar correctamente el movimiento','Error',{timeOut: 5000}) 
                }
            })
        }else{
            var OBS = '<Registro>'
            for (var i = 0; i < variables.diagramas.length; i++) {
                OBS += '<' + variables.diagramas[i].Cod_Elemento + '>' + document.getElementById(variables.diagramas[i].Cod_Elemento).value + '</' + variables.diagramas[i].Cod_Elemento + '>'
            }
            var Obs_Movimiento = OBS+'</Registro>'
            var Id_MovimientoCuenta = -1
            var Cod_CuentaBancaria = null
            var Nro_Operacion = $("#Operacion").val()
            var Des_Movimiento='SALIDA: COMPRA/VENTA DE MONEDA EXTRANJERA BANCOS'
            var Cod_TipoOperacionBancaria='010'
            var Fecha = $("#Fecha").val()
            var Monto = null
            var TipoCambio = $("#TipoCambio").val()
            var Cod_Caja = '100'
            var Cod_Turno = 'T0002'
            var Cod_Plantilla=''
            var Nro_Cheque=''
            var Beneficiario=''
            var Id_ComprobantePago=0
            if ($('input[name=optionCV]:checked').val() == 'c') {
                Cod_CuentaBancaria = $("#Cod_CuentaSoles").val()
                Monto = -1 * parseFloat($("#Soles").val())
            }else{
                Cod_CuentaBancaria = $("#Cod_CuentaME").val()
                Monto = -1 * parseFloat($("#Monto").val())
            }

            const parametros = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    Id_MovimientoCuenta,
                    Cod_CuentaBancaria,
                    Nro_Operacion,
                    Des_Movimiento,
                    Cod_TipoOperacionBancaria,
                    Fecha,
                    Monto,
                    TipoCambio,
                    Cod_Caja,
                    Cod_Turno,
                    Cod_Plantilla,
                    Nro_Cheque,
                    Beneficiario,
                    Id_ComprobantePago,
                    Obs_Movimiento,
                })
            }
            fetch(URL+'/compra_venta_moneda_extranjera_api/guardar_cuenta_bancaria_compra_venta_me', parametros)
            .then(req => req.json())
            .then(res => {
                if (res.respuesta == 'ok') {               
                    //$('#modal-superior').modal('hide')
                    if ($('input[name=optionCV]:checked').val() == 'c') {
                        Cod_CuentaBancaria = $("#Cod_CuentaME").val()
                        Monto = -1 * parseFloat($("#Monto").val())
                    }else{
                        Cod_CuentaBancaria = $("#Cod_CuentaSoles").val()
                        Monto = -1 * parseFloat($("#Soles").val())
                    }


                    const parametros = {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        credentials: 'same-origin',
                        body: JSON.stringify({
                            Id_MovimientoCuenta,
                            Cod_CuentaBancaria,
                            Nro_Operacion,
                            Des_Movimiento,
                            Cod_TipoOperacionBancaria,
                            Fecha,
                            Monto,
                            TipoCambio,
                            Cod_Caja,
                            Cod_Turno,
                            Cod_Plantilla,
                            Nro_Cheque,
                            Beneficiario,
                            Id_ComprobantePago,
                            Obs_Movimiento,
                        })
                    }
                    fetch(URL+'/compra_venta_moneda_extranjera_api/guardar_cuenta_bancaria_compra_venta_me', parametros)
                    .then(req => req.json())
                    .then(res => {
                        $('#modal-proceso').modal('hide')
                        H5_loading.hide()
                        if (res.respuesta == 'ok') {             
                            toastr.success('Se registro correctamente el movimiento','Confirmacion',{timeOut: 5000}) 
                            refrescar_movimientos()
                        }
                        else{
                            toastr.error('No se pudo registrar correctamente el movimiento','Error',{timeOut: 5000}) 
                        }
                    })
        

                }
                else{
                    toastr.error('No se pudo registrar correctamente el movimiento','Error',{timeOut: 5000})  
                }
                H5_loading.hide()
            })

        }
    }
}

function GuardarNuevoCliente(){
    if(ValidacionCampos("modal_error","modal_form")){
        H5_loading.show();
        var Cod_TipoDocumento = $("#Cod_TipoDocumento").val()
        var Nro_Documento = $("#Nro_Documento").val()
        var Cliente = $("#Cliente_NC").val()
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
                TraerSiguienteNumeroComprobante(_escritura, res.data.comprobante_caja[0].Serie==undefined?0:res.data.comprobante_caja[0].Serie)
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

                const fecha = new Date()
                const mes = fecha.getMonth() + 1
                const dia = fecha.getDate()
                var fecha_format = fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)

                Ver(_escritura, Serie,variables,fecha_format)  
            }
            else { 
            }
            H5_loading.hide()
        })
}



function TraerCuentaBancariaEntidadFinanciera() {
    var Cod_EntidadFinanciera = $("#SelectEntidadFinanciera").val() 
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Cod_EntidadFinanciera
        })
    }
    fetch(URL + '/compra_venta_moneda_extranjera_api/get_cuenta_bancaria_by_entidad_financiera', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                LlenarCuenta(res.data.cuenta_bancaria_pen,"Cod_CuentaSoles")
                LlenarCuenta(res.data.cuenta_bancaria_usd,"Cod_CuentaME")
            }
            else {
            }
            H5_loading.hide()
        })
}


export { NuevoCompraVentaME }