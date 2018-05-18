var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../../constantes_entorno/constantes'
import { NuevoCliente, BuscarCliente , AbrirModalObs } from '../../modales'

var listaFormaPago = []
var obs_xml = null
var aSaldo

function VerRegistroCompra(variables,fecha_actual,CodLibro) {
    global.objCliente = ''
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
                                                ${variables.documentos.map(e=>yo`<option style="text-transform:uppercase" value="${e.Cod_TipoDoc}">${e.Nom_TipoDoc}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6" id="divNroDocumento">
                                        <div class="input-group">
                                            <input type="text" id="Nro_Documento" onblur="${() => BuscarClienteDoc(CodLibro)}" class="form-control input-sm required">
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
                                                <input type="text" id="Cliente" class="form-control required" data-id=null>
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
                                            <input type="text" id="Direccion" class="form-control input-sm required">
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
                                    <h4 class="box-title" id="Ruc_Empresa"><strong> R.U.C. 20442625256 </strong></h4>
                                </div>
                                <div class="row">
                                    <div class="col-sm-12">
                                        <div class="form-group">
                                            <select id="Cod_TipoComprobante" class="form-control selectPalerp">
                                                ${variables.tipocomprobantes.map(e=>yo`<option style="text-transform:uppercase" value="${e.Cod_TipoComprobante}">${e.Nom_TipoComprobante}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                </div> 
                                
                                <div class="row">
                                    <div class="col-md-5" id="divSerie">
                                        <div class="form-group">
 
                                            <select class="form-control input-sm" id="Serie">
                                                
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-7" id="divNumero">
                                        <div class="form-group">
                                            <input type="text" class="form-control input-sm required" id="Numero"   >
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
                                                        <button type="button" class="btn btn-success btn-xs" onclick="${()=>AbrirModalFormasPago(variables,fecha_actual)}"><i class="fa fa-money"></i></button>
                                                    </div>
                                                </div>
                                                <div class="col-sm-4" id="divOperacion">
                                                    <label id="lbCuentaCajaBanco">#Operacion</label>
                                                    <div class="form-group">
                                                        <select class="form-control input-sm" id="Cod_CuentaBancaria"> 
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
                                            <div class="col-md-4" id="divLicitacion">
                                                <div class="checkbox">
                                                    <label>
                                                        <input type="checkbox" id="optLicitacion" name="optLicitacion"> Licitacion
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
                                                    <input type="checkbox" id="optEsGasto" name="optEsGasto"> Es Gastos?
                                                </div>
                                            </div>
                                            <div class="col-sm-3" id="divMoneda">
                                                <div class="form-group">
                                                    <b>Moneda: </b>
                                                    <select id="Cod_Moneda" id="" class="form-control input-sm" onchange=${()=>CambioMoneda()}>
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
                                                    <input type="date" class="form-control input-sm" id="Fecha" value="${fecha_actual}">
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
                                                            <input type="checkbox" id="optDescargar" name="optDescargar"> ${CodLibro=='08'?'Descargar Producto':'Descargar de Almacen(es)'}
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="row" id="divExportacion">
                                                    <div class="checkbox">
                                                        <label>
                                                            <input type="checkbox" id="optExportacion" name="optExportacion"> Exportacion ? 
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

                                <div class="table-responsive">
                                    <table id="tablaProductos" class="table table-bordered table-hover">
                                        <thead>
                                            <tr> 
                                                <th>
                                                    <div class="input-group">
                                                        <label>Codigo/Producto/Servicio</label>
                                                        <span class="input-group-btn">
                                                            <button type="button" class="btn btn-default btn-xs"><i class="fa fa-search"></i></button>
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
                                                <th><input type="text" class="form-control input-sm"></th>
                                                <th><select class="form-control input-sm"> </select></th>
                                                <th><select class="form-control input-sm"> </select></th>
                                                <th><input type="number" class="form-control input-sm" value="0.00"></th>
                                                <th><input type="number" class="form-control input-sm" value="0.00"></th>
                                                <th><input type="number" class="form-control input-sm" value="0.00"></th>
                                                <th><input type="number" class="form-control input-sm" value="0.00"></th>
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
                                        <label>SON : </label>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label for="subtotal" class="col-sm-5 control-label">SUB TOTAL</label>
                        
                                            <div class="col-sm-7">
                                                <input type="number" class="form-control input-sm" id="subtotal">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-5">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="checkbox">
                                                    <label>
                                                        <input type="checkbox">Precio Unitario Incluye IGV?
                                                    </label>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="col-md-6"> 
                                                    <button type="button" class="btn btn-success btn-sm" onclick="${()=>AgregarFilaTabla()}"><i class="fa fa-plus"></i> Item</button>
                                                </div>
                                                <div class="col-md-6">
                                                    <button type="button" class="btn btn-danger btn-sm"><i class="fa fa-close"></i> Item</button>
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
                                                <input type="text" class="form-control input-sm">
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-4">
                                                <button type="button" class="btn btn-default btn-sm">Percepcion</button>
                                            </div>
                                            <div class="col-md-4">
                                                <button type="button" class="btn btn-default btn-sm">Asignar Series</button>
                                            </div>
                                            <div class="col-md-4">
                                                <button type="button" class="btn btn-default btn-sm">Buscar Series</button>
                                            </div>
                                        </div>  
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-group">
                                            <b>DESC. TOTAL : </b>
                                            <input type="number" class="form-control input-sm" value="0.00">
                                        </div>
                                        <div class="form-group">
                                            <b>EXONERADO </b>
                                            <input type="number" class="form-control input-sm" value="0.00">
                                        </div>
                                        <div class="form-group">
                                            <b>GRATUITAS: </b>
                                            <input type="number" class="form-control input-sm" value="0.00">
                                        </div>
                                        <div class="form-group">
                                            <b>PERCEPCION: </b>
                                            <input type="number" class="form-control input-sm" value="0.00">
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label>
                                                <input type="checkbox"> I.G.V 18%
                                            </label>
                                            <input type="number" class="form-control input-sm" value="0.00">
                                        </div>
                                        <div class="form-group">
                                            <label>
                                                <input type="checkbox"> SERVICIOS
                                            </label>
                                            <input type="number" class="form-control input-sm" value="0.00">
                                        </div>
                                        <div class="form-group">
                                            <label>
                                                <input type="checkbox"> I.S.C 3%
                                            </label>
                                            <input type="number" class="form-control input-sm" value="0.00">
                                        </div>
                                        <div class="form-group">
                                            <label>
                                                <input type="checkbox"> DESCUENTO GLOBAL
                                            </label>
                                            <input type="number" class="form-control input-sm" value="0.00">
                                        </div>
                                        <div class="form-group">
                                            <strong>GRAN TOTAL</strong>
                                            <input type="number" class="form-control input-sm" id="Gran_Total" value="0.00">
                                        </div>
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
    CambioMoneda()
    CambioTipoDocumento()
    CambioFormasPago(CodLibro)
    CambioCreditoContado()
    if(global.objCliente =='')
        BuscarCliente("Cliente","Nro_Documento",CodLibro == "08" ? "001" : "002")
    CargarConfiguracionDefault(CodLibro)
    $("input[name=optCredito][value='contado']").prop("checked",true)
    $('#modal-superior').on('hidden.bs.modal', function () {
            //console.log(global.objCliente)
            if(global.objCliente !=''){
                $("#Cod_TipoDocumento").val(global.objCliente.Cod_TipoDocumento)
                $("#Cliente").val(global.objCliente.Cliente)
                $("#Nro_Documento").val(global.objCliente.Nro_Documento)
                $("#Cliente").attr("data-id",global.objCliente.Id_ClienteProveedor)
                if(parseFloat(global.objCliente.Limite_Credito) > 0 )
                    $("#divCredito").css("display","block")
                
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
    })
}


function VerModalFormasPago(variables,amodo,Tipo_Cambio,Monto,Cod_Moneda){
    var el = yo`
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button> 
                    <h4 class="modal-title"><strong>Formas de Pago</strong></h4>
                </div>
                <div class="modal-body">
                    <div class="row" id="divCredito">
                        <div class="col-md-12 text-right"> 
                            <button type="button" class="btn btn-default btn-sm">
                                <i class="fa fa-money text-green"></i> Credito
                            </button>
                        </div>
                    </div>
                    <p></p>
                    <div class="row">
                        <div class="col-sm-7">
                            <div class="panel panel-default">
                                <div class="panel-heading">
                                    <h4> Monedas </h4>
                                </div>
                                <div class="panel-body">
                                    ${variables.formaspago.map(e=>yo`
                                        ${e.Cod_FormaPago=="008"?
                                            variables.monedas.map(m=>
                                                m.Cod_Moneda!="PEN"?
                                                m.Cod_Moneda!="USD"?
                                                m.Cod_Moneda!="EUR"?
                                                yo``
                                                :
                                                yo`<div class="col-md-4"><div class="radio"><label><input type="radio" name="Cod_Moneda" value="euros"><i class="fa fa-euro fa-3x"></i></label></div></div>`
                                                :
                                                yo`<div class="col-md-4"><div class="radio"><label><input type="radio" name="Cod_Moneda" value="dolares"><i class="fa fa-dollar fa-3x"></i></label></div></div>`
                                                :
                                                yo`<div class="col-md-4"><div class="radio"><label><input type="radio" name="Cod_Moneda" value="soles"> <strong style="font-size:3em">S/</strong></label></div></div>`
                                            )
                                        :
                                        yo``
                                        }
                                    `)}
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-5">
                            <div class="panel panel-default">
                                <div class="panel-heading">
                                    <h4> Tarjetas </h4>
                                </div>
                                <div class="panel-body">
                                    <div class="row" id="divTarjetas">
                                        ${variables.formaspago.map(e=>yo`
                                            ${  e.Cod_FormaPago!="005"?
                                                e.Cod_FormaPago!="006"?
                                                yo``
                                                :
                                                yo`<div class="col-md-6"><div class="radio"><label><input type="radio" id="Cod_FormaPago" name="Cod_FormaPago"> <i class="fa fa-cc-mastercard  fa-3x"></i></label></div></div>`
                                                :
                                                yo`<div class="col-md-6"><div class="radio"><label><input type="radio" id="Cod_FormaPago" name="Cod_FormaPago"> <i class="fa fa-cc-visa fa-3x"></i></label></div></div>`
                                            }
                                        `)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-8">
                            <div class="panel panel-default">
                                <div class="panel-heading">
                                    <h4>Agregar Formas de Pago</h4>
                                </div>
                                <div class="panel-body">
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label>Monto</label>
                                            <input type="number" class="form-control">
                                        </div>
                                    </div>
                                    <div class="col-md-8">
                                        <div class="row">
                                            <div class="col-md-6" id="divReferencia">
                                                <div class="form-group">
                                                    <label>Referencia</label>
                                                    <input type="text" class="form-control">
                                                </div>
                                            </div>
                                            <div class="col-md-6" id="divCompSaldo">
                                                <div class="form-group">
                                                    <button class="btn btn-default btn-sm">Comp. Saldo</button>
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
                                                    <button class="btn btn-default btn-sm">Agregar</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                     
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="panel panel-default">
                                <div class="panel-heading">
                                    <h4>Datos del Comprobante</h4>
                                </div>
                                <div class="panel-body"> 
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
                                                    <input type="number" class="form-control" id="Tipo_Cambio_Global">
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
                            <div class="panel-body"> 
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
                            <div class="panel-footer">
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
                <div class="modal-footer text-center"> 
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-info" id="btnAceptar">Aceptar</button>
                </div>
            </div>
        </div>`

    var modal_proceso = document.getElementById('modal-superior');
    empty(modal_proceso).appendChild(el);
    $('#modal-superior').modal()   
    
    CargarConfiguracionDefaultFormaPago(variables,amodo,Cod_Moneda,Tipo_Cambio)
    /*switch (amodo) {
        case 0:
            $("#divCredito").css("display","none")

            if(Cod_Moneda!="PEN"){
                $("#divTipoCambioGlobal").css("display","block")
            }else{
                $("#divTipoCambioGlobal").css("display","none")
                $("#Tipo_Cambio_Global").val(1)
            }

            CalcularSaldo(Cod_Moneda,Tipo_Cambio)
            $("#btnAceptar").css("display","none")
            OcultarCompletarSaldo(Cod_Moneda)
            $("#Cod_MonedaGlobal").text(Cod_Moneda)
            $("#divReferencia").css("display","none")
            $("#divTipoCambio").css("display","none")
            RecuperarTipoCambio(Cod_Moneda,variables,Tipo_Cambio)
            if(aSaldo==0)
                $("#btnAceptar").css("display","none")
            else    
                $("#btnAceptar").css("display","block")
            break
        case 1:
            break
    }*/
}
 

function AgregarFilaTabla(){
    var fila = yo`
                <tr> 
                    <td><input type="text" class="form-control input-sm"></td>
                    <td><input type="text" class="form-control input-sm"></td>
                    <td><input type="text" class="form-control input-sm"></td>
                    <td><input type="number" class="form-control input-sm"></td>
                    <td><input type="number" class="form-control input-sm"></td>
                    <td><input type="number" class="form-control input-sm"></td>
                    <td><label>0.00</label></td>
                </tr>`
    $("#tablaBody").append(fila)
}

function LlenarCuentaBancaria(cuentas){
    var html = ''
    for(var i=0; i<cuentas.length; i++){
        html = html+'<option value="'+cuentas[i].Cod_CuentaBancaria+'">'+cuentas[i].Des_CuentaBancaria+'</option>'
    }
     
    $("#Cod_CuentaBancaria").html('')
    $("#Cod_CuentaBancaria").html(html) 
}

function LlenarCuentaBancaria_(cuentas){
    var html = ''
    for(var i=0; i<cuentas.length; i++){
        html = html+'<option value="'+cuentas[i].NroCuenta_Bancaria+'">'+cuentas[i].CuentaBancaria+'</option>'
    }
     
    $("#Cod_CuentaBancaria").html('')
    $("#Cod_CuentaBancaria").html(html) 
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

function LlenarLicitaciones(licitaciones){
    var html = ''
    for(var i=0; i<licitaciones.length; i++){
        html = html+'<option value="'+licitaciones[i].Cod_Licitacion+'">'+licitaciones[i].Des_Licitacion+'</option>'
    }
     
    $("#Cod_Licitacion").html('')
    $("#Cod_Licitacion").html(html) 
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
    fetch(URL + '/compras_api/get_variables_formas_pago', parametros)
        .then(req => req.json())
        .then(res => {
            console.log(res.data)
            variables['tipos_cambios']=res.data.tipos_cambios
            if (res.respuesta == 'ok') {
                VerModalFormasPago(variables,0,Tipo_Cambio,parseFloat(Gran_Total)/parseFloat(Tipo_Cambio),Cod_Moneda)
            } 
            H5_loading.hide();
        })
}

function CalcularSaldo(Cod_Moneda,Tipo_Cambio){
    if($("#divCredito").css("display")=="block"){
        var SumaTotal = 0 
        /*for (int i = 0; i < dgvFormasPago.Rows.Count; i++)
        {
            SumaTotales += Math.Round(decimal.Parse(dgvFormasPago.Rows[i].Cells["Total"].Tag.ToString()), 2);
        }
        aSaldo = aMonto - SumaTotales;
        btSaldo.ExtraText = aCodMoneda + " " + Math.Round(aSaldo / aTipoCambio, 2).ToString();
        btSaldo.Tag = Math.Round(aSaldo, 2);*/
        //for(var i=0;i<)
    }else{
        aSaldo = 0
        $("#btnSaldo").text(Cod_Moneda+" "+(parseFloat(aSaldo)/parseFloat(Tipo_Cambio)).toFixed(2))
        $("#btnSaldo").attr("data-value",parseFloat(aSaldo).toFixed(2))
    }
}

function RecuperarTipoCambio(Cod_Moneda,variables,Tipo_Cambio){
    console.log(variables)
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

function OcultarCompletarSaldo(Cod_Moneda){
    var  _Cod_Moneda = ""
    if($('input[name=Cod_Moneda]:checked').val() == 'soles')
        _Cod_Moneda = "PEN"
    if($('input[name=Cod_Moneda]:checked').val() == 'dolares')
        _Cod_Moneda = "USD"
    if($('input[name=Cod_Moneda]:checked').val() == 'euros')
        _Cod_Moneda = "EUR"

    if((_Cod_Moneda==Cod_Moneda || _Cod_Moneda=="PEN") && aSaldo!=0)
        $("#divCompSaldo").css("display","true")
    else    
        $("#divCompSaldo").css("display","none")
}

function CargarConfiguracionDefaultFormaPago(variables,amodo,Cod_Moneda,Tipo_Cambio){
    switch (amodo) {
        case 0:
            $("#divCredito").css("display","none")

            if(Cod_Moneda!="PEN"){
                $("#divTipoCambioGlobal").css("display","block")
            }else{
                $("#divTipoCambioGlobal").css("display","none")
                $("#Tipo_Cambio_Global").val(1)
            }

            CalcularSaldo(Cod_Moneda,Tipo_Cambio)
            $("#btnAceptar").css("display","none")
            OcultarCompletarSaldo(Cod_Moneda)
            $("#Cod_MonedaGlobal").text(Cod_Moneda)
            $("#divReferencia").css("display","none")
            $("#divTipoCambio").css("display","none")
            RecuperarTipoCambio(Cod_Moneda,variables,Tipo_Cambio)
            if(aSaldo==0)
                $("#btnAceptar").css("display","none")
            else    
                $("#btnAceptar").css("display","block")
            break
        case 1:
            break
    }
}


function CargarConfiguracionDefault(CodLibro){
    CargarSeries(CodLibro)
    $("#divExportacion").css("display","none")
}
 

function GenerarComprobante(){
    console.log(global.objCliente)
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
                        toastr.error('No se cuenta con ninguna Serie Autorizada para este tipo de Comprobante.\n\n Solicite al Administrador Autorice una serie para Continuar.','Error',{timeOut: 5000})
                    }
                } 
            })

        CambioComprobantes() 
    }
}


function CambioCreditoContado(){
    $("#Cod_FormaPago").val($("#Cod_FormaPago option:first").val());
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
 
/*function CambioContado(){
    if($("#Cod_FormaPago").val()!="" && $("#Cod_FormaPago").val()!=null){
        if($("#Cod_FormaPago").val()!="008" || $('input[name=optCredito]:checked').val()=="credito"){
            $("#lbCuentaCajaBanco").css("display","block")
            $("#divCuentaCajaBancos").css("display","block")
        }else{
            $("#lbCuentaCajaBanco").css("display","none")
            $("#divCuentaCajaBancos").css("display","none")
        }
    }
}*/

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
                        TraerCuentaBancariaPorSucursal()
                    }else{
                        toastr.error('No Existe la Operacion de CHEQUE para ventas.\nSe debe de Depositar el Cheque eh ingresarlo como Deposito en Cuenta.','Error',{timeOut: 5000})
                        $("#Cod_FormaPago").val(null)
                    }
                    break 
                case "011":
                    $("#Cod_CuentaBancaria").css("display","block")
                    $("#lbCuentaCajaBanco").text("# de Operacion")
                    if(CodLibro=="08"){
                        TraerCuentasBancariasXIdClienteProveedor()
                    }else{
                        TraerCuentaBancariaPorSucursal()
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
                    TraerCuentaBancariaPorSucursal()
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
                    $("#Numero").val("00000000"+comprobante[0].Numero)
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
            Id_ClienteProveedor
        })
    }
    fetch(URL + '/compras_api/get_pago_adelantado', parametros)
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


function TraerCuentaBancariaPorSucursal(){
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
                LlenarCuentaBancaria(cuentas)
            } 
        })
}

function TraerCuentasBancariasXIdClienteProveedor(){
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
    fetch(URL + '/cuentas_bancarias_api/get_cuenta_by_id_cliente', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var cuentas = res.data.cuentas
                LlenarCuentaBancaria_(cuentas)
            } 
        })
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
                $("#Cliente").val(res.data.cliente[0].Cliente)
                $("#Nro_Documento").val(res.data.cliente[0].Nro_Documento)
                Id_ClienteProveedor = res.data.cliente[0].Id_ClienteProveedor
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
    fetch(URL + '/compras_api/get_diagramas_xml_comprobante', parametros)
        .then(req => req.json())
        .then(res => {
            var variables = res.data
            AbrirModalObs(variables.diagramas,obs_xml,"modal_observaciones","modal_obs_body")
        })
}

 

function ComprobantePago(Cod_Libro) {
    H5_loading.show();
    if(Cod_Libro == "08"){
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
            body: JSON.stringify({
                Cod_Libro
            })
        }
        fetch(URL + '/compras_api/get_variable_registro_compra', parametros)
            .then(req => req.json())
            .then(res => {
                var variables = res.data
                if (res.respuesta == 'ok') {
                    VerRegistroCompra(variables,fecha_format,Cod_Libro)
                }
                else { 
                    VerRegistroCompra([])
                }
                H5_loading.hide()
            })
    }else{

    }
}

export { ComprobantePago }