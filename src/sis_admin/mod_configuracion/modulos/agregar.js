var empty = require('empty-element');
var yo = require('yo-yo');

import { ListarModulos } from './listar';
import { URL } from '../../../constantes_entorno/constantes'


module.exports = function NuevoModulo(_escritura, raices, modulo) {

    var tab = yo`
    <li class=""><a href="#tab_crear_modulo_2" data-toggle="tab" aria-expanded="false" id="id_tab_crear_modulo_2">Nuevo Modulo<a style="padding-left: 10px;" class="btn" onclick=${()=>CerrarTab()}><i class="fa fa-close text-danger"></i></a></a></li>`


    var el = yo`
    <div class="tab-pane" id="tab_crear_modulo_2">
        
        <section class="content">
            <div class="card">
                <div class="card-head">
                    <header>

                        <a onclick=${() => ListarModulos(_escritura)}
                        class="btn btn-xs btn-icon-toggle">
                            <i class="fa fa-arrow-left"></i></a>
                        ${modulo ? 'Editar' : 'Nuevo'} Modulo
                    </header>
                
                </div> 
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
                        <div class="card-actionbar">
                                <button onclick="${() => Guardar(_escritura, modulo)}" class="btn btn-primary">Guardar</button>
                            </div>
                    </div>
                </div>
            </div>
        </section>
    </div>`
    //var main = document.getElementById('main-contenido');
    //empty(main).appendChild(el);
    if($("#tab_crear_modulo_2").length){  

        $('#tab_crear_modulo_2').remove()
        $('#id_tab_crear_modulo_2').parents('li').remove()

        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    }else{
        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    } 
    $("#id_tab_crear_modulo_2").click()
}


function CerrarTab(){
    $('#tab_crear_modulo_2').remove()
    $('#id_tab_crear_modulo_2').parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show'); 
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