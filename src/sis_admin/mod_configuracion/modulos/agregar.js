var empty = require('empty-element');
var yo = require('yo-yo');

import { ListarModulos } from './listar';
import { URL } from '../../../constantes_entorno/constantes'


module.exports = function NuevoModulo(_escritura, raices, modulo) {

    var el = yo`
    <div>
        <section class="content-header">
            <h1>
                Modulos
                <small>Control usuarios</small>
            </h1>
            <ol class="breadcrumb">
                <li>
                    <a href="#">
                        <i class="fa fa-cog"></i> Configuracion</a>
                </li>
                <li><a  onclick=${() => ListarModulos(_escritura)} href="#">
                Modulos</a></li>
                <li class="active">${modulo ? 'Editar' : 'Nuevo'}</li>
            </ol>
        </section>
        <section class="content">
            <div class="box">
                <div class="box-header">
                    <a onclick=${() => ListarModulos(_escritura)}
                    class="btn btn-xs btn-warning">
                        <i class="fa fa-arrow-left"></i> Atras</a>
                    
                    
                </div>
                <!-- /.box-header -->
                <div class="box-body">
                    <div class="box box-primary">
                        <div class="box-header with-border">
                            <h3 class="box-title">${modulo ? 'Editar' : 'Nuevo'} Modulo</h3>
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
                                    ${modulo ? yo`` : yo`<div class="col-sm-6">
                                    <div class="form-group">
                                        <label for="Cod_Modulo">Codigo de Modulo *</label>
                                        <input type="text" style="text-transform:uppercase" class="form-control required" id="Cod_Modulo" placeholder="Ejem: 01.01.001" >
                                    </div>
                                </div>`}
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Des_Modulo">Descripcion del modulo *</label>
                                            <input type="text" style="text-transform:uppercase" class="form-control required" id="Des_Modulo" placeholder="Ejem: Modulo de Personal" value="${modulo ? modulo.Des_Modulo : ''}">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Padre_Modulo">Modulo Padre</label>
                                            <select id="Padre_Modulo" class="form-control"><option value=null ></option>

                                                ${raices.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_Modulo}" ${modulo ? modulo.Padre_Modulo == e.Cod_Modulo ? 'selected' : '' : ''}>${e.Cod_Modulo + ' ' + e.Des_Modulo}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- /.box-body -->
                
                            
                        </form>
                        <div class="box-footer">
                                <button onclick="${() => Guardar(_escritura, modulo)}" class="btn btn-primary">Guardar</button>
                            </div>
                    </div>
                </div>
            </div>
        </section>
    </div>`
    var main = document.getElementById('main-contenido');
    empty(main).appendChild(el);
}

function Guardar(_escritura, modulo) {
    if (ValidacionCampos()) {
        run_waitMe($('#main-contenido'), 1, "ios","Guardando modulos...");
        var Cod_Modulo = modulo ? modulo.Cod_Modulo : document.getElementById('Cod_Modulo').value.toUpperCase()
        var Des_Modulo = document.getElementById('Des_Modulo').value.toUpperCase()
        var Padre_Modulo = document.getElementById('Padre_Modulo').value
        var Cod_Usuario = 'ADMINISTRADOR'

        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                Cod_Modulo,
                Des_Modulo,
                Padre_Modulo,
                Cod_Usuario
            })
        }
        fetch(URL + '/modulos_api/guardar_modulo', parametros)
            .then(req => req.json())
            .then(res => {
                if (res.respuesta == 'ok') {
                    ListarModulos(_escritura)

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