var empty = require('empty-element');
var yo = require('yo-yo');
import {NuevoCliente} from './agregar'

import {URL} from '../../../constantes_entorno/constantes'


function Ver(clientes, paginas,pagina_actual, _escritura,mas_variables) {
    var tab = yo`
    <li class=""><a href="#tab_listar_cliente_2" data-toggle="tab" aria-expanded="false" id="id_tab_listar_cliente_2">Clientes <a style="padding-left: 10px;" class="btn" onclick=${()=>CerrarTab()}><i class="fa fa-close text-danger"></i></a></a></li>`

    var el = yo`
    <div class="tab-pane" id="tab_listar_cliente_2">
        <section class="content-header">
        <div class="modal modal-danger fade" id="modal-danger-cliente" style="display: none;">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span></button>
              <h4 class="modal-title">¿Esta seguro que desea eliminar este cliente/proveedor?</h4>
            </div>
            <div class="modal-body">
              <p>Al eliminar el cliente no podra recuperarlo. Desea continuar de todas maneras?</p>
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
           
        </section>
        <section class="content">
            <div class="card">
                <div class="card-head">
                    <header>Lista de Cientes</header>
                    <div class="tools">
                        <div class="btn-group">
                        ${_escritura ? yo`<a onclick=${()=>NuevoCliente(_escritura, mas_variables)} class="btn btn-info pull-right">
                            <i class="fa fa-plus"></i> Nuevo Cliente/Proveedor</a>`: yo``}
                        </div>
                    </div>
                </div> 
                <div class="card-body">
                    <div class="table-responsive">
                    <table id="example1" class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Documento</th>
                                <th>Numero</th>
                                <th>Cliente</th>
                                <th>Direccion</th>
                                <th>Estado</th>
                                <th>Condicion</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${clientes.map(u => yo`
                            <tr>
                                <td>${u.Nom_TipoDoc}</td>
                                <td>${u.Nro_Documento}</td>
                                <td>${u.Cliente}</td>
                                <td>${u.Direccion}</td>
                                <td>${u.Nom_EstadoCliente}</td>
                                <td>${u.Nom_CondicionCliente}</td>
                                <td>
                                    ${_escritura ? yo`<button class="btn btn-xs btn-success" onclick="${()=>EditarCliente(_escritura,mas_variables, u.Id_ClienteProveedor)}"><i class="fa fa-edit"></i></button>` : yo``}
                                    ${_escritura ? yo`<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger-cliente" onclick="${()=>Eliminar(_escritura, u)}"><i class="fa fa-trash"></i></button>` : yo``}
                                </td>
                            </tr>`)}
                        </tbody>
    
                    </table>
                    </div>
                    <div class="card-actionbar">
                        <ul class="pagination pagination-sm no-margin pull-right">
                            <li>
                                <a href="javascript:void(0);" onclick=${()=>(pagina_actual>0)?ListarClientes(_escritura,pagina_actual-1):null}>«</a>
                            </li>
                            ${((new Array(paginas)).fill(0)).map((p, i) => yo`<li class=${pagina_actual==i?'active':''}>
                            <a href="javascript:void(0);" onclick=${()=>ListarClientes(_escritura,i)} >${i + 1}</a>
                            </li>`)}
                        
                            <li>
                                <a href="javascript:void(0);" onclick=${()=>(pagina_actual+1<paginas)?ListarClientes(_escritura,pagina_actual+1):null}>»</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    </div>`

    if($("#tab_listar_cliente_2").length){  

        $('#tab_listar_cliente_2').remove()
        $('#id_tab_listar_cliente_2').parents('li').remove()

        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    }else{
        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    } 
    $("#id_tab_listar_cliente_2").click()
    //var main = document.getElementById('main-contenido');
    //empty(main).appendChild(el);
}

function CerrarTab(){
    $('#tab_listar_cliente_2').remove()
    $('#id_tab_listar_cliente_2').parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show'); 
}

function Eliminar(_escritura, cliente){
    
    var btnEliminar = document.getElementById('btnEliminar')
    btnEliminar.addEventListener('click', function Eliminar(ev) {
        run_waitMe($('#main-contenido'), 1, "ios","Eliminando...");
        var Id_ClienteProveedor = cliente.Id_ClienteProveedor
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Id_ClienteProveedor,
            })
        }
        fetch(URL+'/clientes_api/eliminar_cliente', parametros)
            .then(req => req.json())
            .then(res => {
                
                if (res.respuesta == 'ok') {
                    ListarClientes(_escritura)
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
function EditarCliente(_escritura, mas_variables, Id_ClienteProveedor){
    run_waitMe($('#main-contenido'), 1, "ios");
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Id_ClienteProveedor,
        })
    }
    fetch(URL+'/clientes_api/get_one_cliente', parametros)
        .then(req => req.json())
        .then(res => {
            console.log("editar cliente",res)
            if (res.respuesta == 'ok') {
                NuevoCliente(_escritura,mas_variables,res.data.cliente[0])
            }
            else{
                alert('Ocurrio un error ')
            }
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
}

function ListarClientes(escritura,NumeroPagina) {
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
            ScripOrden: ' ORDER BY Cliente asc',
            ScripWhere: ''
        })
    }
    fetch(URL+'/clientes_api/get_clientes', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var paginas = parseInt(res.data.num_filas[0].NroFilas)

                paginas = parseInt(paginas / 20) + (paginas % 20 != 0 ? 1 : 0)
                var mas_variables = {
                    documentos:res.data.documentos,
                    estados:res.data.estados,
                    condiciones:res.data.condiciones,
                    tipos_clientes:res.data.tipos_clientes,
                    tipos_comprobantes:res.data.tipos_comprobantes,
                    paises:res.data.paises,
                    departamentos:res.data.departamentos,
                    formas_pago:res.data.formas_pago,
                    sexos:res.data.sexos,
                    diagramas:res.data.diagramas,
                }

                Ver(res.data.clientes, paginas,NumeroPagina||0, _escritura, mas_variables)
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

export {ListarClientes}