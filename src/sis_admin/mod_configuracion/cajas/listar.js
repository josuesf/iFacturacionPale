var empty = require('empty-element');
var yo = require('yo-yo');

import {NuevaCaja} from './agregar'
import {URL} from '../../../constantes_entorno/constantes'


function Controles(escritura) {
    var controles = yo`<div><button class="btn btn-xs btn-success">Editar</button>
    <button class="btn btn-xs btn-danger">Borrar</button></div>`
    if (escritura)
        return controles
    else
        return yo`<div></div>`
}

function Ver(cajas, paginas, pagina_actual, _escritura, _sucursales) {

    var tab = yo`
    <li class=""><a href="#tab_listar_cajas_2" data-toggle="tab" aria-expanded="false" id="id_tab_listar_cajas_2">Cajas<a style="padding-left: 10px;" class="btn" onclick=${()=>CerrarTab()}><i class="fa fa-close text-danger"></i></a></a></li>`

    var el = yo`
    <div class="tab-pane" id="tab_listar_cajas_2">
        <section class="content-header">
        <div class="modal modal-danger fade" id="modal-danger-cajas" style="display: none;">
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
              <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-success" id="btnEliminar" data-dismiss="modal">Eliminar</button>
            </div>
          </div>
          <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
      </div>
           
        </section>
        <section class="content">
            <div class="card">
                <div class="card-head">
                    <header>Lista de Cajas</header>
                    <div class="tools">
                        <div class="btn-group">
                            ${_escritura ? yo`<a onclick=${()=>NuevaCaja(_escritura, _sucursales, [], [])} class="btn btn-info pull-right">
                            <i class="fa fa-plus"></i> Nueva Caja</a>`: yo``}
                        </div>
                    </div>
                </div>
                <div class="card-body">
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
                                    ${_escritura ? yo`<button class="btn btn-xs btn-success" onclick="${()=>NuevaCaja(_escritura, _sucursales, [], [], u)}"><i class="fa fa-edit"></i></button>` : yo``}
                                    ${_escritura ? yo`<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger-cajas" onclick="${()=>EliminarCaja(_escritura, u)}"><i class="fa fa-trash"></i></button>` : yo``}
                                    
                                </td>
                            </tr>`)}
                        </tbody>
                    </table>
                    </div>
                    <div class="card-actionbar">
                        <div class="card-actionbar-row">
                            <ul class="pagination pagination-sm no-margin pull-right">
                                <li>
                                    <a href="javascript:void(0);" onclick=${()=>(pagina_actual>0)?ListarCajas(_escritura,pagina_actual-1):null}>«</a>
                                </li>
                                ${((new Array(paginas)).fill(0)).map((p, i) => yo`<li class=${pagina_actual==i?'active':''}>
                                <a href="javascript:void(0);" onclick=${()=>ListarCajas(_escritura,i)}>${i + 1}</a>
                                </li>`)}
                            
                                <li>
                                    <a href="javascript:void(0);" onclick=${()=>(pagina_actual+1<paginas)?ListarCajas(_escritura,pagina_actual+1):null}>»</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>`
    //var main = document.getElementById('main-contenido');
    //empty(main).appendChild(el);
    if($("#tab_listar_cajas_2").length){  

        $('#tab_listar_cajas_2').remove()
        $('#id_tab_listar_cajas_2').parents('li').remove()

        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    }else{
        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    } 
    $("#id_tab_listar_cajas_2").click()
}

function CerrarTab(){
    $('#tab_listar_cajas_2').remove()
    $('#id_tab_listar_cajas_2').parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show'); 
}

function EliminarCaja(_escritura, caja){
    
    var btnEliminar = document.getElementById('btnEliminar')
    btnEliminar.addEventListener('click', function Eliminar(ev) {
        run_waitMe($('#main-contenido'), 3, "ios");
        var Cod_Caja = caja.Cod_Caja
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Cod_Caja,
            })
        }
        fetch(URL+'/cajas_api/eliminar_caja', parametros)
            .then(req => req.json())
            .then(res => {
                
                if (res.respuesta == 'ok') {
                    ListarCajas(_escritura)
                    this.removeEventListener('click', EliminarCaja)
                }
                else{

                    this.removeEventListener('click', EliminarCaja)
                } 
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
    })
}

function ListarCajas(escritura, NumeroPagina){
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
            ScripOrden: ' ORDER BY Cod_Caja desc',
            ScripWhere: ''
        })
    }
    fetch(URL+'/cajas_api/get_cajas', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                
                var paginas = parseInt(res.data.num_filas[0].NroFilas)

                paginas = parseInt(paginas / 20) + (paginas % 20 != 0 ? 1 : 0)

                var _sucursales = res.data.sucursales

                Ver(res.data.cajas, paginas, NumeroPagina|| 0, _escritura, _sucursales)
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

export {ListarCajas}