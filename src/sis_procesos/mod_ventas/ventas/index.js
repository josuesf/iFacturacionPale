var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../../constantes_entorno/constantes'
import { NuevoCliente, BuscarCliente } from '../../modales'

var cantidad_tabs = 1

function VerNuevaVenta(variables) {
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
                                        <input type="text" class="form-control" id="Doc">
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
                                                <button type="button" id="BuscarCliente" class="btn btn-info" onclick=${()=>BuscarCliente("Cliente","Doc",null)}>
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
                                <div class="col-sm-6 text-center"> 
                                    <div class="panel panel-default">
                                        <div class="panel-heading">
                                            <h4> Monedas</h4>
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
                                                        yo`<div class="radio"><label><input type="radio" id="Cod_Moneda" name="Cod_Moneda"><i class="fa fa-euro fa-3x"></i></label></div>`
                                                        :
                                                        yo`<div class="radio"><label><input type="radio" id="Cod_Moneda" name="Cod_Moneda"><i class="fa fa-dollar fa-3x"></i></label></div>`
                                                        :
                                                        yo`<div class="radio"><label><input type="radio" id="Cod_Moneda" name="Cod_Moneda"> <strong style="font-size:35px">S/</strong></label></div>`
                                                    )
                                                :
                                                yo``
                                                }
                                            `)}
 
                                        </div>
                                    </div> 
                                </div>
                                <div class="col-sm-6 text-center">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">
                                            <h4> Tarjetas de credito</h4>
                                        </div>  
                                        <div class="panel-body">

                                        ${variables.formaspago.map(e=>yo`
                                            ${  e.Cod_FormaPago!="005"?
                                                e.Cod_FormaPago!="006"?
                                                yo``
                                                :
                                                yo`<div class="radio"><label><input type="radio" id="Cod_FormaPago" name="Cod_FormaPago"> <i class="fa fa-cc-mastercard  fa-3x"></i></label></div>`
                                                :
                                                yo`<div class="radio"><label><input type="radio" id="Cod_FormaPago" name="Cod_FormaPago"> <i class="fa fa-cc-visa fa-3x"></i></label></div>`
                                            }
                                        `)}
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
                VerNuevaVenta(variables)
            }
            else { 
                VerNuevaVenta([])
            }
            H5_loading.hide()
        })
    //VerNuevaVenta()
}

export { NuevaVenta }