var empty = require('empty-element');
var yo = require('yo-yo');

import {NuevaCaja} from './agregar'


function Controles(escritura) {
    var controles = yo`<div><button class="btn btn-xs btn-success">Editar</button>
    <button class="btn btn-xs btn-danger">Borrar</button></div>`
    if (escritura)
        return controles
    else
        return yo`<div></div>`
}

function Ver(cajas, paginas, _escritura, _sucursales) {
    var el = yo`
    <div>
        <section class="content-header">
        <div class="modal modal-danger fade" id="modal-danger" style="display: none;">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span></button>
              <h4 class="modal-title">¿Esta seguro que desea eliminar este usuario?</h4>
            </div>
            <div class="modal-body">
              <p>Al eliminar el usuario se perderan todos los datos.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline pull-left" data-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-outline" id="btnEliminar" data-dismiss="modal">Eliminar</button>
            </div>
          </div>
          <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
      </div>
            <h1>
                Cajas
                <small>Control cajas</small>
            </h1>
            <ol class="breadcrumb">
                <li>
                    <a href="#">
                        <i class="fa fa-cog"></i> Configuracion</a>
                </li>
                <li class="active">Cajas</li>
            </ol>
        </section>
        <section class="content">
            <div class="box">
                <div class="box-header">
                    <h3 class="box-title">Lista de Cajas</h3>
                    ${_escritura ? yo`<a onclick=${()=>NuevoUsuario(_escritura, _sucursales)} class="btn btn-info pull-right">
                        <i class="fa fa-plus"></i> Nueva Caja</a>`: yo``}
                </div>
                <!-- /.box-header -->
                <div class="box-body">
                    <div class="table-responsive">
                    <table id="example1" class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Codigo</th>
                                <th>Caja</th>
                                <th>Sucursal</th>
                                <th>Responsable</th>
                                <th>Cuenta Contable</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${cajas.map(u => yo`
                            <tr>
                                <td>${u.Cod_Caja}</td>
                                <td>${u.Des_Caja}</td>
                                <td>${u.Cod_Sucursal}</td>
                                <td>${u.Cod_UsuarioCajero}</td>
                                <td>${u.Cod_CuentaContable}</td>
                                <td>
                                    ${_escritura ? yo`<button class="btn btn-xs btn-success" "><i class="fa fa-edit"></i></button>` : yo``}
                                    ${_escritura ? yo`<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger" ><i class="fa fa-trash"></i></button>` : yo``}
                                    
                                </td>
                            </tr>`)}
                        </tbody>
                    </table>
                    </div>
                    <div class="box-footer clearfix">
                        <ul class="pagination pagination-sm no-margin pull-right">
                            <li>
                                <a href="#">«</a>
                            </li>
                            ${((new Array(paginas)).fill(0)).map((p, i) => yo`<li>
                            <a href="#">${i + 1}</a>
                            </li>`)}
                        
                            <li>
                                <a href="#">»</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    </div>`
    var main = document.getElementById('main-contenido');
    empty(main).appendChild(el);
}

function ListarCajas(escritura){
    H5_loading.show();
    var _escritura=escritura;
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            TamanoPagina: '20',
            NumeroPagina: '0',
            ScripOrden: ' ORDER BY Cod_Caja desc',
            ScripWhere: ''
        })
    }
    fetch('/cajas_api/get_cajas', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                console.log(res.data.cajas)
                
                var paginas = parseInt(res.data.num_filas[0].NroFilas)

                paginas = parseInt(paginas / 20) + (paginas % 20 != 0 ? 1 : 0)

                var _sucursales = res.data.sucursales

                Ver(res.data.cajas, paginas, _escritura, _sucursales)
            }
            else
                Ver([])
            H5_loading.hide()
        })
}

export {ListarCajas}