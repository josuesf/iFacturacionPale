var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../../constantes_entorno/constantes'
import {BloquearControles,LimpiarEventoModales} from '../../../../utility/tools' 
import { BuscarCuentasPendientes } from '../../modales/cuentas'
import { NuevoCliente, BuscarCliente } from '../../modales' 

var arrayValidacion = [null,'null','',undefined]
var cantidad_tabs = 0
global.variablesPC = {}
//var flag_cliente = false 

function VerCuentas(variables,fecha_actual,CodLibro) {
    global.objCliente = ''

    cantidad_tabs++
    const idTabPC = "PC_"+cantidad_tabs
    global.variablesPC[idTabPC]={idTab:idTabPC,flag_cliente:false}

    var tab = yo`
    <li class="" ><a href="#tab_${idTabPC}" data-toggle="tab" aria-expanded="false" id="id_${idTabPC}">${CodLibro=='08'?'CUENTAS POR PAGAR':'CUENTAS POR COBRAR'} <a style="padding-left: 10px;"  onclick=${()=>CerrarTabPC(idTabPC)} class="btn"><i class="fa fa-close text-danger"></i></a></a></li>`


    //flag_cliente = false 
    var el = yo`
    <div class="tab-pane" id="tab_${idTabPC}">
        <div class="panel">
            <div class="panel-body" id="modal_form_ingreso_${idTabPC}">
                <div class="modal fade" id="modal_observaciones_${idTabPC}">
                    <div class="modal-dialog modal-sm" > 
                        <div class="modal-content" id="modal_obs_body_${idTabPC}"></div>
                    </div> 
                </div>
                <div class="row">
                    <div class="alert alert-callout alert-danger hidden" id="modal_error_ingreso_${idTabPC}">
                        <p>Es necesario llenar todos los campos requeridos y el Importe mayor a cero</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-8" id="div-cliente-cuentas_${idTabPC}">
                        <div class="card">
                            <div class="card-head">
                                <header> Cliente/Proveedor </header>
                                <div class="tools">
                                    <div class="btn-group">
                                        <a class="btn btn-icon-toggle btn-warning" onclick=${()=>EditarCliente(idTabPC)}><i class="fa fa-pencil"></i></a>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-4" id="divCodTipoDoc_${idTabPC}">
                                        <div class="form-group">
                                            <select id="Cod_TipoDoc_${idTabPC}" class="form-control input-sm">
                                                ${variables.dataDocumentos.map(e=>yo`<option style="text-transform:uppercase" value="${e.Cod_TipoDoc}">${e.Nom_TipoDoc}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-8" id="divNroDocumento_${idTabPC}">
                                        <div class="form-group">
                                            <input type="text" id="Nro_Documento_${idTabPC}"  onkeypress=${()=>KeyPressClienteDoc(idTabPC)} onkeydown=${()=>CambioNroDocumento(event,idTabPC)} onblur="${() => BuscarClienteDoc(CodLibro,idTabPC)}" class="form-control input-sm required" placeholder="Nro Documento">
                                        </div>
                                    </div>
                               
                                </div>
                                <div class="row">
                                    <div class="col-md-12" id="divCliente_${idTabPC}">
                                        <div class="form-group">
                                            <input type="text" id="Cliente_${idTabPC}" class="form-control input-sm required" data-id=null placeholder="Nombre cliente">
                                            <div class="form-control-line"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12" id="divDireccion_${idTabPC}">
                                        <div class="form-group"> 
                                            <input type="text" id="Direccion_${idTabPC}" class="form-control input-sm required" placeholder="Direccion">
                                            <div class="form-control-line"></div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                             
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="panel panel-default" id="divCabecera_${idTabPC}">
                            <div class="panel-heading text-center">
                                <div class="row">
                                    <h4 class="box-title" id="Ruc_Empresa"><strong> R.U.C. ${variables.empresa.RUC}</strong></h4>
                                </div>
                                <div class="row">
                                    <div class="col-sm-12">
                                        <div class="form-group">
                                            <select id="Cod_TipoComprobante_${idTabPC}" class="form-control selectPalerp" onchange=${()=>BloquearControles(event)}>
                                                 <option style="text-transform:uppercase" value=${CodLibro=='08'?'RI':'RE'}>${CodLibro=='08'?'RECIBO DE EGRESO':'RECIBO DE INGRESO'}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div> 
                                
                                <div class="row">
                                    <div class="col-md-5" id="divSerie_${idTabPC}">
                                        <div class="form-group">
 
                                            <select class="form-control input-sm" id="Serie_${idTabPC}" onchange=${()=>BloquearControles(event)}>
                                                ${variables.dataComprobante.map(e=>yo`<option style="text-transform:uppercase" value="${e.Serie}">${e.Serie}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-7" id="divNumero_${idTabPC}">
                                        <div class="form-group">
                                            <input type="text" class="form-control input-sm required" id="Numero_${idTabPC}" value="00000000${variables.dataMov[0].Numero}" onkeypress=${()=>BloquearControles(event)}>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-12">
                        <div class="panel panel-default">
                            <div class="panel-body">
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="col-sm-4" id="divContado_${idTabPC}">
                                                    <div class="radio-inline radio-styled radio-primary">
                                                        <label>
                                                            <input type="radio" value="contado" id="optCredito_${idTabPC}" name="optCredito_${idTabPC}"  checked> <span> Contado</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                 
                                                <div class="col-sm-8" id="divOperacion_${idTabPC}">
                                                    <label id="lbCuentaCajaBanco_${idTabPC}">#Operacion</label>
                                                    <div class="form-group">
                                                        <select class="form-control input-sm" id="Cod_CuentaBancaria_${idTabPC}" onchange=${()=>CambioCodCuentaBancaria(CodLibro,idTabPC)}> 
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-4" id="divFormasPago_${idTabPC}">
                                                <div class="form-group">
                                                    <select class="form-control input-sm" id="Cod_FormaPago_${idTabPC}" onchange="${()=>CambioFormasPago(CodLibro,idTabPC)}"> 
                                                        ${variables.dataFormasPago.map(e=>yo`<option style="text-transform:uppercase" value="${e.Cod_FormaPago}">${e.Nom_FormaPago}</option>`)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-8" id="divCuentaCajaBancos_${idTabPC}">
                                                <div class="form-group" style="display: flex;">
                                                    <select class="form-control input-sm select-preserve" id="Cuenta_CajaBancos_${idTabPC}"> 
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="row">
                                            <div class="col-sm-4" id="divMoneda_${idTabPC}">
                                                <div class="form-group">
                                                    <b>Moneda: </b>
                                                    <select id="Cod_Moneda_${idTabPC}" class="form-control input-sm" onchange=${()=>CambioMoneda(CodLibro,idTabPC)}>
                                                        ${variables.dataMonedas.map(e=>yo`<option style="text-transform:uppercase" value="${e.Cod_Moneda}">${e.Nom_Moneda}</option>`)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-sm-3" id="divTC_${idTabPC}">
                                                <div class="form-group">
                                                    <b>T/C: </b>
                                                    <input class="form-control input-sm" type="number" id="Tipo_Cambio_${idTabPC}" value="1.00">
                                                </div>
                                            </div>
                                            <div class="col-sm-5" id="divFecha_${idTabPC}">
                                                <div class="form-group">
                                                    <b>Fecha: </b>
                                                    <input type="date" class="form-control input-sm" id="Fecha_${idTabPC}" value="${fecha_actual}" onkeypress=${()=>TraerTipoCambio(CodLibro,idTabPC)}>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-12" id="divPlantilla_${idTabPC}" style="display:none">
                                                <div class="form-group">
                                                    <b>Plantilla: </b>
                                                    <select id="Cod_Plantilla_${idTabPC}" id="" class="form-control input-sm">
                                                      
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-4 col-md-4">
                                        <div class="panel panel-default">
                                            <div class="panel-body">
                                                <div class="row">
                                                    <div class="col-md-8 col-sm-8">
                                                        <div class="checkbox checkbox-inline checkbox-styled">
                                                            <label> 
                                                                <input type="checkbox" id="optTodoFechas_${idTabPC}" checked onchange=${()=>CambioTodoFechas(idTabPC)}> <span> Todo</span> 
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-4 col-sm-4">          
                                                        <button class="btn btn-info" type="button" onclick=${()=>BuscarPorFecha(CodLibro,idTabPC)}>Ver</button>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-6 col-md-6">
                                                        <div class="form-group">
                                                            <b>Desde: </b>
                                                            <input type="date" id="FechaInicio_${idTabPC}" value="${fecha_actual}" class="form-control input-sm">
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6 col-md-6">
                                                        <div class="form-group">
                                                            <b>Hasta: </b>
                                                            <input type="date" id="FechaFin_${idTabPC}" value="${fecha_actual}" class="form-control input-sm">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-4 col-md-4">
                                        <div class="panel panel-default">
                                            <div class="panel-body">
                                                <div class="row">
                                                    <div class="col-md-8 col-sm-8">
                                                        <div class="checkbox checkbox-inline checkbox-styled">
                                                            <label> 
                                                                <input type="checkbox" id="optTodoVencimiento_${idTabPC}" checked onchange=${()=>CambioTodoVencimiento(idTabPC)}><span> Todo</span> 
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-4 col-sm-4">
                                                        <button class="btn btn-info" type="button" onclick=${()=>BuscarPorFecha(CodLibro,idTabPC)}>Ver</button>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-6 col-sm-6">
                                                        <div class="radio-inline radio-styled radio-primary">
                                                            <label> 
                                                                <input type="radio" name="optRadios_${idTabPC}" id="optRadiosPorVencer_${idTabPC}" value="PorVencer"><span> Por vencer</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6 col-sm-6">
                                                        <div class="radio-inline radio-styled radio-primary">
                                                            <label> 
                                                                <input type="radio" name="optRadios_${idTabPC}" id="optRadiosVencidos_${idTabPC}" value="Vencidos"><span> Vencidos</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-4 col-md-4">
                                        <div class="panel panel-default">
                                            <div class="panel-body">
                                                <div class="row">
                                                    <div class="col-md-4 col-sm-4">
                                                        <div class="checkbox checkbox-inline checkbox-styled">
                                                            <label> 
                                                                <input type="checkbox" id="optTodoLicitacion_${idTabPC}" checked onchange=${()=>CambioTodoLicitacion(idTabPC)}><span> Todo</span> 
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-8 col-sm-8">
                                                        <div class="checkbox checkbox-inline checkbox-styled">
                                                            <label> 
                                                                <input type="checkbox"><span> Solo Documentos Formales</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-sm-8 col-md-8">
                                                        <div class="form-group"> 
                                                            <select class="form-control input-sm" id="Cod_Licitacion_${idTabPC}"></select>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-4 col-md-4">
                                                        <button class="btn btn-info" type="button" onclick=${()=>BuscarPorFecha(CodLibro,idTabPC)}>Ver</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-12">
                        <div class="panel panel-default">
                            <div class="panel-body">
                                <div class="row">
                                    <div class="table-responsive" id="divTablaComprobantes_${idTabPC}">

                                        <table id="tablaComprobantes_${idTabPC}" class="table table-bordered table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Fecha</th>
                                                    <th>Vencimiento</th> 
                                                    <th>Documento</th>
                                                    <th>Total Faltante</th>
                                                    <th>Amortizar</th>
                                                    <th>Saldo</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            </tbody>
                                        </table>

                                    </div>
                                </div>
                                <div class="row" id="divAnulado_${idTabPC}" style="display:none">
                                    <div class="col-md-12 text-center">
                                        <div class="small-box bg-red">
                                            <div class="inner">
                                                <h3 id="laAnulado_${idTabPC}">EXTORNADO</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="panel-footer">
                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="form-group row">
                                            <label class="col-sm-4 col-form-label">Comentarios:</label>
                                            <div class="col-sm-8">
                                                <input type="text" id="Comentarios_${idTabPC}" class="form-control-plaintext input-sm form-control">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-8">

                                        <div class="form-group row">
                                            <label class="col-sm-1 col-form-label">Total</label>
                                            <div class="col-sm-10"> 
                                                <div class="col-sm-4">
                                                    <input type="number" id="Total_${idTabPC}" class="form-control">
                                                </div>
                                                <div class="col-sm-4">
                                                    <input type="number" id="TotalAmortizar_${idTabPC}" class="form-control">
                                                </div>
                                                <div class="col-sm-4">
                                                    <input type="number" id="TotalSaldo_${idTabPC}" class="form-control">
                                                </div>
                                            </div>  
                                        </div>
 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            <div class="modal-footer">
                <button class="btn btn-primary" onclick=${()=>VerGuardar(CodLibro,idTabPC)}>${CodLibro=='08'?'Pagar':'Cobrar'}</button>
                <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>`
    //var ingreso = document.getElementById('modal-proceso')
    //empty(ingreso).appendChild(el)
    //$('#modal-proceso').modal()  

    $("#tabs").append(tab)
    $("#tabs_contents").append(el)
    $("#id_"+idTabPC).click()

    /*$("#Nro_Documento").tagsinput({
        maxTags: 1
    });

    $("#Cliente").tagsinput({
        maxTags: 1
    })

    $("#Direccion").tagsinput({
        maxTags: 1
    })

    $('#Nro_Documento').on('beforeItemRemove',function(event) {
        if(!arrayValidacion.includes($("#Cliente").attr("data-id"))){ 
            $("#Cliente").tagsinput('removeAll')
            $("#Cliente").attr("data-id",null)
            $("#Direccion").tagsinput('removeAll') 
        }
    });

    $('#Nro_Documento').on('beforeItemAdd', function(event) {
        $("#Nro_Documento").tagsinput('removeAll') 
        $("#Cliente").tagsinput('removeAll') 
        $("#Cliente").attr("data-id",null)
        $("#Direccion").tagsinput('removeAll') 
    });

    $('#Nro_Documento').on('itemAdded', function(event) { 
        console.log("add item")
        if($("#Nro_Documento").val().trim()!=''){
            BuscarClienteDoc(CodLibro)
        }  
        KeyPressClienteDoc()
     });*/

    CambioFormasPago(CodLibro,idTabPC)
    if(global.objCliente =='')
        BuscarCuentasPendientes(CodLibro,0,'1753-01-01 00:00:00','9999-12-31 23:59:59.997')
    else{
        $("#Cod_TipoDoc_"+idTabPC).val(global.objCliente.Cod_TipoDocumento)
        
        /*$("#Cliente").tagsinput('add',global.objCliente.Nom_Cliente)
        $("#Nro_Documento").tagsinput('add',global.objCliente.Doc_Cliente)
        $("#Direccion").tagsinput('add',global.objCliente.Direccion_Cliente)*/



        $("#Cliente_"+idTabPC).val(global.objCliente.Nom_Cliente)
        $("#Nro_Documento_"+idTabPC).val(global.objCliente.Doc_Cliente)
        $("#Direccion_"+idTabPC).val(global.objCliente.Direccion_Cliente)
        $("#Cliente_"+idTabPC).attr("data-id",global.objCliente.Id_Cliente)
        $("#Cod_Moneda_"+idTabPC).val(global.objCliente.Cod_Moneda)

        $("#Nro_Documento_"+idTabPC).bind("keypress", function(event){
            event.preventDefault();
            event.stopPropagation();
        });
        
        $("#Cliente_"+idTabPC).bind("keypress", function(event){
            event.preventDefault();
            event.stopPropagation();
        });
        
        $("#Direccion_"+idTabPC).bind("keypress", function(event){
            event.preventDefault();
            event.stopPropagation();
        });
        
        $("#Nro_Documento_"+idTabPC).attr("disabled",true);
        $("#Cliente_"+idTabPC).attr("disabled",true);
        $("#Direccion_"+idTabPC).attr("disabled",true);
        $("#Cod_TipoDoc_"+idTabPC).attr("disabled",true);

        CargarLicitacionesCliente(global.objCliente.Id_Cliente)
        BuscarPorFecha(CodLibro,idTabPC)
    }

    
    $('#modal-otros-procesos').on('hidden.bs.modal', function () { 
        if(global.objCliente!=''){ 
            $("#Cod_TipoDoc_"+idTabPC).val(global.objCliente.Cod_TipoDocumento)
            $("#Cliente_"+idTabPC).val(global.objCliente.Nom_Cliente)
            $("#Nro_Documento_"+idTabPC).val(global.objCliente.Doc_Cliente)
            $("#Direccion_"+idTabPC).val(global.objCliente.Direccion_Cliente)

            $("#Nro_Documento_"+idTabPC).bind("keypress", function(event){
                event.preventDefault();
                event.stopPropagation();
            });
            
            $("#Cliente_"+idTabPC).bind("keypress", function(event){
                event.preventDefault();
                event.stopPropagation();
            });
            
            $("#Direccion_"+idTabPC).bind("keypress", function(event){
                event.preventDefault();
                event.stopPropagation();
            });
            
            $("#Nro_Documento_"+idTabPC).attr("disabled",true);
            $("#Cliente_"+idTabPC).attr("disabled",true);
            $("#Direccion_"+idTabPC).attr("disabled",true);
            $("#Cod_TipoDoc_"+idTabPC).attr("disabled",true);

            /*$("#Cliente").tagsinput('removeAll')
            $("#Nro_Documento").tagsinput('removeAll')
            $("#Direccion").tagsinput('removeAll')

            $("#Cliente").tagsinput('add',global.objCliente.Nom_Cliente)
            $("#Nro_Documento").tagsinput('add',global.objCliente.Doc_Cliente)
            $("#Direccion").tagsinput('add',global.objCliente.Direccion_Cliente)*/

            $("#Cliente_"+idTabPC).attr("data-id",global.objCliente.Id_Cliente)
            $("#Cod_Moneda_"+idTabPC).val(global.objCliente.Cod_Moneda)
            CargarLicitacionesCliente(global.objCliente.Id_Cliente)
            BuscarPorFecha(CodLibro,idTabPC)
        }
    }) 
    
    

    CambioTodoFechas(idTabPC)
    CambioTodoVencimiento(idTabPC)
    CambioTodoLicitacion(idTabPC)

    $("#Cuenta_CajaBancos_"+idTabPC).combobox()
    $("#Cuenta_CajaBancos_"+idTabPC).parent().find('input.ui-widget').blur(function(){ 
        TraerPorCuentaOperacion(idTabPC)
    })
 
}

function AgregarTabla(comprobantes,idTab){
    var el = yo`<table id="tablaComprobantes_${idTab}" class="table table-bordered table-striped">
    <thead>
        <tr>
            <th>Fecha</th>
            <th>Vencimiento</th> 
            <th>Documento</th>
            <th>Total Faltante</th>
            <th>Amortizar</th>
            <th>Saldo</th>
        </tr>
    </thead>
    <tbody>
        ${comprobantes.map((c,index) => yo`
        <tr>
            <td class="hidden idComprobante">${c.id_ComprobantePago}</td>
            <td class="FechaEmision">${c.FechaEmision}</td>
            <td class="FechaVencimiento">${c.FechaVencimiento}</td> 
            <td class="hidden Dias">${c.Dias}</td> 
            <td class="Documento">${c.Documento}</td> 
            <td class="TotalFaltante">${c.TotalFaltante}</td> 
            <td class="Amortizar"><input class="form-control" type="number" value="0.00" onkeypress=${()=>CambioAmortizar(idTab)}></td> 
            <td class="Saldo">${c.TotalFaltante}</td> 
        </tr>`)}
    </tbody>

</table>`
    empty(document.getElementById('divTablaComprobantes_'+idTab)).appendChild(el);
}

function CargarModalConfirmacionCuentas(CodLibro,idTab){
    var el = yo`
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
                <h4 class="modal-title"> Confirmacion </h4>
            </div>
            <div class="modal-body">
                <p>Esta seguro que desea realizar esta operacion?</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" onclick=${()=>AceptarConfirmacionCuenta(CodLibro,idTab)}>Aceptar</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>`


    var modal_proceso = document.getElementById('modal-alerta');
    empty(modal_proceso).appendChild(el);
    $('#modal-alerta').modal()
}

function LlenarCuentaBancaria(cuentas,CodLibro,idTab){
    var html = ''
    for(var i=0; i<cuentas.length; i++){
        html = html+'<option value="'+cuentas[i].Cod_CuentaBancaria+'">'+cuentas[i].Des_CuentaBancaria+'</option>'
    }
     
    $("#Cod_CuentaBancaria_"+idTab).html('')
    $("#Cod_CuentaBancaria_"+idTab).html(html)
    CambioCodCuentaBancaria(CodLibro,idTab)
}

function LlenarCuentaBancaria_(cuentas,CodLibro,idTab){
    var html = ''
    for(var i=0; i<cuentas.length; i++){
        html = html+'<option value="'+cuentas[i].NroCuenta_Bancaria+'">'+cuentas[i].CuentaBancaria+'</option>'
    }
     
    $("#Cod_CuentaBancaria_"+idTab).html('')
    $("#Cod_CuentaBancaria_"+idTab).html(html)
    CambioCodCuentaBancaria(CodLibro,idTab) 
}

function LlenarCheques(cheques,idTab){
    var html = '<option value="">Seleccione una opcion</option>'
    for(var i=0; i<cheques.length; i++){
        html = html+'<option value="'+cheques[i].Id_MovimientoCuenta+'">'+cheques[i].Des_Movimiento+'</option>'
    }
     
    $("#Cuenta_CajaBancos_"+idTab).html('')
    $("#Cuenta_CajaBancos_"+idTab).html(html) 
}

function KeyPressClienteDoc(idTab){ 
    //console.log("keypress",$('#Nro_Documento').val().trim().length)
    switch(($('#Nro_Documento_'+idTab).val().trim().length)+1){
        case 8:
            $("#Cod_TipoDoc_"+idTab).val("1")
            break;
        case 11:
            $("#Cod_TipoDoc_"+idTab).val("6")
            break;
    }  
}


function CerrarTabPC(idTab){ 
    $('#tab_'+idTab).remove()
    $('#id_'+idTab).parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show');
    delete global.variablesPC[idTab]
}

function EsValido(idTab){
    var MontoMaximo = 0
     
   if($("#divCuentaCajaBancos_"+idTab).css("display")=="block" && $("#Cuenta_CajaBancos_"+idTab).val()!='' && $("#Cuenta_CajaBancos_"+idTab).val()!=null){
       try{
            MontoMaximo = parseFloat($("#Cuenta_CajaBancos_"+idTab+" option:selected").text().split('[').join('').split(']')[0])//split('[', ']')[1])
       }catch(e){
            MontoMaximo = 0
       }
   }

   if( $("#Cliente_"+idTab).attr("data-id")!=null &&  $("#Cliente_"+idTab).attr("data-id")!=''){
       if($("#tablaComprobantes_"+idTab+" > tbody tr").length > 0){
           if(MontoMaximo==0 || parseFloat($("#TotalAmortizar_"+idTab).val())<= MontoMaximo){
               if(parseFloat($("#TotalAmortizar_"+idTab).val())!=0){
                    return true
               }else{
                    toastr.error('El Monto a Amortizar debe ser Mayor a CERO (0.00).','Error',{timeOut: 5000})
                    $("#TotalAmortizar_"+idTab).focus()
               }    
           }else{
               if($("#Cod_FormaPago_"+idTab).val().toString()=="998"){
                    toastr.error('Debe de selecionar un Pago Adelantado que sea superior o igual al Monto Total de Comprobante.','Error',{timeOut: 5000})
               }else{
                   if($("#Cod_FormaPago_"+idTab).val().toString()=="007"){
                        toastr.error('Debe de selecionar un Cheque que sea superior o igual al Monto Total de Comprobante.','Error',{timeOut: 5000})
                   }
               }
               $("#Cuenta_CajaBancos_"+idTab).focus()
           }
       }else{
            toastr.error('Debe ingresar como minimo un Detalle en el Comprobante.','Error',{timeOut: 5000})
       }
   }else{
        toastr.error('Debe selecionar un cliente si por defecto dejarlo en CLIENTES VARIOS.','Error',{timeOut: 5000})
        $("#Cliente_"+idTab).focus()
   }

   return false

}

function CalcularTotal(idTab){
    try{
        var SumaTotal = 0
        var SumaAmortiza = 0
        $('#tablaComprobantes_'+idTab+' > tbody tr').each(function () {

            SumaAmortiza += parseFloat($(this).find("td").eq(6).find("input").val())
            if((parseFloat($(this).find("td").eq(5).text()) - parseFloat($(this).find("td").eq(5).find("input").val()))>0)
                $(this).find("td").eq(7).text((parseFloat($(this).find("td").eq(5).text()) - parseFloat($(this).find("td").eq(5).find("input").val())))
            else
                $(this).find("td").eq(7).text("0.00")
            
            SumaTotal += parseFloat($(this).find("td").eq(5).text())            
        });

        $("#Total_"+idTab).val(SumaTotal)
        $("#TotalAmortizar_"+idTab).val(SumaAmortiza)
        $("#TotalFaltante_"+idTab).val(SumaTotal-SumaAmortiza)

    }catch(e){

    }
}

function CambioNroDocumento(e,idTab){ 
    if(e.which == 46 || e.which == 8){ 
        if(global.variablesPC[idTab].flag_cliente){
            $("#Nro_Documento_"+idTab).val("");
            $("#Cliente_"+idTab).val("");
            $("#Cliente_"+idTab).attr("data-id",null);
            $("#Direccion_"+idTab).val("");
            global.variablesPC[idTab].flag_cliente=false
        }
    }   
}


function EditarCliente(idTab){ 
    if(!arrayValidacion.includes($("#Cliente_"+idTab).attr("data-id")))
        global.variablesPC[idTab].flag_cliente = true
    else
        global.variablesPC[idTab].flag_cliente= false
    

    $("#Nro_Documento_"+idTab).unbind("keypress");
    $("#Cliente_"+idTab).unbind("keypress");
    $("#Direccion_"+idTab).unbind("keypress");

    $("#Nro_Documento_"+idTab).attr("disabled",false);
    $("#Cliente_"+idTab).attr("disabled",false);
    $("#Direccion_"+idTab).attr("disabled",false);
    $("#Cod_TipoDoc_"+idTab).attr("disabled",false);
}

function BuscarPorFecha(CodLibro,idTab){
    var Id_Cliente = $("#Cliente_"+idTab).attr("data-id")
    var Cod_Libro = CodLibro
    var FechaInicio = $("#optTodoFechas_"+idTab).is(":checked")?'1753-01-01 00:00:00':$("#FechaInicio_"+idTab).val()
    var FechaFin = $("#optTodoFechas_"+idTab).is(":checked")?'9999-12-31 23:59:59.997':$("#FechaFin_"+idTab).val()
    var Cod_Moneda = $("#Cod_Moneda_"+idTab).val()
    var Vencimiento = $("#optTodoVencimiento_"+idTab).is(":checked")?null:(($('input[name=optRadios_'+idTab+']:checked').val()=="PorVencer")?true:false)
    var Cod_Licitacion = $("#optTodoLicitacion_"+idTab).is(":checked")?null:$("#Cod_Licitacion_"+idTab).val()

    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Id_Cliente,
            Cod_Libro,
            FechaInicio,
            FechaFin,
            Cod_Moneda,
            Vencimiento,
            Cod_Licitacion
        })
    }
    fetch(URL + '/recibo_iegreso_api/get_cuentas_by_cobrar_pagar', parametros)
        .then(req => req.json())
        .then(res => { 
            if (res.respuesta == 'ok') {
                AgregarTabla(res.data.cuentas,idTab)
            } 
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
        });
    
}

function CambioMoneda(CodLibro,idTab){
    if($("#Cod_Moneda_"+idTab).val()!=null && $("#Cod_Moneda_"+idTab).val()!=""){
        if($("#Cod_Moneda_"+idTab).val()=="USD"){
            $("#divTC_"+idTab).css("display","block")
            TraerTipoCambio(CodLibro,idTab)
        }else{
            $("#divTC_"+idTab).css("display","none")
            $("#Tipo_Cambio_"+idTab).val("1")
        }
    }
}

function CambioTodoFechas(idTab){
    $("#FechaFin_"+idTab).attr("disabled",($("#optTodoFechas_"+idTab).is(":checked")))
    $("#FechaInicio_"+idTab).attr("disabled",($("#optTodoFechas_"+idTab).is(":checked")))
}

function CambioTodoLicitacion(idTab){
    $("#Cod_Licitacion_"+idTab).attr("disabled",($("#optTodoFechas_"+idTab).is(":checked")))
}

function CambioTodoVencimiento(idTab){
    if($("#optTodoVencimiento_"+idTab).is(":checked")){
        $('input[name=optRadios_'+idTab+']').attr("checked",false)
        $('input[name=optRadios_'+idTab+']').attr("disabled",true)
    }else{        
        $('#optRadiosPorVencer_'+idTab).attr("checked",true)
        $('#optRadiosVencidos_'+idTab).attr("checked",false)
        $('input[name=optRadios_'+idTab+']').attr("disabled",false)
    }
}

function CambioCodCuentaBancaria(CodLibro,idTab){
    var Cod_CuentaBancaria = $("#Cod_CuentaBancaria_"+idTab).val()
    var Beneficiario = $("#Cliente_"+idTab).val()
    var Cod_Libro = CodLibro

    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Cod_CuentaBancaria,
            Beneficiario,
            Cod_Libro
        })
    }
    fetch(URL + '/cuentas_bancarias_api/get_cheques_by_cuenta_cliente', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var cheques = res.data.cheques 
                LlenarCheques(cheques,idTab)
            } 
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
        });
}

function CambioAmortizar(idTab){
    CalcularTotal(idTab)
}

function CambioFormasPago(CodLibro,idTab){
    if($("#Cod_FormaPago_"+idTab).val()!=null && $("#Cod_FormaPago_"+idTab).val()!=""){
        var flagDisplay="none"
        if($("#Cod_FormaPago_"+idTab).val()!="008")
            flagDisplay = "block"
        
        $("#divOperacion_"+idTab).css("display",flagDisplay)
        $("#Cod_CuentaBancaria_"+idTab).css("display",flagDisplay)
        $("#divCuentaCajaBancos_"+idTab).css("display",flagDisplay)

        if($("#divOperacion_"+idTab).css("display")=="block"){
            switch ($("#Cod_FormaPago_"+idTab).val()) {
                case "007":
                    if(CodLibro=="08"){
                        $("#lbCuentaCajaBanco_"+idTab).text("# de Cheque: ")
                        TraerCuentaBancariaPorSucursal(CodLibro,idTab)
                    }else{
                        toastr.error('No Existe la Operacion de CHEQUE para ventas.\nSe debe de Depositar el Cheque eh ingresarlo como Deposito en Cuenta.','Error',{timeOut: 5000})
                        $("#Cod_FormaPago_"+idTab).val(null)
                    }
                    break 
                case "011":
                    $("#Cod_CuentaBancaria_"+idTab).css("display","block")
                    $("#lbCuentaCajaBanco_"+idTab).text("# de Operacion")
                    if(CodLibro=="08"){
                        TraerCuentasBancariasXIdClienteProveedor(CodLibro,idTab)
                    }else{
                        TraerCuentaBancariaPorSucursal(CodLibro,idTab)
                    }
                    break
                case "001":
                    $("#lbCuentaCajaBanco_"+idTab).text("# de Letra: ")
                    break
                case "005":
                    $("#lbCuentaCajaBanco_"+idTab).text("# de Tarjeta VISA: ")
                    break
                case "006":
                    $("#lbCuentaCajaBanco_"+idTab).text("# de Tarjeta MASTER CARD: ")
                    break
                case "004":
                    $("#lbCuentaCajaBanco_"+idTab).text("# de Orden de Pago: ")
                    break
                case "003":
                    $("#Cod_CuentaBancaria_"+idTab).css("display","block")
                    $("#lbCuentaCajaBanco_"+idTab).text("Seleccione Transferencia: ")
                    TraerCuentaBancariaPorSucursal()
                    break
                case "008":
                    $("#divOperacion_"+idTab).css("display","none")
                    $("#Cod_CuentaBancaria_"+idTab).css("display","none")
                    $("#divCuentaCajaBancos_"+idTab).css("display","none")
                    $("#divCabecera_"+idTab).css("pointer-events","auto")
                    break
                case "998":
                    $("#lbCuentaCajaBanco_"+idTab).text("Selecione Pago Adelantado: ")
                    TraerSaldoPagoAdelantado(idTab)
                    break
                default:
                    $("#lbCuentaCajaBanco_"+idTab).text("# de Operación: ")
                    break
            }
        }
    }
}

function TraerPorCuentaOperacion(idTab){ 
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Cod_CuentaBancaria:$("#Cod_CuentaBancaria_"+idTab).val(),
            Nro_Operacion:$("#Cuenta_CajaBancos_"+idTab+" option:selected").text()
        })
    }
    fetch(URL + '/cuentas_bancarias_api/get_by_cuenta_operacion', parametros)
        .then(req => req.json())
        .then(res => { 
            if (res.respuesta == 'ok') {
                var cuentas = res.data.cuentas
                if(cuentas.length > 0){
                    toastr.error('En la Cuenta: '+$("#Cod_CuentaBancaria_"+idTab+" option:selected").text()+' la Operacion N°: '+$("#Cuenta_CajaBancos_"+idTab+" option:selected").text()+', ya Existe. Verifique y Vuelva a Intentarlo','Error',{timeOut: 5000})
                    $("#Cuenta_CajaBancos_"+idTab).val("")
                    $("#Cuenta_CajaBancos_"+idTab).focus()
                }
            } 
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
        });
}

function TraerTipoCambio(CodLibro,idTab){
    if($("#Cod_Moneda_"+idTab).val()!="PEN"){
        try{
            var Cod_Moneda = $("#Cod_Moneda_"+idTab).val()
            var FechaHora = $("#Fecha_"+idTab).val()
            const parametros = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Cod_Moneda,
                    FechaHora
                })
            }
            fetch(URL + '/comprobantes_pago_api/get_variables_formas_pago', parametros)
                .then(req => req.json())
                .then(res => {
                    if (res.respuesta == 'ok') {
                        if(res.data.tipos_cambios.length>0){
                            if(CodLibro=="08"){
                                $("#Tipo_Cambio_"+idTab).val(res.data.tipos_cambios[0].SunatCompra)
                            }else{
                                $("#Tipo_Cambio_"+idTab).val(res.data.tipos_cambios[0].SunatVenta)
                            }
                        }else{
                            $("#Tipo_Cambio_"+idTab).val(1)
                        }
                    } 
                }).catch(function (e) {
                    console.log(e);
                    toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                });

        }catch(e){
            $("#Tipo_Cambio_"+idTab).val(1)
        }
    }
}

function TraerSaldoPagoAdelantado(idTab){
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Id_ClienteProveedor:global.objCliente.Id_ClienteProveedor
        })
    }
    fetch(URL + '/comprobantes_pago_api/get_pago_adelantado', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var pagos_adelantados = res.data.pagos_adelantados
                if (pagos_adelantados.length>0){
                    LlenarPagosAdelantados(pagos_adelantados)
                }else{
                    $("#lbCuentaCajaBanco_"+idTab).text("No tienen Ningun Adelanto para Selecionar.")
                    $("#Cuenta_CajaBancos_"+idTab).html('')
                    $("#divCuentaCajaBancos_"+idTab).css("display","none")
                } 
            } 
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
        });
}

function TraerCuentasBancariasXIdClienteProveedor(CodLibro,idTab){
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Id_ClienteProveedor:global.objCliente.Id_ClienteProveedor
        })
    }
    fetch(URL + '/cuentas_bancarias_api/get_cuenta_by_id_cliente', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var cuentas = res.data.cuentas
                LlenarCuentaBancaria_(cuentas,CodLibro,idTab)
            } 
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
        });
}


function TraerCuentaBancariaPorSucursal(CodLibro,idTab){
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        })
    }
    fetch(URL + '/cuentas_bancarias_api/get_cuenta_by_sucursal', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var cuentas = res.data.cuentas
                LlenarCuentaBancaria(cuentas,CodLibro,idTab)
            } 
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
        });
}

function BuscarClienteDoc(CodLibro,idTab) {
    if($("#Nro_Documento_"+idTab).val().trim().length>0){
        run_waitMe($('#div-cliente-cuentas_'+idTab), 1, "ios","Buscando cliente...");
        var Nro_Documento = $("#Nro_Documento_"+idTab).val()
        var Cod_TipoDocumento = document.getElementById('Cod_TipoDoc_'+idTab).value
        var Cod_TipoCliente = CodLibro == "08" ? "001" : "002"
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Nro_Documento, Cod_TipoDocumento,Cod_TipoCliente
            })
        }
        fetch(URL + '/clientes_api/get_cliente_by_documento', parametros)
            .then(req => req.json())
            .then(res => { 
                if (res.respuesta == 'ok' && res.data.cliente.length > 0) {
                    global.objCliente = res.data.cliente[0]
                    
                    if(global.objCliente !='' && global.objCliente){
                        $("#Cod_TipoDoc_"+idTab).val(global.objCliente.Cod_TipoDocumento)
                        $("#Cliente_"+idTab).val(global.objCliente.Cliente)
                        $("#Direccion_"+idTab).val(global.objCliente.Direccion)
                        $("#Nro_Documento_"+idTab).val(global.objCliente.Nro_Documento)

                        $("#Nro_Documento_"+idTab).bind("keypress", function(event){
                            event.preventDefault();
                            event.stopPropagation();
                        });
                        
                        $("#Cliente_"+idTab).bind("keypress", function(event){
                            event.preventDefault();
                            event.stopPropagation();
                        });
                        
                        $("#Direccion_"+idTab).bind("keypress", function(event){
                            event.preventDefault();
                            event.stopPropagation();
                        });
                        
                        $("#Nro_Documento_"+idTab).attr("disabled",true);
                        $("#Cliente_"+idTab).attr("disabled",true);
                        $("#Direccion_"+idTab).attr("disabled",true);
                        $("#Cod_TipoDoc_"+idTab).attr("disabled",true);

                        /*$("#Cliente").tagsinput('add',global.objCliente.Cliente)
                        $("#Nro_Documento").tagsinput('add',global.objCliente.Nro_Documento)
                        $("#Direccion").tagsinput('add',global.objCliente.Direccion)*/

                        $("#Cliente_"+idTab).attr("data-id",global.objCliente.Id_ClienteProveedor) 
                        CargarLicitacionesCliente(global.objCliente.Id_ClienteProveedor)
                    }
                }else{

                    $("#Cliente_"+idTab).val("") 
                    $("#Direccion_"+idTab).val("") 
                    $("#Cliente_"+idTab).attr("data-id",null)
        
                    $("#Nro_Documento_"+idTab).unbind("keypress");
                    $("#Cliente_"+idTab).unbind("keypress");
                    $("#Direccion_"+idTab).unbind("keypress");
        
                    $("#Nro_Documento_"+idTab).attr("disabled",false);
                    $("#Cliente_"+idTab).attr("disabled",false);
                    $("#Direccion_"+idTab).attr("disabled",false);
                    $("#Cod_TipoDoc_"+idTab).attr("disabled",false);

                }
                $('#div-cliente-cuentas_'+idTab).waitMe('hide');
            }).catch(function (e) {
                console.log(e);

                $("#Cliente_"+idTab).val("") 
                $("#Direccion_"+idTab).val("") 
                $("#Cliente_"+idTab).attr("data-id",null)
    
                $("#Nro_Documento_"+idTab).unbind("keypress");
                $("#Cliente_"+idTab).unbind("keypress");
                $("#Direccion_"+idTab).unbind("keypress");
    
                $("#Nro_Documento_"+idTab).attr("disabled",false);
                $("#Cliente_"+idTab).attr("disabled",false);
                $("#Direccion_"+idTab).attr("disabled",false);
                $("#Cod_TipoDoc_"+idTab).attr("disabled",false);

                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#div-cliente-cuentas_'+idTab).waitMe('hide');
            });
    }
}


function CargarLicitacionesCliente(Id_ClienteProveedor){
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Id_ClienteProveedor
        })
    }
    fetch(URL + '/clientes_api/get_licitaciones_by_cliente', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var licitaciones = res.data.licitaciones 
                if(licitaciones.length>0){
                    $("#divCodigoLicitacion").css("display","block")
                    $("#divLicitacion").css("display","block")
                    $("#optLicitacion").attr("checked",true)
                    LlenarLicitaciones(licitaciones)
                }else{
                    $("#divCodigoLicitacion").css("display","none")
                    $("#divLicitacion").css("display","none")
                    $("#optLicitacion").attr("checked",false)   
                }
            } 
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
        });
}

function VerGuardar(CodLibro,idTab){
    try{
        if(EsValido(idTab)){
            CargarModalConfirmacionCuentas(CodLibro,idTab)
        }
    }catch(e){
        toastr.error('Error al agregar nuevo elemento, intentelo mas luego.\n\n','Error',{timeOut: 5000})
    }
}
 

function GuardarMovimientoBancario(Facturas,CodLibro,idTab){

    var Cod_CuentaBancaria =$("#Cod_CuentaBancaria_"+idTab).val()
    var Nro_Operacion = $("#Cuenta_CajaBancos_"+idTab+" option:selected").text()
    var Des_Movimiento = (CodLibro == "08"?"POR PAGO DEL(DE LOS) COMPROBANTE(S): " + Facturas: "POR COBRO DE LO(S) COMPROBANTE(S): " + Facturas)
    var Cod_TipoOperacionBancaria = ''
    if($("#Cod_FormaPago_"+idTab).val()=="007"){
        Cod_TipoOperacionBancaria = "006"
    }else{
        Cod_TipoOperacionBancaria = "001"
    }

    var Fecha = $("#Fecha_"+idTab).val()
    var Monto = (CodLibro=="08"?-1:1)*parseFloat($("#TotalAmortizar_"+idTab).val())
    var TipoCambio = $("#Tipo_Cambio_"+idTab).val()
    var Cod_Plantilla = $("#Cod_Plantilla_"+idTab).val()
    var Nro_Cheque = 0 
    if($("#Cod_FormaPago_"+idTab).val()=="007"){
        Nro_Cheque = "00000000"+ $("#Cuenta_CajaBancos_"+idTab+" option:selected").text()
    }
    var Beneficiario = $("#Cliente_"+idTab).val()
    var Id_ComprobantePago=-1
    var Obs_Movimiento = $("#Comentarios_"+idTab).val()
     
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Cod_CuentaBancaria,
            Nro_Operacion,
            Des_Movimiento,
            Cod_TipoOperacionBancaria,
            Fecha,
            Monto,
            TipoCambio,
            Cod_Plantilla,
            Nro_Cheque,
            Beneficiario,
            Id_ComprobantePago,
            Obs_Movimiento,
        })
    }
    fetch(URL + '/cuentas_bancarias_api/guardar_cuenta_movimiento', parametros)
        .then(req => req.json())
        .then(res => {
            console.log(res)
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
        }); 

}

function GuardarMovimientoCaja(Facturas,CodLibro,idTab){
    var Id_Concepto = (CodLibro == "08"?6000:7000)
    var Id_ClienteProveedor = $("#Cliente_"+idTab).attr("data-id")
    var Cliente = $("#Cliente_"+idTab).val()
    var Des_Movimiento = (CodLibro == "08"?"POR PAGO DEL(DE LOS) COMPROBANTE(S): " + Facturas: "POR COBRO DE LO(S) COMPROBANTE(S): " + Facturas)
    var Cod_TipoComprobante = (CodLibro == "08"?"RE":"RI")
    var Serie = $("#Serie_"+idTab).val()
    var Fecha = $("#Fecha_"+idTab).val()
    var Tipo_Cambio = $("#Tipo_Cambio_"+idTab).val()
    var Ingreso = 0
    var Cod_MonedaIng=""
    var Egreso = 0
    var Cod_MonedaEgr=""
    if(CodLibro!="08"){
        Ingreso = $("#TotalAmortizar_"+idTab).val()
        Cod_MonedaIng = $("#Cod_Moneda_"+idTab).val()
        Egreso = 0
        Cod_MonedaEgr = $("#Cod_Moneda_"+idTab).val()
    }else{
        Ingreso = 0
        Cod_MonedaIng = $("#Cod_Moneda_"+idTab).val()
        Egreso = $("#TotalAmortizar_"+idTab).val()
        Cod_MonedaEgr = $("#Cod_Moneda_"+idTab).val()
    }
    var Flag_Extornado = '0'
    const fecha = new Date()
    const mes = fecha.getMonth() + 1
    const dia = fecha.getDate()
    var fecha_format = fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)
    var Fecha_Aut = fecha_format

    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Id_Concepto,
            Id_ClienteProveedor,
            Cliente,
            Des_Movimiento,
            Cod_TipoComprobante,
            Serie,
            Fecha,
            Tipo_Cambio,
            Ingreso,
            Cod_MonedaIng,
            Egreso,
            Cod_MonedaEgr,
            Flag_Extornado,
            Fecha_Aut
        })
    }
    fetch(URL + '/movimientos_caja_api/guardar_movimiento_caja', parametros)
        .then(req => req.json())
        .then(res => {
            console.log(res)
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
        }); 
 
}

function AceptarConfirmacionCuenta(CodLibro,idTab){
    
    var Facturas = ""
    // ------- Inicio EstablecerCamposEntidad

    var Fecha_FormaPago = $("#Fecha_"+idTab).val()
    var Cod_TipoFormaPago_FormaPago = $("#Cod_FormaPago_"+idTab).val()
    var Id_Movimiento_FormaPago = 0
    var Cuenta_CajaBancos_FormaPago = ''
    if ($("#Cuenta_CajaBancos_"+idTab).val() != null && $("#Cuenta_CajaBancos_"+idTab).val()!=''){
        Id_Movimiento_FormaPago = parseInt($("#Cuenta_CajaBancos_"+idTab).val());
        Cuenta_CajaBancos_FormaPago = $("#Cuenta_CajaBancos_"+idTab+" option:selected").text().split('(', ')')[1];
    }
    else if ($("#divCuentaCajaBancos_"+idTab).css("display")=="display")
        Cuenta_CajaBancos_FormaPago = $("#Cuenta_CajaBancos_"+idTab+" option:selected").text().trim();
    
    if ($("#Cod_CuentaBancaria_"+idTab).val() == "003"){
        Cuenta_CajaBancos_FormaPago =  $("#Cuenta_CajaBancos_"+idTab+" option:selected").text()
    }
    var Des_FormaPago_FormaPago = $("#Comentarios_"+idTab).val().trim(); 
    var TipoCambio_FormaPago = $("#Tipo_Cambio_"+idTab).val()
    var Cod_Moneda_FormaPago = $("#Cod_Moneda_"+idTab).val()             
    
    // ------- Fin EstablecerCamposEntidad

    var i = 0
    var Facturas = ""
    $('#tablaComprobantes_'+idTab+' > tbody tr').each(function () {
        if(parseFloat($(this).find("td").eq(6).find("input").val())>0){
            if(parseFloat($(this).find("td").eq(5).text()) == parseFloat($(this).find("td").eq(6).find("input").val()) ){

                const parametrosComprobantePago = {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id_ComprobantePago:parseInt($(this).find("td").eq(0).text().trim())

                    })
                }
                fetch(URL + '/comprobantes_pago_api/get_comprobante_pago', parametrosFormaPago)
                    .then(req => req.json())
                    .then(res => {
                        if(res.respuesta=="ok"){
                            
                            var parametrosComprobante = [
                                { nom_parametro: 'id_ComprobantePago', valor_parametro: -1, tipo:"output"},
                                { nom_parametro: 'Cod_Libro', valor_parametro: res.data.comprobante_pago[0].Cod_Libro},
                                { nom_parametro: 'Cod_Periodo', valor_parametro:res.data.comprobante_pago[0].Cod_Periodo},
                                { nom_parametro: 'Cod_Caja', valor_parametro: res.data.comprobante_pago[0].Cod_Caja},
                                { nom_parametro: 'Cod_Turno', valor_parametro: res.data.comprobante_pago[0].Cod_Turno},
                                { nom_parametro: 'Cod_TipoOperacion', valor_parametro: res.data.comprobante_pago[0].Cod_TipoOperacion},
                                { nom_parametro: 'Cod_TipoComprobante', valor_parametro: res.data.comprobante_pago[0].Cod_TipoComprobante},
                                { nom_parametro: 'Serie', valor_parametro: res.data.comprobante_pago[0].Serie},
                                { nom_parametro: 'Numero', valor_parametro: res.data.comprobante_pago[0].Numero},
                                { nom_parametro: 'Id_Cliente', valor_parametro: res.data.comprobante_pago[0].Id_Cliente},
                                { nom_parametro: 'Cod_TipoDoc', valor_parametro: res.data.comprobante_pago[0].Cod_TipoDoc},
                                { nom_parametro: 'Doc_Cliente', valor_parametro: res.data.comprobante_pago[0].Doc_Cliente},
                                { nom_parametro: 'Nom_Cliente', valor_parametro: res.data.comprobante_pago[0].Nom_Cliente},
                                { nom_parametro: 'Direccion_Cliente', valor_parametro: res.data.comprobante_pago[0].Direccion_Cliente},
                                { nom_parametro: 'FechaEmision', valor_parametro: res.data.comprobante_pago[0].FechaEmision},
                                { nom_parametro: 'FechaVencimiento', valor_parametro: res.data.comprobante_pago[0].FechaVencimiento},
                                { nom_parametro: 'FechaCancelacion', valor_parametro: $("#Fecha_"+idTab).val()},
                                { nom_parametro: 'Glosa', valor_parametro: res.data.comprobante_pago[0].Glosa},
                                { nom_parametro: 'TipoCambio', valor_parametro: res.data.comprobante_pago[0].TipoCambio},
                                { nom_parametro: 'Flag_Anulado', valor_parametro: res.data.comprobante_pago[0].Flag_Anulado},
                                { nom_parametro: 'Flag_Despachado', valor_parametro: res.data.comprobante_pago[0].Falg_Despachado},
                                { nom_parametro: 'Cod_FormaPago', valor_parametro: res.data.comprobante_pago[0].Cod_FormaPago},
                                { nom_parametro: 'Descuento_Total', valor_parametro: res.data.comprobante_pago[0].Descuento_Total},
                                { nom_parametro: 'Cod_Moneda', valor_parametro: res.data.comprobante_pago[0].Cod_Moneda},
                                { nom_parametro: 'Impuesto', valor_parametro: res.data.comprobante_pago[0].Impuesto},
                                { nom_parametro: 'Total', valor_parametro: res.data.comprobante_pago[0].Total},
                                { nom_parametro: 'Obs_Comprobante', valor_parametro: res.data.comprobante_pago[0].Obs_Comprobante},
                                { nom_parametro: 'Id_GuiaRemision', valor_parametro: res.data.comprobante_pago[0].Id_GuiaRemision},
                                { nom_parametro: 'GuiaRemision', valor_parametro: res.data.comprobante_pago[0].GuiaRemision},
                                { nom_parametro: 'id_ComprobanteRef', valor_parametro: res.data.comprobante_pago[0].id_ComprobanteRef},
                                { nom_parametro: 'Cod_Plantilla', valor_parametro: res.data.comprobante_pago[0].Cod_Plantilla},
                                { nom_parametro: 'Nro_Ticketera', valor_parametro: res.data.comprobante_pago[0].Nro_Ticketera},
                                { nom_parametro: 'Cod_UsuarioVendedor', valor_parametro: res.data.comprobante_pago[0].Cod_UsuarioVendedor},
                                { nom_parametro: 'Cod_RegimenPercepcion', valor_parametro: res.data.comprobante_pago[0].Cod_RegimenPercepcion},
                                { nom_parametro: 'Tasa_Percepcion', valor_parametro: res.data.comprobante_pago[0].Tasa_Percepcion},
                                { nom_parametro: 'Placa_Vehiculo', valor_parametro: res.data.comprobante_pago[0].Placa_Vehiculo},
                                { nom_parametro: 'Cod_TipoDocReferencia', valor_parametro: res.data.comprobante_pago[0].Cod_TipoDocReferencia},
                                { nom_parametro: 'Nro_DocReferencia', valor_parametro: res.data.comprobante_pago[0].Nro_DocReferencia},
                                { nom_parametro: 'Valor_Resumen', valor_parametro: res.data.comprobante_pago[0].Valor_Resumen},
                                { nom_parametro: 'Valor_Firma', valor_parametro: res.data.comprobante_pago[0].Valor_Firma},
                                { nom_parametro: 'Cod_EstadoComprobante', valor_parametro: res.data.comprobante_pago[0].Cod_EstadoComprobante},
                                { nom_parametro: 'MotivoAnulacion', valor_parametro: res.data.comprobante_pago[0].MotivoAnulacion},
                                { nom_parametro: 'Otros_Cargos', valor_parametro: res.data.comprobante_pago[0].Otros_Cargos},
                                { nom_parametro: 'Otros_Tributos', valor_parametro: res.data.comprobante_pago[0].Otros_Tributos},
                                { nom_parametro: 'Cod_Usuario', valor_parametro: res.data.comprobante_pago[0].Cod_UsuarioAct},
                            ]
                            
                            EXEC_SQL_OUTPUT('USP_CAJ_COMPROBANTE_PAGO_G',parametrosComprobante, function (dataComprobante) {
                                if (dataComprobante.err)
                                    return res.json({respuesta:"error",detalle_error:'No se pudo guardar correctamente la venta'})
                            })        
 
                        }
                    }).catch(function (e) {
                        console.log(e);
                        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                    }); 


                Facturas += $(this).find("td").eq(5).text() + ", "
                i++
            }else{
                Facturas += $(this).find("td").eq(5).text() + ", "
                i++
            }     
        }         
    });

    if(i>0){
        Facturas = Facturas.substring(0,Facturas.length-2)
    }

    switch($("#Cod_FormaPago_"+idTab).val()){
        case "008":
            GuardarMovimientoCaja(Facturas,CodLibro,idTab)
            break
        case "007":
            if(CodLibro=="08"){
                if($("#Cuenta_CajaBancos_"+idTab).val()==null || $("#Cuenta_CajaBancos_"+idTab).val()==""){
                    GuardarMovimientoBancario(Facturas,CodLibro,idTab)
                }
            }
            break
        case "011":
            if($("#Cuenta_CajaBancos_"+idTab).val()==null || $("#Cuenta_CajaBancos_"+idTab).val()==""){
                if(CodLibro=="08"){
                    GuardarMovimientoCaja(Facturas,CodLibro)
                }else{
                    if(CodLibro=="14"){
                        GuardarMovimientoBancario(Facturas,CodLibro,idTab)
                    }
                }
            }
            break
        case "003":
            if($("#Cuenta_CajaBancos_"+idTab).val()==null || $("#Cuenta_CajaBancos_"+idTab).val()==""){
                if(CodLibro=="08"){
                    GuardarMovimientoCaja(Facturas,CodLibro)
                }else{
                    GuardarMovimientoBancario(Facturas,CodLibro,idTab)
                }
            }
            break
    }

    $('#tablaComprobantes_'+idTab+' > tbody tr').each(function () {
        if(parseFloat($(this).find("td").eq(6).find("input").val())>0){
            var id_ComprobantePago = parseInt($(this).find("td").eq(0).text());//parseInt()
            var Monto = parseFloat($(this).find("td").eq(6).find("input").val())
            Id_Movimiento_FormaPago = 0
            if($("#Cuenta_CajaBancos_"+idTab).val()!=null || $("#Cuenta_CajaBancos_"+idTab).val()!=""){
                Id_Movimiento_FormaPago = parseInt($("#Cuenta_CajaBancos_"+idTab).val())
            }
 
            const parametros = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_ComprobantePago,
                })
            }
            fetch(URL + '/formas_pago_api/traer_siguiente_item', parametros)
                .then(req => req.json())
                .then(res => {
                    if(res.respuesta=="ok"){
                        var Item = res.data.item[0]['']
                        var Cod_Plantilla = null
                        var Obs_FormaPago = ''

                        const parametrosFormaPago = {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                id_ComprobantePago,
                                Item,
                                Des_FormaPago: Des_FormaPago_FormaPago,
                                Cod_TipoFormaPago:Cod_TipoFormaPago_FormaPago,
                                Cuenta_CajaBancos: Cuenta_CajaBancos_FormaPago,
                                Id_Movimiento: Id_Movimiento_FormaPago,
                                TipoCambio: TipoCambio_FormaPago,
                                Cod_Moneda:Cod_Moneda_FormaPago,
                                Monto,
                                Cod_Plantilla,
                                Obs_FormaPago,
                                Fecha: Fecha_FormaPago,

                            })
                        }
                        fetch(URL + '/formas_pago_api/guardar_forma_pago', parametrosFormaPago)
                            .then(req => req.json())
                            .then(res => {
                                if(res.respuesta=="ok"){
                                    
                                }
                            }).catch(function (e) {
                                console.log(e);
                                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                            }); 
                        

                    }
                }).catch(function (e) {
                    console.log(e);
                    toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                }); 
            
        }         
    });
    $("#modal_proceso").modal('hide')
}
 
function Cuentas(Cod_Libro) {
    LimpiarEventoModales()
    run_waitMe($('#main-contenido'), 1, "ios");
    const fecha = new Date()
    const mes = fecha.getMonth() + 1
    const dia = fecha.getDate()
    var fecha_format = fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)

    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Cod_TipoComprobante :'RE',
            Id_Cliente: 0,
            Cod_Libro,
            FechaInicio:  '1753-01-01 00:00:00',
            FechaFin:  '9999-12-31 23:59:59.997',
        })
    }
    fetch(URL + '/recibo_iegreso_api/get_variables_cuentas_cobrar_pagar', parametros)
        .then(req => req.json())
        .then(res => {
            var variables = res.data
            const parametros = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                })
            }
            fetch(URL + '/cajas_api/get_empresa', parametros)
                .then(req => req.json())
                .then(res => {
                    console.log("variables empresa",variables)
                    var data_empresa = res.empresa
                    variables['empresa'] = data_empresa
                    VerCuentas(variables,fecha_format,Cod_Libro)
                    $('#main-contenido').waitMe('hide');
    
                }).catch(function (e) {
                    console.log(e);
                    toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                    $('#main-contenido').waitMe('hide');
                });

        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
}

export { Cuentas }