var empty = require('empty-element');
var yo = require('yo-yo');

import { ListarProductosServ } from './listar'
import { tabDatosGenerales } from './datos_generales'
import { tabPresentacionUbicacion } from './presentacion_ubicacion'
import { tabRelacionadas } from './relacionadas'
import { URL } from '../../../constantes_entorno/constantes'

function Ver(_escritura, variables, producto){

    var tab = yo`
    <li class=""><a href="#tab_crear_producto_2" data-toggle="tab" aria-expanded="false" id="id_tab_crear_producto_2">Agregar Productos y Servicios <a style="padding-left: 10px;" class="btn" onclick=${()=>CerrarTab()} ><i class="fa fa-close text-danger"></i></a></a></li>`


    var el = yo`
    <div class="tab-pane" id="tab_crear_producto_2">
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
                        <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-success" id="btnEliminar-presentacion-ubicacion" data-dismiss="modal">Si, eliminar</button>
                    </div>
                </div>
            </div>
        </div>
       
        <section class="content">
            <div class="card">
                <div class="card-head">
                    <header>
                    <a onclick=${()=>ListarProductosServ(_escritura)} class="btn btn-xs btn-icon-toggle">
                        <i class="fa fa-arrow-left"></i></a>
                        ${producto?'Editar':'Nuevo'} Producto
                    </header>
    
                </div> 
                <div class="card-body">
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
    
    //var main = document.getElementById('main-contenido');
    //empty(main).appendChild(el);
    if($("#tab_crear_producto_2").length){  

        $('#tab_crear_producto_2').remove()
        $('#id_tab_crear_producto_2').parents('li').remove()

        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    }else{
        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    } 
    
    $("#id_tab_crear_producto_2").click()
}


function CerrarTab(){
    $('#tab_crear_producto_2').remove()
    $('#id_tab_crear_producto_2').parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show'); 
}


function NuevoProductoServ(_escritura, variables, Id_Producto){
    if(Id_Producto != undefined){
        run_waitMe($('#main-contenido'), 1, "ios");
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
        fetch(URL+'/productos_serv_api/get_producto_by_pk', parametros)
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
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
    }else{
        Ver(_escritura, variables)
        tabDatosGenerales(_escritura, variables)
    }
}

export { NuevoProductoServ }