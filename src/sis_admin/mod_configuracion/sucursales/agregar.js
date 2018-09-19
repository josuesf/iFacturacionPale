var empty = require('empty-element');
var yo = require('yo-yo');

import { ListarSucursales } from './listar';
import { URL } from '../../../constantes_entorno/constantes'


module.exports = function NuevaSucursal(_escritura, sucursal) {

    var tab = yo`
    <li class=""><a href="#tab_crear_sucursal_2" data-toggle="tab" aria-expanded="false" id="id_tab_crear_sucursal_2">Nueva Sucursal<a style="padding-left: 10px;" class="btn" onclick=${()=>CerrarTab()}><i class="fa fa-close text-danger"></i></a></a></li>`

    var el = yo`
    <div class="tab-pane" id="tab_crear_sucursal_2">
        <div class="modal fade" id="modal-buscar-responsable" style="display: none;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                        <h4 class="modal-title"> Búsqueda de usuario</h4>
                    </div>
                    <div class="modal-body">
                        <div class="panel">
                            
                            <form role="form">
                                <div class="panel-body">
        
                                    <label for="Cod_UsuarioCajero">Ingrese codigo o nombre de usuario</label>
                                    <div class="input-group">
                                        <div class="input-group-btn">
                                            <button type="button" class="btn btn-primary" onclick="${() => BusquedaDeUsuario()}">Buscar</button>
                                        </div>
                                        <input type="text" class="form-control" id="txtBuscarUsuario" onkeypress="${() => BusquedaDeUsuario()}">
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
       
        <section class="content">
            <div class="card">
                <div class="card-head">
                    <header>
                        <a onclick=${() => ListarSucursales(_escritura)}
                        class="btn btn-xs btn-icon-toggle">
                            <i class="fa fa-arrow-left"></i></a>
                             ${sucursal ? 'Editar' : 'Nueva'} Sucursal
                    </header>
                   
                </div> 
                <div class="card-body">
                    <div class="panel">
                        
                        <!-- form start -->
                        <form role="form">
                            <div class="panel-body">
                                <div class="row">
                                    <div class="alert alert-callout alert-danger hidden" id="divErrors">
                                        <p>Es necesario llenar todos los campos requeridos marcados con rojo</p>
                                    </div>
                                </div>
                                <div class="row">
                                    ${sucursal ? yo`` : yo`<div class="col-sm-6">
                                    <div class="form-group">
                                        <label for="Cod_Sucursal">Codigo de Sucursal *</label>
                                        <input type="text" style="text-transform:uppercase" class="form-control required" id="Cod_Sucursal" placeholder="Codigo sucursal">
                                    </div>
                                </div>`}
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Flag_Activo"></label>
                                            <div class="checkbox-inline checkbox-styled checkbox-primary">
                                                <label>
                                                    <input type="checkbox" id="Flag_Activo" class="required" checked="${sucursal ? sucursal.Flag_Activo : 0}"><span> Es Activo?</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Nom_Sucursal">Nombre de la Sucursal *</label>
                                            <input type="text" style="text-transform:uppercase" class="form-control required" id="Nom_Sucursal" placeholder="Nombre de la sucursal" value="${sucursal ? sucursal.Nom_Sucursal : ''}">
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Dir_Sucursal">Direccion fiscal de sucursal *</label>
                                            <input type="text" style="text-transform:uppercase" class="form-control required" id="Dir_Sucursal" placeholder="Ejem: Calle..." value="${sucursal ? sucursal.Dir_Sucursal : ''}">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Por_UtilidadMax">% Utilidad Maxima</label>
                                            <input type="number" class="form-control required" id="Por_UtilidadMax" placeholder="0,5,10,20" value="${sucursal ? sucursal.Por_UtilidadMax : ''}">
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Por_UtilidadMin">% Utilidad Minima </label>
                                            <input type="number" class="form-control required" id="Por_UtilidadMin" placeholder="Ejem: 0,5,10,20" value="${sucursal ? sucursal.Por_UtilidadMin : ''}">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Cabecera_Pagina">Cabecera de Documento</label>
                                            <textarea type="number" class="form-control" id="Cabecera_Pagina" placeholder="Ejem: www.miempresa.com">${sucursal ? sucursal.Cabecera_Pagina : ''}</textarea>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Pie_Pagina">Pie de Documento </label>
                                            <textarea type="number" class="form-control" id="Pie_Pagina" placeholder="Ejem: Gracias por su compra">${sucursal ? sucursal.Pie_Pagina : ''}</textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <label for="Cod_UsuarioAdm">Administrador de la empresa</label>
                                        <div class="input-group">
                                            <div class="input-group-btn">
                                                <button type="button" class="btn btn-info" data-toggle="modal" data-target="#modal-buscar-responsable">Buscar Administrador</button>
                                            </div>
                                            <input type="text" class="form-control required" id="Cod_UsuarioAdm" disabled>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- /.box-body -->
                
                            
                        </form>
                        <div class="card-actionbar">
                                <button onclick="${() => Guardar(_escritura, sucursal)}" class="btn btn-primary">Guardar</button>
                            </div>
                    </div>
                </div>
            </div>
        </section>
    </div>`
    //var main = document.getElementById('main-contenido');
    //empty(main).appendChild(el);
    if($("#tab_crear_sucursal_2").length){  

        $('#tab_crear_sucursal_2').remove()
        $('#id_tab_crear_sucursal_2').parents('li').remove()

        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    }else{
        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    } 
    $("#id_tab_crear_sucursal_2").click()
} 

function CerrarTab(){
    $('#tab_crear_sucursal_2').remove()
    $('#id_tab_crear_sucursal_2').parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show'); 
}
 
function BusquedaDeUsuario() {
    var txtBuscarUsuario = document.getElementById("txtBuscarUsuario").value
    if (txtBuscarUsuario.length >= 4) {
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
        fetch(URL + '/cajas_api/buscar_usuarios', parametros)
            .then(req => req.json())
            .then(res => {
                if (res.respuesta == 'ok') {
                    var usuarios = res.data.usuarios
                    if (usuarios.length > 0)
                        AgregarTabla(usuarios)
                    else
                        empty(document.getElementById('contenedorTablaUsuarios'));
                }
                else
                    empty(document.getElementById('contenedorTablaUsuarios'));
                $('#main-contenido').waitMe('hide');
            })
    } else {
        empty(document.getElementById('contenedorTablaUsuarios'));
    }
}
function AgregarTabla(usuarios) {
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
            <td><button class="btn btn-xs btn-primary" data-dismiss="modal" onclick="${() => SeleccionarUsuario(u)}"><i class="fa fa-check"></i> Elegir</button></td>
        </tr>`)}
    </tbody>

</table>`
    empty(document.getElementById('contenedorTablaUsuarios')).appendChild(el);
}
function SeleccionarUsuario(usuario) {
    var Cod_Usuario = document.getElementById('Cod_UsuarioAdm')
    Cod_Usuario.value = usuario.Cod_Usuarios + " - " + usuario.Nick
}


function Guardar(_escritura, sucursal) {
    //console.log(document.getElementById('Cod_Usuarios').value.toUpperCase())
    if(ValidacionCampos('divError','tab_2')){
        run_waitMe($('#main-contenido'), 1, "ios","Guardando sucursal...");
        var Cod_Sucursal = sucursal ? sucursal.Cod_Sucursal : document.getElementById('Cod_Sucursal').value.toUpperCase()
        var Nom_Sucursal = document.getElementById('Nom_Sucursal').value.toUpperCase()
        var Dir_Sucursal = document.getElementById('Dir_Sucursal').value.toUpperCase()
        var Por_UtilidadMax = document.getElementById('Por_UtilidadMax').value
        var Por_UtilidadMin = document.getElementById('Por_UtilidadMin').value
        var Cod_UsuarioAdm = document.getElementById('Cod_UsuarioAdm').value.split(' - ')[0]
        var Cabecera_Pagina = document.getElementById('Cabecera_Pagina').value
        var Pie_Pagina = document.getElementById('Pie_Pagina').value
        var Flag_Activo = document.getElementById('Flag_Activo').checked
        var Cod_Ubigeo = null
        var Cod_Usuario = 'ADMINISTRADOR'

        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                Cod_Sucursal,
                Nom_Sucursal,
                Dir_Sucursal,
                Por_UtilidadMax,
                Por_UtilidadMin,
                Cod_UsuarioAdm,
                Cabecera_Pagina,
                Pie_Pagina,
                Flag_Activo,
                Cod_Ubigeo,
                Cod_Usuario
            })
        }
        fetch(URL + '/sucursales_api/guardar_sucursal', parametros)
            .then(req => req.json())
            .then(res => {
                if (res.respuesta == 'ok') {
                    ListarSucursales(_escritura)
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