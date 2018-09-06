var empty = require('empty-element');
var yo = require('yo-yo');
var NuevaSucursal = require('./agregar.js')

import {URL} from '../../../constantes_entorno/constantes'


function Ver(sucursales, paginas,pagina_actual, _escritura) {
    var el = yo`
    <div>
        <section class="content-header">
        <div class="modal modal-danger fade" id="modal-danger" style="display: none;">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span></button>
              <h4 class="modal-title">¿Esta seguro que desea eliminar esta sucursal?</h4>
            </div>
            <div class="modal-body">
              <p>Al eliminar la sucursal no podra recuperarlo. Desea continuar de todas maneras?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-success" id="btnEliminar" data-dismiss="modal">Si,Eliminar</button>
            </div>
          </div>
          <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
      </div>
            <h1>
                Sucursales
                <small>Control sucursales</small>
            </h1>
            <ol class="breadcrumb">
                <li>
                    <a href="#">
                        <i class="fa fa-cog"></i> Configuracion</a>
                </li>
                <li class="active">Sucursales</li>
            </ol>
        </section>
        <section class="content">
            <div class="card">
                <div class="card-head">
                    <header>
                    Lista de Sucursales
                    </header>
                    <div class="tools">
                        <div class="btn-group">
                        ${_escritura ? yo`<a onclick=${()=>NuevaSucursal(_escritura)} class="btn btn-info pull-right">
                        <i class="fa fa-plus"></i> Nueva Sucursal</a>`: yo``}
                        </div>
                    </div>  
                </div>
                <!-- /.box-header -->
                <div class="card-body">
                    <div class="table-responsive">
                    <table id="example1" class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Codigo</th>
                                <th>Sucursal</th>
                                <th>Direccion</th>
                                <th>Administrador</th>
                                <th>Util. Max</th>
                                <th>Util. Min</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sucursales.map(u => yo`
                            <tr>
                                <td>${u.Cod_Sucursal}</td>
                                <td>${u.Nom_Sucursal}</td>
                                <td>${u.Dir_Sucursal}</td>
                                <td>${u.Cod_UsuarioAdmin}</td>
                                <td>${u.Por_UtilidadMax.toFixed(2)}</td>
                                <td>${u.Por_UtilidadMin.toFixed(2)}</td>
                                <td>
                                    ${_escritura ? yo`<button class="btn btn-xs btn-success" onclick="${()=>NuevaSucursal(_escritura, u)}"><i class="fa fa-edit"></i></button>` : yo``}
                                    ${_escritura ? yo`<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger" onclick="${()=>Eliminar(_escritura, u)}"><i class="fa fa-trash"></i></button>` : yo``}
                                    
                                </td>
                            </tr>`)}
                        </tbody>
    
                    </table>
                    </div>
                    <div class="card-actionbar">
                        <ul class="pagination pagination-sm no-margin pull-right">
                            <li>
                                <a href="#" onclick=${()=>(pagina_actual>0)?ListarSucursales(_escritura,pagina_actual-1):null}>«</a>
                            </li>
                            ${((new Array(paginas)).fill(0)).map((p, i) => yo`<li class=${pagina_actual==i?'active':''}>
                            <a href="#" onclick=${()=>ListarSucursales(_escritura,i)} >${i + 1}</a>
                            </li>`)}
                        
                            <li>
                                <a href="#" onclick=${()=>(pagina_actual+1<paginas)?ListarSucursales(_escritura,pagina_actual+1):null}>»</a>
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

function Eliminar(_escritura, sucursal){
    
    var btnEliminar = document.getElementById('btnEliminar')
    btnEliminar.addEventListener('click', function Eliminar(ev) {
        run_waitMe($('#main-contenido'), 1, "ios","Eliminando sucursal...");
        var Cod_Sucursal = sucursal.Cod_Sucursal
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Cod_Sucursal,
            })
        }
        fetch(URL+'/sucursales_api/eliminar_sucursal', parametros)
            .then(req => req.json())
            .then(res => {
                
                if (res.respuesta == 'ok') {
                    ListarSucursales(_escritura)
                    this.removeEventListener('click', Eliminar)
                }
                else{
                    console.log('Error')
                    this.removeEventListener('click', Eliminar)
                }
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
    })
}

function ListarSucursales(escritura,NumeroPagina) {
    run_waitMe($('#main-contenido'), 1, "ios");
    var _escritura=escritura;
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            TamanoPagina: '20',
            NumeroPagina: NumeroPagina||'0',
            ScripOrden: ' ORDER BY Cod_Sucursal desc',
            ScripWhere: ''
        })
    }
    fetch(URL+'/sucursales_api/get_sucursales', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var paginas = parseInt(res.data.num_filas[0].NroFilas)

                paginas = parseInt(paginas / 20) + (paginas % 20 != 0 ? 1 : 0)

                Ver(res.data.sucursales, paginas,NumeroPagina||0, _escritura)
            }
            else
                Ver([])
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
}

export {ListarSucursales}