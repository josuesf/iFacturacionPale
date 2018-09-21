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
    var tab = yo`
        <li class="" onclick=${()=>TabVentaSeleccionado(idTabVenta)}><a href="#tab_${idTabVenta}" data-toggle="tab" aria-expanded="false" id="id_${idTabVenta}">Ventas <a style="padding-left: 10px;" onclick=${()=>CerrarTabVenta(idTabVenta)} class="btn"><i class="fa fa-close text-danger"></i></a></a></li>`

    var tabContent = yo`
        <div class="tab-pane" id="tab_${idTabVenta}">
            <div class="row">
                <div class="col-md-8">
                    <span class="badge style-primary" style="margin-bottom:  4px;"> Favoritos</span>
                    <div class="scroll-horizontal">
                        ${CrearBotonesFavoritos(variables.favoritos,idTabVenta)} 
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="btn-group-horizontal pull-right" style="padding-top:  20px;">
                        <button type="button" class="btn btn-raised btn-primary" onclick=${() => VentaSimple()}>Venta Simple</button>
                        <button type="button" class="btn btn-raised btn-success" onclick=${() => VentaCompleta()}>Venta Completa</button>
                    </div>
                </div>
            </div>
            <p></p>
            <div class="row">
                <div class="col-md-3">
                    <div class="card" id="div-cliente">
                        <div class="card-head card-head-sm style-primary text-center">
                            <header>Datos del cliente</header>

                            <div class="tools">
                                <div class="btn-group">
                                    <a class="btn btn-icon-toggle text-white" onclick=${()=>NuevoCliente(variables.documentos)}><i class="fa fa-plus"></i></a>
                                    <a class="btn btn-icon-toggle text-white" onclick=${()=>EditarCliente(idTabVenta)}><i class="fa fa-pencil"></i></a>
                                    <a class="btn btn-icon-toggle text-white" onclick=${()=>BuscarCliente("Cliente_"+idTabVenta,"Nro_Documento_"+idTabVenta,null)}><i class="fa fa-search"></i></a>
                                    <a class="btn btn-icon-toggle text-white"><i class="fa fa-globe"></i></a>
                                </div>
                            </div>

                        </div>
                        <div class="card-body">
                            <form class="form floating-label" novalidate="novalidate">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <select class="form-control" id="Cod_TipoDoc_${idTabVenta}">
                                                ${variables.documentos.map(e=>yo`<option style="text-transform:uppercase" value="${e.Cod_TipoDoc}">${e.Nom_TipoDoc}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <input type="text" id="Nro_Documento_${idTabVenta}" placeholder="Nro Documento" onblur="${() => BuscarClienteDoc(CodLibro,idTabVenta)}" onkeypress=${()=>KeyPressClienteDoc(idTabVenta)} onkeydown=${()=>CambioNroDocumento(event,idTabVenta)} class="form-control input-sm dirty">
                                            <div class="form-control-line"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <input type="text" id="Cliente_${idTabVenta}" class="form-control input-sm" placeholder="Nombres completos" data-id=null>
                                            <div class="form-control-line"></div>
                                        </div>
                                    </div>
                                </div> 
                                <div class="row">
                                    <div class="col-md-12"> 
                                        <div class="form-group">
                                            <input type="text" class="form-control input-sm" placeholder="Direccion" id="Direccion_${idTabVenta}"> 
                                            <div class="form-control-line"></div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="card-actionbar">

                            <div class="row" style="text-align: left;">
                                <div class="col-sm-6">
                                     
                                        <div class="col-md-12"> 
                                                ${variables.formaspago.map(e=>yo`
                                                    ${e.Cod_FormaPago=="008"? 
                                                        yo`<div class="form-group">
                                                                <label>Moneda</label> 
                                                                <select id='Cod_Moneda_Forma_Pago_${idTabVenta}' class="form-control input-sm" onchange=${()=>CambioMonedaVentas(idTabVenta)}>
                                                                    ${variables.monedas.map(m=>
                                                                        yo`<option value=${m.Cod_Moneda}>${m.Nom_Moneda}</option>`
                                                                    )}
                                                                </select>
                                                            </div>`
                                                        :yo``
                                                    }
                                                `)}
                                             
                                        </div> 

                                    ${MostrarCampos(0,variables.formaspago,1,idTabVenta)}
                                                
                                </div>
                                <div class="col-sm-6">
                                    
                                         
                                        <div class="cc-selector-2 text-center row" id="divTarjetas_${idTabVenta}"> 
                                            <label> Tarjetas </label>
                                            ${variables.formaspago.map(e=>yo`
                                                ${  e.Cod_FormaPago!="005"?
                                                    e.Cod_FormaPago!="006"?
                                                    yo``
                                                    :
                                                    yo`
                                                    <div class="row">
                                                        <div class="col-md-12">
                                                            <input  checked="checked" id="Cod_FormaPago_MasterCard_${idTabVenta}" type="radio" name="Cod_FormaPago_Modal_${idTabVenta}" value="mastercard"  onchange=${()=>CambioMonedaFormaPagoMasterCard(idTabVenta)}/>
                                                            <label class="drinkcard-cc mastercard" for="Cod_FormaPago_Modal_${idTabVenta}"></label>
                                                        </div>
                                                    </div>`
                                                    :
                                                    yo`
                                                    <div class="row">
                                                        <div class="col-md-12">
                                                            <input  checked="checked" id="Cod_FormaPago_Visa_${idTabVenta}" type="radio" name="Cod_FormaPago_Modal_${idTabVenta}" value="visa" onchange=${()=>CambioMonedaFormaPagoVisa(idTabVenta)}/>
                                                            <label class="drinkcard-cc visa" for="Cod_FormaPago_Modal_${idTabVenta}"></label>
                                                        </div>
                                                    </div>`
                                                }
                                            `)}
                                                
                                        </div>

                                        ${MostrarCampos(0,variables.formaspago,2,idTabVenta)}
                                             
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-9">
                    <div class="card">
                        <div class="card-head card-head-sm style-primary text-center">
                            <h4>Detalle de la venta</h4>
                        </div>
                        <div class="card-body">

                            <div class="row">
                                <div class="col-md-12">
                                    <div class="col-md-8">
                                        <div class="form-group">
                                            <label>Codigo/Nombres Producto</label>
                                            <input type="text" class="form-control" id="txtBusqueda_${idTabVenta}" onblur=${()=>BuscarProductoCP(event,'blur',idTabVenta)} onkeypress=${()=>BuscarProductoCP(event,'key',idTabVenta)}>
                                            <div class="form-control-line"></div>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            <label>Precio</label>
                                            <select class="form-control" id="Cod_Precio_${idTabVenta}">
                                                ${variables.precios.map(e=>yo`<option style="text-transform:uppercase" value="${e.Cod_Precio}">${e.Nom_Precio}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            <label>Almacen</label>
                                            <select class="form-control" id="Cod_Almacen_${idTabVenta}">
                                                <option value="">Seleccione un almacen</option>
                                                ${variables.almacenes.map(e=>yo`<option style="text-transform:uppercase" value="${e.Cod_Almacen}">${e.Des_Almacen}</option>`)}
                                            </select>
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
                                        <button class="btn btn-default btn-lg btn-raised btn-primary" id="btnTotal_${idTabVenta}" data-toggle="button" aria-pressed="false" autocomplete="off" onclick=${()=>VerVuelto(variables,idTabVenta)}><i class="fa fa-money text-green"></i></button>
                                        <button class="btn btn-default btn-lg btn-raised btn-success" id="btnConversion_${idTabVenta}" style="display:none"><i class="fa fa-refresh text-green"></i></button> 
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card-actionbar" id="divFooter_${idTabVenta}">
                            </div>

                        </div>
                        
                    </div>
                </div>
            </div>
        </div>`
    
    $("#tabs").append(tab)
    $("#tabs_contents").append(tabContent)
    $("#id_"+idTabVenta).click()

    TraerSimboloSOLES(variables.monedas,'PEN',idTabVenta)
    //CambioMonedaFormaPagoSoles(idTabVenta)
    //CambioMonedaFormaPagoDolares(idTabVenta)
    //CambioMonedaFormaPagoEuros(idTabVenta)
    CambioMonedaVentas(idTabVenta)
    CambioMonedaFormaPagoMasterCard(idTabVenta)
    CambioMonedaFormaPagoVisa(idTabVenta)
    

    /*$("#Nro_Documento_"+idTabVenta).tagsinput({
        maxTags: 1
    });

    $("#Cliente_"+idTabVenta).tagsinput({
        maxTags: 1
    })

    $("#Direccion_"+idTabVenta).tagsinput({
        maxTags: 1
    })

    $('#Nro_Documento_'+idTabVenta).on('beforeItemRemove',function(event) {
        if(!arrayValidacion.includes($("#Cliente_"+idTabVenta).attr("data-id"))){ 
            $("#Cliente_"+idTabVenta).tagsinput('removeAll')
            $("#Cliente_"+idTabVenta).attr("data-id",null)
            $("#Direccion_"+idTabVenta).tagsinput('removeAll') 
        }
    });

    $('#Nro_Documento_'+idTabVenta).on('beforeItemAdd', function(event) {
        global.objClienteVenta = ''
        getObjectArrayJsonVentas(global.variablesVentas,idTabVenta)[0].Cliente={}
        $("#Nro_Documento_"+idTabVenta).tagsinput('removeAll') 
        $("#Cliente_"+idTabVenta).tagsinput('removeAll') 
        $("#Cliente_"+idTabVenta).attr("data-id",null)
        $("#Direccion_"+idTabVenta).tagsinput('removeAll') 
    });

    $('#Nro_Documento_'+idTabVenta).on('itemAdded', function(event) { 
        console.log("add item")
        if($("#Nro_Documento_"+idTabVenta).val().trim()!=''){
            BuscarClienteDoc(CodLibro,idTabVenta) 
        }  
        KeyPressClienteDoc(idTabVenta)
    });*/
 
    

    $('#modal-superior').off('hidden.bs.modal').on('hidden.bs.modal', function () { 
        //console.log("producto seleccionado", global.objProductoVentas)
        if(global.objProductoVentas!=''){ 
            $("#txtBusqueda_"+IdTabSeleccionado).val("")

            ValidarStock(global.objProductoVentas.Stock_Act,global.objProductoVentas,IdTabSeleccionado,function(flag){
                if(flag){
                    ExisteProducto(global.objProductoVentas.Cod_Producto,IdTabSeleccionado,function(flag,index){
 
                        if(flag){                            
                            
                            $('#tablaBodyProductosVentas_'+IdTabSeleccionado+' tr:eq('+ index + ')').find('td.Cantidad').find('input').val((parseFloat($('#tablaBodyProductosVentas_'+IdTabSeleccionado+' tr:eq('+ index + ')').find('td.Cantidad').find('input').val())+1).toFixed(2))
                            $('#tablaBodyProductosVentas_'+IdTabSeleccionado+' tr:eq('+ index + ')').find('td.Precio').text((parseFloat($('#tablaBodyProductosVentas_'+IdTabSeleccionado+' tr:eq('+ index + ')').find('td.Cantidad').find('input').val())*parseFloat(global.objProductoVentas.Precio_Venta)).toFixed(2))
                            $('#tablaBodyProductosVentas_'+IdTabSeleccionado+' tr:eq('+ index + ')').find('td.DescuentoTotal').text((parseFloat($('#tablaBodyProductosVentas_'+IdTabSeleccionado+' tr:eq('+ index + ')').find('td.DescuentoUnitario').text())*parseFloat($('#tablaBodyProductosVentas_'+IdTabSeleccionado+' tr:eq('+ index + ')').find('td.Cantidad').find('input').val())).toFixed(2))
                             

                            changeDetallesArrayJsonVentas(IdTabSeleccionado,$('#tablaBodyProductosVentas_'+IdTabSeleccionado+' tr:eq('+ index + ')').find('td.Cod_Producto').text(),[null,null,null,null,null,null,null,null,$('#tablaBodyProductosVentas_'+IdTabSeleccionado+' tr:eq('+ index + ')').find('td.Cantidad').find('input').val(),null,null,null,$('#tablaBodyProductosVentas_'+IdTabSeleccionado+' tr:eq('+ index + ')').find('td.Precio').text(),null,null,null,null])

                        }else{
                            //console.log(global.objProductoVentas)
                            var idFila = $('#tablaBodyProductosVentas_'+IdTabSeleccionado+' > tr').length
                            var fila = yo`
                            <tr id="${idFila+''+IdTabSeleccionado}">
                                <td class="Cod_Producto">${global.objProductoVentas.Cod_Producto}</td> 
                                <td class="Flag_Stock hidden">${global.objProductoVentas.Flag_Stock}</td> 
                                <td class="Nom_Producto" style="width: 30%;"><div class="form-group"><input type="text" class="form-control input-sm" value=${global.objProductoVentas.Nom_Producto}  onchange=${()=>CambioNombreProducto(idFila+''+IdTabSeleccionado,IdTabSeleccionado)} onkeypress=${()=>CambioNombreProducto(idFila+''+IdTabSeleccionado,IdTabSeleccionado)}><div class="form-control-line"></div></div></td> 
                                <td class="Cantidad"><div class="form-group"><input type="number" class="form-control input-sm" value="1.0000" onblur=${()=>FocusInOutCantidadVenta(idFila+''+IdTabSeleccionado,IdTabSeleccionado)} onkeyup=${()=>CambioCantidadVenta(idFila+''+IdTabSeleccionado,IdTabSeleccionado)} onchange=${()=>CambioCantidadVenta(idFila+''+IdTabSeleccionado,IdTabSeleccionado)}><div class="form-control-line"></div></div></td>
                                <td class="Unitario hidden">${global.objProductoVentas.Precio_Venta}</td>
                                <td class="UnitarioBase"><div class="form-group"><input type="number" class="form-control input-sm" value=${global.objProductoVentas.Precio_Venta} onkeyup=${()=>CambioPrecioDescuentos(idFila+''+IdTabSeleccionado,IdTabSeleccionado)} onchange=${()=>CambioPrecioDescuentos(idFila+''+IdTabSeleccionado,IdTabSeleccionado)}><div class="form-control-line"></div></div></td> 
                                <td class="Descuentos"><div class="form-group"><input type="number" class="form-control input-sm" value="0.00" onchange=${()=>CambioPrecioDescuentos(idFila+''+IdTabSeleccionado,IdTabSeleccionado)} onkeyup=${()=>CambioPrecioDescuentos(idFila+''+IdTabSeleccionado,IdTabSeleccionado)}><div class="form-control-line"></div></div></td>
                                <td class="DescuentoUnitario hidden">0</td> 
                                <td class="DescuentoTotal hidden">0</td> 
                                <td class="Precio">${global.objProductoVentas.Precio_Venta}</td>
                                <td>
                                    <div style="display:flex;"> 
                                        <button type="button" onclick="${()=>EliminarFila(idFila+''+IdTabSeleccionado,IdTabSeleccionado)}" class="btn btn-danger btn-sm"><i class="fa fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>`
                            $('#tablaBodyProductosVentas_'+IdTabSeleccionado).append(fila)
                            $('input[type="number"]').blur(function(){
                                $(this).val(parseFloat($(this).val()).toFixed(2))
                            })

                            $('input[type="number"]').keypress(function(e){
                                if(e.which == 13) {
                                    $(this).val(parseFloat($(this).val()).toFixed(2))
                                }
                            })
                              
                             getObjectArrayJsonVentas(global.variablesVentas,IdTabSeleccionado)[0].Detalles.push({ 
                                id_ComprobantePago:0,
                                id_Detalle:0,
                                Id_Producto:global.objProductoVentas.Id_Producto,
                                Codigo:global.objProductoVentas.Cod_Producto,
                                Descripcion:global.objProductoVentas.Nom_Producto,
                                Almacen:global.objProductoVentas.Cod_Almacen,
                                UM:global.objProductoVentas.Cod_UnidadMedida,
                                Stock:global.objProductoVentas.Stock_Act,
                                Cantidad:1,
                                Despachado:1,
                                PU:global.objProductoVentas.Precio_Venta,
                                Descuento:'0.00',
                                Importe:global.objProductoVentas.Precio_Venta,
                                Cod_Manguera:$("#Cod_Precio_"+IdTabSeleccionado).val(),
                                Tipo:global.objProductoVentas.Cod_TipoOperatividad,
                                Obs_ComprobanteD:'',
                                Series:[],
                                Nom_UnidadMedida:global.objProductoVentas.Nom_UnidadMedida,
                                Des_Almacen:global.objProductoVentas.Des_Almacen                                
                            })
                        }
                        CalcularTotal(IdTabSeleccionado)
                        CalcularTotalDescuentos(IdTabSeleccionado)
                    })
                   
                    
                }else{
                    toastr.error('No existe stock para dicho producto','Error',{timeOut: 5000})  
                }
            })
            $("#txtBusqueda_"+IdTabSeleccionado).focus()
        }


        if(global.objClienteVenta!=''){ 
            console.log(global.objClienteVenta)
            //$("#Nro_Documento_"+IdTabSeleccionado).tagsinput('removeAll') 
            //$("#Cliente_"+IdTabSeleccionado).tagsinput('removeAll') 
            //$("#Direccion_"+IdTabSeleccionado).tagsinput('removeAll') 

            //$("#Nro_Documento_"+IdTabSeleccionado).tagsinput('add',global.objCliente.Nro_Documento)
            //$("#Cliente_"+IdTabSeleccionado).tagsinput('add',global.objCliente.Cliente)
            //$("#Direccion_"+IdTabSeleccionado).tagsinput('add',global.objCliente.Direccion)
            $("#Cod_TipoDoc_"+IdTabSeleccionado).val(global.objCliente.Cod_TipoDocumento)
            $("#Nro_Documento_"+IdTabSeleccionado).val(global.objCliente.Nro_Documento)
            $("#Cliente_"+IdTabSeleccionado).val(global.objCliente.Cliente)
            $("#Direccion_"+IdTabSeleccionado).val(global.objCliente.Direccion)
            $("#Cliente_"+IdTabSeleccionado).attr("data-id",global.objCliente.Id_ClienteProveedor)

            $("#Nro_Documento_"+IdTabSeleccionado).bind("keypress", function(event){
                event.preventDefault();
                event.stopPropagation();
            });
            
            $("#Cliente_"+IdTabSeleccionado).bind("keypress", function(event){
                event.preventDefault();
                event.stopPropagation();
            });
            
            $("#Direccion_"+IdTabSeleccionado).bind("keypress", function(event){
                event.preventDefault();
                event.stopPropagation();
            });
            
            $("#Nro_Documento_"+IdTabSeleccionado).attr("disabled",true);
            $("#Cliente_"+IdTabSeleccionado).attr("disabled",true);
            $("#Direccion_"+IdTabSeleccionado).attr("disabled",true);
            $("#Cod_TipoDoc_"+IdTabSeleccionado).attr("disabled",true);
            

            changeArrayJsonVentas(global.variablesVentas,IdTabSeleccionado,[null,null,null,null,null,null,global.objClienteVenta,null])
        }


    })

    $("#modal-superior").off('shown.bs.modal').on("shown.bs.modal", function () { 
         
        $("#chbSoloProductoStock").prop("checked",false)
        $("#divSoloProductoStock").css("display","none")
        $("#Cod_Categoria").css("display","block")
        $("#lbCod_Categoria").css("display","block")
        $("#Cod_Categoria").val("01")
        $("#Cod_Precio").val($("#Cod_Precio_"+IdTabSeleccionado).val())
        Buscar() 
    });

    IdTabSeleccionado = idTabVenta
    VerVuelto(variables,idTabVenta)

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


function CargarModalConfirmacion(idTab,_CodTipoComprobante){
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
                <p>Se ha introducido moneda extranjera pero\n\nno introdujo un total recibido.Desea continuar sin comprar moneda extranjera?</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="btnConfirmacion" onclick=${()=>AceptarConfirmacion(idTab,_CodTipoComprobante)}>Aceptar</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>`


    var modal_proceso = document.getElementById('modal-alerta');
    empty(modal_proceso).appendChild(el);
    $('#modal-alerta').modal()
}

function CargarModalConfirmacionME(idTab,_MontoComprar,_NombreMoneda,_TipoCambio,_CodMoneda){
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
                <p>Desea comprar ${parseFloat(_MontoComprar).toFixed(2)} ${_NombreMoneda} ?</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger pull-left" data-dismiss="modal" onclick=${()=>LimpiarVenta(idTab)}>Cancelar</button>
                <button type="button" class="btn btn-primary" id="btnConfirmacion" onclick=${()=>AceptarConfirmacionME(idTab,_MontoComprar,_NombreMoneda,_TipoCambio,_CodMoneda)}>Aceptar</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>`


    var modal_proceso = document.getElementById('modal-alerta');
    empty(modal_proceso).appendChild(el);
    $('#modal-alerta').modal()
}

function AceptarConfirmacion(idTab,_CodTipoComprobante){
    VentaSimpleSinME(idTab,_CodTipoComprobante)
}

function AceptarConfirmacionME(idTab,_MontoComprar,_NombreMoneda,_TipoCambio,_CodMoneda){
    CompraSimple(idTab,_MontoComprar,_NombreMoneda,_TipoCambio,_CodMoneda)
}



function VerVuelto(variables,idTab){
    //if($("#btnTotal_"+idTab).hasClass('active')){
    //    CrearDivFavoritos(variables,idTab)
    //}else{
        CrearDivVuelto(idTab)
    //}
}

function MostrarCampos(indice,arreglo,opcion,idTab){
    if(opcion==1){
        if(indice<arreglo.length){
            if(arreglo[indice].Cod_FormaPago=='008'){
                return yo` 
                        <div class="col-md-12">
                            <div class="form-group">
                                <label>Tipo Cambio</label>
                                <input type="number" class="form-control input-sm" value="1.00" id="Tipo_Cambio_Venta_${idTab}" name="Tipo_Cambio_Venta_${idTab}" onkeypress=${()=>CambioTipoCambioVenta(idTab)}>
                            </div> 
                        </div> `
            }else{
                MostrarCampos(indice+1,arreglo,opcion,idTab)
            }
        }else{
            return yo``
        }
       
    }else{

        if(indice<arreglo.length){
            if(arreglo[indice].Cod_FormaPago=='005' || arreglo[indice].Cod_FormaPago=='006'){
                return  yo` 
                        <div class="col-md-12">
                            <div class="form-group">
                                <label>Nro Ref.</label>
                                <input type="number" class="form-control input-sm" value="" id="Nro_Tarjeta_${idTab}" name="Nro_Tarjeta_${idTab}" >
                            </div> 
                        </div> `
            }else{
                MostrarCampos(indice+1,arreglo,opcion,idTab)
            }
        }else{
            return yo``
        }
 
    }
}

function CrearBotonesProductos(c,idTab,callback){
    if(!arrayValidacion.includes($("#Cod_Almacen_"+idTab).val())){
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                CodCategoria:c.Cod_Categoria,
                CodAlmacen:$("#Cod_Almacen_"+idTab).val()
            })
        }
        fetch(URL + '/productos_serv_api/get_producto_by_codalm_codprec_stock', parametros)
            .then(req => req.json())
            .then(res => {
                if(res.respuesta=="ok"){
                    var productos = res.data.productos
                    callback(c,productos)
                }else{
                    callback(c,[])
                }
        
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            }); 
    }else{
        toastr.error('Es necesario seleccionar un almacen','Error',{timeOut: 5000})
    }
}

function CrearBotonesCategorias(categorias,idTab){
     
    return yo`<div>
            ${categorias.map(e=> 
                e.Cod_Padre==''?
                    yo`<a class="btn btn-default btn-sm" onclick=${()=>SeleccionarCategoria(e,categorias,idTab)}>${e.Des_Categoria}</a>`
                :
                    yo``)}
            </div>` 
}


function CrearBotonesCategoriasXSeleccion(categorias,CodPadre,idTab){
     
    var listaProductos= yo`<div>
            ${categorias.map(e=> 
                e.Cod_Padre==CodPadre?
                    yo`<a class="btn btn-default btn-sm" onclick=${()=>SeleccionarCategoria(e,categorias,idTab)}>${e.Des_Categoria.toString().replace('-->','')}</a>`
                :
                    yo``)}
            </div>`
    
    if(CodPadre==''){
        $("#divTools_"+idTab).css("display","none")
    }else{
        $("#divTools_"+idTab).css("display","inline-block")
    }

    var divProductos = document.getElementById('divProductos_'+idTab);
    empty(divProductos).appendChild(listaProductos);
    
    
}


function CrearBotonesFavoritos(favoritos,idTab){
    return yo`<ul> 
                ${favoritos.map(e=>yo`<li><a class="btn btn-block btn-default btn-sm" onclick=${()=>AgregarProducto(e,favoritos,idTab)}><i class="fa fa-star text-orange"></i>  ${e.Nom_Producto}</a></li>`)}       
            </ul>` 
    /*return  yo`<div> 
                ${favoritos.map(e=>yo`<a class="btn btn-app" onclick=${()=>AgregarProducto(e,favoritos,idTab)} style="height:80px"><i class="fa fa-star text-orange"></i> ${e.Nom_Producto}<p></p> ${parseFloat(e.Valor).toFixed(4)}</a>`)}
            </div>`*/
}

function TieneHijos(c,categorias,callback){
    var resp = false
    for(var i=0;i<categorias.length;i++){
        if(categorias[i].Cod_Padre==c.Cod_Categoria){
            resp = true
            break
        }
    }
    callback(resp)
}

function ValidarStock(pStock,pCodigoProducto,idTab,callback){
    var resp = true
    $('#tablaBodyProductosVentas_'+idTab+' tr').each(function () {
        var Flag_Stock = $(this).find("td").eq(1).text()
        var Cod_Producto = $(this).find("td").eq(0).text()
        var Cantidad = $(this).find("td").eq(3).find("input").val()
        if(Cod_Producto==pCodigoProducto){
            if(Flag_Stock.toString()=="true"){
                if(parseFloat(Cantidad)>=parseFloat(pStock)){
                    resp = false
                }
            }
            return false
        }
    });

    callback(resp)
}


function SeleccionarCategoria(c,categorias,idTab){
    TieneHijos(c,categorias,function(flag){ 
        if(flag){
            CrearBotonesCategoriasXSeleccion(categorias,c.Cod_Categoria,idTab)
        }else{
            CrearBotonesProductos(c,idTab,function(categoria,productos){
                if(productos.length>0){ 
                    var listaProductos= yo`<div>
                                            ${productos.map(e=> yo`<a class="btn btn-default btn-sm" style="height:80px">${e.Nom_Producto}<p></p>${getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].SimboloMoneda+' '+parseFloat(categoria.Valor).toFixed(4)}</a>`)}
                                        </div>`
                    var divProductos = document.getElementById('divProductos_'+idTab);
                    empty(divProductos).appendChild(listaProductos);
                } 
            })
        }
    })

}

function TraerSimboloSOLES(monedas,pCodMoneda,idTab){
    for(var i=0;i<monedas.length;i++){
        if(monedas[i].Cod_Moneda==pCodMoneda){
            changeArrayJsonVentas(global.variablesVentas,idTab,[null,null,null,null,monedas[i].Simbolo,null,null,null])
            //SimboloMoneda = monedas[i].Simbolo
            changeArrayJsonVentas(global.variablesVentas,idTab,[null,null,null,null,null,monedas[i].Simbolo,null,null])
            //SimboloMonedaExtra = getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].SimboloMoneda
            break
        }
    }
    $("#btnTotal_"+idTab).html('<i class="fa fa-money text-green"></i> TOTAL: '+getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].SimboloMoneda+' '+parseFloat(getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].Total).toFixed(2))
}

function ExisteProducto(CodProducto,idTab,callback){
    var flag = false
    var posicion = -1
    $('#tablaBodyProductosVentas_'+idTab+' tr').each(function (index) {
        var Cod_Producto = $(this).find("td").eq(0).text()
        if(Cod_Producto==CodProducto){
            flag = true
            posicion = index
            return false
        }
    }); 
    callback(flag,posicion)
}

function RecuperarPrecio(favoritos,producto){ 
    var pValor = '0.00'
    for(var i=0;i<favoritos.length;i++){
        if(favoritos[i].Cod_Producto==producto.Cod_Producto){
            pValor = parseFloat(favoritos[i].Valor).toFixed(2)
            break
        }
    } 
    return pValor
}



function RecalcularSubtotales(idTab){ 
    $('#tablaBodyProductosVentas_'+idTab+' tr').each(function (index) { 
        var _Cantidad = parseFloat($(this).find("td").eq(3).find('input').val())
        var _PrecioUnitario = parseFloat($(this).find("td").eq(5).find('input').val()) 
        var _DescuentoUnitario = parseFloat($(this).find("td").eq(7).text()) 
        $(this).find("td").eq(9).text(((_PrecioUnitario-_DescuentoUnitario)*(_Cantidad)).toFixed(2))
        //$(this).find("td").eq(9).text((parseFloat(_Cantidad)*parseFloat(_PrecioUnitario)).toFixed(2))
        changeDetallesArrayJsonVentas(idTab,$(this).find("td").eq(0).text(),[null,null,null,null,null,null,null,null,null,null,null,null,((_PrecioUnitario-_DescuentoUnitario)*(_Cantidad)).toFixed(2),null,null,null,null])
    });
    CalcularTotal(idTab)
}


function RecalcularDescuentosTotales(idTab){
    $('#tablaBodyProductosVentas_'+idTab+' tr').each(function (index) { 
        var _Cantidad = parseFloat($(this).find("td").eq(3).find('input').val())
        var _DescuentoUnitario = parseFloat($(this).find("td").eq(7).text())
        $(this).find("td").eq(8).text((_Cantidad*_DescuentoUnitario))
    });
    CalcularTotalDescuentos(idTab)
}

function CalcularVuelto(idTab){
    //if($('input[name=Cod_Moneda_Forma_Pago_'+idTab+']:checked').val() == 'soles'){
    if($('#Cod_Moneda_Forma_Pago_'+idTab).val() == 'PEN'){
        $("#TotalCobrar_"+idTab).val(getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].Total)
    }else{
        $("#TotalCobrar_"+idTab).val(parseFloat(getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].Total)/parseFloat(getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].TipodeCambio))
    }
    $("#VueltoCalculado_"+idTab).val(parseFloat($("#TotalRecibidos_"+idTab).val())-parseFloat($("#TotalCobrar_"+idTab).val()))

    if(parseFloat($("#TotalRecibidos_"+idTab).val())-parseFloat($("#TotalCobrar_"+idTab).val())>0){
        $("#lbVuelto_"+idTab).text("VUELTO:")
        if($('#Cod_Moneda_Forma_Pago_'+idTab).val() == 'PEN'){
        //if($('input[name=Cod_Moneda_Forma_Pago_'+idTab+']:checked').val() == 'soles'){
            $("#Vuelto_"+idTab).val(parseFloat($("#TotalRecibidos_"+idTab).val())-parseFloat($("#TotalCobrar_"+idTab).val()))
        }else{
           
            var ArregloNumero = (parseFloat($("#TotalRecibidos_"+idTab).val())-parseFloat($("#TotalCobrar_"+idTab).val())).toString().split('.')
            var _ParteEntera = parseInt(ArregloNumero[0])
            var _ParteDecimal =0
            if(ArregloNumero.length>1)
                _ParteDecimal = parseFloat('0.'+ArregloNumero[1])
            $("#Vuelto_"+idTab).val(_ParteEntera)
            $("#USD_"+idTab).val(_ParteDecimal)
            $("#PEN_"+idTab).val(parseFloat(_ParteDecimal)*parseFloat($("#Tipo_Cambio_Venta_"+idTab).val()))

        }
    }else{
        $("#lbVuelto_"+idTab).text("FALTA:")
        if($('#Cod_Moneda_Forma_Pago_'+idTab).val() == 'PEN'){
        //if($('input[name=Cod_Moneda_Forma_Pago_'+idTab+']:checked').val() == 'soles'){
            $("#Vuelto_"+idTab).val(parseFloat($("#TotalRecibidos_"+idTab).val())-parseFloat($("#TotalCobrar_"+idTab).val()))
        }else{
            $("#Vuelto_"+idTab).val('0.00')
            $("#USD_"+idTab).val(parseFloat($("#TotalRecibidos_"+idTab).val())-parseFloat($("#TotalCobrar_"+idTab).val()))
            $("#PEN_"+idTab).val(parseFloat($("#USD_"+idTab).val())*parseFloat($("#Tipo_Cambio_Venta_"+idTab).val()))
        }
    }
    //$("#txtBusqueda_"+idTab).focus()
    //$("#TotalRecibidos_"+idTab).focus() 

}
function KeyPressClienteDoc(idTab){ 
    switch(($('#Nro_Documento_'+idTab).val().trim().length)+1){
        case 8:
            $("#Cod_TipoDoc_"+idTab).val("1")
            break;
        case 11:
            $("#Cod_TipoDoc_"+idTab).val("6")
            break;
    } 
}

function KeyCalcularVuelto(event,idTab){
    if(event.which==13){
        CalcularVuelto(idTab)
    }
}

function CambioNroDocumento(e,idTab){ 
    if(e.which == 46 || e.which == 8){ 
        if(flag_cliente){
            $("#Nro_Documento_"+idTab).val("");
            $("#Cliente_"+idTab).val("");
            $("#Cliente_"+idTab).attr("data-id",null);
            $("#Direccion_"+idTab).val("");
            changeArrayJsonVentas(global.variablesVentas,IdTabSeleccionado,[null,null,null,null,null,null,'',null])
            flag_cliente=false
        }
    }   
}

function CalcularVueltoEspecial(idTab){
    
    if(parseFloat($("#TotalRecibidos_"+idTab).val()) - parseFloat($("#TotalCobrar_"+idTab).val()) > 0 ){
        //if($('input[name=Cod_Moneda_Forma_Pago_'+idTab+']:checked').val() == 'soles'){
        if($('#Cod_Moneda_Forma_Pago_'+idTab).val() == 'PEN'){
            $("#TotalRecibidos_"+idTab).val(parseFloat($("#TotalCobrar_"+idTab).val())+parseFloat($("#Vuelto_"+idTab)))
            CalcularVuelto(idTab)
        }else{
            $("#USD_"+idTab).val(parseFloat($("#TotalRecibidos_"+idTab).val()) - parseFloat($("#TotalCobrar_"+idTab).val()) - parseFloat($("#Vuelto_"+idTab).val()))
            $("#PEN_"+idTab).val(parseFloat($("#USD_"+idTab).val()) * parseFloat($("#Tipo_Cambio_Venta_"+idTab).val()))
        }
    }
}

function CalcularTotalDescuentos(idTab){
    var _total = 0
    $('#tablaBodyProductosVentas_'+idTab+' tr').each(function (index) { 
        _total = _total + parseFloat($(this).find("td").eq(8).text())
    });
    _total = parseFloat(_total.toFixed(2))
    changeArrayJsonVentas(global.variablesVentas,idTab,[null,_total,null,null,null,null,null,null])
    //TotalDescuentos = _total
    $("#btnDescuentos_"+idTab).html('<i class="fa fa-arrow-circle-down text-red"></i> TOTAL DESCUENTOS: '+getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].SimboloMoneda+' '+parseFloat(getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].TotalDescuentos).toFixed(2))
    if(_total!=0){
        $("#btnDescuentos_"+idTab).css("display","block")
    }else{
        $("#btnDescuentos_"+idTab).css("display","none")
    }
}

function CalcularTotal(idTab){
    var _total = 0
    $('#tablaBodyProductosVentas_'+idTab+' tr').each(function (index) {
        _total = _total + parseFloat($(this).find("td").eq(9).text())
    });
    _total = parseFloat(_total.toFixed(2))
    changeArrayJsonVentas(global.variablesVentas,idTab,[_total,null,null,null,null,null,null,null])
    //Total = _total
    $("#btnTotal_"+idTab).html('<i class="fa fa-money text-green"></i> TOTAL: '+getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].SimboloMoneda+' '+parseFloat(getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].Total).toFixed(2))
    if($('#Cod_Moneda_Forma_Pago_'+idTab).val() == 'USD' || $('#Cod_Moneda_Forma_Pago_'+idTab).val() == 'EUR'){
    //if ($('input[name=Cod_Moneda_Forma_Pago_'+idTab+']:checked').val() == 'dolares' || $('input[name=Cod_Moneda_Forma_Pago_'+idTab+']:checked').val() == 'euros') {
        if ($('input[name=Cod_Moneda_Forma_Pago_'+idTab+']:checked').val() == 'euros'){
            $("#btnConversion_"+idTab).css("display","block")
            $("#btnConversion_"+idTab).html('<i class="fa fa-refresh text-green"></i> EN EUROS: '+getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].SimboloMonedaExtra+' '+(parseFloat(getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].Total)/parseFloat(getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].TipodeCambio)).toFixed(2))
        }else{
            $("#btnConversion_"+idTab).css("display","block")
            $("#btnConversion_"+idTab).html('<i class="fa fa-refresh text-green"></i> EN DOLARES: '+getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].SimboloMonedaExtra+' '+(parseFloat(getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].Total)/parseFloat(getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].TipodeCambio)).toFixed(2))
        }
    }else{
        $("#btnConversion_"+idTab).css("display","none")
    }
    $("#btnTotal_"+idTab).click()
}

function LimpiarVenta(idTab){

    $("#tablaBodyProductosVentas_"+idTab).html('')
    $("#txtBusqueda_"+idTab).val('')
    $("#txtBusqueda_"+idTab).focus()
    $("#btnConversion_"+idTab).css("display","none")
    $("#Direccion_"+idTab).val('')
    $("#Nro_Documento_"+idTab).val('')
    $("#Cliente_"+idTab).val('')
    $("#Cliente_"+idTab).attr("data-id",null)

    deleteElementArrayJsonVentas(global.variablesVentas,idTab)
    global.variablesVentas.push({idTab:idTab,Total:0,TotalDescuentos:0,TipodeCambio:1,_CantidadOriginal:null,SimboloMoneda:'',SimboloMonedaExtra:'',Cod_FormaPago:null,Cliente:null,Detalles:[]})
    if($("#btnTotal_"+idTab).hasClass('active')){
        $("#btnTotal_"+idTab).click()
    }

    EditarCliente(idTab)
     
    CalcularTotal(idTab)
    CalcularTotalDescuentos(idTab)
}

function TabVentaSeleccionado(idTab){
    IdTabSeleccionado = idTab
    global.objClienteVenta = ''
    global.objProductoVentas = ''
}

function CerrarTabVenta(idTab){ 
    $('#tab_'+idTab).remove()
    $('#id_'+idTab).parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show');
    IdTabSeleccionado = null
    deleteElementArrayJsonVentas(global.variablesVentas,idTab)
}

function EliminarFila(idFila,idTab){
    deleteElementArrayJsonVentas(global.variablesVentas,idTab,$('#tablaBodyProductosVentas_'+idTab+' tr#'+idFila).find('td.Cod_Producto').text())
    $('#'+idFila).remove()
    CalcularTotal(idTab)
    CalcularTotalDescuentos(idTab)
}

function FocusInOutCantidadVenta(idFila,idTab){
    if($('#'+idFila).find('td.Flag_Stock').text().toString()=="true"){
        //_CantidadOriginal = parseFloat($('#'+idFila).find('td.Cantidad').find('input').val())
        changeArrayJsonVentas(global.variablesVentas,idTab,[null,null,null,parseFloat($('#'+idFila).find('td.Cantidad').find('input').val()),null,null,null,null])
    }
}

function EditarCliente(idTab){ 
    if(!arrayValidacion.includes($("#Cliente_"+idTab).attr("data-id")))
        flag_cliente = true
    else
        flag_cliente=false
    

    $("#Nro_Documento_"+idTab).unbind("keypress");
    $("#Cliente_"+idTab).unbind("keypress");
    $("#Direccion_"+idTab).unbind("keypress");

    $("#Nro_Documento_"+idTab).attr("disabled",false);
    $("#Cliente_"+idTab).attr("disabled",false);
    $("#Direccion_"+idTab).attr("disabled",false);
    $("#Cod_TipoDoc_"+idTab).attr("disabled",false);
}

function CambioMonedaFormaPagoMasterCard(idTab){
    if ($('input[name=Cod_FormaPago_Modal_'+idTab+']:checked').val() == 'mastercard'){
        $("#Nro_Tarjeta_"+idTab).val("")
        $("#Nro_Tarjeta_"+idTab).prop("disabled",true)
        $('input[name=Cod_FormaPago_Modal_'+idTab+'][value="mastercard"]').prop("checked",false)
    }else{
        $("#Nro_Tarjeta_"+idTab).prop("disabled",false)
        $('input[name=Cod_FormaPago_Modal_'+idTab+'][value="mastercard"]').prop("checked",true)
        $('input[name=Cod_FormaPago_Modal_'+idTab+'][value="visa"]').prop("checked",false)
    }
}

function CambioMonedaFormaPagoVisa(idTab){
    if ($('input[name=Cod_FormaPago_Modal_'+idTab+']:checked').val() == 'visa'){
        $("#Nro_Tarjeta_"+idTab).val("")
        $("#Nro_Tarjeta_"+idTab).prop("disabled",true)
        $('input[name=Cod_FormaPago_Modal_'+idTab+'][value="visa"]').prop("checked",false)
    }else{
        $("#Nro_Tarjeta_"+idTab).prop("disabled",false)
        $('input[name=Cod_FormaPago_Modal_'+idTab+'][value="mastercard"]').prop("checked",false)
        $('input[name=Cod_FormaPago_Modal_'+idTab+'][value="visa"]').prop("checked",true)
    }
}


function CambioMonedaFormaPagoEuros(idTab){
    const fecha = new Date()
    const mes = fecha.getMonth() + 1
    const dia = fecha.getDate()
    var fecha_actual = fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)
    var Cod_Moneda = 'EUR' 
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Cod_Moneda,
            FechaHora:fecha_actual
        })
    }
    fetch(URL + '/comprobantes_pago_api/get_variables_formas_pago', parametros)
        .then(req => req.json())
        .then(res => {
            if(res.respuesta=="ok"){
                var tipos_cambios = res.data.tipos_cambios
                //TipodeCambio = parseFloat((tipos_cambios.length==0?'1':tipos_cambios[0].Venta)).toFixed(3)
                //TipodeCambio = parseFloat(TipodeCambio).toFixed(3)
                changeArrayJsonVentas(global.variablesVentas,idTab,[null,null,parseFloat((tipos_cambios.length==0?'1':tipos_cambios[0].Venta)).toFixed(3),null,null,null,null,null])
                $("#Tipo_Cambio_Venta_"+idTab).val(getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].TipodeCambio)

                const parametrosMonedas = {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                    })
                }
                fetch(URL + '/comprobantes_pago_api/get_monedas', parametrosMonedas)
                    .then(req => req.json())
                    .then(res => {
                        if(res.respuesta=="ok"){
                            var monedas = res.data.monedas
                            for(var i=0;i<monedas.length;i++){
                                if(monedas[i].Cod_Moneda == 'EUR'){
                                    changeArrayJsonVentas(global.variablesVentas,idTab,[null,null,null,null,null,monedas[i].Simbolo,null,null])
                                    //SimboloMonedaExtra = monedas[i].Simbolo
                                    break
                                }
                            }

                            if($('#Cod_Moneda_Forma_Pago_'+idTab).val() == 'EUR'){
                            //if ($('input[name=Cod_Moneda_Forma_Pago_'+idTab+']:checked').val() == 'euros'){
                                $("#lbTotalCobrar_"+idTab).attr("data-value","EUR")
                                $("#lbTotalRecibidos_"+idTab).attr("data-value","EUR")
                                $("#lbVuelto_"+idTab).attr("data-value","EUR")
                                $("#lbVueltoCalculado_"+idTab).attr("data-value","EUR")
                                $("#lbUSD_"+idTab).text("EUR")
                                $("#divUSD_"+idTab).css("display","block")
                                $("#laCambio_"+idTab).css("display","block")
                                $("#lbVuelto_"+idTab).val(parseFloat($("#lbVuelto_"+idTab).val()).toFixed(0))
                                $("#divPEN_"+idTab).css("display","block")
                            }

                            CalcularTotal(idTab)
                            CalcularTotalDescuentos(idTab)

                            //if ($('input[name=Cod_Moneda_Forma_Pago_'+idTab+']:checked').val() == 'soles'){
                            if($('#Cod_Moneda_Forma_Pago_'+idTab).val() == 'PEN'){
                                $("#TotalCobrar_"+idTab).val(getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].Total)
                            }else{
                                $("#TotalCobrar_"+idTab).val(parseFloat(getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].Total)/parseFloat(getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].TipodeCambio))
                            }
                            CalcularVuelto(idTab)

                        }
                    }).catch(function (e) {
                        console.log(e);
                        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                    });


            }
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
        });
 
}

function CambioMonedaFormaPagoDolares(idTab){
    const fecha = new Date()
    const mes = fecha.getMonth() + 1
    const dia = fecha.getDate()
    var fecha_actual = fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)
    var Cod_Moneda = 'USD' 
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Cod_Moneda,
            FechaHora:fecha_actual
        })
    }
    fetch(URL + '/comprobantes_pago_api/get_variables_formas_pago', parametros)
        .then(req => req.json())
        .then(res => {
            if(res.respuesta=="ok"){
                var tipos_cambios = res.data.tipos_cambios
                //TipodeCambio = parseFloat((tipos_cambios.length==0?'1':tipos_cambios[0].Venta)).toFixed(3)
                //TipodeCambio = parseFloat(TipodeCambio).toFixed(3)
                changeArrayJsonVentas(global.variablesVentas,idTab,[null,null,parseFloat((tipos_cambios.length==0?'1':tipos_cambios[0].Venta)).toFixed(3),null,null,null,null,null])
                $("#Tipo_Cambio_Venta_"+idTab).val(getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].TipodeCambio)

                const parametrosMonedas = {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                    })
                }
                fetch(URL + '/comprobantes_pago_api/get_monedas', parametrosMonedas)
                    .then(req => req.json())
                    .then(res => {
                        if(res.respuesta=="ok"){
                            var monedas = res.data.monedas
                            for(var i=0;i<monedas.length;i++){
                                if(monedas[i].Cod_Moneda == 'USD'){
                                    changeArrayJsonVentas(global.variablesVentas,idTab,[null,null,null,null,null,monedas[i].Simbolo,null,null])
                                    //SimboloMonedaExtra = monedas[i].Simbolo
                                    break
                                }
                            }

                            //if ($('input[name=Cod_Moneda_Forma_Pago_'+idTab+']:checked').val() == 'dolares'){
                            if($('#Cod_Moneda_Forma_Pago_'+idTab).val() == 'USD'){
                                $("#lbTotalCobrar_"+idTab).attr("data-value","USD")
                                $("#lbTotalRecibidos_"+idTab).attr("data-value","USD")
                                $("#lbVuelto_"+idTab).attr("data-value","USD")
                                $("#lbVueltoCalculado_"+idTab).attr("data-value","USD")
                                $("#lbUSD_"+idTab).text("USD")
                                $("#divUSD_"+idTab).css("display","block")
                                $("#laCambio_"+idTab).css("display","block")
                                $("#lbVuelto_"+idTab).val(parseFloat($("#lbVuelto_"+idTab).val()).toFixed(0))
                                $("#divPEN_"+idTab).css("display","block")
                            }

                            CalcularTotal(idTab)
                            CalcularTotalDescuentos(idTab)

                            if($('#Cod_Moneda_Forma_Pago_'+idTab).val() == 'PEN'){
                            //if ($('input[name=Cod_Moneda_Forma_Pago_'+idTab+']:checked').val() == 'soles'){
                                $("#TotalCobrar_"+idTab).val(getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].Total)
                            }else{
                                $("#TotalCobrar_"+idTab).val(parseFloat(getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].Total)/parseFloat(getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].TipodeCambio))
                            }
                            CalcularVuelto(idTab)

                        }
                    }).catch(function (e) {
                        console.log(e);
                        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                    });


            }
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
        });
 
}


function CambioMonedaVentas(idTab){
    switch($('#Cod_Moneda_Forma_Pago_'+idTab).val()){
        case 'PEN':
            CambioMonedaFormaPagoSoles(idTab)
            break
        case 'USD':
            CambioMonedaFormaPagoDolares(idTab)
            break
        case 'EUR':
            CambioMonedaFormaPagoEuros(idTab)
            break
    }
 
}

function CambioMonedaFormaPagoSoles(idTab){
    //if ($('input[name=Cod_Moneda_Forma_Pago_'+idTab+']:checked').val() == 'soles'){
    if($('#Cod_Moneda_Forma_Pago_'+idTab).val() == 'PEN'){
        $("#lbTotalCobrar_"+idTab).attr("data-value","PEN")
        $("#lbTotalRecibidos_"+idTab).attr("data-value","PEN")
        $("#lbVuelto_"+idTab).attr("data-value","PEN")
        $("#lbVueltoCalculado_"+idTab).attr("data-value","PEN")
        $("#divUSD_"+idTab).css("display","none")
        $("#divTC_"+idTab).css("display","none")
        $("#divPEN_"+idTab).css("display","none")
        $("#lbVuelto_"+idTab).val(parseFloat($("#lbVuelto_"+idTab).val()).toFixed(2))
    }

    if($('#Cod_Moneda_Forma_Pago_'+idTab).val() == 'PEN'){
    //if ($('input[name=Cod_Moneda_Forma_Pago_'+idTab+']:checked').val() == 'soles'){
        $("#TotalCobrar_"+idTab).val(getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].Total)
    }else{
        $("#TotalCobrar_"+idTab).val(parseFloat(getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].Total)/parseFloat(getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].TipodeCambio))
    }
    CalcularVuelto(idTab)
}


function CambioCantidadVenta(idFila,idTab){ 
    if($('#tablaBodyProductosVentas_'+idTab+' tr#'+idFila).find('td.Cantidad').find('input').val().trim()!=""){
        changeDetallesArrayJsonVentas(idTab,$('#'+idFila).find('td.Cod_Producto').text(),[null,null,null,null,null,null,null,null,parseFloat($('#tablaBodyProductosVentas_'+idTab+' tr#'+idFila).find('td.Cantidad').find('input').val()).toFixed(2),null,null,null,null,null,null,null,null])
                                        

        if($('#'+idFila).find('td.Flag_Stock').text().toString()=="true"){
            
            const parametros = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Cod_Producto: $('#'+idFila).find('td.Cod_Producto').text().toString(),
                    Cod_Almacen: $("#Cod_Almacen_"+idTab).val(),
                    Cod_TipoPrecio: $("#Cod_Precio_"+idTab).val()
                })
            }
            fetch(URL + '/productos_serv_api/get_codigo_unidad_by_codP_codA_codTP', parametros)
                .then(req => req.json())
                .then(res => {
                    if(res.respuesta=="ok"){
                        if(res.data.producto.length>0){
                            var producto = res.data.producto[0]
                            if(parseFloat($('#'+idFila).find('td.Cantidad').find('input').val()) > parseFloat(producto.Stock_Act)){
                                toastr.error('El stock maximo es de : '+parseFloat(producto.Stock_Act).toFixed(0),'Error',{timeOut: 5000})  
                                $('#'+idFila).find('td.Cantidad').find('input').val(getObjectArrayJsonVentas(global.variablesVentas,idTab)[0]._CantidadOriginal)
                            }
                        }else{
                            $('#'+idFila).find('td.Cantidad').find('input').val(getObjectArrayJsonVentas(global.variablesVentas,idTab)[0]._CantidadOriginal)
                        }
                    }else{
                        $('#'+idFila).find('td.Cantidad').find('input').val(getObjectArrayJsonVentas(global.variablesVentas,idTab)[0]._CantidadOriginal)
                    }

                }).catch(function (e) {
                    console.log(e);
                    toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                }); 
        } 
        RecalcularSubtotales(idTab)
        RecalcularDescuentosTotales(idTab)
    }
}

function CambioNombreProducto(idFila,idTab){
    changeDetallesArrayJsonVentas(idTab,$('#'+idFila).find('td.Cod_Producto').text(),[null,null,null,null,$('#tablaBodyProductosVentas_'+idTab+' tr#'+idFila).find('td.Nom_Producto').find('input').val(),null,null,null,null,null,null,null,null,null,null,null])
}


function CambioPrecioDescuentos(idFila,idTab){
    $("#"+idFila).find("td.Precio").text("0.00")
    //console.log($("#"+idFila).find("td.Precio").text())
    //console.log("onkeyup descuenasd [reocp",$('#'+idFila).find('td.UnitarioBase').find('input').val())
    if($('#'+idFila).find('td.UnitarioBase').find('input').val().trim()!="" && $('#'+idFila).find('td.Descuentos').find('input').val().trim()!=""){
        
        changeDetallesArrayJsonVentas(idTab,$('#'+idFila).find('td.Cod_Producto').text(),[null,null,null,null,null,null,null,null,null,null,parseFloat($('#tablaBodyProductosVentas_'+idTab+' tr#'+idFila).find('td.UnitarioBase').find('input').val()).toFixed(2),parseFloat($('#tablaBodyProductosVentas_'+idTab+' tr#'+idFila).find('td.Descuentos').find('input').val()).toFixed(2),null,null,null,null,null])

        var _Unitario = parseFloat($('#'+idFila).find('td.UnitarioBase').find('input').val())
        var _Descuento = parseFloat($('#'+idFila).find('td.Descuentos').find('input').val()) / 100
        if(_Descuento.toString()==''){
            $('#'+idFila).find('td.Descuentos').find('input').val('0.00')
            _Descuento = 0
        }
        if(_Descuento !=0){
            $('#'+idFila).find('td.Descuentos').find('input').css("background","#ea1c0d")
            $('#'+idFila).find('td.Descuentos').find('input').css("color","white")
            $('#'+idFila).find('td.Descuentos').find('input').css("border-color","#ea1c0d")
        }else{
            
            $('#'+idFila).find('td.Descuentos').find('input').css("background","white")
            $('#'+idFila).find('td.Descuentos').find('input').css("color","#555")
            $('#'+idFila).find('td.Descuentos').find('input').css("border-color","#98999c")
        }
        $('#'+idFila).find('td.DescuentoUnitario').text(_Unitario * _Descuento)

        $("#"+idFila).find("td.Unitario").text(parseFloat($('#'+idFila).find('td.UnitarioBase').find('input').val())-parseFloat($('#'+idFila).find('td.DescuentoUnitario').text()))
        //$("#"+idFila).find("td.Precio").text(((parseFloat($('#'+idFila).find('td.UnitarioBase').find('input').val())-parseFloat($('#'+idFila).find('td.DescuentoUnitario').text()))*(parseFloat($("#"+idFila).find("td.Cantidad").find('input').val()))).toFixed(2))
       
        RecalcularSubtotales(idTab)
        RecalcularDescuentosTotales(idTab)
    }
 
}
 
function CambioTipoCambioVenta(idTab){
    if($("#Tipo_Cambio_Venta_"+idTab).val().trim()!=''){
        //TipodeCambio = parseFloat($("#Tipo_Cambio_Venta_"+idTab).val())
        changeArrayJsonVentas(global.variablesVentas,idTab,[null,null,parseFloat($("#Tipo_Cambio_Venta_"+idTab).val()),null,null,null,null,null])
        CalcularTotal(idTab)
        CalcularTotalDescuentos(idTab)
        if($('#Cod_Moneda_Forma_Pago_'+idTab).val() == 'PEN'){
        //if ($('input[name=Cod_Moneda_Forma_Pago_'+idTab+']:checked').val() == 'soles'){
            $("#TotalCobrar_"+idTab).val(getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].Total)
        }else{
            $("#TotalCobrar_"+idTab).val(parseFloat(getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].Total)/parseFloat(getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].TipodeCambio))
        }
        CalcularVuelto(idTab)
    }
}


function AgregarProducto(producto,favoritos,idTab){ 
    if(!arrayValidacion.includes($("#Cod_Almacen_"+idTab).val())){
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Cod_Producto: producto.Cod_Producto,
                Cod_Almacen: $("#Cod_Almacen_"+idTab).val(),
                Cod_TipoPrecio: $("#Cod_Precio_"+idTab).val()
            })
        }
        fetch(URL + '/productos_serv_api/get_codigo_unidad_by_codP_codA_codTP', parametros)
            .then(req => req.json())
            .then(res => {
                if(res.respuesta=="ok"){
                    if(res.data.producto.length>0){
                        var dataProducto = res.data.producto[0]  
                        ValidarStock(producto.Stock_Act,dataProducto,idTab,function(flag){
                            if(flag){
                                ExisteProducto(producto.Cod_Producto,idTab,function(flag,index){
                                    if(flag){

                                        $('#tablaBodyProductosVentas_'+idTab+' tr:eq('+ index + ')').find('td.Cantidad').find('input').val((parseFloat($('#tablaBodyProductosVentas_'+idTab+' tr:eq('+ index + ')').find('td.Cantidad').find('input').val())+1).toFixed(2))
                                        $('#tablaBodyProductosVentas_'+idTab+' tr:eq('+ index + ')').find('td.Precio').text((parseFloat($('#tablaBodyProductosVentas_'+idTab+' tr:eq('+ index + ')').find('td.Cantidad').find('input').val())*parseFloat(RecuperarPrecio(favoritos,dataProducto))).toFixed(2))
                                        $('#tablaBodyProductosVentas_'+idTab+' tr:eq('+ index + ')').find('td.DescuentoTotal').text((parseFloat($('#tablaBodyProductosVentas_'+idTab+' tr:eq('+ index + ')').find('td.DescuentoUnitario').text())*parseFloat($('#tablaBodyProductosVentas_'+idTab+' tr:eq('+ index + ')').find('td.Cantidad').find('input').val())).toFixed(2))
                                        
                                        changeDetallesArrayJsonVentas(idTab,$('#tablaBodyProductosVentas_'+idTab+' tr:eq('+ index + ')').find('td.Cod_Producto').text(),[null,null,null,null,null,null,null,null,$('#tablaBodyProductosVentas_'+idTab+' tr:eq('+ index + ')').find('td.Cantidad').find('input').val(),null,null,null,$('#tablaBodyProductosVentas_'+idTab+' tr:eq('+ index + ')').find('td.Precio').text(),null,null,null,null])
                                       
                                    }else{
                                        const idFila = $('#tablaBodyProductosVentas_'+idTab+' > tr').length
                                        var fila = yo`
                                        <tr id="${idFila+''+idTab}">
                                            <td class="Cod_Producto">${dataProducto.Cod_Producto}</td> 
                                            <td class="Flag_Stock hidden">${dataProducto.Flag_Stock}</td> 
                                            <td class="Nom_Producto" style="width: 30%;"><div class="form-group"><input type="text" class="form-control input-sm" value=${dataProducto.Nom_Producto} onchange=${()=>CambioNombreProducto(idFila+''+idTab,idTab)} onkeyup=${()=>CambioNombreProducto(idFila+''+idTab,idTab)}><div class="form-control-line"></div></div></td> 
                                            <td class="Cantidad"><div class="form-group"><input type="number" class="form-control input-sm" value="1.0000" onblur=${()=>FocusInOutCantidadVenta(idFila+''+idTab,idTab)} onchange=${()=>CambioCantidadVenta(idFila+''+idTab,idTab)} onkeyup=${()=>CambioCantidadVenta(idFila+''+idTab,idTab)}><div class="form-control-line"></div></div></td>
                                            <td class="Unitario hidden">${RecuperarPrecio(favoritos,dataProducto)}</td>
                                            <td class="UnitarioBase"><div class="form-group"><input type="number" class="form-control input-sm" value=${RecuperarPrecio(favoritos,dataProducto)} onchange=${()=>CambioPrecioDescuentos(idFila+''+idTab,idTab)} onkeyup=${()=>CambioPrecioDescuentos(idFila+''+idTab,idTab)}><div class="form-control-line"></div></div></td> 
                                            <td class="Descuentos"><div class="form-group"><input type="number" class="form-control input-sm" value="0.00" onchange=${()=>CambioPrecioDescuentos(idFila+''+idTab,idTab)} onkeyup=${()=>CambioPrecioDescuentos(idFila+''+idTab,idTab)}><div class="form-control-line"></div></div></td>
                                            <td class="DescuentoUnitario hidden">0</td> 
                                            <td class="DescuentoTotal hidden">0</td> 
                                            <td class="Precio">${RecuperarPrecio(favoritos,dataProducto)}</td>
                                            <td>
                                                <div style="display:flex;"> 
                                                    <button type="button" onclick="${()=>EliminarFila(idFila+''+idTab,idTab)}" class="btn btn-danger btn-sm"><i class="fa fa-trash"></i></button>
                                                </div>
                                            </td>
                                        </tr>`
                                         
                                        $('#tablaBodyProductosVentas_'+idTab).append(fila)

                                        $('input[type="number"]').blur(function(){
                                            $(this).val(parseFloat($(this).val()).toFixed(2))
                                        })

                                        $('input[type="number"]').keypress(function(e){
                                            if(e.which == 13) {
                                                $(this).val(parseFloat($(this).val()).toFixed(2))
                                            }
                                        })

                                        getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].Detalles.push({
                                            id_ComprobantePago:0,
                                            id_Detalle:0,
                                            Id_Producto:dataProducto.Id_Producto,
                                            Codigo:dataProducto.Cod_Producto,
                                            Descripcion:dataProducto.Nom_Producto,
                                            Almacen:$("#Cod_Almacen_"+idTab).val(),
                                            UM:dataProducto.Cod_UnidadMedida,
                                            Stock:dataProducto.Stock_Act,
                                            Cantidad:1,
                                            Despachado:1,
                                            PU:RecuperarPrecio(favoritos,dataProducto),
                                            Descuento:'0.00',
                                            Importe:RecuperarPrecio(favoritos,dataProducto),
                                            Cod_Manguera:$("#Cod_Precio_"+idTab).val(),
                                            Tipo:dataProducto.Cod_TipoOperatividad,
                                            Obs_ComprobanteD:'',
                                            Series:[],
                                            Nom_UnidadMedida:dataProducto.Cod_UnidadMedida,
                                            Des_Almacen:$("#Cod_Almacen_"+idTab).val()//dataProducto.Des_Almacen      
                                        })
                                        /*


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

                                        */


                                    }
                                    CalcularTotal(idTab)
                                    CalcularTotalDescuentos(idTab)
                                })
                            
                                
                            }else{
                                toastr.error('No existe stock para dicho producto','Error',{timeOut: 5000})  
                            }
                        })
                    
                    }else{
                        toastr.error('El producto seleccionado no existe para el almacen y precio seleccionado.','Error',{timeOut: 5000})
                    }
                }
        
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            });
    }else{
        toastr.error('Es necesario seleccionar un almacen.','Error',{timeOut: 5000})
    }
}


function BuscarProductoCP(event,tipo,idTab) { 
    if(tipo=='blur'){
        if($("#txtBusqueda_"+idTab).val().trim().length>=3){
            global.objProductoVentas = ''
            BuscarProducto(true, $("#txtBusqueda_"+idTab).val())
        } 
    }else{
        if(event.which==13){
            if($("#txtBusqueda_"+idTab).val().trim().length>=3){
                $("#Cod_Precio_"+idTab).focus()
                global.objProductoVentas = ''
                BuscarProducto(true, $("#txtBusqueda_"+idTab).val())
            } 
        }
        //if(!$("#optEsGasto").is(":checked"))
        //    BuscarProducto(CodLibro == "14", $("#Nom_Producto").val())
        
        //$("#Nom_Producto").focusout()
    }
}



function BuscarClienteDoc(CodLibro,idTab) { 
    var Nro_Documento = document.getElementById('Nro_Documento_'+idTab).value
    if(Nro_Documento.trim().length>3){
        run_waitMe($('#div-cliente'), 1, "ios","Buscando cliente...");
        var Cod_TipoDocumento = document.getElementById('Cod_TipoDoc_'+idTab).value
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
                    global.objClienteVenta = res.data.cliente[0]
                    changeArrayJsonVentas(global.variablesVentas,idTab,[null,null,null,null,null,null,global.objClienteVenta,null])
                    if(global.objClienteVenta !='' && global.objClienteVenta){
                        $("#Cod_TipoDoc_"+idTab).val(global.objClienteVenta.Cod_TipoDocumento)

                        //$("#Cliente_"+idTab).tagsinput('add',global.objClienteVenta.Cliente)
                        //$("#Nro_Documento_"+idTab).tagsinput('add',global.objClienteVenta.Nro_Documento)
                        //$("#Direccion_"+idTab).tagsinput('add',global.objClienteVenta.Direccion)
                        //$("#Cliente_"+idTab).attr("data-id",global.objClienteVenta.Id_ClienteProveedor)

                        $("#Cliente_"+idTab).val(global.objClienteVenta.Cliente)
                        $("#Direccion_"+idTab).val(global.objClienteVenta.Direccion)
                        $("#Nro_Documento_"+idTab).val(global.objClienteVenta.Nro_Documento)
                        $("#Cliente_"+idTab).attr("data-id",global.objClienteVenta.Id_ClienteProveedor) 
                        
                        $("#Nro_Documento_"+idTab).bind("keypress", function(event){
                            event.preventDefault();
                            event.stopPropagation();
                        });
                        
                        $("#Cliente_"+idTab).bind("keypress", function(event){
                            event.preventDefault();
                            event.stopPropagation();
                        });
                        
                        $("#Direccion_"+idTab).bind("keypress", function(event){
                            event.preventDefault();
                            event.stopPropagation();
                        });
                        
                        $("#Nro_Documento_"+idTab).attr("disabled",true);
                        $("#Cliente_"+idTab).attr("disabled",true);
                        $("#Direccion_"+idTab).attr("disabled",true);
                        $("#Cod_TipoDoc_"+idTab).attr("disabled",true);
                        

                    } 
                }else{ 

                    
                    $("#Nro_Documento_"+idTab).unbind("keypress");
                    $("#Cliente_"+idTab).unbind("keypress");
                    $("#Direccion_"+idTab).unbind("keypress");
                    
                    $("#Nro_Documento_"+idTab).attr("disabled",false);
                    $("#Cliente_"+idTab).attr("disabled",false);
                    $("#Direccion_"+idTab).attr("disabled",false);
                    $("#Cod_TipoDoc_"+idTab).attr("disabled",false);

                    global.objClienteVenta = ''
                    let cl = {
                        Id_ClienteProveedor:null,
                        Nro_Documento :Nro_Documento,
                        Cliente : $('#Cliente_'+idTab).val(),
                        Direccion: $('#Direccion_'+idTab).val(),
                        Cod_TipoDocumento:  $('#Cod_TipoDoc_'+idTab).val(),
                    }
                    changeArrayJsonVentas(global.variablesVentas,idTab,[null,null,null,null,null,null,cl,null])
                    /*getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].Cliente={
                        Id_ClienteProveedor:null,
                        Nro_Documento :Nro_Documento,
                        Cliente : $('#Cliente_'+idTab).val(),
                        Direccion: $('#Direccion_'+idTab).val(),
                        Cod_TipoDocumento:  $('#Cod_TipoDoc_'+idTab).val(),
                    }*/
                }
                $('#div-cliente').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                $("#Nro_Documento_"+idTab).unbind("keypress");
                $("#Cliente_"+idTab).unbind("keypress");
                $("#Direccion_"+idTab).unbind("keypress");
                
                $("#Nro_Documento_"+idTab).attr("disabled",false);
                $("#Cliente_"+idTab).attr("disabled",false);
                $("#Direccion_"+idTab).attr("disabled",false);
                $("#Cod_TipoDoc_"+idTab).attr("disabled",false);
                global.objClienteVenta = ''
                let cl = {
                    Id_ClienteProveedor:null,
                    Nro_Documento :Nro_Documento,
                    Cliente : $('#Cliente_'+idTab).val(),
                    Direccion: $('#Direccion_'+idTab).val(),
                    Cod_TipoDocumento:  $('#Cod_TipoDoc_'+idTab).val(),
                }
                changeArrayJsonVentas(global.variablesVentas,idTab,[null,null,null,null,null,null,cl,null]) 
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#div-cliente').waitMe('hide');
            });
    }
}

function EmisionRapida(idTab,pCod_Moneda,callback){ 
    run_waitMe($('#main-contenido'), 1, "ios","Realizando la venta...");
    const fecha = new Date()
    const mes = fecha.getMonth() + 1
    const dia = fecha.getDate() 
    var fecha_format = fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia) + ' '+ [(fecha.getHours()>9?fecha.getHours():'0'+fecha.getHours()), (fecha.getMinutes()>9?fecha.getMinutes():'0'+fecha.getMinutes())].join(':');
    
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            Cliente:getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].Cliente,
            FormaPago: ObtenerFormaPago(idTab),
            Detalles: getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].Detalles,
            Cod_Moneda: pCod_Moneda,
            Total:getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].Total,
            Obs_Comprobante:null,
            Fecha_Emision:fecha_format

        })
    }
    fetch(URL + '/comprobantes_pago_api/venta_simple', parametros)
        .then(req => req.json())
        .then(res => {
            console.log(res)
            if(res.respuesta == 'ok'){
                toastr.success('Se registro correctamente el comprobante','Confirmacion',{timeOut: 5000})
                 
                preparar_impresion_comprobante(res.data,function(flag){
                    if(!flag){
                        toastr.error('No Puede imprimir el comprobante. Comuniquese con su Administrador.','Error',{timeOut: 5000})
                    }
                })
                callback(true)
            }else{
                toastr.error(res.detalle_error,'Error',{timeOut: 5000}) 
                callback(false)
            }
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
            callback(false)
        });


}

function ObtenerFormaPago(idTab){
    if($('input[name=Cod_FormaPago_Modal_'+idTab+']:checked').val() == 'mastercard' || $('input[name=Cod_FormaPago_Modal_'+idTab+']:checked').val() == 'visa'){
        if ($('input[name=Cod_FormaPago_Modal_'+idTab+']:checked').val() == 'mastercard'){
            let listaFormaPago = []
            listaFormaPago.push({
                id_ComprobantePago :0,
                Item : 1,
                Des_FormaPago : 'VISA NET',
                Cod_FormaPago : '005',
                Cod_Moneda : $("#Cod_Moneda_Forma_Pago_"+idTab).val(),
                TipoCambio : 1,
                Monto:parseFloat(getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].Total)/1,
                CuentaCajaBanco :$("#Nro_Tarjeta_"+idTab).val()==undefined?'':$("#Nro_Tarjeta_"+idTab).val()
            })
            return listaFormaPago
        }else{
            let listaFormaPago = []
            listaFormaPago.push({
                id_ComprobantePago :0,
                Item : 1,
                Des_FormaPago : 'MASTERCARD',
                Cod_FormaPago : '006',
                Cod_Moneda : $("#Cod_Moneda_Forma_Pago_"+idTab).val(),
                TipoCambio : 1,
                Monto:parseFloat(getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].Total)/1,
                CuentaCajaBanco :$("#Nro_Tarjeta_"+idTab).val()==undefined?'':$("#Nro_Tarjeta_"+idTab).val()
            })
            return listaFormaPago
        }
    }else{

        let listaFormaPago = []
        listaFormaPago.push({
            id_ComprobantePago :0,
            Item : 1,
            Des_FormaPago : 'EFECTIVO',
            Cod_FormaPago : '008',
            Cod_Moneda : $("#Cod_Moneda_Forma_Pago_"+idTab).val(),
            TipoCambio : 1,
            Monto:parseFloat(getObjectArrayJsonVentas(global.variablesVentas,idTab)[0].Total)/1,
            CuentaCajaBanco :$("#Nro_Tarjeta_"+idTab).val()==undefined?'':$("#Nro_Tarjeta_"+idTab).val()
        })
        return listaFormaPago
    }
}

function ComprarMonedaExtranjera(idTab,_MontoComprar, _TipoCambio, _CodMoneda){
    var _NombreMoneda = ''
    if (_CodMoneda=='USD'){
        _NombreMoneda = 'DOLARES'
    }else{
        _NombreMoneda = 'EUROS'
    }
    if(_NombreMoneda!=''){
        CargarModalConfirmacionME(idTab,_MontoComprar,_NombreMoneda,_TipoCambio,_CodMoneda)
    }
}

function CrearClientesVarios(idTab,callback){
    if(arrayValidacion.includes($("#Cliente_"+idTab).attr("data-id"))){
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
        fetch(URL+'/clientes_api/get_clientes_varios', parametros)
        .then(req => req.json())
        .then(res => {
            if(res.respuesta=='ok'){
                if(res.data.cliente.length>0)
                    callback(true,{
                        Id:res.data.cliente[0].Id_ClienteProveedor,
                        Cliente:res.data.cliente[0].Cliente
                    })
                else
                    callback(false,{})
            }else{
                callback(false,{})
            }
        }).catch(function (e) {
            callback(false,{})
            //console.log(e);
            toastr.error('Ocurrio un error en la conexion.  Tipo error : '+e,'Error',{timeOut: 5000})
        });
    }else{
        callback(true,{
            Id:parseInt($("#Cliente_"+idTab).attr("data-id")),
            Cliente:$("#Cliente_"+idTab).val()
        })
    }
}

function CompraSimple(idTab,_MontoComprar,_NombreMoneda,_TipoCambio,_CodMoneda){
    if(parseFloat(_MontoComprar)>0){
        CrearClientesVarios(idTab,function(flag,jsonCliente){
            if(flag){
                var _nom_moneda = _Cod_Moneda == "USD" ? "DOLARES" : "EUROS";

                var id_Movimiento = -1
                var IdConcepto = 3000
                var Id_ClienteProveedor = jsonCliente.Id
                var Cliente = jsonCliente.Cliente
                var Des_Movimiento = "Compra ME "+_NombreMoneda+" : "+_MontoComprar+" T/C: "+parseFloat(_TipoCambio).toFixed(3)+" SOLES: "+(parseFloat(_MontoComprar)*parseFloat(parseFloat(_TipoCambio).toFixed(3))).toFixed(3)
                var Cod_TipoComprobante = "CV"
                const fecha = new Date()
                const mes = fecha.getMonth() + 1
                const dia = fecha.getDate()
                var fecha_format = fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)
                var Fecha = fecha_format
                var Tipo_Cambio = _TipoCambio
                var Ingreso = _MontoComprar
                var Cod_MonedaIng = _CodMoneda
                var Egreso = (parseFloat(_MontoComprar)*parseFloat(parseFloat(_TipoCambio).toFixed(3))).toFixed(3)
                var Cod_MonedaEgr = 'PEN'
                var Flag_Extornado = 0
                var Fecha_Aut = fecha_format
                var Obs_Movimiento = ''
                var Id_MovimientoRef=null

                const parametros = {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify({
                        id_Movimiento,
                        Id_Concepto,
                        Id_ClienteProveedor,
                        Cliente,
                        Des_Movimiento,
                        Cod_TipoComprobante,
                        Serie,
                        Numero,
                        Fecha,
                        Tipo_Cambio,
                        Ingreso,
                        Cod_MonedaIng,
                        Egreso,
                        Cod_MonedaEgr,
                        Flag_Extornado,
                        Fecha_Aut,
                        Obs_Movimiento,
                        Id_MovimientoRef
                    })
                } 
                fetch(URL+'/compra_venta_moneda_extranjera_api/guardar_compra_venta_me', parametros)
                .then(req => req.json())
                .then(res => {
                    if (res.respuesta == 'ok') {     
                        LimpiarVenta(idTab)          
                        toastr.success('Se registro correctamente el movimiento','Confirmacion',{timeOut: 5000})
                        preparar_impresion_movimientos(res.data.movimiento.id_Movimiento,function(flag){
                            if(!flag){
                                toastr.error('No Puede imprimir el documento. Comuniquese con su Administrador.','Error',{timeOut: 5000})
                            }
                        })
                    }
                    else{
                        toastr.error('No se pudo registrar correctamente el movimiento','Error',{timeOut: 5000}) 
                    }
                }).catch(function (e) {
                    console.log(e);
                    toastr.error('Ocurrio un error en la conexion.  Tipo error : '+e,'Error',{timeOut: 5000})
                });


            }else{
                toastr.error('Ocurrio un error en la conexion.  Tipo error : '+e,'Error',{timeOut: 5000}) 
            }
        })
    }else{
        LimpiarVenta(idTab)
    }

    /*const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            id_Movimiento,
            Id_Concepto,
            Id_ClienteProveedor,
            Cliente,
            Des_Movimiento,
            Cod_TipoComprobante,
            Serie,
            Numero,
            Fecha,
            Tipo_Cambio,
            Ingreso,
            Cod_MonedaIng,
            Egreso,
            Cod_MonedaEgr,
            Flag_Extornado,
            Fecha_Aut,
            Obs_Movimiento,
            Id_MovimientoRef
        })
    } 
    fetch(URL+'/compra_venta_moneda_extranjera_api/guardar_compra_venta_me', parametros)
    .then(req => req.json())
    .then(res => {
        console.log("respuesta de compra simple moneda",res)
    }).catch(function (e) {
        console.log(e);
        toastr.error('Ocurrio un error en la conexion.  Tipo error : '+e,'Error',{timeOut: 5000})
    });*/

}

function VentaSimpleSinME(idTab,_CodTipoComprobante){
     
    if (getObjectArrayJsonVentas(global.variablesVentas,IdTabSeleccionado)[0].Cliente!=null && getObjectArrayJsonVentas(global.variablesVentas,IdTabSeleccionado)[0].Cliente!=''){
        _CodTipoComprobante = getObjectArrayJsonVentas(global.variablesVentas,IdTabSeleccionado)[0].Cliente.Cod_TipoComprobante
    }
    EmisionRapida(idTab,$("#Cod_Moneda_Forma_Pago_"+idTab).val(),_CodTipoComprobante,function(flag){
        if(flag){
            LimpiarVenta(idTab)
        }
    })
}

function VentaSimpleConME(idTab,_CodTipoComprobante){
     
    if (getObjectArrayJsonVentas(global.variablesVentas,IdTabSeleccionado)[0].Cliente!=null && getObjectArrayJsonVentas(global.variablesVentas,IdTabSeleccionado)[0].Cliente!=''){
        _CodTipoComprobante = getObjectArrayJsonVentas(global.variablesVentas,IdTabSeleccionado)[0].Cliente.Cod_TipoComprobante
    }
    EmisionRapida(idTab,$("#Cod_Moneda_Forma_Pago_"+idTab).val(),_CodTipoComprobante,function(flag){
        if(flag){
             
            ComprarMonedaExtranjera(idTab,parseFloat($("#TotalRecibidos_"+idTab).val()) - parseFloat($("#Vuelto_"+idTab).val()), parseFloat($("#Tipo_Cambio_Venta_"+idTab).val()), $("#Cod_Moneda_Forma_Pago_"+idTab).val()=='USD'?'USD':'EUR')
           
        } 
    })
}



function NuevaVenta() {
    run_waitMe($('#main-contenido'), 1, "ios");
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
    fetch(URL + '/comprobantes_pago_api/get_variables_ventas', parametros)
        .then(req => req.json())
        .then(res => {
            const variables = res.data
            if (res.respuesta == 'ok') {
                VerNuevaVenta(variables,null)
            }else{
                toastr.error(res.detalle_error,'Error',{timeOut: 5000})
            }
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
}
 

function VentaSimple(){
    if($("#Cliente_"+IdTabSeleccionado).val().trim()==''){
        getObjectArrayJsonVentas(global.variablesVentas,IdTabSeleccionado)[0].Cliente = null
        $("#Cliente_"+IdTabSeleccionado).attr("data-id",null)
    }

    console.log(global.variablesVentas)
    var _CodTipoComprobante=""
    if(!($('#tabs li:first').hasClass('active'))){
        if(IdTabSeleccionado!=null){
            var rows = $("#tablaBodyProductosVentas_"+IdTabSeleccionado+" > tr").length
            //ComprobantePago('14',getObjectArrayJsonVentas(global.variablesVentas,IdTabSeleccionado)[0].Cliente,getObjectArrayJsonVentas(global.variablesVentas,IdTabSeleccionado)[0].Detalles)
            if(rows>0){
                // verificar cierre z ???
                if(parseFloat(getObjectArrayJsonVentas(global.variablesVentas,IdTabSeleccionado)[0].Total)<=700){
                    if($('#Cod_Moneda_Forma_Pago_'+IdTabSeleccionado).val() == 'USD' || $('#Cod_Moneda_Forma_Pago_'+IdTabSeleccionado).val() == 'EUR'){
                    //if($('input[name=Cod_Moneda_Forma_Pago_'+IdTabSeleccionado+']:checked').val() == 'dolares' || $('input[name=Cod_Moneda_Forma_Pago_'+IdTabSeleccionado+']:checked').val() == 'euros'){
                        if(parseFloat($("#TotalRecibidos_"+IdTabSeleccionado).val())>0){
                            VentaSimpleConME(IdTabSeleccionado, _CodTipoComprobante)
                        }else{ 
                            CargarModalConfirmacion(IdTabSeleccionado,_CodTipoComprobante) 
                        }
                    }else{
                        VentaSimpleSinME(IdTabSeleccionado,_CodTipoComprobante)
                    }
                }else{
                    if($("#Cliente_"+IdTabSeleccionado).attr("data-id")==null){
                        LimpiarVariablesGlobales()
                        ComprobantePago('14',getObjectArrayJsonVentas(global.variablesVentas,IdTabSeleccionado)[0].Cliente,getObjectArrayJsonVentas(global.variablesVentas,IdTabSeleccionado)[0].Detalles)
                    }else{
                        if($('#Cod_Moneda_Forma_Pago_'+IdTabSeleccionado).val() == 'USD' || $('#Cod_Moneda_Forma_Pago_'+IdTabSeleccionado).val() == 'EUR'){
                        //if($('input[name=Cod_Moneda_Forma_Pago_'+IdTabSeleccionado+']:checked').val() == 'dolares' || $('input[name=Cod_Moneda_Forma_Pago_'+IdTabSeleccionado+']:checked').val() == 'euros'){
                            if(parseFloat($("#TotalRecibidos_"+IdTabSeleccionado).val())>0){
                                VentaSimpleConME(IdTabSeleccionado, _CodTipoComprobante)
                            }else{ 
                                CargarModalConfirmacion(IdTabSeleccionado,_CodTipoComprobante) 
                            }
                        }else{
                            VentaSimpleSinME(IdTabSeleccionado,_CodTipoComprobante)
                        }
                    }
                }
            }else{
                toastr.error('No se puede Utilizar esta opcion sin haber ingresado al menos una venta.\n\n Ingrese la venta y vuelva a intentarlo.','Error',{timeOut: 5000})     
            }
            
        }
    }else{
        IdTabSeleccionado = null
    } 
}

function VentaCompleta(){ 
    console.log(global.variablesVentas)
    if(!($('#tabs li:first').hasClass('active'))){
        if(IdTabSeleccionado!=null){
            var rows = $("#tablaBodyProductosVentas_"+IdTabSeleccionado+" > tr").length
            if(rows>0){
                LimpiarVariablesGlobales()
                ComprobantePago('14',getObjectArrayJsonVentas(global.variablesVentas,IdTabSeleccionado)[0].Cliente,getObjectArrayJsonVentas(global.variablesVentas,IdTabSeleccionado)[0].Detalles)
            }else{
                toastr.error('No se puede Utilizar esta opcion sin haber ingresado al menos una venta.\n\n Ingrese la venta y vuelva a intentarlo.','Error',{timeOut: 5000})     
            }
        }
    }else{
        IdTabSeleccionado = null
    } 
}


export { NuevaVenta, VentaSimple, VentaCompleta, LimpiarVenta }