var empty = require('empty-element');
var yo = require('yo-yo');
var NuevoParametro = require('./agregar.js')
import {URL} from '../../../constantes_entorno/constantes'


function Ver(parametros, paginas,pagina_actual, _escritura) {

    var tab = yo`
    <li class=""><a href="#tab_listar_parametros_2" data-toggle="tab" aria-expanded="false" id="id_tab_listar_parametros_2">Parametros<a style="padding-left: 10px;" class="btn" onclick=${()=>CerrarTab()}><i class="fa fa-close text-danger"></i></a></a></li>`


    var el = yo`
    <div class="tab-pane" id="tab_listar_parametros_2">
        <section class="content-header">
        <div class="modal modal-danger fade" id="modal-danger-parametros" style="display: none;">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span></button>
              <h4 class="modal-title">¿Esta seguro que desea eliminar este parametro?</h4>
            </div>
            <div class="modal-body">
              <p>Al eliminar este parametro no podra recuperarlo. Desea continuar de todas maneras?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-success" id="btnEliminar" data-dismiss="modal">Si, Eliminar</button>
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
                    <header>Lista de Parametros</header>
                    
                </div>
                
                <div class="card-body">
                    <div class="table-responsive">
                    <table id="example1" class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Codigo</th>
                                <th>Tabla</th>
                                <th>Descripcion</th> 
                                <th>Acceso</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${parametros.map(u => yo`
                            <tr>
                                <td>${u.Cod_Tabla}</td>
                                <td>${u.Tabla}</td>
                                <td>${u.Des_Tabla}</td> 
                                <td>  
                                    <i class=${u.Flag_Acceso?"fa fa-check text-success":"md md-block text-danger"}></i>
                                 </td>
                                <td>
                                    ${_escritura ? yo`<button class="btn btn-xs btn-success" onclick="${()=>NuevoParametro(_escritura, u)}"><i class="fa fa-edit"></i></button>` : yo``} 
                                </td>
                            </tr>`)}
                        </tbody>
    
                    </table>
                    </div>
                    <div class="card-actionbar clearfix">
                        <ul class="pagination pagination-sm no-margin pull-right">
                            <li>
                                <a href="javascript:void(0);" onclick=${()=>(pagina_actual>0)?ListarParametros(_escritura,pagina_actual-1):null}>«</a>
                            </li>
                            ${((new Array(paginas)).fill(0)).map((p, i) => yo`<li class=${pagina_actual==i?'active':''}>
                            <a href="javascript:void(0);" onclick=${()=>ListarParametros(_escritura,i)} >${i + 1}</a>
                            </li>`)}
                        
                            <li>
                                <a href="javascript:void(0);" onclick=${()=>(pagina_actual+1<paginas)?ListarParametros(_escritura,pagina_actual+1):null}>»</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    </div>`
    //var main = document.getElementById('main-contenido');
    //empty(main).appendChild(el);
    if($("#tab_listar_parametros_2").length){  

        $('#tab_listar_parametros_2').remove()
        $('#id_tab_listar_parametros_2').parents('li').remove()

        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    }else{
        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    } 
    $("#id_tab_listar_parametros_2").click()
}

function CerrarTab(){
    $('#tab_listar_parametros_2').remove()
    $('#id_tab_listar_parametros_2').parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show'); 
}


function Eliminar(_escritura, sucursal){
    
    var btnEliminar = document.getElementById('btnEliminar')
    btnEliminar.addEventListener('click', function Eliminar(ev) {
        run_waitMe($('#main-contenido'), 1, "ios","Eliminando parametro...");
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

function ListarParametros(escritura,NumeroPagina) {
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
            ScripOrden: ' ORDER BY Cod_Tabla desc',
            ScripWhere: ''
        })
    }
    fetch(URL+'/parametros_api/get_parametros', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var paginas = parseInt(res.data.num_filas[0].NroFilas)

                paginas = parseInt(paginas / 20) + (paginas % 20 != 0 ? 1 : 0)
                Ver(res.data.parametros, paginas,NumeroPagina||0, _escritura)
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

export {ListarParametros}