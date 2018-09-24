 var empty = require('empty-element');
var yo = require('yo-yo');

import { URL } from '../../../constantes_entorno/constantes'
import { refrescar_movimientos } from '../../movimientos_caja'
import { LimpiarEventoModales } from '../../../../utility/tools' 

var cantidad_tabs = 0

function Ver(_escritura, variables,fecha_actual,caja_actual) {
    cantidad_tabs++
    const idTabT = "T_"+cantidad_tabs

    var tab = yo`
    <li class="" ><a href="#tab_${idTabT}" data-toggle="tab" aria-expanded="false" id="id_${idTabT}">Transferencias entre cajas <a style="padding-left: 10px;"  onclick=${()=>CerrarTabT(idTabT)} class="btn"><i class="fa fa-close text-danger"></i></a></a></li>`


    var el = yo`
        <div class="tab-pane" id="tab_${idTabT}">
            <div class="panel">
                <div class="panel-body"  id="modal_form_${idTabT}">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="row">
                                <div id="modal_error_${idTabT}" class="alert alert-callout alert-danger hidden">
                                    <p> Es necesario llenar los campos marcados con rojo</p>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="Cajero">Cajero</label>
                                        <h4 type="text" class="form-control" id="Cajero_${idTabT}"></h4>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="Cod_CajaOrigen">Caja</label>
                                        <select class="form-control" id="Cod_CajaOrigen_${idTabT}" disabled>
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
                                        <input type="date" class="form-control required" id="Fecha_${idTabT}" placeholder='dd/mm/aaaa' value=${fecha_actual}>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="panel panel-default">
                                    <div class="panel-heading">Destino y Monto</div>
                                    <div class="panel-body">
                                        <div class="row">
                                            <div class="col-md-3">
                                                <div class="radio-inline radio-styled radio-primary">
                                                    <label>
                                                        <input type="radio" value="b" id="optEnvios_${idTabT}" name="optEnvios_${idTabT}" onclick=${()=>CambioRadios(idTabT)}><span> Banco</span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div class="col-md-9" id="formBanco_${idTabT}" style="display:none"> 
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <select class="form-control" id="Cod_Cuenta_Bancaria_${idTabT}">
                                                            ${variables.cuentas_bancarias.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_CuentaBancaria}">${e.Des_CuentaBancaria}</option>`)}
                                                        </select>
                                                    </div>
                                                </div>
                                                
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label class="sr-only" for="NroOperacion">Nro Op.</label>
                                                        <input type="text" class="form-control" id="NroOperacion_${idTabT}">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-md-3">
                                                <div class="radio-inline radio-styled radio-primary">
                                                    <label>
                                                        <input type="radio" value="c" id="optEnvios_${idTabT}" name="optEnvios_${idTabT}" checked onclick=${()=>CambioRadios(idTabT)}><span> Caja</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div class="col-md-9" id="formCaja_${idTabT}">
                                                <div class="form-group">
                                                    <select class="form-control required" id="Cod_CajaDestino_${idTabT}">
                                                        ${variables.cajas_diferentes.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_Caja}">${e.Des_Caja}</option>`)}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                            
                                        <div class="row">
                                            <div class="col-md-3">
                                                <div class="form-group">
                                                    <label for="Cod_Moneda">Moneda</label>
                                                    <select class="form-control" id="Cod_Moneda_${idTabT}">\
                                                        ${variables.monedas.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_Moneda}">${e.Nom_Moneda}</option>`)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label for="Monto">Monto</label>
                                                    <input type="number" class="form-control required" id="Monto_${idTabT}" onkeypress=${()=>CalcularITF(idTabT)}>
                                                </div>
                                            </div>
                                            <div class="col-md-3 text-center" id="formBancoITF_${idTabT}" style="display:none">
                                                <div class="checkbox checkbox-inline checkbox-styled">
                                                    <label>
                                                        <input type="checkbox" id="optITF_${idTabT}" name="optITF_${idTabT}" onclick=${()=>CalcularITF(idTabT)}><span> Con ITF? 0.005%</span>
                                                    </label>
                                                </div>
                                            </div>

                                        </div>
                                        
                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="form-group">
                                                    <label for="Comentario">Comentario</label>
                                                    <textarea type="text" style="text-transform:uppercase" class="form-control" id="Comentario_${idTabT}" placeholder="Ingrese un comentario"></textarea>
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
                    <button type="button" class="btn btn-info" id="btnGuardar" onclick=${()=>GuardarEnvio(variables,idTabT)}>Guardar</button>
                </div>
            </div>
        </div>`

    //var modal_proceso = document.getElementById('modal-proceso');
    //empty(modal_proceso).appendChild(el);
    //$('#modal-proceso').modal()
    $("#tabs").append(tab)
    $("#tabs_contents").append(el)
    $("#id_"+idTabT).click()
    $('#Cajero_'+idTabT).text($('p#nick').text())
}

function RefrescarVer(_escritura, variables,fecha_actual,caja_actual,idTabT) {
    
    var el = yo` 
            <div class="panel">
                <div class="panel-body"  id="modal_form_${idTabT}">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="row">
                                <div id="modal_error_${idTabT}" class="alert alert-callout alert-danger hidden">
                                    <p> Es necesario llenar los campos marcados con rojo</p>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="Cajero">Cajero</label>
                                        <h4 type="text" class="form-control" id="Cajero_${idTabT}"></h4>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="Cod_CajaOrigen">Caja</label>
                                        <select class="form-control" id="Cod_CajaOrigen_${idTabT}" disabled>
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
                                        <input type="date" class="form-control required" id="Fecha_${idTabT}" placeholder='dd/mm/aaaa' value=${fecha_actual}>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="panel panel-default">
                                    <div class="panel-heading">Destino y Monto</div>
                                    <div class="panel-body">
                                        <div class="row">
                                            <div class="col-md-3">
                                                <div class="radio-inline radio-styled radio-primary">
                                                    <label>
                                                        <input type="radio" value="b" id="optEnvios_${idTabT}" name="optEnvios_${idTabT}" onclick=${()=>CambioRadios(idTabT)}><span> Banco</span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div class="col-md-9" id="formBanco_${idTabT}" style="display:none"> 
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <select class="form-control" id="Cod_Cuenta_Bancaria_${idTabT}">
                                                            ${variables.cuentas_bancarias.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_CuentaBancaria}">${e.Des_CuentaBancaria}</option>`)}
                                                        </select>
                                                    </div>
                                                </div>
                                                
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label class="sr-only" for="NroOperacion">Nro Op.</label>
                                                        <input type="text" class="form-control" id="NroOperacion_${idTabT}">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-md-3">
                                                <div class="radio-inline radio-styled radio-primary">
                                                    <label>
                                                        <input type="radio" value="c" id="optEnvios_${idTabT}" name="optEnvios_${idTabT}" checked onclick=${()=>CambioRadios(idTabT)}><span> Caja</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div class="col-md-9" id="formCaja_${idTabT}">
                                                <div class="form-group">
                                                    <select class="form-control required" id="Cod_CajaDestino_${idTabT}">
                                                        ${variables.cajas_diferentes.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_Caja}">${e.Des_Caja}</option>`)}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                            
                                        <div class="row">
                                            <div class="col-md-3">
                                                <div class="form-group">
                                                    <label for="Cod_Moneda">Moneda</label>
                                                    <select class="form-control" id="Cod_Moneda_${idTabT}">\
                                                        ${variables.monedas.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_Moneda}">${e.Nom_Moneda}</option>`)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label for="Monto">Monto</label>
                                                    <input type="number" class="form-control required" id="Monto_${idTabT}" onkeypress=${()=>CalcularITF(idTabT)}>
                                                </div>
                                            </div>
                                            <div class="col-md-3 text-center" id="formBancoITF_${idTabT}" style="display:none">
                                                <div class="checkbox">
                                                    <label>
                                                        <input type="checkbox" id="optITF_${idTabT}" name="optITF_${idTabT}" onclick=${()=>CalcularITF(idTabT)}> Con ITF? 0.005%
                                                    </label>
                                                </div>
                                            </div>

                                        </div>
                                        
                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="form-group">
                                                    <label for="Comentario">Comentario</label>
                                                    <textarea type="text" style="text-transform:uppercase" class="form-control" id="Comentario_${idTabT}" placeholder="Ingrese un comentario"></textarea>
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
                    <button type="button" class="btn btn-info" id="btnGuardar" onclick=${()=>GuardarEnvio(variables,idTabT)}>Guardar</button>
                </div>
            </div>`

    //var modal_proceso = document.getElementById('modal-proceso');
    //empty(modal_proceso).appendChild(el);
    //$('#modal-proceso').modal()
    $('#tab_'+idTabT).html(el)
    $('#Cajero_'+idTabT).text($('p#nick').text())
}

function CerrarTabT(idTab){ 
    $('#tab_'+idTab).remove()
    $('#id_'+idTab).parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show');
}


function CalcularITF(idTab){
    $("#optITF_"+idTab).attr("data-value","")
    if($("#optITF_"+idTab).is(":checked")){
        if($.trim($("#Monto_"+idTab).val()).length>0){
            var ITF = parseFloat($("#Monto_"+idTab).val()) * 0.00005
            $("#optITF_"+idTab).attr("data-value",ITF.toString()+".000")
            if(parseInt($("#optITF_"+idTab).attr("data-value").substring($("#optITF_"+idTab).attr("data-value").length - 2, 1)) >= 5){
                $("#optITF_"+idTab).attr("data-value",$("#optITF_"+idTab).attr("data-value").substring(0,$("#optITF_"+idTab).attr("data-value").length - 2)+"5")
            }else{
                $("#optITF_"+idTab).attr("data-value",$("#optITF_"+idTab).attr("data-value").substring(0,$("#optITF_"+idTab).attr("data-value").length - 2)+"0")
            }
        }
    }
}
 

function CambioRadios(idTab){
    if ($('input[name=optEnvios_'+idTab+']:checked').val() == 'b') {
        $("#formBanco_"+idTab).show()
        $("#formBancoITF_"+idTab).show()
        $("#formCaja_"+idTab).hide()
        $("#Cod_CajaDestino_"+idTab).removeClass("required")
        $("#Cod_Cuenta_Bancaria_"+idTab).addClass("required")
        $("#NroOperacion_"+idTab).addClass("required")
    }else{
        $("#formBanco_"+idTab).hide()
        $("#formBancoITF_"+idTab).hide()
        $("#formCaja_"+idTab).show()
        $("#Cod_CajaDestino_"+idTab).addClass("required")
        $("#Cod_Cuenta_Bancaria_"+idTab).removeClass("required")
        $("#NroOperacion_"+idTab).removeClass("required")
    }
}


function GuardarEnvio(variables,idTab){
    if(ValidacionCampos("modal_error_"+idTab,"modal_form_"+idTab)){

        run_waitMe($('#main-contenido'), 1, "ios","Registrando operación...");
        var Cod_Caja = '100'//caja.Cod_Caja
        var Cod_Turno = 'T0002'
        var Id_Concepto = 11000
        var Id_ClienteProveedor = 0
        var Cliente = null
        var ClienteMov = null
        if($('input[name=optEnvios_'+idTab+']:checked').val()=="b"){
            Cliente = $("#Cod_Cuenta_Bancaria_"+idTab+" option:selected").text()
            ClienteMov = "PARA : " + $("#Cod_Cuenta_Bancaria_"+idTab+" option:selected").val() + " : " + $("#NroOperacion_"+idTab).val() + " , " + $("#Comentario_"+idTab).val()
        }else{
            Cliente = $("#Cod_CajaDestino_"+idTab+" option:selected").text()
            ClienteMov = "PARA : " + $("#Cod_CajaDestino_"+idTab+" option:selected").text() + " , " + $("#Comentario_"+idTab).val()
        }
        var Des_Movimiento = ClienteMov
        var Fecha = $("#Fecha_"+idTab).val()
        var Cod_MonedaEgr = $("#Cod_Moneda_"+idTab).val()
        var Cod_MonedaIng = $("#Cod_Moneda_"+idTab).val()
        var Fecha_Aut = $("#Fecha_"+idTab).val()
        var Serie = variables.serie[0].Serie
        var Tipo_Cambio = 1
        var Ingreso = 0
        var Egreso = $("#Monto_"+idTab).val()
        var Flag_Extornado = 0
        var Id_MovimientoRef = 0

        if ($('input[name=optEnvios_'+idTab+']:checked').val() == 'c') {
            
            GuardarMovEgresoCaja(Cod_Caja,Cod_Turno,Id_Concepto,Id_ClienteProveedor,Cliente,Des_Movimiento,Fecha,Cod_MonedaEgr,Cod_MonedaIng,Fecha_Aut,Serie,Tipo_Cambio,Ingreso,Egreso,Flag_Extornado,Id_MovimientoRef, variables,idTab)
             
        }else{
            
            GuardarMovEgresoBanco(Cod_Caja,Cod_Turno,Id_Concepto,Id_ClienteProveedor,Cliente,Des_Movimiento,Fecha,Cod_MonedaEgr,Cod_MonedaIng,Fecha_Aut,Serie,Tipo_Cambio,Ingreso,Egreso,Flag_Extornado,Id_MovimientoRef, variables,idTab)
             
        }
                    
    }
}


function GuardarMovEgresoBanco(Cod_Caja,Cod_Turno,Id_Concepto,Id_ClienteProveedor,Cliente,Des_Movimiento,Fecha,Cod_MonedaEgr,Cod_MonedaIng,Fecha_Aut,Serie,Tipo_Cambio,Ingreso,Egreso,Flag_Extornado,Id_MovimientoRef, variables,idTab){
       
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
                GuardarMovCuentaBancaria(variables,idTab)
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


function GuardarMovCuentaBancaria(variables,idTab){
    var Id_MovimientoCuenta = -1
    var Cod_CuentaBancaria=$("#Cod_Cuenta_Bancaria_"+idTab).val()
    var Nro_Operacion = $("#NroOperacion_"+idTab).val()
    var Des_Movimiento='DEPOSITO EN EFECTIVO'
    var Cod_TipoOperacionBancaria='001'
    var Fecha = $("#Fecha_"+idTab).val()
    var Monto = $("#Monto_"+idTab).val()
    var TipoCambio = 1
    var Cod_Caja = '100'
    var Cod_Turno = 'T0002'
    var Nro_Cheque = ''
    var Beneficiario = ''
    var Id_ComprobantePago = 0
    var Obs_Movimiento = $("#Comentario_"+idTab).val()
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
                if($("#optITF_"+idTab).is(":checked")){
                    Id_MovimientoCuenta = 0
                    Des_Movimiento='IMPUESTO ITF'
                    Monto = -1 * parseFloat($("#optITF_"+idTab).attr("data-value"))
                    Cod_TipoOperacionBancaria = '004'
                    Nro_Operacion = parseInt($("#NroOperacion_"+idTab).val())+1

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
                        $('#main-contenido').waitMe('hide');
                        if (res.respuesta == 'ok') {
                            toastr.success('Se registro correctamente el movimiento','Confirmacion',{timeOut: 5000})
                            RefrescarEnvioEfectivo(true,idTab)
                            //refrescar_movimientos()
                        }
                        else {
                            toastr.error('No se pudo registrar correctamente el movimiento','Error',{timeOut: 5000})  
                        }
                    }).catch(function (e) {
                        console.log(e);
                        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                        $('#main-contenido').waitMe('hide');
                    });

                }else{ 
                    $('#main-contenido').waitMe('hide');
                } 
            }
            else {
                toastr.error('No se pudo registrar correctamente el movimiento','Error',{timeOut: 5000})    
                $('#main-contenido').waitMe('hide');
            }
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
}


function GuardarMovEgresoCaja(Cod_Caja,Cod_Turno,Id_Concepto,Id_ClienteProveedor,Cliente,Des_Movimiento,Fecha,Cod_MonedaEgr,Cod_MonedaIng,Fecha_Aut,Serie,Tipo_Cambio,Ingreso,Egreso,Flag_Extornado,Id_MovimientoRef, variables,idTab){
       
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
                    Cod_Caja = $("#Cod_CajaDestino_"+idTab).val()
                    Cod_Turno = null
                    Id_Concepto = 11000
                    Id_ClienteProveedor = 0
                    Cliente =  $("#Cod_CajaOrigen_"+idTab+" option:selected").text() 
                    Des_Movimiento = "DE : "+$("#Cod_CajaOrigen_"+idTab+" option:selected").text()+","+$("#Comentario_"+idTab).val()
                    Fecha = $("#Fecha_"+idTab).val()
                    Cod_MonedaEgr = $("#Cod_Moneda_"+idTab).val()
                    Cod_MonedaIng = $("#Cod_Moneda_"+idTab).val()
                    Fecha_Aut = $("#Fecha_"+idTab).val()
                    Serie = variables.serie[0].Serie
                    Tipo_Cambio = 1
                    Ingreso = $("#Monto_"+idTab).val()
                    Egreso = 0
                    Flag_Extornado = 0
                    Id_MovimientoRef = res.data
                    GuardarMovIngresoOtraCaja(Cod_Caja,Cod_Turno,Id_Concepto,Id_ClienteProveedor,Cliente,Des_Movimiento,Fecha,Cod_MonedaEgr,Cod_MonedaIng,Fecha_Aut,Serie,Tipo_Cambio,Ingreso,Egreso,Flag_Extornado,Id_MovimientoRef, variables,idTab)
                }
                else {
                    toastr.error('No se pudo registrar correctamente el movimiento','Error',{timeOut: 5000})    
                    $('#main-contenido').waitMe('hide');
                }
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
}

function GuardarMovIngresoOtraCaja(Cod_Caja,Cod_Turno,Id_Concepto,Id_ClienteProveedor,Cliente,Des_Movimiento,Fecha,Cod_MonedaEgr,Cod_MonedaIng,Fecha_Aut,Serie,Tipo_Cambio,Ingreso,Egreso,Flag_Extornado,Id_MovimientoRef, variables,idTab){
       
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
            $('#main-contenido').waitMe('hide');
            if (res.respuesta == 'ok') {
                toastr.success('Se registro correctamente el movimiento','Confirmacion',{timeOut: 5000}) 
                RefrescarEnvioEfectivo(true,idTab)
                //refrescar_movimientos()
            }
            else {
                toastr.error('No se pudo registrar correctamente el movimiento','Error',{timeOut: 5000})  
            }
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
}



function RefrescarEnvioEfectivo(_escritura,idTab) {
    LimpiarEventoModales()
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
                RefrescarVer(_escritura, variables,fecha_format,res.caja,idTab)
              
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


function NuevoEnvioEfectivo(_escritura, caja) {
    LimpiarEventoModales()
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