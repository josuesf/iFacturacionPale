var empty = require('empty-element');
var yo = require('yo-yo');

import { NuevoProductoServ } from './agregar'
import {URL} from '../../../constantes_entorno/constantes'

function Ver(variables, paginas, pagina_actual, _escritura){
    var el = yo`
    <div>
        <section class="content-header">
        <div class="modal modal-danger fade" id="modal-danger" style="display: none;">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span></button>
              <h4 class="modal-title">¿Esta seguro que desea eliminar este elemento?</h4>
            </div>
            <div class="modal-body">
              <p>Al eliminar este elemento no podra recuperarlo. Desea continuar de todas maneras?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline pull-left" data-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-outline" id="btnEliminar" data-dismiss="modal">Si, Eliminar</button>
            </div>
          </div>
          <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
      </div>
            <h1>
                Productos y Servicios
                <small>Control productos y servicios</small>
            </h1>
            <ol class="breadcrumb">
                <li>
                    <a href="#">
                        <i class="fa fa-cog"></i> Inicio</a>
                </li>
                <li class="active">Productos y servicios</li>
            </ol>
        </section>
        <section class="content">
            <div class="box">
                <div class="box-header">
                    <h3 class="box-title">Lista de Productos y Servicios</h3>
                    ${_escritura ? yo`<a onclick=${()=>NuevoProductoServ(_escritura, variables)} class="btn btn-info pull-right">
                        <i class="fa fa-plus"></i> Nuevo</a>`: yo``}
                </div>
                <!-- /.box-header -->
                <div class="box-body">
                    <div class="table-responsive">
                    <table id="example1" class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Codigo</th>
                                <th>Producto</th>
                                <th>Tipo</th>
                                <th>Categoria</th>
                                <th>Marca</th>
                                <th>Activo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${variables.productos_serv.map(u => yo`
                            <tr>
                                <td>${u.Id_Producto}</td>
                                <td>${u.Cod_Producto}</td>
                                <td>${u.Nom_Producto}</td>
                                <td>${u.Nom_TipoProducto}</td>
                                <td>${u.Des_Categoria}</td>
                                <td>${u.Nom_Marca}</td>
                                <td>${u.Flag_Activo?"Si":"No"}</td>
                                <td>
                                    ${_escritura ? yo`<button class="btn btn-xs btn-success" onclick="${()=>NuevoProductoServ(_escritura, variables, u.Id_Producto)}"><i class="fa fa-edit"></i></button>` : yo``}
                                    ${_escritura ? yo`<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger" onclick="${()=>EliminarProductoServ(_escritura, u.Id_Producto)}"><i class="fa fa-trash"></i></button>` : yo``}
                                    
                                </td>
                            </tr>`)}
                        </tbody>
    
                    </table>
                    </div>
                    <div class="box-footer clearfix">
                        <ul class="pagination pagination-sm no-margin pull-right">
                            <li>
                                <a href="#" onclick=${()=>(pagina_actual>0)?ListarProductosServ(_escritura,pagina_actual-1):null}>«</a>
                            </li>
                            ${((new Array(paginas)).fill(0)).map((p, i) => yo`<li class=${pagina_actual==i?'active':''}>
                            <a href="#" onclick=${()=>ListarProductosServ(_escritura,i)} >${i + 1}</a>
                            </li>`)}
                        
                            <li>
                                <a href="#" onclick=${()=>(pagina_actual+1<paginas)?ListarProductosServ(_escritura,pagina_actual+1):null}>»</a>
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

// function getFechaHora(str, flagfecha, flaghora){
//     var spl = str.split('T')
//     var fecha = spl[0].split('-')
//     var hora = spl[1].split(':')
//     var fechastr = fecha[2]+'/'+fecha[1]+'/'+fecha[0]
//     var horastr = hora[0]+':'+hora[1]
//     return flagfecha?fechastr+(flaghora?' '+horastr:''):flaghora?horastr:''
// }

 function EliminarProductoServ(_escritura, Id_Producto){
     var btnEliminar = document.getElementById('btnEliminar')
     btnEliminar.addEventListener('click', function del(ev){ 
        run_waitMe($('#main-contenido'), 3, "ios");
         const parametros = {
             method: 'POST',
             headers: {
                 Accept: 'application/json',
                 'Content-Type': 'application/json',
             },
             body: JSON.stringify({
                Id_Producto
             })
         }
         fetch(URL+'/productos_serv_api/eliminar_producto', parametros)
             .then(req => req.json())
             .then(res => {
                ListarProductosServ(_escritura,0)
                this.removeEventListener('click', del)
                $('#main-contenido').waitMe('hide');
             }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
     })
}

function ListarProductosServ(escritura,NumeroPagina) {
    run_waitMe($('#main-contenido'), 3, "ios");
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
            ScripOrden: ' ORDER BY Nom_Producto asc',
            ScripWhere: '',
            Cod_Tabla: 'PRI_PRODUCTOS'
        })
    }
    fetch(URL+'/productos_serv_api/get_productos_serv', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var paginas = parseInt(res.data.num_filas[0].NroFilas)
                paginas = parseInt(paginas / 20) + (paginas % 20 != 0 ? 1 : 0)
                Ver(res.data, paginas,NumeroPagina||0, _escritura)
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

export {ListarProductosServ}