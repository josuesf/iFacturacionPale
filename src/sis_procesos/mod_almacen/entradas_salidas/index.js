var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../../constantes_entorno/constantes'
import { NuevoCliente, BuscarCliente , AbrirModalObs , BuscarProducto, AbrirModalAsignarSeries } from '../../modales'

var contador = 0
var idFilaSeleccionada = 0

function VerEntradasSalidas(variables,CodTipoComprobante,fecha_actual) {
    global.objProducto = '' 
    var el = yo`
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
                <h4 class="modal-title">${CodTipoComprobante=="NE"?"NOTA DE ENTRADA":"NOTA DE SALIDA - GUIA DE REMISION"}</h4>
            </div>
            <div class="modal-body">
                <div class="modal fade" id="modal_observaciones">
                    <div class="modal-dialog modal-sm" > 
                        <div class="modal-content" id="modal_obs_body"></div>
                    </div> 
                </div>
                <div class="row">
                    <div class="callout callout-danger hidden" id="modal_error_ingreso">
                        <p>Es necesario llenar todos los campos requeridos y el Importe mayor a cero</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-7">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h4> Almacen </h4>
                            </div>
                            <div class="panel-body">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label>Almacen</label>
                                            <select id="Cod_Almacen" class="form-control input-sm required">
                                                ${variables.dataAlmacen.map(e => yo`<option value="${e.Cod_Almacen}">${e.Des_Almacen}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row" id="divOperacion">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label>Operacion</label>
                                            <select id="Cod_Operacion" class="form-control input-sm required" onchange=${()=>CambioOperacion(CodTipoComprobante)}>
                                                ${variables.dataTiposOperaciones.map(e => yo`<option value="${e.Cod_TipoOperacion}">${e.Nom_TipoOperacion}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row" id="divDestino">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label id="laCod_Destino">Destino</label>
                                            <select id="Cod_Destino" class="form-control input-sm required" onchange=${()=>CambioDestino(CodTipoComprobante)}>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label> Motivo : </label>
                                            <input type="text" id="Motivo" class="form-control input-sm required">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-4" id="divDocRef">
                                        <div class="checkbox">
                                            <label> 
                                                <input type="checkbox" id="optDocRef" onchange=${()=>CambioDocRef()}> Con Doc Ref? 
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col-md-8" style="display:none" id="divDocRef">
                                        <div class="input-group">
                                            <input type="text" id="Nro_Documento" class="form-control required">
                                            <div class="input-group-btn">
                                                <button type="button" data-toggle="modal" id="BuscarDoc" class="btn btn-success">
                                                    <i class="fa fa-search"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                            
                        </div>
                    </div>
                    <div class="col-md-5">
                        <div class="panel panel-default">
                            <div class="panel-heading text-center">
                                <div class="row">
                                    <h4 class="box-title" id="Ruc_Empresa"><strong> R.U.C. ${variables.empresa.RUC}</strong></h4>
                                </div>
                                <div class="row">
                                    <h4><strong>${CodTipoComprobante=="NE"?"NOTA DE ENTRADA":"NOTA DE SALIDA"}</strong></h4>
                                </div> 
                                
                                <div class="row">
                                    <div class="col-md-5" id="divSerie">
                                        <div class="form-group">
 
                                            <select class="form-control input-sm" id="Serie">
                                                ${variables.dataComprobante.map(e => yo`<option value="${e.Serie}">${e.Serie}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-7" id="divNumero">
                                        <div class="form-group">
                                            <input type="text" class="form-control input-sm required" value="00000000${variables.dataMov[0]['']}" id="Numero">
                                        </div>
                                    </div>
                                </div> 
                            </div>
                            <div class="panel-footer">
                                <div class="row">
                                    <div class="col-md-12">  
                                        <div class="col-md-6" id="divRechazar">  
                                            <button class="btn btn-danger btn-sm">Rechazar Envio</button>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <b>Fecha: </b>
                                                <input type="date" class="form-control input-sm" id="Fecha" value="${fecha_actual}">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="col-md-3">
                                        <h4><strong>Detalle Producto</strong></h4>
                                    </div>
                                    <div class="col-md-9">
                                        <div class="col-md-3">
                                            <button class="btn btn-sm btn-info btn-block" onclick=${()=>RecuperarProductos(CodTipoComprobante)}>Recuperar Productos</button>
                                        </div>
                                        <div class="col-md-3">
                                            <button class="btn btn-sm btn-success btn-block">Asignar Series</button>
                                        </div>
                                        <div class="col-md-3">
                                            <button class="btn btn-sm btn-danger btn-block">Agregar por serie</button>
                                        </div>
                                        <div class="col-md-3">
                                            <button class="btn btn-sm btn-warning btn-block">Pegar Codigo x Cantidad</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="panel-body">
                            <div class="row">
                                <div class="col-md-12"> 
                                    <button type="button" class="btn btn-success btn-sm" onclick="${()=>AgregarFilaTabla()}"><i class="fa fa-plus"></i> Agregar Item</button>
                                </div>
                            </div>
                            <div class="table-responsive" id="divTablaProductos">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Codigo</th>
                                            <th>Producto</th>
                                            <th>Cantidad</th>
                                            <th>PU</th>
                                            <th>UM</th>
                                            <th>Observaciones</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tablaBody">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    
                </div>
            </div>
    
            <div class="modal-footer">
                <button class="btn btn-primary" id="btnAceptar">Aceptar</button>
                <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>`
    var ingreso = document.getElementById('modal-proceso')
    empty(ingreso).appendChild(el)
    $('#modal-proceso').modal()

    $('#modal-superior').on('hidden.bs.modal', function () {
        if(global.objProducto!='' && global.objProducto){
            $("tr#"+idFilaSeleccionada).find('td.Cod_Producto').find('input').attr("data-id",global.objProducto.Id_Producto)
            $("tr#"+idFilaSeleccionada).find('td.Cod_Producto').find('input').val(global.objProducto.Cod_Producto)
            $("tr#"+idFilaSeleccionada).find('td.Nom_Producto').find('input').val(global.objProducto.Nom_Producto)
            $("tr#"+idFilaSeleccionada).find('td.Unidad_Medida').attr("data-id",global.objProducto.Cod_UnidadMedida)
            $("tr#"+idFilaSeleccionada).find('td.Unidad_Medida').text(global.objProducto.Nom_UnidadMedida)
            if(global.objProducto.Precio_Venta!=null)
                $("tr#"+idFilaSeleccionada).find('td.Precio_Venta').find('input').val(global.objProducto.Precio_Venta)
            else
                $("tr#"+idFilaSeleccionada).find('td.Precio_Venta').find('input').val(0)
            $("tr#"+idFilaSeleccionada).find('td.Cantidad').find('input').val(1)
        }
    })

    CambioOperacion(CodTipoComprobante)
   
}


function AgregarFilaTabla(CodTipoComprobante){
    const idFila = contador
    var fila = yo`
    <tr id="${idFila}">
        <td class="Cod_Producto"><input data-id=null class="form-control" type="text" value=""></td>
        <td class="Nom_Producto"><input class="form-control" type="text" value=""  onblur=${()=>BuscarProductoES(CodTipoComprobante,idFila)}></td>
        <td class="Cantidad"><input class="form-control" type="number" value=""></td>
        <td class="Precio_Venta"><input class="form-control" type="number" value=""></td>
        <td class="Unidad_Medida" data-id=null></td>
        <td></td>
        <td><button type="button" class="btn btn-danger btn-sm" onclick="${()=>EliminarFila(idFila)}"><i class="fa fa-close"></i></button></td>
    </tr>`
    contador++
    $("#tablaBody").append(fila)
}

function LlenarProductos(productos,CodTipoComprobante){
    var el = yo`<table class="table table-bordered table-striped">
        <thead>
            <tr>
                <th>Codigo</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>PU</th> 
                <th>UM</th>
                <th>Observaciones</th>
            </tr>
        </thead>
        <tbody id="tablaBody">
            ${productos.map(u => 
                    yo`
                    <tr id="${u.Id_Producto}">
                        <td class="Cod_Producto"><input data-id="${u.Id_Producto}" class="form-control" type="text" value="${u.Cod_Producto}"></td>
                        <td class="Nom_Producto"><input class="form-control" type="text" value="${u.Nom_Producto}"  onblur=${()=>BuscarProductoES(CodTipoComprobante,u.Id_Producto)}></td>
                        <td class="Cantidad"><input class="form-control" type="number" value="1"></td>
                        <td class="Precio_Venta"><input class="form-control" type="number" value="${u.Precio_Venta}"></td>
                        <td class="Unidad_Medida" data-id="${u.Cod_UnidadMedida}">${u.Nom_UnidadMedida}</td>
                        <td></td>
                        <td><button type="button" class="btn btn-danger btn-sm" onclick="${()=>EliminarFila(u.Id_Producto)}"><i class="fa fa-close"></i></button></td>
                    </tr>`
                )}
        </tbody>
    </table>`
    var tabla = document.getElementById('divTablaProductos')
    empty(tabla).appendChild(el)

}

function LlenarAlmacenesDestinos(almacenes){
    var el = yo`
        ${almacenes.map(e => yo`
             <option value="${e.Cod_Almacen}">${e.Des_Almacen}</option>
        `)}`   
    $("#Cod_Destino").html('')
    $("#Cod_Destino").html(el)
    $("#divDocRef").show()
}

function LlenarPendientesRecepcionar(pendientes){
    var el = yo`
        ${pendientes.map(e => yo`
             <option value="${e.Id_AlmacenMov}">${e.Motivo}</option>
        `)}`   
    $("#Cod_Destino").html('')
    $("#Cod_Destino").html(el)
    $("#divDocRef").show()
}


function CambioDestino(CodTipoComprobante){
    if($("#Cod_TipoOperacion").val()=="21"){
        if($("#Cod_Destino").val().trim()!=""){
            $("#btnAceptar").text("Recepcionar")
            $("#divRechazar").show()
        }else{
            $("#btnAceptar").text("Aceptar")
            $("#divRechazar").hide()

        }
    }
}

function CambioOperacion(CodTipoComprobante){
    $("#divDestino").hide()
    $("#divRechazar").hide()
    $("#divDocRef").show()
    var Cod_Almacen = $("#Cod_Almacen").val()
    if($("#Cod_Operacion").val()=="11"){
        $("#laCod_Destino").text("Destino:")
        $("#divDestino").show()
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Cod_Almacen
            })
        }
        fetch(URL + '/almacenes_api/get_almacenes_distinto', parametros)
            .then(req => req.json())
            .then(res => { 
                console.log(res)
                LlenarAlmacenesDestinos(res.data.almacenes)
    
            })
             
    }else{
        if($("#Cod_Operacion").val()=="21"){
            $("#laCod_Destino").text("Pendientes:")
            $("#divDestino").show()
            const parametros = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Cod_Almacen
                })
            }
            fetch(URL + '/almacenes_api/get_mov_pendiente_almacenes', parametros)
                .then(req => req.json())
                .then(res => { 
                    console.log(res)
                    LlenarPendientesRecepcionar(res.data.pendientes)
        
                })
            
        }
    }
}

function CambioDocRef(){
    if($("#optDocRef").is(":checked")){
        $("#divDocRef").show()
    }else{
        $("#divDocRef").hide()
    }
}

function EliminarFila(idFila){
    $("#"+idFila).remove()
}

function BuscarProductoES(CodTipoComprobante,idFila) {
    if($("tr#"+idFila).find('td.Cod_Producto').find('input').val().trim()=="")
        if ($("tr#"+idFila).find('td.Nom_Producto').find('input').val().trim()!=""){
            idFilaSeleccionada = idFila
            BuscarProducto(CodTipoComprobante=="NS",$("tr#"+idFila).find('td.Nom_Producto').find('input').val())
        }
}

function CargarDatosAControles(Cod_Destino){
    
}

function RecuperarProductos(CodTipoComprobante){
    H5_loading.show();
    var Cod_Almacen = $("#Cod_Almacen").val()
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Cod_Almacen
        })
    }
    fetch(URL + '/productos_serv_api/get_producto_by_almacen', parametros)
        .then(req => req.json())
        .then(res => { 
            console.log(res)
            LlenarProductos(res.data.productos,CodTipoComprobante)
            H5_loading.hide()

        })
}

 

function EntradasSalidas(Cod_TipoComprobante) {
    H5_loading.show();
    const fecha = new Date()
    const mes = fecha.getMonth() + 1
    const dia = fecha.getDate()
    var fecha_format = fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)
    //VerEntradasSalidas(CodTipoComprobante,fecha_format)
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Cod_TipoComprobante
        })
    }
    fetch(URL + '/almacenes_api/get_variables_entradas_salidas', parametros)
        .then(req => req.json())
        .then(res => {
            //console.log(res)
            var variables = res.data 
            const parametros = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                })
            }
            fetch(URL + '/cajas_api/get_empresa', parametros)
                .then(req => req.json())
                .then(res => { 
                    var data_empresa = res.empresa
                    variables['empresa'] = data_empresa 
                    VerEntradasSalidas(variables,Cod_TipoComprobante,fecha_format)
                    H5_loading.hide()
        
                })
        })
}

export { EntradasSalidas }