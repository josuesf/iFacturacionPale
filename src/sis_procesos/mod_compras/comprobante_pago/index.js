var empty = require('empty-element');
var yo = require('yo-yo'); 
import { URL } from '../../../constantes_entorno/constantes'
import { NuevoCliente, BuscarCliente , AbrirModalObs , BuscarProducto } from '../../modales'
import { AsignarSeriesModal } from '../../modales/series'
import { ConvertirCadena } from '../../../../utility/tools' 

var listaFormaPago = []
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
                                        <div class="form-group">

                                            <select class="form-control input-sm" id="Serie" onchange=${()=>TraerSiguienteNumero(CodLibro)}>
                                               
                                            </select>
 
                                        </div>
                                    </div>
                                    <div class="col-md-6" id="divNumero">
                                        <div class="form-group">
                                            <input type="text" class="form-control input-sm required" id="Numero" onblur="${()=>CambioNumero()}">
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
                                                <div class="form-group">
                                                    <select class="form-control input-sm" id="Cuenta_CajaBancos"> 
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-4" id="divLicitacion" style="display:none">
                                                <div class="checkbox">
                                                    <label>
                                                        <input type="checkbox" id="optLicitacion" name="optLicitacion" onchange=${()=>CambioLicitacion()}> Licitacion
                                                    </label>
                                                </div>
                                            </div>
                                            <div class="col-md-8" id="divCodigoLicitacion" style="display:none">
                                                <div class="form-group">
                                                    <select class="form-control input-sm" id="Cod_Licitacion"> 
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
                                                    <select id="Cod_Moneda" class="form-control input-sm" onchange=${()=>CambioMoneda()}>
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
                                                    <input type="date" class="form-control input-sm" id="Fecha" value="${fecha_actual}" onchange=${()=>CambioFecha(CodLibro)}>
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
                                                        <select class="form-control input-sm" style="display:${CodLibro=='14'? 'block':'none'}" id="Cod_TipoPrecio" > </select>
                                                    </div>
                                                </th>
                                                
                                                <th><input type="number" class="form-control input-sm" id="Precio_Unitario"  value="0.00" onkeypress=${()=>KeyPressPrecioUnitario()} onchange=${()=>KeyPressPrecioUnitario()}></th>
                                                <th><input type="number" class="form-control input-sm" id="Descuento" value="0.00" ></th>
                                                <th><input type="number" class="form-control input-sm" id="Importe" value="0.00" onkeypress=${()=>KeyEnterImporte(event,CodLibro,variables)}></th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <table class="table table-bordered table-hover">
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
                                                <input type="number" class="form-control input-sm" id="subtotal">
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
                                                        <input type="checkbox" id="ckbIncluyeIGB" checked="checked" onchange="${()=>CalcularTotal(CodLibro,variables)}">Precio Unitario Incluye IGV?
                                                    </label>
                                                </div>
                                            </div>
                                        </div>  
                                        <div class="row">
                                            <div class="col-md-4">
                                                <label>Glosa Contable:</label>
                                            </div>
                                            <div class="col-md-8">
                                                <input type="text" class="form-control input-sm" value="${CodLibro=='08'?'POR LA COMPRA DE MERCADERIA':'POR LA VENTA DE MERCADERIA'}">
                                            </div>
                                        </div>  
                                        <div class="row">
                                            <div class="col-md-3">
                                                <label>Placa Vehiculo:</label>
                                            </div>
                                            <div class="col-md-3">
                                                <input type="text" class="form-control input-sm">
                                            </div>
                                            <div class="col-md-3">
                                                <label>Stock actual:</label>
                                            </div>
                                            <div class="col-md-3">
                                                <input type="text" class="form-control input-sm" id="Stock" disabled>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <button type="button" class="btn btn-success btn-sm btn-block" onclick="${()=>AbrirModalPercepcion(CodLibro,variables)}">Percepcion</button>
                                            </div>
                                            <div class="col-md-6">
                                                <button type="button" class="btn btn-warning btn-sm btn-block" id="btnBuscarSeries">Buscar Series</button>
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
                                            <input type="number" class="form-control input-sm" style="display:none"alue="0.00" id="Exonerado">
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
                                            <input type="number" class="form-control input-sm" value="0.00" id="Impuesto">
                                        </div>
                                        <div class="form-group">
                                            <label>
                                                <input type="checkbox" id="cbAplicaServicios"  checked="checked"> SERVICIOS
                                            </label>
                                            <input type="number" class="form-control input-sm" value="0.00" id="OtrosCargos" onkeypress=${CalcularTotal(CodLibro,variables)} onchange=${CalcularTotal(CodLibro,variables)}>
                                        </div>
                                        <div class="form-group" style="display:none">
                                            <label>
                                                <input type="checkbox"  checked="checked"> I.S.C 3%
                                            </label>
                                            <input type="number" class="form-control input-sm" value="0.00" id="Servicios">
                                        </div>
                                        <div class="form-group">
                                            <strong>DESCUENTO GLOBAL</strong>
                                            <input type="number" class="form-control input-sm" value="0.00" id="Descuento_Global" onkeypress=${CalcularTotal(CodLibro,variables)} onchange=${CalcularTotal(CodLibro,variables)}>
                                        </div>
                                        <div class="form-group">
                                            <strong>GRAN TOTAL</strong>
                                            <input type="number" class="form-control input-sm" id="Gran_Total" value="0.00" disabled>
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
                <button class="btn btn-primary" onclick=${()=>GenerarComprobante()}>${CodLibro=='08'?'Comprar':'Vender'}</button>
                <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>`
    var ingreso = document.getElementById('modal-proceso')
    empty(ingreso).appendChild(el)
    $('#modal-proceso').modal() 
    if(CodLibro=='08'){
        $("#Serie").editableSelect({ effects: 'slide' })
                    .on('select.editable-select', function (e, li) {
                        TraerSiguienteNumero(CodLibro)
                    })
        $("#Serie").blur(function(){
            FocusOutSerie()
        })
    } 
 
    CargarConfiguracionDefault(CodLibro,variables) 
     

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
 

function AgregarFilaTabla(CodLibro,variables){
    if($("#Nom_Producto").val().trim()!=""){
        if($("#Nom_Producto").attr("data-id")!=null && $("#Nom_Producto").attr("data-id")!="null" &&  $("#Nom_Producto").attr("data-id")!=""){

            var Id_Producto = $("#Nom_Producto").attr("data-id")
            var Cod_Producto = $("#Cod_Producto").val()==null?"": $("#Cod_Producto").val()
            var Cod_Almacen = $("#Cod_Almacen").val()
            var Cod_UnidadMedida = $("#Cod_UnidadMedida option:selected").text()
            var Stock = $("#Stock").val()
            var Cantidad = $("#Cantidad").val()
            var Nom_Producto = $("#Nom_Producto").val()
            var Importe = $("#Importe").val()
            var Precio_Unitario = $("#Precio_Unitario").val()
            var Descuento = $("#Descuento").val()
            var Cod_TipoPrecio = $("#Cod_TipoPrecio").val()==null?"":$("#Cod_TipoPrecio").val()
            var Cod_TipoOperatividad = $("#Cod_TipoOperatividad").val()

            var flagGasto = $("#optEsGasto").is(":checked")
            var rows = $("#tablaBody > tr").length
            var idFila = contador+$("#Nom_Producto").attr("data-id")
            var fila = yo`
            <tr id="${idFila}">
                <td class="id_ComprobantePago hidden"><input value="0"></td>
                <td class="id_Detalle hidden"><input value="${rows}"></td> 
                <td class="Id_Producto hidden"><input value="${flagGasto?'0':Id_Producto}"></td> 
                <td class="Codigo">${flagGasto?'':Cod_Producto}</td>
                <td class="Descripcion"><input type="text" class="form-control input-sm" value="${Nom_Producto}"></td>
                <td class="Almacen"><input type="text" class="form-control input-sm" value=${flagGasto?'':Cod_Almacen}></td> 
                <td class="UM"><input type="text" class="form-control input-sm" value=${flagGasto?'':Cod_UnidadMedida}></td>
                <td class="Stock hidden"><input type="number" class="form-control input-sm" value=${flagGasto?"0":Stock}></td> 
                <td class="Cantidad"><input type="number" class="form-control input-sm" value=${flagGasto?"1":Cantidad} onkeyup=${()=>EditarCantidad(idFila,CodLibro,variables)} onchange=${()=>EditarCantidad(idFila,CodLibro,variables)}></td> 
                <td class="Despachado hidden">${flagGasto?"1":Cantidad}</td> 
                <td class="PU"><input type="number" class="form-control input-sm" value=${flagGasto?Importe:Precio_Unitario} onkeyup=${()=>EditarPrecioUnitario(idFila,CodLibro,variables)} onchange=${()=>EditarPrecioUnitario(idFila,CodLibro,variables)}></td> 
                <td class="Descuento"><input type="number" class="form-control input-sm" value=${flagGasto?"0":Descuento} onkeyup=${()=>EditarDescuento(idFila,CodLibro,variables)} onchange=${()=>EditarDescuento(idFila,CodLibro,variables)} ></td> 
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
                    <td class="Codigo"></td>
                    <td class="Descripcion"><input type="text" class="form-control input-sm" value="PERCEPCION ${Cod_TipoComprobante} : ${Serie} - ${Numero}"></td>
                    <td class="Almacen"><input type="text" class="form-control input-sm"></td> 
                    <td class="UM"><input type="text" class="form-control input-sm"></td>
                    <td class="Stock hidden"><input type="number" class="form-control input-sm" value="1"></td> 
                    <td class="Cantidad"><input type="number" class="form-control input-sm" value="1"></td> 
                    <td class="Despachado hidden">1</td> 
                    <td class="PU"><input type="number" class="form-control input-sm" value="${Calculo}"></td> 
                    <td class="Descuento"><input type="number" class="form-control input-sm" value="0.00"></td> 
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
       CalcularTotal(CodLibro,variables)
    }catch(e){
        $("#Cantidad").val("0")
        CalcularTotal(CodLibro,variables)
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
        var descuento = $(this).find("td").eq(11).find("input").val()
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
        if($("#ckbIncluyeIGB").is(":checked")){
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
    if(Id_Producto!=null && Id_Producto!="")
        AsignarSeriesModal(Cod_Almacen, Id_Producto,Cantidad,NroDias,Series,null,Stock)
}

function RecuperarTipoCambio(Cod_Moneda,variables,Tipo_Cambio){ 
    if($("#Tipo_Cambio_FormaPago").attr("data-value")==null){
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
    CambioMoneda()
    CambioTipoDocumento()
    CambioFormasPago(CodLibro)
    CambioCreditoContado()
     
    CargarSeries(CodLibro)
    

     
    $("#divExportacion").css("display","none")
    CalcularTotal(CodLibro,variables)
    $("input[name=optCredito][value='contado']").prop("checked",true)
    CambioLicitacion()
}
 

function GenerarComprobante(){
    console.log(global.objCliente)
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
        
        if($("#Nom_Producto").attr("data-id")!=null && $("#Nom_Producto").attr("data-id")!=""){
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
                console.log(res)
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

    CambioComprobantes()    
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
    if ($("#Serie").val().length < 4) {
        var cadenaCeros = ""
        var cantidadCeros = 4 - $("#Serie").val().length
        for (var i = 0; i < cantidadCeros; i++)
            cadenaCeros = cadenaCeros + "0"
        $("#Serie").val(cadenaCeros + $("#Serie").val())
    }
}
 

function CambioNumero(){
    if($("#Numero").val().length<8){
      var cadenaCeros=""
      var cantidadCeros = 8 - $("#Numero").val().length
      for(var i=0;i<cantidadCeros;i++)
        cadenaCeros=cadenaCeros+"0"
      $("#Numero").val(cadenaCeros+$("#Numero").val())
    }
}
 

function CambioDespachado(){
    if(!$("#optDescargar").is(":checked")){
        $("#DescripcionDespachado").text("No se Aplicara la descarga de los Productos en el almacen selecionado.")
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
                        var producto = res.data.producto[0]
                        $(this).find("td").eq(4).find("input").val(producto.Nom_Producto+' / '+producto.Des_CortaProducto)
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
                        var producto = res.data.producto[0]
                        $(this).find("td").eq(4).find("input").val(producto.Nom_Producto)
                    }
                })
           
     
        }); 
    }
    CalcularTotal(CodLibro,variables)
}

function CambioCreditoContado(){
    $("#Cod_FormaPago").val($("#Cod_FormaPago option:first").val())
    if($("#Cod_FormaPago").val()!="" && $("#Cod_FormaPago").val()!=null){
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

function CambioLicitacion(){
    var visible = "none"
    if($("#optLicitacion").is(":checked")){
        visible = "block"
    }
    $("#divCodigoLicitacion").css("display",visible)
}

 
function CambioUnidadMedida() {
    if ($("#Nom_Producto").attr("data-id") != null && $("#Nom_Producto").attr("data-id") != '' && $("#Cod_Almacen").val()!=null && $("#Cod_Almacen").val()!='') {
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
                    var producto = res.data.producto[0]
                    $("#Stock").val(producto.Stock_Act)
                    CargarTipoPrecio()
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
    if($("#Cod_FormaPago").val()!=null && $("#Cod_FormaPago").val()!=""){
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

function CambioMoneda(){
    if($("#Cod_Moneda").val()!=null && $("#Cod_Moneda").val()!=""){
        if($("#Cod_Moneda").val()=="USD"){
            $("#divTC").css("display","block")
        }else{
            $("#divTC").css("display","none")
            $("#Tipo_Cambio").val("1")
        }
    }
}

function CambioFecha(CodLibro){
    if($("#Cod_Moneda").val()=="PEN"){
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
                        if(CodLibro=="08"){
                            $("#Tipo_Cambio").val(res.data.tipos_cambios[0].SunatCompra)
                        }else{
                            $("#Tipo_Cambio").val(res.data.tipos_cambios[0].SunatVenta)
                        }
                    } 
                })


            $("#Tipo_Cambio").val()
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
                    var comprobante = res.data.comprobante
                    $("#Numero").val("00000000"+comprobante[0].NumeroSiguiente)
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