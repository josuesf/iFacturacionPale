var empty = require('empty-element');
var yo = require('yo-yo');

import { ListarUsuarios } from './listar';
import { URL } from '../../../constantes_entorno/constantes'
var preguntas_seguridad = [
    '¿Cómo se llamaba tu mejor amigo de la infancia?',
    '¿Cómo se llamaba tu primer profesor o tu primera profesora?',
    '¿Cómo se llamaba tu primer jefe?',
    '¿Cuál fue tu primer número de teléfono?',
    '¿Cuál es el número de matrícula de tu vehículo?',
    '¿Cuál es el número de tu carné de la biblioteca?'
]


function Ver(_escritura, _estados, _perfiles, cajas, usuario) {

    var tab = yo`
    <li class=""><a href="#tab_crear_usuario_2" data-toggle="tab" aria-expanded="false" id="id_tab_crear_sucursal_2">Nuevo Usuario<a style="padding-left: 10px;" class="btn" onclick=${()=>CerrarTab()}><i class="fa fa-close text-danger"></i></a></a></li>`


    var el = yo`
    <div class="tab-pane" id="tab_crear_usuario_2">
        
        <section class="content">
            <div class="card">
                <div class="card-head">
                    <header><a onclick=${() => ListarUsuarios(_escritura)} class="btn btn-xs btn-icon-toggle"><i class="fa fa-arrow-left"></i></a> ${usuario ? 'Editar' : 'Nuevo'} Usuario
                   </header> 
                    
                </div>
                <!-- /.box-header -->
                <div class="card-body">
                    <div class="panel">
                       
                        <form role="form">
                            <div class="panel-body">
                                <div class="row">
                                    <div class="alert alert-callout alert-danger hidden" id="divErrors">
                                        <p>Es necesario llenar todos los campos requeridos marcados con rojo</p>
                                    </div>
                                </div>
                                <div class="row">
                                    ${usuario ? yo`` : yo`<div class="col-sm-6">
                                    <div class="form-group" id="frm_Cod_Usuarios">
                                        <label for="exampleInputEmail1">Codigo Usuario *</label>
                                        <input type="text" style="text-transform:uppercase" class="form-control required" id="Cod_Usuarios" placeholder="Ingrese codigo usuario" >
                                        <div class="form-control-line"></div>
                                    </div>
                                </div>`}
                                    <div class="col-sm-6">
                                        <div class="form-group" id="frm_Nick">
                                            <label for="exampleInputEmail1">Nombres y Apellidos *</label>
                                            <input type="text" style="text-transform:uppercase" class="form-control required" id="Nick" placeholder="Ingrese Nombres" value="${usuario ? usuario.Nick : ''}">
                                            <div class="form-control-line"></div>
                                        </div>
                                    </div>
                                </div>
                                ${!usuario ? yo`
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <div class="form-group" id="frm_Contrasena">
                                                <label for="exampleInputEmail1">Elegir Contrasena *</label>
                                                <input type="password" class="form-control required" id="Contrasena" placeholder="Ingrese Contrasena">
                                                <div class="form-control-line"></div>
                                            </div>
                                        </div>
                                        <div class="col-sm-6">
                                            <div class="form-group" id="frm_Contrasena2">
                                                <label for="exampleInputEmail1">Repetir Contrasena *</label>
                                                <input type="password" class="form-control required" id="Contrasena2" placeholder="Repita Contrasena">
                                                <div class="form-control-line"></div>
                                            </div>
                                        </div>
                                    </div>`: yo``}
                                
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group" id="frm_Pregunta">
                                            <label for="exampleInputEmail1">Pregunta de Seguridad *</label>
                                            <select id="Pregunta" class="form-control required">
                                                <option value=""></option>
                                                ${preguntas_seguridad.map(e => yo`<option style="text-transform:uppercase" value="${e}" ${usuario ? usuario.Pregunta.toUpperCase() == e.toUpperCase() ? 'selected' : '' : ''}>${e}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group" id="frm_Respuesta">
                                            <label for="exampleInputEmail1">Respuesta *</label>
                                            <input type="text" style="text-transform:uppercase" class="form-control required" id="Respuesta" placeholder="Respuesta" value="${usuario ? usuario.Respuesta : ''}">
                                            <div class="form-control-line"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Estado</label>
                                            <select id="Cod_Estado" class="form-control">
                                                ${_estados.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_Estado}" ${usuario ? usuario.Cod_Estado == e.Cod_Estado ? 'selected' : '' : ''}>${e.Nom_Estado}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Perfil</label>
                                            <select id="Cod_Perfil" class="form-control required">
                                                ${_perfiles.map(e => yo`
                                                <option style="text-transform:uppercase" value="${e.Cod_Perfil}" ${usuario ? usuario.Cod_Perfil == e.Cod_Perfil ? 'selected' : '' : ''}>${e.Des_Perfil}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for=""> Cajas </label>
                                            ${cajas.map(c => yo`
                                            <div class="row">
                                                <div class="checkbox-inline checkbox-styled checkbox-primary">
                                                    <label>
                                                        <input type="checkbox" id="${c.Cod_Caja}" checked="${c.Relacion}" ><span> ${c.Des_Caja}</span>
                                                    </label>
                                                </div>
                                            </div>
                                            `)}
                                        </div>
                                    </div>
                                </div>        
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="exampleInputFile">Fotografia</label>
                                            <input type="file" id="Imagen" value="Elige Imagen">
                                        </div>
                                    </div>
                                
                                </div>
                                
                            </div>
                            <!-- /.box-body -->
                
                            
                        </form>
                        <div class="card-actionbar">
                                <button onclick="${() => Guardar(_escritura, cajas, usuario)}" class="btn btn-primary">Guardar</button>
                            </div>
                    </div>
                </div>
            </div>
        </section>
    </div>`
    //var main = document.getElementById('main-contenido');
    //empty(main).appendChild(el);
    if($("#tab_crear_usuario_2").length){  

        $('#tab_crear_usuario_2').remove()
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
    $('#tab_crear_usuario_2').remove()
    $('#id_tab_crear_sucursal_2').parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show'); 
}

function ValidacionesExtras(usuario){
    if(!usuario){
        if(document.getElementById('Contrasena').value!=document.getElementById('Contrasena2').value){
            $("#divErrors").removeClass("hidden")
            $('#divErrors').html('<p>Las contrasenas deben ser iguales</p>')
            $('#Contrasena').css('border-color','red')
            $('#Contrasena2').css('border-color','red')
            return false
        }else{
            $("#divErrors").addClass("hidden")
            $('#divErrors').html('<p>Es necesario llenar todos los campos requeridos marcados con rojo</p>')
            $('#Contrasena').css('border-color','')
            $('#Contrasena2').css('border-color','')
            return true
        }
    }else
        return true
} 
function Guardar(_escritura, Cajas, usuario) {
    //console.log(document.getElementById('Cod_Usuarios').value.toUpperCase())
    if(ValidacionCampos() && ValidacionesExtras(usuario)){
        run_waitMe($('#main-contenido'), 1, "ios","Guardando usuario...");
        for (var j = 0; j < Cajas.length; j++) {
            Cajas[j].Relacion = document.getElementById(Cajas[j].Cod_Caja).checked
        }
        var Cod_Usuarios = usuario ? usuario.Cod_Usuarios : document.getElementById('Cod_Usuarios').value.toUpperCase()
        var Nick = document.getElementById('Nick').value.toUpperCase()
        var Contrasena = usuario ? usuario.Contrasena : document.getElementById('Contrasena').value
        var Pregunta = document.getElementById('Pregunta').value.toUpperCase()
        var Respuesta = document.getElementById('Respuesta').value.toUpperCase()
        var Cod_Estado = document.getElementById('Cod_Estado').value.toUpperCase()
        var Cod_Perfil = document.getElementById('Cod_Perfil').value.toUpperCase()
        var Imagen = document.getElementById('Imagen').value
        var EsNuevo = usuario?false:true
        var Cod_Usuario = 'ADMINISTRADOR'

        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                Cod_Usuarios,
                Nick,
                Contrasena,
                Pregunta,
                Respuesta,
                Cod_Estado,
                Cod_Perfil,
                Cod_Usuario,
                EsNuevo,
                Cajas
            })
        }
        fetch(URL + '/usuarios_api/guardar_usuario', parametros)
            .then(req => req.json())
            .then(res => {
                if (res.respuesta == 'ok') {
                    ListarUsuarios(_escritura)

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

function NuevoUsuario(_escritura, _estados, _perfiles, usuario) {

    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            Cod_Usuarios: usuario ? usuario.Cod_Usuarios : '',
        })
    }
    fetch(URL + '/usuarios_api/get_cajas_usuario', parametros)
        .then(req => req.json())
        .then(res => {
            var cajas = []
            if (res.respuesta == 'ok') {
                cajas = res.data.cajas
            }
            Ver(_escritura, _estados, _perfiles, cajas, usuario)
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });


}

export { NuevoUsuario }