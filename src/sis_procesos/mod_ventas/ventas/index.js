var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../../constantes_entorno/constantes'
import { NuevoCliente, BuscarCliente } from '../../modales'

var cantidad_tabs = 1

function VerNuevaVenta(variables,CodLibro) {
    cantidad_tabs++
    var tab = yo`
        <li class=""><a href="#tab_${cantidad_tabs}" data-toggle="tab" aria-expanded="false" id="id_${cantidad_tabs}">Ventas</a></li>`

    var tabContent = yo`
        <div class="tab-pane" id="tab_${cantidad_tabs}">
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
                                        <select class="form-control" id="Cod_TipoDoc">
                                            ${variables.documentos.map(e=>yo`<option style="text-transform:uppercase" value="${e.Cod_TipoDoc}">${e.Nom_TipoDoc}</option>`)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <input type="text" id="Nro_Documento" onblur="${() => BuscarClienteDoc(CodLibro)}" class="form-control">
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
                                            <input type="text" id="Cliente" class="form-control">
                                            <div class="input-group-btn">
                                                <button type="button" id="BuscarCliente" class="btn btn-info" onclick=${()=>BuscarCliente("Cliente","Nro_Documento",null)}>
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
                                        <input type="text" class="form-control">
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
                                                                <div class="row">
                                                                    <div class="col-md-12">
                                                                        <input type="radio" name="Cod_Moneda_Forma_Pago" value="euros" onchange=${()=>CambioMonedaFormaPagoEuros(Cod_Moneda,variables,Tipo_Cambio)}/>
                                                                        <label class="drinkcard-cc euros" for="Cod_Moneda_Forma_Pago"></label>
                                                                    </div>
                                                                </div>`
                                                                :
                                                                yo`
                                                                <div class="row">
                                                                    <div class="col-md-12">
                                                                        <input type="radio" name="Cod_Moneda_Forma_Pago" value="dolares" onchange=${()=>CambioMonedaFormaPagoDolares(Cod_Moneda,variables,Tipo_Cambio)}/>
                                                                        <label class="drinkcard-cc dolares" for="Cod_Moneda_Forma_Pago"></label>
                                                                    </div>
                                                                </div>`
                                                                :
                                                                yo`
                                                                <div class="row">
                                                                    <div class="col-md-12">
                                                                        <input type="radio" name="Cod_Moneda_Forma_Pago" value="soles" checked="checked" onchange=${()=>CambioMonedaFormaPagoSoles(Cod_Moneda)}/>
                                                                        <label class="drinkcard-cc soles" for="Cod_Moneda_Forma_Pago"></label>
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
                                                                <input type="number" class="form-control" value="0.00" id="Tipo_Cambio_Venta" name="Tipo_Cambio_Venta">
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
                                                <div class="cc-selector-2 text-center row" id="divTarjetas"> 
                                                    ${variables.formaspago.map(e=>yo`
                                                        ${  e.Cod_FormaPago!="005"?
                                                            e.Cod_FormaPago!="006"?
                                                            yo``
                                                            :
                                                            yo`
                                                            <div class="row">
                                                                <div class="col-md-12">
                                                                    <input  checked="checked" id="Cod_FormaPago_MasterCard" type="radio" name="Cod_FormaPago_Modal" value="mastercard"  onchange=${()=>CambioMonedaFormaPagoMasterCard()}/>
                                                                    <label class="drinkcard-cc mastercard" for="Cod_FormaPago_Modal"></label>
                                                                </div>
                                                            </div>`
                                                            :
                                                            yo`
                                                            <div class="row">
                                                                <div class="col-md-12">
                                                                    <input  checked="checked" id="Cod_FormaPago_Visa" type="radio" name="Cod_FormaPago_Modal" value="visa" onchange=${()=>CambioMonedaFormaPagoVisa()}/>
                                                                    <label class="drinkcard-cc visa"for="Cod_FormaPago_Modal"></label>
                                                                </div>
                                                            </div>`
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
                                            <select class="form-control" id="Cod_Precio">
                                                ${variables.precios.map(e=>yo`<option style="text-transform:uppercase" value="${e.Cod_Precio}">${e.Nom_Precio}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            <label>Almacen</label>
                                            <select class="form-control">
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
                                        </tr>
                                    </thead>

                                    <tbody id="tablaBodyProductosVentas">
                                    </tbody>
                                </table>
                                
                                </div>
                                                        
                            </div>
                            

                        </div>
                        <div class="box-footer">
                            <div class="row"> 
                                
                                <div class="col-md-12">
                                    <div class="box box-warning">
                                        <div class="box-header with-border">
                                            <h3 class="box-title"><i class="fa fa-star"></i> Favoritos</h3>
                                        </div>
                                        <div class="box-body" id="divFavoritos">
                                            ${CrearBotonesFavoritos(variables)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="box box-warning">
                                        <div class="box-header with-border">
                                            <h3 class="box-title">Productos</h3>
                                        </div>
                                        <div class="box-body" id="divProductos">
                                            ${CrearBotonesCategorias(variables,'')}
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
    $("#id_"+cantidad_tabs).click()
    //var tabContent_element = document.getElementById('tabs_contents')
    //tabContent_element.appendChild()
    //empty(tabContent_element).appendChild(tabContent);
}

function CrearBotonesProductos(variables,CodCategoria){
    return yo`<div>
            ${variables.categorias.map(e=> 
                e.Cod_Padre==CodPadre?
                    yo`<a class="btn btn-app" onclick=${()=>SeleccionarCategoria(e,variables.categorias)}>${e.Des_Categoria}</a>`
                :
                    yo``)}
            </div>`
}


function CrearBotonesCategorias(variables,CodPadre){
    return yo`<div>
            ${variables.categorias.map(e=> 
                e.Cod_Padre==CodPadre?
                    yo`<a class="btn btn-app" onclick=${()=>SeleccionarCategoria(e,variables.categorias)}>${e.Des_Categoria}</a>`
                :
                    yo``)}
            </div>`
}


function CrearBotonesFavoritos(variables){
    return  yo`<div> 
                ${variables.favoritos.map(e=>yo`<a class="btn btn-app" onclick=${()=>AgregarProducto(e)} style="height:80px"><i class="fa fa-star"></i> ${e.Nom_Producto}<p></p> ${parseFloat(e.Valor).toFixed(4)}</a>`)}
            </div>`
}

function TieneHijos(c,categorias,callback){
    var resp = false
    for(var i=0;i<categorias.length;i++){
        if(categorias[i].Cod_Padre==c.Cod_Categoria){
            res = true
            break
        }
    }
    callback(resp)
}

function ValidarStock(pStock,pCodigoProducto,callback){
    var resp = true
    $('#tablaBodyProductosVentas tr').each(function () {
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

function AgregarProducto(producto){

    /*const parametros = {
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
                ValidarStock(dataProducto.)
            }
    
        })*/
}

function SeleccionarCategoria(c,categorias){
    TieneHijos(c,categorias,function(flag){
        if(flag){
            CrearBotonesCategorias(categorias,c.Cod_Categoria)
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
                global.objCliente = res.data.cliente[0]

                if(global.objCliente !='' && global.objCliente){
                    $("#Cod_TipoDoc").val(global.objCliente.Cod_TipoDocumento)
                    $("#Cliente").val(global.objCliente.Cliente)
                    $("#Nro_Documento").val(global.objCliente.Nro_Documento)
                    $("#Cliente").attr("data-id",global.objCliente.Id_ClienteProveedor)                   
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