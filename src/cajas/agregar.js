var empty = require('empty-element');
var yo = require('yo-yo');
import { ListarCajas } from './listar'

function Ver(_escritura, sucursales, usuarios, cuentas_contables, caja, documentos, productos) {

    var el = yo`
    <div>
        <section class="content-header">
            <h1>
                Cajas
                <small>Control cajas</small>
            </h1>
            <ol class="breadcrumb">
                <li>
                    <a href="#">
                        <i class="fa fa-cog"></i> Configuracion</a>
                </li>
                <li><a  onclick=${() => ListarCajas(_escritura)} href="#">
                Cajas</a></li>
                <li class="active">${caja ? 'Editar' : 'Nuevo'}</li>
            </ol>
        </section>
        <section class="content">
            <div class="box">
                <div class="box-header">
                    <a onclick=${() => ListarCajas(_escritura)}
                    class="btn btn-xs btn-warning">
                        <i class="fa fa-arrow-left"></i> Atras</a>
                    
                    
                </div>
                <!-- /.box-header -->
                <div class="box-body">
                    <div class="box box-primary">
                        <div class="box-header with-border">
                            <h3 class="box-title">Nueva Caja</h3>
                        </div>
                        <!-- form start -->
                        <form role="form">
                            <div class="box-body">
                                <div class="row">
                                    ${caja ? yo`` : yo`<div class="col-sm-6">
                                    <div class="form-group">
                                        <label for="Cod_Caja">Codigo Caja</label>
                                        <input type="text" style="text-transform:uppercase" class="form-control" id="Cod_Caja" placeholder="Ingrese codigo caja" >
                                    </div>
                                </div>`}
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Flag_Activo"></label>
                                            
                                            <div class="checkbox">
                                                <label>
                                                    <input type="checkbox" id="Flag_Activo" checked="${caja ? caja.Flag_Activo : 0}"> Es Activo?
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Des_Caja">Nombre de la Caja</label>
                                            <input type="text"  style="text-transform:uppercase" class="form-control" id="Des_Caja" placeholder="Ingrese Nombre de caja" value="${caja ? caja.Des_Caja : ''}">
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Cod_Sucursal">Sucursal a la que pertence</label>
                                            <select id="Cod_Sucursal" class="form-control">
                                                ${sucursales.map(e => yo`<option style="text-transform:uppercase" value="${e}" ${caja ? caja.Cod_Sucursal == e ? 'selected' : '' : ''}>${e}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Cod_UsuarioCajero">Usuario o vendedor responsable</label>
                                            <select id="Cod_UsuarioCajero" class="form-control select2">
                                                ${sucursales.map(e => yo`<option style="text-transform:uppercase" value="${e}" ${caja ? caja.Cod_Sucursal == e ? 'selected' : '' : ''}>${e}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Cod_CuentaContable">Cuenta Contable</label>
                                            <select id="Cod_CuentaContable" class="form-control select2">
                                                ${sucursales.map(e => yo`<option style="text-transform:uppercase" value="${e.Cod_CuentaContable}" ${caja ? caja.Cod_Sucursal == e ? 'selected' : '' : ''}>${e}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                ${caja != undefined ? yo`
                                    <div class="row">
                                            <div class="col-sm-12">
                                                <div class="nav-tabs-custom">
                                                    <ul class="nav nav-tabs">
                                                        <li class="active">
                                                            <a href="#tab_1" data-toggle="tab" aria-expanded="true">
                                                                <i class="fa fa-file"></i> Documentos Relacionados</a>
                                                        </li>
                                                        <li class="">
                                                            <a href="#tab_2" data-toggle="tab" aria-expanded="false">
                                                                <i class="fa fa-star"></i> Productos Favoritos</a>
                                                        </li>
                                                        <li class="dropdown">
                                                            <a class="dropdown-toggle" data-toggle="dropdown" href="#" aria-expanded="false">
                                                                Acciones
                                                                <span class="caret"></span>
                                                            </a>
                                                            <ul class="dropdown-menu">
                                                                <li role="presentation">
                                                                    <a role="menuitem" tabindex="-1" href="#">Nuevo Documento</a>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                    <div class="tab-content">
                                                        <div class="tab-pane active" id="tab_1">
                                                            <div class="table-responsive">
                                                                <table class="table table-bordered table-striped">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Item</th>
                                                                            <th>Documento</th>
                                                                            <th>Serie</th>
                                                                            <th>Impresora</th>
                                                                            <th>Imprimir</th>
                                                                            <th>Nombre Archivo</th>
                                                                            <th>Rapida</th>
                                                                            <th>Ticketera</th>
                                                                            <th>Acciones</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        ${documentos.map(u => yo`
                                                                        <tr>
                                                                            <td>${u.Item}</td>
                                                                            <td>${u.Nom_TipoComprobante}</td>
                                                                            <td>${u.Serie}</td>
                                                                            <td>${u.Impresora}</td>
                                                                            <td>${u.Flag_Imprimir}</td>
                                                                            <td>${u.Nom_Archivo}</td>
                                                                            <td>${u.Flag_FacRapida}</td>
                                                                            <td>${u.Nro_SerieTicketera}</td>
                                                                            <td>
                                                                                ${_escritura ? yo`<button class="btn btn-xs btn-success" onclick="${()=>NuevoUsuario(_escritura, _estados, _perfiles, u)}"><i class="fa fa-edit"></i></button>` : yo``}
                                                                                ${_escritura ? yo`<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger" onclick="${()=>EliminarUsuario(_escritura, u)}"><i class="fa fa-trash"></i></button>` : yo``}
                                                                                
                                                                            </td>
                                                                        </tr>`)}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                        <!-- /.tab-pane -->
                                                        <div class="tab-pane" id="tab_2">
                                                            <div class="table-responsive">
                                                                <table class="table table-bordered table-striped">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Producto</th>
                                                                            <th>Almacen</th>
                                                                            <th>Unidad Medida</th>
                                                                            <th>Precio</th>
                                                                            <th>Stock</th>
                                                                            <th>Acciones</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        ${productos.map(u => yo`
                                                                        <tr>
                                                                            <td>${u.Nom_Producto}</td>
                                                                            <td>${u.Des_Almacen}</td>
                                                                            <td>${u.Nom_UnidadMedida}</td>
                                                                            <td>${u.Valor}</td>
                                                                            <td>${u.Stock_Act}</td>
                                                                            <td>
                                                                                ${_escritura ? yo`<button class="btn btn-xs btn-success" onclick="${()=>NuevoUsuario(_escritura, _estados, _perfiles, u)}"><i class="fa fa-edit"></i></button>` : yo``}
                                                                                ${_escritura ? yo`<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger" onclick="${()=>EliminarUsuario(_escritura, u)}"><i class="fa fa-trash"></i></button>` : yo``}
                                                                                
                                                                            </td>
                                                                        </tr>`)}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <!-- /.tab-content -->
                                                </div>
                                            </div>
                                        
                                        </div>    
                                    `: yo``}
                                
                            </div>
                            <!-- /.box-body -->
                
                            
                        </form>
                        <div class="box-footer">
                                <button onclick="${() => Guardar(_escritura, caja)}" class="btn btn-primary">Guardar</button>
                            </div>
                    </div>
                </div>
            </div>
        </section>
    </div>`
    var main = document.getElementById('main-contenido');
    empty(main).appendChild(el);
    // $('.select2').select2();
}

function Guardar(_escritura, caja) {
    //console.log(document.getElementById('Cod_Usuarios').value.toUpperCase())
    var Cod_Usuarios = caja ? caja.Cod_Usuarios : document.getElementById('Cod_Usuarios').value.toUpperCase()
    var Nick = document.getElementById('Nick').value.toUpperCase()
    var Contrasena = document.getElementById('Contrasena').value
    var Pregunta = document.getElementById('Pregunta').value.toUpperCase()
    var Respuesta = document.getElementById('Respuesta').value.toUpperCase()
    var Cod_Estado = document.getElementById('Cod_Estado').value.toUpperCase()
    var Cod_Perfil = document.getElementById('Cod_Perfil').value.toUpperCase()
    var Imagen = document.getElementById('Imagen').value
    var Cod_Usuario = 'ADMINISTRADOR'

    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Cod_Usuarios,
            Nick,
            Contrasena,
            Pregunta,
            Respuesta,
            Cod_Estado,
            Cod_Perfil,
            Cod_Usuario
        })
    }
    fetch('/usuarios_api/guardar_usuario', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                ListarCajas(_escritura)

            }
            else {
                console.log('Error')
            }
        })
}

function NuevaCaja(_escritura, sucursales, usuarios, cuentas_contables, caja) {
    H5_loading.show();
    if (caja != undefined) {
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Cod_Caja:caja.Cod_Caja })
        }
        fetch('/cajas_api/get_documents_by_caja', parametros)
            .then(req => req.json())
            .then(res => {
                if (res.respuesta == 'ok') {
                    Ver(_escritura, sucursales, usuarios, cuentas_contables, caja, res.data.documentos, res.data.productos)
                }
                else {
                    console.log('Error')
                }
                H5_loading.hide();
            })
    } else Ver(_escritura, sucursales, usuarios, cuentas_contables, caja, [], [])
}
export { NuevaCaja }