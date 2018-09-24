var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../../constantes_entorno/constantes'
import {BloquearControles,LimpiarEventoModales} from '../../../../utility/tools'
import { BuscarProducto } from '../../modales'
import { BuscarComprobantePago } from '../../modales/comprobante_pago'
import { AsignarSeriesModal } from '../../modales/series'
import { refrescar_movimientos } from '../../movimientos_caja'

var arrayValidacion = [null,'null','',undefined]
var cantidad_tabs = 0
global.variablesES = {}

//var contador = 0
//var idFilaSeleccionada = 0
//var idFilaSeleccionadaSerie = 0
//var arrayValidacion = [null,'null','',undefined]

function VerEntradasSalidas(variables,CodTipoComprobante,fecha_actual) {
    global.arraySeries = ''
    global.objProducto = ''
    global.objComprobantePago = '' 
    global.objComprobantePagoDetalle = '' 

    cantidad_tabs++
    const idTabES = "ES_"+cantidad_tabs
    global.variablesES[idTabES]={idTab:idTabES,contador:0,idFilaSeleccionada:0,idFilaSeleccionadaSerie:0}

    var tab = yo`
    <li class="" ><a href="#tab_${idTabES}" data-toggle="tab" aria-expanded="false" id="id_${idTabES}">${CodTipoComprobante=="NE"?"NOTA DE ENTRADA":"NOTA DE SALIDA - GUIA DE REMISION"} <a style="padding-left: 10px;"  onclick=${()=>CerrarTabES(idTabES)} class="btn"><i class="fa fa-close text-danger"></i></a></a></li>`

    var el = yo`
    <div class="tab-pane" id="tab_${idTabES}">
        <div class="panel">
            <div class="panel-body">
                <div class="modal fade" id="modal_observaciones_${idTabES}">
                    <div class="modal-dialog modal-sm" > 
                        <div class="modal-content" id="modal_obs_body_${idTabES}"></div>
                    </div> 
                </div>
                <div class="row">
                    <div class="alert alert-callout alert-danger hidden" id="modal_error_ingreso_${idTabES}">
                        <p>Es necesario llenar todos los campos requeridos y el Importe mayor a cero</p>
                    </div>
                </div>
                <div class="row" id="divAnulado_${idTabES}" style="display:none">
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
                                            <select id="Cod_Almacen_${idTabES}" class="form-control input-sm required">
                                                ${variables.dataAlmacen.map(e => yo`<option value="${e.Cod_Almacen}">${e.Des_Almacen}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row" id="divOperacion_${idTabES}">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label>Operacion</label>
                                            <select id="Cod_Operacion_${idTabES}" class="form-control input-sm required" onchange=${()=>CambioOperacion(CodTipoComprobante,idTabES)}>
                                                ${variables.dataTiposOperaciones.map(e => yo`<option value="${e.Cod_TipoOperacion}">${e.Nom_TipoOperacion}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row" id="divDestino_${idTabES}">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label id="laCod_Destino_${idTabES}">Destino</label>
                                            <select id="Cod_Destino_${idTabES}" class="form-control input-sm required" onchange=${()=>CambioDestino(CodTipoComprobante,fecha_actual,idTabES)}>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label> Motivo : </label>
                                            <input type="text" id="Motivo_${idTabES}" class="form-control input-sm required">
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
                                    <div class="col-md-5" id="divSerie_${idTabES}">
                                        <div class="form-group">
 
                                            <select class="form-control input-sm" id="Serie_${idTabES}">
                                                ${variables.dataComprobante.map(e => yo`<option value="${e.Serie}">${e.Serie}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-7" id="divNumero_${idTabES}">
                                        <div class="form-group">
                                            <input type="text" class="form-control input-sm required" value="00000000${variables.dataMov[0]['']}" id="Numero_${idTabES}" onkeypress=${()=>BloquearControles(event)}>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                            <div class="panel-footer">
                                <div class="row">
                                    <div class="col-md-12">  
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <b>Fecha: </b>
                                                <input type="date" class="form-control input-sm" id="Fecha_${idTabES}" value="${fecha_actual}">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-4" id="divDocRef_${idTabES}">
                                        <div class="checkbox checkbox-inline checkbox-styled">
                                            <label> 
                                                <input type="checkbox" id="optDocRef_${idTabES}" onchange=${()=>CambioDocRef(idTabES)}><span> Doc Ref?</span> 
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col-md-8" style="display:none" id="divId_ComprobantePago_${idTabES}">
                                        <div class="input-group">
                                            <input type="text" id="Id_ComprobantePago_${idTabES}" data-id=0 class="form-control required" disabled>
                                            <div class="input-group-btn">
                                                <button type="button" data-toggle="modal" id="BuscarId_ComprobantePago_${idTabES}" class="btn btn-success" onclick=${()=>BuscarComprobantePago(CodTipoComprobante)}>
                                                    <i class="fa fa-search"></i>
                                                </button>
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
                                            <button class="btn btn-sm btn-info btn-block" onclick=${()=>RecuperarProductos(CodTipoComprobante,fecha_actual,idTabES)}>Recuperar Productos</button>
                                        </div>
                                        <!--<div class="col-md-4">
                                            <button class="btn btn-sm btn-danger btn-block">Agregar por serie</button>
                                        </div>-->
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="panel-body">
                            <form id="formTablaMovAlmacen_${idTabES}">
                                <div class="row">
                                    <div class="col-md-12"> 
                                        <button type="button" class="btn btn-success btn-sm" onclick="${()=>AgregarFilaTabla(CodTipoComprobante,fecha_actual,idTabES)}"><i class="fa fa-plus"></i> Agregar Item</button>
                                    </div>
                                </div>
                                <div class="table-responsive" id="divTablaProductos_${idTabES}">
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
                                        <tbody id="tablaBody_${idTabES}">
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
                <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Cancelar</button>
                <div class="input-group" style="float:right">
                    <button class="btn btn-danger" style="display:none" id="divRechazar_${idTabES}" onclick=${()=>RechazarEnvio(idTabES)}>Rechazar Envio</button>
                    <button class="btn btn-primary" id="btnAceptar_${idTabES}" onclick="${()=>AceptarRegistroEntradaSalida(CodTipoComprobante,fecha_actual,idTabES)}">Aceptar</button> 
                </div> 
            </div>
        </div>
    </div>`
    //var ingreso = document.getElementById('modal-proceso')
    //empty(ingreso).appendChild(el)
    //$('#modal-proceso').modal()
    $("#tabs").append(tab)
    $("#tabs_contents").append(el)
    $("#id_"+idTabES).click()

    $('#modal-superior').on('hidden.bs.modal', function () {
        if(global.objProducto!='' && global.objProducto){
            $("tr#"+global.variablesES[idTabES].idFilaSeleccionada).find('td.Id_Producto').find('input').val(global.objProducto.Id_Producto)
            $("tr#"+global.variablesES[idTabES].idFilaSeleccionada).find('td.Cod_Producto').find('input').attr("data-id",global.objProducto.Id_Producto)
            $("tr#"+global.variablesES[idTabES].idFilaSeleccionada).find('td.Cod_Producto').find('input').val(global.objProducto.Cod_Producto)
            $("tr#"+global.variablesES[idTabES].idFilaSeleccionada).find('td.Nom_Producto').find('input').val(global.objProducto.Nom_Producto)
            $("tr#"+global.variablesES[idTabES].idFilaSeleccionada).find('td.Unidad_Medida').attr("data-id",global.objProducto.Cod_UnidadMedida)
            $("tr#"+global.variablesES[idTabES].idFilaSeleccionada).find('td.Cod_UnidadMedida').find('input').val(global.objProducto.Cod_UnidadMedida)
            $("tr#"+global.variablesES[idTabES].idFilaSeleccionada).find('td.Unidad_Medida').text(global.objProducto.Nom_UnidadMedida)
            if(global.objProducto.Precio_Venta!=null)
                $("tr#"+global.variablesES[idTabES].idFilaSeleccionada).find('td.Precio_Venta').find('input').val(global.objProducto.Precio_Venta)
            else
                $("tr#"+global.variablesES[idTabES].idFilaSeleccionada).find('td.Precio_Venta').find('input').val(0)
            $("tr#"+global.variablesES[idTabES].idFilaSeleccionada).find('td.Cantidad').find('input').val(1)
        }

        if(global.objComprobantePago!='' && global.objComprobantePago && global.objComprobantePagoDetalle!='' && global.objComprobantePagoDetalle){
            $("#Id_ComprobantePago_"+idTabES).attr("data-id",global.objComprobantePago.id_ComprobantePago)
            $("#Id_ComprobantePago_"+idTabES).val(global.objComprobantePagoDetalle.DocCliente+" "+global.objComprobantePagoDetalle.Cod_TipoComprobante+" "+global.objComprobantePagoDetalle.Serie+" "+global.objComprobantePagoDetalle.Numero)
        }
    })

    $('#modal-otros-procesos').on('hidden.bs.modal', function () { 
        if(global.arraySeries!='' && global.arraySeries){ 
            $("tr#"+global.variablesES[idTabES].idFilaSeleccionadaSerie).find('td.Series').find('input').val(JSON.stringify(global.arraySeries))
        }
    })

    CambioOperacion(CodTipoComprobante,idTabES)
    CambioDestino(CodTipoComprobante,fecha_actual,idTabES)
    console.log(global.variablesES)
}


function RefrescarVerEntradasSalidas(variables,CodTipoComprobante,fecha_actual,idTabES) {
    global.arraySeries = ''
    global.objProducto = ''
    global.objComprobantePago = '' 
    global.objComprobantePagoDetalle = '' 
    global.variablesES[idTabES]={idTab:idTabES,contador:0,idFilaSeleccionada:0,idFilaSeleccionadaSerie:0}
 
    var el = yo` 
        <div class="panel">
            <div class="panel-body">
                <div class="modal fade" id="modal_observaciones_${idTabES}">
                    <div class="modal-dialog modal-sm" > 
                        <div class="modal-content" id="modal_obs_body_${idTabES}"></div>
                    </div> 
                </div>
                <div class="row">
                    <div class="alert alert-callout alert-danger hidden" id="modal_error_ingreso_${idTabES}">
                        <p>Es necesario llenar todos los campos requeridos y el Importe mayor a cero</p>
                    </div>
                </div>
                <div class="row" id="divAnulado_${idTabES}" style="display:none">
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
                                            <select id="Cod_Almacen_${idTabES}" class="form-control input-sm required">
                                                ${variables.dataAlmacen.map(e => yo`<option value="${e.Cod_Almacen}">${e.Des_Almacen}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row" id="divOperacion_${idTabES}">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label>Operacion</label>
                                            <select id="Cod_Operacion_${idTabES}" class="form-control input-sm required" onchange=${()=>CambioOperacion(CodTipoComprobante,idTabES)}>
                                                ${variables.dataTiposOperaciones.map(e => yo`<option value="${e.Cod_TipoOperacion}">${e.Nom_TipoOperacion}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row" id="divDestino_${idTabES}">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label id="laCod_Destino_${idTabES}">Destino</label>
                                            <select id="Cod_Destino_${idTabES}" class="form-control input-sm required" onchange=${()=>CambioDestino(CodTipoComprobante,fecha_actual,idTabES)}>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label> Motivo : </label>
                                            <input type="text" id="Motivo_${idTabES}" class="form-control input-sm required">
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
                                    <div class="col-md-5" id="divSerie_${idTabES}">
                                        <div class="form-group">
 
                                            <select class="form-control input-sm" id="Serie_${idTabES}">
                                                ${variables.dataComprobante.map(e => yo`<option value="${e.Serie}">${e.Serie}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-7" id="divNumero_${idTabES}">
                                        <div class="form-group">
                                            <input type="text" class="form-control input-sm required" value="00000000${variables.dataMov[0]['']}" id="Numero_${idTabES}" onkeypress=${()=>BloquearControles(event)}>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                            <div class="panel-footer">
                                <div class="row">
                                    <div class="col-md-12">  
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <b>Fecha: </b>
                                                <input type="date" class="form-control input-sm" id="Fecha_${idTabES}" value="${fecha_actual}">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-4" id="divDocRef_${idTabES}">
                                        <div class="checkbox checkbox-inline checkbox-styled">
                                            <label> 
                                                <input type="checkbox" id="optDocRef_${idTabES}" onchange=${()=>CambioDocRef(idTabES)}><span> Doc Ref?</span> 
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col-md-8" style="display:none" id="divId_ComprobantePago_${idTabES}">
                                        <div class="input-group">
                                            <input type="text" id="Id_ComprobantePago_${idTabES}" data-id=0 class="form-control required" disabled>
                                            <div class="input-group-btn">
                                                <button type="button" data-toggle="modal" id="BuscarId_ComprobantePago_${idTabES}" class="btn btn-success" onclick=${()=>BuscarComprobantePago(CodTipoComprobante)}>
                                                    <i class="fa fa-search"></i>
                                                </button>
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
                                            <button class="btn btn-sm btn-info btn-block" onclick=${()=>RecuperarProductos(CodTipoComprobante,fecha_actual,idTabES)}>Recuperar Productos</button>
                                        </div>
                                        <!--<div class="col-md-4">
                                            <button class="btn btn-sm btn-danger btn-block">Agregar por serie</button>
                                        </div>-->
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="panel-body">
                            <form id="formTablaMovAlmacen_${idTabES}">
                                <div class="row">
                                    <div class="col-md-12"> 
                                        <button type="button" class="btn btn-success btn-sm" onclick="${()=>AgregarFilaTabla(CodTipoComprobante,fecha_actual,idTabES)}"><i class="fa fa-plus"></i> Agregar Item</button>
                                    </div>
                                </div>
                                <div class="table-responsive" id="divTablaProductos_${idTabES}">
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
                                        <tbody id="tablaBody_${idTabES}">
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
                <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Cancelar</button>
                <div class="input-group" style="float:right">
                    <button class="btn btn-danger" style="display:none" id="divRechazar_${idTabES}" onclick=${()=>RechazarEnvio(idTabES)}>Rechazar Envio</button>
                    <button class="btn btn-primary" id="btnAceptar_${idTabES}" onclick="${()=>AceptarRegistroEntradaSalida(CodTipoComprobante,fecha_actual,idTabES)}">Aceptar</button> 
                </div> 
            </div>
        </div>`
  
    $('#tab_'+idTabES).html(el)

    $('#modal-superior').on('hidden.bs.modal', function () {
        if(global.objProducto!='' && global.objProducto){
            $("tr#"+global.variablesES[idTabES].idFilaSeleccionada).find('td.Id_Producto').find('input').val(global.objProducto.Id_Producto)
            $("tr#"+global.variablesES[idTabES].idFilaSeleccionada).find('td.Cod_Producto').find('input').attr("data-id",global.objProducto.Id_Producto)
            $("tr#"+global.variablesES[idTabES].idFilaSeleccionada).find('td.Cod_Producto').find('input').val(global.objProducto.Cod_Producto)
            $("tr#"+global.variablesES[idTabES].idFilaSeleccionada).find('td.Nom_Producto').find('input').val(global.objProducto.Nom_Producto)
            $("tr#"+global.variablesES[idTabES].idFilaSeleccionada).find('td.Unidad_Medida').attr("data-id",global.objProducto.Cod_UnidadMedida)
            $("tr#"+global.variablesES[idTabES].idFilaSeleccionada).find('td.Cod_UnidadMedida').find('input').val(global.objProducto.Cod_UnidadMedida)
            $("tr#"+global.variablesES[idTabES].idFilaSeleccionada).find('td.Unidad_Medida').text(global.objProducto.Nom_UnidadMedida)
            if(global.objProducto.Precio_Venta!=null)
                $("tr#"+global.variablesES[idTabES].idFilaSeleccionada).find('td.Precio_Venta').find('input').val(global.objProducto.Precio_Venta)
            else
                $("tr#"+global.variablesES[idTabES].idFilaSeleccionada).find('td.Precio_Venta').find('input').val(0)
            $("tr#"+global.variablesES[idTabES].idFilaSeleccionada).find('td.Cantidad').find('input').val(1)
        }

        if(global.objComprobantePago!='' && global.objComprobantePago && global.objComprobantePagoDetalle!='' && global.objComprobantePagoDetalle){
            $("#Id_ComprobantePago_"+idTabES).attr("data-id",global.objComprobantePago.id_ComprobantePago)
            $("#Id_ComprobantePago_"+idTabES).val(global.objComprobantePagoDetalle.DocCliente+" "+global.objComprobantePagoDetalle.Cod_TipoComprobante+" "+global.objComprobantePagoDetalle.Serie+" "+global.objComprobantePagoDetalle.Numero)
        }
    })

    $('#modal-otros-procesos').on('hidden.bs.modal', function () { 
        if(global.arraySeries!='' && global.arraySeries){ 
            $("tr#"+global.variablesES[idTabES].idFilaSeleccionadaSerie).find('td.Series').find('input').val(JSON.stringify(global.arraySeries))
        }
    })

    CambioOperacion(CodTipoComprobante,idTabES)
    CambioDestino(CodTipoComprobante,fecha_actual,idTabES)
}

function AgregarFilaTabla(CodTipoComprobante,fecha_actual,idTab){
    const idFila = global.variablesES[idTab].contador
    //var rows = $("#tablaBody > tr").length
    var fila = yo`
    <tr id="${idFila}_${idTab}">
        <td class="Id_Producto hidden"><input class="form-control" type="text" value="" name="Id_Producto"></td>
        <td class="Item hidden"><input class="form-control" type="text" value="${$("#tablaBody_"+idTab+" > tr").length}" name="Item"></td>
        <td class="Cod_Producto"><input data-id=null class="form-control" type="text" value="" name="Cod_Producto"></td>
        <td class="Nom_Producto"><input class="form-control" type="text" value=""  onblur=${()=>BuscarProductoES(CodTipoComprobante,idFila,idTab)} name="Nom_Producto"></td>
        <td class="Cantidad"><input class="form-control" type="number" value="" name="Cantidad"></td>
        <td class="Cod_UnidadMedida hidden"><input class="form-control" value=null name="Cod_UnidadMedida"></td>
        <td class="Precio_Venta"><input class="form-control" type="number" value="" name="Precio_Venta"></td>
        <td class="Unidad_Medida" data-id=null ></td>
        <td class="Observaciones"><input class="form-control" type="text" value="" name="Observaciones"></td>
        <td class="Series hidden"><input class="form-control" type="text" value=${JSON.stringify([])} name="Series"></td>
        <td>
            <div style="display:flex;">
                <button type="button" onclick="${()=>AsignarSeries(idFila,fecha_actual,CodTipoComprobante,idTab)}" class="btn btn-primary btn-sm"><i class="fa fa-tasks"></i></a>  
                <button type="button" onclick="${()=>EliminarFila(idFila,idTab)}" class="btn btn-danger btn-sm"><i class="fa fa-trash"></i></button>
            </div>
        </td>
    </tr>`
    global.variablesES[idTab].contador=global.variablesES[idTab].contador+1
    $("#tablaBody_"+idTab).append(fila)
}

function LlenarProductos(productos,CodTipoComprobante,fecha_actual,idTab){
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
            <tbody id="tablaBody_${idTab}">  
            ${productos.map(u => 
                    yo`
                    <tr id="${u.Id_Producto}_${idTab}">
                        <td class="Id_Producto hidden"><input class="form-control" type="text" value="${u.Id_Producto}" name="Id_Producto"></td>
                        <td class="Item hidden"><input class="form-control" type="text" value="${i++}" name="Item"></td>
                        <td class="Cod_Producto"><input data-id="${u.Id_Producto}" class="form-control" name="Cod_Producto" type="text" value="${u.Cod_Producto}"></td>
                        <td class="Nom_Producto"><input class="form-control" type="text" value="${u.Nom_Producto}" name="Nom_Producto" onblur=${()=>BuscarProductoES(CodTipoComprobante,u.Id_Producto,idTab)}></td>
                        <td class="Cantidad"><input class="form-control" type="number" value="1" name="Cantidad"></td>
                        <td class="Cod_UnidadMedida hidden"><input class="form-control" value="${u.Cod_UnidadMedida}" name="Cod_UnidadMedida"></td>
                        <td class="Precio_Venta"><input class="form-control" type="number" name="Precio_Venta" value="${u.Precio_Venta}"></td>
                        <td class="Unidad_Medida" name="Unidad_Medida" data-id="${u.Cod_UnidadMedida}">${u.Nom_UnidadMedida}</td>
                        <td class="Observaciones"><input class="form-control" type="text" value="" name="Observaciones"></td>
                        <td class="Series hidden"><input class="form-control" type="text" value=${JSON.stringify([])} name="Series"></td>
                        <td>
                            <div style="display:flex;">
                                <button type="button" onclick="${()=>AsignarSeries(u.Id_Producto,fecha_actual,CodTipoComprobante,idTab)}" class="btn btn-primary btn-sm"><i class="fa fa-tasks"></i></a>  
                                <button type="button" onclick="${()=>EliminarFila(u.Id_Producto,idTab)}" class="btn btn-danger btn-sm"><i class="fa fa-trash"></i></button>
                            </div>
                        </td>
                    </tr>`
                )}
                </tbody>
        </table>`
    //$("#tablaBody").html()
    //$("#tablaBody").append(el)
    var tabla = document.getElementById('divTablaProductos_'+idTab)
    empty(tabla).appendChild(el)
}


function LlenarDetallesMovAlmacen(CodTipoComprobante,productos,fecha_actual,idTab){
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
        <tbody id="tablaBody_${idTab}">
            ${productos.map(u => 
                    yo`
                    <tr id="${u.Id_Producto}_${idTab}">
                        <td class="Id_Producto hidden"><input class="form-control" type="text" value="${u.Id_Producto}" name="Id_Producto"></td>
                        <td class="Item hidden"><input class="form-control" type="text" value="${u.Item}" name="Item"></td>
                        <td class="Cod_Producto"><input data-id="${u.Id_Producto}" class="form-control" type="text" value="${u.Cod_Producto}" name="Cod_Producto"></td>
                        <td class="Nom_Producto"><input class="form-control" type="text" value="${u.Des_Producto}"  onblur=${()=>BuscarProductoES(CodTipoComprobante,u.Id_Producto,idTab)}></td>
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
                                <li><a href="javascript:void(0)" onclick="${()=>AsignarSeries(u.Id_Producto,fecha_actual,CodTipoComprobante,idTab)}">Asignar Serie</a></li>
                                <li><a href="javascript:void(0)" onclick="${()=>EliminarFila(u.Id_Producto,idTab)}"><i class="fa fa-close"></i> Eliminar</a></li>
                                </ul>
                            </div> 
                        </td>
                    </tr>`
                )}
        </tbody>
    </table>`
    var tabla = document.getElementById('divTablaProductos_'+idTab)
    empty(tabla).appendChild(el)

}

function LlenarAlmacenesDestinos(almacenes,idTab){
    var el = yo`
        ${almacenes.map(e => yo`
             <option value="${e.Cod_Almacen}">${e.Des_Almacen}</option>
        `)}`   
    $("#Cod_Destino_"+idTab).html('')
    $("#Cod_Destino_"+idTab).html(el)
    $("#divDocRef_"+idTab).show()
}

function LlenarPendientesRecepcionar(pendientes,idTab){
    var el = yo`
        ${pendientes.map(e => yo`
             <option value="${e.Id_AlmacenMov}">${e.Motivo}</option>
        `)}`   
    $("#Cod_Destino_"+idTab).html('')
    $("#Cod_Destino_"+idTab).html(el)
    $("#divDocRef_"+idTab).show()
}


function CambioDestino(CodTipoComprobante,fecha_actual,idTab){
    if($("#Cod_Operacion_"+idTab).val()=="21"){
        if($("#Cod_Destino_"+idTab).val()!=null){
            CargarDatosAControles(CodTipoComprobante,fecha_actual,idTab)
            $("#btnAceptar_"+idTab).text("Recepcionar")
            $("#divRechazar_"+idTab).css("display","inline-block")
            // falta  buConsultarSeries.Visible = true;
        }else{
            $("#btnAceptar_"+idTab).text("Aceptar")
            $("#divRechazar_"+idTab).css("display","none")
            // falta buConsultarSeries.Visible = true;

        }
    }else{
        $("#btnAceptar_"+idTab).text("Aceptar")
        $("#divRechazar_"+idTab).css("display","inline-block")
    }
}

function CerrarTabES(idTab){ 
    $('#tab_'+idTab).remove()
    $('#id_'+idTab).parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show');
    delete global.variablesES[idTab]
}

function CambioOperacion(CodTipoComprobante,idTab){
    if(!arrayValidacion.includes($("#Cod_Almacen_"+idTab).val())){
        $("#divDestino_"+idTab).hide()
        //$("#divRechazar").css("display","inline-block")
        $("#divDocRef_"+idTab).show()
        var Cod_Almacen = $("#Cod_Almacen_"+idTab).val()
        if($("#Cod_Operacion_"+idTab).val()=="11"){
            $("#laCod_Destino_"+idTab).text("Destino:")
            $("#divDestino_"+idTab).show()
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
                    LlenarAlmacenesDestinos(res.data.almacenes,idTab)
        
                }).catch(function (e) {
                    console.log(e);
                    toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                });
                
        }else{
            if($("#Cod_Operacion_"+idTab).val()=="21"){
                $("#laCod_Destino_"+idTab).text("Pendientes:")
                $("#divDestino_"+idTab).show()
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
                        LlenarPendientesRecepcionar(res.data.pendientes,idTab)
            
                    }).catch(function (e) {
                        console.log(e);
                        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                    });
                
            }
        }
    }
}

function CambioDocRef(idTab){
    if($("#optDocRef_"+idTab).is(":checked")){
        $("#divId_ComprobantePago_"+idTab).show()
    }else{
        $("#divId_ComprobantePago_"+idTab).hide()
    }
}

function EliminarFila(idFila,idTab){
    $("#"+idFila+"_"+idTab).remove()
}

function BuscarProductoES(CodTipoComprobante,idFila,idTab) {
    if($("tr#"+idFila+"_"+idTab).find('td.Cod_Producto').find('input').val().trim()=="")
        if ($("tr#"+idFila+"_"+idTab).find('td.Nom_Producto').find('input').val().trim()!=""){
            global.variablesES[idTab].idFilaSeleccionada = idFila+"_"+idTab
            BuscarProducto(CodTipoComprobante=="NS",$("tr#"+idFila+"_"+idTab).find('td.Nom_Producto').find('input').val())
        }
}

function CargarDatosAControles(CodTipoComprobante,fecha_actual,idTab){
    var Id_AlmacenMov = $("#Cod_Destino_"+idTab).val()
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
                CargarElementos(CodTipoComprobante,res.data.movimientos_almacen[0],fecha_actual,idTab)
            }else{
                IniciarElementos(fecha_actual,idTab)
            }
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
        });
}

function CargarElementos(CodTipoComprobante,movimientos_almacen,fecha_actual,idTab){
    $("#Cod_Operacion_"+idTab).val(movimientos_almacen.Cod_TipoOperacion)
    $("#Serie_"+idTab).val(movimientos_almacen.Serie)
    $("#Numero_"+idTab).val(movimientos_almacen.Numero)
    $("#Fecha_"+idTab).val(movimientos_almacen.Fecha)
    $("#Motivo_"+idTab).val(movimientos_almacen.Motivo)
    $("#Id_ComprobantePago_"+idTab).attr("data-id",movimientos_almacen.Id_ComprobantePago)
    if(movimientos_almacen.Id_ComprobantePago!=0 && movimientos_almacen.Cod_TipoOperacion!="21"){
        $("#optDocRef_"+idTab).attr("checked",true)
        CambioDocRef()
    }else{
        $("#optDocRef_"+idTab).attr("checked",false)
        CambioDocRef()
    }

    if(movimientos_almacen.Flag_Anulado){
        $("#divAnulado_"+idTab).show()
    }else{
        $("#divAnulado_"+idTab).hide()
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
            LlenarDetallesMovAlmacen(CodTipoComprobante,res.data.movimientos_detalle_almacen,fecha_actual,idTab)
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
        });
}

function IniciarElementos(fecha_actual,idTab){
    $("#Numero_"+idTab).val("")
    $("#Fecha_"+idTab).val(fecha_actual)
    $("#Motivo_"+idTab).val("")
    $("#divAnulado_"+idTab).hide()
    $("#Id_ComprobantePago_"+idTab).attr("data-id",0)
    // falta nudIdComprobantePago.Tag = 0;
}

function RecuperarProductos(CodTipoComprobante,fecha_actual,idTab){
    run_waitMe($('#divTablaProductos_'+idTab), 1, "ios");
    var Cod_Almacen = $("#Cod_Almacen_"+idTab).val()
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
            LlenarProductos(res.data.productos,CodTipoComprobante,fecha_actual,idTab)
            $('#divTablaProductos_'+idTab).waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#divTablaProductos_'+idTab).waitMe('hide');
        });
}

function AceptarRegistroEntradaSalida(CodTipoComprobante,fecha_actual,idTab){
    var flagMensaje = false
    if($("#divDestino_"+idTab).css("display")=="block" && $("#Cod_Destino_"+idTab).val()!=null && $("#Cod_Destino_"+idTab).val().trim()!="21"){
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
                    <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="${()=>AceptarRegistro(CodTipoComprobante,fecha_actual,idTab)}">Aceptar</button>
                </div>
            </div>
        </div>`
    var modal_alerta = document.getElementById('modal-superior');
    empty(modal_alerta).appendChild(el);
    $('#modal-superior').modal()   
    
}

function RechazarEnvio(idTab){ 
    var el = yo`<div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h4 class="modal-title"><strong>Confirmacion</strong></h4>
                </div>
                <div class="modal-body">
                    <p>Esta Seguro que desea RECHAZAR este Envio?</p>
                </div>
                <div class="modal-footer text-center"> 
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="${()=>ConfirmarRechazoEnvio(idTab)}">Aceptar</button>
                </div>
            </div>
        </div>`
    var modal_alerta = document.getElementById('modal-superior');
    empty(modal_alerta).appendChild(el);
    $('#modal-superior').modal()   
} 


function ConfirmarRechazoEnvio(){

}

function AceptarRegistro(CodTipoComprobante,fecha_actual,idTab){
    if($("#divDestino_"+idTab).css("display")=="block" && $("#Cod_Destino_"+idTab).val()!=null && $("#Cod_Destino_"+idTab).val().trim()=="21"){
        run_waitMe($('#modal-superior'), 1, "ios","Realizando operacion..."); 

        $("#Cod_Operacion_"+idTab).val(movimientos_almacen.Cod_TipoOperacion)
        $("#Serie_"+idTab).val(movimientos_almacen.Serie)
        $("#Numero_"+idTab).val(movimientos_almacen.Numero)
        $("#Fecha_"+idTab).val(movimientos_almacen.Fecha)
        $("#Motivo_"+idTab).val(movimientos_almacen.Motivo)
        $("#Id_ComprobantePago_"+idTab).attr("data-id",movimientos_almacen.Id_ComprobantePago)


        var Motivo = $("#Motivo_"+idTab).val()
        var Fecha = fecha_actual


    }else{
        if(EsValido(idTab)){
            run_waitMe($('#modal-superior'), 1, "ios","Realizando operacion..."); 
            var Cod_Almacen = $("#Cod_Almacen_"+idTab).val()
            var Cod_TipoOperacion = $("#Cod_Operacion_"+idTab).val()
            var Cod_TipoComprobante = CodTipoComprobante//$("#Id_ComprobantePago").attr("data-id")
            var Fecha = fecha_actual
            var Serie = $("#Serie_"+idTab).val()
            var Numero = $("#Numero_"+idTab).val()
            var Motivo = $("#Motivo_"+idTab).val()
            var Id_ComprobantePago = $("#Id_ComprobantePago_"+idTab).attr("data-id")
            var Flag_Anulado = 0
            if($("#divAnulado_"+idTab).css("display")=="display"){
                Flag_Anulado = 1
            }
            var Obs_AlmacenMov = null
            var dataForm = $("#formTablaMovAlmacen_"+idTab).serializeArray()

            // destino
            var Cod_Destino = $("#Cod_Destino_"+idTab).val()


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
                            RefrescarEntradasSalidas(CodTipoComprobante,idTab)
                            //refrescar_movimientos()
                        }).catch(function (e) {
                            console.log(e);
                            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                        });
                    }else{
                        toastr.error('Ocurrio un error. Intentelo mas tarde','Error',{timeOut: 5000})
                    }  
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

function EsValido(idTab){
    if($("#Cod_Almacen_"+idTab).val().trim()!=""){
        if($("#Cod_Operacion_"+idTab).val().trim()!=""){
            if($("#Motivo_"+idTab).val().trim()!=""){
                return true
            }else{
                toastr.error('Debe de ingresar un Motivo para el Movimiento de Almacen.','Error',{timeOut: 5000})
            }
        }else{
            toastr.error('Debe de Selecionar un Tipo de Operacion.','Error',{timeOut: 5000}) 
            $("#Cod_Operacion_"+idTab).focus()
        }
    }else{
        toastr.error('Debe de Selecionar un Almacen.','Error',{timeOut: 5000}) 
        $("#Cod_Almacen_"+idTab).focus()
    }
     
    return false
}


function AsignarSeries(idFila,fecha_actual,CodTipoComprobante,idTab){
    global.variablesES[idTab].idFilaSeleccionadaSerie = idFila+"_"+idTab
    var Cod_Almacen = $("#Cod_Almacen_"+idTab).val()
    var Id_Producto =$("#"+idFila+"_"+idTab).find("td.Id_Producto").find("input").val()
    var Cantidad = parseFloat($("#"+idFila+"_"+idTab).find("td.Cantidad").find("input").val())
    var Series = JSON.parse($("#"+idFila+"_"+idTab).find("td.Series").find("input").val())
    var NroDias = CodTipoComprobante=="NE"?30:0
    var Stock = CodTipoComprobante=="NE"?0:1  
    if(Id_Producto!=null && Id_Producto!="")
        AsignarSeriesModal(Cod_Almacen, Id_Producto,Cantidad,NroDias,Series,fecha_actual,Stock)
}

function RefrescarEntradasSalidas(Cod_TipoComprobante,idTab) {
    LimpiarEventoModales()
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
            if(res.respuesta=='ok'){
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
                        if(res.respuesta=='ok'){
                            var data_empresa = res.empresa
                            variables['empresa'] = data_empresa 
                            RefrescarVerEntradasSalidas(variables,Cod_TipoComprobante,fecha_format,idTab)
                        }else{
                            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+res.detalle_error,'Error',{timeOut: 5000})
                        }
                        $('#main-contenido').waitMe('hide');
            
                    }).catch(function (e) {
                        console.log(e);
                        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                        $('#main-contenido').waitMe('hide');
                    });
            }else{
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+res.detalle_error,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            }
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
}

function EntradasSalidas(Cod_TipoComprobante) {
    LimpiarEventoModales()
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
            if(res.respuesta=='ok'){
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
                        if(res.respuesta=='ok'){
                            var data_empresa = res.empresa
                            variables['empresa'] = data_empresa 
                            VerEntradasSalidas(variables,Cod_TipoComprobante,fecha_format)
                        }else{
                            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+res.detalle_error,'Error',{timeOut: 5000})
                        }
                        $('#main-contenido').waitMe('hide');
            
                    }).catch(function (e) {
                        console.log(e);
                        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                        $('#main-contenido').waitMe('hide');
                    });
            }else{
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+res.detalle_error,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            }

        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
}

export { EntradasSalidas }