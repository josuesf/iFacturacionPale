var empty = require('empty-element');
var yo = require('yo-yo');
import { ListarCajas } from './listar'
import {URL} from '../../../constantes_entorno/constantes'

function Ver(_escritura, sucursales, usuarios, cuentas_contables, caja, documentos, productos) {
    
    var tab = yo`
    <li class=""><a href="#tab_crear_caja_2" data-toggle="tab" aria-expanded="false" id="id_tab_crear_caja_2">Nueva Caja<a style="padding-left: 10px;" class="btn" onclick=${()=>CerrarTab()}><i class="fa fa-close text-danger"></i></a></a></li>`


    var el = yo`
    <div class="tab-pane" id="tab_crear_caja_2">
        <div class="modal modal-danger fade" id="modal-danger-documento" style="display: none;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                        <h4 class="modal-title">¿Esta seguro que desea eliminar este documento?</h4>
                    </div>
                    <div class="modal-body">
                        <p>Al eliminar el documento se perderan todos los datos.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger ink-reaction pull-left" data-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-success ink-reaction" id="btnEliminar-documento" data-dismiss="modal">Si, eliminar</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal modal-danger fade" id="modal-danger-favorito" style="display: none;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                        <h4 class="modal-title">¿Esta seguro que desea eliminar este producto?</h4>
                    </div>
                    <div class="modal-body">
                        <p>Al eliminar el producto dejara de estar en la lista de favoritos.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-success" id="btnEliminar-favorito" data-dismiss="modal">Si, eliminar</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="modal-buscar-responsable" style="display: none;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                       
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span></button>
                        <h4 class="modal-title">Usuario o vendedor responsable</h4>
                    </div>
                    <div class="modal-body">
                        <div class="panel">
                            <div class="panel-heading">
                            <header>Busqueda de usuario</header>
                            </div>
                            <form role="form">
                                <div class="panel-body">
                                
                                    <label for="Cod_UsuarioCajero">Ingrese codigo o nombre de usuario</label>
                                    <div class="input-group">
                                        <div class="input-group-btn">
                                            <button type="button" class="btn btn-primary ink-reaction" onclick="${()=> BusquedaDeUsuario()}">Buscar</button>
                                        </div>
                                        <input type="text" class="form-control" id="txtBuscarUsuario" onkeydown="${()=> BusquedaDeUsuario()}">
                                        
                                    </div>
                                    <br>
                                    <div class="table-responsive" id="contenedorTablaUsuarios">

                                    </div>
                                </div>
                            </form>
                            
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="modal-nuevo-editar-documento" style="display: none;">
            
        </div>
        <div class="modal fade" id="modal-nuevo-favorito" style="display: none;">
            
        </div>
       
        <section class="content">
            <div class="card">
                <div class="card-head">
                    <header><a onclick=${() => ListarCajas(_escritura)} class="btn btn-xs btn-icon-toggle"><i class="fa fa-arrow-left"></i> </a>${caja ? 'Editar' : 'Nueva'} Caja</header> 
                </div> 
                <div class="card-body">
                    <div class="panel">
                        
                        <!-- form start -->
                        <div role="form" id="divAgregarCaja">
                            <div class="panel-body">
                                <div class="row">
                                    <div class="alert alert-callout alert-danger hidden" id="divErrors">
                                        <p>Es necesario llenar todos los campos requeridos marcados con rojo</p>
                                    </div>
                                </div>
                                <div class="row">
                                    ${caja ? yo`` : yo`<div class="col-sm-6">
                                    <div class="form-group">
                                        <label for="Cod_Caja">Codigo Caja</label>
                                        <input type="text" style="text-transform:uppercase" class="form-control required" id="Cod_Caja" placeholder="Ingrese codigo caja">
                                        <div class="form-control-line"></div>
                                    </div>
                                </div>`}
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Flag_Activo"></label>
                                            
                                            <div class="checkbox-inline checkbox-styled checkbox-primary">
                                                <label>
                                                    <input type="checkbox" id="Flag_Activo" class="required" checked="${caja ? caja.Flag_Activo : 0}"><span> Es Activo?</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Des_Caja">Nombre de la Caja</label>
                                            <input type="text"  style="text-transform:uppercase" class="form-control required" id="Des_Caja" placeholder="Ingrese Nombre de caja" value="${caja ? caja.Des_Caja : ''}">
                                            <div class="form-control-line"></div>    
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Cod_Sucursal">Sucursal a la que pertence</label>
                                            <select id="Cod_Sucursal" class="form-control required">
                                                ${sucursales.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_Sucursal}" ${caja ? caja.Cod_Sucursal == e.Cod_Sucursal ? 'selected' : '' : ''}>${e.Nom_Sucursal}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <label for="Cod_UsuarioCajero">Usuario o vendedor responsable</label>
                                        <div class="input-group">
                                            <div class="input-group-btn">
                                                <button type="button" class="btn btn-info ink-reaction" onclick=${()=>{$("#modal-buscar-responsable").modal()}}>Buscar responsable</button>
                                            </div>
                                            <input type="text" class="form-control required" id="Cod_Usuario" value="${caja? caja.Cod_UsuarioCajero:''}" disabled>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Cod_CuentaContable">Cuenta Contable</label>
                                            <select id="Cod_CuentaContable" class="form-control select2 required">
                                                <option style="text-transform:uppercase" value="10102" selected>10102</option>
                                                ${sucursales.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_CuentaContable}" ${caja ? caja.Cod_Sucursal == e ? 'selected' : '' : ''}>${e}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <button onclick="${() => GuardarCaja(_escritura,caja)}" class="btn btn-primary ink-reaction">Guardar</button>
                                    </div>
                                </div>
                                <p></p>
                                ${caja != undefined ? yo`
                                    <div class="row">
                                            <div class="col-sm-12">
                                                <div class="nav-tabs-custom">
                                                    <ul class="nav nav-tabs">
                                                        <li class="active">
                                                            <a href="#tab_1_caja" data-toggle="tab" aria-expanded="true">
                                                                <i class="fa fa-file"></i> Documentos Relacionados</a>
                                                        </li>
                                                        <li class="">
                                                            <a href="#tab_crear_caja_2_caja" data-toggle="tab" aria-expanded="false">
                                                                <i class="fa fa-star"></i> Productos Favoritos</a>
                                                        </li>
                                                    </ul>
                                                    <div class="tab-content">
                                                        <div class="tab-pane active" id="tab_1_caja">
                                                            <div class="card-head">
                                                                <div class="tools">
                                                                    <div class="btn-group">
                                                                        <a class="btn btn-info pull-right" data-toggle="modal" data-target="#modal-nuevo-editar-documento" onclick="${()=>AgregarDocumento(_escritura, sucursales, usuarios, cuentas_contables,caja)}">
                                                                        <i class="fa fa-plus"></i> Agregar</a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="table-responsive">
                                                                <table class="table table-bordered table-striped">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Item</th>
                                                                            <th>Documento</th>
                                                                            <th>Serie</th>
                                                                            <th>Impresora</th>
                                                                            <th>Imprimir</th>
                                                                            <th>Nombre Archivo</th>
                                                                            <th>Rapida</th>
                                                                            <th>Ticketera</th>
                                                                            <th>Acciones</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        ${documentos.map(u => yo`
                                                                        <tr>
                                                                            <td>${u.Item}</td>
                                                                            <td>${u.Nom_TipoComprobante}</td>
                                                                            <td>${u.Serie}</td>
                                                                            <td>${u.Impresora}</td>
                                                                            <td>${u.Flag_Imprimir}</td>
                                                                            <td>${u.Nom_Archivo}</td>
                                                                            <td>${u.Flag_FacRapida}</td>
                                                                            <td>${u.Nro_SerieTicketera}</td>
                                                                            <td>
                                                                                ${_escritura ? yo`<button class="btn btn-xs btn-success" data-toggle="modal" data-target="#modal-nuevo-editar-documento" onclick="${()=>AgregarDocumento(_escritura, sucursales, usuarios, cuentas_contables,caja, u)}"><i class="fa fa-edit"></i></button>` : yo``}
                                                                                ${_escritura ? yo`<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger-documento" onclick="${()=>EliminarDocumento(_escritura, sucursales, usuarios, cuentas_contables,caja, u)}"><i class="fa fa-trash"></i></button>` : yo``}
                                                                                
                                                                            </td>
                                                                        </tr>`)}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                        <!-- /.tab-pane -->
                                                        <div class="tab-pane" id="tab_crear_caja_2_caja">
                                                            <div class="card-head">
                                                                <div class="tools">
                                                                    <div class="btn-group">
                                                                        <a class="btn btn-info pull-right" data-toggle="modal" data-target="#modal-nuevo-favorito" onclick="${()=>AgregarFavorito(_escritura, sucursales, usuarios, cuentas_contables,caja)}">
                                                                        <i class="fa fa-plus"></i> Agregar</a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="table-responsive" id="contenedorTablaFavoritos">
                                                                <table class="table table-bordered table-striped">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Producto</th>
                                                                            <th>Almacen</th>
                                                                            <th>Unidad Medida</th>
                                                                            <th>Precio</th>
                                                                            <th>Stock</th>
                                                                            <th>Acciones</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        ${productos.map(u => yo`
                                                                        <tr>
                                                                            <td>${u.Nom_Producto}</td>
                                                                            <td>${u.Des_Almacen}</td>
                                                                            <td>${u.Nom_UnidadMedida}</td>
                                                                            <td>${u.Valor}</td>
                                                                            <td>${u.Stock_Act}</td>
                                                                            <td>
                                                                                ${_escritura ? yo`<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger-favorito" onclick="${()=>EliminarFavorito(_escritura, caja, u)}"><i class="fa fa-trash"></i></button>` : yo``}
                                                                                
                                                                            </td>
                                                                        </tr>`)}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <!-- /.tab-content -->
                                                </div>
                                            </div>
                                        
                                        </div>    
                                    `: yo``}
                                
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>`
    //var main = document.getElementById('main-contenido');
    //empty(main).appendChild(el);
    // $('.select2').select2();

    if($("#tab_crear_caja_2").length){  

        $('#tab_crear_caja_2').remove()
        $('#id_tab_crear_caja_2').parents('li').remove()

        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    }else{
        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    } 
    $("#id_tab_crear_caja_2").click()
}

var impresoras = [
    'Microsoft XSP Document Writer',
    'Microsoft Print to PDF',
    'Fax',
    'Enviar a OneNote 2013',
    'BIXOLON SPP R310',
    'EPSON TM-T20II'
]

function CerrarTab(){
    $('#tab_crear_caja_2').remove()
    $('#id_tab_crear_caja_2').parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show'); 
}

function VerAgregarDocumento(_escritura, sucursales, usuarios, cuentas_contables, caja, comprobantes, documento){

    var el = yo`<div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span></button>
                        <h4 class="modal-title">Documentos de una caja</h4>
                    </div>
                    <div class="modal-body">
                        <div class="panel">
                            <div class="panel-heading">
                                <header>ADMINISTRACION</header>
                            </div>
                            <!-- form start -->
                            <form role="form">
                                <div class="panel-body">
                                    <div class="row">
                                        <div class="col-sm-6">
                                        <div class="form-group">
                                            <label>Comprobante</label>
                                            <select class="form-control" id="Cod_TipoComprobante">
                                                ${comprobantes.map(u => yo`<option value="${u.Cod_TipoComprobante}" ${documento?documento.Cod_TipoComprobante==u.Cod_TipoComprobante?'selected':'':''}>${u.Nom_TipoComprobante}</option>`)}
                                            </select>
                                        </div>                
                                        </div>
                                        <div class="col-sm-6">
                                            <div class="form-group">
                                                <label for="Serie">Serie</label>
                                                <input type="text" class="form-control" id="Serie" placeholder="Serie" value="${documento?documento.Serie:''}">
                                                <div class="form-control-line"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-6"> 
                                            <div class="form-group">
                                                <div class="checkbox-inline checkbox-styled checkbox-primary">
                                                    <label>
                                                    <input type="checkbox" id="Flag_Imprimir" ${documento?documento.Flag_Imprimir?'checked':'':''}><span> Se imprime?</span>
                                                    </label>
                                                </div>
                                                <select class="form-control" id="Impresora">
                                                    ${impresoras.map(u=>yo`<option value="${u}" ${documento? u==documento.Impresora?'selected':'':''}>${u}</option>`)}
                                                </select>
                                            </div>       
                                        </div>
                                       
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <div class="form-group">
                                                <label for="Nom_Archivo">Documento *.rpt</label>
                                                <input type="file" id="Nom_Archivo">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <div class="form-group">
                                                <label for="Nom_ArchivoPublicar">Publicar Web *.rpt</label>
                                                <input type="file" id="Nom_ArchivoPublicar">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-6">  
                                            <div class="form-group">
                                                <label for="Nro_SerieTicketera">Nro. de Serie</label>
                                                <input type="email" class="form-control" id="Nro_SerieTicketera" placeholder="Nro. de Serie" value="${documento?documento.Nro_SerieTicketera:''}">
                                                <div class="form-control-line"></div>
                                                <p class="help-block">Solo en caso de tener un Tiketera</p>
                                            </div>
                                        </div>
                                        <div class="col-sm-6">
                                        <label for="Flag_Activo"></label>
                                            <div class="checkbox-inline checkbox-styled checkbox-primary">
                                                <label>
                                                <input type="checkbox" id="Flag_FacRapida" ${documento?documento.Flag_FacRapida?'checked':'':''}><span> Documento de facturacion rapida</span>
                                                </label>
                                            </div>  
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div class="card-actionbar">
                                <button onclick="${() => GuardarDocumento(_escritura, sucursales, usuarios, cuentas_contables, caja, documento)}" data-dismiss="modal" class="btn btn-primary ink-reaction">Guardar</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Cancelar</button>
                    </div>
                </div>
            </div>`

    var modal_nuevo_editar_documento = document.getElementById('modal-nuevo-editar-documento')
    empty(modal_nuevo_editar_documento).appendChild(el)
}

function GuardarCaja(_escritura,caja) {
    //console.log(document.getElementById('Cod_Usuarios').value.toUpperCase())
    if(ValidacionCampos('divErrors','divAgregarCaja')){
        run_waitMe($('#main-contenido'), 1, "ios","Guardando caja...");
        var Cod_Caja = null
        if (caja != undefined)
            Cod_Caja = caja.Cod_Caja
        else
            Cod_Caja = document.getElementById('Cod_Caja').value.toUpperCase() 
        
        var Des_Caja = document.getElementById('Des_Caja').value.toUpperCase()
        var Cod_Sucursal = document.getElementById('Cod_Sucursal').value.toUpperCase()
        var Cod_UsuarioCajero = document.getElementById('Cod_Usuario').value.toUpperCase()
        var Cod_CuentaContable = document.getElementById('Cod_CuentaContable').value.toUpperCase()
        var Flag_Activo = document.getElementById('Flag_Activo').checked?'1':'0'
        var Cod_Usuario = 'ADMINISTRADOR'

        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Cod_Caja,
                Des_Caja,
                Cod_Sucursal,
                Cod_UsuarioCajero,
                Cod_CuentaContable,
                Flag_Activo,
                Cod_Usuario
            })
        }
        fetch(URL + '/cajas_api/guardar_caja', parametros)
            .then(req => req.json())
            .then(res => {
                if (res.respuesta == 'ok') {
                    ListarCajas(_escritura)

                }
                else {
                    console.log('Error')
                } 
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
    }
}


function EliminarDocumento(_escritura, sucursales, usuarios, cuentas_contables,caja, u){
    var btnEliminar = document.getElementById('btnEliminar-documento')
    btnEliminar.addEventListener('click', function Eliminar(ev) {
        run_waitMe($('#main-contenido'), 1, "ios","Eliminando documento...");
        var Cod_Caja = caja.Cod_Caja
        var Item = u.Item
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Cod_Caja,
                Item,
            })
        }
        fetch(URL+'/cajas_api/eliminar_documento', parametros)
            .then(req => req.json())
            .then(res => {
                
                if (res.respuesta == 'ok') {
                    NuevaCaja(_escritura, sucursales, usuarios, cuentas_contables,caja)
                    this.removeEventListener('click', Eliminar)
                }
                else{
                    this.removeEventListener('click', Eliminar)
                } 
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
    })
}

function GuardarDocumento(_escritura, sucursales, usuarios, cuentas_contables, caja, documento){
    var Cod_Caja = caja.Cod_Caja
    var Item = documento?documento.Item:0
    var Cod_TipoComprobante = document.getElementById('Cod_TipoComprobante').value
    var Serie = document.getElementById('Serie').value
    var Impresora = document.getElementById('Impresora').value
    var Flag_Imprimir = document.getElementById('Flag_Imprimir').checked?'1':'0'
    var Flag_FacRapida = document.getElementById('Flag_FacRapida').checked?'1':'0'
    var Nom_Archivo = document.getElementById('Nom_Archivo').files[0]!=undefined? document.getElementById('Nom_Archivo').files[0].name: ''
    var Nro_SerieTicketera = document.getElementById('Nro_SerieTicketera').value
    var Nom_ArchivoPublicar = document.getElementById('Nom_ArchivoPublicar').files[0]!=undefined? document.getElementById('Nom_ArchivoPublicar').files[0].name:''
    var Limite = 0
    var Cod_Usuario = "ADMINISTRADOR"


    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Cod_Caja,
            Item,
            Cod_TipoComprobante,
            Serie,
            Impresora,
            Flag_Imprimir,
            Flag_FacRapida,
            Nom_Archivo,
            Nro_SerieTicketera,
            Nom_ArchivoPublicar,
            Limite,
            Cod_Usuario
        })
    }
    fetch(URL+'/cajas_api/guardar_documento', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                NuevaCaja(_escritura, sucursales, usuarios, cuentas_contables,caja)
            }
            else{
                console.log('Error')
            }
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
        });
}

function AgregarDocumento(_escritura, sucursales, usuarios, cuentas_contables, caja, documento){
    run_waitMe($('#main-contenido'), 1, "ios");
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
    }
    fetch(URL+'/cajas_api/get_comprobantes', parametros)
    .then(req => req.json())
    .then(res => {
        if (res.respuesta == 'ok') {
            var comprobantes = res.data.comprobantes
            
            if(documento == undefined) 
                VerAgregarDocumento(_escritura, sucursales, usuarios, cuentas_contables,caja, comprobantes)
            else
                VerAgregarDocumento(_escritura, sucursales, usuarios, cuentas_contables,caja, comprobantes, documento)

        }else{
            console.log("ERR")
        } 
        $('#main-contenido').waitMe('hide');
    }).catch(function (e) {
        console.log(e);
        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
        $('#main-contenido').waitMe('hide');
    });
}

function BusquedaDeUsuario(){
    var txtBuscarUsuario = document.getElementById("txtBuscarUsuario").value
    if(txtBuscarUsuario.length >= 3){
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                TamanoPagina: '20',
                NumeroPagina: '0',
                ScripOrden: ' ORDER BY Cod_Usuarios asc',
                ScripWhere: txtBuscarUsuario
            })
        }
        fetch(URL+'/cajas_api/buscar_usuarios', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var usuarios = res.data.usuarios
                if(usuarios.length > 0)
                    AgregarTabla(usuarios)
                else  
                    empty(document.getElementById('contenedorTablaUsuarios'));
            }
            else
                empty(document.getElementById('contenedorTablaUsuarios'));
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
        });
    }else{
        empty(document.getElementById('contenedorTablaUsuarios'));
    }
}

function AgregarTabla(usuarios){
    var el = yo`<table id="example1" class="table table-bordered table-striped">
    <thead>
        <tr>
            <th>Codigo</th>
            <th>Nombre</th>
            <th>Accion</th>
        </tr>
    </thead>
    <tbody>
        ${usuarios.map(u => yo`
        <tr>
            <td>${u.Cod_Usuarios}</td>
            <td>${u.Nick}</td>
            <td><button class="btn btn-xs btn-primary" data-dismiss="modal" onclick="${()=>SeleccionarUsuario(u)}"><i class="fa fa-check"></i> Elegir</button></td>
        </tr>`)}
    </tbody>

</table>`
    empty(document.getElementById('contenedorTablaUsuarios')).appendChild(el);
}

function SeleccionarUsuario(usuario){
    var Cod_Usuario = document.getElementById('Cod_Usuario')
    Cod_Usuario.value = usuario.Cod_Usuarios + " - " + usuario.Nick
}

function AgregarFavorito(_escritura, sucursales, usuarios, cuentas_contables,caja){
    run_waitMe($('#main-contenido'), 1, "ios");
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
    }
    fetch(URL+'/cajas_api/opciones_buscar_producto', parametros)
    .then(req => req.json())
    .then(res => {
        if (res.respuesta == 'ok') {
            var categorias = res.data.categorias
            var tipoprecio = res.data.tipoprecio
            VerAgregarFavorito(_escritura, sucursales, usuarios, cuentas_contables,caja, categorias, tipoprecio)

        }else{
            console.log("ERR")
        } 
        $('#main-contenido').waitMe('hide');
    }).catch(function (e) {
        console.log(e);
        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
        $('#main-contenido').waitMe('hide');
    });
}

function  VerAgregarFavorito(_escritura, sucursales, usuarios, cuentas_contables,caja, categorias, tipoprecio){
    var el = yo`<div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span></button>
                        <h4 class="modal-title">Buscar producto</h4>
                    </div>
                    <div class="modal-body">
                        <div class="panel">
                            <div class="panel-heading">
                                <h3>Productos</h3>
                            </div>
                            <!-- form start -->
                            <div role="form">
                                <div class="panel-body">
                                    <div class="row">
                                        <div class="col-sm-6">
                                        <div class="form-group">
                                            <label>Categoria</label>
                                            <select class="form-control" id="Cod_Categoria">
                                                ${categorias.map(u => yo`<option value="${u.Cod_Categoria}">${u.Des_Categoria}</option>`)}
                                            </select>
                                        </div>                
                                        </div>
                                        <div class="col-sm-6">
                                            <div class="form-group">
                                                <label for="Serie">Tipo de Precio</label>
                                                <select class="form-control" id="Cod_Precio">
                                                ${tipoprecio.map(u => yo`<option value="${u.Cod_Precio}">${u.Nom_Precio}</option>`)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <div class="form-group">
                                                <label for="textobuscar">Texto a buscar</label>
                                                <input type="text" class="form-control" id="Buscar" placeholder="Helado">
                                                <div class="form-control-line"></div>
                                            </div>
                                        </div>
                                        <div class="col-sm-6"> 
                                            <label for="Flag_Activo"></label>
                                            <div class="checkbox-inline checkbox-styled checkbox-primary"> 
                                                <label>
                                                <input type="checkbox" id="Flag_RequiereStock" ><span> Solo productos con stock?</span>
                                                </label>
                                            </div>       
                                        </div>
                                       
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <button onclick="${() => BuscarProductos(_escritura, caja)}"class="btn btn-primary">Buscar</button>
                                        </div>
                                    </div>
                                    <br>
                                    <div class="table-responsive" id="contenedorTablaProductos">
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Cancelar</button>
                    </div>
                </div>
            </div>`

    var modal_nuevo_editar_documento = document.getElementById('modal-nuevo-favorito')
    empty(modal_nuevo_editar_documento).appendChild(el)
}

function BuscarProductos(_escritura, caja){
    var Cod_Caja = caja.Cod_Caja
    var Buscar = document.getElementById('Buscar').value
    var Cod_Categoria = document.getElementById('Cod_Categoria').value
    var Cod_Precio = document.getElementById('Cod_Precio').value
    var Flag_RequiereStock = document.getElementById('Flag_RequiereStock').checked?'1':'0'
    run_waitMe($('#main-contenido'), 1, "ios");
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            Cod_Caja,
            Buscar,
            Cod_Categoria,
            Cod_Precio,
            Flag_RequiereStock
        })
    }
    fetch(URL+'/cajas_api/buscar_producto', parametros)
        .then(req => req.json())
        .then(res => {
            var productos = res.data.productos
            console.log(productos)
            if (res.respuesta == 'ok') {
                AgregarTablaProductos(_escritura, caja, productos)
            }
            else {
                console.log('Error')
            } 
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
}

function AgregarTablaProductos(_escritura, caja, productos){
    var el = yo`<table id="example1" class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>Accion</th>
                            <th>Codigo</th>
                            <th>Almacen</th>
                            <th>Producto</th>
                            <th>Stock</th>
                            <th>Moneda</th>
                            <th>PU</th>
                            <th>UM</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productos.map(u => yo`<tr>
                                                    <td><button class="btn btn-xs btn-primary" data-dismiss="modal" onclick="${()=>GuardarFavorito(_escritura, caja, u)}"><i class="fa fa-check"></i> Agregar</button></td>
                                                    <td>${u.Cod_Producto}</td>
                                                    <td>${u.Des_Almacen}</td>
                                                    <td>${u.Nom_Producto}</td>
                                                    <td>${u.Stock_Act}</td>
                                                    <td>${u.Nom_Moneda}</td>
                                                    <td>${u.Precio}</td>
                                                    <td>${u.Nom_UnidadMedida}</td>
                                                    
                                                </tr>`)}
                    </tbody>

                </table>`
    
    empty(document.getElementById('contenedorTablaProductos')).appendChild(el);
    
}

function GuardarFavorito(_escritura, caja, producto){
    var Cod_Caja = caja.Cod_Caja
    var Id_Producto = producto.Id_Producto
    var Cod_Almacen = producto.Cod_Almacen
    var Cod_UnidadMedida = producto.Cod_UnidadMedida          
    var Cod_Precio = document.getElementById('Cod_Precio').value
    run_waitMe($('#main-contenido'), 1, "ios","Guardando favorito...");
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            Cod_Caja,
            Id_Producto,
            Cod_Almacen,
            Cod_UnidadMedida,
            Cod_Precio
        })
    }
    fetch(URL+'/cajas_api/guardar_favorito', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var productos = res.data.productos
                var el = yo`<table class="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Almacen</th>
                                        <th>Unidad Medida</th>
                                        <th>Precio</th>
                                        <th>Stock</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${productos.map(u => yo`
                                    <tr>
                                        <td>${u.Nom_Producto}</td>
                                        <td>${u.Des_Almacen}</td>
                                        <td>${u.Nom_UnidadMedida}</td>
                                        <td>${u.Valor}</td>
                                        <td>${u.Stock_Act}</td>
                                        <td>
                                            ${_escritura ? yo`<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger-favorito" onclick="${()=>EliminarFavorito(_escritura, caja, u)}"><i class="fa fa-trash"></i></button>` : yo``}
                                            
                                        </td>
                                    </tr>`)}
                                </tbody>
                            </table>`
                empty(document.getElementById('contenedorTablaFavoritos')).appendChild(el)
            }
            else {
                console.log('Error')
            } 
             $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
    
}

function EliminarFavorito(_escritura, caja, producto){
    var btnEliminar = document.getElementById('btnEliminar-favorito')
    btnEliminar.addEventListener('click', function Eliminar(ev) {
        var Cod_Caja = caja.Cod_Caja
    var Id_Producto = producto.Id_Producto
    run_waitMe($('#main-contenido'), 1, "ios","Eliminando favorito...");
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            Cod_Caja,
            Id_Producto
        })
    }
    fetch(URL+'/cajas_api/eliminar_favorito', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var productos = res.data.productos
                var el = yo`<table class="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Almacen</th>
                                        <th>Unidad Medida</th>
                                        <th>Precio</th>
                                        <th>Stock</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${productos.map(u => yo`
                                    <tr>
                                        <td>${u.Nom_Producto}</td>
                                        <td>${u.Des_Almacen}</td>
                                        <td>${u.Nom_UnidadMedida}</td>
                                        <td>${u.Valor}</td>
                                        <td>${u.Stock_Act}</td>
                                        <td>
                                            ${_escritura ? yo`<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger-favorito" onclick="${()=>EliminarFavorito(_escritura, caja, u)}"><i class="fa fa-trash"></i></button>` : yo``}
                                            
                                        </td>
                                    </tr>`)}
                                </tbody>
                            </table>`
                empty(document.getElementById('contenedorTablaFavoritos')).appendChild(el)
            }
            else {
                console.log('Error')
            } 
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
    })
    
}



function NuevaCaja(_escritura, sucursales, usuarios, cuentas_contables, caja) {
    if (caja != undefined) {
        run_waitMe($('#main-contenido'), 1, "ios");
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Cod_Caja:caja.Cod_Caja })
        }
        fetch(URL+'/cajas_api/get_documents_by_caja', parametros)
            .then(req => req.json())
            .then(res => {
                if (res.respuesta == 'ok') {
                    Ver(_escritura, sucursales, usuarios, cuentas_contables, caja, res.data.documentos, res.data.productos)
                }
                else {
                    console.log('Error')
                }
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
    } else Ver(_escritura, sucursales, usuarios, cuentas_contables, caja, [], [])
}
export { NuevaCaja }