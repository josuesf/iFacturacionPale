var empty = require('empty-element')
var yo = require('yo-yo')


import { URL } from '../../../constantes_entorno/constantes'

function Ver(variables, _escritura, producto) {
    var el = yo`
    <div class="card">
        <div class="card-head">
            <header> Lista de Stock por Almacen
            </header>
            <div class="tools">
                <div class="btn-group">
                ${_escritura ? yo`
                <a class="btn btn-info pull-right" data-toggle="modal" data-target="#modal-nuevo-general" onclick="${() => AgregarPresentacion(variables, _escritura, producto)}">
                    <i class="fa fa-plus"></i> Nuevo</a>`: yo``}
                </div>
            </div>
        </div> 
        <div class="card-body">
            <div class="table-responsive">
                <table id="example1" class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>UM</th>
                            <th>Almacen</th>
                            <th>Moneda</th>
                            <th>Compra</th>
                            <th>Venta</th>
                            <th>Min</th>
                            <th>Max</th>
                            <th>Act</th>
                            <th>Equivalente</th>
                            <th>Cantidad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${variables.presentacionubicacion.map(u => yo`
                        <tr>
                            <td>${u.Nom_UnidadMedida}</td>
                            <td>${u.Des_Almacen}</td>
                            <td>${u.Cod_Moneda}</td>
                            <td>${u.Precio_Compra}</td>
                            <td>${u.Precio_Venta}</td>
                            <td>${u.Stock_Min}</td>
                            <td>${u.Stock_Max}</td>
                            <td>${u.Stock_Act}</td>
                            <td>${u.Nom_UnidadMedidaMin}</td>
                            <td>${u.Cantidad_Min}</td>
                            <td>
                                ${_escritura ? yo`<button class="btn btn-xs btn-success" data-toggle="modal" data-target="#modal-nuevo-general" onclick="${() => AgregarPresentacion(variables, _escritura, producto, u)}"><i class="fa fa-edit"></i></button>` : yo``}
                                ${_escritura ? yo`<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger-presentacion-ubicacion" onclick="${() => EliminarPresentacionUbicacion(variables, _escritura, producto, u)}"><i class="fa fa-trash"></i></button>` : yo``}
                                
                            </td>
                        </tr>`)}
                    </tbody>

                </table>
            </div>
             
        </div>
    </div>`


    var main = document.getElementById('tab_general');
    empty(main).appendChild(el);
    $('#modal-danger-presentacion-ubicacion').on('hidden.bs.modal', function () {
        var old_element = document.getElementById("btnEliminar-presentacion-ubicacion");
        var new_element = old_element.cloneNode(true);
        old_element.parentNode.replaceChild(new_element, old_element);
    });
}



function VerAgregarPresentacionUbicacion(variables, _escritura, producto,presentacion) {
    var el = yo`<div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span></button>
                        <h4 class="modal-title">Producto Stock</h4>
                    </div>
                    <div class="modal-body">
                        <div class="panel">
                            <!-- form start -->
                            <div role="form">
                                <div class="panel-body">
                                    <div class="row">
                                        <div class="alert alert-callout alert-danger hidden" id="divErrors">
                                            <p>Es necesario llenar todos los campos requeridos marcados con rojo</p>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <div class="form-group">
                                                <label>Almacen</label>
                                                <select class="form-control required" id="Cod_Almacen">
                                                    ${variables.almacenes.map(u => yo`<option value="${u.Cod_Almacen}" ${presentacion?presentacion.Cod_Almacen==u.Cod_Almacen?'selected':'':''}">${u.Des_Almacen}</option>`)}
                                                </select>
                                            </div>                
                                        </div>
                                        <div class="col-sm-6">
                                            <div class="form-group">
                                                <label for="Cod_UnidadMedida">Unidad de Medida</label>
                                                <select class="form-control required" id="Cod_UnidadMedida">
                                                    ${variables.unidades_medida.map(u => yo`<option value="${u.Cod_UnidadMedida}" ${presentacion?presentacion.Cod_UnidadMedida==u.Cod_UnidadMedida?'selected':'':''}">${u.Nom_UnidadMedida}</option>`)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <div class="form-group">
                                                <label>Moneda</label>
                                                <select class="form-control required" id="Cod_Moneda">
                                                    ${variables.monedas.map(u => yo`<option value="${u.Cod_Moneda}" ${presentacion?presentacion.Cod_Moneda==u.Cod_Moneda?'selected':'':''}">${u.Nom_Moneda}</option>`)}
                                                </select>
                                            </div>                
                                        </div>
                                        <div class="col-sm-6">
                                            <div class="form-group">
                                                <label for="Precio_Compra">Precio de Compra</label>
                                                <input type="number" class="form-control required" id="Precio_Compra" placeholder="0.00" value="${presentacion?presentacion.Precio_Compra:''}">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <div class="form-group">
                                                <label for="Precio_Venta">Precio de Venta</label>
                                                <input type="number" class="form-control required" id="Precio_Venta" placeholder="0.00" value="${presentacion?presentacion.Precio_Venta:''}">
                                            </div>
                                        </div>
                                        <div class="col-sm-6">
                                            <div class="form-group">
                                                <label for="Stock_Min">Stock Minimo</label>
                                                <input type="number" class="form-control required" id="Stock_Min" placeholder="0.00" value="${presentacion?presentacion.Stock_Min:''}">
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <div class="form-group">
                                                <label for="Stock_Max">Stock Maximo</label>
                                                <input type="number" class="form-control required" id="Stock_Max" placeholder="0.00" value="${presentacion?presentacion.Stock_Max:''}">
                                            </div>
                                        </div>
                                        <div class="col-sm-6">
                                            <div class="form-group">
                                                <label for="Stock_Act">Stock Actual</label>
                                                <input type="number" class="form-control required" id="Stock_Act" placeholder="0.00" value="${presentacion?presentacion.Stock_Act:''}">
                                            </div>
                                        </div>
                                    </div>
                                ${!producto.Flag_Stock ? yo``:yo`
                                    <div class="row">
                                        <div class="row">
                                            <div class="col-sm-12">
                                                <label for="Flag_Convertir"></label>
                                                <div class="checkbox-inline checkbox-styled checkbox-primary">
                                                    <label>
                                                    <input type="checkbox" id="Flag_Convertir" ><span> Es posible convertir?</span>
                                                    </label>
                                                </div>       
                                            </div> 
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-6">
                                                <div class="form-group">
                                                    <label for="Cod_UnidadMedidaMin">Unidad de Medida</label>
                                                    <select class="form-control" id="Cod_UnidadMedidaMin">
                                                        ${variables.unidades_medida.map(u => yo`<option value="${u.Cod_UnidadMedida}" ${presentacion?presentacion.Cod_UnidadMedidaMin==u.Cod_UnidadMedida?'selected':'':''}">${u.Nom_UnidadMedida}</option>`)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-sm-6">
                                                <div class="form-group">
                                                    <label for="Cantidad_Min">Cantidad</label>
                                                    <input type="number" class="form-control" id="Cantidad_Min" placeholder="0.00" value="${presentacion?presentacion.Cantidad_Min:''}">
                                                </div>
                                            </div>
                                        </div>
                                    </div>`}
                                </div>
                            </div>
                        </div>
                        <div class="panel-footer">
                            <button onclick="${() => GuardarPresentacionUbicacion(variables,_escritura, producto)}"  class="btn btn-primary">Guardar</button>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Cancelar</button>
                    </div>
                </div>
            </div>`

    var modal_nuevo_general = document.getElementById('modal-nuevo-general')
    empty(modal_nuevo_general).appendChild(el)
}


function AgregarPresentacion(variables, _escritura, producto, presentacion) {
    run_waitMe($('#main-contenido'), 1, "ios");
    var Id_Producto = producto.Id_Producto
    var Cod_Categoria = producto.Cod_Categoria
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Id_Producto,
            Cod_Categoria
        })
    }
    fetch(URL + '/productos_serv_api/get_lista_stock', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var almacenes = res.data.almacenes
                var unidades_medida = res.data.unidades_medida
                var unidades_medida_tipo = res.data.unidades_medida_tipo
                var monedas = res.data.monedas
                var precio_categoria = res.data.precio_categoria
                variables['almacenes'] = almacenes
                variables['unidades_medida'] = unidades_medida
                variables['unidades_medida_tipo'] = unidades_medida_tipo
                variables['monedas'] = monedas
                variables['precio_categoria'] = precio_categoria
                VerAgregarPresentacionUbicacion(variables, _escritura, producto,presentacion)
            } else {
                console.log("ERR")
            }
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
}

function GuardarPresentacionUbicacion(variables,_escritura, producto){
    if(ValidacionCampos()){
        run_waitMe($('#main-contenido'), 1, "ios","Guardando...");
        var Id_Producto = producto.Id_Producto
        var Cod_UnidadMedida = document.getElementById('Cod_UnidadMedida').value
        var Cod_Almacen = document.getElementById('Cod_Almacen').value
        var Cod_Moneda = document.getElementById('Cod_Moneda').value
        var Precio_Compra = document.getElementById('Precio_Compra').value
        var Precio_Venta = document.getElementById('Precio_Venta').value
        var Stock_Min = document.getElementById('Stock_Min').value
        var Stock_Max = document.getElementById('Stock_Max').value
        var Stock_Act = document.getElementById('Stock_Act').value
        var Cod_UnidadMedidaMin = document.getElementById('Cod_UnidadMedidaMin').value
        var Cantidad_Min = document.getElementById('Cantidad_Min').value
        var Cod_TipoPrecio = '001' 
        var Valor = 0
        var Cod_Usuario = "ADMINISTRADOR"


        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                Id_Producto,
                Cod_UnidadMedida,
                Cod_Almacen,
                Cod_Moneda,
                Precio_Compra,
                Precio_Venta,
                Stock_Min,
                Stock_Max,
                Stock_Act,
                Cod_UnidadMedidaMin,
                Cantidad_Min,
                Cod_TipoPrecio,
                Valor,
                Cod_Usuario
            })
        }
        fetch(URL+'/productos_serv_api/guardar_presentacion_ubicacion', parametros)
            .then(req => req.json())
            .then(res => {
                if (res.respuesta == 'ok') {
                    tabPresentacionUbicacion(variables, _escritura, producto)
                }
                else{
                    console.log('Error')
                }
                $('#main-contenido').waitMe('hide');
                $("#modal-nuevo-general").modal('hide')
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
    }
}


function EliminarPresentacionUbicacion(variables, _escritura, producto, u) {
    var btnEliminar = document.getElementById('btnEliminar-presentacion-ubicacion')
    btnEliminar.addEventListener('click', function () {
        run_waitMe($('#main-contenido'), 1, "ios","Eliminando...");
        var Id_Producto = producto.Id_Producto
        var Cod_UnidadMedida = u.Cod_UnidadMedida
        var Cod_Almacen = u.Cod_Almacen
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Id_Producto,
                Cod_UnidadMedida,
                Cod_Almacen
            })
        }
        fetch(URL + '/productos_serv_api/eliminar_presentacion_ubicacion', parametros)
            .then(req => req.json())
            .then(res => {
                tabPresentacionUbicacion(variables, _escritura, producto)
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
    })
}
 
function tabPresentacionUbicacion(variables, _escritura, producto) {
    run_waitMe($('#main-contenido'), 1, "ios");
    var Id_Producto = producto.Id_Producto
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
    fetch(URL + '/productos_serv_api/get_presentacion_ubicacion', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var presentacionubicacion = res.data.presentacionubicacion
                variables['presentacionubicacion'] = presentacionubicacion
                Ver(variables, _escritura, producto)
            }
            else
                Ver(variables, _escritura, producto)
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
}

export { tabPresentacionUbicacion }

