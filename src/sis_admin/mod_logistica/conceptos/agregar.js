var empty = require('empty-element');
var yo = require('yo-yo');

import { ListarConceptos } from './listar';
import { URL } from '../../../constantes_entorno/constantes'


function NuevoConcepto(_escritura, tipos_conceptos, concepto) {

    var tab = yo`
    <li class=""><a href="#tab_crear_concepto_2" data-toggle="tab" aria-expanded="false" id="id_tab_crear_concepto_2">Nuevo concepto<a style="padding-left: 10px;" class="btn" onclick=${()=>CerrarTab()}><i class="fa fa-close text-danger"></i></a></a></li>`


    var el = yo`
    <div class="tab-pane" id="tab_crear_concepto_2">
        
        <section class="content">
            <div class="card">
                <div class="card-head">
                    <header>
                    <a onclick=${() => ListarConceptos(_escritura)}
                    class="btn btn-xs btn-icon-toggle">
                        <i class="fa fa-arrow-left"></i></a>
                        ${concepto ? 'Editar' : 'Nuevo'} Concepto
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
                                    ${concepto ? yo`` : yo`
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Id_Concepto">Codigo de Concepto *</label>
                                            <input type="text" style="text-transform:uppercase" class="form-control required" id="Id_Concepto" placeholder="">
                                        </div>
                                    </div>`}
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Des_Concepto">Concepto *</label>
                                            <input type="text" style="text-transform:uppercase" class="form-control required" id="Des_Concepto" placeholder="Descripcion concepto"
                                                value="${concepto ? concepto.Des_Concepto : ''}">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Cod_ClaseConcepto">Clase o Tipo *</label>
                                            <select id="Cod_ClaseConcepto" class="form-control required">
                                                <option value=''></option>
                        
                                                ${tipos_conceptos.map(e => yo`
                                                <option style="text-transform:uppercase" value="${e.Cod_TipoConcepto}"
                                                    ${concepto ? concepto.Cod_ClaseConcepto == e.Cod_TipoConcepto ? 'selected' : '' : ''}>${e.Nom_TipoConcepto}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Flag_Activo"></label>
                                            <div class="checkbox checkbox-inline checkbox-styled">
                                                <label>
                                                    <input type="checkbox" id="Flag_Activo" checked="${concepto ? concepto.Flag_Activo : 0}"><span> Es Activo?</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> 
                        
                        
                        </form>
                        <div class="card-actionbar">
                                <button onclick="${() => Guardar(_escritura, concepto)}" class="btn btn-primary">Guardar</button>
                            </div>
                    </div>
                </div>
            </div>
        </section>
    </div>`
    //var main = document.getElementById('main-contenido');
    //empty(main).appendChild(el);
    if($("#tab_crear_concepto_2").length){  

        $('#tab_crear_concepto_2').remove()
        $('#id_tab_crear_concepto_2').parents('li').remove()

        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    }else{
        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    } 
    $("#id_tab_crear_concepto_2").click()
}

function CerrarTab(){
    $('#tab_crear_concepto_2').remove()
    $('#id_tab_crear_concepto_2').parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show'); 
}

function ValidacionesExtras(concepto) {
    if (!concepto) {
        if (isNaN(parseInt(document.getElementById('Id_Concepto').value))) {
            $("#divErrors").removeClass("hidden")
            $('#divErrors').html('<p>El codigo debe esta conformado por numeros</p>')
            $('#Id_Concepto').css('border-color', 'red')
            return false
        } else {
            $("#divErrors").addClass("hidden")
            $('#divErrors').html('<p>Es necesario llenar todos los campos requeridos marcados con rojo</p>')
            $('#Id_Concepto').css('border-color', '')
            return true
        }
    } else
        return true
}
function Guardar(_escritura, concepto) {
    if (ValidacionCampos() && ValidacionesExtras(concepto)) {
        run_waitMe($('#main-contenido'), 1, "ios","Guardando...");
        var Id_Concepto = concepto ? concepto.Id_Concepto : document.getElementById('Id_Concepto').value.toUpperCase()
        var Des_Concepto = document.getElementById('Des_Concepto').value.toUpperCase()
        var Cod_ClaseConcepto = document.getElementById('Cod_ClaseConcepto').value
        var Id_ConceptoPadre = '0'
        var Flag_Activo = document.getElementById('Flag_Activo').checked
        var Cod_Usuario = 'ADMINISTRADOR'

        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                Id_Concepto,
                Des_Concepto,
                Cod_ClaseConcepto,
                Id_ConceptoPadre,
                Flag_Activo,
                Cod_Usuario
            })
        }
        fetch(URL + '/conceptos_api/guardar_concepto', parametros)
            .then(req => req.json())
            .then(res => {
                if (res.respuesta == 'ok') {
                    ListarConceptos(_escritura)
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

export { NuevoConcepto }