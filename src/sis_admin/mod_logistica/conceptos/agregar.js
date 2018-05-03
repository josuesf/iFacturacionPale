var empty = require('empty-element');
var yo = require('yo-yo');

import { ListarConceptos } from './listar';
import { URL } from '../../../constantes_entorno/constantes'


function NuevoConcepto(_escritura, tipos_conceptos, concepto) {

    var el = yo`
    <div>
        <section class="content-header">
            <h1>
                Conceptos
                <small>Control conceptos</small>
            </h1>
            <ol class="breadcrumb">
                <li>
                    <a href="#">
                        <i class="fa fa-cog"></i> Logistica</a>
                </li>
                <li><a  onclick=${() => ListarConceptos(_escritura)} href="#">
                Conceptos</a></li>
                <li class="active">${concepto ? 'Editar' : 'Nuevo'}</li>
            </ol>
        </section>
        <section class="content">
            <div class="box">
                <div class="box-header">
                    <a onclick=${() => ListarConceptos(_escritura)}
                    class="btn btn-xs btn-warning">
                        <i class="fa fa-arrow-left"></i> Atras</a>
                    
                    
                </div>
                <!-- /.box-header -->
                <div class="box-body">
                    <div class="box box-primary">
                        <div class="box-header with-border">
                            <h3 class="box-title">${concepto ? 'Editar' : 'Nuevo'} Concepto</h3>
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
                                            <div class="checkbox">
                                                <label>
                                                    <input type="checkbox" id="Flag_Activo" checked="${concepto ? concepto.Flag_Activo : 0}"> Es Activo?
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- /.box-body -->
                        
                        
                        </form>
                        <div class="box-footer">
                                <button onclick="${() => Guardar(_escritura, concepto)}" class="btn btn-primary">Guardar</button>
                            </div>
                    </div>
                </div>
            </div>
        </section>
    </div>`
    var main = document.getElementById('main-contenido');
    empty(main).appendChild(el);
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
        H5_loading.show();
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
                H5_loading.hide()
            })
    }
}

export { NuevoConcepto }