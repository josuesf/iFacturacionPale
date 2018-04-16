var empty = require('empty-element');
var yo = require('yo-yo');

import {ListarCajas} from './ListarCajas';


module.exports = function NuevoUsuario(_escritura,sucursales, caja) {
    console.log(caja)

    var el = yo`
    <div>
        <section class="content-header">
            <h1>
                Cajas
                <small>Control cajas</small>
            </h1>
            <ol class="breadcrumb">
                <li>
                    <a href="#">
                        <i class="fa fa-cog"></i> Configuracion</a>
                </li>
                <li><a  onclick=${()=>ListarCajas(_escritura)} href="#">
                Cajas</a></li>
                <li class="active">${caja?'Editar':'Nuevo'}</li>
            </ol>
        </section>
        <section class="content">
            <div class="box">
                <div class="box-header">
                    <a onclick=${()=>ListarCajas(_escritura)}
                    class="btn btn-xs btn-warning">
                        <i class="fa fa-arrow-left"></i> Atras</a>
                    
                    
                </div>
                <!-- /.box-header -->
                <div class="box-body">
                    <div class="box box-primary">
                        <div class="box-header with-border">
                            <h3 class="box-title">Nueva Caja</h3>
                        </div>
                        <!-- form start -->
                        <form role="form">
                            <div class="box-body">
                                <div class="row">
                                    ${caja? yo``:yo`<div class="col-sm-6">
                                    <div class="form-group">
                                        <label for="Cod_Caja">Codigo Caja</label>
                                        <input type="text" style="text-transform:uppercase" class="form-control" id="Cod_Caja" placeholder="Ingrese codigo caja" >
                                    </div>
                                </div>`}
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Flag_Activo">Es Activo</label>
                                            <input type="text" class="form-control" id="Flag_Activo" value="${caja?caja.Flag_Activo:'0'}">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Des_Caja">Nombre de la Caja</label>
                                            <input type="text" class="form-control" id="Des_Caja" placeholder="Ingrese Contrasena">
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Cod_Sucursal">Sucursal a la que pertence</label>
                                            <select id="Cod_Sucursal" class="form-control">
                                                ${sucursales.map(e=>yo`<option style="text-transform:uppercase" value="${e}" ${caja?caja.Cod_Sucursal == e?'selected':'':''}>${e}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Cod_UsuarioCajero">Usuario o vendedor responsable</label>
                                            <input type="text" style="text-transform:uppercase" class="form-control" id="Cod_UsuarioCajero" placeholder="Usuario responsable" value="${caja?caja.Cod_UsuarioCajero:''}">
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Cod_CuentaContable">Cuenta Contable</label>
                                            <input type="text" style="text-transform:uppercase" class="form-control" id="Cod_CuentaContable" placeholder="Cuenta Contable" value="${caja?caja.Cod_CuentaContable:''}">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- /.box-body -->
                
                            
                        </form>
                        <div class="box-footer">
                                <button onclick="${() => Guardar(_escritura, caja)}" class="btn btn-primary">Guardar</button>
                            </div>
                    </div>
                </div>
            </div>
        </section>
    </div>`
    var main = document.getElementById('main-contenido');
    empty(main).appendChild(el);
}

function Guardar(_escritura, caja){
    //console.log(document.getElementById('Cod_Usuarios').value.toUpperCase())
    var Cod_Usuarios = caja?caja.Cod_Usuarios:document.getElementById('Cod_Usuarios').value.toUpperCase()
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
    fetch('/usuarios_api/guardar_usuario', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                ListarCajas(_escritura)
                
            }
            else{
                console.log('Error')
            }
        })
}