var empty = require('empty-element');
var yo = require('yo-yo');

import { URL } from '../../../constantes_entorno/constantes'

function Ver(_escritura, variables,fecha_actual) {
    var el = yo`
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h4 class="modal-title"><strong>Transferencias entre cajas</strong></h4>
                </div>
                <div class="modal-body"  id="modal_form">
                    <div class="row">
                        <div id="modal_error" class="callout callout-danger hidden">
                            <p> Es necesario llenar los campos marcados con rojo</p>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="Cod_Cajero">Cajero</label>
                                <input type="text" class="form-control required" id="Cod_Cajero" value="ADMINISTRADOR">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="Cod_Caja">Caja</label>
                                <select class="form-control" id="Cod_CajaOrigen">
                                   
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="Fecha">Fecha</label>
                                <input type="date" class="form-control required" id="Fecha" placeholder='dd/mm/aaaa' value=${fecha_actual}>
                            </div>
                        </div>
                    </div>


                    <div class="row">
                        <div class="panel panel-default">
                            <div class="panel-heading">Destino y Monto</div>
                            <div class="panel-body">
                                <div class="row">
                                    <div class="col-md-3">
                                        <div class="radio">
                                            <label>
                                                <input type="radio" value="b" id="optEnvios" name="optEnvios" onclick=${()=>CambioRadios()}> Banco
                                            </label>
                                        </div>
                                    </div>

                                    <div class="col-md-9" id="formBanco" style="display:none"> 
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <select class="form-control" id="Cod_Cuenta_Bancaria">
                                                    ${variables.cuentas_bancarias.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_CuentaBancaria}">${e.Des_CuentaBancaria}</option>`)}
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label class="sr-only" for="NroOperacion">Nro Op.</label>
                                                <input type="text" class="form-control" id="NroOperacion">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-3">
                                        <div class="radio">
                                            <label>
                                                <input type="radio" value="c" id="optEnvios" name="optEnvios" checked onclick=${()=>CambioRadios()}> Caja
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col-md-9" id="formCaja">
                                        <div class="form-group">
                                            <select class="form-control required" id="Cod_CajaDestino">
                                                ${variables.cajas_diferentes.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_Caja}">${e.Des_Caja}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                    
                                <div class="row">
                                    <div class="col-md-3">
                                        <div class="form-group">
                                            <label for="Cod_Producto">Moneda</label>
                                            <select class="form-control" id="Cod_Moneda">\
                                                ${variables.monedas.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_Moneda}">${e.Nom_Moneda}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="Cod_Producto">Monto</label>
                                            <input type="number" class="form-control required" id="Monto" onkeypress=${()=>CalcularITF()}>
                                        </div>
                                    </div>
                                    <div class="col-md-3 text-center" id="formBancoITF" style="display:none">
                                        <div class="checkbox">
                                            <label>
                                                <input type="checkbox" id="optITF" name="optITF" onclick=${()=>CalcularITF()}> Con ITF? 0.005%
                                            </label>
                                        </div>
                                    </div>

                                </div>
                                
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="Comentario">Comentario</label>
                                            <textarea type="text" style="text-transform:uppercase" class="form-control" id="Comentario" placeholder="Ingrese un comentario"></textarea>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>

                </div>
                <div class="modal-footer text-center"> 
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-info" id="btnGuardar" onclick=${()=>GuardarEnvio(variables)}>Guardar</button>
                </div>
            </div>
        </div>`

    var modal_proceso = document.getElementById('modal-proceso');
    empty(modal_proceso).appendChild(el);
    $('#modal-proceso').modal()
}

function CalcularITF(){
    $("#optITF").attr("data-value","")
    if($("#optITF").is(":checked")){
        if($.trim($("#Monto").val()).length>0){
            var ITF = parseFloat($("#Monto").val()) * 0.00005
            $("#optITF").attr("data-value",ITF.toString()+".000")
            if(parseInt($("#optITF").attr("data-value").substring($("#optITF").attr("data-value").length - 2, 1)) >= 5){
                $("#optITF").attr("data-value",$("#optITF").attr("data-value").substring(0,$("#optITF").attr("data-value").length - 2)+"5")
            }else{
                $("#optITF").attr("data-value",$("#optITF").attr("data-value").substring(0,$("#optITF").attr("data-value").length - 2)+"0")
            }
        }
    }
}
 

function CambioRadios(){
    if ($('input[name=optEnvios]:checked').val() == 'b') {
        $("#formBanco").show()
        $("#formBancoITF").show()
        $("#formCaja").hide()
        $("#Cod_CajaDestino").removeClass("required")
        $("#Cod_Cuenta_Bancaria").addClass("required")
        $("#NroOperacion").addClass("required")
    }else{
        $("#formBanco").hide()
        $("#formBancoITF").hide()
        $("#formCaja").show()
        $("#Cod_CajaDestino").addClass("required")
        $("#Cod_Cuenta_Bancaria").removeClass("required")
        $("#NroOperacion").removeClass("required")
    }
}


function GuardarEnvio(variables){
    if(ValidacionCampos("modal_error","modal_form")){

        H5_loading.show();
        var Cod_Caja = '100'//caja.Cod_Caja
        var Cod_Turno = 'T0002'
        var Id_Concepto = 11000
        var Id_ClienteProveedor = 0
        var Cliente = null
        var ClienteMov = null
        if($('input[name=optEnvios]:checked').val()=="b"){
            Cliente = $("#Cod_Cuenta_Bancaria").text()
            ClienteMov = "PARA : " + $("#Cod_Cuenta_Bancaria").text() + " : " + $("#NroOperacion").val() + " , " + $("#Comentario").val()
        }else{
            Cliente = $("#Cod_CajaDestino").text()
            ClienteMov = "PARA : " + $("#Cod_CajaDestino").text() + " , " + $("#Comentario").val()
        }
        var Des_Movimiento = ClienteMov
        var Fecha = $("#Fecha").val()
        var Cod_MonedaEgr = $("#Cod_Moneda").val()
        var Cod_MonedaIng = $("#Cod_Moneda").val()
        var Fecha_Aut = $("#Fecha").val()
        var Serie = variables.serie[0].Serie
        var Tipo_Cambio = 1
        var Ingreso = 0
        var Egreso = $("#Monto").val()
        var Flag_Extornado = 0
        var Id_MovimientoRef = 14

        if ($('input[name=optEnvios]:checked').val() == 'c') {
            
            GuardarMovEgresoCaja(Cod_Caja,Cod_Turno,Id_Concepto,Id_ClienteProveedor,Cliente,Des_Movimiento,Fecha,Cod_MonedaEgr,Cod_MonedaIng,Fecha_Aut,Serie,Tipo_Cambio,Ingreso,Egreso,Flag_Extornado,Id_MovimientoRef, variables)
             
        }else{
            
            GuardarMovEgresoBanco(Cod_Caja,Cod_Turno,Id_Concepto,Id_ClienteProveedor,Cliente,Des_Movimiento,Fecha,Cod_MonedaEgr,Cod_MonedaIng,Fecha_Aut,Serie,Tipo_Cambio,Ingreso,Egreso,Flag_Extornado,Id_MovimientoRef, variables)
             
        }
                    
    }
}


function GuardarMovEgresoBanco(Cod_Caja,Cod_Turno,Id_Concepto,Id_ClienteProveedor,Cliente,Des_Movimiento,Fecha,Cod_MonedaEgr,Cod_MonedaIng,Fecha_Aut,Serie,Tipo_Cambio,Ingreso,Egreso,Flag_Extornado,Id_MovimientosRef, variables){
       
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            Cod_Caja,
            Cod_Turno,
            Id_Concepto,
            Id_ClienteProveedor,
            Cliente,
            Des_Movimiento,
            Fecha,
            Cod_MonedaEgr,
            Fecha_Aut,
            Serie,
            Tipo_Cambio,
            Ingreso,
            Egreso,
            Flag_Extornado
        })
    }
    fetch(URL + '/envios_api/guardar_movimientos', parametros)
        .then(req => req.json())
        .then(res => { 
            if (res.respuesta == 'ok') {
                GuardarMovCuentaBancaria(variables)
            }
            else {  
                H5_loading.hide() 
            }
        })
}


function GuardarMovCuentaBancaria(variables){
    var Id_MovimientoCuenta = -1
    var Cod_Cuenta_Bancaria=$("#Cod_Cuenta_Bancaria").text()
    var Nro_Operacion = $("#NroOperacion").val()
    var Des_Movimiento='DEPOSITO EN EFECTIVO'
    var Cod_TipoOperacionBancaria='001'
    var Fecha = $("#Fecha").val()
    var Monto = $("#Monto").val()
    var TipoCambio = 1
    var Cod_Caja = '100'
    var Cod_Turno = 'T0002'
    var Nro_Cheque = ''
    var Beneficiario = ''
    var Id_ComprobantePago = 0
    var Obs_Movimiento = $("#Comentario").val()
    var Cod_Plantilla=null
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            Id_MovimientoCuenta,
            Cod_Cuenta_Bancaria,
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
            Obs_Movimiento
        })
    }
    fetch(URL + '/envios_api/guardar_movimientos_cuenta_bancaria', parametros)
        .then(req => req.json())
        .then(res => {
            console.log(res)
            if (res.respuesta == 'ok') {
                if($("#optITF").is(":checked")){
                    Id_MovimientoCuenta = 0
                    Des_Movimiento='IMPUESTO ITF'
                    Monto = -1 * parseFloat($("#optITF").attr("data-value"))
                    Cod_TipoOperacionBancaria = '004'
                    Nro_Operacion = parseInt($("#NroOperacion").val())+1

                    const parametros = {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        credentials: 'same-origin',
                        body: JSON.stringify({
                            Id_MovimientoCuenta,
                            Cod_Cuenta_Bancaria,
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
                            Obs_Movimiento
                        })
                    }

                    fetch(URL + '/envios_api/guardar_movimientos_cuenta_bancaria', parametros)
                    .then(req => req.json())
                    .then(res => { 
                        if (res.respuesta == 'ok') {
                            $('#modal-proceso').modal('hide')
                            H5_loading.hide()
                        }
                        else {  
                            H5_loading.hide() 
                        }
                    })

                }else{
                    $('#modal-proceso').modal('hide')
                    H5_loading.hide()
                } 
            }
            else {  
                H5_loading.hide() 
            }
        })
}


function GuardarMovEgresoCaja(Cod_Caja,Cod_Turno,Id_Concepto,Id_ClienteProveedor,Cliente,Des_Movimiento,Fecha,Cod_MonedaEgr,Cod_MonedaIng,Fecha_Aut,Serie,Tipo_Cambio,Ingreso,Egreso,Flag_Extornado,Id_MovimientosRef, variables){
       
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                Cod_Caja,
                Cod_Turno,
                Id_Concepto,
                Id_ClienteProveedor,
                Cliente,
                Des_Movimiento,
                Fecha,
                Cod_MonedaEgr,
                Fecha_Aut,
                Serie,
                Tipo_Cambio,
                Ingreso,
                Egreso,
                Flag_Extornado
            })
        }
        fetch(URL + '/envios_api/guardar_movimientos', parametros)
            .then(req => req.json())
            .then(res => { 
                if (res.respuesta == 'ok') {
                    Cod_Caja = $("#Cod_CajaDestino").val()
                    Cod_Turno = 'T0002'
                    Id_Concepto = 11000
                    Id_ClienteProveedor = 0
                    Cliente =  $("#Cod_CajaOrigen").text() 
                    Des_Movimiento = "DE : "+$("#Cod_CajaOrigen").text()+","+$("#Comentario").val()
                    Fecha = $("#Fecha").val()
                    Cod_MonedaEgr = $("#Cod_Moneda").val()
                    Cod_MonedaIng = $("#Cod_Moneda").val()
                    Fecha_Aut = $("#Fecha").val()
                    Serie = variables.serie[0].Serie
                    Tipo_Cambio = 1
                    Ingreso = $("#Monto").val()
                    Egreso = 0
                    Flag_Extornado = 0
                    GuardarMovIngresoCaja(Cod_Caja,Cod_Turno,Id_Concepto,Id_ClienteProveedor,Cliente,Des_Movimiento,Fecha,Cod_MonedaEgr,Cod_MonedaIng,Fecha_Aut,Serie,Tipo_Cambio,Ingreso,Egreso,Flag_Extornado,Id_MovimientosRef, variables)
                }
                else {  
                    H5_loading.hide() 
                }
            })
}

function GuardarMovIngresoCaja(Cod_Caja,Cod_Turno,Id_Concepto,Id_ClienteProveedor,Cliente,Des_Movimiento,Fecha,Cod_MonedaEgr,Cod_MonedaIng,Fecha_Aut,Serie,Tipo_Cambio,Ingreso,Egreso,Flag_Extornado,Id_MovimientosRef, variables){
       
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            Cod_Caja,
            Cod_Turno,
            Id_Concepto,
            Id_ClienteProveedor,
            Cliente,
            Des_Movimiento,
            Fecha,
            Cod_MonedaEgr,
            Fecha_Aut,
            Serie,
            Tipo_Cambio,
            Ingreso,
            Egreso,
            Flag_Extornado
        })
    }
    fetch(URL + '/envios_api/guardar_movimientos', parametros)
        .then(req => req.json())
        .then(res => {
            console.log(res)
            if (res.respuesta == 'ok') {
                $('#modal-proceso').modal('hide')
                H5_loading.hide() 
            }
            else {  
                H5_loading.hide() 
            }
        })
}



function NuevoEnvioEfectivo(_escritura, caja) {
    H5_loading.show();
    var Cod_Caja = '100'//caja.Cod_Caja
    var Cod_Sucursal = '0001'
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            Cod_Caja,
            Cod_Sucursal
        })
    }
    fetch(URL + '/envios_api/get_cajas_envios', parametros)
        .then(req => req.json())
        .then(res => {
            var variables = res.data
            console.log(variables)
            if (res.respuesta == 'ok') {
                const fecha = new Date()
                const mes = fecha.getMonth() + 1
                const dia = fecha.getDate()
                var fecha_format = fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)
                Ver(_escritura, variables,fecha_format)
            }
            else { 
            }
            H5_loading.hide()
        })
}



export { NuevoEnvioEfectivo }