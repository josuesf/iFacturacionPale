var empty = require('empty-element');
var yo = require('yo-yo');

import {ListarCategorias} from './listar';
import {URL} from '../../../constantes_entorno/constantes'

function Ver(_escritura, categoriasPadre, categoria){

    var tab = yo`
    <li class=""><a href="#tab_crear_categoria_2" data-toggle="tab" aria-expanded="false" id="id_tab_crear_categoria_2">Nueva Categoria<a style="padding-left: 10px;" class="btn" onclick=${()=>CerrarTab()}><i class="fa fa-close text-danger"></i></a></a></li>`

    var el = yo`
    <div class="tab-pane" id="tab_crear_categoria_2">
        <section class="content">
            <div class="card">
                <div class="card-head">
                    <header>
                    <a onclick=${()=>ListarCategorias(_escritura)}
                    class="btn btn-xs btn-icon-toggle">
                        <i class="fa fa-arrow-left"></i> </a>
                        ${categoria?'Editar':'Nueva'} Categoria
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
                                    ${categoria? yo``:yo`
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Cod_Categoria">Codigo de Categoria</label>
                                            <input type="text" style="text-transform:uppercase" class="form-control required" id="Cod_Categoria" placeholder="Codigo categoria" >
                                        </div>
                                    </div>`}
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Des_Categoria">Categoria</label>
                                            <input type="text" style="text-transform:uppercase" class="form-control required" id="Des_Categoria" placeholder="Descripcion de categoria" value="${categoria?categoria.Des_Categoria:''}">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Cod_CategoriaPadre">Categoria padre</label>
                                            <select id="Cod_CategoriaPadre" class="form-control">
                                                ${categoriasPadre.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_Categoria}" ${categoria ? categoria.Cod_CategoriaPadre == e.Cod_Categoria ? 'selected' : '' : ''}>${e.Des_Categoria}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Foto">Imagen</label>
                                            <input type="file" id="Foto">
                                        </div>
                                    </div>
                                </div>
                                
                            </div> 
                
                            
                        </form>
                        <div class="card-actionbar">
                                <button onclick="${() => Guardar(_escritura, categoriasPadre, categoria)}" class="btn btn-primary">Guardar</button>
                            </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
    `
    //var main = document.getElementById('main-contenido');
    //empty(main).appendChild(el);
    if($("#tab_crear_categoria_2").length){  

        $('#tab_crear_categoria_2').remove()
        $('#id_tab_crear_categoria_2').parents('li').remove()

        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    }else{
        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    } 
    $("#id_tab_crear_categoria_2").click()
}


function CerrarTab(){
    $('#tab_crear_categoria_2').remove()
    $('#id_tab_crear_categoria_2').parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show'); 
}


function Guardar(_escritura, categoriasPadre, categoria){
    if(ValidacionCampos()){
        var Cod_Categoria = categoria?categoria.Cod_Categoria:document.getElementById('Cod_Categoria').value.toUpperCase()
        var Des_Categoria = document.getElementById('Des_Categoria').value.toUpperCase()
        var Foto = null
        var Cod_CategoriaPadre = document.getElementById('Cod_CategoriaPadre').value.toUpperCase()
        var Cod_Usuario = 'ADMINISTRADOR'.toUpperCase()
        run_waitMe($('#main-contenido'), 1, "ios","Guardando...");
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                Cod_Categoria,
                Des_Categoria,
                Cod_CategoriaPadre,
                Cod_Usuario
            })
        }
        fetch(URL+'/categorias_api/guardar_categoria', parametros)
            .then(req => req.json())
            .then(res => {
                if(res.respuesta == 'ok'){
                    ListarCategorias(_escritura)
                }else{
                    Ver(_escritura, categoriasPadre, categoria)
                }
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
    }
}

function NuevaCategoria(_escritura, categoria){
    run_waitMe($('#main-contenido'), 1, "ios");
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({

        })
    }
    fetch(URL+'/categorias_api/get_categoriaspadre', parametros)
        .then(req => req.json())
        .then(res => {
            if(res.respuesta == 'ok'){
                var categoriasPadre = res.data.categoriaspadre
                Ver(_escritura, categoriasPadre, categoria)
            }else{
                Ver(_escritura, [], categoria)
            }
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
}

export { NuevaCategoria }