var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../../constantes_entorno/constantes'
import { refrescar_movimientos } from '../../movimientos_caja'
import { NuevoCliente,BuscarCliente } from '../../modales'

function CargarFormulario(variables, fecha_actual) {
    var el = yo`
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
                <h4 class="modal-title"><b>RECIBO DE EGRESO</b></h4>
            </div>
            <div class="modal-body" id="modal_form_egreso">
                <div class="modal fade" id="modal_observaciones">
                    <div class="modal-dialog modal-sm" > 
                        <div class="modal-content" id="modal_obs_body"></div>
                    </div> 
                </div>
                <div class="row">
                    <div class="alert alert-callout alert-danger hidden" id="modal_error_egreso">
                        <p>Es necesario llenar todos los campos requeridos y el Importe mayor a cero</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-8" id="div-cliente-recibo-egreso">
                        <div class="card">
                            <div class="card-head">
                                <header> A favor de </header>
                                <div class="tools">
                                    <div class="btn-group">
                                        <a class="btn btn-icon-toggle btn-info btn-refresh" onclick=${()=>NuevoCliente(variables.documentos)}><i class="fa fa-plus"></i></a>
                                        <a class="btn btn-icon-toggle btn-success btn-refresh" onclick=${()=>BuscarCliente("Cliente","Nro_Documento",null)}><i class="fa fa-search"></i></a>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-3">
                                        <div class="form-group">
                                            <select id="Cod_TipoDoc" class="form-control input-sm" onchange=${()=>CambioClienteDoc()}>
                                                ${variables.documentos.map(e => yo`
                                                    <option value="${e.Cod_TipoDoc}">${e.Nom_TipoDoc}</option>
                                                    `)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="input-group">
                                            <input type="text" id="Nro_Documento" onblur="${() => BuscarClienteDoc()}" class="form-control required input-sm" placeholder="Nro Documento">
                                            <div class="input-group-btn">
                                                <button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#modal-buscar-doc-proveedor" id="BuscarDoc">
                                                    <i class="fa fa-globe"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-group">
                                            <button class="btn btn-info btn-sm" onclick="${()=>AbrirModalObs(variables.diagrama)}">Mas Detalles</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <input type="text" id="Cliente" class="form-control required input-sm"  placeholder="Nombre del cliente">
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
                                    <h4 class="box-title" id="Ruc_Empresa"><strong> R.U.C. 20442625256 </strong></h4>
                                </div>
                                <div class="row">
                                    <h4><strong>RECIBO DE EGRESO</strong></h4>
                                </div> 
                                
                                <div class="row">
                                    <div class="col-md-5">
                                        <div class="form-group">
                                            <select class="form-control" id="Serie">
                                                ${variables.Serie.map(e => yo`<option value="${e.Serie}">${e.Serie}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-7">
                                        <div class="form-group">
                                            <input type="text" class="form-control required"  id="Numero" value="00000000${variables.Numero}">
                                        </div>
                                    </div>
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                    </div>
                    <div class="col-sm-3">
                        <div class="form-group">
                            <b>Moneda: </b>
                            <select id="Cod_Moneda" id="" class="form-control input-sm">
                                ${variables.monedas.map(e => yo`
                                    <option value="${e.Cod_Moneda}">${e.Nom_Moneda}</option>
                                    `)}
                            </select>
                        </div>
                    </div>
                    <div class="col-sm-3">
                        <div class="form-group">
                            <b>Fecha: </b>
                            <input type="date" class="form-control input-sm" id="Fecha" value="${fecha_actual}">
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
                                            <select id="Id_Concepto" class="form-control input-sm">
                                                ${variables.conceptos.map(e => yo`
                                                    <option value="${e.Id_Concepto}">${e.Des_Concepto}</option>
                                                    `)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-9">
                                        <div class="form-group">
                                            <label for="">Concepto:</label>
                                            <textarea class="form-control input-sm" id="Des_Movimiento"></textarea>
                                        </div>
                                    </div>
                                    <div class="col-sm-3">
                                        <div class="form-group">
                                            <label for="">Importe :</label>
                                            <input class="form-control required input-sm" type="number" id="Monto" value="0.00">
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
    
            <div class="modal-footer">
                <button onclick="${() => Guardar()}" class="btn btn-primary btn-sm">Guardar</button>
                <button type="button" class="btn btn-default pull-left btn-sm" data-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>`

    var ingreso = document.getElementById('modal-proceso')
    empty(ingreso).appendChild(el)
    $('#modal-proceso').modal()
}


var Id_ClienteProveedor = null
var Obs_Recibo = null

function SeleccionarCliente(cliente){
    $("#Nro_DocumentoBuscar").val(cliente.Nro_Documento)
    $("#Cliente").val(cliente.Cliente)
    $("#Cod_TipoDoc").val(cliente.Cod_TipoDocumento)
    Id_ClienteProveedor = cliente.Id_ClienteProveedor
}
 

function CambioClienteDoc(){
    if($("#Cod_TipoDoc").val()=="1" || $("#Cod_TipoDoc").val()=="6"){
        $("#Nro_Documento").addClass("required")
        $("#Nro_Documento").css("border-color","red");
    }else{
        $("#Nro_Documento").css("border-color","");
        $("#Nro_Documento").removeClass("required",false)
    }
}
 


function BuscarClienteDoc() {
    if($("#Nro_Documento").val().trim().length>0){
        run_waitMe($('#div-cliente-recibo-egreso'), 1, "ios","Buscando cliente...");
        var Nro_Documento = document.getElementById('Nro_Documento').value
        var Cod_TipoDocumento = document.getElementById('Cod_TipoDoc').value
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
                    $("#Cliente").val(res.data.cliente[0].Cliente)
                    $("#Nro_Documento").val(res.data.cliente[0].Nro_Documento)
                    Id_ClienteProveedor = res.data.cliente[0].Id_ClienteProveedor
                }
                $('#div-cliente-recibo-egreso').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#div-cliente-recibo-egreso').waitMe('hide');
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
function AbrirModalObs(diagrama) {
    var xml = Obs_Recibo!=null?Obs_Recibo:''
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
        <button onclick="${() => GuardarObs_Recibo(diagrama)}" class="btn btn-primary">Guardar</button>
    </div></div>`;
    var obs_xml = document.getElementById('modal_obs_body')
    empty(obs_xml).appendChild(el)
    $('#modal_observaciones').modal()
}
function GuardarObs_Recibo(diagramas) {
    var OBS = '<Registro>'
    for (var i = 0; i < diagramas.length; i++) {
        OBS += '<' + diagramas[i].Cod_Elemento + '>' + document.getElementById(diagramas[i].Cod_Elemento).value + '</' + diagramas[i].Cod_Elemento + '>'
    }
    Obs_Recibo = OBS+'</Registro>'
    $('#modal_observaciones').modal('hide')
}
function Guardar() {
    if (ValidacionCampos("modal_error_egreso","modal_form_egreso") && !isNaN(parseInt(document.getElementById('Monto').value)) && parseInt(document.getElementById('Monto').value)>0) {
    const Id_Concepto = document.getElementById('Id_Concepto').value
    const Cliente = document.getElementById('Cliente').value
    const Des_Movimiento = document.getElementById('Des_Movimiento').value
    const Cod_TipoComprobante = 'RE'
    const Serie = document.getElementById('Serie').value
    const Numero = document.getElementById('Numero').value
    const Fecha = document.getElementById('Fecha').value
    const MontoEgreso = document.getElementById('Monto').value
    const MontoIngreso = 0
    const Cod_Moneda = document.getElementById('Cod_Moneda').value
    const Obs_Movimiento = Obs_Recibo
    run_waitMe($('#modal-proceso'), 1, "ios","");
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            Id_Concepto, Id_ClienteProveedor, Cliente,
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
                refrescar_movimientos()
            }else{
                toastr.error('No se pudo registrar correctamente el egreso','Error',{timeOut: 5000})
            }
            $('#modal-proceso').modal('hide')
            $('#modal-proceso').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#modal-proceso').waitMe('hide');
        });
    }
}
function NuevoEgreso() {
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
                CargarFormulario(res.data, fecha_format)
            }
            else
                CargarFormulario({})
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });

}

export { NuevoEgreso }