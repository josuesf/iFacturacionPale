var empty = require('empty-element');
var yo = require('yo-yo');

import { ListarProductosServ } from './listar'
import { URL } from '../../../constantes_entorno/constantes'

function Ver(_escritura, variables, producto){
    var el = yo`
    <div>
        
        <section class="content-header">
            <h1>
                Productos y servicios
                <small>Control productos y servicios</small>
            </h1>
            <ol class="breadcrumb">
                <li>
                    <a href="#">
                        <i class="fa fa-cog"></i> Inicio</a>
                </li>
                <li>
                    <a onclick=${()=>ListarProductosServ(_escritura)} href="#"> Productos y servicios</a>
                </li>
                <li class="active">${producto?'Editar':'Nuevo'}</li>
            </ol>
        </section>
        <section class="content">
            <div class="box">
                <div class="box-header">
                    <a onclick=${()=>ListarProductosServ(_escritura)} class="btn btn-xs btn-warning">
                        <i class="fa fa-arrow-left"></i> Atras</a>
    
                </div>
                <!-- /.box-header -->
                <div class="box-body">
                    <div class="nav-tabs-custom">
                        <ul class="nav nav-tabs">
                            <li class="active">
                                <a href="#datos_generales" data-toggle="tab" aria-expanded="true">Datos Generales</a>
                            </li>
                            ${producto?yo`
                            <li class="">
                                <a href="#tab_2" data-toggle="tab" aria-expanded="false">Tab 2</a>
                            </li>`:yo``}
                            ${producto?yo`
                            <li class="">
                                <a href="#tab_3" data-toggle="tab" aria-expanded="false">Tab 3</a>
                            </li>`:yo``}
                        </ul>
                        <div class="tab-content">
                            <div class="tab-pane active" id="datos_generales">

                                <div class="modal fade" id="modal-buscar-responsable" style="display: none;">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">×</span></button>
                                                <h4 class="modal-title">Buscar cuenta contable</h4>
                                            </div>
                                            <div class="modal-body">
                                                <div class="box box-primary">
                                                    <div class="box-header with-border">
                                                    <h3 class="box-title">Buscar cuenta contable</h3>
                                                    </div>
                                                    <!-- /.box-header -->
                                                    <!-- form start -->
                                                    <form role="form">
                                                        <div class="box-body">
                                                        
                                                            <label for="Cod_UsuarioCajero">Ingrese una cuenta o descripcion</label>
                                                            <div class="input-group">
                                                                <div class="input-group-btn">
                                                                    <button type="button" class="btn btn-primary" id="btnBuscar">Buscar</button>
                                                                </div>
                                                                <input type="text" class="form-control" id="txtBuscarCuenta" onkeypress="${()=> BusquedaCuenta()}">
                                                            </div>
                                                            <br>
                                                            <div class="table-responsive" id="contenedorTablaCuentas">
                        
                                                            </div>
                                                        </div>
                                                    </form>
                                                    
                                                </div>
                                            </div>
                                            
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Cancelar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="box-body">
                                        <!-- /.box-header -->
                                        <!-- form start -->
                                        <div role="form">
                                            <div class="box-body">
                                                <div class="row">
                                                    ${producto? yo``:yo`
                                                    <div class="col-sm-6">
                                                        <div class="form-group">
                                                            <label for="Cod_Producto">Codigo de producto</label>
                                                            <input type="text" style="text-transform:uppercase" class="form-control" id="Cod_Producto" placeholder="Codigo producto">
                                                        </div>
                                                    </div>`}
                                                    <div class="col-sm-${producto?'6':'3'}">
                                                        <label></label>
                                                        <div class="checkbox">
                                                            <label>
                                                                <input type="checkbox" id="Flag_Activo" > Activo?
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-${producto?'6':'3'}">
                                                        <label></label>
                                                        <div class="checkbox">
                                                            <label>
                                                                <input type="checkbox" id="Flag_Stock"> Control Stock?
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-sm-6">
                                                        <div class="form-group">
                                                            <label for="Nom_Producto">Producto</label>
                                                            <input type="text" style="text-transform:uppercase" class="form-control" id="Nom_Producto" placeholder="Nombre producto">
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-6">
                                                        <div class="form-group">
                                                            <label for="Des_LargaProducto">SUNAT</label>
                                                            <input type="text" style="text-transform:uppercase" class="form-control" id="Des_LargaProducto" placeholder="Codigo producto">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-sm-6">
                                                        <div class="form-group">
                                                            <label for="Des_CortaProducto">Interno</label>
                                                            <input type="text" style="text-transform:uppercase" class="form-control" id="Des_CortaProducto" placeholder="Codigo producto">
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-6">
                                                        <div class="form-group">
                                                            <label for="Cod_TipoOperatividad">Operatividad</label>
                                                            <select id="Cod_TipoOperatividad" class="form-control">
                                                                ${variables.tipo_operatividad.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_TipoOperatividad}" ${producto ? producto.Cod_TipoOperatividad == e.Cod_TipoOperatividad ? 'selected' : '' : ''}>${e.Nom_TipoOperatividad}</option>`)}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-sm-6">
                                                        <div class="form-group">
                                                            <label for="Cod_TipoProducto">Tipo</label>
                                                            <select id="Cod_TipoProducto" class="form-control">
                                                                ${variables.tipo_producto.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_TipoProducto}" ${producto ? producto.Cod_TipoProducto == e.Cod_TipoProducto ? 'selected' : '' : ''}>${e.Nom_TipoProducto}</option>`)}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-6">
                                                        <div class="form-group">
                                                            <label for="Cod_Marca">Marca</label>
                                                            <select id="Cod_Marca" class="form-control">
                                                                ${variables.marca.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_Marca}" ${producto ? producto.Cod_Marca == e.Cod_Marca ? 'selected' : '' : ''}>${e.Nom_Marca}</option>`)}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-sm-6">
                                                        <div class="form-group">
                                                            <label for="Cod_Categoria">Categoria</label>
                                                            <select id="Cod_Categoria" class="form-control">
                                                                ${variables.categoria_arbol.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_Categoria}" ${producto ? producto.Cod_Categoria == e.Cod_Categoria ? 'selected' : '' : ''}>${e.Des_Categoria}</option>`)}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-6">
                                                        <div class="form-group">
                                                            <label for="Porcentaje_Utilidad">Utilidad %</label>
                                                            <input type="number" min="0" step="0.01" value="0.00" style="text-transform:uppercase" class="form-control" id="Porcentaje_Utilidad" >
                                                        </div>
                                                    </div>
                                                </div>
                                
                                            </div>
                                            <!-- /.box-body -->
                                
                                
                                        </div>
                                        <div class="nav-tabs-custom">
                                                <ul class="nav nav-tabs">
                                                  <li class="active"><a href="#tab_Contabilidad" data-toggle="tab">Contabilidad</a></li>
                                                  <li><a href="#tab_Datos_Adicionales" data-toggle="tab">Datos Adicionales</a></li>
                                                </ul>
                                                <div class="tab-content">
                                                  <div class="tab-pane active" id="tab_Contabilidad">
                                                        <div class="box-body">
                                                                    <!-- /.box-header -->
                                                                    <!-- form start -->
                                                                    <div role="form">
                                                                        <div class="box-body">
                                                                            <div class="row">
                                                                                <div class="col-sm-6">
                                                                                    <label for="">Cuenta ventas</label>
                                                                                    <div class="input-group">
                                                                                        <div class="input-group-btn">
                                                                                            <button type="button" class="btn btn-info" data-toggle="modal" data-target="#modal-buscar-responsable" id="BuscarCuenta1" onclick="${(ev) => ClickBuscar(ev)}">Buscar cuenta</button>
                                                                                        </div>
                                                                                        <input type="text" class="form-control" id="Cuenta_Contable"  disabled>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="col-sm-6">
                                                                                    <label for="">Cuenta compras</label>
                                                                                    <div class="input-group">
                                                                                        <div class="input-group-btn">
                                                                                            <button type="button" class="btn btn-info" data-toggle="modal" data-target="#modal-buscar-responsable" id="BuscarCuenta2" onclick="${(ev) => ClickBuscar(ev)}">Buscar cuenta</button>
                                                                                        </div>
                                                                                        <input type="text" class="form-control" id="Contra_Cuenta"  disabled>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <br>
                                                                            <div class="row">
                                                                                <div class="col-sm-6">
                                                                                    <div class="form-group">
                                                                                        <label for="Cod_TipoExixtencia">Existencia</label>
                                                                                        <select id="Cod_TipoExistencia" class="form-control">
                                                                                            ${variables.tipo_existencia.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_TipoExsitencia}" ${producto ? producto.Cod_TipoExistencia == e.Cod_TipoExsitencia ? 'selected' : '' : ''}>${e.Nom_TipoExsitencia}</option>`)}
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="col-sm-6">
                                                                                    <div class="form-group">
                                                                                        <label for="Cod_Garantia">Marca</label>
                                                                                        <select id="Cod_Garantia" class="form-control">
                                                                                            ${variables.garantias.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_Garantia}" ${producto ? producto.Cod_Garantia == e.Cod_Garantia ? 'selected' : '' : ''}>${e.Nom_Garantia}</option>`)}
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="row">
                                                                                <div class="col-sm-12">
                                                                                    <div class="form-group">
                                                                                        <label for="Cod_Fabricante">Interno</label>
                                                                                        <input type="text" style="text-transform:uppercase" class="form-control" id="Cod_Fabricante" placeholder="Interno">
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="row">
                                                                                <div class="col-sm-12">
                                                                                    <div class="box box-info">
                                                                                        <div class="box-header">
                                                                                          <h3 class="box-title">Caracteristicas
                                                                                            <small></small>
                                                                                          </h3>
                                                                                          <!-- tools box -->
                                                                                          <!-- /. tools -->
                                                                                        </div>
                                                                                        <!-- /.box-header -->
                                                                                        <div class="box-body pad">
                                                                                          <form>
                                                                                                <textarea id="editor1" name="editor1" rows="10" cols="80">
                                                                                                                        En este campo escriba sus caracteristicas.
                                                                                                </textarea>
                                                                                          </form>
                                                                                        </div>
                                                                                      </div>
                                                                                </div>
                                                                            </div>
                                                            
                                                                        </div>
                                                                        <!-- /.box-body -->
                                                            
                                                            
                                                                    </div>
                                                            </div>
                                                  </div>
                                                  <!-- /.tab-pane -->
                                                  <div class="tab-pane" id="tab_Datos_Adicionales">
                                                    <div class="box-body">
                                                        <div role="form">
                                                            <div class="box-body">
                                                                <div class="row">
                                                                    <div class="col-sm-12">
                                                                        <div class="form-group">
                                                                            <label>Observaciones</label>
                                                                            <textarea class="form-control" id="Obs_Producto" rows=10 placeholder="Observacione..."></textarea>
                                                                          </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                  </div>
                                                  <!-- /.tab-pane -->
                                                </div>
                                                <!-- /.tab-content -->
                                              </div>
                                        <div class="box-footer">
                                            <button onclick="" class="btn btn-primary" onclick="${()=>GuardarProducto(_escritura)}">Guardar</button>
                                        </div>
                                    </div>
                            </div>
                            <!-- /.tab-pane -->
                            <div class="tab-pane" id="tab_2">
                                The European languages are members of the same family. Their separate existence is a myth. For science, music, sport, etc,
                                Europe uses the same vocabulary. The languages only differ in their grammar, their pronunciation
                                and their most common words. Everyone realizes why a new common language would be desirable:
                                one could refuse to pay expensive translators. To achieve this, it would be necessary to have
                                uniform grammar, pronunciation and more common words. If several languages coalesce, the grammar
                                of the resulting language is more simple and regular than that of the individual languages.
                            </div>
                            <!-- /.tab-pane -->
                            <div class="tab-pane" id="tab_3">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy
                                text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
                                make a type specimen book. It has survived not only five centuries, but also the leap into electronic
                                typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release
                                of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing
                                software like Aldus PageMaker including versions of Lorem Ipsum.
                            </div>
                            <!-- /.tab-pane -->
                        </div>
                        <!-- /.tab-content -->
                    </div>
                </div>
            </div>
        </section>
    </div>
    
    `
    
    var main = document.getElementById('main-contenido');
    empty(main).appendChild(el);
    $('#modal-buscar-responsable').on('hidden.bs.modal', function () {
        var old_element = document.getElementById("btnBuscar");
        var new_element = old_element.cloneNode(true);
        old_element.parentNode.replaceChild(new_element, old_element);
        var old_element1 = document.getElementById("txtBuscarCuenta");
        var new_element1 = old_element1.cloneNode(true);    
        old_element1.parentNode.replaceChild(new_element1, old_element1);
    });
}

function GuardarProducto(_escritura){
    var Id_Producto = '-1'
    var Cod_Producto = document.getElementById('Cod_Producto').value
    var Cod_Categoria = document.getElementById('Cod_Categoria').value
    var Cod_Marca = document.getElementById('Cod_Marca').value
    var Cod_TipoProducto = document.getElementById('Cod_TipoProducto').value
    var Nom_Producto = document.getElementById('Nom_Producto').value
    var Des_CortaProducto = document.getElementById('Des_CortaProducto').value
    var Des_LargaProducto = document.getElementById('Des_LargaProducto').value
    var Caracteristicas = document.getElementById('')
    var Porcentaje_Utilidad = parseFloat(document.getElementById('Porcentaje_Utilidad').value).toFixed(2)
    var Cuenta_Contable = document.getElementById('Cuenta_Contable').value
    var Contra_Cuenta = document.getElementById('Contra_Cuenta').value
    var Cod_Garantia = document.getElementById('Cod_Garantia').value
    var Cod_TipoExistencia = document.getElementById('Cod_TipoExistencia').value
    var Cod_TipoOperatividad = document.getElementById('Cod_TipoOperatividad').value
    var Flag_Activo = document.getElementById('Flag_Activo').checked?'1':'0'
    var Flag_Stock = document.getElementById('Flag_Stock').checked?'1':'0'
    var Cod_Fabricante = document.getElementById('Cod_Fabricante').value
    var Obs_Producto = document.getElementById('Obs_Producto').value

    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            Id_Producto,
            Cod_Producto,
            Cod_Categoria,
            Cod_Marca,
            Cod_TipoProducto,
            Nom_Producto,
            Des_CortaProducto,
            Des_LargaProducto,
            Caracteristicas,
            Porcentaje_Utilidad,
            Cuenta_Contable,
            Contra_Cuenta,
            Cod_Garantia,
            Cod_TipoExistencia,
            Cod_TipoOperatividad,
            Flag_Activo,
            Flag_Stock,
            Cod_Fabricante,
            Obs_Producto,
        })
    }
    fetch(URL + 'productos_serv_api/guardar_producto', parametros)
    .then(req => req.json())
    .then(res => {
        if(res.respuesta == 'ok'){
            ListarProductosServ(_escritura)
        }else{
            ListarProductosServ(_escritura)
        }
    })
}

function ClickBuscar(ev){
    var id = ev.toElement.id
    var btnBuscar = document.getElementById('btnBuscar')
    btnBuscar.addEventListener('click', () => BusquedaCuenta(id))
    var txtBuscarCuenta = document.getElementById("txtBuscarCuenta")
    txtBuscarCuenta.addEventListener('keydown', () => BusquedaCuenta(id))
}
    

function BusquedaCuenta (id){
    var txtBuscarCuenta = document.getElementById("txtBuscarCuenta").value
    if(txtBuscarCuenta.length >= 0){
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                TextoBuscar: txtBuscarCuenta
            })
        }
        fetch(URL+'/productos_serv_api/buscar_cuenta_contable', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var cuentas = res.data.cuentas
                if(cuentas.length > 0)
                    AgregarTabla(cuentas, id)
                else  
                    empty(document.getElementById('contenedorTablaCuentas'));
            }
            else
                empty(document.getElementById('contenedorTablaCuentas'));
        })
    }else{
        empty(document.getElementById('contenedorTablaCuentas'));
    }
}

function AgregarTabla(cuentas, id){
    var el = yo`<table id="example1" class="table table-bordered table-striped">
    <thead>
        <tr>
            <th>Cuenta</th>
            <th>Descripcion Cuenta Contable</th>
            <th>Accion</th>
        </tr>
    </thead>
    <tbody>
        ${cuentas.map(u => yo`
        <tr>
            <td>${u.Cod_Usuarios}</td>
            <td>${u.Nick}</td>
            <td><button class="btn btn-xs btn-primary" data-dismiss="modal" onclick="${()=>SeleccionarUsuario(u, id)}"><i class="fa fa-check"></i> Elegir</button></td>
        </tr>`)}
    </tbody>

</table>`
    empty(document.getElementById('contenedorTablaCuentas')).appendChild(el);
}
function SeleccionarUsuario(cuenta, id){
    var Cod_Usuario = document.getElementById(id)
    Cod_Usuario.value = cuenta.Cod_Usuarios + " - " + cuenta.Nick
}


function NuevoProductoServ(_escritura, variables, producto){
    if(producto){
        console.log('Bhauc')
        console.log('Holad')
        Ver(_escritura, variables, producto)
        $(function () {
            // Replace the <textarea id="editor1"> with a CKEditor
            // instance, using default configuration.
            CKEDITOR.replace('editor1')
            //bootstrap WYSIHTML5 - text editor
            $('.textarea').wysihtml5()
          })
    }else{
        Ver(_escritura, variables)
        $(function () {
            // Replace the <textarea id="editor1"> with a CKEditor
            // instance, using default configuration.
            CKEDITOR.replace('editor1')
            //bootstrap WYSIHTML5 - text editor
            $('.textarea').wysihtml5()
          })
    }   
}

export { NuevoProductoServ }