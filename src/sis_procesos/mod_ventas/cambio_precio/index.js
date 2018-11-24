var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../../constantes_entorno/constantes'
import { refrescar_movimientos } from '../../movimientos_caja'
import { BuscarCliente } from '../../modales' 
 
var cantidad_tabs = 0  

function Ver(variables) {
    //cantidad_tabs++
    const idTabCP = "CP_"+cantidad_tabs 
    
    var tab = yo`
    <li class="" ><a href="#tab_${idTabCP}" data-toggle="tab" aria-expanded="false" id="id_${idTabCP}">Cambio de Precio <a style="padding-left: 10px;"  onclick=${()=>CerrarTabCP(idTabCP)} class="btn"><i class="fa fa-close text-danger"></i></a></a></li>`


    var el = yo`
        <div class="tab-pane" id="tab_${idTabCP}">
            <div class="panel">
                <div class="panel-body">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="Cod_Almacen_${idTabCP}">Almacen</label>
                                <select id="Cod_Almacen_${idTabCP}" class="form-control input-sm">
                                    <option value="">Seleccione Almacen</option>
                                    ${variables.almacenes.map(m=>
                                        yo`<option value=${m.Cod_Almacen}>${m.Des_Almacen}</option>`
                                    )}
                                </select>
                            </div>
                        </div>
                        <div  class="col-md-4">
                            <div class="form-group">
                                <label for="Cod_TipoPrecio_${idTabCP}">Tipo Precio</label>
                                <select id="Cod_TipoPrecio_${idTabCP}"  class="form-control input-sm">
                                    <option value="">Seleccione Tipo Precio</option>
                                    ${variables.precios.map(m=>
                                        yo`<option value=${m.Cod_Precio}>${m.Nom_Precio}</option>`
                                    )}
                                </select>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <button type="button" class="btn btn-primary btn-sm" style="margin-top: 20px;" onclick=${()=>RecuperarProductos(idTabCP)}><i class="fa fa-refresh"></i> Recuperar Productos</button>
                        </div> 
                    </div>
                    <p></p>
                    <div class="row">
                        <form id="formProductos_${idTabCP}">
                            <div class="table-responsive" id="divTablaProductos_${idTabCP}">
                                <table class="table table-bordered table-striped" id="tablaProductos_${idTabCP}">
                                    <thead>
                                        <tr>
                                            <th>Almacen</th>
                                            <th>Cod_Producto</th> 
                                            <th>Producto</th>
                                            <th>Unidad de Medida</th>
                                            <th>Precio Venta</th>
                                            <th>Precio Actual</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tablaProductosBody_${idTabCP}">
                                    </tbody>
                                </table>
                            </div>
                        </form>
                    </div>
                    
                </div>
                 
            </div>
        </div>`
 
    if($("#tab_"+idTabCP).length){   
        $('#tab_'+idTabCP).remove()
        $('#id_'+idTabCP).parents('li').remove()

        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    }else{
        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    } 
    $("#id_"+idTabCP).click() 
    $('#tablaProductos_'+idTabCP).DataTable({
        "responsive": true,
        "lengthChange": true,
        "order": [[ 1, "desc" ]],
        "oLanguage": {
            "sSearch": "Buscar:"
        }
    });
}

function LlenarTablaProductos(productos,idTab){ 
        var el = yo`<table class="table table-bordered table-striped" id="tablaProductos_${idTab}">
            <thead>
                <tr>
                    <th>Almacen</th>
                    <th>Cod_Producto</th> 
                    <th>Producto</th>
                    <th>Unidad de Medida</th>
                    <th>Precio Venta</th>
                    <th>Precio Actual</th>
                </tr>
            </thead>
            <tbody>
                ${productos.map((u,index) =>  
                    yo` <tr> 
                            <td>${$("#Cod_Almacen_"+idTab+" option:selected").text()}</td>
                            <td>${u.Cod_Producto}</td>
                            <td>${u.Nom_Producto}</td>
                            <td>${u.Nom_UnidadMedida}</td>
                            <td>${u.Precio_Venta}</td>
                            <td><input class="form-control" id="PrecioActual${idTab}${index}" type="number" value="${u.Precio_Actual}" onchange=${()=>CambioPrecioActual(u,idTab,index)}></td>
                        </tr>`
                    )}
            </tbody>
        </table>`
        empty(document.getElementById('divTablaProductos_'+idTab)).appendChild(el);
        $('#tablaProductos_'+idTab).DataTable({
            "responsive": true,
            "lengthChange": true,
            "order": [[ 1, "desc" ]],
            "oLanguage": {
                "sSearch": "Buscar:"
            }
        });
}

function CambioPrecioActual(producto,idTab,index){
    run_waitMe($('#tablaProductos_'+idTab), 1, "ios"); 
    var Id_Producto = producto.Id_Producto
    var Cod_UnidadMedida = producto.Cod_UnidadMedida
    var Cod_Almacen = producto.Cod_Almacen
    var Cod_TipoPrecio = $("#Cod_TipoPrecio_"+idTab).val()
    var Valor = $("#PrecioActual"+idTab+index).val()
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Id_Producto,
            Cod_UnidadMedida,
            Cod_Almacen,
            Cod_TipoPrecio,
            Valor
        })
    }
    fetch(URL + '/precios_api/guardar_cambio_precio', parametros)
        .then(req => req.json())
        .then(res => { 
            if(res.respuesta=='ok'){
                toastr.success('Se modifico correctamente el precio','Confirmacion',{timeOut: 5000})
            }else{
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+res.detalle_error,'Error',{timeOut: 5000})
            }
            
            $('#tablaProductos_'+idTab).waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#tablaProductos_'+idTab).waitMe('hide');
        });
}

function RecuperarProductos(idTab){
    run_waitMe($('#tablaProductos_'+idTab), 1, "ios");
    var Cod_Almacen = $("#Cod_Almacen_"+idTab).val()
    var Cod_Precio = $("#Cod_TipoPrecio_"+idTab).val()
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Cod_Almacen,
            Cod_Precio
        })
    }
    fetch(URL + '/productos_serv_api/get_productos_stock_by_almacen_precio', parametros)
        .then(req => req.json())
        .then(res => {
            var productos = res.data.productos
            if (res.respuesta == 'ok') {
                LlenarTablaProductos(productos,idTab)
            }else{
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+res.detalle_error,'Error',{timeOut: 5000})
            }
            $('#tablaProductos_'+idTab).waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#tablaProductos_'+idTab).waitMe('hide');
        });
}

function CerrarTabCP(idTab){ 
    $('#tab_'+idTab).remove()
    $('#id_'+idTab).parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show');
}

 
function NuevoCambioPrecio() { 
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
    fetch(URL + '/precios_api/get_variables_cambio_precio', parametros)
        .then(req => req.json())
        .then(res => {
            var variables = res.data
            console.log(variables)
            if (res.respuesta == 'ok') {
                
                Ver(variables)
            }else{
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+res.detalle_error,'Error',{timeOut: 5000})
            }
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
}



export { NuevoCambioPrecio }