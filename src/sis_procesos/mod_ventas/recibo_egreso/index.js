var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../../constantes_entorno/constantes'
import { refrescar_movimientos } from '../../movimientos_caja'
import { NuevoCliente } from '../../modales'

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
                    <div class="callout callout-danger hidden" id="modal_error_egreso">
                        <p>Es necesario llenar todos los campos requeridos y el Importe mayor a cero</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-8">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <p>A favor de :</p>
                            </div>
                            <div class="panel-body">
                                <div class="row">
                                    <div class="col-md-3">
                                        <div class="form-group">
                                            <select id="Cod_TipoDoc" class="form-control">
                                                ${variables.documentos.map(e => yo`
                                                    <option value="${e.Cod_TipoDoc}">${e.Nom_TipoDoc}</option>
                                                    `)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="input-group">
                                            <input type="text" id="Nro_Documento" onblur="${() => BuscarCliente()}" class="form-control required">
                                            <div class="input-group-btn">
                                                <button type="button" class="btn btn-success" data-toggle="modal" data-target="#modal-buscar-doc-proveedor" id="BuscarDoc">
                                                    <i class="fa fa-globe"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-group">
                                            <button class="btn btn-info" onclick="${()=>AbrirModalObs(variables.diagrama)}">Mas Detalles</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="input-group">
                                            <div class="input-group-btn">
                                                <button type="button" class="btn btn-success" id="AgregarCliente" onclick=${()=>NuevoCliente(variables.documentos)}>
                                                    <i class="fa fa-plus"></i>
                                                </button>
                                            </div>
                                            <input type="text" id="Cliente" class="form-control required">
                                            <div class="input-group-btn">
                                                <button type="button" class="btn btn-info" id="BuscarCliente" onclick=${()=>VerBuscarCliente(variables)}">
                                                    <i class="fa fa-search"></i>
                                                </button>
                                            </div>
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
                            <select id="Cod_Moneda" id="" class="form-control">
                                ${variables.monedas.map(e => yo`
                                    <option value="${e.Cod_Moneda}">${e.Nom_Moneda}</option>
                                    `)}
                            </select>
                        </div>
                    </div>
                    <div class="col-sm-3">
                        <div class="form-group">
                            <b>Fecha: </b>
                            <input type="date" class="form-control" id="Fecha" value="${fecha_actual}">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-12">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <p>Detalles</p>
                            </div>
                            <div class="panel-body">
                                <div class="row">
                                    <div class="col-sm-9">
                                        <div class="form-group">
                                            <label for="">Cuenta</label>
                                            <select id="Id_Concepto" class="form-control" id="">
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
                                            <textarea class="form-control" id="Des_Movimiento"></textarea>
                                        </div>
                                    </div>
                                    <div class="col-sm-3">
                                        <div class="form-group">
                                            <label for="">Importe :</label>
                                            <input class="form-control required" type="number" id="Monto" value="0.00">
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
                <button onclick="${() => Guardar()}" class="btn btn-primary">Guardar</button>
                <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>`

    var ingreso = document.getElementById('modal-proceso')
    empty(ingreso).appendChild(el)
    $('#modal-proceso').modal()
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
    $("#txtBuscarCliente").val($("#Cliente").val())
}



var Id_ClienteProveedor = null
var Obs_Recibo = null

function SeleccionarCliente(cliente){
    $("#Nro_DocumentoBuscar").val(cliente.Nro_Documento)
    $("#Cliente").val(cliente.Cliente)
    $("#Cod_TipoDoc").val(cliente.Cod_TipoDocumento)
    Id_ClienteProveedor = cliente.Id_ClienteProveedor
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



function BuscarCliente() {
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
            H5_loading.hide()
        })
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
    H5_loading.show()
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
            H5_loading.hide()
        })
    }
}
function NuevoEgreso() {
    H5_loading.show();
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
            H5_loading.hide()
        })

}

export { NuevoEgreso }