 var empty = require('empty-element');
var yo = require('yo-yo');

import { URL } from '../../../constantes_entorno/constantes'
import { refrescar_movimientos } from '../../movimientos_caja'


function Ver(_escritura, variables,fecha_actual,caja_actual) {
    var el = yo`
        <div class="modal-dialog ">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h4 class="modal-title"><strong>Transferencias entre cajas</strong></h4>
                </div>
                <div class="modal-body"  id="modal_form">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="row">
                                <div id="modal_error" class="alert alert-callout alert-danger hidden">
                                    <p> Es necesario llenar los campos marcados con rojo</p>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="Cajero">Cajero</label>
                                        <h4 type="text" class="form-control" id="Cajero"></h4>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="Cod_CajaOrigen">Caja</label>
                                        <select class="form-control" id="Cod_CajaOrigen" disabled>
                                            ${variables.cajas.map(e => yo`
                                                <option value="${e.Cod_Caja}" ${e.Cod_Caja == caja_actual.Cod_Caja ? 'selected' : ''}>${e.Des_Caja}</option>
                                            `)}
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
    $('#Cajero').text($('p#nick').text())
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

        run_waitMe($('#modal-proceso'), 1, "ios","Registrando operación...");
        var Cod_Caja = '100'//caja.Cod_Caja
        var Cod_Turno = 'T0002'
        var Id_Concepto = 11000
        var Id_ClienteProveedor = 0
        var Cliente = null
        var ClienteMov = null
        if($('input[name=optEnvios]:checked').val()=="b"){
            Cliente = $("#Cod_Cuenta_Bancaria option:selected").text()
            ClienteMov = "PARA : " + $("#Cod_Cuenta_Bancaria option:selected").val() + " : " + $("#NroOperacion").val() + " , " + $("#Comentario").val()
        }else{
            Cliente = $("#Cod_CajaDestino option:selected").text()
            ClienteMov = "PARA : " + $("#Cod_CajaDestino option:selected").text() + " , " + $("#Comentario").val()
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
        var Id_MovimientoRef = 0

        if ($('input[name=optEnvios]:checked').val() == 'c') {
            
            GuardarMovEgresoCaja(Cod_Caja,Cod_Turno,Id_Concepto,Id_ClienteProveedor,Cliente,Des_Movimiento,Fecha,Cod_MonedaEgr,Cod_MonedaIng,Fecha_Aut,Serie,Tipo_Cambio,Ingreso,Egreso,Flag_Extornado,Id_MovimientoRef, variables)
             
        }else{
            
            GuardarMovEgresoBanco(Cod_Caja,Cod_Turno,Id_Concepto,Id_ClienteProveedor,Cliente,Des_Movimiento,Fecha,Cod_MonedaEgr,Cod_MonedaIng,Fecha_Aut,Serie,Tipo_Cambio,Ingreso,Egreso,Flag_Extornado,Id_MovimientoRef, variables)
             
        }
                    
    }
}


function GuardarMovEgresoBanco(Cod_Caja,Cod_Turno,Id_Concepto,Id_ClienteProveedor,Cliente,Des_Movimiento,Fecha,Cod_MonedaEgr,Cod_MonedaIng,Fecha_Aut,Serie,Tipo_Cambio,Ingreso,Egreso,Flag_Extornado,Id_MovimientoRef, variables){
       
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
            Cod_MonedaIng,
            Cod_MonedaEgr,
            Fecha_Aut,
            Serie,
            Tipo_Cambio,
            Ingreso,
            Egreso,
            Flag_Extornado
        })
    }
    fetch(URL + '/envios_api/guardar_movimientos_egreso_caja', parametros)
        .then(req => req.json())
        .then(res => { 
            if (res.respuesta == 'ok') {
                GuardarMovCuentaBancaria(variables)
            }
            else {  
                $('#modal-proceso').waitMe('hide');
            }
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#modal-proceso').waitMe('hide');
        });
}


function GuardarMovCuentaBancaria(variables){
    var Id_MovimientoCuenta = -1
    var Cod_CuentaBancaria=$("#Cod_Cuenta_Bancaria").val()
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
            Obs_Movimiento
        })
    }
    fetch(URL + '/envios_api/guardar_movimientos_cuenta_bancaria', parametros)
        .then(req => req.json())
        .then(res => {
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
                            Obs_Movimiento
                        })
                    }

                    fetch(URL + '/envios_api/guardar_movimientos_cuenta_bancaria', parametros)
                    .then(req => req.json())
                    .then(res => { 
                        $('#modal-proceso').modal('hide')
                        $('#modal-proceso').waitMe('hide');
                        if (res.respuesta == 'ok') {
                            toastr.success('Se registro correctamente el movimiento','Confirmacion',{timeOut: 5000})
                            refrescar_movimientos()
                        }
                        else {
                            toastr.error('No se pudo registrar correctamente el movimiento','Error',{timeOut: 5000})  
                        }
                    }).catch(function (e) {
                        console.log(e);
                        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                        $('#modal-proceso').waitMe('hide');
                    });

                }else{
                    $('#modal-proceso').modal('hide')
                    $('#modal-proceso').waitMe('hide');
                } 
            }
            else {
                toastr.error('No se pudo registrar correctamente el movimiento','Error',{timeOut: 5000})    
                $('#modal-proceso').waitMe('hide');
            }
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#modal-proceso').waitMe('hide');
        });
}


function GuardarMovEgresoCaja(Cod_Caja,Cod_Turno,Id_Concepto,Id_ClienteProveedor,Cliente,Des_Movimiento,Fecha,Cod_MonedaEgr,Cod_MonedaIng,Fecha_Aut,Serie,Tipo_Cambio,Ingreso,Egreso,Flag_Extornado,Id_MovimientoRef, variables){
       
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
                Cod_MonedaIng,
                Cod_MonedaEgr,
                Fecha_Aut,
                Serie,
                Tipo_Cambio,
                Ingreso,
                Egreso,
                Flag_Extornado,
                Obs_Movimiento:null
            })
        }
        fetch(URL + '/envios_api/guardar_movimientos_egreso_caja', parametros)
            .then(req => req.json())
            .then(res => { 
                if (res.respuesta == 'ok') {
                    Cod_Caja = $("#Cod_CajaDestino").val()
                    Cod_Turno = null
                    Id_Concepto = 11000
                    Id_ClienteProveedor = 0
                    Cliente =  $("#Cod_CajaOrigen option:selected").text() 
                    Des_Movimiento = "DE : "+$("#Cod_CajaOrigen option:selected").text()+","+$("#Comentario").val()
                    Fecha = $("#Fecha").val()
                    Cod_MonedaEgr = $("#Cod_Moneda").val()
                    Cod_MonedaIng = $("#Cod_Moneda").val()
                    Fecha_Aut = $("#Fecha").val()
                    Serie = variables.serie[0].Serie
                    Tipo_Cambio = 1
                    Ingreso = $("#Monto").val()
                    Egreso = 0
                    Flag_Extornado = 0
                    Id_MovimientoRef = res.data
                    GuardarMovIngresoOtraCaja(Cod_Caja,Cod_Turno,Id_Concepto,Id_ClienteProveedor,Cliente,Des_Movimiento,Fecha,Cod_MonedaEgr,Cod_MonedaIng,Fecha_Aut,Serie,Tipo_Cambio,Ingreso,Egreso,Flag_Extornado,Id_MovimientoRef, variables)
                }
                else {
                    toastr.error('No se pudo registrar correctamente el movimiento','Error',{timeOut: 5000})    
                    $('#modal-proceso').waitMe('hide');
                }
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#modal-proceso').waitMe('hide');
            });
}

function GuardarMovIngresoOtraCaja(Cod_Caja,Cod_Turno,Id_Concepto,Id_ClienteProveedor,Cliente,Des_Movimiento,Fecha,Cod_MonedaEgr,Cod_MonedaIng,Fecha_Aut,Serie,Tipo_Cambio,Ingreso,Egreso,Flag_Extornado,Id_MovimientoRef, variables){
       
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
            Cod_MonedaIng,
            Cod_MonedaEgr,
            Fecha_Aut,
            Serie,
            Tipo_Cambio,
            Ingreso,
            Egreso,
            Flag_Extornado,
            Id_MovimientoRef
        })
    } 
    fetch(URL + '/envios_api/guardar_movimientos_ingreso_otra_caja', parametros)
        .then(req => req.json())
        .then(res => {
            $('#modal-proceso').modal('hide')
            $('#modal-proceso').waitMe('hide');
            if (res.respuesta == 'ok') {
                toastr.success('Se registro correctamente el movimiento','Confirmacion',{timeOut: 5000}) 
                refrescar_movimientos()
            }
            else {
                toastr.error('No se pudo registrar correctamente el movimiento','Error',{timeOut: 5000})  
            }
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#modal-proceso').waitMe('hide');
        });
}



function NuevoEnvioEfectivo(_escritura, caja) {
    $("#modal-proceso").off('shown.bs.modal')
    run_waitMe($('#main-contenido'), 1, "ios");
    var Cod_Caja = '100'//caja.Cod_Caja
    var Cod_Sucursal = '0001'
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Cod_Caja,
            Cod_Sucursal
        })
    }
    fetch(URL + '/envios_api/get_cajas_envios', parametros)
        .then(req => req.json())
        .then(res => {
            var variables = res.data
            if (res.respuesta == 'ok') {
                const fecha = new Date()
                const mes = fecha.getMonth() + 1
                const dia = fecha.getDate()
                var fecha_format = fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)
                Ver(_escritura, variables,fecha_format,res.caja)
              
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



export { NuevoEnvioEfectivo }