var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../../constantes_entorno/constantes'


function CargarFormulario(variables, fecha_actual) {
    var el = yo`
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
                <h4 class="modal-title"><b>RECIBO DE INGRESO</b></h4>
            </div>
            <div class="modal-body">
                <div class="modal fade" id="modal_observaciones">
                    <div class="modal-dialog modal-sm" > 
                        <div class="modal-content" id="modal_obs_body"></div>
                    </div> 
                </div>
                <div class="row">
                    <div class="callout callout-danger hidden" id="divErrors">
                        <p>Es necesario llenar todos los campos requeridos y el Importe mayor a cero</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-8">
                        <div class="box">
                            <div class="box-header with-border">
                                <h3 class="box-title">
                                    <strong>A favor de :</strong>
                                </h3>
                            </div>
                            <div class="box-body">
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
                                                <button type="button" class="btn btn-success" data-toggle="modal" data-target="#modal-buscar-doc-proveedor" id="BuscarDoc">
                                                    <i class="fa fa-plus"></i>
                                                </button>
                                            </div>
                                            <input type="text" id="Cliente" class="form-control required">
                                            <div class="input-group-btn">
                                                <button type="button" class="btn btn-info" data-toggle="modal" data-target="#modal-buscar-doc-proveedor" id="BuscarDoc">
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
                        <div class="box">
                            <div class="box-header with-border text-center">
                                <h4 class="box-title" id="Ruc_Empresa">
                                    <strong> R.U.C. 20442625256 </strong>
                                </h4>
                            </div>
                            <div class="box-body text-center">
                                <h4>
                                    <strong>RECIBO DE INGRESO</strong>
                                </h4>
                            </div>
                            <div class="box-footer">
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <select id="Serie" class="form-control">
                                            ${variables.Serie.map(e => yo`
                                                <option value="${e.Serie}">${e.Serie}</option>
                                                `)}
                                        </select>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <input type="text" id="Numero" class="form-control" value="0000000${variables.Numero}">
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
                        <div class="box">
                            <div class="box-header with-border">
                                <h3 class="box-title">
                                    <strong>DETALLE</strong>
                                </h3>
                            </div>
                            <div class="box-body">
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
var Id_ClienteProveedor = null
var Obs_Recibo = null
function BuscarCliente() {
    const Nro_Documento = document.getElementById('Nro_Documento').value
    const Cod_TipoDocumento = document.getElementById('Cod_TipoDoc').value
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
                document.getElementById('Cliente').value = res.data.cliente[0].Cliente
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
    if (ValidacionCampos() && !isNaN(parseInt(document.getElementById('Monto').value)) && parseInt(document.getElementById('Monto').value)>0) {
    const Id_Concepto = document.getElementById('Id_Concepto').value
    const Cliente = document.getElementById('Cliente').value
    const Des_Movimiento = document.getElementById('Des_Movimiento').value
    const Cod_TipoComprobante = 'RI'
    const Serie = document.getElementById('Serie').value
    const Numero = document.getElementById('Numero').value
    const Fecha = document.getElementById('Fecha').value
    const Monto = document.getElementById('Monto').value
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
            Numero, Fecha, Monto, Cod_Moneda, Obs_Movimiento
        })
    }
    fetch(URL + '/recibo_iegreso_api/guardar_recibo', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                 
            }
            $('#modal-proceso').modal('hide')
            H5_loading.hide()
        })
    }
}
function NuevoIngreso() {
    H5_loading.show();
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        })
    }
    fetch(URL + '/recibo_iegreso_api/get_variables_recibo_ingreso', parametros)
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

export { NuevoIngreso }