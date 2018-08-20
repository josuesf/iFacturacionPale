var empty = require('empty-element');
var yo = require('yo-yo');

import {ListarCategorias} from './listar';
import {URL} from '../../../constantes_entorno/constantes'

function Ver(_escritura, categoriasPadre, categoria){
    var el = yo`
    <div>
        <section class="content-header">
            <h1>
                Categorias
                <small>Control categorias</small>
            </h1>
            <ol class="breadcrumb">
                <li>
                    <a href="#">
                        <i class="fa fa-cog"></i> Logistica</a>
                </li>
                <li><a  onclick=${()=>ListarCategorias(_escritura)} href="#">
                Categorias</a></li>
                <li class="active">${categoria?'Editar':'Nuevo'}</li>
            </ol>
        </section>
        <section class="content">
            <div class="box">
                <div class="box-header">
                    <a onclick=${()=>ListarCategorias(_escritura)}
                    class="btn btn-xs btn-warning">
                        <i class="fa fa-arrow-left"></i> Atras</a>
                    
                </div>
                <!-- /.box-header -->
                <div class="box-body">
                    <div class="box box-primary">
                        <div class="box-header with-border">
                            <h3 class="box-title">${categoria?'Editar':'Nueva'} Categoria</h3>
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
                            <!-- /.box-body -->
                
                            
                        </form>
                        <div class="box-footer">
                                <button onclick="${() => Guardar(_escritura, categoriasPadre, categoria)}" class="btn btn-primary">Guardar</button>
                            </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
    `
    var main = document.getElementById('main-contenido');
    empty(main).appendChild(el);
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
                toastr.error('La conexion esta muy lenta. Inténtelo nuevamente refrescando la pantalla','Error',{timeOut: 5000})
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
            toastr.error('La conexion esta muy lenta. Inténtelo nuevamente refrescando la pantalla','Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
}

export { NuevaCategoria }