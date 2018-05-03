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

    var el = yo`
    <div>
        <section class="content-header">
            <h1>
                Usuarios
                <small>Control usuarios</small>
            </h1>
            <ol class="breadcrumb">
                <li>
                    <a href="#">
                        <i class="fa fa-cog"></i> Configuracion</a>
                </li>
                <li><a  onclick=${() => ListarUsuarios(_escritura)} href="#">
                Usuarios</a></li>
                <li class="active">${usuario ? 'Editar' : 'Nuevo'}</li>
            </ol>
        </section>
        <section class="content">
            <div class="box">
                <div class="box-header">
                    <a onclick=${() => ListarUsuarios(_escritura)}
                    class="btn btn-xs btn-warning">
                        <i class="fa fa-arrow-left"></i> Atras</a>
                    
                    
                </div>
                <!-- /.box-header -->
                <div class="box-body">
                    <div class="box box-primary">
                        <div class="box-header with-border">
                            <h3 class="box-title">Nuevo Usuario</h3>
                        </div>
                        <!-- /.box-header -->
                        <!-- form start -->
                        <form role="form">
                            <div class="box-body">
                                <div class="row">
                                    <div class="callout callout-danger hidden" id="divErrors">
                                        <p>Es necesario llenar todos los campos requeridos marcados con rojo</p>
                                    </div>
                                </div>
                                <div class="row">
                                    ${usuario ? yo`` : yo`<div class="col-sm-6">
                                    <div class="form-group" id="frm_Cod_Usuarios">
                                        <label for="exampleInputEmail1">Codigo Usuario *</label>
                                        <input type="text" style="text-transform:uppercase" class="form-control required" id="Cod_Usuarios" placeholder="Ingrese codigo usuario" >
                                    </div>
                                </div>`}
                                    <div class="col-sm-6">
                                        <div class="form-group" id="frm_Nick">
                                            <label for="exampleInputEmail1">Nombres y Apellidos *</label>
                                            <input type="text" style="text-transform:uppercase" class="form-control required" id="Nick" placeholder="Ingrese Nombres" value="${usuario ? usuario.Nick : ''}">
                                        </div>
                                    </div>
                                </div>
                                ${!usuario ? yo`
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <div class="form-group" id="frm_Contrasena">
                                                <label for="exampleInputEmail1">Elegir Contrasena *</label>
                                                <input type="password" class="form-control required" id="Contrasena" placeholder="Ingrese Contrasena">
                                            </div>
                                        </div>
                                        <div class="col-sm-6">
                                            <div class="form-group" id="frm_Contrasena2">
                                                <label for="exampleInputEmail1">Repetir Contrasena *</label>
                                                <input type="password" class="form-control required" id="Contrasena2" placeholder="Repita Contrasena">
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
                                            <label for="">Cajas</label>
                                            ${cajas.map(c => yo`
                                                <div class="checkbox">
                                                    <label>
                                                        <input type="checkbox" id="${c.Cod_Caja}" checked="${c.Relacion}" > ${c.Des_Caja}
                                                    </label>
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
                        <div class="box-footer">
                                <button onclick="${() => Guardar(_escritura, cajas, usuario)}" class="btn btn-primary">Guardar</button>
                            </div>
                    </div>
                </div>
            </div>
        </section>
    </div>`
    var main = document.getElementById('main-contenido');
    empty(main).appendChild(el);
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
<<<<<<< HEAD
    if(ValidacionCampos() && ValidacionesExtras(usuario)){
=======
    if(ValidacionCampos()){
>>>>>>> 5880d14576172d4cc05c4a896742ec887fea3e12
        H5_loading.show();
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
                H5_loading.hide()
            })
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
            H5_loading.hide()
        })


}

export { NuevoUsuario }