var empty = require('empty-element');
var yo = require('yo-yo');

import { ListarClientes } from './listar';
import { URL } from '../../../constantes_entorno/constantes'
import { CuentasBancarias } from './cuentas_bancarias'
import { Contactos } from './contactos'
import { Establecimientos } from './establecimientos'
import { PrecioProducto } from './precio_productos'
import { Vehiculos } from './vehiculos'
import { Licitaciones } from './licitaciones'
import { ActividadEconomica } from './actividad_eco'
import { Padrones } from './padrones'

function NuevoCliente(_escritura, mas_variables, cliente) {
    var tab = yo`
    <li class=""><a href="#tab_crear_cliente_2" data-toggle="tab" aria-expanded="false" id="id_tab_crear_cliente_2">Nuevo Cliente <a style="padding-left: 10px;" class="btn" onclick=${()=>CerrarTab()}><i class="fa fa-close text-danger"></i></a></a></li>`


    var el = yo`
    <div class="tab-pane" id="tab_crear_cliente_2">
       
        <section class="content">
            <div class="card">
                <div class="card-head">
                    <header>
                        <a onclick=${() => ListarClientes(_escritura)}
                        class="btn btn-xs btn-icon-toggle">
                            <i class="fa fa-arrow-left"></i></a>
                        ${cliente ? 'Editar' : 'Nuevo'} Cliente/Proveedor
                    </header>
                    
                </div>
                
                <div class="card-body"> 
                    <div class="panel">
                        <div class="panel-body">
                            <div class="row">
                                <div class="alert alert-callout alert-danger hidden" id="divErrors">
                                    <p>Es necesario llenar todos los campos requeridos marcados con rojo</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="nav-tabs-custom">
                                            ${cliente ? yo`
                                            <ul class="nav nav-tabs">
                                                <li class="active">
                                                    <a href="#tab_1_config" data-toggle="tab" aria-expanded="true">
                                                        <i class="fa fa-file"></i> Datos Generales</a>
                                                </li>
                                                <li class="">
                                                    <a href="#tab_2_config" data-toggle="tab" onclick="${() => CuentasBancarias(_escritura, cliente.Id_ClienteProveedor)}" aria-expanded="true">
                                                        Cuentas Bancarias</a>
                                                </li>
                                                <li class="">
                                                    <a href="#tab_2_config" data-toggle="tab" onclick="${() => Contactos(_escritura, cliente.Id_ClienteProveedor, mas_variables.documentos)}" aria-expanded="true">
                                                        Contactos</a>
                                                </li>
                                                <li class="">
                                                    <a href="#tab_2_config" data-toggle="tab" onclick="${() => Establecimientos(_escritura, cliente.Id_ClienteProveedor)}" aria-expanded="true">
                                                        Establecimientos</a>
                                                </li>
                                                <li class="">
                                                    <a href="#tab_2_config" data-toggle="tab" onclick="${() => PrecioProducto(_escritura, cliente.Id_ClienteProveedor)}" aria-expanded="true">
                                                        Precio de Productos</a>
                                                </li>
                                                <li class="">
                                                    <a href="#tab_2_config" data-toggle="tab" onclick="${() => Vehiculos(_escritura, cliente.Id_ClienteProveedor)}" aria-expanded="true">
                                                        Vehiculos</a>
                                                </li>
                                                <li class="">
                                                    <a href="#tab_2_config" data-toggle="tab" onclick="${() => Licitaciones(_escritura, cliente.Id_ClienteProveedor)}" aria-expanded="true">
                                                        Licitaciones</a>
                                                </li>
                                                <li class="">
                                                    <a href="#tab_2_config" data-toggle="tab" onclick="${() => ActividadEconomica(_escritura, cliente.Id_ClienteProveedor)}" aria-expanded="true">
                                                        Actividad Economica</a>
                                                </li>
                                                <li class="">
                                                    <a href="#tab_2_config" data-toggle="tab" onclick="${() => Padrones(_escritura, cliente.Id_ClienteProveedor)}" aria-expanded="true">
                                                        Padrones</a>
                                                </li>
                                            </ul>`
            : yo`
                                            <ul class="nav nav-tabs">
                                                <li class="active">
                                                    <a href="#tab_1_config" data-toggle="tab" aria-expanded="true">
                                                        <i class="fa fa-file"></i> Datos Generales</a>
                                                </li>
                                            </ul>`}
                                        <div class="tab-content">
                                            <div class="tab-pane" id="tab_2_config">
                                                <div class="row" id="tab_current">

                                                </div>
                                            </div>
                                            <div class="tab-pane active" id="tab_1_config">
                                               
                                                <div class="row">
                                                    <div class="col-sm-6">
                                                        <div class="form-group">
                                                            <label for="Cod_TipoDocumento">Tipo de documento *</label>
                                                            <select id="Cod_TipoDocumento" onchange="${() => CambioTipoDoc()}" class="form-control required">
                                                                ${mas_variables.documentos.map(e => yo`
                                                                <option value="${e.Cod_TipoDoc}" ${cliente ? cliente.Cod_TipoDocumento == e.Cod_TipoDoc ? 'selected' : '' : ''}>${e.Nom_TipoDoc}</option>`)}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-6">
                                                        <div class="form-group">
                                                            <label for="Nro_Documento">Numero de Documento *</label>
                                                            <input type="number" onblur="${() => VerificarDoc()}" class="form-control required" id="Nro_Documento" value="${cliente ? cliente.Nro_Documento : ''}">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row" id="formDNI" style="display:${cliente ? ((cliente.Cod_TipoDocumento != '6') ? 'block' : 'none') : 'block'};">
                                                    <div class="col-sm-3">
                                                        <div class="form-group">
                                                            <label for="Ap_Paterno">Apellido Paterno *</label>
                                                            <input type="text" style="text-transform:uppercase" class="form-control required" id="Ap_Paterno" value="${cliente ? cliente.Ap_Paterno : ''}">
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-3">
                                                        <div class="form-group">
                                                            <label for="Ap_Materno">Apellido Materno *</label>
                                                            <input type="text" style="text-transform:uppercase" class="form-control required" id="Ap_Materno" value="${cliente ? cliente.Ap_Materno : ''}">
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-6">
                                                        <div class="form-group">
                                                            <label for="Nombres">Nombre(s) *</label>
                                                            <input type="text" style="text-transform:uppercase" class="form-control required" id="Nombres" value="${cliente ? cliente.Nombres : ''}">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row" id="formRUC" style="display:${(cliente && cliente.Cod_TipoDocumento == '6') ? 'block' : 'none'};">
                                                    <div class="col-sm-6">
                                                        <div class="form-group">
                                                            <label for="Cliente">Razon Social *</label>
                                                            <input type="text" style="text-transform:uppercase" class="form-control" id="Cliente" value="${cliente ? cliente.Cliente : ''}">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-sm-6">
                                                        <div class="form-group">
                                                            <label for="Cod_TipoCliente">Tipo de cliente *</label>
                                                            <select id="Cod_TipoCliente" class="form-control required">
                                                                <option value=""></option>
                                                                ${mas_variables.tipos_clientes.map(e => yo`
                                                                <option value="${e.Cod_TipoCliente}" ${cliente ? cliente.Cod_TipoCliente == e.Cod_TipoCliente ? 'selected' : '' : ''}>${e.Nom_TipoCliente}</option>`)}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-6">
                                                        <div class="form-group">
                                                            <label for="Cod_TipoComprobante">Documento a facturar *</label>
                                                            <select id="Cod_TipoComprobante" class="form-control required">
                                                                <option value=""></option>
                                                                ${mas_variables.tipos_comprobantes.map(e => yo`
                                                                <option value="${e.Cod_TipoComprobante}" ${cliente ? cliente.Cod_TipoComprobante == e.Cod_TipoComprobante ? 'selected' : '' : ''}>${e.Nom_TipoComprobante}</option>`)}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-sm-6">
                                                        <div class="form-group">
                                                            <label for="Direccion">Direccion Fiscal</label>
                                                            <input type="text" style="text-transform:uppercase" class="form-control" id="Direccion" value="${cliente ? cliente.Direccion : ''}">
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-3">
                                                        <div class="form-group">
                                                            <label for="Email1">Correo electronico</label>
                                                            <input type="email" style="text-transform:uppercase" class="form-control" id="Email1" value="${cliente ? cliente.Email1 : ''}">
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-3">
                                                        <div class="form-group">
                                                            <label for="Telefono1">Telefono(s)</label>
                                                            <input type="text" style="text-transform:uppercase" class="form-control" id="Telefono1" value="${cliente ? cliente.Telefono1 : ''}">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="box box-default">
                                                    <div class="box-body">
                                                        <h4 class="box-title">Datos Empresariales</h4>
                                                        <div class="row">
                                                            <div class="col-sm-12">
                                                                <div class="nav-tabs-custom">
                                                                    <ul class="nav nav-tabs">
                                                                        <li class="">
                                                                            <a href="#tab_de_1" data-toggle="tab" aria-expanded="true">
                                                                                <i class="fa fa-building"></i> Datos Especificos</a>
                                                                        </li>
                                                                        <li class="active">
                                                                            <a href="#tab_de_2" data-toggle="tab" aria-expanded="true">
                                                                                <i class="fa fa-location-arrow"></i> Ubicacion y Forma Pago</a>
                                                                        </li>
                                                                        <li class="">
                                                                            <a href="#tab_de_3" data-toggle="tab" aria-expanded="true">
                                                                                <i class="fa fa-ellipsis-h"></i> Datos Adicionales</a>
                                                                        </li>
                                                                    </ul>
                                                                    <div class="tab-content">
                                                                        <div class="tab-pane" id="tab_de_1">
                                                                            <div class="row">
                                                                                <div class="col-sm-6">
                                                                                    <div class="form-group">
                                                                                        <label for="Cod_EstadoCliente">Estado del Cliente *</label>
                                                                                        <select id="Cod_EstadoCliente" class="form-control required">
                                                                                            ${mas_variables.estados.map(e => yo`
                                                                                            <option value="${e.Cod_EstadoCliente}" ${cliente ? (cliente.Cod_EstadoCliente) == e.Cod_EstadoCliente ? 'selected' : '' :
                ''}>${e.Nom_EstadoCliente}</option>`)}
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="col-sm-6">
                                                                                    <div class="form-group">
                                                                                        <label for="RUC_Natural">RUC/RNC</label>
                                                                                        <input type="text" class="form-control" id="RUC_Natural" value="${cliente ? cliente.RUC_Natural : ''}">
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="row">
                                                                                <div class="col-sm-6">
                                                                                    <div class="form-group">
                                                                                        <label for="Cod_CondicionCliente">Condicion del Cliente *</label>
                                                                                        <select id="Cod_CondicionCliente" class="form-control required">
                                                                                            ${mas_variables.condiciones.map(e => yo`
                                                                                            <option value="${e.Cod_CondicionCliente}" ${cliente ? (cliente.Cod_CondicionCliente) == e.Cod_CondicionCliente ?
                'selected' : '' : ''}>${e.Nom_CondicionCliente}</option>`)}
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="col-sm-6">
                                                                                    <div class="form-group">
                                                                                        <label for="PaginaWeb">Pagina Web</label>
                                                                                        <input type="text" class="form-control" id="PaginaWeb" value="${cliente ? cliente.PaginaWeb : ''}">
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="row">
                                                                                <div class="col-sm-6">
                                                                                    <div class="form-group">
                                                                                        <label for="Cod_Nacionalidad">Nacionalidad</label>
                                                                                        <select id="Cod_Nacionalidad" class="form-control">
                                                                                            ${mas_variables.paises.map(e => yo`
                                                                                            <option value="${e.Cod_Pais}" ${cliente ? (cliente.Cod_Nacionalidad) == e.Cod_Pais ? 'selected' : '' : ''}>${e.Nom_Pais}</option>`)}
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="col-sm-6">
                                                                                    <div class="form-group">
                                                                                        <label for="Email2">Email Empresarial</label>
                                                                                        <input type="text" class="form-control" id="Email2" value="${cliente ? cliente.Email2 : ''}">
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="row">
                                                                                <div class="col-sm-6">
                                                                                    <div class="form-group">
                                                                                        <label for="Cod_Sexo">Sexo</label>
                                                                                        <select id="Cod_Sexo" class="form-control">
                                                                                            ${mas_variables.sexos.map(e => yo`
                                                                                            <option value="${e.Cod_Sexo}" ${cliente ? (cliente.Cod_Sexo) == e.Cod_Sexo ? 'selected' : '' : ''}>${e.Nom_Sexo}</option>`)}
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="col-sm-6">
                                                                                    <div class="form-group">
                                                                                        <label for="Telefono2">Telefono Empresarial</label>
                                                                                        <input type="text" class="form-control" id="Telefono2" value="${cliente ? cliente.Telefono2 : ''}">
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="row">
                                                                                <div class="col-sm-6">
                                                                                    <div class="form-group">
                                                                                        <label for="Fecha_Nacimiento">Fecha de Nacimiento</label>
                                                                                        <input type="date" class="form-control" id="Fecha_Nacimiento" placeholder='dd/mm/aaaa' value="${(cliente && cliente.Fecha_Nacimiento!=null) ? cliente.Fecha_Nacimiento.split('T')[0] : ''}">
                                                                                    </div>
                                                                                </div>
                                                                                <div class="col-sm-6">
                                                                                    <div class="form-group">
                                                                                        <label for="Fax">Fax Empresarial</label>
                                                                                        <input type="text" class="form-control" id="Fax" value="${cliente ? cliente.Fax : ''}">
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div class="tab-pane active" id="tab_de_2">
                                                                            <div class="row">
                                                                                <div class="col-sm-4">
                                                                                    <div class="form-group">
                                                                                        <label for="Cod_Departamento">Departamento *</label>
                                                                                        <select id="Cod_Departamento" class="form-control required" onchange="${() => CambioDepartamento()}">
                                                                                            <option value="">Seleccione Departamento</option>
                                                                                            ${mas_variables.departamentos.map(e => yo`
                                                                                            <option value="${e.Cod_Departamento}" ${cliente ? (cliente.Cod_Ubigeo[0] + cliente.Cod_Ubigeo[1]) == e.Cod_Departamento ?
                'selected' : '' : ''}>${e.Nom_Departamento}</option>`)}
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="col-sm-4">
                                                                                    <div class="form-group">
                                                                                        <label for="Cod_Provincia">Pronvincia *</label>
                                                                                        <select id="Cod_Provincia" class="form-control required" onchange="${() => CambioProvincia()}">
                                                                                            <option value="">Seleccione Provincia</option>
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="col-sm-4">
                                                                                    <div class="form-group">
                                                                                        <label for="Cod_Distrito">Distrito *</label>
                                                                                        <select id="Cod_Distrito" class="form-control required">
                                                                                            <option value="">Seleccione Distrito</option>
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="row">
                                                                                <div class="col-sm-4">
                                                                                    <div class="form-group">
                                                                                        <label for="Cod_FormaPago">Formas de Pago *</label>
                                                                                        <select id="Cod_FormaPago" class="form-control required">
                                                                                            ${mas_variables.formas_pago.map(e => yo`
                                                                                            <option value="${e.Cod_FormaPago}" ${cliente ? cliente.Cod_FormaPago == e.Cod_FormaPago ? 'selected' : '' : ''}>${e.Nom_FormaPago}</option>`)}
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="col-sm-4">
                                                                                    <div class="form-group">
                                                                                        <label for="Limite_Credito">Limite de Credito</label>
                                                                                        <input type="number" class="form-control" id="Limite_Credito" value="${cliente ? cliente.Limite_Credito : '0'}">
                                                                                    </div>
                                                                                </div>
                                                                                <div class="col-sm-4">
                                                                                    <div class="form-group">
                                                                                        <label for="Num_DiaCredito">Nro Dias de Credito</label>
                                                                                        <input type="number" class="form-control" id="Num_DiaCredito" value="${cliente ? cliente.Num_DiaCredito : '0'}">
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div class="tab-pane" id="tab_de_3">
                                                                            ${MostrarXMLDatos(mas_variables.diagramas, cliente)}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="card-actionbar">
                                                    <button onclick="${() => Guardar(_escritura, mas_variables.diagramas, cliente)}" class="btn btn-primary">Guardar</button>
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
        </section>
    </div>`
    //var main = document.getElementById('main-contenido');
    //empty(main).appendChild(el);
    
    if($("#tab_crear_cliente_2").length){  

        $('#tab_crear_cliente_2').remove()
        $('#id_tab_crear_cliente_2').parents('li').remove()

        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    }else{
        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    } 
    $("#id_tab_crear_cliente_2").click()

    if (cliente) {
        CambioDepartamento(cliente.Cod_Ubigeo)
    }
}
function CerrarTab(){
    $('#tab_crear_cliente_2').remove()
    $('#id_tab_crear_cliente_2').parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show'); 
}
function getValueXML(xmlDoc, TAG) {
    if (xmlDoc.getElementsByTagName(TAG).length > 0 && xmlDoc.getElementsByTagName(TAG)[0].childNodes.length > 0) {
        return xmlDoc.getElementsByTagName(TAG)[0].childNodes[0].nodeValue
    } else {
        return ''
    }
}
function MostrarXMLDatos(diagramas, cliente) {
    var xml = cliente ? cliente.Obs_Cliente : ''
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xml, "text/xml");
    return yo`<div>
        ${diagramas.map(e => yo`
        <div class="row">
            <div class="col-sm-12">
                <div class="form-group">
                    <label for="">${e.Nom_Elemento}</label>
                    <input id="${e.Cod_Elemento}"
                    value=${cliente ? getValueXML(xmlDoc, e.Cod_Elemento) : ''}
                     class="form-control" />
                </div>
            </div>
        </div>`)}
        </div>`;
    var main = document.getElementById('tab_de_3');
    empty(main).appendChild(campos);
}
function VerificarDoc() {
    var Nro_Documento = $('#Nro_Documento').val()
    var Max_Caracteres = $('#Cod_TipoDocumento').val() == '6' ? 11 : 8
    if (Nro_Documento.length != Max_Caracteres || isNaN(parseInt(Nro_Documento))) {
        $('#error_text').text('Ingrese un numero correcto de documento')
        $('#tab_crear_cliente_2#divErrors').show()
        $('#Nro_Documento').select()
    } else {
        $('#tab_crear_cliente_2#divErrors').hide()
    }
}
function CambioTipoDoc() {
    if ($('#Cod_TipoDocumento').val() == '6') {
        $('#formRUC').show()
        $('#formDNI').hide()
        $("#Ap_Paterno").removeClass("required")
        $("#Ap_Materno").removeClass("required")
        $("#Nombres").removeClass("required")
        $("#Cliente").addClass("required")

    } else {
        $('#formRUC').hide()
        $('#formDNI').show()
        $("#Ap_Paterno").addClass("required")
        $("#Ap_Materno").addClass("required")
        $("#Nombres").addClass("required")
        $("#Cliente").removeClass("required")
    }
    $('#Nro_Documento').select()
}
function CambioDepartamento(Cod_Ubigeo) {
    var Cod_Provincia = ''
    if (Cod_Ubigeo)
        Cod_Provincia = Cod_Ubigeo[2] + Cod_Ubigeo[3]
    $('#Cod_Provincia').html('<option value="">Seleccione Provincia</option>')
    const Cod_Departamento = $('#Cod_Departamento').val()
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Cod_Departamento
        })
    }
    fetch(URL + '/clientes_api/get_provincias', parametros)
        .then(r => r.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                const provincias = res.data.provincias
                var provincias_items = ''
                for (var i = 0; i < provincias.length; i++) {
                    provincias_items += '<option value=' + provincias[i].Cod_Provincia + (provincias[i].Cod_Provincia == Cod_Provincia ? ' selected' : '') + ' >' + provincias[i].Nom_Provincia + '</option>'
                }
                $('#Cod_Provincia').append(provincias_items)
                CambioProvincia(Cod_Ubigeo)
            }
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
        });
}
function CambioProvincia(Cod_Ubigeo) {
    $('#Cod_Distrito').html('<option value="">Seleccione Distrito</option>')
    const Cod_Departamento = $('#Cod_Departamento').val()
    const Cod_Provincia = $('#Cod_Provincia').val()
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Cod_Departamento, Cod_Provincia
        })
    }
    fetch(URL + '/clientes_api/get_distritos', parametros)
        .then(r => r.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                const distritos = res.data.distritos
                var distritos_items = ''
                for (var i = 0; i < distritos.length; i++) {
                    distritos_items += '<option value=' + distritos[i].Cod_Ubigeo + (distritos[i].Cod_Ubigeo == Cod_Ubigeo ? ' selected' : '') + '>' + distritos[i].Nom_Distrito + '</option>'
                }
                $('#Cod_Distrito').append(distritos_items)
            }
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
        });
}

function Guardar(_escritura, diagramas, cliente) {
    if (ValidacionCampos('divErrors','tab_crear_cliente_2')) {
        run_waitMe($('#main-contenido'), 1, "ios","Guardando cliente proveedor...");
        var Id_ClienteProveedor = cliente ? cliente.Id_ClienteProveedor : '-1'
        var Cod_TipoDocumento = document.getElementById('Cod_TipoDocumento').value
        var Nro_Documento = document.getElementById('Nro_Documento').value
        var Ap_Paterno = document.getElementById('Ap_Paterno').value.toUpperCase()
        var Ap_Materno = document.getElementById('Ap_Materno').value.toUpperCase()
        var Nombres = document.getElementById('Nombres').value.toUpperCase()
        var Cliente = (document.getElementById('Cliente').value.toUpperCase() + Ap_Paterno +" " + Ap_Materno+" " + Nombres).trim()
        var Direccion = document.getElementById('Direccion').value.toUpperCase()
        var Cod_EstadoCliente = document.getElementById('Cod_EstadoCliente').value
        var Cod_CondicionCliente = document.getElementById('Cod_CondicionCliente').value
        var Cod_TipoCliente = document.getElementById('Cod_TipoCliente').value
        var RUC_Natural = document.getElementById('RUC_Natural').value
        var Cod_TipoComprobante = document.getElementById('Cod_TipoComprobante').value
        var Cod_Nacionalidad = document.getElementById('Cod_Nacionalidad').value
        var Fecha_Nacimiento = document.getElementById('Fecha_Nacimiento').value
        var Cod_Sexo = document.getElementById('Cod_Sexo').value
        var Email1 = document.getElementById('Email1').value
        var Email2 = document.getElementById('Email2').value
        var Telefono1 = document.getElementById('Telefono1').value
        var Telefono2 = document.getElementById('Telefono2').value
        var Fax = document.getElementById('Fax').value
        var PaginaWeb = document.getElementById('PaginaWeb').value
        var Cod_Ubigeo = document.getElementById('Cod_Distrito').value
        var Cod_FormaPago = document.getElementById('Cod_FormaPago').value
        var Limite_Credito = document.getElementById('Limite_Credito').value
        // var Obs_Cliente = document.getElementById('Obs_Cliente').value
        var Num_DiaCredito = document.getElementById('Num_DiaCredito').value
        var Obs_Cliente = ''
        for (var i = 0; i < diagramas.length; i++) {
            Obs_Cliente += '<' + diagramas[i].Cod_Elemento + '>' + document.getElementById(diagramas[i].Cod_Elemento).value + '</' + diagramas[i].Cod_Elemento + '>'
        }
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                Id_ClienteProveedor, Cod_TipoDocumento, Nro_Documento, Cliente,
                Ap_Paterno, Ap_Materno, Nombres, Direccion, Cod_EstadoCliente,
                Cod_CondicionCliente, Cod_TipoCliente, RUC_Natural, Cod_TipoCliente,
                RUC_Natural, Cod_TipoComprobante, Cod_Nacionalidad, Fecha_Nacimiento,
                Fecha_Nacimiento, Cod_Sexo, Email1, Email2, Telefono1, Telefono2,
                Fax, PaginaWeb, Cod_Ubigeo, Cod_FormaPago,
                Limite_Credito, Obs_Cliente, Num_DiaCredito
            })
        }
        console.log("parametros de guardado",parametros)
        fetch(URL + '/clientes_api/guardar_cliente', parametros)
            .then(req => req.json())
            .then(res => {
                console.log("respuesta de save",res)
                if (res.respuesta == 'ok') {
                    ListarClientes(_escritura)
                }
                else {
                    toastr.error('Ocurrio un error.  Tipo error : '+e,'Error',{timeOut: 5000})
                }
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
    }
}

export { NuevoCliente }