var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../../constantes_entorno/constantes'
import { NuevoCliente, BuscarCliente } from '../../modales'

function VerRegistroCompra(variables,fecha_actual) {
    var el = yo`
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
                <h4 class="modal-title"><b>REGISTRO DE COMPRA</b></h4>
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
                                    <div class="col-md-3">
                                        <div class="form-group">
                                            <select id="Cod_TipoDoc" class="form-control">
                                                ${variables.documentos.map(e=>yo`<option style="text-transform:uppercase" value="${e.Cod_TipoDoc}">${e.Nom_TipoDoc}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="input-group">
                                            <input type="text" id="Nro_Documento"   class="form-control required">
                                            <div class="input-group-btn">
                                                <button type="button" class="btn btn-success" data-toggle="modal" data-target="#modal-buscar-doc-proveedor" id="BuscarDoc">
                                                    <i class="fa fa-globe"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-group">
                                            <button class="btn btn-info"  >Mas Detalles</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label> Señor(es) : </label>
                                            <div class="input-group">
                                                <div class="input-group-btn">
                                                    <button type="button" class="btn btn-success" id="AgregarCliente"  >
                                                        <i class="fa fa-plus"></i>
                                                    </button>
                                                </div>
                                                <input type="text" id="Cliente" class="form-control required">
                                                <div class="input-group-btn">
                                                    <button type="button" class="btn btn-info" id="BuscarCliente"  >
                                                        <i class="fa fa-search"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label> Direccion : </label>
                                            <input type="text" id="Direccion" class="form-control required">
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
                                    <div class="col-md-5">
                                        <div class="form-group">
                                            <select class="form-control" id="Serie">
                                                
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-7">
                                        <div class="form-group">
                                            <input type="text" class="form-control required" id="Numero"   >
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
                                                <div class="col-sm-4">
                                                    <label></label>
                                                    <div class="radio">
                                                        <label>
                                                            <input type="radio" value="c" id="TipoDestino" name="TipoDestino" checked="checked"> En Caja
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="col-sm-4">
                                                    <label></label>
                                                    <div class="radio">
                                                        <label>
                                                            <input type="radio" value="b" id="TipoDestino" name="TipoDestino"> En Banco
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="col-sm-4">
                                                    <label>#Operacion</label>
                                                    <div class="form-group">
                                                        <select class="form-control"> 
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-4">
                                                <div class="form-group">
                                                    <select class="form-control"> 
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-8">
                                                <div class="form-group">
                                                    <select class="form-control"> 
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-4">
                                                <div class="checkbox">
                                                    <label>
                                                        <input type="checkbox" id="optLicitacion" name="optLicitacion"> Licitacion
                                                    </label>
                                                </div>
                                            </div>
                                            <div class="col-md-8">
                                                <div class="form-group">
                                                    <select class="form-control"> 
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <div class="checkbox"> 
                                                    <input type="checkbox" id="optEsGasto" name="optEsGasto"> Es Gastos?
                                                </div>
                                            </div>
                                            <div class="col-sm-4">
                                                <div class="form-group">
                                                    <b>Moneda: </b>
                                                    <select id="Cod_Moneda" id="" class="form-control">
                                                        ${variables.monedas.map(e=>yo`<option style="text-transform:uppercase" value="${e.Cod_Moneda}">${e.Nom_Moneda}</option>`)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-sm-5">
                                                <div class="form-group">
                                                    <b>Fecha: </b>
                                                    <input type="date" class="form-control" id="Fecha" value="${fecha_actual}">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-12">
                                                <div class="form-group">
                                                    <b>Vendedor: </b>
                                                    <select id="Cod_Usuarios" id="" class="form-control">
                                                        ${variables.usuarios.map(e=>yo`<option style="text-transform:uppercase" value="${e.Cod_Usuarios}">${e.Nick}</option>`)}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-sm-6">
                                                <div class="form-group">
                                                    <b>Guia de Remision: </b>
                                                    <div class="input-group">
                                                        <div class="input-group-btn">
                                                            <button type="button" class="btn btn-success" id="AgregarGuia"  >
                                                                <i class="fa fa-plus"></i>
                                                            </button>
                                                        </div>
                                                        <input type="text" id="Guia" class="form-control required">
                                                        <div class="input-group-btn">
                                                            <button type="button" class="btn btn-info" id="BuscarGuia"  >
                                                                <i class="fa fa-search"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="checkbox">
                                                    <label>
                                                        <input type="checkbox" id="optDescargar" name="optDescargar"> Descargar Producto
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
                <div class="row">
                    <div class="col-sm-12">
                        <div class="panel panel-default">
                            <div class="panel-body">

                                <div class="table-responsive">
                                    <table id="tablaProductos" class="table table-bordered table-striped">
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
                                        </thead>
                                        <tbody>
                                        
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
                                        <label>SUB TOTAL :  </label>
                                         <input type="text" class="form-control"> 
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-4">
                                    
                                    </div>
                                    <div class="col-md-4">
                                    
                                    </div>
                                    <div class="col-md-4">
                                    
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            <div class="modal-footer">
                <button class="btn btn-primary">Guardar</button>
                <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>`

    var ingreso = document.getElementById('modal-proceso')
    empty(ingreso).appendChild(el)
    $('#modal-proceso').modal()
}

function RegistroCompras() {
    //H5_loading.show();
    const fecha = new Date()
    const mes = fecha.getMonth() + 1
    const dia = fecha.getDate()
    var fecha_format = fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)
    var Cod_Libro = '08'
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
                VerRegistroCompra(variables,fecha_format)
            }
            else { 
                VerRegistroCompra([])
            }
            H5_loading.hide()
        })
}

export { RegistroCompras }