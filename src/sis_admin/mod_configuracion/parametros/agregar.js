var empty = require('empty-element');
var yo = require('yo-yo');

import {ListarParametros} from './listar';
import {URL} from '../../../constantes_entorno/constantes'


module.exports = function NuevoPerfil(_escritura,modulos, perfil) {

    var tab = yo`
    <li class=""><a href="#tab_crear_parametros_2" data-toggle="tab" aria-expanded="false" id="id_tab_crear_paramtros_2">Nuevo Parametro<a style="padding-left: 10px;" class="btn" onclick=${()=>CerrarTab()}><i class="fa fa-close text-danger"></i></a></a></li>`


    var el = yo`
    <div class="tab-pane" id="tab_crear_parametros_2">
        
        <section class="content">
            <div class="card">
                <div class="card-head">
                    <header>
                        <a onclick=${()=>ListarParametros(_escritura)}
                        class="btn btn-xs btn-icon-toggle"><i class="fa fa-arrow-left"></i></a>
                        ${perfil?'Editar':'Nuevo'} Perfil
                    </header>
                </div>
                
                <div class="card-body">
                    <div class="panel">
                        
                        <!-- form start -->
                        <form role="form">
                            <div class="panel-body">
                                
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
    if($("#tab_crear_parametros_2").length){  

        $('#tab_crear_parametros_2').remove()
        $('#id_tab_crear_paramtros_2').parents('li').remove()

        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    }else{
        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    } 
    $("#id_tab_crear_paramtros_2").click()
}

function CerrarTab(){
    $('#tab_crear_parametros_2').remove()
    $('#id_tab_crear_paramtros_2').parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show'); 
}


function BusquedaDeUsuario(){
    var txtBuscarUsuario = document.getElementById("txtBuscarUsuario").value
    if(txtBuscarUsuario.length >= 4){
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
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            $('#main-contenido').waitMe('hide');
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
    var Cod_Usuario = document.getElementById('Cod_UsuarioAdm')
    Cod_Usuario.value = usuario.Cod_Usuarios + " - " + usuario.Nick
}


function Guardar(_escritura, sucursal){
    //console.log(document.getElementById('Cod_Usuarios').value.toUpperCase())
    run_waitMe($('#main-contenido'), 1, "ios","Guardando parametro");
    var Cod_Sucursal = sucursal?sucursal.Cod_Sucursal:document.getElementById('Cod_Sucursal').value.toUpperCase()
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
    fetch(URL+'/sucursales_api/guardar_sucursal', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                ListarPerfiles(_escritura)
            }
            else{
                console.log('Error')
            }
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
}