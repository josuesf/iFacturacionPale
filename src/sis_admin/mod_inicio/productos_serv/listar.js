var empty = require('empty-element');
var yo = require('yo-yo');

import { NuevoProductoServ } from './agregar'
import {URL} from '../../../constantes_entorno/constantes'

function Ver(variables, paginas, pagina_actual, _escritura,tamanio_pagina){

    var tab = yo`
    <li class=""><a href="#tab_listar_productos_2" data-toggle="tab" aria-expanded="false" id="id_tab_listar_producto_2">Productos y Servicios <a style="padding-left: 10px;" class="btn" onclick=${()=>CerrarTab()}><i class="fa fa-close text-danger"></i></a></a></li>`

    var el = yo`
    <div class="tab-pane" id="tab_listar_productos_2">
        <section class="content-header">
            <div class="modal modal-danger fade" id="modal-danger-conf" style="display: none;">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span></button>
                        <h4 class="modal-title">¿Esta seguro que desea eliminar este elemento?</h4>
                        </div>
                        <div class="modal-body">
                        <p>Al eliminar este elemento no podra recuperarlo. Desea continuar de todas maneras?</p>
                        </div>
                        <div class="modal-footer">
                        <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-success" id="btnEliminarProducto" data-dismiss="modal">Si, Eliminar</button>
                        </div>
                    </div> 
                </div> 
            </div>
        </section>
        <section class="content">
            <div class="card">
                <div class="card-head">
                    <header>Lista de Productos y Servicios</header>
                    <div class="tools">
                        <div class="btn-group">
                        ${_escritura ? yo`<a onclick=${()=>NuevoProductoServ(_escritura, variables)} class="btn btn-info pull-right">
                            <i class="fa fa-plus"></i> Nuevo</a>`: yo``}
                        </div>
                    </div>
                </div>
                <div class="card-body">

                    <div class="row">
                        <div class="col-md-6">
                            <div class="form">
                                <div class="form-group floating-label">
                                    <div class="input-group">
                                        <div class="input-group-content">
                                            <input type="text" class="form-control dirty" id="parametro_busqueda_producto" onkeypress=${()=>BuscarParametroProducto(event)}>
                                            <label for="parametro_busqueda_producto">Ingrese parametro de busqueda</label>
                                        </div>
                                        <div class="input-group-btn">
                                            <button class="btn ink-reaction btn-raised btn-primary" type="button"  onclick=${()=>BuscarParametroProducto()}><i class="fa fa-search"></i> Buscar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-2 col-md-offset-4">
                            <div class="form">
                                <div class="form-group floating-label">
                                    <div class="input-group">
                                        <div class="input-group-btn">
                                            <label class="control-label">Mostrar</label>
                                        </div>
                                        <div class="input-group-content">
                                            <select id="nro_registros_productos" onchange=${()=>CambioTamanioPagina()} class="form-control input-sm">
                                                <option style="text-transform:uppercase" ${tamanio_pagina?tamanio_pagina=='10'?'selected':'':''} value="10">10</option>
                                                <option style="text-transform:uppercase" ${tamanio_pagina?tamanio_pagina=='25'?'selected':'':''} value="25">25</option>
                                                <option style="text-transform:uppercase" ${tamanio_pagina?tamanio_pagina=='50'?'selected':'':''} value="50">50</option>
                                                <option style="text-transform:uppercase" ${tamanio_pagina?tamanio_pagina=='100'?'selected':'':''} value="100">100</option>
                                            </select>
                                        </div>
                                        <div class="input-group-btn">
                                            <label class="control-label">Registros</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div class="table-responsive">
                    <table id="example1" class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Codigo</th>
                                <th>Producto</th>
                                <th>Tipo</th>
                                <th>Categoria</th>
                                <th>Marca</th>
                                <th>Activo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${variables.productos_serv.map(u => yo`
                            <tr>
                                <td>${u.Id_Producto}</td>
                                <td>${u.Cod_Producto}</td>
                                <td>${u.Nom_Producto}</td>
                                <td>${u.Nom_TipoProducto}</td>
                                <td>${u.Des_Categoria}</td>
                                <td>${u.Nom_Marca}</td>
                                <td>${u.Flag_Activo?"Si":"No"}</td>
                                <td>
                                    ${_escritura ? yo`<button class="btn btn-xs btn-success" onclick="${()=>NuevoProductoServ(_escritura, variables, u.Id_Producto)}"><i class="fa fa-edit"></i></button>` : yo``}
                                    ${_escritura ? yo`<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger-conf" onclick="${()=>EliminarProductoServ(_escritura, u.Id_Producto)}"><i class="fa fa-trash"></i></button>` : yo``}
                                    
                                </td>
                            </tr>`)}
                        </tbody>
    
                    </table>
                    </div>
                    <div class="card-actionbar">
                        <ul class="pagination pagination-sm no-margin pull-right">
                            <li>
                                <a href="javascript:void(0);" onclick=${()=>(pagina_actual>0)?ListarProductosServ(_escritura,pagina_actual-1):null}>«</a>
                            </li>
                            ${((new Array(paginas)).fill(0)).map((p, i) => yo`<li class=${pagina_actual==i?'active':''}>
                            <a href="javascript:void(0);" onclick=${()=>ListarProductosServ(_escritura,i)} >${i + 1}</a>
                            </li>`)}
                        
                            <li>
                                <a href="javascript:void(0);" onclick=${()=>(pagina_actual+1<paginas)?ListarProductosServ(_escritura,pagina_actual+1):null}>»</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    </div>`
    //var main = document.getElementById('main-contenido');
    //empty(main).appendChild(el);
    if($("#tab_listar_productos_2").length){  

        $('#tab_listar_productos_2').remove()
        $('#id_tab_listar_producto_2').parents('li').remove()

        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    }else{
        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    } 
    $("#id_tab_listar_producto_2").click()
}

function CambioTamanioPagina(){ 
    ListarProductosServ(true,null,null,null,$("#nro_registros_productos").val())
}


function CerrarTab(){
    $('#tab_listar_productos_2').remove()
    $('#id_tab_listar_producto_2').parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show'); 
}

// function getFechaHora(str, flagfecha, flaghora){
//     var spl = str.split('T')
//     var fecha = spl[0].split('-')
//     var hora = spl[1].split(':')
//     var fechastr = fecha[2]+'/'+fecha[1]+'/'+fecha[0]
//     var horastr = hora[0]+':'+hora[1]
//     return flagfecha?fechastr+(flaghora?' '+horastr:''):flaghora?horastr:''
// }

 function EliminarProductoServ(_escritura, Id_Producto){ 
     var btnEliminar = document.getElementById('btnEliminarProducto')
     btnEliminar.addEventListener('click', function del(ev){  
        run_waitMe($('#main-contenido'), 3, "ios");
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
         fetch(URL+'/productos_serv_api/eliminar_producto', parametros)
             .then(req => req.json())
             .then(res => { 
                //ListarProductosServ(_escritura,0)
                //this.removeEventListener('click', del)
                $('#main-contenido').waitMe('hide');
             }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
     })
}

function BuscarParametroProducto(event){
    if(event){
        if(event.which == 13) { 
            var parametro = $("#parametro_busqueda_producto").val()
            var scriptOrden= " ORDER BY Nom_Producto asc"
            var scripWhere = "WHERE (Cod_Producto like '%"+parametro+"%' or Nom_Producto like '%"+parametro+"%') AND Cod_TipoProducto like '%'"
            ListarProductosServ(true,'0',scriptOrden,scripWhere)
        }
    }else{
        var parametro = $("#parametro_busqueda_producto").val()
        var scriptOrden= " ORDER BY Nom_Producto asc"
        var scripWhere = "WHERE (Cod_Producto like '%"+parametro+"%' or Nom_Producto like '%"+parametro+"%') AND Cod_TipoProducto like '%'"
        ListarProductosServ(true,'0',scriptOrden,scripWhere)
    }
}

function ListarProductosServ(escritura,NumeroPagina,ScripOrden,ScripWhere,TamanioPagina) {
    run_waitMe($('#main-contenido'), 3, "ios");
    var _escritura=escritura;
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            TamanoPagina: TamanioPagina?TamanioPagina:'10',
            NumeroPagina: NumeroPagina||'0',
            ScripOrden: ScripOrden||' ORDER BY Nom_Producto asc',
            ScripWhere: ScripWhere||'',
            Cod_Tabla: 'PRI_PRODUCTOS'
        })
    }
    fetch(URL+'/productos_serv_api/get_productos_serv', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var paginas = parseInt(res.data.num_filas[0].NroFilas)
                paginas = parseInt(paginas / (TamanioPagina?parseInt(TamanioPagina):10)) + (paginas % (TamanioPagina?parseInt(TamanioPagina):10) != 0 ? 1 : 0)
                Ver(res.data, paginas,NumeroPagina||0, _escritura,TamanioPagina)
            }
            else{
                Ver([])
            }
            
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
}

export {ListarProductosServ}