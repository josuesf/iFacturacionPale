var empty = require('empty-element');
var yo = require('yo-yo');

import {ListarSucursales} from './listar';


module.exports = function NuevaSucursal(_escritura, sucursal) {

    var el = yo`
    <div>
        <section class="content-header">
            <h1>
                Sucursales
                <small>Control sucursales</small>
            </h1>
            <ol class="breadcrumb">
                <li>
                    <a href="#">
                        <i class="fa fa-cog"></i> Configuracion</a>
                </li>
                <li><a  onclick=${()=>ListarSucursales(_escritura)} href="#">
                Sucursales</a></li>
                <li class="active">${sucursal?'Editar':'Nuevo'}</li>
            </ol>
        </section>
        <section class="content">
            <div class="box">
                <div class="box-header">
                    <a onclick=${()=>ListarSucursales(_escritura)}
                    class="btn btn-xs btn-warning">
                        <i class="fa fa-arrow-left"></i> Atras</a>
                    
                    
                </div>
                <!-- /.box-header -->
                <div class="box-body">
                    <div class="box box-primary">
                        <div class="box-header with-border">
                            <h3 class="box-title">${sucursal?'Editar':'Nueva'} Sucursal</h3>
                        </div>
                        <!-- /.box-header -->
                        <!-- form start -->
                        <form role="form">
                            <div class="box-body">
                                <div class="row">
                                    ${sucursal? yo``:yo`<div class="col-sm-6">
                                    <div class="form-group">
                                        <label for="Cod_Sucursal">Codigo de Sucursal</label>
                                        <input type="text" style="text-transform:uppercase" class="form-control" id="Cod_Sucursal" placeholder="Codigo sucursal" >
                                    </div>
                                </div>`}
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Flag_Activo"></label>
                                            <div class="checkbox">
                                                <label>
                                                    <input type="checkbox" id="Flag_Activo" checked="${sucursal ? sucursal.Flag_Activo : 0}"> Es Activo?
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Nom_Sucursal">Nombre de la Sucursal</label>
                                            <input type="text" style="text-transform:uppercase" class="form-control" id="Nom_Sucursal" placeholder="Nombre de la sucursal" value="${sucursal?sucursal.Nom_Sucursal:''}">
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Dir_Sucursal">Direccion fiscal de sucursal</label>
                                            <input type="text" style="text-transform:uppercase" class="form-control" id="Dir_Sucursal" placeholder="Ejem: Calle..." value="${sucursal?sucursal.Dir_Sucursal:''}">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Por_UtilidadMax">% Utilidad Maxima</label>
                                            <input type="number" class="form-control" id="Por_UtilidadMax" placeholder="0,5,10,20" value="${sucursal?sucursal.Por_UtilidadMax:''}">
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Por_UtilidadMin">% Utilidad Minima </label>
                                            <input type="number" class="form-control" id="Por_UtilidadMin" placeholder="Ejem: 0,5,10,20" value="${sucursal?sucursal.Por_UtilidadMin:''}">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Cabecera_Pagina">Cabecera de Documento</label>
                                            <textarea type="number" class="form-control" id="Cabecera_Pagina" placeholder="Ejem: www.miempresa.com" value="${sucursal?sucursal.Cabecera_Pagina:''}"></textarea>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Pie_Pagina">Pie de Documento </label>
                                            <textarea type="number" class="form-control" id="Pie_Pagina" placeholder="Ejem: Gracias por su compra" value="${sucursal?sucursal.Pie_Pagina:''}"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- /.box-body -->
                
                            
                        </form>
                        <div class="box-footer">
                                <button onclick="${() => Guardar(_escritura, sucursal)}" class="btn btn-primary">Guardar</button>
                            </div>
                    </div>
                </div>
            </div>
        </section>
    </div>`
    var main = document.getElementById('main-contenido');
    empty(main).appendChild(el);
}

function Guardar(_escritura, sucursal){
    //console.log(document.getElementById('Cod_Usuarios').value.toUpperCase())
    H5_loading.show();
    var Cod_Modulo = sucursal?sucursal.Cod_Modulo:document.getElementById('Cod_Modulo').value.toUpperCase()
    var Des_Modulo = document.getElementById('Des_Modulo').value.toUpperCase()
    var Padre_Modulo = document.getElementById('Padre_Modulo').value
    var Cod_Usuario = 'ADMINISTRADOR'

    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Cod_Modulo,
            Des_Modulo,
            Padre_Modulo,
            Cod_Usuario
        })
    }
    fetch('/modulos_api/guardar_modulo', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                ListarSucursales(_escritura)
                
            }
            else{
                console.log('Error')
            }
            H5_loading.hide()
        })
}