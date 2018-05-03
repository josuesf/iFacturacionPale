var empty = require('empty-element');
var yo = require('yo-yo');

import { ListarProductosServ } from './listar'
import { tabDatosGenerales } from './datos_generales'
import { tabPresentacionUbicacion } from './presentacion_ubicacion'
import { tabRelacionadas } from './relacionadas'
import { URL } from '../../../constantes_entorno/constantes'

function Ver(_escritura, variables, producto){
    var el = yo`
    <div>
        <div class="modal fade" id="modal-nuevo-general" style="display: none;">
        </div>
        <div class="modal modal-danger fade" id="modal-danger-presentacion-ubicacion" style="display: none;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                        <h4 class="modal-title">¿Esta seguro que desea eliminar esta presentacion?</h4>
                    </div>
                    <div class="modal-body">
                        <p>Al eliminar esta presentacion se perderan todos los datos.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline pull-left" data-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-outline" id="btnEliminar-presentacion-ubicacion" data-dismiss="modal">Si, eliminar</button>
                    </div>
                </div>
            </div>
        </div>
        <section class="content-header">
            <h1>
                Productos y servicios
                <small>Control productos y servicios</small>
            </h1>
            <ol class="breadcrumb">
                <li>
                    <a href="#">
                        <i class="fa fa-cog"></i> Inicio</a>
                </li>
                <li>
                    <a onclick=${()=>ListarProductosServ(_escritura)} href="#"> Productos y servicios</a>
                </li>
                <li class="active">${producto?'Editar':'Nuevo'}</li>
            </ol>
        </section>
        <section class="content">
            <div class="box">
                <div class="box-header">
                    <a onclick=${()=>ListarProductosServ(_escritura)} class="btn btn-xs btn-warning">
                        <i class="fa fa-arrow-left"></i> Atras</a>
    
                </div>
                <!-- /.box-header -->
                <div class="box-body">
                    <div class="nav-tabs-custom">
                        <ul class="nav nav-tabs">
                            <li class="active">
                                <a href="#tab_general" data-toggle="tab" onclick="${() => tabDatosGenerales(_escritura, variables, producto)}" aria-expanded="true">Datos Generales</a>
                            </li>
                            ${producto?yo`
                            <li class="">
                                <a href="#tab_general" data-toggle="tab" onclick="${() => tabPresentacionUbicacion(variables, _escritura, producto)}" aria-expanded="false">1. Presentacion y Ubicacion</a>
                            </li>`:yo``}
                            ${producto?yo`
                            <li class="">
                                <a href="#tab_general" data-toggle="tab" onclick="${() => tabRelacionadas(variables, _escritura)}" aria-expanded="false">2. Relacionadas</a>
                            </li>`:yo``}
                        </ul>
                        <div class="tab-content">
                            <div class="tab-pane active" id="tab_general">

                            </div>
                        </div>
                        <!-- /.tab-content -->
                    </div>
                </div>
            </div>
        </section>
    </div>
    
    `
    
    var main = document.getElementById('main-contenido');
    empty(main).appendChild(el);
    
}




function NuevoProductoServ(_escritura, variables, Id_Producto){
    if(Id_Producto != undefined){
        H5_loading.show();
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Id_Producto
            })
        }
        fetch(URL+'/productos_serv_api/editar_producto', parametros)
            .then(req => req.json())
            .then(res => {
                if (res.respuesta == 'ok') {
                    
                    var producto = res.data.producto[0]
                    Ver(_escritura, variables,producto)
                    tabDatosGenerales(_escritura, variables, producto)
                }
                else{
                    Ver(_escritura, variables, producto)
                    tabDatosGenerales(_escritura, variables)
                }
                H5_loading.hide()
            })
    }else{
        Ver(_escritura, variables)
        tabDatosGenerales(_escritura, variables)
    }
}

export { NuevoProductoServ }