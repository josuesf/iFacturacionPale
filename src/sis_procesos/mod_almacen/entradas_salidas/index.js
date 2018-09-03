var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../../constantes_entorno/constantes'
import {BloquearControles} from '../../../../utility/tools'
import { BuscarProducto } from '../../modales'
import { BuscarComprobantePago } from '../../modales/comprobante_pago'
import { AsignarSeriesModal } from '../../modales/series'
import { refrescar_movimientos } from '../../movimientos_caja'

var contador = 0
var idFilaSeleccionada = 0
var idFilaSeleccionadaSerie = 0

function VerEntradasSalidas(variables,CodTipoComprobante,fecha_actual) {
    global.arraySeries = ''
    global.objProducto = ''
    global.objComprobantePago = '' 
    global.objComprobantePagoDetalle = '' 
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
                    <div class="alert alert-callout alert-danger hidden" id="modal_error_ingreso">
                        <p>Es necesario llenar todos los campos requeridos y el Importe mayor a cero</p>
                    </div>
                </div>
                <div class="row" id="divAnulado" style="display:none">
                    <div class="col-md-12 text-center">
                        <div class="small-box bg-red">
                            <div class="inner">
                                <h3 id="laAnulado">ANULADO</h3>
                            </div>
                        </div>
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
                                            <select id="Cod_Destino" class="form-control input-sm required" onchange=${()=>CambioDestino(CodTipoComprobante,fecha_actual)}>
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
                                        <div class="checkbox checkbox-inline checkbox-styled">
                                            <label> 
                                                <input type="checkbox" id="optDocRef" onchange=${()=>CambioDocRef()}><span> Con Doc Ref?</span> 
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col-md-8" style="display:none" id="divId_ComprobantePago">
                                        <div class="input-group">
                                            <input type="text" id="Id_ComprobantePago" data-id=0 class="form-control required" disabled>
                                            <div class="input-group-btn">
                                                <button type="button" data-toggle="modal" id="BuscarId_ComprobantePago" class="btn btn-success" onclick=${()=>BuscarComprobantePago(CodTipoComprobante)}>
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
                                            <input type="text" class="form-control input-sm required" value="00000000${variables.dataMov[0]['']}" id="Numero" onkeypress=${()=>BloquearControles(event)}>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                            <div class="panel-footer">
                                <div class="row">
                                    <div class="col-md-12">  
                                        <div class="col-md-6" id="divRechazar">  
                                            <button class="btn btn-danger btn-sm" onclick=${()=>RechazarEnvio()}>Rechazar Envio</button>
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
                                        <div class="col-md-4">
                                            <button class="btn btn-sm btn-info btn-block" onclick=${()=>RecuperarProductos(CodTipoComprobante,fecha_actual)}>Recuperar Productos</button>
                                        </div>
                                        <!--<div class="col-md-4">
                                            <button class="btn btn-sm btn-danger btn-block">Agregar por serie</button>
                                        </div>-->
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="panel-body">
                            <form id="formTablaMovAlmacen">
                                <div class="row">
                                    <div class="col-md-12"> 
                                        <button type="button" class="btn btn-success btn-sm" onclick="${()=>AgregarFilaTabla(CodTipoComprobante,fecha_actual)}"><i class="fa fa-plus"></i> Agregar Item</button>
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
                            </form>
                        </div>
                    </div>
                </div>
                <div class="row">
                    
                </div>
            </div>
    
            <div class="modal-footer">
                <button class="btn btn-primary" id="btnAceptar" onclick="${()=>AceptarRegistroEntradaSalida(CodTipoComprobante,fecha_actual)}">Aceptar</button>
                <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>`
    var ingreso = document.getElementById('modal-proceso')
    empty(ingreso).appendChild(el)
    $('#modal-proceso').modal()

    $('#modal-superior').on('hidden.bs.modal', function () {
        if(global.objProducto!='' && global.objProducto){
            $("tr#"+idFilaSeleccionada).find('td.Id_Producto').find('input').val(global.objProducto.Id_Producto)
            $("tr#"+idFilaSeleccionada).find('td.Cod_Producto').find('input').attr("data-id",global.objProducto.Id_Producto)
            $("tr#"+idFilaSeleccionada).find('td.Cod_Producto').find('input').val(global.objProducto.Cod_Producto)
            $("tr#"+idFilaSeleccionada).find('td.Nom_Producto').find('input').val(global.objProducto.Nom_Producto)
            $("tr#"+idFilaSeleccionada).find('td.Unidad_Medida').attr("data-id",global.objProducto.Cod_UnidadMedida)
            $("tr#"+idFilaSeleccionada).find('td.Cod_UnidadMedida').find('input').val(global.objProducto.Cod_UnidadMedida)
            $("tr#"+idFilaSeleccionada).find('td.Unidad_Medida').text(global.objProducto.Nom_UnidadMedida)
            if(global.objProducto.Precio_Venta!=null)
                $("tr#"+idFilaSeleccionada).find('td.Precio_Venta').find('input').val(global.objProducto.Precio_Venta)
            else
                $("tr#"+idFilaSeleccionada).find('td.Precio_Venta').find('input').val(0)
            $("tr#"+idFilaSeleccionada).find('td.Cantidad').find('input').val(1)
        }

        if(global.objComprobantePago!='' && global.objComprobantePago && global.objComprobantePagoDetalle!='' && global.objComprobantePagoDetalle){
            $("#Id_ComprobantePago").attr("data-id",global.objComprobantePago.id_ComprobantePago)
            $("#Id_ComprobantePago").val(global.objComprobantePagoDetalle.DocCliente+" "+global.objComprobantePagoDetalle.Cod_TipoComprobante+" "+global.objComprobantePagoDetalle.Serie+" "+global.objComprobantePagoDetalle.Numero)
        }
    })

    $('#modal-otros-procesos').on('hidden.bs.modal', function () { 
        if(global.arraySeries!='' && global.arraySeries){ 
            $("tr#"+idFilaSeleccionadaSerie).find('td.Series').find('input').val(JSON.stringify(global.arraySeries))
        }
    })

    CambioOperacion(CodTipoComprobante)
    CambioDestino(CodTipoComprobante,fecha_actual)
}


function AgregarFilaTabla(CodTipoComprobante,fecha_actual){
    const idFila = contador
    //var rows = $("#tablaBody > tr").length
    var fila = yo`
    <tr id="${idFila}">
        <td class="Id_Producto hidden"><input class="form-control" type="text" value="" name="Id_Producto"></td>
        <td class="Item hidden"><input class="form-control" type="text" value="${$("#tablaBody > tr").length}" name="Item"></td>
        <td class="Cod_Producto"><input data-id=null class="form-control" type="text" value="" name="Cod_Producto"></td>
        <td class="Nom_Producto"><input class="form-control" type="text" value=""  onblur=${()=>BuscarProductoES(CodTipoComprobante,idFila)} name="Nom_Producto"></td>
        <td class="Cantidad"><input class="form-control" type="number" value="" name="Cantidad"></td>
        <td class="Cod_UnidadMedida hidden"><input class="form-control" value=null name="Cod_UnidadMedida"></td>
        <td class="Precio_Venta"><input class="form-control" type="number" value="" name="Precio_Venta"></td>
        <td class="Unidad_Medida" data-id=null ></td>
        <td class="Observaciones"><input class="form-control" type="text" value="" name="Observaciones"></td>
        <td class="Series hidden"><input class="form-control" type="text" value=${JSON.stringify([])} name="Series"></td>
        <td>
            <div style="display:flex;">
                <button type="button" onclick="${()=>AsignarSeries(idFila,fecha_actual,CodTipoComprobante)}" class="btn btn-primary btn-sm"><i class="fa fa-tasks"></i></a>  
                <button type="button" onclick="${()=>EliminarFila(idFila)}" class="btn btn-danger btn-sm"><i class="fa fa-trash"></i></button>
            </div>
        </td>
    </tr>`
    contador++
    $("#tablaBody").append(fila)
}

function LlenarProductos(productos,CodTipoComprobante,fecha_actual){
    var i=0
    var el = yo`
        <table class="table table-bordered table-striped">
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
                        <td class="Id_Producto hidden"><input class="form-control" type="text" value="${u.Id_Producto}" name="Id_Producto"></td>
                        <td class="Item hidden"><input class="form-control" type="text" value="${i++}" name="Item"></td>
                        <td class="Cod_Producto"><input data-id="${u.Id_Producto}" class="form-control" name="Cod_Producto" type="text" value="${u.Cod_Producto}"></td>
                        <td class="Nom_Producto"><input class="form-control" type="text" value="${u.Nom_Producto}" name="Nom_Producto" onblur=${()=>BuscarProductoES(CodTipoComprobante,u.Id_Producto)}></td>
                        <td class="Cantidad"><input class="form-control" type="number" value="1" name="Cantidad"></td>
                        <td class="Cod_UnidadMedida hidden"><input class="form-control" value="${u.Cod_UnidadMedida}" name="Cod_UnidadMedida"></td>
                        <td class="Precio_Venta"><input class="form-control" type="number" name="Precio_Venta" value="${u.Precio_Venta}"></td>
                        <td class="Unidad_Medida" name="Unidad_Medida" data-id="${u.Cod_UnidadMedida}">${u.Nom_UnidadMedida}</td>
                        <td class="Observaciones"><input class="form-control" type="text" value="" name="Observaciones"></td>
                        <td class="Series hidden"><input class="form-control" type="text" value=${JSON.stringify([])} name="Series"></td>
                        <td>
                            <div style="display:flex;">
                                <button type="button" onclick="${()=>AsignarSeries(u.Id_Producto,fecha_actual,CodTipoComprobante)}" class="btn btn-primary btn-sm"><i class="fa fa-tasks"></i></a>  
                                <button type="button" onclick="${()=>EliminarFila(u.Id_Producto)}" class="btn btn-danger btn-sm"><i class="fa fa-trash"></i></button>
                            </div>
                        </td>
                    </tr>`
                )}
                </tbody>
        </table>`
    //$("#tablaBody").html()
    //$("#tablaBody").append(el)
    var tabla = document.getElementById('divTablaProductos')
    empty(tabla).appendChild(el)
}


function LlenarDetallesMovAlmacen(CodTipoComprobante,productos,fecha_actual){
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
                        <td class="Id_Producto hidden"><input class="form-control" type="text" value="${u.Id_Producto}" name="Id_Producto"></td>
                        <td class="Item hidden"><input class="form-control" type="text" value="${u.Item}" name="Item"></td>
                        <td class="Cod_Producto"><input data-id="${u.Id_Producto}" class="form-control" type="text" value="${u.Cod_Producto}" name="Cod_Producto"></td>
                        <td class="Nom_Producto"><input class="form-control" type="text" value="${u.Des_Producto}"  onblur=${()=>BuscarProductoES(CodTipoComprobante,u.Id_Producto)}></td>
                        <td class="Cantidad"><input class="form-control" type="number" value="${u.Cantidad}" name="Cantidad"></td>
                        <td class="Cod_UnidadMedida hidden"><input class="form-control" value="${u.Cod_UnidadMedida}" name="Cod_UnidadMedida"></td>
                        <td class="Precio_Venta"><input class="form-control" type="number" value="${u.Precio_Unitario}" name="Precio_Venta"></td> 
                        <td class="Unidad_Medida" data-id="${u.Cod_UnidadMedida}" name="Unidad_Medida">${u.Nom_UnidadMedida}</td>
                        <td class="Observaciones"><input class="form-control" type="text" value="${u.Obs_AlmacenMovD}" name="Observaciones"></td>
                        <td class="Series hidden"><input class="form-control" type="text" value=${JSON.stringify([])} name="Series"></td>

                        <td>
                            <div class="btn-group">
                                <button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="btn btn-info dropdown-toggle">
                                Elegir una accion <span class="caret"></span>
                                </button>
                                <ul class="dropdown-menu">
                                <li><a href="javascript:void(0)" onclick="${()=>AsignarSeries(u.Id_Producto,fecha_actual,CodTipoComprobante)}">Asignar Serie</a></li>
                                <li><a href="javascript:void(0)" onclick="${()=>EliminarFila(u.Id_Producto)}"><i class="fa fa-close"></i> Eliminar</a></li>
                                </ul>
                            </div> 
                        </td>
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


function CambioDestino(CodTipoComprobante,fecha_actual){
    if($("#Cod_TipoOperacion").val()=="21"){
        if($("#Cod_Destino").val()!=null){
            CargarDatosAControles(CodTipoComprobante,fecha_actual)
            $("#btnAceptar").text("Recepcionar")
            $("#divRechazar").show()
            // falta  buConsultarSeries.Visible = true;
        }else{
            $("#btnAceptar").text("Aceptar")
            $("#divRechazar").hide()
            // falta buConsultarSeries.Visible = true;

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
                LlenarAlmacenesDestinos(res.data.almacenes)
    
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            });
             
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
                    LlenarPendientesRecepcionar(res.data.pendientes)
        
                }).catch(function (e) {
                    console.log(e);
                    toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                });
            
        }
    }
}

function CambioDocRef(){
    if($("#optDocRef").is(":checked")){
        $("#divId_ComprobantePago").show()
    }else{
        $("#divId_ComprobantePago").hide()
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

function CargarDatosAControles(CodTipoComprobante,fecha_actual){
    var Id_AlmacenMov = $("#Cod_Destino").val()
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Id_AlmacenMov
        })
    }
    fetch(URL + '/almacenes_api/get_almacen_mov_by_id', parametros)
        .then(req => req.json())
        .then(res => { 
            if(res.data.movimientos_almacen.length>0){
                CargarElementos(CodTipoComprobante,res.data.movimientos_almacen[0],fecha_actual)
            }else{
                IniciarElementos(fecha_actual)
            }
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
        });
}

function CargarElementos(CodTipoComprobante,movimientos_almacen,fecha_actual){
    $("#Cod_Operacion").val(movimientos_almacen.Cod_TipoOperacion)
    $("#Serie").val(movimientos_almacen.Serie)
    $("#Numero").val(movimientos_almacen.Numero)
    $("#Fecha").val(movimientos_almacen.Fecha)
    $("#Motivo").val(movimientos_almacen.Motivo)
    $("#Id_ComprobantePago").attr("data-id",movimientos_almacen.Id_ComprobantePago)
    if(movimientos_almacen.Id_ComprobantePago!=0 && movimientos_almacen.Cod_TipoOperacion!="21"){
        $("#optDocRef").attr("checked",true)
        CambioDocRef()
    }else{
        $("#optDocRef").attr("checked",false)
        CambioDocRef()
    }

    if(movimientos_almacen.Flag_Anulado){
        $("#divAnulado").show()
    }else{
        $("#divAnulado").hide()
    }

    var Id_AlmacenMov = movimientos_almacen.Id_AlmacenMov
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Id_AlmacenMov
        })
    }
    fetch(URL + '/almacenes_api/get_almacen_mov_detalle_by_id', parametros)
        .then(req => req.json())
        .then(res => { 
            LlenarDetallesMovAlmacen(CodTipoComprobante,res.data.movimientos_detalle_almacen,fecha_actual)
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
        });
}

function IniciarElementos(fecha_actual){
    $("#Numero").val("")
    $("#Fecha").val(fecha_actual)
    $("#Motivo").val("")
    $("#divAnulado").hide()
    $("#Id_ComprobantePago").attr("data-id",0)
    // falta nudIdComprobantePago.Tag = 0;
}

function RecuperarProductos(CodTipoComprobante,fecha_actual){
    run_waitMe($('#divTablaProductos'), 1, "ios");
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
            LlenarProductos(res.data.productos,CodTipoComprobante,fecha_actual)
            $('#divTablaProductos').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#divTablaProductos').waitMe('hide');
        });
}

function AceptarRegistroEntradaSalida(CodTipoComprobante,fecha_actual){
    var flagMensaje = false
    if($("#divDestino").css("display")=="block" && $("#Cod_Destino").val()!=null && $("#Cod_Destino").val().trim()!="21"){
        flagMensaje = true
    }else{
        flagMensaje = false
    }
    
    var el = yo`<div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h4 class="modal-title"><strong>Confirmacion</strong></h4>
                </div>
                <div class="modal-body">
                    <p>${flagMensaje?"Esta seguro que desea recepcionar este movimiento?":"Esta Seguro que desea guardar este movimiento?"}</p>
                </div>
                <div class="modal-footer text-center"> 
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="${()=>AceptarRegistro(CodTipoComprobante,fecha_actual)}">Aceptar</button>
                </div>
            </div>
        </div>`
    var modal_alerta = document.getElementById('modal-superior');
    empty(modal_alerta).appendChild(el);
    $('#modal-superior').modal()   
    
}

function RechazarEnvio(){ 
    
} 


function AceptarRegistro(CodTipoComprobante,fecha_actual){
    if($("#divDestino").css("display")=="block" && $("#Cod_Destino").val()!=null && $("#Cod_Destino").val().trim()=="21"){
        run_waitMe($('#modal-superior'), 1, "ios","Realizando operacion..."); 

        $("#Cod_Operacion").val(movimientos_almacen.Cod_TipoOperacion)
        $("#Serie").val(movimientos_almacen.Serie)
        $("#Numero").val(movimientos_almacen.Numero)
        $("#Fecha").val(movimientos_almacen.Fecha)
        $("#Motivo").val(movimientos_almacen.Motivo)
        $("#Id_ComprobantePago").attr("data-id",movimientos_almacen.Id_ComprobantePago)


        var Motivo = $("#Motivo").val()
        var Fecha = fecha_actual


    }else{
        if(EsValido()){
            run_waitMe($('#modal-superior'), 1, "ios","Realizando operacion..."); 
            var Cod_Almacen = $("#Cod_Almacen").val()
            var Cod_TipoOperacion = $("#Cod_Operacion").val()
            var Cod_TipoComprobante = CodTipoComprobante//$("#Id_ComprobantePago").attr("data-id")
            var Fecha = fecha_actual
            var Serie = $("#Serie").val()
            var Numero = $("#Numero").val()
            var Motivo = $("#Motivo").val()
            var Id_ComprobantePago = $("#Id_ComprobantePago").attr("data-id")
            var Flag_Anulado = 0
            if($("#divAnulado").css("display")=="display"){
                Flag_Anulado = 1
            }
            var Obs_AlmacenMov = null
            var dataForm = $("#formTablaMovAlmacen").serializeArray()

            // destino
            var Cod_Destino = $("#Cod_Destino").val()


            const parametros = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    Cod_Almacen,
                    Cod_TipoOperacion,
                    Cod_TipoComprobante, 
                    Serie,
                    Numero,
                    Motivo,
                    Id_ComprobantePago,
                    Flag_Anulado,
                    Obs_AlmacenMov, 
                    dataForm,
                    Fecha,
                    Cod_Destino,
                })
            }

            //console.log(parametros)
            fetch(URL + '/almacenes_api/guardar_mov_almacen', parametros)
                .then(req => req.json())
                .then(res => {
                    console.log(res)
                    if(res.respuesta=="ok"){

                        const parametros = {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            credentials: 'same-origin',
                            body: JSON.stringify({
                            })
                        }

                        fetch(URL + '/productos_serv_api/update_producto_stock', parametros)
                        .then(req => req.json())
                        .then(res => {
                            toastr.success('Se guardo correctamente el registro','Confirmacion',{timeOut: 5000})
                            refrescar_movimientos()
                        }).catch(function (e) {
                            console.log(e);
                            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                        });
                    }else{
                        toastr.error('Ocurrio un error. Intentelo mas tarde','Error',{timeOut: 5000})
                    }
                    $('#modal-proceso').modal('hide')  
                    $('#modal-superior').modal('hide') 
                    $('#modal-superior').waitMe('hide');
                }).catch(function (e) {
                    console.log(e);
                    toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                    $('#modal-superior').waitMe('hide');
                });

        }
    }
}

function EsValido(){
    if($("#Cod_Almacen").val().trim()!=""){
        if($("#Cod_Operacion").val().trim()!=""){
            if($("#Motivo").val().trim()!=""){
                return true
            }else{
                toastr.error('Debe de ingresar un Motivo para el Movimiento de Almacen.','Error',{timeOut: 5000})
            }
        }else{
            toastr.error('Debe de Selecionar un Tipo de Operacion.','Error',{timeOut: 5000}) 
            $("#Cod_Operacion").focus()
        }
    }else{
        toastr.error('Debe de Selecionar un Almacen.','Error',{timeOut: 5000}) 
        $("#Cod_Almacen").focus()
    }
     
    return false
}


function AsignarSeries(idFila,fecha_actual,CodTipoComprobante){
    idFilaSeleccionadaSerie = idFila
    var Cod_Almacen = $("#Cod_Almacen").val()
    var Id_Producto =$("#"+idFila).find("td.Id_Producto").find("input").val()
    var Cantidad = parseFloat($("#"+idFila).find("td.Cantidad").find("input").val())
    var Series = JSON.parse($("#"+idFila).find("td.Series").find("input").val())
    var NroDias = CodTipoComprobante=="NE"?30:0
    var Stock = CodTipoComprobante=="NE"?0:1
    if(Id_Producto!=null && Id_Producto!="")
        AsignarSeriesModal(Cod_Almacen, Id_Producto,Cantidad,NroDias,Series,fecha_actual,Stock)
}

function EntradasSalidas(Cod_TipoComprobante) {
    run_waitMe($('#main-contenido'), 1, "ios");
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
                    //console.log(variables)
                    var data_empresa = res.empresa
                    variables['empresa'] = data_empresa 
                    VerEntradasSalidas(variables,Cod_TipoComprobante,fecha_format)
                    $('#main-contenido').waitMe('hide');
        
                }).catch(function (e) {
                    console.log(e);
                    toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                    $('#main-contenido').waitMe('hide');
                });
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
}

export { EntradasSalidas }