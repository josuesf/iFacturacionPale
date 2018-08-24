var empty = require('empty-element');
var yo = require('yo-yo');

import { URL } from '../../../constantes_entorno/constantes'
import { refrescar_movimientos } from '../../movimientos_caja'
import { NuevoCliente,BuscarCliente } from '../../modales'

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
                <div class="modal-body" id="modal_form">
                    <div class="row">
                        <div id="modal_error" class="callout callout-danger hidden">
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
                                                <select class="form-control" id="Cod_TipoDocumentoBuscar" onchange=${()=>CambioClienteDoc()}>
                                                    ${variables.tipos_documento.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_TipoDoc}">${e.Nom_TipoDoc}</option>`)}
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="input-group">
                                                <input type="text" class="form-control" id="Nro_DocumentoBuscar" onblur=${()=>RecuperarDatosClientePorNroDoc()}>
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
                                                    <button type="button" class="btn btn-success" id="AgregarCliente" onclick=${()=>NuevoCliente(variables.tipos_documento)}><i class="fa fa-plus"></i></button>
                                                </div>
                                                <input type="text" class="form-control" id="txtNombreCliente">
                                                <div class="input-group-btn">
                                                    <button type="button" class="btn btn-info" id="BuscarCliente" onclick=${()=>BuscarCliente("txtNombreCliente","Nro_DocumentoBuscar","002")}><i class="fa fa-search"></i></button>
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
                                                <select class="form-control required" id="Cod_Moneda">
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




function LlenarCuenta(cuenta,idSelect){
    var el = yo`
        ${cuenta.map(e => yo`
             <option value="${e.Cod_CuentaBancaria}">${e.Des_CuentaBancaria}</option>
        `)}`   
    $("#"+idSelect).html('')
    $("#"+idSelect).html(el)
}


var Id_ClienteProveedor = null

function CambioClienteDoc(){
    if($("#Cod_TipoDocumentoBuscar").val()=="1" || $("#Cod_TipoDocumentoBuscar").val()=="6"){
        $("#Nro_DocumentoBuscar").addClass("required")
        $("#Nro_DocumentoBuscar").css("border-color","red");
    }else{
        $("#Nro_DocumentoBuscar").css("border-color","");
        $("#Nro_DocumentoBuscar").removeClass("required",false)
    }
}


function CambioSoles(){ 
    $("#Soles").val(parseFloat($("#Monto").val())*parseFloat($("#TipoCambio").val()))
}

function CambioMonto(){
    $("#Monto").val(parseFloat($("#Soles").val())/parseFloat($("#TipoCambio").val()))
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


function RecuperarDatosClientePorNroDoc(){
    if($("#Nro_DocumentoBuscar").val().trim().length>0){
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
                BuscarCliente("txtNombreCliente","Nro_DocumentoBuscar","002")
            }
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
        });
    }
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
    if(ValidacionCampos("modal_error","modal_form")){
        run_waitMe($('#modal-proceso'), 1, "ios","Registrando operación...");
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
            console.log(parametros)
            fetch(URL+'/compra_venta_moneda_extranjera_api/guardar_compra_venta_me', parametros)
            .then(req => req.json())
            .then(res => {
                $('#modal-proceso').modal('hide')
                $('#modal-proceso').waitMe('hide');
                if (res.respuesta == 'ok') {               
                    toastr.success('Se registro correctamente el movimiento','Confirmacion',{timeOut: 5000}) 
                    refrescar_movimientos()
                }
                else{
                    toastr.error('No se pudo registrar correctamente el movimiento','Error',{timeOut: 5000}) 
                }
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#modal-proceso').waitMe('hide');
            });
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
                        $('#modal-proceso').waitMe('hide');
                        if (res.respuesta == 'ok') {             
                            toastr.success('Se registro correctamente el movimiento','Confirmacion',{timeOut: 5000}) 
                            refrescar_movimientos()
                        }
                        else{
                            toastr.error('No se pudo registrar correctamente el movimiento','Error',{timeOut: 5000}) 
                        }
                    }).catch(function (e) {
                        console.log(e);
                        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                        $('#modal-proceso').waitMe('hide');
                    });
        

                }
                else{
                    toastr.error('No se pudo registrar correctamente el movimiento','Error',{timeOut: 5000})  
                }
                $('#modal-proceso').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#modal-proceso').waitMe('hide');
            });

        }
    }
}
 
function NuevoCompraVentaME(_escritura, caja) { 
    run_waitMe($('#main-contenido'), 1, "ios");
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
            console.log(res)
            if (res.respuesta == 'ok') {
                if(res.data.comprobante_caja.length>0)
                    TraerSiguienteNumeroComprobante(_escritura, res.data.comprobante_caja[0].Serie)
                else  
                    TraerSiguienteNumeroComprobante(_escritura,'') 

            }
            else {
                $('#main-contenido').waitMe('hide');
            }
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
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
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
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
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
}


export { NuevoCompraVentaME }