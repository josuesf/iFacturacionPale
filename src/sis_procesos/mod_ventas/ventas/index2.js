var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../../constantes_entorno/constantes'
import { NuevoCliente, BuscarCliente, BuscarProducto,Buscar } from '../../modales'
import { BloquearControles,getObjectArrayJsonVentas, changeArrayJsonVentas,changeDetallesArrayJsonVentas, deleteElementArrayJsonVentas,LimpiarVariablesGlobales } from '../../../../utility/tools'
import { ComprobantePago } from '../../mod_compras/comprobante_pago'
import { preparar_impresion_comprobante,preparar_impresion_movimientos } from '../../movimientos_caja'


var cantidad_tabs = 2
var IdTabSeleccionado = null
var arrayValidacion = [null,'null','',undefined]
var flag_cliente = false 

//var Total = 0
//var TotalDescuentos = 0
//var TipodeCambio = 1
//var _CantidadOriginal = null
//var SimboloMoneda = ''
//var SimboloMonedaExtra = ''

global.variablesVentas = []

function VerNuevaVenta(variables,CodLibro) {
    cantidad_tabs++
    flag_cliente = false
    const idTabVenta = cantidad_tabs
    global.objClienteVenta = ''
    global.objProductoVentas = ''
    global.variablesVentas.push({idTab:idTabVenta,Total:0,TotalDescuentos:0,TipodeCambio:1,_CantidadOriginal:null,SimboloMoneda:'',SimboloMonedaExtra:'',Cod_FormaPago:null,Cliente:null,Detalles:[]})
    var tab = yo`<li class="" onclick=${()=>TabVentaSeleccionado(idTabVenta)}><a href="#tab_${idTabVenta}" data-toggle="tab" aria-expanded="false" id="id_${idTabVenta}">Ventas <a style="padding-left: 10px;" onclick=${()=>CerrarTabVenta(idTabVenta)} class="btn"><i class="fa fa-close text-danger"></i></a></a></li>`

    var tabContent = yo`
        <div class="tab-pane" id="tab_${idTabVenta}">
            <p></p>
            <div class="row">
                <div class="col-md-8">
                    <div class="card">
                        <div class="card-head card-head-xs style-primary text-center">
                            <header>Detalles del Comprobante</header>
                        </div>
                        <div class="card-body">
                            <div class="row">
                            
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <div class="input-group">
                                            <div class="input-group-content">
                                                <label>Cliente</label>
                                                <input type="text" class="form-control" id="Cliente">
                                                <div class="form-control-line"></div>
                                            </div>
                                            <div class="input-group-btn" style="padding-top:25px">
                                                <button class="btn btn-flat btn-sm" type="button"><i class="fa fa-search text-success"></i> Buscar</button>
                                                <button class="btn btn-flat btn-sm" type="button"><i class="fa fa-plus text-info"></i> Nuevo</button>
                                                <button class="btn btn-flat btn-sm" type="button"><i class="fa fa-pencil text-warning"></i> Editar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row"> 
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <div class="input-group">
                                            <div class="input-group-content">
                                                <label>Buscar Codigo/Nombres Producto</label>
                                                <input type="text" class="form-control" id="txtBusqueda_${idTabVenta}" onblur=${()=>BuscarProductoCP(event,'blur',idTabVenta)} onkeypress=${()=>BuscarProductoCP(event,'key',idTabVenta)}>
                                                <div class="form-control-line"></div>
                                            </div>
                                            <div class="input-group-btn" style="padding-top:25px">
                                                <button class="btn btn-flat btn-sm" type="button"><i class="fa fa-search text-success"></i> Buscar</button>
                                                <button class="btn btn-flat btn-sm" type="button"><i class="fa fa-plus text-info"></i> Nuevo</button> 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                 
                            </div> 
                            
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="table-responsive">
                                        <table class="table table-hover">
                                            <thead>
                                                <tr> 
                                                    <th>Codigo</th>
                                                    <th>Producto</th>
                                                    <th>Cantidad</th>
                                                    <th>Precio Unitario</th>
                                                    <th>Descuento(%)</th>
                                                    <th>SubTotal</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody id="tablaBodyProductosVentas_${idTabVenta}">
                                            </tbody> 
                                        </table>
                                    </div>
                                </div>
                                                        
                            </div>

                            <div class="row">
                                <div class="col-md-12 text-right">
                                    <div class="btn-group">
                                        <button class="btn btn-default btn-lg btn-raised btn-danger" id="btnDescuentos_${idTabVenta}" style="display:none"><i class="fa fa-arrow-circle-down"></i>TOTAL DESCUENTOS: 0.00</button>
                                        <button class="btn btn-default btn-lg btn-raised btn-primary" id="btnTotal_${idTabVenta}" data-toggle="button" aria-pressed="false" autocomplete="off" ><i class="fa fa-money text-green"></i></button>
                                        <button class="btn btn-default btn-lg btn-raised btn-success" id="btnConversion_${idTabVenta}" style="display:none"><i class="fa fa-refresh text-green"></i></button> 
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card-actionbar" id="divFooter_${idTabVenta}">
                            </div>

                        </div>
                        
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card" id="div-cliente">
                        <div class="card-head card-head-xs style-primary text-center">
                            <header>Datos del Comprobante</header>
                        </div>
                        <div class="card-body">
                            <div class="row text-center">
                                <div class="btn-group">
                                    <a style="margin-right: 10px;" role="button" class="btn ink-reaction btn-xs btn-flat btn-primary"><i class="fa fa-plus"></i> Adicionales</a>
                                    <a style="margin-right: 10px;" role="button" class="btn ink-reaction btn-xs btn-flat btn-primary"><i class="fa fa-file-text-o"></i> Guias de Remision</a>
                                    <a role="button" class="btn ink-reaction btn-xs btn-flat btn-primary">Formas de Pago</a>
                                </div>
                            </div>
                            <br>
                            <div class="row">
                                <div class="col-md-12">                                
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <div class="form-group">
                                                <label>Tipo Documento</label>
                                                <select id="Cod_TipoComprobante" class="form-control">
                                                    <option style="text-transform:uppercase" value="BE">BOLETA ELECTRONICA</option><option style="text-transform:uppercase" value="FE">FACTURA ELECTRONICA</option><option style="text-transform:uppercase" value="NP">Notas de Pedidos</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div> 
                                </div>
                                <div class="col-md-12">
                                    <div class="row">

                                        <div id="divFecha" class="col-sm-4">
                                            <div class="form-group">
                                                <label>Fecha</label>
                                                <input type="date" id="Fecha" value="2018-11-28" class="form-control input-sm">
                                            </div>
                                        </div>

                                        <div id="divSerie" class="col-md-4">
                                            <div class="form-group">
                                                <label>Serie</label>
                                                <select id="Serie" class="form-control input-sm"><option value="B002">B002</option></select>
                                                
                                            </div>
                                        </div>
                                        <div id="divNumero" class="col-md-4">
                                            <div class="form-group">
                                                <label>Numero</label>
                                                <input type="text" id="Numero" class="form-control input-sm required">
                                            </div>
                                        </div>
                                    </div>  
                                </div>
                                <div class="col-md-12">
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>Tipo Operacion</label>
                                                <select id="Cod_Precio_3" class="form-control">
                                                    
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>Moneda</label>
                                                <select id="Cod_Precio_3" class="form-control">
                                                    
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>Tipo de Cambio</label>
                                                <input class="form-control" type="number"> 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-actionbar">

                            <div class="row" style="text-align: left;">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    
    $("#tabs").append(tab)
    $("#tabs_contents").append(tabContent)
    $("#id_"+idTabVenta).click()

    IdTabSeleccionado = idTabVenta 

}

function CrearDivFavoritos(variables,idTab){
    var div = yo` 
                    <div class="row">
                        <div class="col-md-12">
                            <div class="box box-warning">
                                <div class="box-header with-border">
                                    <h3 class="box-title">Productos</h3>
                                    
                                    <div class="box-tools" style="left: 10px;display:none" id="divTools_${idTab}">
                                        <button type="button" class="btn btn-box-tool" onclick=${()=>CrearBotonesCategoriasXSeleccion(variables.categorias,'',idTab)}><i class="fa fa-arrow-left"></i></button>
                                    </div>

                                </div>
                                <div class="box-body" id="divProductos_${idTab}">
                                    ${CrearBotonesCategorias(variables.categorias,idTab)}
                                </div>
                            </div>
                        </div>
                    </div> `
    var divFV = document.getElementById('divFooter_'+idTab);
    empty(divFV).appendChild(div);
}

function CrearDivVuelto(idTab){
    var div = yo` 
                    <div class="row">              
                        <div class="col-md-4 col-md-offset-4">
                            <div class="box box-success">
                                <div class="box-header with-border">
                                    <h3 class="box-title">Vuelto Ideal</h3>
                                </div>
                                <div class="box-body">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <label><h4 id="lbVuelto_${idTab}" style="font-weight: bold;">Vuelto</h4></label>
                                                <input type="number" style="color: #dd4b39;font-weight: bold;font-size: 25px;" id="Vuelto_${idTab}" value="0.00" class="form-control" onblur=${()=>CalcularVueltoEspecial(idTab)}>
                                                <div class="form-control-line"></div>
                                            </div>
                                        </div> 
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="col-md-4" id="divUSD_${idTab}">
                                                <div class="form-group">
                                                    <label style="font-weight: bold;" id="lbUSD_${idTab}">USD:</label>
                                                    <input type="text" style="color: #dd4b39;font-weight: bold;font-size: 25px;" value="0.00" id="USD_${idTab}" class="form-control" onkeypress=${()=>BloquearControles(event)} >
                                                    <div class="form-control-line"></div>
                                                </div> 
                                            </div>
                                            <div class="col-md-4" id="divTC_${idTab}"> 
                                                <label id="laCambio_${idTab}" style="margin-top: 30px;margin-left: -20px;">x T/C</label>
                                            </div>
                                            <div class="col-md-4" id="divPEN_${idTab}">
                                                <div class="form-group">
                                                    <label style="font-weight: bold;" id="lbPEN_${idTab}">PEN:</label>
                                                    <input type="text" style="color: #dd4b39;font-weight: bold;font-size: 25px;" value="0.00" id="PEN_${idTab}" class="form-control"  onkeypress=${()=>BloquearControles(event)} >
                                                    <div class="form-control-line"></div>
                                                </div> 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="box box-success">
                                <div class="box-body">
                                    <div class="form-group">
                                        <label id="lbTotalCobrar_${idTab}" style="font-weight: bold;">Total a Cobrar</label>
                                        <input type="number" id="TotalCobrar_${idTab}" style="color: #1a2226;font-weight: bold;font-size: 25px;" value="0.00" class="form-control">
                                        <div class="form-control-line"></div>
                                    </div> 
                                    <div class="form-group">
                                        <label id="lbTotalRecibidos_${idTab}" style="font-weight: bold;">Total Recibidos</label>
                                        <input type="number" id="TotalRecibidos_${idTab}"  style="color: #1a2226;font-weight: bold;font-size: 25px;" value="0.00" class="form-control" onblur=${()=>CalcularVuelto(idTab)} onkeypress=${()=>KeyCalcularVuelto(event,idTab)}>
                                        <div class="form-control-line"></div>
                                    </div>
                                    <p></p>
                                    <div class="form-group">
                                        <label id="lbVueltoCalculado_${idTab}" style="font-weight: bold;">Vuelto calculado</label>
                                        <input type="text" id="VueltoCalculado_${idTab}"  style="color: #1a2226;font-weight: bold;font-size: 25px;" value="0.00" class="form-control"  onkeypress=${()=>BloquearControles(event)} >
                                        <div class="form-control-line"></div>
                                    </div>
                                    <div class="form-group">
                                        <button type="button" class="btn btn-success btn-xs" onclick=${()=>CalcularVuelto(idTab)}>Calcular</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> `
    var divFV = document.getElementById('divFooter_'+idTab);
    empty(divFV).appendChild(div);
    CalcularVuelto(idTab)
}

 
function NuevaVenta() {
     
     VerNuevaVenta(null)
        
}
  

export { NuevaVenta }