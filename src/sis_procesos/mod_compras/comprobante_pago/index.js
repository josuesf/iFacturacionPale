var empty = require('empty-element');
var yo = require('yo-yo');  
import { URL } from '../../../constantes_entorno/constantes'
import { NuevoCliente, BuscarCliente , AbrirModalObs , BuscarProducto } from '../../modales'
import { AsignarSeriesModal, BuscarPorSerie } from '../../modales/series'
import { ConvertirCadena,BloquearControles, EnviarImpresion } from '../../../../utility/tools' 

var listaFormaPago = []
var arrayValidacion = [null,'null','']
var obs_xml = null
var aSaldo = 0
var aMonto = 0 
var contador = 0
var contadorPercepcion = 0
var idFilaSeleccionadaSerie = 0
var CodTipoOperacion = '01'
 

function VerRegistroComprobante(variables,fecha_actual,CodLibro,CodTipoOperacion,Cliente,Detalles) {
    CodTipoOperacion = CodTipoOperacion
    listaFormaPago = []
    obs_xml = null
    aMonto = 0 
    idFilaSeleccionadaSerie = 0
    global.objCliente = Cliente?Cliente:''
    global.objProducto = ''
    global.arraySeries = ''
    contador = 0
    contadorPercepcion = 0
    var el = yo`
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
                <h4 class="modal-title"><b>${CodLibro=='08'?'REGISTRO DE COMPRAS':'REGISTRO DE VENTAS'}</b></h4>
            </div>
            <div class="modal-body" id="modal_form_ingreso">
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
                    <div class="col-md-8">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h4> Cliente/Proveedor </h4>
                            </div>
                            <div class="panel-body">
                                <div class="row">
                                    <div class="col-md-3" id="divCodTipoDoc">
                                        <div class="form-group">
                                            <select id="Cod_TipoDoc" class="form-control input-sm" onchange=${()=>CambioTipoDocumento()}>
                                                ${variables.documentos.map(e=>yo`<option style="text-transform:uppercase" value="${e.Cod_TipoDoc}" ${Cliente?(Cliente.Cod_TipoDocumento==e.Cod_TipoDoc?'selected':''):''}>${e.Nom_TipoDoc}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6" id="divNroDocumento">
                                        <div class="input-group">
                                            <input type="text" id="Nro_Documento" onblur="${() => BuscarClienteDoc(CodLibro)}" class="form-control input-sm required" value=${Cliente?Cliente.Nro_Documento:''}>
                                            <div class="input-group-btn">
                                                <button type="button" class="btn btn-success btn-sm" id="BuscarRENIEC">
                                                    <i class="fa fa-globe"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-3" id="divDetalles">
                                        <div class="form-group">
                                            <button class="btn btn-info btn-sm"  onclick="${()=>AbrirModalObsComprobantePago()}">Mas Detalles</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12" id="divCliente">
                                        <div class="form-group">
                                            <label> Señor(es) : </label>
                                            <div class="input-group input-group-sm">
                                                <div class="input-group-btn">
                                                    <button type="button" class="btn btn-success" id="AgregarCliente"  onclick=${()=>NuevoCliente(variables.documentos)}>
                                                        <i class="fa fa-plus"></i>
                                                    </button>
                                                </div>
                                                <input type="text" id="Cliente" class="form-control required" data-id=${Cliente?Cliente.Id_ClienteProveedor:null} value=${Cliente?Cliente.Cliente:''}>
                                                <div class="input-group-btn">
                                                    <button type="button" class="btn btn-info" id="BuscarCliente"  onclick=${()=>BuscarCliente("Cliente","Nro_Documento",CodLibro == "08" ? "001" : "002")}>
                                                        <i class="fa fa-search"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12" id="divDireccion">
                                        <div class="form-group">
                                            <label> Direccion : </label>
                                            <input type="text" id="Direccion" class="form-control input-sm required" value=${Cliente?Cliente.Direccion:''}>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div class="box-footer">
                                
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="panel panel-default">
                            <div class="panel-heading text-center">
                                <div class="row">
                                    <h4 class="box-title" id="Ruc_Empresa"><strong> R.U.C. ${variables.empresa.RUC}</strong></h4>
                                </div>
                                <div class="row">
                                    <div class="col-sm-12">
                                        <div class="form-group">
                                            <select id="Cod_TipoComprobante" class="form-control selectPalerp" onchange=${()=>CargarSeries(CodLibro)}>
                                                ${variables.tipocomprobantes.map(e=>
                                                    (CodLibro=='08' && e.Flag_Compras==1)? 
                                                        yo`<option style="text-transform:uppercase" value="${e.Cod_TipoComprobante}">${e.Nom_TipoComprobante}</option>`
                                                        :
                                                        (CodLibro=='14' && e.Flag_Ventas==1)?
                                                            yo`<option style="text-transform:uppercase" value="${e.Cod_TipoComprobante}">${e.Nom_TipoComprobante}</option>`
                                                            : 
                                                            yo``)}
                                            </select>
                                        </div>
                                    </div>
                                </div> 
                                
                                <div class="row">
                                    <div class="col-md-6" id="divSerie">
                                        <div class="form-group" style="display:flex">

                                            <select class="form-control input-sm" id="Serie" onchange=${()=>TraerSiguienteNumero(CodLibro)}>
                                               
                                            </select>
                                            
                                        </div>
                                    </div>
                                    <div class="col-md-6" id="divNumero">
                                        <div class="form-group">
                                            <input type=${CodLibro=='08'?"number":"text"} class="form-control input-sm required" id="Numero" onblur=${()=>CambioNumero()} onkeypress=${()=>CambioNumero_(event,CodLibro)}>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-12">
                        <div class="panel panel-default">
                            <div class="panel-body">
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="col-sm-3" id="divContado">
                                                    <label></label>
                                                    <div class="radio">
                                                        <label>
                                                            <input type="radio" value="contado" id="optCredito" name="optCredito" onchange=${()=>CambioCreditoContado()} checked> Contado
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="col-sm-4" id="divCredito" style="display:none">
                                                    <label></label>
                                                    <div class="radio">
                                                        <label>
                                                            <input type="radio" value="credito" id="optCredito" name="optCredito"  onchange=${()=>CambioCreditoContado()}> Credito
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="col-sm-1" id="divMultiplesPagos">
                                                    <label></label>
                                                    <div class="radio">
                                                        <button type="button" class="btn btn-success btn-xs" onclick="${()=>AbrirModalFormasPago(variables,fecha_actual)}" id="btnMultiplesPagos"><i class="fa fa-money"></i></button>
                                                    </div>
                                                </div>
                                                <div class="col-sm-4" id="divOperacion">
                                                    <label id="lbCuentaCajaBanco">#Operacion</label>
                                                    <div class="form-group">
                                                        <select class="form-control input-sm" id="Cod_CuentaBancaria" onchange=${()=>CambioCodCuentaBancaria(CodLibro)}> 
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-4" id="divNroDias" style="display:none">
                                                <div class="form-group">
                                                    <label>Dias:</label>
                                                    <input class="form-control input-sm" type="number" id="Nro_Dias" value="0">
                                                </div>
                                            </div>
                                            <div class="col-md-4" id="divFormasPago">
                                                <div class="form-group">
                                                    <select class="form-control input-sm" onchange="${()=>CambioFormasPago(CodLibro)}" id="Cod_FormaPago"> 
                                                        ${variables.formaspago.map(e=>yo`<option style="text-transform:uppercase" value="${e.Cod_FormaPago}">${e.Nom_FormaPago}</option>`)} 
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-8" id="divCuentaCajaBancos">
                                                <div class="form-group" style="display: flex;">
                                                    <select class="form-control input-sm select-preserve" id="Cuenta_CajaBancos"> 
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-4" id="divLicitacion" style="display:block">
                                                <div class="checkbox">
                                                    <label>
                                                        <input type="checkbox" id="optLicitacion" name="optLicitacion" onchange=${()=>CambioLicitacion()}> Licitacion
                                                    </label>
                                                </div>
                                            </div>
                                            <div class="col-md-8" id="divCodigoLicitacion" style="display:none">
                                                <div class="form-group">
                                                    <select class="form-control input-sm" id="Cod_Licitacion" onchange=${()=>CambioSelectLicitacion(CodLibro,variables)}> 
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="row">
                                            <div class="col-sm-2" id="divEsGastos" style="display: ${CodLibro=='08'?'block':'none'}">
                                                <div class="checkbox"> 
                                                    <input type="checkbox" id="optEsGasto" name="optEsGasto" onchange="${()=>CambioGastos()}"> Es Gastos?
                                                </div>
                                            </div>
                                            <div class="col-sm-3" id="divMoneda">
                                                <div class="form-group">
                                                    <b>Moneda: </b>
                                                    <select id="Cod_Moneda" class="form-control input-sm" onchange=${()=>CambioMoneda(CodLibro)}>
                                                        ${variables.monedas.map(e=>yo`<option style="text-transform:uppercase" value="${e.Cod_Moneda}">${e.Nom_Moneda}</option>`)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-sm-3" id="divTC">
                                                <div class="form-group">
                                                    <b>T/C: </b>
                                                    <input class="form-control input-sm" type="number" id="Tipo_Cambio" value="1.00">
                                                </div>
                                            </div>
                                            <div class="col-sm-4" id="divFecha">
                                                <div class="form-group">
                                                    <b>Fecha: </b>
                                                    <input type="date" class="form-control input-sm" id="Fecha" value="${fecha_actual}" onchange=${()=>TraerTipoCambio(CodLibro)}>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-12" id="divVendedor">
                                                <div class="form-group">
                                                    <b>Vendedor: </b>
                                                    <select id="Cod_Usuarios" id="" class="form-control input-sm">
                                                        ${variables.usuarios.map(e=>yo`<option style="text-transform:uppercase" value="${e.Cod_Usuarios}"  >${e.Nick}</option>`)}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-sm-6" id="divGuiaRemision">
                                                <div class="form-group">
                                                    <b>Guia de Remision: </b>
                                                    <div class="input-group input-group-sm">
                                                        <div class="input-group-btn">
                                                            <button type="button" class="btn btn-success" id="AgregarGuia"  >
                                                                <i class="fa fa-plus"></i>
                                                            </button>
                                                        </div>
                                                        <input type="text" id="Guia" class="form-control required input-sm">
                                                        <div class="input-group-btn">
                                                            <button type="button" class="btn btn-info" id="BuscarGuia"  >
                                                                <i class="fa fa-search"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="row" id="divDescargarProducto">
                                                    <div class="checkbox">
                                                        <label>
                                                            <input type="checkbox" id="optDescargar" name="optDescargar" checked="checked" onchange=${()=>CambioDespachado()}> ${CodLibro=='08'?'Descargar Producto':'Descargar de Almacen(es)'}
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="row" id="divExportacion">
                                                    <div class="checkbox">
                                                        <label>
                                                            <input type="checkbox" id="optExportacion" name="optExportacion" onchange=${()=>CambioExportacion(CodLibro,variables)}> Exportacion ? 
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-12">
                        <div class="panel panel-default">
                            <div class="panel-body">
                                <div class="row">
                                    <div class="col-md-12"> 
                                        <button type="button" class="btn btn-success btn-sm" onclick="${()=>AgregarFilaTabla(CodLibro,variables)}"><i class="fa fa-plus"></i> Agregar Item</button>
                                    </div>
                                </div>

                                <div class="table-responsive">
                                    <table id="tablaProductos" class="table table-bordered table-hover">
                                        <thead>
                                            <tr> 
                                                <th>
                                                    <div class="input-group">
                                                        <label>Codigo/Producto/Servicio</label>
                                                        <span class="input-group-btn">
                                                            <button type="button" class="btn btn-default btn-xs" onclick=${()=>BuscarProductoCP(CodLibro,'click')}><i class="fa fa-search"></i></button>
                                                        </span>
                                                    </div>
                                                </th>
                                                <th>Almacen</th>
                                                <th>
                                                    <div class="input-group">
                                                        <label>UM</label>
                                                        <span class="input-group-btn">
                                                            <button type="button" class="btn btn-default btn-xs"><i class="fa fa-refresh"></i></button>
                                                        </span>
                                                    </div>
                                                </th>
                                                <th>Cantidad</th>
                                                <th>Precio</th>
                                                <th>Desc. %</th>
                                                <th>Importe</th>
                                            </tr>
                                            <tr style="background:bisque"> 
                                                <input class="hidden" id="Cod_Producto" value=null>
                                                <input class="hidden" id="Cod_TipoOperatividad" value=null>
                                                <th><input type="text" id="Nom_Producto" data-id=null class="form-control input-sm" onblur=${()=>BuscarProductoCP(CodLibro,'blur')}></th>
                                                <th><select class="form-control input-sm" id="Cod_Almacen" onchange="${()=>CargarUnidadMedida()}"> </select></th>
                                                <th>
                                                   <select class="form-control input-sm" id="Cod_UnidadMedida" onchange="${()=>CambioUnidadMedida()}"> </select>
                                                </th>
                                                <th>
                                                    <div style="display: inline-flex;">
                                                        <input type="number" class="form-control input-sm" id="Cantidad" value="0.00" onkeypress=${()=>KeyPressCantidad(CodLibro)} onchange=${()=>KeyPressCantidad(CodLibro)}>
                                                        <select class="form-control input-sm" style="display:${CodLibro=='14'? 'block':'none'};width: 10%;" id="Cod_TipoPrecio" > </select>
                                                    </div>
                                                </th>
                                                
                                                <th><input type="number" class="form-control input-sm" id="Precio_Unitario"  value="0.00" onkeypress=${()=>KeyPressPrecioUnitario()} onchange=${()=>KeyPressPrecioUnitario()}></th>
                                                <th><input type="number" class="form-control input-sm" id="Descuento" value="0.00" ></th>
                                                <th><input type="number" class="form-control input-sm" id="Importe" value="0.00" onkeypress=${()=>KeyEnterImporte(event,CodLibro,variables)}></th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <table class="table table-bordered table-hover" id="tablaDetallesComprobante">
                                        <tbody id="tablaBody">
                                        </tbody>
                                    </table>

                                </div>

                            </div>
                            <div class="panel-footer">
                                <div class="row">
                                    <div class="col-md-8">
                                        <label id="laSON">SON : </label>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label for="subtotal" class="col-sm-5 control-label" value="0.00">SUB TOTAL</label>
                        
                                            <div class="col-sm-7">
                                                <input type="text" class="form-control input-sm" id="subtotal" onkeypress=${()=>BloquearControles(event)}>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-5">
                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="checkbox">
                                                    <label>
                                                        <input type="checkbox" id="ckbIncluyeIGV" checked="checked" onchange="${()=>CalcularTotal(CodLibro,variables)}">Precio Unitario Incluye IGV?
                                                    </label>
                                                </div>
                                            </div>
                                        </div>  
                                        <div class="row">
                                            <div class="col-md-4">
                                                <label>Glosa Contable:</label>
                                            </div>
                                            <div class="col-md-8">
                                                <input type="text" id="Glosa" class="form-control input-sm" value="${CodLibro=='08'?'POR LA COMPRA DE MERCADERIA':'POR LA VENTA DE MERCADERIA'}">
                                            </div>
                                        </div>  
                                        <div class="row">
                                            <div class="col-md-3">
                                                <label>Placa Vehiculo:</label>
                                            </div>
                                            <div class="col-md-3">
                                                <input type="text" class="form-control input-sm" id="placaVehiculo">
                                            </div>
                                            <div class="col-md-3">
                                                <label>Stock actual:</label>
                                            </div>
                                            <div class="col-md-3">
                                                <input type="text" class="form-control input-sm" id="Stock" onkeypress=${()=>BloquearControles(event)}>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <button type="button" class="btn btn-success btn-sm btn-block" onclick="${()=>AbrirModalPercepcion(CodLibro,variables)}">Percepcion</button>
                                            </div>
                                            <div class="col-md-6">
                                                <button type="button" class="btn btn-warning btn-sm btn-block" id="btnBuscarSeries" onclick="${()=>BuscarPorSerie()}">Buscar Series</button>
                                            </div>
                                        </div>  
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-group">
                                            <b id="laDescuento" style="display:none">DESC. TOTAL : </b>
                                            <input type="number"  style="display:none" class="form-control input-sm" value="0.00" id="DescuentoTotal">
                                        </div>
                                        <div class="form-group">
                                            <b id="laExonerado"  style="display:none">EXONERADO </b>
                                            <input type="number" class="form-control input-sm" style="display:none" value="0.00" id="Exonerado">
                                        </div>
                                        <div class="form-group">
                                            <b id="laGratuitas"  style="display:none">GRATUITAS: </b>
                                            <input type="number" class="form-control input-sm" style="display:none" value="0.00" id="Gratuitas">
                                        </div>
                                        <div class="form-group">
                                            <b id="laPercepcion"  style="display:none">PERCEPCION: </b>
                                            <input type="number"  style="display:none" class="form-control input-sm" value="0.00" id="Percepcion">
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group" id="divAplicaImpuesto">
                                            <label>
                                                <input type="checkbox" id="ckbAplicaImpuesto" ${variables.empresa.Flag_ExoneradoImpuesto?'checked':'checked'}> I.G.V 18%
                                            </label>
                                            <input type="text" class="form-control input-sm" value="0.00" id="Impuesto" onkeypress=${()=>BloquearControles(event)}>
                                        </div>
                                        <div class="form-group">
                                            <label>
                                                <input type="checkbox" id="cbAplicaServicios"  checked="checked"> SERVICIOS
                                            </label>
                                            <input type="number" class="form-control input-sm" value="0.00" id="OtrosCargos" onkeypress=${()=>CalcularTotal(CodLibro,variables)} onchange=${()=>CalcularTotal(CodLibro,variables)}>
                                        </div>
                                        <div class="form-group" style="display:none">
                                            <label>
                                                <input type="checkbox"  checked="checked"> I.S.C 3%
                                            </label>
                                            <input type="number" class="form-control input-sm" value="0.00" id="Servicios">
                                        </div>
                                        <div class="form-group">
                                            <strong>DESCUENTO GLOBAL</strong>
                                            <input type="number" class="form-control input-sm" value="0.00" id="Descuento_Global" onkeypress=${()=>CalcularTotal(CodLibro,variables)} onchange=${()=>CalcularTotal(CodLibro,variables)}>
                                        </div>
                                        <div class="form-group">
                                            <strong>GRAN TOTAL</strong>
                                            <input type="text" class="form-control input-sm" id="Gran_Total" value="0.00" onkeypress=${()=>BloquearControles(event)}>
                                        </div>
                                    </div>
                                </div>
                                <div class="row text-center">
                                    <div class="col-md-12">
                                        <h4><strong id="DescripcionDespachado"></strong></h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            <div class="modal-footer">
                <button class="btn btn-primary" id="btnAceptarGenerarComprobante" onclick=${()=>GenerarComprobante(CodLibro,variables)}>${CodLibro=='08'?'Comprar':'Vender'}</button>
                <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>`
    var ingreso = document.getElementById('modal-proceso')
    empty(ingreso).appendChild(el)
    $('#modal-proceso').modal('show') 
    if(CodLibro=='08'){ 
 
        $("#Serie").combobox()
        $("#Serie").change(function(){ 
            TraerSiguienteNumero(CodLibro)
        })  

        $("#Serie").parent().find('input.ui-widget').blur(function(){ 
            FocusOutSerie()
        })
    } 
 
    $("#Cuenta_CajaBancos").combobox()
     

    $("#modal-proceso").off('shown.bs.modal').on("shown.bs.modal", function () {
        //console.log("cargando")
        CargarConfiguracionDefault(CodLibro,variables) 
    });
     

    /*CambioMoneda()
    CambioTipoDocumento()
    CambioFormasPago(CodLibro)
    CambioCreditoContado()
    if(global.objCliente =='')
        BuscarCliente("Cliente","Nro_Documento",CodLibro == "08" ? "001" : "002")
    CargarConfiguracionDefault(CodLibro,variables)
    $("input[name=optCredito][value='contado']").prop("checked",true)
    $('#modal-superior').on('hidden.bs.modal', function () {

        if(global.objCliente !='' && global.objCliente){
            //console.log(global.objCliente)
            $("#Cod_TipoDoc").val(global.objCliente.Cod_TipoDocumento)
            $("#Cliente").val(global.objCliente.Cliente)
            $("#Nro_Documento").val(global.objCliente.Nro_Documento)
            $("#Cliente").attr("data-id",global.objCliente.Id_ClienteProveedor)
            if(parseFloat(global.objCliente.Limite_Credito) > 0 ){ 
                $("input[name=optCredito][value='credito']").prop("checked",true);
                $("#divCredito").css("display","block")
            }
            else{
                $("input[name=optCredito][value='contado']").prop("checked",true);
                $("#divCredito").css("display","none")
            }
            
            if($("#divCredito").css("display")=="block"){
                $("input[name=optCredito][value='credito']").prop("checked",true);
                $("#Nro_Dias").val(30)
            }else{
                $("input[name=optCredito][value='credito']").prop("checked",false);
                $("#Nro_Dias").val(0)
            }

            if(CodLibro=="14"){
                $("#Cod_TipoComprobante").val(global.objCliente.Cod_TipoComprobante)
                CargarSeries(CodLibro)
                CargarLicitacionesCliente(global.objCliente.Id_ClienteProveedor)
            }
        }
        CambioLicitacion()
        CambioCreditoContado()

        if(global.objProducto!='' && global.objProducto){
            $("#Nom_Producto").attr("data-id",global.objProducto.Id_Producto)
            $("#Nom_Producto").val(global.objProducto.Nom_Producto)
            $("#Cod_TipoOperatividad").val(global.objProducto.Cod_TipoOperatividad)
            $("#Cod_Producto").val(global.objProducto.Cod_Producto)
            CargarAlmacenes(global.objProducto.Id_Producto,global.objProducto.Cod_Almacen)
            CargarUnidadMedida(global.objProducto.Id_Producto,global.objProducto.Cod_Almacen)
            $("#Cod_UnidadMedida").val(global.objProducto.Cod_UnidadMedida)
            $("#Cod_TipoPrecio").val('001')
            $("#Stock").val(parseFloat(global.objProducto.Stock_Act)+".00")
            $("#Precio_Unitario").val(parseFloat(global.objProducto.Precio_Venta))
            $("#Cantidad").val(1)
            $("#Cantidad").focus()
            $("#Descuento").val(global.objProducto.Descuento)
        }
    })


    $('#modal-otros-procesos').on('hidden.bs.modal', function () { 
        if(global.arraySeries!='' && global.arraySeries){ 
            $("tr#"+idFilaSeleccionadaSerie).find('td.Series').find('input').val(JSON.stringify(global.arraySeries))
        }
    })

    CambioLicitacion()*/
    
    $('#modal-superior').on('hidden.bs.modal', function () {

        if(global.objCliente !='' && global.objCliente){
            //console.log(global.objCliente)
            $("#Cod_TipoDoc").val(global.objCliente.Cod_TipoDocumento)
            $("#Cliente").val(global.objCliente.Cliente)
            $("#Nro_Documento").val(global.objCliente.Nro_Documento)
            $("#Direccion").val(global.objCliente.Direccion)
            $("#Cliente").attr("data-id",global.objCliente.Id_ClienteProveedor)
            if(parseFloat(global.objCliente.Limite_Credito) > 0 ){ 
                $("input[name=optCredito][value='credito']").prop("checked",true);
                $("#divCredito").css("display","block")
            }
            else{
                $("input[name=optCredito][value='contado']").prop("checked",true);
                $("#divCredito").css("display","none")
            }
            
            if($("#divCredito").css("display")=="block"){
                $("input[name=optCredito][value='credito']").prop("checked",true);
                $("#Nro_Dias").val(30)
            }else{
                $("input[name=optCredito][value='credito']").prop("checked",false);
                $("#Nro_Dias").val(0)
            }

            if(CodLibro=="14"){
                $("#Cod_TipoComprobante").val(global.objCliente.Cod_TipoComprobante)
                CargarSeries(CodLibro)
                CargarLicitacionesCliente(global.objCliente.Id_ClienteProveedor)
            }
        }
        CambioLicitacion()
        CambioCreditoContado()

        if(global.objProducto!='' && global.objProducto){
            $("#Nom_Producto").attr("data-id",global.objProducto.Id_Producto)
            $("#Nom_Producto").val(global.objProducto.Nom_Producto)
            $("#Cod_TipoOperatividad").val(global.objProducto.Cod_TipoOperatividad)
            $("#Cod_Producto").val(global.objProducto.Cod_Producto)
            CargarAlmacenes(global.objProducto.Id_Producto,global.objProducto.Cod_Almacen)
            CargarUnidadMedida(global.objProducto.Id_Producto,global.objProducto.Cod_Almacen)
            $("#Cod_UnidadMedida").val(global.objProducto.Cod_UnidadMedida)
            $("#Cod_TipoPrecio").val('001')
            $("#Stock").val(parseFloat(global.objProducto.Stock_Act)+".00")
            $("#Precio_Unitario").val(parseFloat(global.objProducto.Precio_Venta))
            $("#Cantidad").val(1)
            $("#Cantidad").focus()
            $("#Descuento").val(global.objProducto.Descuento)
        }
    })


    $('#modal-otros-procesos').on('hidden.bs.modal', function () { 
        if(global.arraySeries!='' && global.arraySeries){ 
            $("tr#"+idFilaSeleccionadaSerie).find('td.Series').find('input').val(JSON.stringify(global.arraySeries))
        }
    })


    if(global.objCliente =='')
            BuscarCliente("Cliente","Nro_Documento",CodLibro == "08" ? "001" : "002")

   $(document).on('keypress','input',function(event){                
       event.stopImmediatePropagation();
       if( event.which == 13 ){
            event.preventDefault();
            var $input = $('input');
            $input.eq( $input.index( this ) + 1 ).focus()
       }
   });

   
    if (Detalles!=undefined){
        AgregarFilaTabla_(CodLibro,variables,Detalles)
    }   

}
 

function VerModalFormasPago(variables,amodo,Tipo_Cambio,Monto,Cod_Moneda){
    var el = yo`
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button> 
                    <h4 class="modal-title"><strong>Formas de Pago</strong></h4>
                </div>
                <div class="modal-body">
                    <div class="row" id="divCreditoFormasPago">
                     
                    <div class="btn-group-toggle" data-toggle="buttons">
                     <label class="btn btn-success">
                       <input type="checkbox" checked autocomplete="off" id="btnCreditoFormaPagoHeader"  onchange=${() => AsignarCredito()}> Credito
                     </label>
                    </div>

 
                    </div>
                    <p></p>
                    <div class="row">
                        <div class="col-sm-7">
                            <div class="box box-default">
                                <div class="box-header">
                                    <h4> Monedas </h4>
                                </div>
                                <div class="box-body"> 
                                        <div class="cc-selector-2 text-center row" id="divMonedas" >
                                            ${variables.formaspago.map(e=>yo`
                                                ${e.Cod_FormaPago=="008"?
                                                    variables.monedas.map(m=>
                                                        m.Cod_Moneda!="PEN"?
                                                        m.Cod_Moneda!="USD"?
                                                        m.Cod_Moneda!="EUR"?
                                                        yo``
                                                        :
                                                        yo`
                                                            <div class="col-md-4">
                                                                <input type="radio" name="Cod_Moneda_Forma_Pago" value="euros" onchange=${()=>CambioMonedaFormaPagoEuros(Cod_Moneda,variables,Tipo_Cambio)}/>
                                                                <label class="drinkcard-cc euros" for="Cod_Moneda_Forma_Pago"></label>
                                                            </div>`
                                                        :
                                                        yo`
                                                            <div class="col-md-4">
                                                                <input type="radio" name="Cod_Moneda_Forma_Pago" value="dolares" onchange=${()=>CambioMonedaFormaPagoDolares(Cod_Moneda,variables,Tipo_Cambio)}/>
                                                                <label class="drinkcard-cc dolares" for="Cod_Moneda_Forma_Pago"></label>
                                                            </div>`
                                                        :
                                                        yo`
                                                            <div class="col-md-4">
                                                                <input type="radio" name="Cod_Moneda_Forma_Pago" value="soles" checked="checked" onchange=${()=>CambioMonedaFormaPagoSoles(Cod_Moneda)}/>
                                                                <label class="drinkcard-cc soles" for="Cod_Moneda_Forma_Pago"></label>
                                                            </div>`
                                                    )
                                                :
                                                yo``
                                                }
                                            `)}
                                        </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-5">
                            <div class="box box-default">
                                <div class="box-header">
                                    <h4> Tarjetas </h4>
                                </div>
                                <div class="box-body">
                                        <div class="cc-selector-2 text-center row" id="divTarjetas"> 
                                            ${variables.formaspago.map(e=>yo`
                                                ${  e.Cod_FormaPago!="005"?
                                                    e.Cod_FormaPago!="006"?
                                                    yo``
                                                    :
                                                    yo`
                                                        <div class="col-md-6">
                                                            <input  checked="checked" id="Cod_FormaPago_MasterCard" type="radio" name="Cod_FormaPago_Modal" value="mastercard"  onchange=${()=>CambioMonedaFormaPagoMasterCard()}/>
                                                            <label class="drinkcard-cc mastercard" for="Cod_FormaPago_Modal"></label>
                                                        </div>`
                                                    :
                                                    yo`
                                                        <div class="col-md-6">
                                                            <input  checked="checked" id="Cod_FormaPago_Visa" type="radio" name="Cod_FormaPago_Modal" value="visa" onchange=${()=>CambioMonedaFormaPagoVisa()}/>
                                                            <label class="drinkcard-cc visa"for="Cod_FormaPago_Modal"></label>
                                                        </div>`
                                                }
                                            `)}
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-8">
                            <div class="box box-default">
                                <div class="box-header">
                                    <h4>Agregar Formas de Pago</h4>
                                </div>
                                <div class="box-body">
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label>Monto</label>
                                            <input type="number" class="form-control" value="0.00" id="MontoFormaPago">
                                        </div>
                                    </div>
                                    <div class="col-md-8">
                                        <div class="row">
                                            <div class="col-md-6" id="divReferencia">
                                                <div class="form-group">
                                                    <label>Referencia</label>
                                                    <input type="text" class="form-control" id="ReferenciaFormaPago">
                                                </div>
                                            </div>
                                            <div class="col-md-6" id="divCompSaldo">
                                                <div class="form-group">
                                                    <button class="btn btn-default btn-sm" onclick=${()=>CompletarSaldo()} id="btnCompletarSaldo">Comp. Saldo</button>
                                                </div>
                                            </div>
                                        </div> 
                                        <div class="row">
                                            <div class="col-md-6" id="divTipoCambio">
                                                <div class="form-group">
                                                    <label>T/C</label>
                                                    <input type="number" class="form-control" data-value=null id="Tipo_Cambio_FormaPago">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <button class="btn btn-default btn-sm" id="btnAgregarMontoFormaPago" onclick=${()=>AgregarMontoFormaPago(Cod_Moneda,Tipo_Cambio)}>Agregar</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                     
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="box box-default">
                                <div class="box-header">
                                    <h4>Datos del Comprobante</h4>
                                </div>
                                <div class="box-body"> 
                                    <div class="col-md-12"> 
                                        <div class="row" id="divCodMonedaGlobal">
                                            <div class="col-md-12">
                                                <div class="form-group">
                                                    <label>Moneda</label>
                                                    <label type="text" class="form-control" id="Cod_MonedaGlobal"></label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row" id="divTipoCambioGlobal">
                                            <div class="col-md-12">
                                                <div class="form-group">
                                                    <label>T/C</label>
                                                    <input type="number" class="form-control" id="Tipo_Cambio_Global" onkeypress=${()=>CambioTipoCambioGlobal(Cod_Moneda,Tipo_Cambio)}>
                                                </div>
                                            </div>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                        </div> 
                    </div>
                    <div class="row">
                        <div class="box box-default">
                            <div class="box-body"> 
                                <div class="table-responsive" id="contenedorPagosMultiples">
                                <table id="tablaPagosMultiples" class="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>Tipo</th>
                                            <th>Moneda</th> 
                                            <th>Monto</th>
                                            <th>T/C en S</th>
                                            <th>T/C Equi</th>
                                            <th>Total</th>
                                            <th>Fecha</th>
                                            <th># Ref.</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tablaBodyPagosMultiples">
                                            ${listaFormaPago.length==0?'':''}
                                    </tbody>
                                </table>
                                </div>
                            </div>
                            <div class="box-footer">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="col-md-4 col-md-offset-8">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <button class="btn btn-success" id="btnSaldo" data-value="${Monto}">${Cod_Moneda + " " + (Monto/Tipo_Cambio).toFixed(2)}</button>
                                                </div>   
                                            </div>
                                            <div class="col-md-6">
                                                <button class="btn btn-danger" id="btnTotal">TOTAL </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-info" onclick="${()=>AceptarFormaPago(amodo)}" id="btnAceptarFormaPago">Aceptar</button>
                    <button type="button" data-dismiss="modal" class="btn btn-danger pull-right">Cancelar</button>
                </div>
            </div>
        </div>`
    
    aMonto = (parseFloat(Monto)*parseFloat(Tipo_Cambio)).toFixed(2)
    var modal_proceso = document.getElementById('modal-otros-procesos');
    empty(modal_proceso).appendChild(el);
    $('#modal-otros-procesos').modal()   
    
    CargarConfiguracionDefaultFormaPago(variables,amodo,Cod_Moneda,Tipo_Cambio)

    CambioMonedaFormaPagoSoles(Cod_Moneda)
    CambioMonedaFormaPagoDolares(Cod_Moneda,variables,Tipo_Cambio)
    CambioMonedaFormaPagoEuros(Cod_Moneda,variables,Tipo_Cambio)
    

    CambioMonedaFormaPagoMasterCard()
    CambioMonedaFormaPagoVisa()
     
}

function AbrirModalPercepcion(CodLibro,variables){
    var el = yo`
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button> 
                    <h4 class="modal-title"><strong>Percepcion</strong></h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <b>Ingrese el porcentaje a aplicar: </b>
                                <input type="number" class="form-control input-sm" id="PorcentajePercepcion">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer text-center"> 
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-info" id="btnAceptar" onclick="${()=>AplicarPercepcion(CodLibro,variables)}">Aceptar</button>
                </div>
            </div>
        </div>`

    var modal_proceso = document.getElementById('modal-otros-procesos');
    empty(modal_proceso).appendChild(el);
    $('#modal-otros-procesos').modal()     
}

function AgregarFilaTabla_(CodLibro,variables,Detalles){
    var tabla = yo` 
                <tbody id="tablaBody">
                    ${Detalles.map((u,index) => 
                            yo`
                            <tr id="${index+ u.Id_Producto}">
                                <td class="id_ComprobantePago hidden"><input value=${u.id_ComprobantePago}></td>
                                <td class="id_Detalle hidden"><input value=${u.id_Detalle}></td> 
                                <td class="Id_Producto hidden"><input value=${u.Id_Producto}></td> 
                                <td class="Codigo hidden">${u.Codigo}</td>
                                <td class="Descripcion" style="width: 24%;"><input type="text" class="form-control input-sm" value=${u.Descripcion}></td>
                                <td class="Almacen"><input type="text" class="form-control input-sm" data-id=${u.Almacen} value=${u.Des_Almacen}></td> 
                                <td class="UM"><input type="text" class="form-control input-sm" data-id=${u.UM} value=${u.Nom_UnidadMedida}></td>
                                <td class="Stock hidden"><input type="number" class="form-control input-sm" value=${u.Stock}></td> 
                                <td class="Cantidad"><input type="number" class="form-control input-sm" value=${u.Cantidad} onkeyup=${()=>EditarCantidad(index+ u.Id_Producto,CodLibro,variables)} onchange=${()=>EditarCantidad(index+ u.Id_Producto,CodLibro,variables)}></td> 
                                <td class="Despachado hidden">${u.Despachado}</td> 
                                <td class="PU"><input type="number" class="form-control input-sm" data-value=${parseFloat(u.PU)-(parseFloat(u.Descuento)*parseFloat(u.PU)/100)} value=${u.PU} onkeyup=${()=>EditarPrecioUnitario(index+ u.Id_Producto,CodLibro,variables)} onchange=${()=>EditarPrecioUnitario(index+ u.Id_Producto,CodLibro,variables)}></td> 
                                <td class="Descuento"><input type="number" style=${parseFloat(u.Descuento)/100 != 0?"background:#dd4b39;color:white;border-color:#dd4b39":"background:white;color:#555;border-color:#98999c"} data-value=${parseFloat(u.Descuento)*parseFloat(u.PU)/100} class="form-control input-sm" value=${u.Descuento} onkeyup=${()=>EditarDescuento(index+ u.Id_Producto,CodLibro,variables)} onchange=${()=>EditarDescuento(index+ u.Id_Producto,CodLibro,variables)} ></td> 
                                <td class="Importe"><input type="number" class="form-control input-sm" value=${u.Importe}></td>
                                <td class="Cod_Manguera hidden">${u.Cod_Manguera}</td>  
                                <td class="Tipo hidden">${u.Tipo}</td> 
                                <td class="Obs_ComprobanteD hidden">${u.Obs_Comprobante}</td> 
                                <td class="Series hidden"><input class="form-control" type="text" value=${JSON.stringify(u.Series)} name="Series"></td>
                                <td>
                                <div style="display:flex;">
                                    <button type="button" onclick="${()=>AsignarSeries(index+ u.Id_Producto,CodLibro)}" class="btn btn-primary btn-sm"><i class="fa fa-tasks"></i></a>  
                                    <button type="button" onclick="${()=>EliminarFila(index+ u.Id_Producto,CodLibro,variables)}" class="btn btn-danger btn-sm"><i class="fa fa-trash"></i></button>
                                </div>
                                </td>
                            </tr>`
                    )}
                </tbody>`

    empty(document.getElementById('tablaDetallesComprobante')).appendChild(tabla);
    contador = Detalles.length
    CalcularTotal(CodLibro,variables)
    /*var fila = yo``
    for (var i in Detalles) { 
        var idFila = contador+ Detalles[i].Id_Producto
        fila = yo`
        <tr id="${idFila}">
            <td class="id_ComprobantePago hidden"><input value=${Detalles[i].id_ComprobantePago}></td>
            <td class="id_Detalle hidden"><input value=${Detalles[i].id_Detalle}></td> 
            <td class="Id_Producto hidden"><input value=${Detalles[i].Id_Producto}></td> 
            <td class="Codigo hidden">${Detalles[i].Codigo}</td>
            <td class="Descripcion" style="width: 24%;"><input type="text" class="form-control input-sm" value=${Detalles[i].Descripcion}></td>
            <td class="Almacen"><input type="text" class="form-control input-sm" value=${Detalles[i].Almacen}></td> 
            <td class="UM"><input type="text" class="form-control input-sm" value=${Detalles[i].UM}></td>
            <td class="Stock hidden"><input type="number" class="form-control input-sm" value=${Detalles[i].Stock}></td> 
            <td class="Cantidad"><input type="number" class="form-control input-sm" value=${Detalles[i].Cantidad} onkeyup=${()=>EditarCantidad(idFila,CodLibro,variables)} onchange=${()=>EditarCantidad(idFila,CodLibro,variables)}></td> 
            <td class="Despachado hidden">${Detalles[i].Despachado}</td> 
            <td class="PU"><input type="number" class="form-control input-sm" value=${Detalles[i].PU} onkeyup=${()=>EditarPrecioUnitario(idFila,CodLibro,variables)} onchange=${()=>EditarPrecioUnitario(idFila,CodLibro,variables)}></td> 
            <td class="Descuento"><input type="number" class="form-control input-sm" value=${Detalles[i].Descuento} onkeyup=${()=>EditarDescuento(idFila,CodLibro,variables)} onchange=${()=>EditarDescuento(idFila,CodLibro,variables)} ></td> 
            <td class="Importe"><input type="number" class="form-control input-sm" value=${Detalles[i].Importe}></td>
            <td class="Cod_Manguera hidden">${Detalles[i].Cod_Manguera}</td>  
            <td class="Tipo hidden">${Detalles[i].Tipo}</td> 
            <td class="Obs_ComprobanteD hidden">${Detalles[i].Obs_Comprobante}</td> 
            <td class="Series hidden"><input class="form-control" type="text" value=${JSON.stringify(Detalles[i].Series)} name="Series"></td>
            <td>
            <div style="display:flex;">
                <button type="button" onclick="${()=>AsignarSeries(idFila,CodLibro)}" class="btn btn-primary btn-sm"><i class="fa fa-tasks"></i></a>  
                <button type="button" onclick="${()=>EliminarFila(idFila,CodLibro,variables)}" class="btn btn-danger btn-sm"><i class="fa fa-trash"></i></button>
            </div>
            </td>
        </tr>`
        contador++
    } 
    $("#tablaBody").html(fila)

    CalcularTotal(CodLibro,variables)*/
}

function AbrirModalConfirmacion(CodLibro,variables){
    var el = yo`
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
                <h4 class="modal-title"> Confirmacion </h4>
            </div>
            <div class="modal-body">
                <p>Esta seguro que desea guardar este comprobante?</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" onclick=${()=>EmisionCompleta(CodLibro,variables)}>Aceptar</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>`


    var modal_alerta = document.getElementById('modal-alerta');
    empty(modal_alerta).appendChild(el);
    $('#modal-alerta').modal()
}
 

function AgregarFilaTabla(CodLibro,variables){
    
    if($("#optEsGasto").is(":checked")){
        var Nom_Producto = $("#Nom_Producto").val()
        var Importe = $("#Importe").val()
        var rows = $("#tablaBody > tr").length
        var idFila = contador+"G"
        var fila = yo`
        <tr id="${idFila}">
            <td class="id_ComprobantePago hidden"><input value="0"></td>
            <td class="id_Detalle hidden"><input value="${rows}"></td> 
            <td class="Id_Producto hidden"><input value="0"></td> 
            <td class="Codigo hidden"></td>
            <td class="Descripcion" style="width: 24%;"><input type="text" class="form-control input-sm" value="${Nom_Producto}"></td>
            <td class="Almacen"><input type="text" class="form-control input-sm" data-id=null value=''></td> 
            <td class="UM"><input type="text" class="form-control input-sm" data-id=null value=''></td>
            <td class="Stock hidden"><input type="number" class="form-control input-sm" value=0></td> 
            <td class="Cantidad"><input type="number" class="form-control input-sm" value=1 onkeyup=${()=>EditarCantidad(idFila,CodLibro,variables)} onchange=${()=>EditarCantidad(idFila,CodLibro,variables)}></td> 
            <td class="Despachado hidden">1</td> 
            <td class="PU"><input type="number" data-value=0 class="form-control input-sm" value=${Importe} onkeyup=${()=>EditarPrecioUnitario(idFila,CodLibro,variables)} onchange=${()=>EditarPrecioUnitario(idFila,CodLibro,variables)}></td> 
            <td class="Descuento"><input type="number" data-value=0 class="form-control input-sm" value=0.00 onkeyup=${()=>EditarDescuento(idFila,CodLibro,variables)} onchange=${()=>EditarDescuento(idFila,CodLibro,variables)} ></td> 
            <td class="Importe"><input type="number" class="form-control input-sm" value=${Importe}></td>
            <td class="Cod_Manguera hidden"></td>  
            <td class="Tipo hidden">NGR</td> 
            <td class="Obs_ComprobanteD hidden"></td> 
            <td class="Series hidden"><input class="form-control" type="text" value=${JSON.stringify([])} name="Series"></td>
            <td>
            <div style="display:flex;">
                <button type="button" onclick="${()=>AsignarSeries(idFila,CodLibro)}" class="btn btn-primary btn-sm"><i class="fa fa-tasks"></i></a>  
                <button type="button" onclick="${()=>EliminarFila(idFila,CodLibro,variables)}" class="btn btn-danger btn-sm"><i class="fa fa-trash"></i></button>
            </div>
            </td>
        </tr>`
        $("#tablaBody").append(fila)
        contador++


    }else{

        if($("#Nom_Producto").val().trim()!=""){
            if(!arrayValidacion.includes($("#Nom_Producto").attr("data-id"))){

                var Id_Producto = $("#Nom_Producto").attr("data-id")
                var Cod_Producto = arrayValidacion.includes($("#Cod_Producto").val())?"": $("#Cod_Producto").val()
                var Cod_Almacen = $("#Cod_Almacen option:selected").text()//$("#Cod_Almacen").val()
                var Cod_UnidadMedida = $("#Cod_UnidadMedida option:selected").text()
                var Stock = $("#Stock").val()
                var Cantidad = $("#Cantidad").val()
                var Nom_Producto = $("#Nom_Producto").val()
                var Importe = $("#Importe").val()
                var Precio_Unitario = $("#Precio_Unitario").val()
                var Descuento = $("#Descuento").val()
                var Cod_TipoPrecio = arrayValidacion.includes($("#Cod_TipoPrecio").val())?"":$("#Cod_TipoPrecio").val()
                var Cod_TipoOperatividad = $("#Cod_TipoOperatividad").val()

                var flagGasto = $("#optEsGasto").is(":checked")
                var rows = $("#tablaBody > tr").length
                var idFila = contador+$("#Nom_Producto").attr("data-id")
                var fila = yo`
                <tr id="${idFila}">
                    <td class="id_ComprobantePago hidden"><input value="0"></td>
                    <td class="id_Detalle hidden"><input value="${rows}"></td> 
                    <td class="Id_Producto hidden"><input value="${flagGasto?'0':Id_Producto}"></td> 
                    <td class="Codigo hidden">${flagGasto?'':Cod_Producto}</td>
                    <td class="Descripcion" style="width: 24%;"><input type="text" class="form-control input-sm" value="${Nom_Producto}"></td>
                    <td class="Almacen"><input type="text" class="form-control input-sm" data-id=${flagGasto?null:$("#Cod_Almacen").val()} value=${flagGasto?'':Cod_Almacen}></td> 
                    <td class="UM"><input type="text" class="form-control input-sm" data-id=${flagGasto?null:$("#Cod_UnidadMedida").val()} value=${flagGasto?'':Cod_UnidadMedida}></td>
                    <td class="Stock hidden"><input type="number" class="form-control input-sm" value=${flagGasto?"0":Stock}></td> 
                    <td class="Cantidad"><input type="number" class="form-control input-sm" value=${flagGasto?"1":Cantidad} onkeyup=${()=>EditarCantidad(idFila,CodLibro,variables)} onchange=${()=>EditarCantidad(idFila,CodLibro,variables)}></td> 
                    <td class="Despachado hidden">${flagGasto?"1":Cantidad}</td> 
                    <td class="PU"><input type="number" data-value=${flagGasto?0:Precio_Unitario} class="form-control input-sm" value=${flagGasto?Importe:Precio_Unitario} onkeyup=${()=>EditarPrecioUnitario(idFila,CodLibro,variables)} onchange=${()=>EditarPrecioUnitario(idFila,CodLibro,variables)}></td> 
                    <td class="Descuento"><input type="number" data-value=0 class="form-control input-sm" value=${flagGasto?"0":Descuento} onkeyup=${()=>EditarDescuento(idFila,CodLibro,variables)} onchange=${()=>EditarDescuento(idFila,CodLibro,variables)} ></td> 
                    <td class="Importe"><input type="number" class="form-control input-sm" value=${flagGasto?Importe:Importe}></td>
                    <td class="Cod_Manguera hidden">${flagGasto?'':Cod_TipoPrecio}</td>  
                    <td class="Tipo hidden">${flagGasto?'NGR':Cod_TipoOperatividad}</td> 
                    <td class="Obs_ComprobanteD hidden"></td> 
                    <td class="Series hidden"><input class="form-control" type="text" value=${JSON.stringify([])} name="Series"></td>
                    <td>
                    <div style="display:flex;">
                        <button type="button" onclick="${()=>AsignarSeries(idFila,CodLibro)}" class="btn btn-primary btn-sm"><i class="fa fa-tasks"></i></a>  
                        <button type="button" onclick="${()=>EliminarFila(idFila,CodLibro,variables)}" class="btn btn-danger btn-sm"><i class="fa fa-trash"></i></button>
                    </div>
                    </td>
                </tr>`
                $("#tablaBody").append(fila)
                contador++

                CalcularTotal(CodLibro,variables)
                $("#Nom_Producto").attr("data-id",null)
                $("#Stock").val("")
                $("#Precio_Unitario").val("0.00")
                $("#Cantidad").val("0.00")
                $("#Importe").val("0.00")
                $("#Descuento").val("0.00")

                //$("#Nom_Producto").attr("data-id",null)
                $("#Cod_Producto").val(null)
                $("#Cod_Almacen").val("")
                $("#Cod_UnidadMedida").text("")
                $("#Stock").val("")
                $("#Nom_Producto").val("") 
                $("#Cod_TipoPrecio").val(null)
                $("#Cod_TipoOperatividad").val("")

            }else{
                BuscarProductoCP(CodLibro)
            }
        }else{
            $("#Nom_Producto").focus()
        }
    }
   
}


function AplicarPercepcion(CodLibro,variables){
    if($("#PorcentajePercepcion").val().trim()!=""){
        var Cod_TipoComprobante = $("#Cod_TipoComprobante").val()
        var Serie = $("#Serie").val()
        var Numero = $("#Numero").val()
        var Calculo = ((parseFloat($("#Gran_Total").val())*parseFloat($("#PorcentajePercepcion").val()))/100).toFixed(2)
        var idFila = "P"+contadorPercepcion
        var fila = yo`
                <tr id="${idFila}">
                    <td class="id_ComprobantePago hidden"><input value="0"></td>
                    <td class="id_Detalle hidden"><input value="0"></td> 
                    <td class="Id_Producto hidden"><input value="0"></td> 
                    <td class="Codigo hidden"></td>
                    <td class="Descripcion" style="width: 24%;"><input type="text" class="form-control input-sm" value="PERCEPCION ${Cod_TipoComprobante} : ${Serie} - ${Numero}"></td>
                    <td class="Almacen"><input type="text" class="form-control input-sm" data-id=null></td> 
                    <td class="UM"><input type="text" class="form-control input-sm" data-id=null></td>
                    <td class="Stock hidden"><input type="number" class="form-control input-sm" value="1"></td> 
                    <td class="Cantidad"><input type="number" class="form-control input-sm" value="1"></td> 
                    <td class="Despachado hidden">1</td> 
                    <td class="PU"><input type="number" class="form-control input-sm" value="${Calculo}" data-value=0></td> 
                    <td class="Descuento"><input type="number" class="form-control input-sm" value="0.00" data-value=0></td> 
                    <td class="Importe"><input type="number" class="form-control input-sm" value="${Calculo}"></td>
                    <td class="Cod_Manguera hidden"></td>  
                    <td class="Tipo hidden">PER</td> 
                    <td class="Obs_ComprobanteD hidden"></td> 
                    <td class="Series hidden"><input class="form-control" type="text" value=${JSON.stringify([])} name="Series"></td>
                    <ul class="dropdown-menu"> 
                        <li><a href="javascript:void(0)" onclick="${()=>AsignarSeries(idFila,CodLibro)}">Asignar Serie</a></li>
                        <li><a href="javascript:void(0)" onclick="${()=>EliminarFila(idFila,CodLibro,variables)}"><i class="fa fa-close"></i> Eliminar</a></li>
                    </ul>
                </tr>`
        $("#tablaBody").append(fila)
        contadorPercepcion++
        CalcularTotal(CodLibro,variables)
        $("#modal-otros-procesos").modal('hide')
    }else{
        toastr.error('Error al ingresar el procentaje de Percepcion, intentelo de nuevo.','Error',{timeOut: 5000})
    }
}

function AgregarFilaFormaPago(pDescFormaPago,pCodFormaPago,pCodMoneda,pMonto,pTipoCambio,pReferencia,Tipo_Cambio,Cod_Moneda){

    const fecha = new Date()
    const mes = fecha.getMonth() + 1
    const dia = fecha.getDate()
    var fecha_actual = fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)
    var index = $("#tablaBodyPagosMultiples > tr").length


    var fila = yo`
    <tr id="FP${index}">
        <td name="Tipo" data-id="${pCodFormaPago}" class="Tipo">${pDescFormaPago}</td>
        <td name="Cod_Moneda" class="Cod_Moneda"> ${pCodMoneda} </td>
        <td class="Monto">${pMonto}</td>
        <td name="TipoCambio" class="TipoCambio">${pTipoCambio}</td>
        <td name="TipoCambioEquivalente" class="TipoCambioEquivalente">${parseFloat(pTipoCambio)/parseFloat(Tipo_Cambio)}</td>
        <td name="Total" class="Total" data-value="${(parseFloat(pMonto)*parseFloat(pTipoCambio)).toFixed(2)}">${((parseFloat((parseFloat(pMonto)*parseFloat(pTipoCambio)).toFixed(2)))*(parseFloat(pTipoCambio)/parseFloat(Tipo_Cambio))).toFixed(2)}</td>
        <td name="Fecha" class="Fecha"><input type="date" class="form-control input-sm" value="${fecha_actual}"></td>
        <td name="Referencia" class="Referencia"><input class="form-control input-sm" value="${pReferencia==null?"":pReferencia}"></td>
        <td><button type="button" class="btn btn-danger btn-sm" onclick=${()=>EliminarFilaPagosMultiples(index,Cod_Moneda,Tipo_Cambio)}><i class="fa fa-trash"></i></button></td>
    </tr>`
    $("#tablaBodyPagosMultiples").append(fila)
    $("#MontoFormaPago").val("0.00")
    $("#MontoFormaPago").focus()
}

function CargarModalConfirmacionAsignarCredito(){
    var el = yo`
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
                <h4 class="modal-title"> Confirmacion </h4>
            </div>
            <div class="modal-body">
                <p>Esta Seguro que desea asignar el credito</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="btnConfirmacion" onclick=${()=>AceptarConfirmacionAsignarCredito()}>Aceptar</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>`


    var modal_alerta = document.getElementById('modal-alerta');
    empty(modal_alerta).appendChild(el);
    $('#modal-alerta').modal()
}

function LlenarFormasPago(Cod_Moneda,Tipo_Cambio){

    const fecha = new Date()
    const mes = fecha.getMonth() + 1
    const dia = fecha.getDate()
    var fecha_actual = fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)
    
    var tabla = yo`<table id="tablaPagosMultiples" class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>Tipo</th>
                            <th>Moneda</th> 
                            <th>Monto</th>
                            <th>T/C en S</th>
                            <th>T/C Equi</th>
                            <th>Total</th>
                            <th>Fecha</th>
                            <th># Ref.</th>
                        </tr>
                    </thead>
                    <tbody id="tablaBodyPagosMultiples">
                        ${listaFormaPago.map((u,index) => 
                                yo`
                                <tr id="FP${index}">
                                    <td name="Tipo" data-id="${u.CodTipoFormaPago}" class="Tipo">${u.DesFormaPago}</td>
                                    <td name="Cod_Moneda" class="Cod_Moneda"> ${u.CodMoneda} </td>
                                    <td class="Monto">${u.Monto}</td>
                                    <td name="TipoCambio" class="TipoCambio">${u.TipoCambio}</td>
                                    <td name="TipoCambioEquivalente" class="TipoCambioEquivalente">${parseFloat(u.TipoCambio)/parseFloat(Tipo_Cambio)}</td>
                                    <td name="Total" class="Total" data-value="${(parseFloat(u.Monto)*parseFloat(u.TipoCambio)).toFixed(2)}">${((parseFloat((parseFloat(u.Monto)*parseFloat(u.TipoCambio)).toFixed(2)))*(parseFloat(u.TipoCambio)/parseFloat(Tipo_Cambio))).toFixed(2)}</td>
                                    <td name="Fecha" class="Fecha"><input type="date" class="form-control input-sm" value="${u.Fecha==null?fecha_actual:u.Fecha}"></td>
                                    <td name="Referencia" class="Referencia"><input  class="form-control input-sm" value="${u.CuentaCajaBanco==null?"":u.CuentaCajaBanco}"></td>
                                    <td><button type="button" class="btn btn-danger btn-sm" onclick=${()=>EliminarFilaPagosMultiples(index,Cod_Moneda,Tipo_Cambio)}><i class="fa fa-trash"></i></button></td>
                                </tr>`
                        )}
                    </tbody>
                </table>`

    empty(document.getElementById('contenedorPagosMultiples')).appendChild(tabla);
  
}


function LlenarCuentaBancaria(cuentas,CodLibro){
    var html = ''
    for(var i=0; i<cuentas.length; i++){
        html = html+'<option value="'+cuentas[i].Cod_CuentaBancaria+'">'+cuentas[i].Des_CuentaBancaria+'</option>'
    }
     
    $("#Cod_CuentaBancaria").html('')
    $("#Cod_CuentaBancaria").html(html) 
    CambioCodCuentaBancaria(CodLibro)
}

function LlenarCuentaBancaria_(cuentas,CodLibro){
    var html = ''
    for(var i=0; i<cuentas.length; i++){
        html = html+'<option value="'+cuentas[i].NroCuenta_Bancaria+'">'+cuentas[i].CuentaBancaria+'</option>'
    }
     
    $("#Cod_CuentaBancaria").html('')
    $("#Cod_CuentaBancaria").html(html) 
    CambioCodCuentaBancaria(CodLibro)
}

function LlenarPagosAdelantados(cuentas){
    var html = ''
    for(var i=0; i<cuentas.length; i++){
        html = html+'<option value="'+cuentas[i].id_Movimiento+'">'+cuentas[i].Des_Movimiento+'</option>'
    }
     
    $("#Cuenta_CajaBancos").html('')
    $("#Cuenta_CajaBancos").html(html) 
}

function LlenarSeries(series){
    var html = ''
    for(var i=0; i<series.length; i++){
        html = html+'<option value="'+series[i].Serie+'">'+series[i].Serie+'</option>'
    }
     
    $("#Serie").html('')
    $("#Serie").html(html) 
}

function LlenarAlmacenes(almacenes,Cod_Almacen){
    var html = ''
    for(var i=0; i<almacenes.length; i++){
        if(Cod_Almacen==almacenes[i].Cod_Almacen)
            html = html+'<option value="'+almacenes[i].Cod_Almacen+'" selected>'+almacenes[i].Des_Almacen+'</option>'
        else    
            html = html+'<option value="'+almacenes[i].Cod_Almacen+'">'+almacenes[i].Des_Almacen+'</option>'
    }
     
    $("#Cod_Almacen").html('')
    $("#Cod_Almacen").html(html) 
}

function LlenarCheques(cheques){
    var html = ''
    for(var i=0; i<cheques.length; i++){
        html = html+'<option value="'+cheques[i].Id_MovimientoCuenta+'">'+cheques[i].Des_Movimiento+'</option>'
    }
     
    $("#Cuenta_CajaBancos").html('')
    $("#Cuenta_CajaBancos").html(html) 
}


function LlenarLicitaciones(licitaciones){
    var html = ''
    for(var i=0; i<licitaciones.length; i++){
        html = html+'<option value="'+licitaciones[i].Cod_Licitacion+'">'+licitaciones[i].Des_Licitacion+'</option>'
    }
     
    $("#Cod_Licitacion").html('')
    $("#Cod_Licitacion").html(html) 
}

function LlenarUnidadMedida(unidades_medidas){
    var html = ''
    for(var i=0; i<unidades_medidas.length; i++){
        html = html+'<option value="'+unidades_medidas[i].Cod_UnidadMedida+'">'+unidades_medidas[i].Nom_UnidadMedida+'</option>'
    }
     
    $("#Cod_UnidadMedida").html('')
    $("#Cod_UnidadMedida").html(html) 
}


function LlenarTipoPrecio(tipos_precio){
    var html = ''
    for(var i=0; i<tipos_precio.length; i++){
        html = html+'<option value="'+tipos_precio[i].Cod_TipoPrecio+'">'+tipos_precio[i].Nom_Precio+'</option>'
    }
     
    $("#Cod_TipoPrecio").html('')
    $("#Cod_TipoPrecio").html(html) 
}
 

function KeyPressPrecioUnitario(){
    try{
        $("#Importe").val((parseFloat($("#Cantidad").val())*parseFloat($("#Precio_Unitario").val())).toFixed(2))
     }catch(e){
      $("#Importe").val("0.00")
     }
     $("#Importe").focus()
}

function KeyPressCantidad(CodLibro){
    if($("#Stock").val()!=""){
       if(CodLibro=="14" && parseFloat($("#Cantidad").val())>parseFloat($("#Stock").val())){

       }else{
           try{
              $("#Importe").val((parseFloat($("#Cantidad").val())*parseFloat($("#Precio_Unitario").val())).toFixed(2))
           }catch(e){
            $("#Importe").val("0.00")
           }
       }
    }
  
}

function KeyEnterImporte(event,CodLibro,variables){
 
    try{
       $("#Cantidad").val(parseFloat($("#Importe").val())/parseFloat($("#Precio_Unitario").val()))
       //CalcularTotal(CodLibro,variables)
    }catch(e){
        $("#Cantidad").val("0")
        //CalcularTotal(CodLibro,variables)
    }

    event.stopImmediatePropagation();
    if( event.which == 13 ){
        AgregarFilaTabla(CodLibro,variables)  
    }


}

function AbrirModalFormasPago(variables,fecha_actual){
    H5_loading.show();
    var FechaHora = $("#Fecha").val()
    var Cod_Moneda = $("#Cod_Moneda").val()
    var Tipo_Cambio = $("#Tipo_Cambio").val()
    var Gran_Total = $("#Gran_Total").val()
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Cod_Moneda,
            FechaHora
        })
    }
    fetch(URL + '/comprobantes_pago_api/get_variables_formas_pago', parametros)
        .then(req => req.json())
        .then(res => {
            //console.log(res.data)
            variables['tipos_cambios']=res.data.tipos_cambios
            if (res.respuesta == 'ok') {
                VerModalFormasPago(variables,0,Tipo_Cambio,parseFloat(Gran_Total)/parseFloat(Tipo_Cambio),Cod_Moneda)
            } 
            H5_loading.hide();
        })
}


function EditarCantidad(idFila,CodLibro,variables){
    $("#"+idFila).find("td.Despachado").text($("#"+idFila).find("td.Cantidad").find('input').val())
    $("#"+idFila).find("td.Importe").find('input').val(parseFloat($("#"+idFila).find("td.PU").find('input').val())*parseFloat($("#"+idFila).find("td.Cantidad").find('input').val()))
    CalcularTotal(CodLibro,variables)
}

function EditarPrecioUnitario(idFila,CodLibro,variables){ 
    $("#"+idFila).find("td.Descuento").find('input').attr("data-value",parseFloat($("#"+idFila).find("td.PU").find('input').val())*parseFloat($("#"+idFila).find("td.Descuento").find('input').val())/100)
    $("#"+idFila).find("td.PU").find('input').attr("data-value",parseFloat($("#"+idFila).find("td.PU").find('input').val())*parseFloat($("#"+idFila).find("td.Descuento").find('input').val()))
    $("#"+idFila).find("td.Importe").find('input').val(parseFloat($("#"+idFila).find("td.PU").find('input').val())*parseFloat($("#"+idFila).find("td.Cantidad").find('input').val()))
    CalcularTotal(CodLibro,variables)
}


function EditarDescuento(idFila,CodLibro,variables){
    $("#"+idFila).find("td.Descuento").find('input').attr("data-value",parseFloat($("#"+idFila).find("td.PU").find('input').val())*parseFloat($("#"+idFila).find("td.Descuento").find('input').val())/100)
    $("#"+idFila).find("td.PU").find('input').attr("data-value",parseFloat($("#"+idFila).find("td.PU").find('input').val())*parseFloat($("#"+idFila).find("td.Descuento").find('input').val()))
    $("#"+idFila).find("td.Importe").find('input').val((parseFloat($("#"+idFila).find("td.PU").find('input').val()) - parseFloat($("#"+idFila).find("td.Descuento").find('input').val()))*(parseFloat($("#"+idFila).find("td.Cantidad").find('input').val())))
    CalcularTotal(CodLibro,variables)
}

function EliminarFila(idFila,CodLibro,variables){
    $("#"+idFila).remove()
    CalcularTotal(CodLibro,variables)
}

function EliminarFilaPagosMultiples(idFila,Cod_Moneda,Tipo_Cambio){
  $("#FP"+idFila).remove()
  CalcularSaldo(Cod_Moneda,Tipo_Cambio)
  if(aSaldo==0){
    $("#btnAceptarFormaPago").css("display","inline-block")
  }else{
    $("#btnAceptarFormaPago").css("display","none")
  }

  if(aSaldo==0){
    $("#btnAgregarMontoFormaPago").css("display","none")
    $("#divCompSaldo").css("display","none")
  }else{
    $("#btnAgregarMontoFormaPago").css("display","block")
    $("#divCompSaldo").css("display","block")
  }

  $("#MontoFormaPago").val("0.00")
  $("#MontoFormaPago").focus()
}


function CalcularTotal(CodLibro,variables){ 
    
    var Suma = 0
    var SumaExoneracion = 0
    var SumaPercepcion = 0
    var SumaDescuento = 0
    var SumaGratuitas = 0
    var DescuentosGlobales = $("#Descuento_Global").val() 
 
    $('#tablaBody tr').each(function () {

        var tipo = $(this).find("td").eq(14).text()
        var sub_total = $(this).find("td").eq(12).find("input").val()
        var descuento = $(this).find("td").eq(11).find("input").attr("data-value")
        var cantidad = $(this).find("td").eq(8).find("input").val()
        var DescuentosGlobales = parseFloat($("#Descuento_Global").val())

        switch(tipo){
            case "GRT": // GRATUITAS
                SumaGratuitas += parseFloat(sub_total)
                break
            case "GRA": // GRAVADAS
                Suma += parseFloat(sub_total)
                break
            case "INA": // INAFECTAS
                SumaExoneracion += parseFloat(sub_total)
                break
            case "EXO": // EXONERADAS
                SumaExoneracion +=  parseFloat(sub_total)
                break
            case "PER": // PERCEPCION
                SumaPercepcion +=  parseFloat(sub_total)
                break
            case "OTR": // OTROS
                SumaExoneracion +=  parseFloat(sub_total)
                break
            case "NGR": // NO GRAVADAS
                Suma +=  parseFloat(sub_total)
                break
            default:
                Suma +=  parseFloat(sub_total)
                break
        }

        if(CodLibro=="14" && parseFloat(descuento)!=0)
            SumaDescuento+= parseFloat(cantidad) * parseFloat(descuento)
    
    });

    if(SumaExoneracion>0){
        $("#laExonerado").css("display","block")
        $("#Exonerado").css("display","block")
        $("#Exonerado").val(SumaExoneracion)
    }else{
        $("#laExonerado").css("display","none")
        $("#Exonerado").css("display","none")
        $("#Exonerado").val(0)
    }

    if(SumaPercepcion>0){
        $("#laPercepcion").css("display","block")
        $("#Percepcion").css("display","block")
        $("#Percepcion").val(SumaPercepcion)
    }else{
        $("#laPercepcion").css("display","none")
        $("#Percepcion").css("display","none")
        $("#Percepcion").val(0)
    }

    if(SumaGratuitas>0){
        $("#laGratuitas").css("display","block")
        $("#Gratuitas").css("display","block")
        $("#Gratuitas").val(SumaGratuitas)
    }else{
        $("#laGratuitas").css("display","none")
        $("#Gratuitas").css("display","none")
        $("#Gratuitas").val(0)
    }

    if(SumaDescuento>0){
        $("#laDescuento").css("display","block")
        $("#DescuentoTotal").css("display","block")
        $("#DescuentoTotal").val(SumaDescuento.toFixed(2))
    }else{
        $("#laDescuento").css("display","none")
        $("#DescuentoTotal").css("display","none")
        $("#DescuentoTotal").val(0)
    } 

    if($("#ckbAplicaImpuesto").is(":checked")){
        if($("#ckbIncluyeIGV").is(":checked")){
            $("#Gran_Total").val(Suma+SumaExoneracion+SumaGratuitas+SumaPercepcion-DescuentosGlobales)
            var porcDescuentoglobal = ((parseFloat($("#Descuento_Global").val())*100)/(parseFloat($("#Gran_Total").val())+parseFloat($("#Descuento_Global").val())))/100
            Suma = Suma - Suma * porcDescuentoglobal
            $("#subtotal").val((Suma/(1+parseFloat(variables.empresa.Por_Impuesto)/100)).toFixed(2))
            $("#Impuesto").val((parseFloat($("#subtotal").val())*parseFloat(variables.empresa.Por_Impuesto)/100).toFixed(2))
        }else{
            $("#subtotal").val(Suma)
            $("#Impuesto").val((parseFloat($("#subtotal").val())*parseFloat(variables.empresa.Por_Impuesto)/100).toFixed(2))
            $("#Gran_Total").val(Suma+SumaExoneracion+SumaGratuitas+SumaPercepcion+parseFloat($("#Impuesto").val())-parseFloat(DescuentosGlobales))
            if(parseFloat($("#Descuento_Global").val())>0){
                $("#Impuesto").val((parseFloat($("#Gran_Total").val())*parseFloat(variables.empresa.Por_Impuesto)/100).toFixed(2))
                $("#subtotal").val(parseFloat($("#Gran_Total").val())-parseFloat($("#Impuesto").val()))
            }
        }
    }else{
        $("#Gran_Total").val(Suma+SumaExoneracion+SumaGratuitas+SumaPercepcion-DescuentosGlobales)
        $("#subtotal").val(Suma)
        $("#Impuesto").val(0)
    }
 

    $("#laSON").text(ConvertirCadena(parseFloat($("#Gran_Total").val()),$("#Cod_Moneda option:selected").text()))
    return true
}

function AgregarMontoFormaPago(Cod_Moneda,Tipo_Cambio){
    if(parseFloat($("#MontoFormaPago").val())>0){
        var _TipoCambio = 0
        var _CodMoneda = ""
        var _DesFormaPago = ""
        var _CodFormaPago = ""
        if($('input[name=Cod_FormaPago_Modal]:checked').val() == 'mastercard' || $('input[name=Cod_FormaPago_Modal]:checked').val() == 'visa'){
            if($('input[name=Cod_FormaPago_Modal]:checked').val()=="visa"){
                _DesFormaPago = "VISA NET"
                _CodFormaPago = "005"
            }else{
                _DesFormaPago = "MASTERCARD"
                _CodFormaPago = "006"
            }
        }else{
            _DesFormaPago = "EFECTIVO"
            _CodFormaPago = "008"            
        }

        if($('input[name=Cod_Moneda_Forma_Pago]:checked').val() == 'soles'){
            _CodMoneda = "PEN"
            _TipoCambio = 1
        }

        if($('input[name=Cod_Moneda_Forma_Pago]:checked').val() == 'dolares'){
            _CodMoneda = "USD"
            _TipoCambio = $("#Tipo_Cambio_FormaPago").val()
        }

        if($('input[name=Cod_Moneda_Forma_Pago]:checked').val() == 'euros'){
            _CodMoneda = "EUR"
            _TipoCambio = $("#Tipo_Cambio_FormaPago").val()
        }

        if(_CodFormaPago=="005" || _CodFormaPago=="006"){
            
            if($("#ReferenciaFormaPago").val()!=""){
                AgregarFilaFormaPago(_DesFormaPago, _CodFormaPago, _CodMoneda, parseFloat($("#MontoFormaPago").val()).toFixed(2),  parseFloat(_TipoCambio).toFixed(3), $("#ReferenciaFormaPago").val(),Tipo_Cambio,Cod_Moneda);
            }
            else{
                toastr.error('Para pagos con tarjeta debe especificar un numero de tarjeta','Error',{timeOut: 5000})
                $("#RecuperarTipoCambio").focus();
            }

        }else{
            AgregarFilaFormaPago(_DesFormaPago, _CodFormaPago, _CodMoneda, parseFloat($("#MontoFormaPago").val()).toFixed(2),  parseFloat(_TipoCambio).toFixed(3), '',Tipo_Cambio,Cod_Moneda);
        }

    }else{
        toastr.error('El monto introduciudo debe ser mayor a 0','Error',{timeOut: 5000})  
        $("#MontoFormaPago").val("0.00")
        $("#MontoFormaPago").focus()
    }
    CalcularSaldo(Cod_Moneda,Tipo_Cambio)

    $("#MontoFormaPago").focus()
    
    if(aSaldo == 0)
        $("#btnAceptarFormaPago").css("display","inline-block")
    else
        $("#btnAceptarFormaPago").css("display","none")
    
    if(aSaldo == 0){
        $("#btnAgregarMontoFormaPago").css("display","none")
        $("#divCompSaldo").css("display","none")
    }else{
        $("#btnAgregarMontoFormaPago").css("display","block")
        $("#divCompSaldo").css("display","block")
    }
}

function CompletarSaldo(){
    try{
        if($('input[name=Cod_Moneda_Forma_Pago]:checked').val() == 'soles'){
            $("#MontoFormaPago").val(parseFloat(aSaldo).toFixed(2))
        }
        
        if($('input[name=Cod_Moneda_Forma_Pago]:checked').val() == 'dolares' || $('input[name=Cod_Moneda_Forma_Pago]:checked').val() == 'euros'){
            $("#MontoFormaPago").val((parseFloat(aSaldo)/parseFloat($("#Tipo_Cambio_FormaPago").val())).toFixed(2))
        }
    }catch(e){
        toastr.error('Error, valor no valido: -'+ $("#MontoFormaPago").val()+ ' es menor que 0','Error',{timeOut: 5000})
    }

}

function CalcularSumaTotales(callback){
    var SumaTotales = 0
    $('#tablaBodyPagosMultiples tr').each(function () {
        SumaTotales += parseFloat(parseFloat($(this).find("td").eq(5).text()).toFixed(2))
    });
    callback(SumaTotales)
}

function CalcularSaldo(Cod_Moneda,Tipo_Cambio){
    if($('#btnCreditoFormaPagoHeader').attr("disabled") != true ){
        CalcularSumaTotales(function(SumaTotales){ 
            aSaldo = aMonto - SumaTotales
            $("#btnSaldo").text("Saldo: "+Cod_Moneda+" "+(parseFloat(aSaldo)/parseFloat(Tipo_Cambio)).toFixed(2))
            $("#btnSaldo").attr("data-value",parseFloat(aSaldo).toFixed(2)) 
        }) 
       
    }else{
        aSaldo = 0
        $("#btnSaldo").text("Saldo: "+Cod_Moneda+" "+(parseFloat(aSaldo)/parseFloat(Tipo_Cambio)).toFixed(2))
        $("#btnSaldo").attr("data-value",parseFloat(aSaldo).toFixed(2))
    }
}


function InicializarCredito(){
    /*
    kryptonGroupBox1.Enabled = false;
            kryptonGroupBox2.Visible = false;
            gbMonedas.Enabled = false;
            gbTarjetas.Enabled = false;
            btsCredito.Enabled = ButtonEnabled.True;
            dgvFormasPago.Enabled = false;
            btEliminarFila.Enabled = ButtonEnabled.False;
            btsCredito.Checked = ButtonCheckState.Checked;
    */
   $("#btnCreditoFormaPagoHeader").attr("disabled",false)
   $("#btnCreditoFormaPagoHeader").attr("checked",true)
}

function HabilitarBotones(){
    
    /*kryptonGroupBox1.Enabled = true;
    kryptonGroupBox2.Visible = true;
    gbMonedas.Enabled = true;
    gbTarjetas.Enabled = true;
    dgvFormasPago.Enabled = true;
    btCompletarMonto.Visible = true;
    btCompletarMonto.Enabled = true;
    btEliminarFila.Enabled = ButtonEnabled.True;
    btsCredito.Checked = ButtonCheckState.Unchecked;*/

    $("#divCompSaldo").css("display","block")
    $("#btnCompletarSaldo").attr("disabled",false)
    $("#btnCreditoFormaPagoHeader").attr("checked",false)
}

function AceptarConfirmacionAsignarCredito(){
       /*
        InicializarCredito();
                    aComprobante.CodFormaPago = "999";
                    aComprobante.Guardar();
                    (new CForma_pago()).EliminarFormasPagoXIdComprobante(aIdComprobante);
                    this.Aceptar();
       */

       InicializarCredito()
       var Cod_FormaPago = "999"
       $('#modal-alerta').modal('hide')

}

function AsignarCredito(){
    if($("#btnCreditoFormaPagoHeader").is(":checked")){
       CargarModalConfirmacionAsignarCredito()
    }else{
      HabilitarBotones()
    }
}

function AsignarSeries(idFila,CodTipoComprobante){
    idFilaSeleccionadaSerie = idFila
    var Cod_Almacen = $("tr#"+idFila).find("td.Almacen").find('input').val()
    var Id_Producto =$("tr#"+idFila).find("td.Id_Producto").find("input").val()
    var Cantidad = parseFloat($("tr#"+idFila).find("td.Cantidad").find("input").val())
    var Series = JSON.parse($("tr#"+idFila).find("td.Series").find("input").val())
    var NroDias = CodTipoComprobante=="14"?60:0
    var Stock = CodTipoComprobante=="14"?0:1 
    if(!arrayValidacion.includes(Id_Producto))
        AsignarSeriesModal(Cod_Almacen, Id_Producto,Cantidad,NroDias,Series,null,Stock)
}

function RecuperarTipoCambio(Cod_Moneda,variables,Tipo_Cambio){ 
    if(arrayValidacion.includes($("#Tipo_Cambio_FormaPago").attr("data-value"))){
        var _Tipo_Cambio = 1
        _Tipo_Cambio = variables.tipos_cambios.length==0?"1":variables.tipos_cambios[0].Venta
        _Tipo_Cambio = parseFloat(_Tipo_Cambio).toFixed(3)
        $("#Tipo_Cambio_FormaPago").val(Tipo_Cambio)
        var _cadena = Cod_Moneda+ "|" + Tipo_Cambio
        $("#Tipo_Cambio_FormaPago").attr("data-value",_cadena)
    }else{
        var valor = $("#Tipo_Cambio_FormaPago").attr("data-value").split("|")
        if(valor[0]==Cod_Moneda){
            $("#Tipo_Cambio_FormaPago").val(parseFloat(valor[1]))
        }else{
            var _Tipo_Cambio = 1
            _Tipo_Cambio = variables.tipos_cambios.length==0?"1":variables.tipos_cambios[0].Venta
            _Tipo_Cambio = parseFloat(_Tipo_Cambio).toFixed(3)
            $("#Tipo_Cambio_FormaPago").val(Tipo_Cambio)
        }
    }
}

function AceptarFormaPago(amodo){
   
    switch(amodo){
        case 0:
            $('#tablaBodyPagosMultiples tr').each(function (index) {
 
                listaFormaPago.push({
                    idComprobantePago:0,
                    Item:index+1,
                    IdMovimiento:0,
                    CodTipoFormaPago:$(this).find("td").eq(0).attr("data-id"),
                    DesFormaPago:$(this).find("td").eq(0).text(),
                    CodMoneda:$(this).find("td").eq(1).text(),
                    Monto:$(this).find("td").eq(2).text(), 
                    TipoCambio:$(this).find("td").eq(3).text(), 
                    CuentaCajaBanco:$(this).find("td").eq(7).find("input").val(), 
                    Fecha:$(this).find("td").eq(6).find("input").val(), 
                })   
            });
            
            $("input[name=optCredito][value='credito']").prop("checked",true);
            $("#divContado").css("display","none")
            $("#divCredito").css("display","none")
            $("#divNroDias").css("display","none")
            $("#divMoneda").css("display","none")
            $("#divFormasPago").css("display","none")
            $("#divTC").css("display","none")
            $("#divMultiplesPagos").removeClass()
            $("#divMultiplesPagos").addClass("col-sm-12")
            $("#btnMultiplesPagos").addClass("btn-block")
            $("#btnMultiplesPagos").html('<i class="fa fa-money"></i>'+" PAGOS MULTIPLES")
            /*
              rbCredito.Checked = true;
                rbEfectivo.Visible = false;
                rbCredito.Visible = false;
                laCuentaCajaBanco.Visible = false;
                cbCuenta_CajaBancos.Visible = false;
                cbCodFormaPago.Visible = false;
                laDias.Visible = false;
                nudNroDias.Visible = false;
                laCodMoneda.Visible = false;
                cbCodMoneda.Visible = false;
                laTipoCambio.Visible = false;
                nudTipoCambio.Visible = false;

                buMultiplesPagos.Size = new Size(200, 25);
                buMultiplesPagos.Text = "PAGOS MULTIPLES";
                aListaFormasPago = _FormaPago.aFormasPago;
            

            */


            $('#modal-otros-procesos').modal('hide')   
            break
        case 1:
            $('#modal-otros-procesos').modal('hide')   
            break
    }

    
}

function OcultarCompletarSaldo(Cod_Moneda){ 
    var  _Cod_Moneda = ""
    if($('input[name=Cod_Moneda_Forma_Pago]:checked').val() == 'soles')
        _Cod_Moneda = "PEN"
    if($('input[name=Cod_Moneda_Forma_Pago]:checked').val() == 'dolares')
        _Cod_Moneda = "USD"
    if($('input[name=Cod_Moneda_Forma_Pago]:checked').val() == 'euros')
        _Cod_Moneda = "EUR"

    if((_Cod_Moneda==Cod_Moneda || _Cod_Moneda=="PEN") && aSaldo!=0)
        $("#divCompSaldo").css("display","true")
    else    
        $("#divCompSaldo").css("display","none")
}

function CargarConfiguracionDefaultFormaPago(variables,amodo,Cod_Moneda,Tipo_Cambio){
    switch (amodo) {
        case 0:
            $("#divCreditoFormasPago").css("display","none")

            $("#btnTotal").text("Total: "+Cod_Moneda+" "+(parseFloat(aMonto)/parseFloat(Tipo_Cambio)).toFixed(2))
            $("#btnTotal").attr("data-value",aMonto)

            if(Cod_Moneda!="PEN"){
                $("#divTipoCambioGlobal").css("display","block")
            }else{
                $("#divTipoCambioGlobal").css("display","none")
                $("#Tipo_Cambio_Global").val(1)
            }
            LlenarFormasPago(Cod_Moneda,Tipo_Cambio)
            CalcularSaldo(Cod_Moneda,Tipo_Cambio)
            $("#btnAceptarFormaPago").css("display","none")
            OcultarCompletarSaldo(Cod_Moneda)
            $("#Cod_MonedaGlobal").text(Cod_Moneda)
            $("#divReferencia").css("display","none")
            $("#divTipoCambio").css("display","none")
            RecuperarTipoCambio(Cod_Moneda,variables,Tipo_Cambio)
            if(aSaldo==0)
                $("#btnAgregarMontoFormaPago").css("display","none")
            else    
                $("#btnAgregarMontoFormaPago").css("display","block")
            break
        case 1:
            break
    }
}


function CargarConfiguracionDefault(CodLibro,variables){ 
 
    CambioMoneda(CodLibro)
    CambioTipoDocumento()
    CambioFormasPago(CodLibro)
    CambioCreditoContado()
     
    CargarSeries(CodLibro)
    

     
    $("#divExportacion").css("display","none")
    CalcularTotal(CodLibro,variables)
    $("input[name=optCredito][value='contado']").prop("checked",true)
    CambioLicitacion()
}

function EsValidaLicitacion(){ 
    if($("#divLicitacion").css("display")=='block'){
        if($("#optLicitacion").is(":checked")){
            if($("#Cod_Licitacion").val()!=''){
                return true
            }else{
                return false
            }
        }else{
            return true
        }
    }else{
        return true
    }
}

function EsValidoCredito(CodLibro,callback){
    if($('input[name=optCredito]:checked').val()=="credito" && $("#divCredito").css("display")=='block'){
        TraerCredito(CodLibro,function(flag){
            callback(flag)
        })
    }else{
        callback(true)
    }
}

function EsValidoSeries(CodLibro,callback){
    var flag_ = false
    if(!$("#optEsGasto").is(":checked")){ 
        RecorrerTablaDetalles_Series(0,function(flag){
            callback(flag)
        })
    }else{
        callback(true)
    }
}
 

function EsValido(CodLibro,callback){
    var MontoMaximo = 0
    if(!arrayValidacion.includes($("#Cod_FormaPago").val()) && $("#Cod_FormaPago").val()=='998' &&  !arrayValidacion.includes($("#Cuenta_CajaBancos").val())){
        try{
            MontoMaximo = parseFloat($("#Cuenta_CajaBancos option:selected").text().split('[',']')[1])
        }catch(e){
            MontoMaximo = 0
        }
    }

    if($("#divLicitacion").css("display")=='block' && $("#optLicitacion").is(":checked")){
        callback(EsValidaLicitacion())
    }

    if(!arrayValidacion.includes($("#Cliente").attr("data-id"))){
        if($("#Serie option:selected").text()!=''){
            if($("#Numero").val()!=''){
                if($("#Cod_TipoComprobante").val()!=''){
                    if($("#tablaBody > tr").length > 0){
                        if(MontoMaximo==0 || parseFloat($("#Gran_Total").val()) <= MontoMaximo){
                            if(EsValidaLicitacion()){
                                EsValidoCredito(CodLibro,function(flag){
                                    if(flag){
                                        EsValidoSeries(CodLibro,function(flag){
                                            if(flag){
                                                callback(true)
                                            }else{
                                                toastr.error('Debe de Ingresar una Serie para Cada Producto','Error',{timeOut: 5000}) 
                                                callback(false)
                                            }
                                        })
                                    }else{
                                        $("#Cliente").focus()
                                        callback(false)
                                    }
                                })
 
                            }else{
                                $("#Cod_Licitacion").focus()
                                callback(false)
                            }
                        }else{
                            toastr.error('Debe de seleccionar un Pago Adelantado que sea superior o igual al Monto Total de Comprobante','Error',{timeOut: 5000}) 
                            callback(false)
                        }
                    }else{
                        toastr.error('Debe ingresar como minimo un Detalle en el Comprobante','Error',{timeOut: 5000}) 
                        callback(false)
                    }
                }else{
                    toastr.error('Debe Selecionar un Comprobante','Error',{timeOut: 5000}) 
                    callback(false)
                }
            }else{
                toastr.error('Debe ingresar un Numero para este Comprobante','Error',{timeOut: 5000}) 
                callback(false)
            }
        }else{
            toastr.error('Debe ingresar o seleccionar una serie para este Comprobante','Error',{timeOut: 5000}) 
            callback(false)
        }
    }else{
        toastr.error('Debe seleccionar un cliente si por defecto dejarlo en CLIENTES VARIOS','Error',{timeOut: 5000}) 
        callback(false)
    }
     
}
 

function GenerarComprobante(CodLibro,variables){ 
    try{
        
        EsValido(CodLibro,function(flag){ 
            if(flag)
                AbrirModalConfirmacion(CodLibro,variables)
        })
    }catch(e){
        console.log(e)
    }
}



function RecuperarNroTicketera(indiceVariables,variables,Serie,Cod_TipoComprobante){
    if(indiceVariables < variables.length){
        if(variables[indiceVariables].Serie.toString() == Serie && variables[indiceVariables].Cod_TipoComprobante.toString()==Cod_TipoComprobante){
            if(Cod_TipoComprobante=='TKB' || Cod_TipoComprobante=='TKF'){
                return variables[indiceVariables].Nro_SerieTicketera.toString()
            }else{
                RecuperarNroTicketera(indiceVariables+1,variables,Serie,Cod_TipoComprobante)
            }
        }else{
            RecuperarNroTicketera(indiceVariables+1,variables,Serie,Cod_TipoComprobante)
        }  
    }else{
        return ""
    }
}

function DeterminarTipoIGV(flagImpuesto,flagExportacion,Por_Impuesto,Tipo,SubTotal,callback){
    var IGV = 0
    var Cod_TipoIGV = ''
    if(flagImpuesto == true){
        if(Tipo=='GRA'){
            Cod_TipoIGV = '10'
            IGV = ((parseFloat(SubTotal) / (1+parseFloat(Por_Impuesto))) * (parseFloat(Por_Impuesto)/100)).toFixed(2)
        }

        if(Tipo == 'GRT'){
            Cod_TipoIGV = '13'
        }
    }else{
        if(Tipo == 'GRA'){
            Cod_TipoIGV = '20'
        }
        if(Tipo == 'GRT'){
            Cod_TipoIGV = '21'
        }
    }   

    if(Tipo == 'INA'){
        Cod_TipoIGV = '30'
    }

    if(Tipo == 'EXO'){
        Cod_TipoIGV = '20'
    }

    if(flagExportacion){
        Cod_TipoIGV = '40'
        IGV = 0
    }
    callback(IGV,Cod_TipoIGV)
}

function GuardarLicitacion(Id_ClienteProveedor,Cod_Licitacion,Nro_Detalle,id_ComprobantePago,Flag_Cancelado,Obs_LicitacionesM,callback){
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            Id_ClienteProveedor,
            Cod_Licitacion,
            Nro_Detalle,
            id_ComprobantePago,
            Flag_Cancelado,
            Obs_LicitacionesM
        })
    }
 
    fetch(URL + '/comprobantes_pago_api/guardar_licitacion_comprobante', parametros)
        .then(req => req.json())
        .then(res => {
            if(res.respuesta=='ok'){
                callback(true)
            }else{
                callback(false)
            }
        })
}

function GuardarFormaPago(id_ComprobantePago,Item,Des_FormaPago,Cod_TipoFormaPago,Cuenta_CajaBanco,Id_Movimiento,TipoCambio,Cod_Moneda,Monto,Cod_Plantilla,Obs_FormaPago,Fecha,callback){
     
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            id_ComprobantePago,
            Item,
            Des_FormaPago,
            Cod_TipoFormaPago,
            Cuenta_CajaBanco,
            Id_Movimiento,
            TipoCambio,
            Cod_Moneda,
            Monto,
            Cod_Plantilla,
            Obs_FormaPago,
            Fecha
        })
    }
 
    fetch(URL + '/formas_pago_api/guardar_forma_pago', parametros)
        .then(req => req.json())
        .then(res => {
            if(res.respuesta=='ok'){
                callback(true)
            }else{
                callback(false)
            }
        })
}

function GuardarFormaPagoRecursivo(indiceFormaPago,idComprobante,callback){
     
   if(indiceFormaPago<listaFormaPago.length){
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                id_ComprobantePago:idComprobante,
                Item:listaFormaPago[indiceFormaPago].Item,
                Des_FormaPago:listaFormaPago[indiceFormaPago].DesFormaPago,
                Cod_TipoFormaPago:listaFormaPago[indiceFormaPago].CodTipoFormaPago,
                Cuenta_CajaBanco:listaFormaPago[indiceFormaPago].CuentaCajaBanco,
                Id_Movimiento:listaFormaPago[indiceFormaPago].IdMovimiento,
                TipoCambio:listaFormaPago[indiceFormaPago].TipoCambio,
                Cod_Moneda:listaFormaPago[indiceFormaPago].CodMoneda,
                Monto:listaFormaPago[indiceFormaPago].Monto,
                Cod_Plantilla:null,
                Obs_FormaPago:null,
                Fecha:listaFormaPago[indiceFormaPago].Fecha
            })
        }
    
        fetch(URL + '/formas_pago_api/guardar_forma_pago', parametros)
            .then(req => req.json())
            .then(res => {
                if(res.respuesta=='ok'){
                    GuardarFormaPagoRecursivo(indiceFormaPago+1,idComprobante,callback)
                }else{
                    callback(false)
                }
            })
   }else{
       callback(true)
   }
}

function GuardarOperacionBancaria(callback){
    var Cod_CuentaBancaria = $("#Cod_CuentaBancaria").val()
    var Nro_Operacion = $("#Cuenta_CajaBancos option:selected").text()
    var Des_Movimiento = $("#Cod_FormaPago option:selected").text()
    var Cod_TipoOperacionBancaria = ''
    if($("#Cod_FormaPago").val()=="007"){
        Cod_TipoOperacionBancaria ="006"
    }else{
        Cod_TipoOperacionBancaria ="001"
    }
    var Fecha = $("#Fecha").val()
    var Monto = (CodLibro=="08"?-1:1)* parseFloat($("#Gran_Total").val())
    var TipoCambio = $("#Tipo_Cambio").val()
    var Beneficiario = $("#Cliente").val()
    var Nro_Cheque = ''
    var Cod_Plantilla = null
    if($("#Cod_FormaPago").val()=="007"){
        Nro_Cheque = "00000000"+parseInt( $("#Cuenta_CajaBancos option:selected").text())
    }
    var Id_ComprobantePago = idComprobante
    var Obs_Movimiento = ''

    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            Cod_CuentaBancaria,
            Nro_Operacion,
            Des_Movimiento,
            Cod_TipoOperacionBancaria,
            Fecha,
            Monto,
            TipoCambio,
            Cod_Plantilla,
            Nro_Cheque,
            Beneficiario,
            Id_ComprobantePago,
            Obs_Movimiento
        })
    }
 
    fetch(URL + '/cuentas_bancarias_api/guardar_cuenta_movimiento', parametros)
        .then(req => req.json())
        .then(res => {
            if(res.respuesta=='ok'){
                callback(true)
            }else{
                callback(false)
            }
        })
    
}

function GuardarSeries(indiceSerie,idComprobante,idDetalle,arraySeries,callback){
    if(indiceSerie<arraySeries.length){
        var Cod_Tabla = "CAJ_COMPROBANTE_PAGO"
        var Id_Tabla = idComprobante
        var Item = idDetalle
        var Serie = arraySeries[indiceSerie].Serie
        var Fecha_Vencimiento = arraySeries[indiceSerie].Fecha
        var Obs_Serie = arraySeries[indiceSerie].Observacion

        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                Cod_Tabla,
                Id_Tabla,
                Item,
                Serie,
                Fecha_Vencimiento,
                Obs_Serie
            })
        }
     
        fetch(URL + '/series_api/guardar_serie', parametros)
            .then(req => req.json())
            .then(res => {
                if(res.respuesta=='ok'){
                    GuardarSeries(indiceSerie+1,idComprobante,idDetalle,arraySeries,callback)
                }else{
                    callback(false)
                }
            })

    }else{
        callback(true)
    }
}

function RecuperarNroDetalleXLicitacionProducto(Id_ClienteProveedor,Cod_Licitacion,Id_Producto,callback){
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            Id_ClienteProveedor,
            Cod_Licitacion,
            Id_Producto
        })
    }
 
    fetch(URL + '/comprobantes_pago_api/get_nro_detalle_by_licitacion_producto', parametros)
        .then(req => req.json())
        .then(res => {
            if(res.respuesta=='ok'){
                if(res.data.nro_detalle.length>0){
                    var Nro_Detalle = res.data.nro_detalle[0].Nro_Detalle
                    callback(Nro_Detalle)
                }else{
                    callback(-1)
                }
            }else{
                callback(-1)
            }
        })
}

function EmisionCompletaDetalles(indiceDetalle,CodLibro,variables,idComprobante,callback){
   
    if(indiceDetalle < $("#tablaBody > tr").length){
        //if($("#optEsGasto").is(":checked") || parseInt($('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(2).find('input').val())==0){ 
            var id_Detalle = indiceDetalle + 1
            var Id_Producto = ($("#optEsGasto").is(":checked") || parseInt($('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(2).find('input').val())==0)?0:parseInt($('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(2).find('input').val())
            var Cantidad = parseFloat($('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(8).find('input').val())
            var Despachado = 0
            if($("#optDescargar").is(":checked")){
                Despachado = parseFloat($('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(9).text())
            }
            var Descripcion = $('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(4).find('input').val()
            var PrecioUnitario = 0
            var Sub_Total = 0
            if($("#ckbIncluyeIGV").is(":checked")){
                PrecioUnitario = parseFloat($('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(10).find('input').val())
                Sub_Total = parseFloat($('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(12).find('input').val()).toFixed(2)
            }else{
                PrecioUnitario = parseFloat($('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(10).find('input').val()) * (1+parseFloat(variables.empresa.Por_Impuesto)/100)
                Sub_Total = (parseFloat($('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(12).find('input').val()) * (1+parseFloat(variables.empresa.Por_Impuesto)/100)).toFixed(2)
            }
            var Descuento = parseFloat($('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(11).find('input').attr("data-value"))
            var Obs_ComprobanteD = ($("#optEsGasto").is(":checked") || parseInt($('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(2).find('input').val())==0)?null: $('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(15).text()
            var Cod_Manguera = ($("#optEsGasto").is(":checked") || parseInt($('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(2).find('input').val())==0)?null: $('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(13).text()
            var Cod_Almacen = ($("#optEsGasto").is(":checked") || parseInt($('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(2).find('input').val())==0)?null:$('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(5).find('input').attr("data-id")
            var Cod_UnidadMedida = ($("#optEsGasto").is(":checked") || parseInt($('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(2).find('input').val())==0)?null:$('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(6).find('input').attr("data-id")
            var Flag_AplicaImpuesto = $("#ckbAplicaImpuesto").is(":checked")
            var Formalizado = 0
            var Tipo = $('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(14).text()
            var Valor_NoOneroso = 0
            var Cod_TipoISC = ''
            var Porcentaje_ISC = 0
            var ISC = 0
            //DeterminarTipoIGV(flagImpuesto,flagExportacion,Por_Impuesto,Tipo,SubTotal,callback)
            var Flag_Exportacion = ($("#divExportacion").css("display")=="block" &&  $("#optExportacion").is(":checked"))?true:false
            DeterminarTipoIGV(variables.empresa.Flag_ExoneradoImpuesto,Flag_Exportacion,variables.empresa.Por_Impuesto,$('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(14).text(),parseFloat(parseFloat($('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(12).find('input').val()).toFixed(2)),function(IGV,Cod_TipoIGV){
                var Porcentaje_IGV = parseFloat(variables.empresa.Por_Impuesto)
                
                const parametros = {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify({
                        id_ComprobantePago:idComprobante,
                        id_Detalle,
                        Id_Producto,
                        Cod_Almacen,
                        Cantidad,
                        Cod_UnidadMedida,
                        Despachado,
                        Descripcion,
                        PrecioUnitario,
                        Descuento,
                        Sub_Total,
                        Tipo,
                        Obs_ComprobanteD,
                        Cod_Manguera,
                        Flag_AplicaImpuesto,
                        Formalizado,
                        Valor_NoOneroso,
                        Cod_TipoISC,
                        Porcentaje_ISC,
                        ISC,
                        Cod_TipoIGV,   
                        Porcentaje_IGV,
                        IGV
                    })
                }
             
                fetch(URL + '/comprobantes_pago_api/guardar_comprobante_pago_detalle', parametros)
                    .then(req => req.json())
                    .then(res => {
                        console.log(res)
                        //callback(false)
                        if (res.respuesta == 'ok') {
                           if($("#divLicitacion").css("display")=="block" && $("#optLicitacion").is(":checked")){
                                var Id_ClienteProveedor = $("#Cliente").attr("data-id")
                                var Cod_Licitacion = $("#Cod_Licitacion").val()
                                RecuperarNroDetalleXLicitacionProducto(Id_ClienteProveedor,Cod_Licitacion,Id_Producto,function(result){
                                    if(result!=-1){
                                        var Nro_Detalle = result
                                        var id_ComprobantePago = idComprobante
                                        var Flag_Cancelado = false
                                        var Obs_LicitacionesM = ""
                                        GuardarLicitacion(Id_ClienteProveedor,Cod_Licitacion,Nro_Detalle,id_ComprobantePago,Flag_Cancelado,Obs_LicitacionesM,function(flag){
                                            if(flag){
                                                let Series = JSON.parse($('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(16).find("input").val())
                                                GuardarSeries(0,idComprobante,id_Detalle,Series,function(flag){
                                                    if(flag){
                                                        EmisionCompletaDetalles(indiceDetalle+1,CodLibro,variables,idComprobante,callback)
                                                    }else{
                                                        callback(false)
                                                    }
                                                })
                                                //EmisionCompletaDetalles(indiceDetalle+1,CodLibro,variables,idComprobante)
                                            }else{
                                                callback(false)
                                            }
                                        })
                                        
                                    }else{
                                        callback(false)
                                    }
                                })
                           }else{
                                let Series = JSON.parse($('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(16).find("input").val())
                                GuardarSeries(0,idComprobante,id_Detalle,Series,function(flag){
                                    if(flag){
                                        EmisionCompletaDetalles(indiceDetalle+1,CodLibro,variables,idComprobante,callback)
                                    }else{
                                        callback(false)
                                    }
                                })
                           }
                        }else{
                            callback(false)
                        }
                    })
            })
        //} 
    }else{
        callback(true)
    }
}

function EmisionCompleta(CodLibro,variables){
    GuardarCamposEntidadComprobante(CodLibro,variables)
}

async function GuardarCamposEntidadComprobante(CodLibro,variables){
    AsyncCalcularTotal(CodLibro,variables)
    .then(data => 
        RecuperarParametrosEmisionCompleta(CodLibro,variables,data)
    )
}

/*
function CargarConfirmacionComprobante(){
    var el = yo`
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
                <h4 class="modal-title"> Confirmacion </h4>
            </div>
            <div class="modal-body">
                <iframe class="embed-responsive-item" src="${URL+'/media/documento.pdf'}"
                webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
            </div>
            <div class="modal-footer"> 
                <button type="button" class="btn btn-danger">Cancelar</button>
            </div>
        </div> 
    </div>`


    var modal_alerta = document.getElementById('modal-alerta');
    empty(modal_alerta).appendChild(el);
    $('#modal-alerta').modal()
}

function CargarIframe(){
    var el = yo`
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
                <h4 class="modal-title"> Confirmacion </h4>
            </div>
            <div class="modal-body">
                <iframe class="embed-responsive-item" src="${URL+'/media/documento.pdf'}"
                webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
            </div>
            <div class="modal-footer"> 
                <button type="button" class="btn btn-danger">Cancelar</button>
            </div>
        </div> 
    </div>`


    var modal_alerta = document.getElementById('modal-alerta');
    empty(modal_alerta).appendChild(el);
    $('#modal-alerta').modal()
}*/

function ConvertTabletoJson(callback){
    var myRows = [];
    var $headers = $("th");
    var $rows = $("#tablaBody tr").each(function(index) {
        var $cells = $(this).find("td");
        myRows[index] = {};
        $cells.each(function(cellIndex) {
            switch(cellIndex){
                case 4:
                    myRows[index]['DESCRIPCION'] = $(this).find('input').val();
                    break
                case 6:
                    myRows[index]['UNIDAD'] = $(this).find('input').val();
                    break
                case 8:
                    myRows[index]['CANTIDAD'] = $(this).find('input').val();
                    break
                case 10:
                    myRows[index]['PRECIO_UNITARIO'] = $(this).find('input').val();
                    break
                case 11:
                    myRows[index]['DESCUENTO'] = $(this).find('input').val();
                    break
                case 12:
                    myRows[index]['SUBTOTAL'] = $(this).find('input').val();
                    break
            } 
        });    
    });
    callback(myRows)
}

function PrepararImpresion( COD_LIBRO, 
                            COD_TIPOCOMPROBANTE,
                            DOCUMENTO,
                            SERIE,
                            NUMERO,
                            FLAG_ANULADO,
                            MOTIVO_ANULACION,
                            CLIENTE,
                            COD_DOCCLIENTE,
                            RUC_CLIENTE,
                            DIRECCION_CLIENTE,
                            FECHA_EMISION,
                            FECHA_VENCIMIENTO,
                            FORMA_PAGO,
                            GLOSA,
                            OBSERVACIONES,
                            MONEDA,
                            ESCRITURA_MONTO,
                            GRAVADAS,
                            EXONERADAS,
                            GRATUITAS,
                            INAFECTAS,
                            DESCUENTO,
                            DES_IMPUESTO,
                            IMPUESTO,
                            IGV,
                            TOTAL   ){
 
     
        ConvertTabletoJson(function(arrayJSON){


            EnviarImpresion(COD_LIBRO, 
                            COD_TIPOCOMPROBANTE,
                            DOCUMENTO,
                            SERIE,
                            NUMERO,
                            FLAG_ANULADO,
                            MOTIVO_ANULACION,
                            CLIENTE,
                            COD_DOCCLIENTE,
                            RUC_CLIENTE,
                            DIRECCION_CLIENTE,
                            FECHA_EMISION,
                            FECHA_VENCIMIENTO,
                            FORMA_PAGO,
                            GLOSA,
                            OBSERVACIONES,
                            MONEDA,
                            ESCRITURA_MONTO,
                            GRAVADAS,
                            EXONERADAS,
                            GRATUITAS,
                            INAFECTAS,
                            DESCUENTO,
                            DES_IMPUESTO,
                            IMPUESTO,
                            IGV,
                            TOTAL,
                            JSON.stringify(arrayJSON))
 
        })
    
}

function RecuperarParametrosEmisionCompleta(CodLibro,variables,data){
    H5_loading.show()
    var Cod_TipoComprobante = $("#Cod_TipoComprobante").val()
    var Cod_TipoOperacion = Cod_TipoDocReferencia
    var Serie = $("#Serie option:selected").text()
    var Numero = $("#Numero").val().trim()
    if((CodLibro=="14") && (Cod_TipoComprobante=="TKB" || Cod_TipoComprobante=="TKF" || Cod_TipoComprobante=="BE" || Cod_TipoComprobante=="FE" || Cod_TipoComprobante=="NP")){
        Numero = ""
    }
    var Id_Cliente = $("#Cliente").attr("data-id")
    var Cod_TipoDoc = $("#Cod_TipoDoc").val()
    var Doc_Cliente = $("#Nro_Documento").val()
    var Nom_Cliente = $("#Cliente").val()
    var Direccion_Cliente = $("#Direccion").val()
    var FechaEmision = $("#Fecha").val()
    Date.prototype.addDays = function (days) {
        var dat = new Date(this.valueOf());
        dat.setDate(dat.getDate() + days);
        return dat;
    }
    var FechaDiasMas = new Date($("#Fecha").val()).addDays(parseInt($("#Nro_Dias").val()))
    const mes = FechaDiasMas.getMonth() + 1
    const dia = FechaDiasMas.getDate()
    var FechaDiasMas_ = FechaDiasMas.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)
    var FechaVencimiento = $('input[name=optCredito]:checked').val()=="credito"? FechaDiasMas_:$("#Fecha").val()
    var FechaCancelacion = $("#Fecha").val()
    var TipoCambio =  $("#Tipo_Cambio").val()
    var Flag_Anulado = false
    var Glosa = ''
    if($("#optEsGasto").is(":checked")){
        Glosa = $('#tablaBody > tr:eq(0)').find('td').eq(4).find('input').val()
    }else{
        Glosa = $("#Glosa").val() 
    }
    var Flag_Despachado = $("#optDescargar").is(":checked")
    var Cod_FormaPago = ''
    if($('input[name=optCredito]:checked').val()=="contado"){
        Cod_FormaPago = $("#Cod_FormaPago").val()
    }else{
        Cod_FormaPago = '999'
    }
    var Descuento_Total = $("#Descuento_Global").val()
    var Cod_Moneda = $("#Cod_Moneda").val()
    var Impuesto = 0
    if($("#ckbAplicaImpuesto").is(":checked")){
        Impuesto = $("#Impuesto").val()
    }else{
        Impuesto = 0
    }
    
     $("#Gran_Total").val(parseFloat($("#Gran_Total").val()).toFixed(2))
    var Total = parseFloat($("#Gran_Total").val()).toFixed(2)
    var Id_GuiaRemision = 0
    var GuiaRemision = null
    var Nro_Ticketera = ''
    if($("#Guia").val().trim()!=""){
        try{    
            Id_GuiaRemision = parseInt($("#Guia").attr("data-id"))
        }catch(e){
            Id_GuiaRemision = 0
        }
        GuiaRemision = $("#Guia").val() 
    }
    
    var id_ComprobanteRef = 0
    if(CodLibro=="14"){
        Nro_Ticketera= RecuperarNroTicketera(indiceVariables,variables,Serie,Cod_TipoComprobante)
    }else{
        Nro_Ticketera = ''
    }
    var Cod_RegimenPercepcion = ''
    var Tasa_Percepcion = 0
    var Placa_Vehiculo = $("#placaVehiculo").val().trim()
    var Cod_TipoDocReferencia = ''
    var Nro_DocReferencia = ''
    var Valor_Resumen = ''
    var Valor_Firma = ''
    var Cod_EstadoComprobante = 'EMI'
    var Motivo_Anulacion = ''
    var Otros_Cargos = 0
    var Otros_Tributos = 0 
    var Obs_Comprobante = obs_xml
    var Cod_Plantilla = null 
    
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            Cod_Libro:CodLibro,
            Cod_TipoOperacion,
            Cod_TipoComprobante,
            Serie,
            Numero,
            Id_Cliente,
            Cod_TipoDoc,
            Doc_Cliente,
            Nom_Cliente,
            Direccion_Cliente,
            FechaEmision,
            FechaVencimiento,
            FechaCancelacion,
            Glosa,
            TipoCambio,
            Flag_Anulado,
            Flag_Despachado,
            Cod_FormaPago,
            Descuento_Total,
            Cod_Moneda,
            Impuesto,   
            Total,
            Obs_Comprobante,
            Id_GuiaRemision,
            GuiaRemision,
            id_ComprobanteRef,
            Cod_Plantilla,
            Nro_Ticketera,
            Cod_RegimenPercepcion,
            Tasa_Percepcion,
            Placa_Vehiculo,
            Cod_TipoDocReferencia,
            Nro_DocReferencia,
            Valor_Resumen,
            Valor_Firma,
            Cod_EstadoComprobante,
            Motivo_Anulacion,
            Otros_Cargos,
            Otros_Tributos
        })
    }
 
    fetch(URL + '/comprobantes_pago_api/guardar_comprobante_pago', parametros)
        .then(req => req.json())
        .then(res => { 
            if (res.respuesta == 'ok') {
                var idComprobante = res.data
                EmisionCompletaDetalles(0,CodLibro,variables,res.data,function(flag){
                   if(flag){

                        if(listaFormaPago.length==0){
                            if ($('input[name=optCredito]:checked').val() == 'contado') {
                                var id_ComprobantePago = idComprobante
                                var Item = 1
                                var Monto = $("#Gran_Total").val()
                                var Cod_Moneda = $("#Cod_Moneda").val()
                                var TipoCambio = $("#Tipo_Cambio").val()
                                var Des_FormaPago = $("#Cod_FormaPago option:selected").text()
                                var Cod_TipoFormaPago = $("#Cod_FormaPago").val()
                                var Cuenta_CajaBanco = ''
                                var Id_Movimiento = null
                                var Fecha = $("#Fecha").val()
                                
                                if($("#Cod_FormaPago").val()=="998"){
                                    Id_Movimiento = parseInt($("#Cuenta_CajaBancos").val())
                                }

                                if($("#Cod_FormaPago").val()=="008"){
                                    Cuenta_CajaBanco = ''
                                    GuardarFormaPago(id_ComprobantePago,Item,Des_FormaPago,Cod_TipoFormaPago,Cuenta_CajaBanco,Id_Movimiento,TipoCambio,Cod_Moneda,Monto,null,null,Fecha,function(flagFP){
                                        if(flagFP){
                                            toastr.success('Se registro correctamente el comprobante','Confirmacion',{timeOut: 5000})
                                            $("#modal-proceso").modal("hide")
                                            PrepararImpresion(
                                                            CodLibro,
                                                            Cod_TipoComprobante,
                                                            $("#Cod_TipoComprobante option:selected").text(),
                                                            Serie,
                                                            Numero,
                                                            false,
                                                            '',
                                                            Nom_Cliente,
                                                            Cod_TipoDoc,
                                                            Doc_Cliente,
                                                            Direccion_Cliente,
                                                            FechaEmision,
                                                            FechaVencimiento,
                                                            Des_FormaPago,
                                                            Glosa,
                                                            Obs_Comprobante,
                                                            Cod_Moneda,
                                                            $("#laSON").text(),
                                                            $("#subtotal").val(),
                                                            $("#Exoneradas").val(),
                                                            $("#Gratuitas").val(),
                                                            0,
                                                            Descuento_Total,
                                                            variables.empresa.Des_Impuesto,
                                                            variables.empresa.Por_Impuesto,
                                                            Impuesto,
                                                            Total
                                                            )
                                            $("#modal-alerta").modal("hide")
                                            H5_loading.hide()
                                        }else{
                                            toastr.error('Ocurrio un error al momento de guardar la forma de pago.','Error',{timeOut: 5000})
                                            $("#modal-alerta").modal("hide")
                                            H5_loading.hide()
                                        }
                                    })

                                }else{
                                    if($("#Cod_FormaPago").val()=="011" || $("#Cod_FormaPago").val()=="033"){
                                        Cuenta_CajaBanco = $("#Cuenta_CajaBancos option:selected").text()
                                        GuardarOperacionBancaria(function(flag){
                                            if(flag){ 

                                                GuardarFormaPago(id_ComprobantePago,Item,Des_FormaPago,Cod_TipoFormaPago,Cuenta_CajaBanco,Id_Movimiento,TipoCambio,Cod_Moneda,Monto,null,null,Fecha,function(flagFP){
                                                    if(flagFP){
                                                        toastr.success('Se registro correctamente el comprobante','Confirmacion',{timeOut: 5000})
                                                        $("#modal-proceso").modal("hide")
                                                        PrepararImpresion(
                                                            CodLibro,
                                                            Cod_TipoComprobante,
                                                            $("#Cod_TipoComprobante option:selected").text(),
                                                            Serie,
                                                            Numero,
                                                            false,
                                                            '',
                                                            Nom_Cliente,
                                                            Cod_TipoDoc,
                                                            Doc_Cliente,
                                                            Direccion_Cliente,
                                                            FechaEmision,
                                                            FechaVencimiento,
                                                            Des_FormaPago,
                                                            Glosa,
                                                            Obs_Comprobante,
                                                            Cod_Moneda,
                                                            $("#laSON").text(),
                                                            $("#subtotal").val(),
                                                            $("#Exoneradas").val(),
                                                            $("#Gratuitas").val(),
                                                            0,
                                                            Descuento_Total,
                                                            variables.empresa.Des_Impuesto,
                                                            variables.empresa.Por_Impuesto,
                                                            Impuesto,
                                                            Total
                                                            )
                                                            $("#modal-alerta").modal("hide")
                                                            H5_loading.hide()
                                                    }else{
                                                        toastr.error('Ocurrio un error al momento de guardar la forma de pago.','Error',{timeOut: 5000})
                                                        $("#modal-alerta").modal("hide")
                                                        H5_loading.hide()
                                                    }
                                                })

                                            }else{
                                                toastr.error('Ocurrio un error al momento de la guardar operacion bancaria.','Error',{timeOut: 5000})
                                                $("#modal-alerta").modal("hide")
                                                H5_loading.hide()
                                            }
                                        })
                                    }else{
                                        Cuenta_CajaBanco = $("#Cuenta_CajaBancos option:selected").text()
                                        GuardarFormaPago(id_ComprobantePago,Item,Des_FormaPago,Cod_TipoFormaPago,Cuenta_CajaBanco,Id_Movimiento,TipoCambio,Cod_Moneda,Monto,null,null,Fecha,function(flagFP){
                                            if(flagFP){
                                                toastr.success('Se registro correctamente el comprobante','Confirmacion',{timeOut: 5000})
                                                $("#modal-proceso").modal("hide")
                                                
                                                PrepararImpresion(
                                                    CodLibro,
                                                    Cod_TipoComprobante,
                                                    $("#Cod_TipoComprobante option:selected").text(),
                                                    Serie,
                                                    Numero,
                                                    false,
                                                    '',
                                                    Nom_Cliente,
                                                    Cod_TipoDoc,
                                                    Doc_Cliente,
                                                    Direccion_Cliente,
                                                    FechaEmision,
                                                    FechaVencimiento,
                                                    Des_FormaPago,
                                                    Glosa,
                                                    Obs_Comprobante,
                                                    Cod_Moneda,
                                                    $("#laSON").text(),
                                                    $("#subtotal").val(),
                                                    $("#Exoneradas").val(),
                                                    $("#Gratuitas").val(),
                                                    0,
                                                    Descuento_Total,
                                                    variables.empresa.Des_Impuesto,
                                                    variables.empresa.Por_Impuesto,
                                                    Impuesto,
                                                    Total
                                                    )
                                                    $("#modal-alerta").modal("hide")
                                                    H5_loading.hide()
                                            }else{
                                                toastr.error('Ocurrio un error al momento de guardar la forma de pago.','Error',{timeOut: 5000})
                                                $("#modal-alerta").modal("hide")
                                                H5_loading.hide()
                                            }
                                        })
                                    }
                                }
                            }
                        }else{
                            if(listaFormaPago.length==1){

                                GuardarFormaPago(idComprobante,listaFormaPago[0].Item,listaFormaPago[0].DesFormaPago,listaFormaPago[0].CodTipoFormaPago,listaFormaPago[0].CuentaCajaBanco,listaFormaPago[0].IdMovimiento,listaFormaPago[0].TipoCambio,listaFormaPago[0].CodMoneda,listaFormaPago[0].Monto,null,null,listaFormaPago[0].Fecha,function(flagFP){
                                    if(flagFP){
                                        const parametros1 = {
                                            method: 'POST',
                                            headers: {
                                                Accept: 'application/json',
                                                'Content-Type': 'application/json',
                                            },
                                            credentials: 'same-origin',
                                            body: JSON.stringify({
                                                Cod_Libro:CodLibro,
                                                Cod_TipoOperacion,
                                                Cod_TipoComprobante,
                                                Serie,
                                                Numero,
                                                Id_Cliente,
                                                Cod_TipoDoc,
                                                Doc_Cliente,
                                                Nom_Cliente,
                                                Direccion_Cliente,
                                                FechaEmision,
                                                FechaVencimiento,
                                                FechaCancelacion,
                                                Glosa,
                                                TipoCambio,
                                                Flag_Anulado,
                                                Flag_Despachado,
                                                Cod_FormaPago:listaFormaPago[0].CodTipoFormaPago,
                                                Descuento_Total,
                                                Cod_Moneda,
                                                Impuesto,   
                                                Total,
                                                Obs_Comprobante,
                                                Id_GuiaRemision,
                                                GuiaRemision,
                                                id_ComprobanteRef,
                                                Cod_Plantilla,
                                                Nro_Ticketera,
                                                Cod_RegimenPercepcion,
                                                Tasa_Percepcion,
                                                Placa_Vehiculo,
                                                Cod_TipoDocReferencia,
                                                Nro_DocReferencia,
                                                Valor_Resumen,
                                                Valor_Firma,
                                                Cod_EstadoComprobante,
                                                Motivo_Anulacion,
                                                Otros_Cargos,
                                                Otros_Tributos
                                            })
                                        }
                                     
                                        fetch(URL + '/comprobantes_pago_api/guardar_comprobante_pago', parametros1)
                                        .then(req => req.json())
                                        .then(res => {
                                            if(res.respuesta=='ok'){
                                                toastr.success('Se registro correctamente el comprobante','Confirmacion',{timeOut: 5000})
                                                $("#modal-proceso").modal("hide")
                                                PrepararImpresion(
                                                    CodLibro,
                                                    Cod_TipoComprobante,
                                                    $("#Cod_TipoComprobante option:selected").text(),
                                                    Serie,
                                                    Numero,
                                                    false,
                                                    '',
                                                    Nom_Cliente,
                                                    Cod_TipoDoc,
                                                    Doc_Cliente,
                                                    Direccion_Cliente,
                                                    FechaEmision,
                                                    FechaVencimiento,
                                                    Des_FormaPago,
                                                    Glosa,
                                                    Obs_Comprobante,
                                                    Cod_Moneda,
                                                    $("#laSON").text(),
                                                    $("#subtotal").val(),
                                                    $("#Exoneradas").val(),
                                                    $("#Gratuitas").val(),
                                                    0,
                                                    Descuento_Total,
                                                    variables.empresa.Des_Impuesto,
                                                    variables.empresa.Por_Impuesto,
                                                    Impuesto,
                                                    Total
                                                    )
                                                    $("#modal-alerta").modal("hide")
                                                    H5_loading.hide()
                                            }else{
                                                toastr.error('Ocurrio un error al momento de guardar la forma de pago.','Error',{timeOut: 5000})
                                                $("#modal-alerta").modal("hide")
                                                H5_loading.hide()
                                            }
                                        })
                                       
                                    }else{
                                        toastr.error('Ocurrio un error al momento de guardar la forma de pago.','Error',{timeOut: 5000})
                                        $("#modal-alerta").modal("hide")
                                        H5_loading.hide()
                                    }
                                })
 
                            }else{

                                const parametros2 = {
                                    method: 'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',
                                    },
                                    credentials: 'same-origin',
                                    body: JSON.stringify({
                                        Cod_Libro:CodLibro,
                                        Cod_TipoOperacion,
                                        Cod_TipoComprobante,
                                        Serie,
                                        Numero,
                                        Id_Cliente,
                                        Cod_TipoDoc,
                                        Doc_Cliente,
                                        Nom_Cliente,
                                        Direccion_Cliente,
                                        FechaEmision,
                                        FechaVencimiento,
                                        FechaCancelacion,
                                        Glosa,
                                        TipoCambio,
                                        Flag_Anulado,
                                        Flag_Despachado,
                                        Cod_FormaPago:'999',
                                        Descuento_Total,
                                        Cod_Moneda,
                                        Impuesto,   
                                        Total,
                                        Obs_Comprobante,
                                        Id_GuiaRemision,
                                        GuiaRemision,
                                        id_ComprobanteRef,
                                        Cod_Plantilla,
                                        Nro_Ticketera,
                                        Cod_RegimenPercepcion,
                                        Tasa_Percepcion,
                                        Placa_Vehiculo,
                                        Cod_TipoDocReferencia,
                                        Nro_DocReferencia,
                                        Valor_Resumen,
                                        Valor_Firma,
                                        Cod_EstadoComprobante,
                                        Motivo_Anulacion,
                                        Otros_Cargos,
                                        Otros_Tributos
                                    })
                                }
                             
                                fetch(URL + '/comprobantes_pago_api/guardar_comprobante_pago', parametros2)
                                .then(req => req.json())
                                .then(res => {
                                    if(res.respuesta=='ok'){
                                        GuardarFormaPagoRecursivo(0,idComprobante,function(flag){
                                            if(flag){
                                                toastr.success('Se registro correctamente el comprobante','Confirmacion',{timeOut: 5000})
                                                $("#modal-proceso").modal("hide")
                                                $("#modal-alerta").modal("hide")
                                                H5_loading.hide()
                                                PrepararImpresion(
                                                    CodLibro,
                                                    Cod_TipoComprobante,
                                                    $("#Cod_TipoComprobante option:selected").text(),
                                                    Serie,
                                                    Numero,
                                                    false,
                                                    '',
                                                    Nom_Cliente,
                                                    Cod_TipoDoc,
                                                    Doc_Cliente,
                                                    Direccion_Cliente,
                                                    FechaEmision,
                                                    FechaVencimiento,
                                                    Des_FormaPago,
                                                    Glosa,
                                                    Obs_Comprobante,
                                                    Cod_Moneda,
                                                    $("#laSON").text(),
                                                    $("#subtotal").val(),
                                                    $("#Exoneradas").val(),
                                                    $("#Gratuitas").val(),
                                                    0,
                                                    Descuento_Total,
                                                    variables.empresa.Des_Impuesto,
                                                    variables.empresa.Por_Impuesto,
                                                    Impuesto,
                                                    Total
                                                    )
                                            }else{
                                                toastr.error('Ocurrio un error al momento de guardar la forma de pago.','Error',{timeOut: 5000})
                                                $("#modal-alerta").modal("hide")
                                                H5_loading.hide() 
                                            }
                                        })
                                      
                                    }else{
                                        toastr.error('Ocurrio un error al momento de guardar la comprobante de pago.','Error',{timeOut: 5000})
                                        $("#modal-alerta").modal("hide")
                                        H5_loading.hide()
                                    }
                                })

                            }
                        }
                   }else{
                        toastr.error('Ocurrio un error al momento de guardar los detalles del comprobante.','Error',{timeOut: 5000})
                        $("#modal-alerta").modal("hide")
                        H5_loading.hide()
                   }
               })
            }else{
                toastr.error('Ocurrio un error al momento de guardar el comprobante.','Error',{timeOut: 5000})
                $("#modal-alerta").modal("hide")
                H5_loading.hide()
            } 
            
        })

}


function CargarTipoPrecio(){
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Id_Producto:$("#Nom_Producto").attr("data-id"),
            Cod_Almacen:$("#Cod_Almacen").val(),
            Cod_UnidadMedida:$("#Cod_UnidadMedida").val()
        })
    }
    fetch(URL + '/productos_serv_api/get_producto_precio', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
               var tipos_precios = res.data.productos
               LlenarTipoPrecio(tipos_precios)
            } 
        })
}

function CargarUnidadMedida(Id_Producto,Cod_Almacen){
    if (Id_Producto != undefined && Cod_Almacen != undefined) {
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Id_Producto,
                Cod_Almacen
            })
        }
        fetch(URL + '/productos_serv_api/get_unidad_medida_by_producto_almacen', parametros)
            .then(req => req.json())
            .then(res => {
                if (res.respuesta == 'ok') {
                    var unidades_medidas = res.data.unidades_medidas
                    LlenarUnidadMedida(unidades_medidas)
                }
            })
    }else{
        
        if(!arrayValidacion.includes($("#Nom_Producto").attr("data-id"))){
            const parametros = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Id_Producto:$("#Nom_Producto").attr("data-id"),
                    Cod_Almacen:$("#Cod_Almacen").val()
                })
            }
            fetch(URL + '/productos_serv_api/get_unidad_medida_by_producto_almacen', parametros)
                .then(req => req.json())
                .then(res => {
                    if (res.respuesta == 'ok') {
                        var unidades_medidas = res.data.unidades_medidas
                        LlenarUnidadMedida(unidades_medidas)
                    }
                })
        }
    }
}

function CargarLicitacionesCliente(Id_ClienteProveedor){
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Id_ClienteProveedor
        })
    }
    fetch(URL + '/clientes_api/get_licitaciones_by_cliente', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var licitaciones = res.data.licitaciones 
                if(licitaciones.length>0){
                    $("#divCodigoLicitacion").css("display","block")
                    $("#divLicitacion").css("display","block")
                    $("#optLicitacion").attr("checked",true)
                    LlenarLicitaciones(licitaciones)
                }else{
                    $("#divCodigoLicitacion").css("display","none")
                    $("#divLicitacion").css("display","none")
                    $("#optLicitacion").attr("checked",false)   
                }
            } 
        })
}

function CargarSeries(CodLibro){
    if(CodLibro=="14"){
        var Cod_TipoComprobante = $("#Cod_TipoComprobante").val()
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
        fetch(URL + '/cajas_api/get_series_by_cod_caja_comprobante', parametros)
            .then(req => req.json())
            .then(res => { 
                if (res.respuesta == 'ok') {
                    var series = res.data.series 
                    LlenarSeries(series)
                    if(series.length>0){
                        TraerSiguienteNumero(CodLibro)
                    }else{
                        $("#Serie").val("")
                        toastr.error('No se cuenta con ninguna Serie Autorizada para este tipo de Comprobante.\n\n Solicite al Administrador Autorice una serie para Continuar.','Error',{timeOut: 5000})
                    }
                } 
            })

        CambioComprobantes() 
    }
}

function CargarAlmacenes(Id_Producto,Cod_Almacen){
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
    fetch(URL + '/almacenes_api/get_almacen_by_producto', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') { 
                LlenarAlmacenes(res.data.almacenes,Cod_Almacen)
            }else{
                LlenarAlmacenes([])
            }
        })  
}

function CambioMonedaFormaPagoMasterCard(){
    if($('input[name=Cod_FormaPago_Modal]:checked').val()=="mastercard"){
        $("#divReferencia").css("display","block")
    }else{
        $("#divReferencia").css("display","none")
    }
}

function CambioMonedaFormaPagoVisa(){
    if($('input[name=Cod_FormaPago_Modal]:checked').val()=="visa"){
        $("#divReferencia").css("display","block")
    }else{
        $("#divReferencia").css("display","none")
    }
}

function CambioMonedaFormaPagoSoles(Cod_Moneda){
    if($('input[name=Cod_Moneda_Forma_Pago]:checked').val()=="soles"){
        $("#divTipoCambio").css("display","none")
    }else{
        $("#divTipoCambio").css("display","block")
    }
    OcultarCompletarSaldo(Cod_Moneda)
}

function CambioMonedaFormaPagoDolares(Cod_Moneda,variables,Tipo_Cambio){
    var _CodMoneda = ""
    if($('input[name=Cod_Moneda_Forma_Pago]:checked').val()=="dolares"){
        _CodMoneda = "USD"
        $("#divTipoCambio").css("display","block")
    }else{
        $("#divTipoCambio").css("display","none")
    }
    RecuperarTipoCambio(_CodMoneda,variables,Tipo_Cambio)
    OcultarCompletarSaldo(Cod_Moneda)
}

function CambioMonedaFormaPagoEuros(Cod_Moneda,variables,Tipo_Cambio){
    var _CodMoneda = ""
    if($('input[name=Cod_Moneda_Forma_Pago]:checked').val()=="euros"){
        _CodMoneda = "EUR"
        $("#divTipoCambio").css("display","block")
    }else{
        $("#divTipoCambio").css("display","none")
    }
    RecuperarTipoCambio(_CodMoneda,variables,Tipo_Cambio)
    OcultarCompletarSaldo(Cod_Moneda)
}

function CambioCodCuentaBancaria(CodLibro){
    var Cod_CuentaBancaria = $("#Cod_CuentaBancaria").val()
    var Beneficiario = $("#Cliente").val()
    var Cod_Libro = CodLibro

    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Cod_CuentaBancaria,
            Beneficiario,
            Cod_Libro
        })
    }
    fetch(URL + '/cuentas_bancarias_api/get_cheques_by_cuenta_cliente', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var cheques = res.data.cheques 
                LlenarCheques(cheques)
            } 
        })
}

function CambioGastos(){
    var visible = "block"
    if($("#optEsGasto").is(":checked")){
        visible = "none"
    }
    $("#Cod_Almacen").attr("disabled",$("#optEsGasto").is(":checked"))
    $("#Cod_UnidadMedida").attr("disabled",$("#optEsGasto").is(":checked"))
    $("#Stock").attr("disabled",$("#optEsGasto").is(":checked"))
    $("#Cod_TipoPrecio").attr("disabled",$("#optEsGasto").is(":checked"))
    $("#Cantidad").val(1)
    $("#Cantidad").attr("disabled",$("#optEsGasto").is(":checked"))
    $("#Descuento").attr("disabled",$("#optEsGasto").is(":checked"))
    $("#Precio_Unitario").attr("disabled",$("#optEsGasto").is(":checked"))
    $("#btnBuscarSeries").css("display",visible)
}

function FocusOutSerie() {
    if ($("#Serie").parent().find('input.ui-widget').val().trim().length > 0){
        if ($("#Serie").parent().find('input.ui-widget').val().length < 4) {
            var cadenaCeros = ""
            var cantidadCeros = 4 - $("#Serie").parent().find('input.ui-widget').val().length
            for (var i = 0; i < cantidadCeros; i++)
                cadenaCeros = cadenaCeros + "0"
            $("#Serie").parent().find('input.ui-widget').val(cadenaCeros + $("#Serie").parent().find('input.ui-widget').val())
        }

        var nuevoValor = $("<option value="+$("#Serie").parent().find('input.ui-widget').val()+">"+$("#Serie").parent().find('input.ui-widget').val()+"</option>");
        $("#Serie").append(nuevoValor);
        $("#Serie option:last").attr("selected", "selected");
    }

}

function CambioNumero_(event,CodLibro){
    if(CodLibro!='08'){
        BloquearControles(event)
    }
}

function CambioNumero(){
    if($("#Numero").val().trim()>0){
        if($("#Numero").val().length<8){
        var cadenaCeros=""
        var cantidadCeros = 8 - $("#Numero").val().length
        for(var i=0;i<cantidadCeros;i++)
            cadenaCeros=cadenaCeros+"0"
        $("#Numero").val(cadenaCeros+$("#Numero").val())
        }
    }else{
        toastr.error('Ingrese un numero correcto y vuelva a intentarlo','Error',{timeOut: 5000})
    }
}
 

function CambioDespachado(){
    if(!$("#optDescargar").is(":checked")){
        $("#DescripcionDespachado").text("No se Aplicara la descarga de los Productos en el almacen seleccionado.")
    }else{
        $("#DescripcionDespachado").text("")
    }
}

function CambioExportacion(CodLibro,variables){
    if($("#optExportacion").is(":checked")){
        CodTipoOperacion = '02'
        $("#ckbAplicaImpuesto").prop("checked",false)
        $("#divAplicaImpuesto").css("display","none")

        $('#tablaBody tr').each(function () {
            var Id_Producto = $(this).find("td").eq(2).find("input").val()
           

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
            fetch(URL + '/productos_serv_api/get_producto_by_pk', parametros)
                .then(req => req.json())
                .then(res => {
                    if (res.respuesta == 'ok') {
                        if(res.data.producto.length>0){
                            var producto = res.data.producto[0]
                            $(this).find("td").eq(4).find("input").val(producto.Nom_Producto+' / '+producto.Des_CortaProducto)
                        }
                    }
                })
 
        });

        
    }else{
        CodTipoOperacion = '01'
        $("#ckbAplicaImpuesto").prop("checked",true)
        $("#divAplicaImpuesto").css("display","block")

        $('#tablaBody tr').each(function () {
           
            var Id_Producto = $(this).find("td").eq(2).find("input").val()
           
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
            fetch(URL + '/productos_serv_api/get_producto_by_pk', parametros)
                .then(req => req.json())
                .then(res => {
                    if (res.respuesta == 'ok') {
                        if(res.data.producto.length>0){
                            var producto = res.data.producto[0]
                            $(this).find("td").eq(4).find("input").val(producto.Nom_Producto)
                        }
                    }
                })
           
     
        }); 
    }
    CalcularTotal(CodLibro,variables)
}

function RecorrerTablaDetalles_Series(indiceDetalle,callback){
    if(indiceDetalle < $("#tablaBody > tr").length){
        var Id_Producto =   $('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(2).find('input').val()
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
        fetch(URL + '/series_api/get_series_by_idproducto', parametros)
            .then(req => req.json())
            .then(res => { 
                var series = res.data.series 
                if(series.length>0){
                    var Series = JSON.parse( $('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(16).find('input').val())
                    if(Series.length==0){
                        callback(false)
                        //return false
                    }else{
                        RecorrerTablaDetalles_Series(indiceDetalle+1,callback) 
                    }
                }else{
                    RecorrerTablaDetalles_Series(indiceDetalle+1,callback) 
                }
               
            })
    }else{
        callback(true)
    }
}

function RecorrerTablaDetalles_Licitaciones(CodLibro,variables,indiceDetalle,indiceLicitacion,arregloLicitacion,_ExisteAtencion){
    if(indiceDetalle < $("#tablaBody > tr").length){
        _ExisteAtencion = false
        if(indiceLicitacion<arregloLicitacion.length){
            if((arregloLicitacion[indiceLicitacion].Id_Producto).toString()==$('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(2).find('input').val().toString()){
                _ExisteAtencion = true
                if(parseFloat(arregloLicitacion[indiceLicitacion].Por_Descuento)==parseFloat("0.00")){
                    $('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(10).find('input').val(arregloLicitacion[indiceLicitacion].Precio_Unitario)
                    $('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(10).find('input').attr("data-value",arregloLicitacion[indiceLicitacion].Precio_Unitario)
                    $('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(12).find('input').val(parseFloat($('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(8).find('input').val())*parseFloat($('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(10).find('input').val()))
                    $('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(11).find('input').val("0.00")
                    $('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(11).find('input').attr("data-value",0)
                }else{
                    $('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(10).find('input').val(parseFloat($('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(10).find('input').val()) - parseFloat(arregloLicitacion[indiceLicitacion].Precio_Unitario))
                    $('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(10).find('input').attr("data-value",parseFloat($('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(10).find('input').val())-parseFloat(arregloLicitacion[indiceLicitacion].Precio_Unitario))
                    $('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(11).find('input').val("0.00")
                    $('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(11).find('input').attr("data-value",0)
                }

                if((parseFloat(arregloLicitacion[indiceLicitacion].Diferencia) - parseFloat($('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(8).find('input').val())) >= 0){
                   $("#btnAceptarGenerarComprobante").attr("disabled",false)
                }else{
                    toastr.error('Solo se puede atender '+arregloLicitacion[indiceLicitacion].Diferencia+' de '+arregloLicitacion[indiceLicitacion].Nom_Producto+'. Selecione otra Licitación','Error',{timeOut: 5000})
                }
            }
            CalcularTotal(CodLibro,variables)
            if(!_ExisteAtencion){
                toastr.error('El producto: '+$('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(4).find('input').val()+' no se encuentra dentro la Licitación Seleccionada.','Error',{timeOut: 5000})
                $("#Cod_Licitacion").val("")
            }
            RecorrerTablaDetalles_Licitaciones(CodLibro,variables,indiceDetalle,indiceLicitacion+1,arregloLicitacion,_ExisteAtencion)
        }else{
            RecorrerTablaDetalles_Licitaciones(CodLibro,variables,indiceDetalle+1,0,arregloLicitacion,_ExisteAtencion)
        }
        //console.log($('#tablaBody > tr:eq('+indiceDetalle+')').find('td').eq(2).find('input').val())
    } 
    /*$('#tablaBody tr').each(function () {
        var Id_Producto = $(this).find("td").eq(2).find("input").val()
    })*/
}

function CambioCreditoContado(){
    $("#Cod_FormaPago").val($("#Cod_FormaPago option:first").val())
    if(!arrayValidacion.includes($("#Cod_FormaPago").val())){
        if($("#Cod_FormaPago").val()!="008" || $('input[name=optCredito]:checked').val()=="credito"){
            $("#divOperacion").css("display","block")
            $("#divCuentaCajaBancos").css("display","block")
        }else{
            $("#divOperacion").css("display","none")
            $("#divCuentaCajaBancos").css("display","none")
        }
    }
    if ($('input[name=optCredito]:checked').val() == 'contado') {
        
        $("#divNroDias").css("display","none")
        $("#divFormasPago").css("display","block")
        $("#divOperacion").css("display","none")
        $("#divCuentaCajaBancos").css("display","none")
    }else{
         
        $("#divNroDias").css("display","block")
        $("#divFormasPago").css("display","none")
        $("#divOperacion").css("display","none")
        $("#divCuentaCajaBancos").css("display","none")
    }
}

function CambioSelectLicitacion(CodLibro,variables){
    if($("#divCodigoLicitacion").css("display")=="block"){
        if($("#optLicitacion").is(":checked")){
            if($("#Cod_Licitacion").val()!=""){
                var _ExisteAtencion = false
                
                const parametros = {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        Cod_Licitacion: $("#Cod_Licitacion").val(),
                        Id_ClienteProveedor: global.objCliente.Id_ClienteProveedor
                    })
                }
                fetch(URL + '/comprobantes_pago_api/get_licitacion_detallado', parametros)
                    .then(req => req.json())
                    .then(res => {
                        if (res.respuesta == 'ok') {
                            if(res.data.licitaciones.length>0)
                                RecorrerTablaDetalles_Licitaciones(CodLibro,variables,0,0,res.data.licitaciones,_ExisteAtencion)
                        }else{
                            toastr.error('Ocurrio un error. Intentelo mas tarde','Error',{timeOut: 5000})
                        }
                    })

            }
        }
    }
}

function CambioLicitacion(){
    var visible = "none"
    if($("#optLicitacion").is(":checked")){
        visible = "block"
    }
    $("#divCodigoLicitacion").css("display",visible)
}

 
function CambioUnidadMedida() {
    if (!arrayValidacion.includes($("#Nom_Producto").attr("data-id"))  &&  !arrayValidacion.includes($("#Cod_Almacen").val())) {
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Id_Producto: $("#Nom_Producto").attr("data-id"),
                Cod_UnidadMedida: $("#Cod_UnidadMedida").val(),
                Cod_Almacen: $("#Cod_Almacen").val()
            })
        }
        fetch(URL + '/productos_serv_api/get_producto_stock', parametros)
            .then(req => req.json())
            .then(res => {
                if (res.respuesta == 'ok') {
                    if(res.data.producto.length>0){
                        var producto = res.data.producto[0]
                        $("#Stock").val(producto.Stock_Act)
                        CargarTipoPrecio()
                    }
                }
            })
    }
}



function CambioComprobantes(){
    if($("#Cod_TipoComprobante").val()=="TKB" || $("#Cod_TipoComprobante").val()=="TKF" || $("#Cod_TipoComprobante").val()=="BE" || $("#Cod_TipoComprobante").val()=="FE"){
        $("#Numero").prop("disabled",true)
        $("#Fecha").prop("disabled",true)
    }else{
        $("#Numero").prop("disabled",false)
        $("#Fecha").prop("disabled",false)
    }
}

function CambioFormasPago(CodLibro){
    if(!arrayValidacion.includes($("#Cod_FormaPago").val())){
        var flagDisplay="none"
        if($("#Cod_FormaPago").val()!="008")
            flagDisplay = "block"
        
        $("#divOperacion").css("display",flagDisplay)
        $("#Cod_CuentaBancaria").css("display",flagDisplay)
        $("#divCuentaCajaBancos").css("display",flagDisplay)

        if($("#divOperacion").css("display")=="block"){
            switch ($("#Cod_FormaPago").val()) {
                case "007":
                    if(CodLibro=="08"){
                        $("#lbCuentaCajaBanco").text("# de Cheque: ")
                        TraerCuentaBancariaPorSucursal(CodLibro)
                    }else{
                        toastr.error('No Existe la Operacion de CHEQUE para ventas.\nSe debe de Depositar el Cheque eh ingresarlo como Deposito en Cuenta.','Error',{timeOut: 5000})
                        $("#Cod_FormaPago").val(null)
                    }
                    break 
                case "011":
                    $("#Cod_CuentaBancaria").css("display","block")
                    $("#lbCuentaCajaBanco").text("# de Operacion")
                    if(CodLibro=="08"){
                        TraerCuentasBancariasXIdClienteProveedor(CodLibro)
                    }else{
                        TraerCuentaBancariaPorSucursal(CodLibro)
                    }
                    break
                case "001":
                    $("#lbCuentaCajaBanco").text("# de Letra: ")
                    break
                case "005":
                    $("#lbCuentaCajaBanco").text("# de Tarjeta VISA: ")
                    break
                case "006":
                    $("#lbCuentaCajaBanco").text("# de Tarjeta MASTER CARD: ")
                    break
                case "004":
                    $("#lbCuentaCajaBanco").text("# de Orden de Pago: ")
                    break
                case "003":
                    $("#Cod_CuentaBancaria").css("display","block")
                    $("#lbCuentaCajaBanco").text("Seleccione Transferencia: ")
                    TraerCuentaBancariaPorSucursal(CodLibro)
                    break
                case "008":
                    $("#divOperacion").css("display","none")
                    $("#Cod_CuentaBancaria").css("display","none")
                    $("#divCuentaCajaBancos").css("display","none")
                    break
                case "998":
                    $("#lbCuentaCajaBanco").text("Selecione Pago Adelantado: ")
                    TraerSaldoPagoAdelantado()
                    break
                default:
                    $("#lbCuentaCajaBanco").text("# de Operación: ")
                    break
            }
        }
    }
}

function CambioTipoCambioGlobal(Cod_Moneda,Tipo_Cambio){
    $('#tablaBodyPagosMultiples tr').each(function () {
        if($(this).find("td").eq(1).text()==Cod_Moneda){
            $(this).find("td").eq(3).text(Tipo_Cambio)
            var ValorTotal = parseFloat($(this).find("td").eq(5).text()).toFixed(2)
            $(this).find("td").eq(5).text((parseFloat(ValorTotal)*parseFloat(Tipo_Cambio)).toFixed(2))
        }
    });
    CalcularSaldo(Cod_Moneda,Tipo_Cambio)
}

function CambioTipoDocumento(){
    if($("#Cod_TipoDoc").val()=="1" || $("#Cod_TipoDoc").val()=="6")
        $("#BuscarRENIEC").show()
    else    
        $("#BuscarRENIEC").hide()
}

function CambioMoneda(CodLibro){
    if(!arrayValidacion.includes($("#Cod_Moneda").val())){
        if($("#Cod_Moneda").val()=="USD"){
            $("#divTC").css("display","block")
            TraerTipoCambio(CodLibro)
        }else{
            $("#divTC").css("display","none")
            $("#Tipo_Cambio").val("1")
        }
    }
}

function TraerTipoCambio(CodLibro){ 
    if($("#Cod_Moneda").val()!="PEN"){
        try{
            var Cod_Moneda = $("#Cod_Moneda").val()
            var FechaHora = $("#Fecha").val()
            const parametros = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Cod_Moneda,
                    FechaHora
                })
            }
            fetch(URL + '/comprobantes_pago_api/get_variables_formas_pago', parametros)
                .then(req => req.json())
                .then(res => {
                    if (res.respuesta == 'ok') {
                        if(res.data.tipos_cambios.length>0){
                            if(CodLibro=="08"){
                                $("#Tipo_Cambio").val(res.data.tipos_cambios[0].SunatCompra)
                            }else{
                                $("#Tipo_Cambio").val(res.data.tipos_cambios[0].SunatVenta)
                            }
                        }else{
                            $("#Tipo_Cambio").val(1)
                        }
                    } 
                })

        }catch(e){
            $("#Tipo_Cambio").val(1)
        }
    }
}
 
function TraerSiguienteNumero(CodLibro){
    if($("#Serie").val()!="" && $("#Cod_TipoComprobante").val()!=""){
        var Cod_TipoComprobante = $("#Cod_TipoComprobante").val()
        var Serie = $("#Serie").val()
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Cod_TipoComprobante,
                Serie,
                CodLibro
            })
        }
        fetch(URL + '/cajas_api/get_next_comprobante_by_tipo_serie_libro', parametros)
            .then(req => req.json())
            .then(res => {
                if (res.respuesta == 'ok') {
                    if(res.data.comprobante.length>0){
                        var comprobante = res.data.comprobante
                        $("#Numero").val("00000000"+comprobante[0].NumeroSiguiente)
                    }else{
                        $("#Numero").val("")
                    }
                } 
            })
    }
}

function TraerSaldoPagoAdelantado(){
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Id_ClienteProveedor:global.objCliente.Id_ClienteProveedor
        })
    }
    fetch(URL + '/comprobantes_pago_api/get_pago_adelantado', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var pagos_adelantados = res.data.pagos_adelantados
                if (pagos_adelantados.length>0){
                    LlenarPagosAdelantados(pagos_adelantados)
                }else{
                    $("#lbCuentaCajaBanco").text("No tienen Ningun Adelanto para Selecionar.")
                    $("#Cuenta_CajaBancos").html('')
                    $("#divCuentaCajaBancos").css("display","none")
                } 
            } 
        })
}


function TraerCuentaBancariaPorSucursal(CodLibro){
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        })
    }
    fetch(URL + '/cuentas_bancarias_api/get_cuenta_by_sucursal', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var cuentas = res.data.cuentas
                LlenarCuentaBancaria(cuentas,CodLibro)
            } 
        })
}

function TraerCuentasBancariasXIdClienteProveedor(CodLibro){
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Id_ClienteProveedor:global.objCliente.Id_ClienteProveedor
        })
    }
    fetch(URL + '/cuentas_bancarias_api/get_cuenta_by_id_cliente', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var cuentas = res.data.cuentas
                LlenarCuentaBancaria_(cuentas,CodLibro)
            } 
        })
}

function TraerCredito(CodLibro,callback){
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Id_ClienteProveedor:$("#Cliente").attr("data-id"),
            Cod_Libro:CodLibro
        })
    }
    fetch(URL + '/clientes_api/get_credito_cliente', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
               if(res.data.creditos.length>0){
                    var aCreditoUtilizado = parseFloat(res.data.creditos[0].CreditoUtilizado)
                    var aLimiteCredito = parseFloat(res.data.creditos[0].LimiteCredito)
                    if(aLimiteCredito-aCreditoUtilizado-parseFloat($("#Gran_Total"))>0){
                        callback(true)
                    }else{
                        toastr.error('No hay Credito Suficiente!!!.\nSu Linea es: '+aLimiteCredito+'.\nCredito Utilizado: '+aCreditoUtilizado+'.','Error',{timeOut: 5000})
                        callback(false)
                    }

               }else{
                    callback(true)
               }
            }else{
                callback(true)
            } 
        })
}


function BuscarProductoCP(CodLibro,tipo) { 
    if(tipo=='blur'){
        if ($("#Nom_Producto").val().trim().length > 2 && !$("#optEsGasto").is(":checked")) {
            BuscarProducto(CodLibro == "14", $("#Nom_Producto").val())
        }
        $("#Nom_Producto").focusout()

    }else{
        if(!$("#optEsGasto").is(":checked"))
            BuscarProducto(CodLibro == "14", $("#Nom_Producto").val())
        
        $("#Nom_Producto").focusout()
    }
}


function BuscarClienteDoc(CodLibro) {
    var Nro_Documento = document.getElementById('Nro_Documento').value
    var Cod_TipoDocumento = document.getElementById('Cod_TipoDoc').value
    var Cod_TipoCliente = CodLibro == "08" ? "001" : "002"
    if(Nro_Documento!=''){
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Nro_Documento, Cod_TipoDocumento,Cod_TipoCliente
            })
        }
        fetch(URL + '/clientes_api/get_cliente_by_documento', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok' && res.data.cliente.length > 0) {
                global.objCliente = res.data.cliente[0]

                if(global.objCliente !='' && global.objCliente){
                    $("#Cod_TipoDoc").val(global.objCliente.Cod_TipoDocumento)
                    $("#Cliente").val(global.objCliente.Cliente)
                    $("#Nro_Documento").val(global.objCliente.Nro_Documento)
                    $("#Direccion").val(global.objCliente.Direccion)
                    $("#Cliente").attr("data-id",global.objCliente.Id_ClienteProveedor)
                    if(parseFloat(global.objCliente.Limite_Credito) > 0 ){
                        $("input[name=optCredito][value='credito']").prop("checked",true);
                        $("#divCredito").css("display","block")
                    }
                    else{
                        $("input[name=optCredito][value='contado']").prop("checked",true);
                        $("#divCredito").css("display","none")
                    }
                    
                    if($("#divCredito").css("display")=="block"){
                        $("input[name=optCredito][value='credito']").prop("checked",true);
                        $("#Nro_Dias").val(30)
                    }else{
                        $("input[name=optCredito][value='credito']").prop("checked",false);
                        $("#Nro_Dias").val(0)
                    }
        
                    if(CodLibro=="14"){
                        $("#Cod_TipoComprobante").val(global.objCliente.Cod_TipoComprobante)
                        CargarSeries(CodLibro)
                        CargarLicitacionesCliente(global.objCliente.Id_ClienteProveedor)
                    }
                }
                CambioCreditoContado()
                CambioLicitacion()

            }
            H5_loading.hide()
        })
    }
}

function AbrirModalObsComprobantePago(){
    var Cod_Tabla = "CAJ_COMPROBANTE_PAGO"
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Cod_Tabla
        })
    }
    fetch(URL + '/comprobantes_pago_api/get_diagramas_xml_comprobante', parametros)
        .then(req => req.json())
        .then(res => {
            var variables = res.data
            AbrirModalObs(variables.diagramas,obs_xml,"modal_observaciones","modal_obs_body")
        })
}

async function AsyncCalcularTotal(CodLibro,variables) {
    return CalcularTotal(CodLibro,variables);
}
 

function ComprobantePago(Cod_Libro,Cliente,Detalles) {
    H5_loading.show(); 
    const fecha = new Date()
    const mes = fecha.getMonth() + 1
    const dia = fecha.getDate()
    var fecha_format = fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            Cod_Libro
        })
    }
    fetch(URL + '/comprobantes_pago_api/get_variable_comprobante_pago', parametros)
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
                    var data_empresa = res.empresa
                    variables['empresa'] = data_empresa   
                    VerRegistroComprobante(variables,fecha_format,Cod_Libro,Cod_Libro=='08'?'02':'01',Cliente,Detalles)
                    H5_loading.hide() 
                     
                })

        }) 
}

export { ComprobantePago }