var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../constantes_entorno/constantes'
import { LimpiarVariablesGlobales } from '../../../utility/tools'

var aRequiereStock = true
var aIdClienteProveedor = 0
var aCodTipoProducto = null
var arrayValidacion = [null,'null','',undefined]


function BuscarProducto(_RequiereStock,text_busqueda) {
    LimpiarVariablesGlobales()
    aRequiereStock = _RequiereStock
    var el = yo`
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h4 class="modal-title"><strong>Buscar Producto </strong></h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group" id="divCodCategoriaProducto">
                                <label for="Cod_Categoria" id="lbCod_Categoria">Categoria</label>
                                <select id="Cod_Categoria" class="form-control input-sm" onchange=${()=>Buscar()}>
                                   
                                </select>
                            </div>
                        </div>
                        <div  class="col-md-4">
                            <div class="form-group" id="divCodPrecioProducto">
                                <label for="Cod_Precio">Tipo Precio</label>
                                <select id="Cod_Precio"  class="form-control input-sm" onchange=${()=>Buscar()}>
                                
                                </select>
                            </div>
                        </div>
                        <div  class="col-md-4">
                            <div class="form-group">
                                <label></label>
                                <div class="checkbox checkbox-inline checkbox-styled" id="divSoloProductoStock">
                                    <label>
                                        <input type="checkbox" checked="checked" id="chbSoloProductoStock"><span> Solo productos con stock?</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="input-group">
                                <input type="text" class="form-control input-sm" value="${text_busqueda}" id="txtBusquedaProducto" onkeypress=${()=>KeyPressBusquedaProducto(event)}>
                                <div class="input-group-btn">
                                    <button type="button" class="btn btn-success btn-sm" onclick="${()=>Buscar()}"><i class="fa fa-search"></i> Buscar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="table-responsive" id="contenedorTablaProductos">

                        </div>
                    </div>
                </div>
                <div class="modal-footer text-center"> 
                    <button type="button" class="btn btn-danger btn-sm" data-dismiss="modal">Cancelar</button>
                </div>
            </div>
        </div>`

    var modal_proceso = document.getElementById('modal-superior');
    empty(modal_proceso).appendChild(el);

    $('#modal-superior').modal()

    CargarTipoPrecio()
    CargarCategoria()
    Buscar()
}


 

function BuscarCliente(idInputCliente,idInputDoc,Cod_TipoCliente) {
    LimpiarVariablesGlobales()
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
                            <div class="radio-inline radio-styled radio-primary">
                                <label>
                                    <input type="radio" id="optionsRadiosBuscar" name="optionsRadiosBuscar" value="nro"><span> Por Nro. Documento</span>
                                </label>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <label></label>
                            <div class="radio-inline radio-styled radio-primary">
                                <label>
                                    <input type="radio" id="optionsRadiosBuscar" name="optionsRadiosBuscar" checked="checked" value="nombre"><span> Por Nombre o Cliente</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="input-group">
                                <input type="text" class="form-control input-sm" id="txtBuscarClienteModal" onkeypress=${()=>KeyPressBusquedaCliente(event,idInputCliente,idInputDoc,Cod_TipoCliente)}>
                                <div class="input-group-btn">
                                    <button type="button" id="BuscarClienteModal" class="btn btn-success btn-sm" onclick=${()=>BusquedaClienteModal(idInputCliente,idInputDoc,Cod_TipoCliente)}><i class="fa fa-search"></i> Buscar</button>
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
                    <button type="button" class="btn btn-danger btn-sm" data-dismiss="modal">Cancelar</button> 
                </div>
            </div>
        </div>`

    var modal_proceso = document.getElementById('modal-superior');
    empty(modal_proceso).appendChild(el);
    $('#modal-superior').modal()
    $("#txtBuscarClienteModal").val($("#"+idInputCliente).val())
    BusquedaClienteModal(idInputCliente,idInputDoc,Cod_TipoCliente)
}


function NuevoCliente(documentos) {
    LimpiarVariablesGlobales()
    var el = yo`
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h4 class="modal-title"><strong>Nuevo Cliente</strong></h4>
                </div>
                <div class="modal-body" id="modal_form_nuevo_cliente">
                    <div class="row">
                        <div id="modal_error_nuevo_cliente" class="alert alert-callout alert-danger hidden">
                            <p> Es necesario llenar los campos marcados con rojo</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="Cod_TipoDocumento">Tipo de documento *</label>
                                <select id="Cod_TipoDocumento"  class="form-control input-sm required" onchange=${()=>CambioClienteDoc()}>
                                    ${documentos.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_TipoDoc}">${e.Nom_TipoDoc}</option>`)}
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="Nro_Documento_NC">Numero de Documento </label>
                                <input type="number"  class="form-control required" id="Nro_Documento_NC">
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="Cliente_NC">Nombre Completo *</label>
                                <input type="text"  class="form-control required" id="Cliente_NC">
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="DireccioN">Direccion *</label>
                                <input type="text"  class="form-control required" id="DireccioN">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="Email1">Correo Electronico</label>
                                <input type="email"  class="form-control" id="Email1">
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="Telefono1">Telefono</label>
                                <input type="text"  class="form-control" id="Telefono1">
                            </div>
                        </div>
                    </div>
                     
                </div>
                <div class="modal-footer text-center"> 
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-info" id="btnGuardar" onclick=${()=>GuardarNuevoCliente()}>Aceptar</button>
                </div>
            </div>
        </div>`

    var modal_proceso = document.getElementById('modal-superior');
    empty(modal_proceso).appendChild(el);
    $('#modal-superior').modal()
}


function AgregarTabla(clientes,idInputCliente,idInputDoc){
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
            <td><button class="btn btn-xs btn-primary" data-dismiss="modal" onclick="${()=>SeleccionarCliente(u,idInputCliente,idInputDoc)}"><i class="fa fa-check"></i> Elegir</button></td>
        </tr>`)}
    </tbody>

</table>`
    empty(document.getElementById('contenedorTablaClientes')).appendChild(el);
}

function AgregarTablaProductos(productos){ 
    var el = yo`<tabla class="table table-hover">
    <thead>
        <tr>
            <th>Codigo</th> 
            <th>Producto</th>
            <th>Stock</th>
            <th>Moneda</th>
            <th>PU</th>
            <th>UM</th> 
            <th>Acciones</th>
        </tr>
    </thead>
    <tbody>
        ${productos.map(u => yo`
        <tr>
            <td>${u.Cod_Producto}</td> 
            <td>${u.Nom_Producto}</td>  
            <td>${u.Stock_Act}</td> 
            <td>${u.Nom_Moneda}</td>  
            <td>${u.Nom_UnidadMoneda}</td>  
            <td>${u.Precio_Compra}</td>  
            <td>${u.Nom_UnidadMedida}</td>
            <td><button class="btn btn-xs btn-primary" data-dismiss="modal" onclick="${()=>SeleccionarProducto(u)}"><i class="fa fa-check"></i> Elegir</button></td>
        </tr>`)}
    </tbody>

</table>`
    empty(document.getElementById('contenedorTablaProductos')).appendChild(el);
}

function LlenarCategorias(categorias){
    var html = '<option value=null>Seleccione una Categoria</option>'
    for(var i=0; i<categorias.length; i++){
        html = html+'<option value="'+categorias[i].Cod_Categoria+'">'+categorias[i].Des_Categoria+'</option>'
    }
     
    $("#Cod_Categoria").html('')
    $("#Cod_Categoria").html(html)  
}


function LlenarPrecios(precios){
    var html = ''
    for(var i=0; i<precios.length; i++){
        html = html+'<option value="'+precios[i].Cod_Precio+'">'+precios[i].Nom_Precio+'</option>'
    }
     
    $("#Cod_Precio").html('')
    $("#Cod_Precio").html(html)
}

function AbrirModalObs(diagrama,obs_global_xml,id_modal,id_modal_body) {
    var xml = obs_global_xml!=null?obs_global_xml:''
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
        <button onclick="${() => GuardarObs_Recibo(diagrama,obs_global_xml,id_modal)}" class="btn btn-primary">Guardar</button>
    </div></div>`;
    var obs_xml = document.getElementById(id_modal_body)
    empty(obs_xml).appendChild(el)
    $('#'+id_modal).modal()
}

function GuardarObs_Recibo(diagramas,obs_global_xml,id_modal) {
    var OBS = '<Registro>'
    for (var i = 0; i < diagramas.length; i++) {
        OBS += '<' + diagramas[i].Cod_Elemento + '>' + document.getElementById(diagramas[i].Cod_Elemento).value + '</' + diagramas[i].Cod_Elemento + '>'
    }
    global.obs_xml = OBS+'</Registro>'
    $('#'+id_modal).modal('hide')
}


function getValueXML(xmlDoc, TAG) {
    if (xmlDoc.getElementsByTagName(TAG).length > 0 && xmlDoc.getElementsByTagName(TAG)[0].childNodes.length > 0) {
        return xmlDoc.getElementsByTagName(TAG)[0].childNodes[0].nodeValue
    } else {
        return ''
    }
}


function SeleccionarProducto(producto){    
    global.objProducto = producto
    global.objProductoVentas = producto
}

function SeleccionarCliente(cliente,idInputCliente,idInputDoc){
    if (idInputCliente!=null){
        $("#"+idInputCliente).val(cliente.Cliente)
    }
    
    if (idInputDoc!=null){
        $("#"+idInputDoc).val(cliente.Nro_Documento)
    }

    
    global.objCliente = cliente
    global.objClienteVenta = cliente
    
    if (idInputCliente!=null)
        $("#"+idInputCliente).attr("data-id",cliente.Id_ClienteProveedor)
    //$("#Cod_TipoDoc").val(cliente.Cod_TipoDocumento)
}

function CambioClienteDoc(){
    if($("#Cod_TipoDocumento").val()=="1" || $("#Cod_TipoDocumento").val()=="6"){
        $("#Nro_Documento_NC").addClass("required")
        $("#Nro_Documento_NC").css("border-color","red");
    }else{
        $("#Nro_Documento_NC").css("border-color","");
        $("#Nro_Documento_NC").removeClass("required",false)
    }
}

function GuardarNuevoCliente(){
     
    if(ValidacionCampos("modal_error_nuevo_cliente","modal_form_nuevo_cliente")){
        run_waitMe($('#modal-superior'), 1, "ios","Registrando cliente...");
        var Cod_TipoDocumento = $("#Cod_TipoDocumento").val()
        var Nro_Documento = $("#Nro_Documento_NC").val()
        var Cliente = $("#Cliente_NC").val()
        var DireccioN = $("#DireccioN").val()
        var Email1 = $("#Email1").val()
        var Telefono1 = $("#Telefono1").val()
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                Cod_TipoDocumento,
                Nro_Documento,
                Cliente,
                DireccioN,
                Email1,
                Telefono1
            })
        }
        fetch(URL+'/clientes_api/guardar_cliente_2', parametros)
        .then(req => req.json())
        .then(res => {
            $('#modal-superior').modal('hide')
            $('#modal-superior').waitMe('hide');
            if (res.respuesta == 'ok') { 
                toastr.success('Se registro correctamente el cliente','Confirmacion',{timeOut: 5000})              
                $('#modal-superior').modal('hide')
            }
            else{
                toastr.error('No se pudo registrar correctamente el cliente','Error',{timeOut: 5000})
            }
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#modal-superior').waitMe('hide');
        });
    }
}


function CargarCategoria(){ 
    run_waitMe($('#divCodCategoriaProducto'), 2, "ios",""); 
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        })
    }
    fetch(URL+'/categorias_api/get_categoriaspadre', parametros)
    .then(req => req.json())
    .then(res => {
        if (res.respuesta == 'ok') 
            LlenarCategorias(res.data.categoriaspadre)
        else
            LlenarCategorias([])
        
        $('#divCodCategoriaProducto').waitMe('hide');
    }).catch(function (e) {
        console.log(e);
        $('#divCodCategoriaProducto').waitMe('hide');
        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
    });
}

function CargarTipoPrecio(){
    run_waitMe($('#divCodPrecioProducto'), 2, "ios",""); 
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        })
    }
    fetch(URL+'/productos_serv_api/get_precios', parametros)
    .then(req => req.json())
    .then(res => {
        if (res.respuesta == 'ok') 
            LlenarPrecios(res.data.precios)
        else
            LlenarPrecios([])
        
        $('#divCodPrecioProducto').waitMe('hide');
    }).catch(function (e) {
        console.log(e);
        $('#divCodPrecioProducto').waitMe('hide');
        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
    });
}


function Buscar(){
    if (aIdClienteProveedor==0){
        BusquedaProducto() 
    }else{
        BusquedaXIdClienteProveedor()
    }
}

function KeyPressBusquedaProducto(event){
    if(event.which == 13) { 
        Buscar()
    }
}

function BusquedaProducto(){
    if($("#txtBusquedaProducto").val().trim().length>=2){
        run_waitMe($('#contenedorTablaProductos'), 1, "ios","Buscando productos..."); 
        var Buscar = $("#txtBusquedaProducto").val().replace(/" "/g ,"%")
        var Cod_Precio = $("#Cod_Precio").val()
        var Cod_Categoria = arrayValidacion.includes($("#Cod_Categoria").val())?null:$("#Cod_Categoria").val()

        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Buscar,
                CodTipoProducto:aCodTipoProducto,
                Cod_Categoria,
                Cod_Precio,
                Flag_RequiereStock:aRequiereStock
            })
        }
        fetch(URL+'/productos_serv_api/buscar_producto_caja_actual', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var productos = res.data.productos
                if(productos.length > 0)
                    AgregarTablaProductos(productos)
                else  
                    empty(document.getElementById('contenedorTablaProductos'));
            }
            else
                empty(document.getElementById('contenedorTablaProductos'));
            $('#contenedorTablaProductos').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            $('#contenedorTablaProductos').waitMe('hide');
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
        });
    } 
}


function BusquedaXIdClienteProveedor(){ 
    if($("#txtBusquedaProducto").val().trim().length>=2){
        var Buscar = $("#txtBusquedaProducto").val().replace(/" "/g ,"%")
        var Cod_Categoria = $("#Cod_Categoria").val()

        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Buscar,
                CodTipoProducto:aCodTipoProducto,
                Cod_Categoria
            })
        }
        fetch(URL+'/productos_serv_api/buscar_producto_by_id_cliente_caja_actual', parametros)
        .then(req => req.json())
        .then(res => {
            console.log(res)
            if (res.respuesta == 'ok') {
                var productos = res.data.productos
                if(productos.length > 0)
                    AgregarTablaProductos(productos)
                else  
                    empty(document.getElementById('contenedorTablaProductos'));
            }
            else
                empty(document.getElementById('contenedorTablaProductos'));
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
        });
    }
}

function KeyPressBusquedaCliente(event,idInputCliente,idInputDoc,Cod_TipoCliente){
    if(event.which == 13) { 
        BusquedaClienteModal(idInputCliente,idInputDoc,Cod_TipoCliente)
    }
}

function BusquedaClienteModal(idInputCliente,idInputDoc,Cod_TipoCliente){
     
    var txtBuscarCliente = $("#txtBuscarClienteModal").val()
    if(txtBuscarCliente.length>=4){ 
        run_waitMe($('#contenedorTablaClientes'), 1, "ios","Buscando cliente..."); 
        if ($('input[name=optionsRadiosBuscar]:checked').val() == 'nombre') {
            var Cliente = txtBuscarCliente
            const parametros = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Cliente,
                    Cod_TipoCliente
                })
            }
            fetch(URL+'/clientes_api/get_cliente_by_nombre', parametros)
            .then(req => req.json())
            .then(res => { 
                if (res.respuesta == 'ok') {
                    var clientes = res.data.cliente
                    if(clientes.length > 0)
                        AgregarTabla(clientes,idInputCliente,idInputDoc)
                    else  
                        empty(document.getElementById('contenedorTablaClientes'));
                }
                else
                    empty(document.getElementById('contenedorTablaClientes'));
                $('#contenedorTablaClientes').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                $('#contenedorTablaClientes').waitMe('hide');
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            });
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
                    Cod_TipoDocumento,
                    Cod_TipoCliente
                })
            }
            fetch(URL+'/clientes_api/get_cliente_by_documento', parametros)
            .then(req => req.json())
            .then(res => {
                if (res.respuesta == 'ok') {
                    var clientes = res.data.cliente
                    if(clientes.length > 0)
                        AgregarTabla(clientes,idInputCliente,idInputDoc)
                    else  
                        empty(document.getElementById('contenedorTablaClientes'));
                }
                else
                    empty(document.getElementById('contenedorTablaClientes'));
                $('#contenedorTablaClientes').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                $('#contenedorTablaClientes').waitMe('hide');
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            });
        }
        $("#txtBuscarClienteModal").focus()
    }
}


  
export { NuevoCliente , BuscarCliente , AbrirModalObs , BuscarProducto,Buscar }