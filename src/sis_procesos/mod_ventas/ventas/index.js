var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../../constantes_entorno/constantes'
import { NuevoCliente, BuscarCliente } from '../../modales'

var cantidad_tabs = 1
var Total = 0
var TotalDescuentos = 0
var TipodeCambio = 1
var _CantidadOriginal = null
var SimboloMoneda = ''
var SimboloMonedaExtra = ''

function VerNuevaVenta(variables,CodLibro) {
    cantidad_tabs++
    const idTabVenta = cantidad_tabs
    var tab = yo`
        <li class=""><a href="#tab_${idTabVenta}" data-toggle="tab" aria-expanded="false" id="id_${idTabVenta}">Ventas <button type="button" class="close" onclick=${()=>CerrarTabVenta(idTabVenta)}><span aria-hidden="true"> ×</span></button></a></li>`

    var tabContent = yo`
        <div class="tab-pane" id="tab_${idTabVenta}">
            <div class="row">
                <div class="col-md-3">
                    <div class="box box-success box-solid">
                        <div class="box-header with-border text-center">
                            <h4>Datos del cliente</h4>
                        </div>
                        <div class="box-body">
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
                                        <input type="text" id="Nro_Documento_${idTabVenta}" onblur="${() => BuscarClienteDoc(CodLibro,idTabVenta)}" class="form-control">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label>Nombres completos</label>
                                        <div class="input-group">
                                            <div class="input-group-btn">
                                                <button type="button" id="AgregarCliente" class="btn btn-success" onclick=${()=>NuevoCliente(variables.documentos)}>
                                                    <i class="fa fa-plus"></i>
                                                </button>
                                            </div>
                                            <input type="text" id="Cliente_${idTabVenta}" class="form-control">
                                            <div class="input-group-btn">
                                                <button type="button" id="BuscarCliente" class="btn btn-info" onclick=${()=>BuscarCliente("Cliente_"+idTabVenta,"Nro_Documento_"+idTabVenta,null)}>
                                                    <i class="fa fa-search"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p></p>
                            <div class="row">
                                <div class="col-md-12"> 
                                    <div class="form-group">
                                        <label>Direccion</label>
                                        <input type="text" class="form-control" id="Direccion">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="box-footer">

                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="box box-default">
                                        <div class="box-header">
                                            <h4> Monedas </h4>
                                        </div>
                                        <div class="box-body"> 
                                                <div class="cc-selector-2 text-center row" id="divMonedas_${idTabVenta}" >
                                                    ${variables.formaspago.map(e=>yo`
                                                        ${e.Cod_FormaPago=="008"?
                                                            variables.monedas.map(m=>
                                                                m.Cod_Moneda!="PEN"?
                                                                m.Cod_Moneda!="USD"?
                                                                m.Cod_Moneda!="EUR"?
                                                                yo``
                                                                :
                                                                yo`
                                                                <div class="row">
                                                                    <div class="col-md-12">
                                                                        <input type="radio" name="Cod_Moneda_Forma_Pago_${idTabVenta}" value="euros" onchange=${()=>CambioMonedaFormaPagoEuros(Cod_Moneda,variables,Tipo_Cambio)}/>
                                                                        <label class="drinkcard-cc euros" for="Cod_Moneda_Forma_Pago_${idTabVenta}"></label>
                                                                    </div>
                                                                </div>`
                                                                :
                                                                yo`
                                                                <div class="row">
                                                                    <div class="col-md-12">
                                                                        <input type="radio" name="Cod_Moneda_Forma_Pago_${idTabVenta}" value="dolares" onchange=${()=>CambioMonedaFormaPagoDolares(Cod_Moneda,variables,Tipo_Cambio)}/>
                                                                        <label class="drinkcard-cc dolares" for="Cod_Moneda_Forma_Pago_${idTabVenta}"></label>
                                                                    </div>
                                                                </div>`
                                                                :
                                                                yo`
                                                                <div class="row">
                                                                    <div class="col-md-12">
                                                                        <input type="radio" name="Cod_Moneda_Forma_Pago_${idTabVenta}" value="soles" checked="checked" onchange=${()=>CambioMonedaFormaPagoSoles(Cod_Moneda)}/>
                                                                        <label class="drinkcard-cc soles" for="Cod_Moneda_Forma_Pago_${idTabVenta}"></label>
                                                                    </div>
                                                                </div>`
                                                            )
                                                        :
                                                        yo``
                                                        }
                                                    `)}
                                                    
                                                    <div class="row">
                                                        <div class="col-md-8">
                                                            <div class="form-group">
                                                                <label>Tipo Cambio</label>
                                                                <input type="number" class="form-control" value="1.00" id="Tipo_Cambio_Venta_${idTabVenta}" name="Tipo_Cambio_Venta_${idTabVenta}">
                                                            </div> 
                                                        </div>
                                                    </div>

                                                </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="box box-default">
                                        <div class="box-header">
                                            <h4> Tarjetas </h4>
                                        </div>
                                        <div class="box-body">
                                                <div class="cc-selector-2 text-center row" id="divTarjetas_${idTabVenta}"> 
                                                    ${variables.formaspago.map(e=>yo`
                                                        ${  e.Cod_FormaPago!="005"?
                                                            e.Cod_FormaPago!="006"?
                                                            yo``
                                                            :
                                                            yo`
                                                            <div class="row">
                                                                <div class="col-md-12">
                                                                    <input  checked="checked" id="Cod_FormaPago_MasterCard_${idTabVenta}" type="radio" name="Cod_FormaPago_Modal_${idTabVenta}" value="mastercard"  onchange=${()=>CambioMonedaFormaPagoMasterCard()}/>
                                                                    <label class="drinkcard-cc mastercard" for="Cod_FormaPago_Modal_${idTabVenta}"></label>
                                                                </div>
                                                            </div>`
                                                            :
                                                            yo`
                                                            <div class="row">
                                                                <div class="col-md-12">
                                                                    <input  checked="checked" id="Cod_FormaPago_Visa_${idTabVenta}" type="radio" name="Cod_FormaPago_Modal_${idTabVenta}" value="visa" onchange=${()=>CambioMonedaFormaPagoVisa()}/>
                                                                    <label class="drinkcard-cc visa" for="Cod_FormaPago_Modal_${idTabVenta}"></label>
                                                                </div>
                                                            </div>`
                                                        }
                                                    `)}

                                                    ${variables.formaspago.map(e=>yo`
                                                        ${  e.Cod_FormaPago=="005"?
                                                            yo`
                                                            <div class="row">
                                                                <div class="col-md-8">
                                                                    <div class="form-group">
                                                                        <label>Nro Ref.</label>
                                                                        <input type="number" class="form-control" value="" id="Nro_Tarjeta_${idTabVenta}" name="Nro_Tarjeta_${idTabVenta}">
                                                                    </div> 
                                                                </div>
                                                            </div>`
                                                            :
                                                            yo``
                                                        }
                                                    `)}
                                                     
                                                </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-9">
                    <div class="box box-success box-solid">
                        <div class="box-header with-border text-center">
                            <h4>Detalle de la venta</h4>
                        </div>
                        <div class="box-body">

                            <div class="row">
                                <div class="col-md-12">
                                    <div class="col-md-8">
                                        <div class="form-group">
                                            <label>Codigo/Nombres Producto</label>
                                            <input type="text" class="form-control">
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
                                                ${variables.almacenes.map(e=>yo`<option style="text-transform:uppercase" value="${e.Cod_Almacen}">${e.Des_Almacen}</option>`)}
                                            </select>
                                        </div>
                                    </div> 
                                </div>
                            </div> 
                            
                            <div class="row">
                                <div class="col-md-12">
                                
                                <table class="table table-bordered table-hover">
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
                                    
                                    <tfoot>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td><button class="btn btn-default btn-lg" id="btnDescuentos" style="display:none"><i class="fa fa-arrow-circle-down text-red"></i>TOTAL DESCUENTOS: 0.00</button></td>
                                            <td><button class="btn btn-default btn-lg" id="btnTotal" data-toggle="button" aria-pressed="false" autocomplete="off"><i class="fa fa-money text-green"></i></button></td>
                                            <td><button class="btn btn-default btn-lg" id="btnConversion" style="display:none"><i class="fa fa-refresh text-green"></i></button></td>
                                        </tr>
                                    </tfoot>

                                    <tbody id="tablaBodyProductosVentas_${idTabVenta}">
                                    </tbody> 
                                </table>
                                
                                </div>
                                                        
                            </div>
                            

                        </div>
                        <div class="box-footer" id="divFooter_${idTabVenta}">
                            <div class="row"> 
                                
                                <div class="col-md-12">
                                    <div class="box box-warning">
                                        <div class="box-header with-border">
                                            <h3 class="box-title"><i class="fa fa-star text-orange"></i> Favoritos</h3>
                                        </div>
                                        <div class="box-body" id="divFavoritos_${idTabVenta}">
                                            ${CrearBotonesFavoritos(variables.favoritos,idTabVenta)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="box box-warning">
                                        <div class="box-header with-border">
                                            <h3 class="box-title" style="margin-left:20px">Productos</h3>
                                            
                                            <div class="box-tools" style="left: 10px;display:none" id="divTools_${idTabVenta}">
                                                <button type="button" class="btn btn-box-tool" onclick=${()=>CrearBotonesCategoriasXSeleccion(variables.categorias,'',idTabVenta)}><i class="fa fa-arrow-left"></i></button>
                                            </div>

                                        </div>
                                        <div class="box-body" id="divProductos_${idTabVenta}">
                                            ${CrearBotonesCategorias(variables.categorias,idTabVenta)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    
    $("#tabs").append(tab)
    $("#tabs_contents").append(tabContent)
    $("#id_"+idTabVenta).click()
    TraerSimboloSOLES(variables.monedas,'PEN') 
}

function CrearDivFavoritos(idTab){
    var div = yo`
                <div>
                    <div class="row">              
                        <div class="col-md-12">
                            <div class="box box-warning">
                                <div class="box-header with-border">
                                    <h3 class="box-title"><i class="fa fa-star text-orange"></i> Favoritos</h3>
                                </div>
                                <div class="box-body" id="divFavoritos_${idTabVenta}">
                                    ${CrearBotonesFavoritos(variables.favoritos,idTabVenta)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="box box-warning">
                                <div class="box-header with-border">
                                    <h3 class="box-title" style="margin-left:20px">Productos</h3>
                                    
                                    <div class="box-tools" style="left: 10px;display:none" id="divTools_${idTabVenta}">
                                        <button type="button" class="btn btn-box-tool" onclick=${()=>CrearBotonesCategoriasXSeleccion(variables.categorias,'',idTabVenta)}><i class="fa fa-arrow-left"></i></button>
                                    </div>

                                </div>
                                <div class="box-body" id="divProductos_${idTabVenta}">
                                    ${CrearBotonesCategorias(variables.categorias,idTabVenta)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
    var divFV = document.getElementById('divFooter_'+idTab);
    empty(divFV).appendChild(div);
}

function CrearBotonesProductos(c,idTab,callback){
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
    
        }) 
}

function CrearBotonesCategorias(categorias,idTab){
     
    return yo`<div>
            ${categorias.map(e=> 
                e.Cod_Padre==''?
                    yo`<a class="btn btn-app" onclick=${()=>SeleccionarCategoria(e,categorias,idTab)}>${e.Des_Categoria}</a>`
                :
                    yo``)}
            </div>` 
}


function CrearBotonesCategoriasXSeleccion(categorias,CodPadre,idTab){
     
    var listaProductos= yo`<div>
            ${categorias.map(e=> 
                e.Cod_Padre==CodPadre?
                    yo`<a class="btn btn-app" onclick=${()=>SeleccionarCategoria(e,categorias,idTab)}>${e.Des_Categoria.toString().replace('-->','')}</a>`
                :
                    yo``)}
            </div>`
    
    if(CodPadre==''){
        $("#divTools_"+idTab).css("display","none")
    }else{
        $("#divTools_"+idTab).css("display","block")
    }

    var divProductos = document.getElementById('divProductos_'+idTab);
    empty(divProductos).appendChild(listaProductos);
    
    
}


function CrearBotonesFavoritos(favoritos,idTab){
    return  yo`<div> 
                ${favoritos.map(e=>yo`<a class="btn btn-app" onclick=${()=>AgregarProducto(e,favoritos,idTab)} style="height:80px"><i class="fa fa-star text-orange"></i> ${e.Nom_Producto}<p></p> ${parseFloat(e.Valor).toFixed(4)}</a>`)}
            </div>`
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
                                            ${productos.map(e=> yo`<a class="btn btn-app" style="height:80px">${e.Nom_Producto}<p></p>${SimboloMoneda+' '+parseFloat(categoria.Valor).toFixed(4)}</a>`)}
                                        </div>`
                    var divProductos = document.getElementById('divProductos_'+idTab);
                    empty(divProductos).appendChild(listaProductos);
                } 
            })
        }
    })

}

function TraerSimboloSOLES(monedas,pCodMoneda){
    for(var i=0;i<monedas.length;i++){
        if(monedas[i].Cod_Moneda==pCodMoneda){
            SimboloMoneda = monedas[i].Simbolo
            SimboloMonedaExtra = SimboloMoneda
            break
        }
    }
    $("#btnTotal").html('<i class="fa fa-money text-green"></i> TOTAL: '+SimboloMoneda+' '+parseFloat(Total).toFixed(2))
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
        var _PrecioUnitario = parseFloat($(this).find("td").eq(4).text())
        $(this).find("td").eq(9).text((parseFloat(_Cantidad)*parseFloat(_PrecioUnitario)).toFixed(2))
    });
    CalcularTotal(idTab)
}


function RecalcularDescuentosTotales(idTab){
    $('#tablaBodyProductosVentas_'+idTab+' tr').each(function (index) { 
        var _Cantidad = parseFloat($(this).find("td").eq(3).find('input').val())
        var _DescuentoUnitario = parseFloat($(this).find("td").eq(7).text())
        $(this).find("td").eq(8).text((_Cantidad*_DescuentoUnitario).toFixed(2))
    });
    CalcularTotalDescuentos(idTab)
}



function CalcularTotalDescuentos(idTab){
    var _total = 0
    $('#tablaBodyProductosVentas_'+idTab+' tr').each(function (index) { 
        _total = _total + parseFloat($(this).find("td").eq(8).text())
    });
    _total = parseFloat(_total.toFixed(2))
    TotalDescuentos = _total
    $("#btnDescuentos").html('<i class="fa fa-arrow-circle-down text-red"></i> TOTAL DESCUENTOS: '+SimboloMoneda+' '+parseFloat(TotalDescuentos).toFixed(2))
    if(_total!=0){
        $("#btnDescuentos").css("display","block")
    }else{
        $("#btnDescuentos").css("display","none")
    }
}

function CalcularTotal(idTab){
    var _total = 0
    $('#tablaBodyProductosVentas_'+idTab+' tr').each(function (index) {
        _total = _total + parseFloat($(this).find("td").eq(9).text())
    });
    _total = parseFloat(_total.toFixed(2))
    Total = _total
    $("#btnTotal").html('<i class="fa fa-money text-green"></i> TOTAL: '+SimboloMoneda+' '+parseFloat(Total).toFixed(2))
    if ($('input[name=Cod_Moneda_Forma_Pago_'+idTab+']:checked').val() == 'dolares' || $('input[name=Cod_Moneda_Forma_Pago_'+idTab+']:checked').val() == 'euros') {
        if ($('input[name=Cod_Moneda_Forma_Pago_'+idTab+']:checked').val() == 'euros'){
            $("#btnConversion").css("display","block")
            $("#btnConversion").html('<i class="fa fa-refresh text-green"></i> EN EUROS: '+SimboloMonedaExtra+' '+(parseFloat(Total)/parseFloat(TipodeCambio)).toFixed(2))
        }else{
            $("#btnConversion").css("display","block")
            $("#btnConversion").html('<i class="fa fa-refresh text-green"></i> EN DOLARES: '+SimboloMonedaExtra+' '+(parseFloat(Total)/parseFloat(TipodeCambio)).toFixed(2))
        }
    }else{
        $("#btnConversion").css("display","none")
    }
}

function CerrarTabVenta(idTab){
    $('#tab_'+idTab).remove()
    $('#id_'+idTab).parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show');
}

function EliminarFila(idFila,idTab){
    $('#'+idFila).remove()
    CalcularTotal(idTab)
    CalcularTotalDescuentos(idTab)
}

function FocusInOutCantidadVenta(idFila,idTab){
    if($('#'+idFila).find('td.Flag_Stock').text().toString()=="true"){
        _CantidadOriginal = parseFloat($('#'+idFila).find('td.Cantidad').find('input').val())
    }
}


function CambioCantidadVenta(idFila,idTab){
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
                    var producto = res.data.producto[0]
                    if(parseFloat($('#'+idFila).find('td.Cantidad').find('input').val()) > parseFloat(producto.Stock_Act)){
                        toastr.error('El stock maximo es de : '+parseFloat(producto.Stock_Act).toFixed(0),'Error',{timeOut: 5000})  
                        $('#'+idFila).find('td.Cantidad').find('input').val(_CantidadOriginal)
                    }
                }else{
                    $('#'+idFila).find('td.Cantidad').find('input').val(_CantidadOriginal)
                }

            }) 
    } 
    RecalcularSubtotales(idTab)
    RecalcularDescuentosTotales(idTab)
}


function CambioPrecioDescuentos(idFila,idTab){
    var _Unitario = parseFloat($('#'+idFila).find('td.UnitarioBase').find('input').val())
    var _Descuento = parseFloat($('#'+idFila).find('td.Descuentos').find('input').val()) / 100
    if(_Descuento !=0){
        $('#'+idFila).find('td.Descuentos').find('input').css("background","#dd4b39")
        $('#'+idFila).find('td.Descuentos').find('input').css("color","white")
        $('#'+idFila).find('td.Descuentos').find('input').css("border-color","#dd4b39")
    }else{
        
        $('#'+idFila).find('td.Descuentos').find('input').css("background","white")
        $('#'+idFila).find('td.Descuentos').find('input').css("color","#555")
        $('#'+idFila).find('td.Descuentos').find('input').css("border-color","#98999c")
    }
    $('#'+idFila).find('td.DescuentoUnitario').text(_Unitario * _Descuento)
    RecalcularSubtotales(idTab)
    RecalcularDescuentosTotales(idTab)
 
}
 



function AgregarProducto(producto,favoritos,idTab){

    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Id_Producto: producto.Id_Producto
        })
    }
    fetch(URL + '/productos_serv_api/get_producto_by_pk', parametros)
        .then(req => req.json())
        .then(res => {
            if(res.respuesta=="ok"){
                var dataProducto = res.data.producto[0]
                ValidarStock(producto.Stock_Act,dataProducto,idTab,function(flag){
                    if(flag){
                        ExisteProducto(producto.Cod_Producto,idTab,function(flag,index){
                            if(flag){
                                $('#tablaBodyProductosVentas_'+idTab+' tr:eq('+ index + ')').find('td.Cantidad').find('input').val((parseFloat($('#tablaBodyProductosVentas_'+idTab+' tr:eq('+ index + ')').find('td.Cantidad').find('input').val())+1).toFixed(2))
                                $('#tablaBodyProductosVentas_'+idTab+' tr:eq('+ index + ')').find('td.Precio').text((parseFloat($('#tablaBodyProductosVentas_'+idTab+' tr:eq('+ index + ')').find('td.Cantidad').find('input').val())*parseFloat(RecuperarPrecio(favoritos,dataProducto))).toFixed(2))
                                $('#tablaBodyProductosVentas_'+idTab+' tr:eq('+ index + ')').find('td.DescuentoTotal').text((parseFloat($('#tablaBodyProductosVentas_'+idTab+' tr:eq('+ index + ')').find('td.DescuentoUnitario').text())*parseFloat($('#tablaBodyProductosVentas_'+idTab+' tr:eq('+ index + ')').find('td.Cantidad').find('input').val())).toFixed(2))
                            }else{
                                var idFila = $('#tablaBodyProductosVentas_'+idTab+' > tr').length
                                var fila = yo`
                                <tr id="${idFila+''+idTab}">
                                    <td class="Cod_Producto">${dataProducto.Cod_Producto}</td> 
                                    <td class="Flag_Stock hidden">${dataProducto.Flag_Stock}</td> 
                                    <td class="Nom_Producto" style="width: 30%;">${dataProducto.Nom_Producto}</td> 
                                    <td class="Cantidad"><input type="number" class="form-control input-sm" value="1.0000" onblur=${()=>FocusInOutCantidadVenta(idFila+''+idTab,idTab)} onchange=${()=>CambioCantidadVenta(idFila+''+idTab,idTab)}></td>
                                    <td class="Unitario hidden">${RecuperarPrecio(favoritos,dataProducto)}</td>
                                    <td class="UnitarioBase"><input type="number" class="form-control input-sm" value=${RecuperarPrecio(favoritos,dataProducto)} onchange=${()=>CambioPrecioDescuentos(idFila+''+idTab,idTab)}></td> 
                                    <td class="Descuentos"><input type="number" class="form-control input-sm" value="0.00" onchange=${()=>CambioPrecioDescuentos(idFila+''+idTab,idTab)}></td>
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
                            }
                            CalcularTotal(idTab)
                            CalcularTotalDescuentos(idTab)
                        })
                       
                        
                    }else{
                        toastr.error('No existe stock para dicho producto','Error',{timeOut: 5000})  
                    }
                })
            }
    
        })
}




function BuscarClienteDoc(CodLibro,idTab) {
    var Nro_Documento = document.getElementById('Nro_Documento_'+idTab).value
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
                global.objCliente = res.data.cliente[0]

                if(global.objCliente !='' && global.objCliente){
                    $("#Cod_TipoDoc_"+idTab).val(global.objCliente.Cod_TipoDocumento)
                    $("#Cliente_"+idTab).val(global.objCliente.Cliente)
                    $("#Nro_Documento_"+idTab).val(global.objCliente.Nro_Documento)
                    $("#Cliente_"+idTab).attr("data-id",global.objCliente.Id_ClienteProveedor)                   
                } 
            }
            H5_loading.hide()
        })
}

function NuevaVenta() {
    H5_loading.show();
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        })
    }
    fetch(URL + '/ventas_api/get_variables_ventas', parametros)
        .then(req => req.json())
        .then(res => {
            var variables = res.data
            if (res.respuesta == 'ok') {
                VerNuevaVenta(variables,null)
            }
            else { 
                VerNuevaVenta([],null)
            }
            H5_loading.hide()
        })
    //VerNuevaVenta()
}

export { NuevaVenta }