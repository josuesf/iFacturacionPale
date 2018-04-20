var empty = require('empty-element');
var yo = require('yo-yo');

import {ListarUsuarios} from './listar';
import {URL} from '../../../constantes_entorno/constantes'
var preguntas_seguridad = [
    '¿Cómo se llamaba tu mejor amigo de la infancia?',
    '¿Cómo se llamaba tu primer profesor o tu primera profesora?',
    '¿Cómo se llamaba tu primer jefe?',
    '¿Cuál fue tu primer número de teléfono?',
    '¿Cuál es el número de matrícula de tu vehículo?',
    '¿Cuál es el número de tu carné de la biblioteca?'
]


module.exports = function NuevoUsuario(_escritura, _estados, _perfiles, usuario) {

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
                <li><a  onclick=${()=>ListarUsuarios(_escritura)} href="#">
                Usuarios</a></li>
                <li class="active">${usuario?'Editar':'Nuevo'}</li>
            </ol>
        </section>
        <section class="content">
            <div class="box">
                <div class="box-header">
                    <a onclick=${()=>ListarUsuarios(_escritura)}
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
                                    ${usuario? yo``:yo`<div class="col-sm-6">
                                    <div class="form-group">
                                        <label for="exampleInputEmail1">Codigo Usuario</label>
                                        <input type="text" style="text-transform:uppercase" class="form-control" id="Cod_Usuarios" placeholder="Ingrese codigo usuario" >
                                    </div>
                                </div>`}
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Nombres y Apellidos</label>
                                            <input type="text" style="text-transform:uppercase" class="form-control" id="Nick" placeholder="Ingrese Nombres" value="${usuario?usuario.Nick:''}">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Elegir Contrasena</label>
                                            <input type="password" class="form-control" id="Contrasena" placeholder="Ingrese Contrasena">
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Repetir Contrasena</label>
                                            <input type="password" class="form-control" id="Contrasena2" placeholder="Repita Contrasena">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Pregunta de Seguridad</label>
                                            <select id="Pregunta" class="form-control">
                                                ${preguntas_seguridad.map(e=>yo`<option style="text-transform:uppercase" value="${e}" ${usuario?usuario.Pregunta == e?'selected':'':''}>${e}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Respuesta</label>
                                            <input type="text" style="text-transform:uppercase" class="form-control" id="Respuesta" placeholder="Respuesta" value="${usuario?usuario.Respuesta:''}">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Estado</label>
                                            <select id="Cod_Estado" class="form-control">
                                                ${_estados.map(e=>yo`<option style="text-transform:uppercase" value="${e.Cod_Estado}" ${usuario?usuario.Cod_Estado == e.Cod_Estado?'selected':'':''}>${e.Nom_Estado}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Perfil</label>
                                            <select id="Cod_Perfil" class="form-control">
                                                ${_perfiles.map(e=>yo`
                                                <option style="text-transform:uppercase" value="${e.Cod_Perfil}" ${usuario? usuario.Cod_Perfil == e.Cod_Perfil?'selected':'':''}>${e.Des_Perfil}</option>`)}
                                            </select>
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
                                <button onclick="${() => Guardar(_escritura, usuario)}" class="btn btn-primary">Guardar</button>
                            </div>
                    </div>
                </div>
            </div>
        </section>
    </div>`
    var main = document.getElementById('main-contenido');
    empty(main).appendChild(el);
}

function Guardar(_escritura, usuario){
    //console.log(document.getElementById('Cod_Usuarios').value.toUpperCase())
    H5_loading.show();
    var Cod_Usuarios = usuario?usuario.Cod_Usuarios:document.getElementById('Cod_Usuarios').value.toUpperCase()
    var Nick = document.getElementById('Nick').value.toUpperCase()
    var Contrasena = document.getElementById('Contrasena').value
    var Pregunta = document.getElementById('Pregunta').value.toUpperCase()
    var Respuesta = document.getElementById('Respuesta').value.toUpperCase()
    var Cod_Estado = document.getElementById('Cod_Estado').value.toUpperCase()
    var Cod_Perfil = document.getElementById('Cod_Perfil').value.toUpperCase()
    var Imagen = document.getElementById('Imagen').value
    var Cod_Usuario = 'ADMINISTRADOR'

    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Cod_Usuarios,
            Nick,
            Contrasena,
            Pregunta,
            Respuesta,
            Cod_Estado,
            Cod_Perfil,
            Cod_Usuario
        })
    }
    fetch(URL+'/usuarios_api/guardar_usuario', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                ListarUsuarios(_escritura)
                
            }
            else{
                console.log('Error')
            }
            H5_loading.hide()
        })
}