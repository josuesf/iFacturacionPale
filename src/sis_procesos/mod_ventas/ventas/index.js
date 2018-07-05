var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../../constantes_entorno/constantes'
import { NuevoCliente, BuscarCliente } from '../../modales'

var cantidad_tabs = 1
var SimboloMoneda = ''
var SimboloMonedaExtra = ''

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
                                        <select class="form-control" id="Cod_TipoDoc_${cantidad_tabs}">
                                            ${variables.documentos.map(e=>yo`<option style="text-transform:uppercase" value="${e.Cod_TipoDoc}">${e.Nom_TipoDoc}</option>`)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <input type="text" id="Nro_Documento_${cantidad_tabs}" onblur="${() => BuscarClienteDoc(CodLibro,cantidad_tabs)}" class="form-control">
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
                                            <input type="text" id="Cliente_${cantidad_tabs}" class="form-control">
                                            <div class="input-group-btn">
                                                <button type="button" id="BuscarCliente" class="btn btn-info" onclick=${()=>BuscarCliente("Cliente_"+cantidad_tabs,"Nro_Documento_"+cantidad_tabs,null)}>
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
                                                <div class="cc-selector-2 text-center row" id="divMonedas_${cantidad_tabs}" >
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
                                                                        <input type="radio" name="Cod_Moneda_Forma_Pago_${cantidad_tabs}" value="euros" onchange=${()=>CambioMonedaFormaPagoEuros(Cod_Moneda,variables,Tipo_Cambio)}/>
                                                                        <label class="drinkcard-cc euros" for="Cod_Moneda_Forma_Pago_${cantidad_tabs}"></label>
                                                                    </div>
                                                                </div>`
                                                                :
                                                                yo`
                                                                <div class="row">
                                                                    <div class="col-md-12">
                                                                        <input type="radio" name="Cod_Moneda_Forma_Pago_${cantidad_tabs}" value="dolares" onchange=${()=>CambioMonedaFormaPagoDolares(Cod_Moneda,variables,Tipo_Cambio)}/>
                                                                        <label class="drinkcard-cc dolares" for="Cod_Moneda_Forma_Pago_${cantidad_tabs}"></label>
                                                                    </div>
                                                                </div>`
                                                                :
                                                                yo`
                                                                <div class="row">
                                                                    <div class="col-md-12">
                                                                        <input type="radio" name="Cod_Moneda_Forma_Pago_${cantidad_tabs}" value="soles" checked="checked" onchange=${()=>CambioMonedaFormaPagoSoles(Cod_Moneda)}/>
                                                                        <label class="drinkcard-cc soles" for="Cod_Moneda_Forma_Pago_${cantidad_tabs}"></label>
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
                                                                <input type="number" class="form-control" value="1.00" id="Tipo_Cambio_Venta_${cantidad_tabs}" name="Tipo_Cambio_Venta_${cantidad_tabs}">
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
                                                <div class="cc-selector-2 text-center row" id="divTarjetas_${cantidad_tabs}"> 
                                                    ${variables.formaspago.map(e=>yo`
                                                        ${  e.Cod_FormaPago!="005"?
                                                            e.Cod_FormaPago!="006"?
                                                            yo``
                                                            :
                                                            yo`
                                                            <div class="row">
                                                                <div class="col-md-12">
                                                                    <input  checked="checked" id="Cod_FormaPago_MasterCard_${cantidad_tabs}" type="radio" name="Cod_FormaPago_Modal_${cantidad_tabs}" value="mastercard"  onchange=${()=>CambioMonedaFormaPagoMasterCard()}/>
                                                                    <label class="drinkcard-cc mastercard" for="Cod_FormaPago_Modal_${cantidad_tabs}"></label>
                                                                </div>
                                                            </div>`
                                                            :
                                                            yo`
                                                            <div class="row">
                                                                <div class="col-md-12">
                                                                    <input  checked="checked" id="Cod_FormaPago_Visa_${cantidad_tabs}" type="radio" name="Cod_FormaPago_Modal_${cantidad_tabs}" value="visa" onchange=${()=>CambioMonedaFormaPagoVisa()}/>
                                                                    <label class="drinkcard-cc visa" for="Cod_FormaPago_Modal_${cantidad_tabs}"></label>
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
                                                                        <input type="number" class="form-control" value="" id="Nro_Tarjeta_${cantidad_tabs}" name="Nro_Tarjeta_${cantidad_tabs}">
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
                                            <select class="form-control" id="Cod_Precio_${cantidad_tabs}">
                                                ${variables.precios.map(e=>yo`<option style="text-transform:uppercase" value="${e.Cod_Precio}">${e.Nom_Precio}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            <label>Almacen</label>
                                            <select class="form-control" id="Cod_Almacen_${cantidad_tabs}">
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

                                    <tbody id="tablaBodyProductosVentas_${cantidad_tabs}">
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
                                            <h3 class="box-title"><i class="fa fa-star text-orange"></i> Favoritos</h3>
                                        </div>
                                        <div class="box-body" id="divFavoritos_${cantidad_tabs}">
                                            ${CrearBotonesFavoritos(variables.favoritos,cantidad_tabs)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="box box-warning">
                                        <div class="box-header with-border">
                                            <h3 class="box-title" style="margin-left:20px">Productos</h3>
                                            
                                            <div class="box-tools" style="left: 10px;display:none" id="divTools_${cantidad_tabs}">
                                                <button type="button" class="btn btn-box-tool" onclick=${()=>CrearBotonesCategoriasXSeleccion(variables.categorias,'',cantidad_tabs)}><i class="fa fa-arrow-left"></i></button>
                                            </div>

                                        </div>
                                        <div class="box-body" id="divProductos_${cantidad_tabs}">
                                            ${CrearBotonesCategorias(variables.categorias,cantidad_tabs)}
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
    TraerSimboloSOLES(variables.monedas,'PEN') 
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
            break
        }
    }
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

function EliminarFila(idFila){
    $('#'+idFila).remove()
    //CalcularTotal(CodLibro,variables)
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
                                $('#tablaBodyProductosVentas_'+idTab+' tr:eq('+ index + ')').find('td.DescuentoTotal').find('input').val((parseFloat($('#tablaBodyProductosVentas_'+idTab+' tr:eq('+ index + ')').find('td.DescuentoUnitario').find('input').val())+parseFloat($('#tablaBodyProductosVentas_'+idTab+' tr:eq('+ index + ')').find('td.Cantidad').find('input').val())).toFixed(2))
                            }else{
                                var idFila = $('#tablaBodyProductosVentas_'+idTab+' > tr').length
                                var fila = yo`
                                <tr id="${idFila+''+idTab}">
                                    <td class="Cod_Producto">${dataProducto.Cod_Producto}</td> 
                                    <td class="Flag_Stock hidden">${dataProducto.Flag_Stock}</td> 
                                    <td class="Nom_Producto">${dataProducto.Nom_Producto}</td> 
                                    <td class="Cantidad"><input type="number" class="form-control input-sm" value="1.0000"></td>
                                    <td class="Unitario hidden">${RecuperarPrecio(favoritos,dataProducto)}</td>
                                    <td class="UnitarioBase"><input type="number" class="form-control input-sm" value=${RecuperarPrecio(favoritos,dataProducto)}></td> 
                                    <td class="Descuentos hidden">0</td>
                                    <td class="DescuentoUnitario"><input type="number" class="form-control input-sm" value="0.00"></td> 
                                    <td class="DescuentoTotal hidden">0</td> 
                                    <td class="Precio">${RecuperarPrecio(favoritos,dataProducto)}</td>
                                    <td>
                                        <div style="display:flex;"> 
                                            <button type="button" onclick="${()=>EliminarFila(idFila+''+idTab)}" class="btn btn-danger btn-sm"><i class="fa fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>`
                                $('#tablaBodyProductosVentas_'+idTab).append(fila)

                            }
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