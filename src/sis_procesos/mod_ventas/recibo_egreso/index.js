var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../../constantes_entorno/constantes'
import { refrescar_movimientos } from '../../movimientos_caja'
import { NuevoCliente,BuscarCliente } from '../../modales'
import { LimpiarEventoModales } from '../../../../utility/tools'


var arrayValidacion = [null,'null','',undefined]
//var flag_cliente = false 
var cantidad_tabs = 0
global.variablesRE = {}

function CargarFormulario(variables, fecha_actual,empresa) {
    //flag_cliente=false
    global.objCliente = ''
    cantidad_tabs++
    const idTabRE = "RE_"+cantidad_tabs
    global.variablesRE[idTabRE]={idTab:idTabRE,flag_cliente:false,Id_ClienteProveedor:null,Obs_Recibo:null}//push({idTab:idTabRI,flag_cliente:false,Id_ClienteProveedor:null,Obs_Recibo})
    var tab = yo`
    <li class=""  ><a href="#tab_${idTabRE}" data-toggle="tab" aria-expanded="false" id="id_${idTabRE}">Recibo de Egreso <a style="padding-left: 10px;"  onclick=${()=>CerrarTabRE(idTabRE)} class="btn"><i class="fa fa-close text-danger"></i></a></a></li>`


    var el = yo`
    <div class="tab-pane" id="tab_${idTabRE}">
        <div class="panel">
            <div class="panel-body">
                <div class="row" id="modal_form_egreso_${idTabRE}">
                    <div class="modal fade" id="modal_observaciones_${idTabRE}">
                        <div class="modal-dialog modal-sm" > 
                            <div class="modal-content" id="modal_obs_body_${idTabRE}"></div>
                        </div> 
                    </div>
                    <div class="row">
                        <div class="alert alert-callout alert-danger hidden" id="modal_error_egreso_${idTabRE}">
                            <p>Es necesario llenar todos los campos requeridos y el Importe mayor a cero</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-8" id="div-cliente-recibo-egreso_${idTabRE}">
                            <div class="card">
                                <div class="card-head">
                                    <header> A favor de </header>
                                    <div class="tools">
                                        <div class="btn-group">
                                            <a class="btn btn-icon-toggle btn-info" onclick=${()=>NuevoCliente(variables.documentos)}><i class="fa fa-plus"></i></a>
                                            <a class="btn btn-icon-toggle btn-warning" onclick=${()=>EditarCliente(idTabRE)}><i class="fa fa-pencil"></i></a>
                                            <a class="btn btn-icon-toggle btn-success" onclick=${()=>BuscarCliente("Cliente_"+idTabRE,"Nro_Documento_"+idTabRE,null)}><i class="fa fa-search"></i></a>
                                            <a class="btn btn-icon-toggle btn-primary"><i class="fa fa-globe"></i></a>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <select id="Cod_TipoDoc_${idTabRE}" class="form-control input-sm" onchange=${()=>CambioClienteDoc(idTabRE)}>
                                                    ${variables.documentos.map(e => yo`
                                                        <option value="${e.Cod_TipoDoc}">${e.Nom_TipoDoc}</option>
                                                        `)}
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <input type="text" id="Nro_Documento_${idTabRE}" onblur="${() => BuscarClienteDoc(idTabRE)}"  onkeypress=${()=>KeyPressClienteDoc(idTabRE)} onkeydown=${()=>CambioNroDocumento(event,idTabRE)} class="form-control required input-sm" placeholder="Nro Documento">
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <button class="btn btn-info btn-sm" onclick="${()=>AbrirModalObs(variables.diagrama,idTabRE)}">Mas Detalles</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <input type="text" id="Cliente_${idTabRE}" class="form-control required input-sm"  placeholder="Nombre del cliente">
                                                <div class="form-control-line"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="box-footer">
                                    
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
                                        <h4><strong>RECIBO DE EGRESO</strong></h4>
                                    </div> 
                                    
                                    <div class="row">
                                        <div class="col-md-5">
                                            <div class="form-group">
                                                <select class="form-control" id="Serie_${idTabRE}">
                                                    ${variables.Serie.map(e => yo`<option value="${e.Serie}">${e.Serie}</option>`)}
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-7">
                                            <div class="form-group">
                                                <input type="text" class="form-control required"  id="Numero_${idTabRE}" value="00000000${variables.Numero}">
                                            </div>
                                        </div>
                                    </div> 
                                    <div class="row">
                                        <div class="col-md-8">

                                            <div class="input-group">
                                                <span class="input-group-addon">Fecha</span>
                                                <div class="input-group-content">
                                                    <input type="date" class="form-control input-sm" id="Fecha_${idTabRE}" value="${fecha_actual}">
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
                            <div class="card">
                                <div class="card-head">
                                    <header> Detalles</header>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-sm-9">
                                            <div class="form-group">
                                                <label for="">Cuenta</label>
                                                <select id="Id_Concepto_${idTabRE}" class="form-control input-sm">
                                                    ${variables.conceptos.map(e => yo`
                                                        <option value="${e.Id_Concepto}">${e.Des_Concepto}</option>
                                                        `)}
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-sm-3">
                                            <div class="form-group">
                                                <b>Moneda: </b>
                                                <select id="Cod_Moneda_${idTabRE}" id="" class="form-control input-sm">
                                                    ${variables.monedas.map(e => yo`
                                                        <option value="${e.Cod_Moneda}">${e.Nom_Moneda}</option>
                                                        `)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-9">
                                            <div class="form-group">
                                                <label for="">Concepto:</label>
                                                <textarea class="form-control input-sm" id="Des_Movimiento_${idTabRE}"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-sm-3">
                                            <div class="form-group">
                                                <label for="">Importe :</label>
                                                <input class="form-control required input-sm" type="number" id="Monto_${idTabRE}" value="0.00">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="box-footer">
                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row pull-right">
                    <button onclick="${() => Guardar(idTabRE)}" class="btn btn-primary">Guardar</button>
                    <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Cancelar</button>
                </div>
            </div>
        </div>
    </div>`

    //var ingreso = document.getElementById('modal-proceso')
    //empty(ingreso).appendChild(el)
    //$('#modal-proceso').modal()
    $("#tabs").append(tab)
    $("#tabs_contents").append(el)
    $("#id_"+idTabRE).click()

    $('#modal-superior').on('hidden.bs.modal', function () {

        if(global.objCliente !='' && global.objCliente){
            //console.log(global.objCliente) 
            global.variablesRE[idTabRE].Id_ClienteProveedor = global.objCliente.Id_ClienteProveedor
            $("#Cod_TipoDoc_"+idTabRE).val(global.objCliente.Cod_TipoDocumento)
            $("#Cliente_"+idTabRE).val(global.objCliente.Cliente)
            $("#Nro_Documento_"+idTabRE).val(global.objCliente.Nro_Documento)
            $("#Cliente_"+idTabRE).attr("data-id",global.objCliente.Id_ClienteProveedor)


            $("#Nro_Documento_"+idTabRE).bind("keypress", function(event){
                event.preventDefault();
                event.stopPropagation();
            });
            
            $("#Cliente_"+idTabRE).bind("keypress", function(event){
                event.preventDefault();
                event.stopPropagation();
            });
           
            $("#Nro_Documento_"+idTabRE).attr("disabled",true);
            $("#Cliente_"+idTabRE).attr("disabled",true); 
            $("#Cod_TipoDoc_"+idTabRE).attr("disabled",true);
        }
    })
    


    console.log(global.variablesRE)
}

function RefrescarFormulario(variables, fecha_actual,empresa,idTabRE) {
    global.objCliente = ''
    global.variablesRE[idTabRE]={idTab:idTabRE,flag_cliente:false,Id_ClienteProveedor:null,Obs_Recibo:null}
     
    var el = yo`
        <div class="panel">
            <div class="panel-body">
                <div class="row" id="modal_form_egreso_${idTabRE}">
                    <div class="modal fade" id="modal_observaciones_${idTabRE}">
                        <div class="modal-dialog modal-sm" > 
                            <div class="modal-content" id="modal_obs_body_${idTabRE}"></div>
                        </div> 
                    </div>
                    <div class="row">
                        <div class="alert alert-callout alert-danger hidden" id="modal_error_egreso_${idTabRE}">
                            <p>Es necesario llenar todos los campos requeridos y el Importe mayor a cero</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-8" id="div-cliente-recibo-egreso_${idTabRE}">
                            <div class="card">
                                <div class="card-head">
                                    <header> A favor de </header>
                                    <div class="tools">
                                        <div class="btn-group">
                                            <a class="btn btn-icon-toggle btn-info" onclick=${()=>NuevoCliente(variables.documentos)}><i class="fa fa-plus"></i></a>
                                            <a class="btn btn-icon-toggle btn-warning" onclick=${()=>EditarCliente(idTabRE)}><i class="fa fa-pencil"></i></a>
                                            <a class="btn btn-icon-toggle btn-success" onclick=${()=>BuscarCliente("Cliente_"+idTabRE,"Nro_Documento_"+idTabRE,null)}><i class="fa fa-search"></i></a>
                                            <a class="btn btn-icon-toggle btn-primary"><i class="fa fa-globe"></i></a>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <select id="Cod_TipoDoc_${idTabRE}" class="form-control input-sm" onchange=${()=>CambioClienteDoc(idTabRE)}>
                                                    ${variables.documentos.map(e => yo`
                                                        <option value="${e.Cod_TipoDoc}">${e.Nom_TipoDoc}</option>
                                                        `)}
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <input type="text" id="Nro_Documento_${idTabRE}" onblur="${() => BuscarClienteDoc(idTabRE)}"  onkeypress=${()=>KeyPressClienteDoc(idTabRE)} onkeydown=${()=>CambioNroDocumento(event,idTabRE)} class="form-control required input-sm" placeholder="Nro Documento">
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <button class="btn btn-info btn-sm" onclick="${()=>AbrirModalObs(variables.diagrama,idTabRE)}">Mas Detalles</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <input type="text" id="Cliente_${idTabRE}" class="form-control required input-sm"  placeholder="Nombre del cliente">
                                                <div class="form-control-line"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="box-footer">
                                    
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
                                        <h4><strong>RECIBO DE EGRESO</strong></h4>
                                    </div> 
                                    
                                    <div class="row">
                                        <div class="col-md-5">
                                            <div class="form-group">
                                                <select class="form-control" id="Serie_${idTabRE}">
                                                    ${variables.Serie.map(e => yo`<option value="${e.Serie}">${e.Serie}</option>`)}
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-7">
                                            <div class="form-group">
                                                <input type="text" class="form-control required"  id="Numero_${idTabRE}" value="00000000${variables.Numero}">
                                            </div>
                                        </div>
                                    </div> 
                                    <div class="row">
                                        <div class="col-md-8">

                                            <div class="input-group">
                                                <span class="input-group-addon">Fecha</span>
                                                <div class="input-group-content">
                                                    <input type="date" class="form-control input-sm" id="Fecha_${idTabRE}" value="${fecha_actual}">
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
                            <div class="card">
                                <div class="card-head">
                                    <header> Detalles</header>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-sm-9">
                                            <div class="form-group">
                                                <label for="">Cuenta</label>
                                                <select id="Id_Concepto_${idTabRE}" class="form-control input-sm">
                                                    ${variables.conceptos.map(e => yo`
                                                        <option value="${e.Id_Concepto}">${e.Des_Concepto}</option>
                                                        `)}
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-sm-3">
                                            <div class="form-group">
                                                <b>Moneda: </b>
                                                <select id="Cod_Moneda_${idTabRE}" id="" class="form-control input-sm">
                                                    ${variables.monedas.map(e => yo`
                                                        <option value="${e.Cod_Moneda}">${e.Nom_Moneda}</option>
                                                        `)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-9">
                                            <div class="form-group">
                                                <label for="">Concepto:</label>
                                                <textarea class="form-control input-sm" id="Des_Movimiento_${idTabRE}"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-sm-3">
                                            <div class="form-group">
                                                <label for="">Importe :</label>
                                                <input class="form-control required input-sm" type="number" id="Monto_${idTabRE}" value="0.00">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="box-footer">
                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row pull-right">
                    <button onclick="${() => Guardar(idTabRE)}" class="btn btn-primary">Guardar</button>
                    <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Cancelar</button>
                </div>
            </div>
            
        </div>`
    $('#tab_'+idTabRE).html(el)
    //empty(ingreso).appendChild(el) 
    console.log(global.variablesRE)

    $('#modal-superior').on('hidden.bs.modal', function () {

        if(global.objCliente !='' && global.objCliente){
            //console.log(global.objCliente) 
            global.variablesRE[idTabRE].Id_ClienteProveedor = global.objCliente.Id_ClienteProveedor
            $("#Cod_TipoDoc_"+idTabRE).val(global.objCliente.Cod_TipoDocumento)
            $("#Cliente_"+idTabRE).val(global.objCliente.Cliente)
            $("#Nro_Documento_"+idTabRE).val(global.objCliente.Nro_Documento)
            $("#Cliente_"+idTabRE).attr("data-id",global.objCliente.Id_ClienteProveedor)


            $("#Nro_Documento_"+idTabRE).bind("keypress", function(event){
                event.preventDefault();
                event.stopPropagation();
            });
            
            $("#Cliente_"+idTabRE).bind("keypress", function(event){
                event.preventDefault();
                event.stopPropagation();
            });
           
            $("#Nro_Documento_"+idTabRE).attr("disabled",true);
            $("#Cliente_"+idTabRE).attr("disabled",true); 
            $("#Cod_TipoDoc_"+idTabRE).attr("disabled",true);
        }
    })

}

//var Id_ClienteProveedor = null
//var Obs_Recibo = null

function CerrarTabRE(idTab){ 
    $('#tab_'+idTab).remove()
    $('#id_'+idTab).parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show');
    delete global.variablesRE[idTab]
    //arrayJson[i].Detalles.splice(j, 1)
    //delete global.variablesRI[idTab]
}

function CambioNroDocumento(e,idTab){  
    if(e.which == 46 || e.which == 8){ 
        if(global.variablesRI[idTab].flag_cliente){
            $("#Nro_Documento_"+idTab).val("");
            $("#Cliente_"+idTab).val(""); 
            global.variablesRE[idTab].Id_ClienteProveedor=null
            global.variablesRE[idTab].flag_cliente=false
        }
    }   
}

function KeyPressClienteDoc(idTab){  
    switch(($('#Nro_Documento_'+idTab).val().trim().length)+1){
        case 8:
            $("#Cod_TipoDoc_"+idTab).val("1")
            break;
        case 11:
            $("#Cod_TipoDoc_"+idTab).val("6")
            break;
    }
   
}


function EditarCliente(idTab){ 
    if(!arrayValidacion.includes(global.variablesRE[idTab].Id_ClienteProveedor))
        global.variablesRE[idTab].flag_cliente = true
    else
        global.variablesRE[idTab].flag_cliente=false
    

    $("#Nro_Documento_"+idTab).unbind("keypress");
    $("#Cliente_"+idTab).unbind("keypress");

    $("#Nro_Documento_"+idTab).attr("disabled",false);
    $("#Cliente_"+idTab).attr("disabled",false);
    $("#Cod_TipoDoc_"+idTab).attr("disabled",false);
}

function CambioClienteDoc(idTab){
    if($("#Cod_TipoDoc_"+idTab).val()=="1" || $("#Cod_TipoDoc_"+idTab).val()=="6"){
        $("#Nro_Documento_"+idTab).addClass("required")
        $("#Nro_Documento_"+idTab).css("border-color","red");
    }else{
        $("#Nro_Documento_"+idTab).css("border-color","");
        $("#Nro_Documento_"+idTab).removeClass("required",false)
    }
}
 


function BuscarClienteDoc(idTab) {
    if($("#Nro_Documento_"+idTab).val().trim().length>0){
        run_waitMe($('#div-cliente-recibo-egreso_'+idTab), 1, "ios","Buscando cliente...");
        var Nro_Documento = document.getElementById('Nro_Documento_'+idTab).value
        var Cod_TipoDocumento = document.getElementById('Cod_TipoDoc_'+idTab).value
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Nro_Documento, Cod_TipoDocumento
            })
        }
        fetch(URL + '/recibo_iegreso_api/get_cliente_by_nro_documento', parametros)
            .then(req => req.json())
            .then(res => {
                 
                if (res.respuesta == 'ok' && res.data.cliente.length > 0) {
                    $("#Cliente_"+idTab).val(res.data.cliente[0].Cliente)
                    $("#Cod_TipoDoc_"+idTab).val(res.data.cliente[0].Cod_TipoDocumento)
                    $("#Nro_Documento_"+idTab).val(res.data.cliente[0].Nro_Documento)
                    global.variablesRE[idTab].Id_ClienteProveedor = res.data.cliente[0].Id_ClienteProveedor

                    $("#Nro_Documento_"+idTab).bind("keypress", function(event){
                        event.preventDefault();
                        event.stopPropagation();
                    });
    
                    $("#Cliente_"+idTab).bind("keypress", function(event){
                        event.preventDefault();
                        event.stopPropagation();
                    });
    
                  
                    $("#Nro_Documento_"+idTab).attr("disabled",true);
                    $("#Cliente_"+idTab).attr("disabled",true); 
                    $("#Cod_TipoDoc_"+idTab).attr("disabled",true);

                }else{
                    global.variablesRE[idTab].Id_ClienteProveedor = null
                    $("#Cliente_"+idTab).val("")  
                    $("#Cliente_"+idTab).attr("data-id",null)

                    $("#Nro_Documento_"+idTab).unbind("keypress");
                    $("#Cliente_"+idTab).unbind("keypress"); 

                    $("#Nro_Documento_"+idTab).attr("disabled",false);
                    $("#Cliente_"+idTab).attr("disabled",false); 
                    $("#Cod_TipoDoc_"+idTab).attr("disabled",false);
                }
                $('#div-cliente-recibo-egreso_'+idTab).waitMe('hide');
            }).catch(function (e) {
                console.log(e);

                global.variablesRE[idTab].Id_ClienteProveedor = null
                $("#Cliente_"+idTab).val("")  
                $("#Cliente_"+idTab).attr("data-id",null)

                $("#Nro_Documento_"+idTab).unbind("keypress");
                $("#Cliente_"+idTab).unbind("keypress"); 

                $("#Nro_Documento_"+idTab).attr("disabled",false);
                $("#Cliente_"+idTab).attr("disabled",false); 
                $("#Cod_TipoDoc_"+idTab).attr("disabled",false);

                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#div-cliente-recibo-egreso_'+idTab).waitMe('hide');
            });
    }
}
function getValueXML(xmlDoc, TAG) {
    if (xmlDoc.getElementsByTagName(TAG).length > 0 && xmlDoc.getElementsByTagName(TAG)[0].childNodes.length > 0) {
        return xmlDoc.getElementsByTagName(TAG)[0].childNodes[0].nodeValue
    } else {
        return ''
    }
}
function AbrirModalObs(diagrama,idTab) {
    var xml = global.variablesRE[idTab].Obs_Recibo!=null?global.variablesRE[idTab].Obs_Recibo:''
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xml, "text/xml");
    var el = yo`<div>
    <div class="modal-body">
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
    </div>
    <div class="modal-footer">
        <button onclick="${() => GuardarObs_Recibo(diagrama,idTab)}" class="btn btn-primary">Guardar</button>
    </div></div>`;
    var obs_xml = document.getElementById('modal_obs_body_'+idTab)
    empty(obs_xml).appendChild(el)
    $('#modal_observaciones_'+idTab).modal()
}
function GuardarObs_Recibo(diagramas,idTab) {
    var OBS = '<Registro>'
    for (var i = 0; i < diagramas.length; i++) {
        OBS += '<' + diagramas[i].Cod_Elemento + '>' + document.getElementById(diagramas[i].Cod_Elemento).value + '</' + diagramas[i].Cod_Elemento + '>'
    }
    global.variablesRE[idTab].Obs_Recibo = OBS+'</Registro>'
    $('#modal_observaciones_'+idTab).modal('hide')
}
function Guardar(idTab) {
    if (ValidacionCampos("modal_error_egreso_"+idTab,"modal_form_egreso_"+idTab) && !isNaN(parseInt(document.getElementById('Monto_'+idTab).value)) && parseInt(document.getElementById('Monto_'+idTab).value)>0) {
    const Id_Concepto = document.getElementById('Id_Concepto_'+idTab).value
    const Cliente = document.getElementById('Cliente_'+idTab).value
    const Des_Movimiento = document.getElementById('Des_Movimiento_'+idTab).value
    const Cod_TipoComprobante = 'RE'
    const Serie = document.getElementById('Serie_'+idTab).value
    const Numero = document.getElementById('Numero_'+idTab).value
    const Fecha = document.getElementById('Fecha_'+idTab).value
    const MontoEgreso = document.getElementById('Monto_'+idTab).value
    const MontoIngreso = 0
    const Cod_Moneda = document.getElementById('Cod_Moneda_'+idTab).value
    const Obs_Movimiento = global.variablesRE[idTab].Obs_Recibo
    run_waitMe($('#main-contenido'), 1, "ios","");
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            Id_Concepto, Id_ClienteProveedor:global.variablesRE[idTab].Id_ClienteProveedor, Cliente,
            Des_Movimiento, Cod_TipoComprobante, Serie,
            Numero, Fecha, MontoEgreso,MontoIngreso, Cod_Moneda, Obs_Movimiento
        })
    }
    console.log(parametros)
    fetch(URL + '/recibo_iegreso_api/guardar_recibo', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                toastr.success('Se registro correctamente el egreso','Confirmacion',{timeOut: 5000})
                RefrescarEgreso(idTab)
            }else{
                toastr.error('No se pudo registrar correctamente el egreso','Error',{timeOut: 5000})
            } 
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
    }
}



function RefrescarEgreso(idTab) {
    LimpiarEventoModales()
    run_waitMe($('#main-contenido'), 1, "ios");
    var Cod_TipoComprobante = 'RE'
    var Cod_ClaseConcepto = '006'
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Cod_TipoComprobante,
            Cod_ClaseConcepto
        })
    }
    fetch(URL + '/recibo_iegreso_api/get_variables_recibo_iegreso', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                const fecha = new Date()
                const mes = fecha.getMonth() + 1
                const dia = fecha.getDate()
                var fecha_format = fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)
                RefrescarFormulario(res.data, fecha_format,res.empresa,idTab)
            }
            else
                toastr.error('Ocurrio un error al momento de cargar los datos.','Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });

}


function NuevoEgreso() {
    LimpiarEventoModales()
    run_waitMe($('#main-contenido'), 1, "ios");
    var Cod_TipoComprobante = 'RE'
    var Cod_ClaseConcepto = '006'
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Cod_TipoComprobante,
            Cod_ClaseConcepto
        })
    }
    fetch(URL + '/recibo_iegreso_api/get_variables_recibo_iegreso', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                const fecha = new Date()
                const mes = fecha.getMonth() + 1
                const dia = fecha.getDate()
                var fecha_format = fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)
                CargarFormulario(res.data, fecha_format,res.empresa)
            }
            else
                toastr.error('Ocurrio un error al momento de cargar los datos.','Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });

}

export { NuevoEgreso }