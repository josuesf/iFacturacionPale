var empty = require('empty-element')
var yo = require('yo-yo')


import { URL } from '../../../constantes_entorno/constantes'

function Ver(variables, _escritura, producto){
    var el = yo`
    <div>
                <div class="box-header">
                    <h3 class="box-title">Lista de Stock por Almacen</h3>
                    ${_escritura ? yo`
                    <a class="btn btn-info pull-right" data-toggle="modal" data-target="#modal-nuevo-general" onclick="${()=>AgregarPresentacion(variables, _escritura, producto)}">
                        <i class="fa fa-plus"></i> Nuevo</a>`: yo``}
                </div>
                <!-- /.box-header -->
                <div class="box-body">
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
                                        ${_escritura ? yo`<button class="btn btn-xs btn-success" data-toggle="modal" data-target="#modal-nuevo-general" onclick="${()=>AgregarPresentacion(variables, _escritura, producto, u)}"></i></button>` : yo``}
                                        ${_escritura ? yo`<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger-presentacion-ubicacion" onclick="${()=>EliminarPresentacionUbicacion(variables, _escritura, producto, u)}"><i class="fa fa-trash"></i></button>` : yo``}
                                        
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

function AgregarPresentacion(variables, _escritura, producto, presentacion){
    H5_loading.show()
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
    }
    fetch(URL+'/cajas_api/get_comprobantes', parametros)
    .then(req => req.json())
    .then(res => {
        if (res.respuesta == 'ok') {
            var comprobantes = res.data.comprobantes
            
            if(documento == undefined) 
                VerAgregarDocumento(_escritura, sucursales, usuarios, cuentas_contables,caja, comprobantes)
            else
                VerAgregarDocumento(_escritura, sucursales, usuarios, cuentas_contables,caja, comprobantes, documento)

        }else{
            console.log("ERR")
        }
        H5_loading.hide()
    })
}

function EliminarPresentacionUbicacion(variables, _escritura, producto, u){
    var btnEliminar = document.getElementById('btnEliminar-presentacion-ubicacion')
    btnEliminar.addEventListener('click', function (){
        H5_loading.show();
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
        fetch(URL+'/productos_serv_api/eliminar_presentacion_ubicacion', parametros)
            .then(req => req.json())
            .then(res => {
                tabPresentacionUbicacion(variables, _escritura, producto)
                H5_loading.hide()
            })
    })
}

function AgregarPresentacionUbicacion(_escritura, variables, presentacionubicacion){
    H5_loading.show()
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
    }
    fetch(URL+'/cajas_api/get_comprobantes', parametros)
    .then(req => req.json())
    .then(res => {
        if (res.respuesta == 'ok') {
            var comprobantes = res.data.comprobantes
            
            if(documento == undefined) 
                VerAgregarDocumento(_escritura, sucursales, usuarios, cuentas_contables,caja, comprobantes)
            else
                VerAgregarDocumento(_escritura, sucursales, usuarios, cuentas_contables,caja, comprobantes, documento)

        }else{
            console.log("ERR")
        }
        H5_loading.hide()
    })
}

function tabPresentacionUbicacion(variables, _escritura, producto){
    H5_loading.show();
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
    fetch(URL+'/productos_serv_api/get_presentacion_ubicacion', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var presentacionubicacion = res.data.presentacionubicacion
                variables['presentacionubicacion'] = presentacionubicacion
                Ver(variables, _escritura, producto)
            }
            else
                Ver(variables, _escritura, producto)
            H5_loading.hide()
        })
}

export { tabPresentacionUbicacion }

