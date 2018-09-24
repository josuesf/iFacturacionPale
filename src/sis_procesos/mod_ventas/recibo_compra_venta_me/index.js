var empty = require('empty-element');
var yo = require('yo-yo');

import { URL } from '../../../constantes_entorno/constantes'
import { refrescar_movimientos } from '../../movimientos_caja'
import { NuevoCliente,BuscarCliente } from '../../modales'
import { LimpiarEventoModales } from '../../../../utility/tools'


var arrayValidacion = [null,'null','',undefined]
//var flag_cliente = false 
var cantidad_tabs = 0
global.variablesCVME = {}

function Ver(_escritura, Serie, variables,fecha_actual,empresa) {
    global.objCliente = ''
    cantidad_tabs++
    const idTabCVME = "CVME_"+cantidad_tabs
    global.variablesCVME[idTabCVME]={idTab:idTabCVME,flag_cliente:false,Id_ClienteProveedor:null} 
    var tab = yo`
    <li class="" ><a href="#tab_${idTabCVME}" data-toggle="tab" aria-expanded="false" id="id_${idTabCVME}">Compra ME <a style="padding-left: 10px;"  onclick=${()=>CerrarTabCVME(idTabCVME)} class="btn"><i class="fa fa-close text-danger"></i></a></a></li>`

    var el = yo`
        <div class="tab-pane" id="tab_${idTabCVME}">
            <div class="panel">
                <div class="panel-body" id="modal_form_${idTabCVME}">
                    <div class="row">
                        <div id="modal_error_${idTabCVME}" class="alert alert-callout alert-danger hidden">
                            <p>Es necesario llenar todos los campos requeridos y el Importe mayor a cero</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-8">
                            <div class="card">
                                <div class="card-head">
                                    <header>A favor de : </header>
                                    <div class="tools">
                                        <div class="btn-group">
                                            <a class="btn btn-icon-toggle btn-info btn-refresh" onclick=${()=>NuevoCliente(variables.tipos_documento)}><i class="fa fa-plus"></i></a>
                                            <a class="btn btn-icon-toggle btn-warning" onclick=${()=>EditarCliente(idTabCVME)}><i class="fa fa-pencil"></i></a>
                                            <a class="btn btn-icon-toggle btn-success btn-refresh" onclick=${()=>BuscarCliente("txtNombreCliente_"+idTabCVME,"Nro_DocumentoBuscar_"+idTabCVME,"002")}><i class="fa fa-search"></i></a>
                                            <a class="btn btn-icon-toggle btn-primary"><i class="fa fa-globe"></i></a>
                                        </div>
                                    </div>
                                </div> 
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <select class="form-control input-sm" id="Cod_TipoDocumentoBuscar_${idTabCVME}" onchange=${()=>CambioClienteDoc(idTabCVME)}>
                                                    ${variables.tipos_documento.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_TipoDoc}">${e.Nom_TipoDoc}</option>`)}
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <input type="text" class="form-control input-sm" placeholder="Nro Documento" id="Nro_DocumentoBuscar_${idTabCVME}" onblur=${()=>RecuperarDatosClientePorNroDoc(idTabCVME)} onkeypress=${()=>KeyPressClienteDoc(idTabCVME)} onkeydown=${()=>CambioNroDocumento(event,idTabCVME)}>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <input type="text" class="form-control input-sm" id="txtNombreCliente_${idTabCVME}" placeholder="Nombre del cliente"> 
                                              
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
                                        <h4 class="box-title" id="Ruc_Empresa"><strong> R.U.C. ${empresa.RUC} </strong></h4>
                                    </div>
                                    <div class="row">
                                        <h4><strong>COMPRA/VENTA ME</strong></h4>
                                    </div> 
                                    
                                    <div class="row">
                                        <div class="col-md-5">
                                            <div class="form-group">
                                                <select class="form-control" id="Serie_${idTabCVME}">
                                                    <option style="text-transform:uppercase" value="${Serie}">${Serie}</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-7">
                                            <div class="form-group">
                                                <input type="text" class="form-control" id="Numero_${idTabCVME}" value="00000000${variables.siguiente_numero_comprobante[0].Numero}">
                                            </div>
                                        </div>
                                    </div> 

                                </div>
                                
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="col-sm-6"> 
                                <div class="radio-inline radio-styled radio-primary">
                                    <label>
                                        <input type="radio" value="c" id="TipoDestino_${idTabCVME}" name="TipoDestino_${idTabCVME}" checked onclick="${() => CambioTipoDestino(idTabCVME)}" ><span> En Caja</span>
                                    </label>
                                </div>
                            </div>
                            <div class="col-sm-6"> 
                                <div class="radio-inline radio-styled radio-primary">
                                    <label>
                                        <input type="radio" value="b" id="TipoDestino_${idTabCVME}" name="TipoDestino_${idTabCVME}" onclick="${() => CambioTipoDestino(idTabCVME)}"><span> En Banco</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="Fecha">Fecha</label>
                                <input type="date" class="form-control" id="Fecha_${idTabCVME}" placeholder='dd/mm/aaaa' value="${fecha_actual}">
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
                                             
                                            <div class="col-md-12" id="formBanco_${idTabCVME}" style="display:none">
                                                <div class="form-group">
                                                    <label for="Cod_Producto">Banco</label>
                                                    <select class="form-control" id="SelectEntidadFinanciera_${idTabCVME}" onchange=${()=>TraerCuentaBancariaEntidadFinanciera(idTabCVME)}>
                                                        ${variables.entidades_financieras.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_EntidadFinanciera}">${e.Nom_EntidadFinanciera}</option>`)}
                                                    </select>
                                                </div>
                                                <div class="form-group">
                                                    <label for="Cod_CuentaSoles">Cuenta Soles</label>
                                                    <select class="form-control" id="Cod_CuentaSoles_${idTabCVME}">
                                                    </select>
                                                </div>
                                                <div class="form-group">
                                                    <label for="Cod_CuentaME">Cuenta ME</label>
                                                    <select class="form-control" id="Cod_CuentaME_${idTabCVME}">
                                                    </select>
                                                </div>
                                                <div class="form-group">
                                                    <label for="Operacion">Operacion</label>
                                                    <input type="text" class="form-control" id="Operacion_${idTabCVME}">
                                                </div>
                                            </div>
                                            
                                            <div class="col-md-12"> 
                                                <div class="form-group" id="obs_body_xml_${idTabCVME}">
                                                  
                                                </div>
                                            </div>

                                        </div>
                                        <div class="col-md-6" id="formVentaCompraME_${idTabCVME}">
                                            <label>Tipo de Operacion</label>
                                            <div class="col-sm-12">
                                                <div class="col-sm-6">
                                                    <div class="radio-inline radio-styled radio-primary">
                                                        <label>
                                                            <input type="radio" id="optionCV_${idTabCVME}" name="optionCV_${idTabCVME}" value="c"  onclick="${() => CambioCompraVentaME(idTabCVME)}" checked><span> Compra ME</span>
                                                        </label>
                                                    </div> 
                                                </div>
                                                <div class="col-sm-6">
                                                    <div class="radio-inline radio-styled radio-primary">
                                                        <label>
                                                            <input type="radio" id="optionCV_${idTabCVME}" name="optionCV_${idTabCVME}" value="v" onclick="${() => CambioCompraVentaME(idTabCVME)}"><span> Venta ME</span>
                                                        </label>
                                                    </div>
                                                </div> 
                                            </div> 
                                            <br><br><br>
                                            <div class="form-group">
                                                <label for="Cod_Moneda">Moneda</label>
                                                <select class="form-control required" id="Cod_Moneda_${idTabCVME}">
                                                    ${variables.monedas_sinsoles.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_Moneda}">${e.Nom_Moneda}</option>`)}
                                                </select>
                                            </div>
                                            <div class="form-group">
                                                <label for="Monto">Monto</label>
                                                <input type="number" class="form-control required" id="Monto_${idTabCVME}" onkeypress=${()=>CambioSoles(idTabCVME)}>
                                            </div>
                                            <div class="form-group">
                                                <label for="TipoCambio">Tipo de Cambio</label>
                                                <input type="number" class="form-control required" id="TipoCambio_${idTabCVME}" onkeypress=${()=>CambioSoles(idTabCVME)}>
                                            </div>
                                            <div class="form-group">
                                                <label for="Soles">Soles</label>
                                                <input type="number" class="form-control required" id="Soles_${idTabCVME}" onkeypress=${()=>CambioMonto(idTabCVME)}>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> 
                        </div>
                    </div>
                    <div class="row pull-right"> 
                        <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-info" id="btnGuardar" onclick=${()=>GuardarCompraVentaME(variables,fecha_actual,idTabCVME)}>Guardar</button>
                    </div>
                </div>
               
            </div>
        </div>`

    //var modal_proceso = document.getElementById('modal-proceso')
    //empty(modal_proceso).appendChild(el)
    //$('#modal-proceso').modal()
    $("#tabs").append(tab)
    $("#tabs_contents").append(el)
    $("#id_"+idTabCVME).click()

    $('#modal-superior').on('hidden.bs.modal', function () {

        if(global.objCliente !='' && global.objCliente){
            //console.log(global.objCliente) 
            global.variablesCVME[idTabCVME].Id_ClienteProveedor = global.objCliente.Id_ClienteProveedor
            $("#Cod_TipoDocumentoBuscar_"+idTabCVME).val(global.objCliente.Cod_TipoDocumento)
            $("#txtNombreCliente_"+idTabCVME).val(global.objCliente.Cliente)
            $("#Nro_DocumentoBuscar_"+idTabCVME).val(global.objCliente.Nro_Documento)
            $("#txtNombreCliente_"+idTabCVME).attr("data-id",global.objCliente.Id_ClienteProveedor)


            $("#Nro_DocumentoBuscar_"+idTabCVME).bind("keypress", function(event){
                event.preventDefault();
                event.stopPropagation();
            });
            
            $("#txtNombreCliente_"+idTabCVME).bind("keypress", function(event){
                event.preventDefault();
                event.stopPropagation();
            });
           
            $("#Nro_DocumentoBuscar_"+idTabCVME).attr("disabled",true);
            $("#txtNombreCliente_"+idTabCVME).attr("disabled",true); 
            $("#Cod_TipoDocumentoBuscar_"+idTabCVME).attr("disabled",true);
        }
    })

    TraerCuentaBancariaEntidadFinanciera(idTabCVME)
    ObservacionesXML(variables.diagramas,idTabCVME)
}

function RefrescarVer(_escritura, Serie, variables,fecha_actual,empresa,idTabCVME) { 
    global.objCliente = ''
    global.variablesCVME[idTabCVME]={idTab:idTabCVME,flag_cliente:false,Id_ClienteProveedor:null} 
    
    var el = yo` 
            <div class="panel">
                <div class="panel-body" id="modal_form_${idTabCVME}">
                    <div class="row">
                        <div id="modal_error_${idTabCVME}" class="alert alert-callout alert-danger hidden">
                            <p>Es necesario llenar todos los campos requeridos y el Importe mayor a cero</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-8">
                            <div class="card">
                                <div class="card-head">
                                    <header>A favor de : </header>
                                    <div class="tools">
                                        <div class="btn-group">
                                            <a class="btn btn-icon-toggle btn-info btn-refresh" onclick=${()=>NuevoCliente(variables.tipos_documento)}><i class="fa fa-plus"></i></a>
                                            <a class="btn btn-icon-toggle btn-warning" onclick=${()=>EditarCliente(idTabCVME)}><i class="fa fa-pencil"></i></a>
                                            <a class="btn btn-icon-toggle btn-success btn-refresh" onclick=${()=>BuscarCliente("txtNombreCliente_"+idTabCVME,"Nro_DocumentoBuscar_"+idTabCVME,"002")}><i class="fa fa-search"></i></a>
                                            <a class="btn btn-icon-toggle btn-primary"><i class="fa fa-globe"></i></a>
                                        </div>
                                    </div>
                                </div> 
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <select class="form-control input-sm" id="Cod_TipoDocumentoBuscar_${idTabCVME}" onchange=${()=>CambioClienteDoc(idTabCVME)}>
                                                    ${variables.tipos_documento.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_TipoDoc}">${e.Nom_TipoDoc}</option>`)}
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <input type="text" class="form-control input-sm" placeholder="Nro Documento" id="Nro_DocumentoBuscar_${idTabCVME}" onblur=${()=>RecuperarDatosClientePorNroDoc(idTabCVME)} onkeypress=${()=>KeyPressClienteDoc(idTabCVME)} onkeydown=${()=>CambioNroDocumento(event,idTabCVME)}>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <input type="text" class="form-control input-sm" id="txtNombreCliente_${idTabCVME}" placeholder="Nombre del cliente"> 
                                              
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
                                        <h4 class="box-title" id="Ruc_Empresa"><strong> R.U.C. ${empresa.RUC} </strong></h4>
                                    </div>
                                    <div class="row">
                                        <h4><strong>COMPRA/VENTA ME</strong></h4>
                                    </div> 
                                    
                                    <div class="row">
                                        <div class="col-md-5">
                                            <div class="form-group">
                                                <select class="form-control" id="Serie_${idTabCVME}">
                                                    <option style="text-transform:uppercase" value="${Serie}">${Serie}</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-7">
                                            <div class="form-group">
                                                <input type="text" class="form-control" id="Numero_${idTabCVME}" value="00000000${variables.siguiente_numero_comprobante[0].Numero}">
                                            </div>
                                        </div>
                                    </div> 

                                </div>
                                
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="col-sm-6"> 
                                <div class="radio-inline radio-styled radio-primary">
                                    <label>
                                        <input type="radio" value="c" id="TipoDestino_${idTabCVME}" name="TipoDestino_${idTabCVME}" checked onclick="${() => CambioTipoDestino(idTabCVME)}" ><span> En Caja</span>
                                    </label>
                                </div>
                            </div>
                            <div class="col-sm-6"> 
                                <div class="radio-inline radio-styled radio-primary">
                                    <label>
                                        <input type="radio" value="b" id="TipoDestino_${idTabCVME}" name="TipoDestino_${idTabCVME}" onclick="${() => CambioTipoDestino(idTabCVME)}"><span> En Banco</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="Fecha">Fecha</label>
                                <input type="date" class="form-control" id="Fecha_${idTabCVME}" placeholder='dd/mm/aaaa' value="${fecha_actual}">
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
                                             
                                            <div class="col-md-12" id="formBanco_${idTabCVME}" style="display:none">
                                                <div class="form-group">
                                                    <label for="Cod_Producto">Banco</label>
                                                    <select class="form-control" id="SelectEntidadFinanciera_${idTabCVME}" onchange=${()=>TraerCuentaBancariaEntidadFinanciera(idTabCVME)}>
                                                        ${variables.entidades_financieras.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_EntidadFinanciera}">${e.Nom_EntidadFinanciera}</option>`)}
                                                    </select>
                                                </div>
                                                <div class="form-group">
                                                    <label for="Cod_CuentaSoles">Cuenta Soles</label>
                                                    <select class="form-control" id="Cod_CuentaSoles_${idTabCVME}">
                                                    </select>
                                                </div>
                                                <div class="form-group">
                                                    <label for="Cod_CuentaME">Cuenta ME</label>
                                                    <select class="form-control" id="Cod_CuentaME_${idTabCVME}">
                                                    </select>
                                                </div>
                                                <div class="form-group">
                                                    <label for="Operacion">Operacion</label>
                                                    <input type="text" class="form-control" id="Operacion_${idTabCVME}">
                                                </div>
                                            </div>
                                            
                                            <div class="col-md-12"> 
                                                <div class="form-group" id="obs_body_xml_${idTabCVME}">
                                                  
                                                </div>
                                            </div>

                                        </div>
                                        <div class="col-md-6" id="formVentaCompraME_${idTabCVME}">
                                            <label>Tipo de Operacion</label>
                                            <div class="col-sm-12">
                                                <div class="col-sm-6">
                                                    <div class="radio-inline radio-styled radio-primary">
                                                        <label>
                                                            <input type="radio" id="optionCV_${idTabCVME}" name="optionCV_${idTabCVME}" value="c"  onclick="${() => CambioCompraVentaME(idTabCVME)}" checked><span> Compra ME</span>
                                                        </label>
                                                    </div> 
                                                </div>
                                                <div class="col-sm-6">
                                                    <div class="radio-inline radio-styled radio-primary">
                                                        <label>
                                                            <input type="radio" id="optionCV_${idTabCVME}" name="optionCV_${idTabCVME}" value="v" onclick="${() => CambioCompraVentaME(idTabCVME)}"><span> Venta ME</span>
                                                        </label>
                                                    </div>
                                                </div> 
                                            </div> 
                                            <br><br><br>
                                            <div class="form-group">
                                                <label for="Cod_Moneda">Moneda</label>
                                                <select class="form-control required" id="Cod_Moneda_${idTabCVME}">
                                                    ${variables.monedas_sinsoles.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_Moneda}">${e.Nom_Moneda}</option>`)}
                                                </select>
                                            </div>
                                            <div class="form-group">
                                                <label for="Monto">Monto</label>
                                                <input type="number" class="form-control required" id="Monto_${idTabCVME}" onkeypress=${()=>CambioSoles(idTabCVME)}>
                                            </div>
                                            <div class="form-group">
                                                <label for="TipoCambio">Tipo de Cambio</label>
                                                <input type="number" class="form-control required" id="TipoCambio_${idTabCVME}" onkeypress=${()=>CambioSoles(idTabCVME)}>
                                            </div>
                                            <div class="form-group">
                                                <label for="Soles">Soles</label>
                                                <input type="number" class="form-control required" id="Soles_${idTabCVME}" onkeypress=${()=>CambioMonto(idTabCVME)}>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> 
                        </div>
                    </div>
                    <div class="row pull-right"> 
                        <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-info" id="btnGuardar" onclick=${()=>GuardarCompraVentaME(variables,fecha_actual,idTabCVME)}>Guardar</button>
                    </div>
                </div>
                
            </div>`

    //var modal_proceso = document.getElementById('modal-proceso')
    //empty(modal_proceso).appendChild(el)
    //$('#modal-proceso').modal()
    $('#tab_'+idTabCVME).html(el)

    $('#modal-superior').on('hidden.bs.modal', function () {

        if(global.objCliente !='' && global.objCliente){
            //console.log(global.objCliente) 
            global.variablesCVME[idTabCVME].Id_ClienteProveedor = global.objCliente.Id_ClienteProveedor
            $("#Cod_TipoDocumentoBuscar_"+idTabCVME).val(global.objCliente.Cod_TipoDocumento)
            $("#txtNombreCliente_"+idTabCVME).val(global.objCliente.Cliente)
            $("#Nro_DocumentoBuscar_"+idTabCVME).val(global.objCliente.Nro_Documento)
            $("#txtNombreCliente_"+idTabCVME).attr("data-id",global.objCliente.Id_ClienteProveedor)


            $("#Nro_DocumentoBuscar_"+idTabCVME).bind("keypress", function(event){
                event.preventDefault();
                event.stopPropagation();
            });
            
            $("#txtNombreCliente_"+idTabCVME).bind("keypress", function(event){
                event.preventDefault();
                event.stopPropagation();
            });
           
            $("#Nro_DocumentoBuscar_"+idTabCVME).attr("disabled",true);
            $("#txtNombreCliente_"+idTabCVME).attr("disabled",true); 
            $("#Cod_TipoDocumentoBuscar_"+idTabCVME).attr("disabled",true);
        }
    })

    

    TraerCuentaBancariaEntidadFinanciera(idTabCVME)
    ObservacionesXML(variables.diagramas,idTabCVME)
}


function CerrarTabCVME(idTab){ 
    $('#tab_'+idTab).remove()
    $('#id_'+idTab).parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show');
    delete global.variablesCVME[idTab]
}

function LlenarCuenta(cuenta,idSelect){
    var el = yo`
        ${cuenta.map(e => yo`
             <option value="${e.Cod_CuentaBancaria}">${e.Des_CuentaBancaria}</option>
        `)}`   
    $("#"+idSelect).html('')
    $("#"+idSelect).html(el)
}


//var Id_ClienteProveedor = null

function CambioNroDocumento(e,idTab){  
    if(e.which == 46 || e.which == 8){ 
        if(global.variablesCVME[idTab].flag_cliente){
            $("#Nro_DocumentoBuscar_"+idTab).val("");
            $("#txtNombreCliente_"+idTab).val(""); 
            global.variablesCVME[idTab].Id_ClienteProveedor=null
            global.variablesCVME[idTab].flag_cliente=false
        }
    }   
}

function KeyPressClienteDoc(idTab){  
    switch(($('#Nro_DocumentoBuscar_'+idTab).val().trim().length)+1){
        case 8:
            $("#Cod_TipoDocumentoBuscar_"+idTab).val("1")
            break;
        case 11:
            $("#Cod_TipoDocumentoBuscar_"+idTab).val("6")
            break;
    }
   
}

function EditarCliente(idTab){ 
    if(!arrayValidacion.includes(global.variablesCVME[idTab].Id_ClienteProveedor))
        global.variablesCVME[idTab].flag_cliente = true
    else
        global.variablesCVME[idTab].flag_cliente=false
    

    $("#Nro_DocumentoBuscar_"+idTab).unbind("keypress");
    $("#txtNombreCliente_"+idTab).unbind("keypress");

    $("#Nro_DocumentoBuscar_"+idTab).attr("disabled",false);
    $("#txtNombreCliente_"+idTab).attr("disabled",false);
    $("#Cod_TipoDocumentoBuscar_"+idTab).attr("disabled",false);
}

function CambioClienteDoc(idTab){
    if($("#Cod_TipoDocumentoBuscar_"+idTab).val()=="1" || $("#Cod_TipoDocumentoBuscar_"+idTab).val()=="6"){
        $("#Nro_DocumentoBuscar_"+idTab).addClass("required")
        $("#Nro_DocumentoBuscar_"+idTab).css("border-color","red");
    }else{
        $("#Nro_DocumentoBuscar_"+idTab).css("border-color","");
        $("#Nro_DocumentoBuscar_"+idTab).removeClass("required",false)
    }
}


function CambioSoles(idTab){ 
    $("#Soles_"+idTab).val(parseFloat($("#Monto_"+idTab).val())*parseFloat($("#TipoCambio_"+idTab).val()))
}

function CambioMonto(idTab){
    $("#Monto_"+idTab).val(parseFloat($("#Soles_"+idTab).val())/parseFloat($("#TipoCambio_"+idTab).val()))
}
 

function getValueXML(xmlDoc, TAG) {
    if (xmlDoc.getElementsByTagName(TAG).length > 0 && xmlDoc.getElementsByTagName(TAG)[0].childNodes.length > 0) {
        return xmlDoc.getElementsByTagName(TAG)[0].childNodes[0].nodeValue
    } else {
        return ''
    }
}

function ObservacionesXML(diagrama,idTab) {
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
    var obs_xml = document.getElementById('obs_body_xml_'+idTab)
    empty(obs_xml).appendChild(el) 
}


function RecuperarDatosClientePorNroDoc(idTab){
    if($("#Nro_DocumentoBuscar_"+idTab).val().trim().length>0){
        var Nro_Documento = $("#Nro_DocumentoBuscar_"+idTab).val()
        var Cod_TipoDocumento = $("#Cod_TipoDocumentoBuscar_"+idTab).val()
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
            if (res.respuesta == 'ok' && res.data.cliente.length>0) {
                $("#txtNombreCliente_"+idTab).val(res.data.cliente[0].Cliente)
                $("#txtNombreCliente_"+idTab).focus()
                global.variablesCVME[idTab].Id_ClienteProveedor = res.data.cliente[0].Id_ClienteProveedor
                $("#Nro_DocumentoBuscar_"+idTab).bind("keypress", function(event){
                    event.preventDefault();
                    event.stopPropagation();
                });

                $("#txtNombreCliente_"+idTab).bind("keypress", function(event){
                    event.preventDefault();
                    event.stopPropagation();
                });

              
                $("#Nro_DocumentoBuscar_"+idTab).attr("disabled",true);
                $("#txtNombreCliente_"+idTab).attr("disabled",true); 
                $("#Cod_TipoDocumentoBuscar_"+idTab).attr("disabled",true);
            }
            else{

                global.variablesCVME[idTab].Id_ClienteProveedor = null
                $("#txtNombreCliente_"+idTab).val("")  
                $("#txtNombreCliente_"+idTab).attr("data-id",null)

                $("#Nro_DocumentoBuscar_"+idTab).unbind("keypress");
                $("#txtNombreCliente_"+idTab).unbind("keypress"); 

                $("#Nro_DocumentoBuscar_"+idTab).attr("disabled",false);
                $("#txtNombreCliente_"+idTab).attr("disabled",false); 
                $("#Cod_TipoDocumentoBuscar_"+idTab).attr("disabled",false);

                //BuscarCliente("txtNombreCliente","Nro_DocumentoBuscar","002")
            }
        }).catch(function (e) {
            global.variablesCVME[idTab].Id_ClienteProveedor = null
            $("#txtNombreCliente_"+idTab).val("")  
            $("#txtNombreCliente_"+idTab).attr("data-id",null)

            $("#Nro_DocumentoBuscar_"+idTab).unbind("keypress");
            $("#txtNombreCliente_"+idTab).unbind("keypress"); 

            $("#Nro_DocumentoBuscar_"+idTab).attr("disabled",false);
            $("#txtNombreCliente_"+idTab).attr("disabled",false); 
            $("#Cod_TipoDocumentoBuscar_"+idTab).attr("disabled",false);
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
        });
    }
}
 


function CambioTipoDestino(idTab) {
    if ($('input[name=TipoDestino_'+idTab+']:checked').val() == 'c') {
        $('#formBanco_'+idTab).hide() 
    } else {
        $('#formBanco_'+idTab).show()
    }
}

function CambioCompraVentaME(idTab) {
    if ($('input[name=optionCV_'+idTab+']:checked').val() == 'c') {
        $('#id_'+idTab).text("Compra ME") 
    } else {
        $('#id_'+idTab).text("Venta ME")
    }
}
 

function GuardarCompraVentaME(variables,fecha_actual,idTab){
    if(ValidacionCampos("modal_error_"+idTab,"modal_form_"+idTab)){
        run_waitMe($('#main-contenido'), 1, "ios","Registrando operación...");
        if ($('input[name=TipoDestino_'+idTab+']:checked').val() == 'c') {
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
            var Cliente = $("#txtNombreCliente_"+idTab).val()
            var _nom_moneda = $("#Cod_Moneda_"+idTab).val() == "USD" ? "DOLARES" : "EUROS";
            
            var Cod_TipoComprobante = 'CV'
            var Serie = $("#Serie_"+idTab).val()
            var Numero = $("#Numero_"+idTab).val()
            var Fecha = fecha_actual
            var Tipo_Cambio = $("#TipoCambio_"+idTab).val()
            var Ingreso = null
            var Cod_MonedaIng = null
            var Egreso = null
            var Cod_MonedaEgr = null
            var Flag_Extornado = 0
            var Fecha_Aut = fecha_actual
            var Id_MovimientoRef=0

            if ($('input[name=optionCV_'+idTab+']:checked').val() == 'c') {
                Des_Movimiento = "Compra ME " +_nom_moneda + " : " +
                parseFloat($("#Monto_"+idTab).val()).toFixed(2) + " T/C: " + parseFloat($("#TipoCambio_"+idTab).val()).toFixed(3) + " SOLES: " + parseFloat($("#Soles_"+idTab).val()).toFixed(3);
                Ingreso = parseFloat($("#Monto_"+idTab).val()).toFixed(3)
                Cod_MonedaIng = $("#Cod_Moneda_"+idTab).val()
                Egreso = $("#Soles_"+idTab).val()
                Cod_MonedaEgr = 'PEN'
            }else{
                Des_Movimiento = "Venta ME " +_nom_moneda + " : " +
                parseFloat($("#Monto_"+idTab).val()).toFixed(2) + " T/C: " + parseFloat($("#TipoCambio_"+idTab).val()).toFixed(2) + " SOLES: " + parseFloat($("#Soles_"+idTab).val()).toFixed(2);
                Ingreso = parseFloat($("#Soles_"+idTab).val()).toFixed(3)
                Cod_MonedaIng = 'PEN'
                Egreso = $("#Monto_"+idTab).val()
                Cod_MonedaEgr = $("#Cod_Moneda_"+idTab).val()
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
                    Id_ClienteProveedor: global.variablesCVME[idTab].Id_ClienteProveedor,
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
            //console.log(parametros)
            fetch(URL+'/compra_venta_moneda_extranjera_api/guardar_compra_venta_me', parametros)
            .then(req => req.json())
            .then(res => {
                $('#main-contenido').waitMe('hide')
                if (res.respuesta == 'ok') {               
                    toastr.success('Se registro correctamente el movimiento','Confirmacion',{timeOut: 5000}) 
                    RefrescarCompraVentaME(true,idTab)
                    //refrescar_movimientos()
                }
                else{
                    toastr.error('No se pudo registrar correctamente el movimiento','Error',{timeOut: 5000}) 
                }
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
        }else{
            var OBS = '<Registro>'
            for (var i = 0; i < variables.diagramas.length; i++) {
                OBS += '<' + variables.diagramas[i].Cod_Elemento + '>' + document.getElementById(variables.diagramas[i].Cod_Elemento).value + '</' + variables.diagramas[i].Cod_Elemento + '>'
            }
            var Obs_Movimiento = OBS+'</Registro>'
            var Id_MovimientoCuenta = -1
            var Cod_CuentaBancaria = null
            var Nro_Operacion = $("#Operacion_"+idTab).val()
            var Des_Movimiento='SALIDA: COMPRA/VENTA DE MONEDA EXTRANJERA BANCOS'
            var Cod_TipoOperacionBancaria='010'
            var Fecha = $("#Fecha_"+idTab).val()
            var Monto = null
            var TipoCambio = $("#TipoCambio_"+idTab).val()
            var Cod_Caja = '100'
            var Cod_Turno = 'T0002'
            var Cod_Plantilla=''
            var Nro_Cheque=''
            var Beneficiario=''
            var Id_ComprobantePago=0
            if ($('input[name=optionCV_'+idTab+']:checked').val() == 'c') {
                Cod_CuentaBancaria = $("#Cod_CuentaSoles_"+idTab).val()
                Monto = -1 * parseFloat($("#Soles_"+idTab).val())
            }else{
                Cod_CuentaBancaria = $("#Cod_CuentaME_"+idTab).val()
                Monto = -1 * parseFloat($("#Monto_"+idTab).val())
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
                    if ($('input[name=optionCV_'+idTab+']:checked').val() == 'c') {
                        Cod_CuentaBancaria = $("#Cod_CuentaME_"+idTab).val()
                        Monto = -1 * parseFloat($("#Monto_"+idTab).val())
                    }else{
                        Cod_CuentaBancaria = $("#Cod_CuentaSoles_"+idTab).val()
                        Monto = -1 * parseFloat($("#Soles_"+idTab).val())
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
                        $('#main-contenido').waitMe('hide');
                        if (res.respuesta == 'ok') {             
                            toastr.success('Se registro correctamente el movimiento','Confirmacion',{timeOut: 5000}) 
                            RefrescarCompraVentaME(true,idTab)
                            //refrescar_movimientos()
                        }
                        else{
                            toastr.error('No se pudo registrar correctamente el movimiento','Error',{timeOut: 5000}) 
                        }
                    }).catch(function (e) {
                        console.log(e);
                        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                        $('#main-contenido').waitMe('hide');
                    });
        

                }
                else{
                    toastr.error('No se pudo registrar correctamente el movimiento','Error',{timeOut: 5000})  
                }
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });

        }
    }
}

function RefrescarCompraVentaME(_escritura,idTab) { 
    LimpiarEventoModales()
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
                    RefrescarTraerSiguienteNumeroComprobante(_escritura, res.data.comprobante_caja[0].Serie,idTab)
                else  
                    RefrescarTraerSiguienteNumeroComprobante(_escritura,'',idTab) 

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
 
function NuevoCompraVentaME(_escritura, caja) { 
    LimpiarEventoModales()
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

function RefrescarTraerSiguienteNumeroComprobante(_escritura, Serie, idTab) {
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

                RefrescarVer(_escritura, Serie,variables,fecha_format,res.empresa,idTab)  
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

                Ver(_escritura, Serie,variables,fecha_format,res.empresa)  
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



function TraerCuentaBancariaEntidadFinanciera(idTab) {
    var Cod_EntidadFinanciera = $("#SelectEntidadFinanciera_"+idTab).val() 
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
                LlenarCuenta(res.data.cuenta_bancaria_pen,"Cod_CuentaSoles_"+idTab)
                LlenarCuenta(res.data.cuenta_bancaria_usd,"Cod_CuentaME_"+idTab)
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