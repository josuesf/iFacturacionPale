var empty = require('empty-element');
var yo = require('yo-yo');
import {NuevoUsuario} from './agregar.js'
import {URL} from '../../../constantes_entorno/constantes'

function Controles(escritura) {
    var controles = yo`<div><button class="btn btn-xs btn-success">Editar</button>
    <button class="btn btn-xs btn-danger">Borrar</button></div>`
    if (escritura)
        return controles
    else
        return yo`<div></div>`
}

function Ver(usuarios, paginas, pagina_actual, _escritura, _estados, _perfiles) {

    var tab = yo`
    <li class=""><a href="#tab_listar_usuarios_2" data-toggle="tab" aria-expanded="false" id="id_tab_listar_usuarios_2">Usuarios<a style="padding-left: 10px;" class="btn" onclick=${()=>CerrarTab()}><i class="fa fa-close text-danger"></i></a></a></li>`



    var el = yo`
    <div  class="tab-pane" id="tab_listar_usuarios_2">
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
                    <header>Lista de Usuarios</header>
                    <div class="tools">
                        <div class="btn-group">
                        ${_escritura ? yo`<a onclick=${()=>NuevoUsuario(_escritura, _estados, _perfiles)} class="btn btn-info pull-right">
                            <i class="fa fa-plus"></i> Nuevo Usuario</a>`: yo``}
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                    <table id="example1" class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Codigo</th>
                                <th>Pregunta</th>
                                <th>Perfil</th>
                                <th>Conectada</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${usuarios.map(u => yo`
                            <tr>
                                <td>${u.Cod_Usuarios}</td>
                                <td>${u.Pregunta}</td>
                                <td>${u.Cod_Perfil}</td>
                                <td>${u.Cod_Estado}</td>
                                <td>
                                    ${_escritura ? yo`<button class="btn btn-xs btn-success" onclick="${()=>NuevoUsuario(_escritura, _estados, _perfiles, u)}"><i class="fa fa-edit"></i></button>` : yo``}
                                    ${_escritura ? yo`<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger" onclick="${()=>EliminarUsuario(_escritura, u)}"><i class="fa fa-trash"></i></button>` : yo``}
                                    
                                </td>
                            </tr>`)}
                        </tbody>
    
                    </table>
                    </div>
                    <div class="card-actionbar">
                        <ul class="pagination pagination-sm no-margin pull-right">
                            <li>
                                <a href="javascript:void(0);" onclick=${()=>(pagina_actual>0)?ListarUsuarios(_escritura,pagina_actual-1):null}>«</a>
                            </li>
                            ${((new Array(paginas)).fill(0)).map((p, i) => yo`<li class=${pagina_actual==i?'active':''}>
                            <a href="javascript:void(0);" onclick=${()=>ListarUsuarios(_escritura,i)} >${i + 1}</a>
                            </li>`)}
                        
                            <li>
                                <a href="javascript:void(0);" onclick=${()=>(pagina_actual+1<paginas)?ListarUsuarios(_escritura,pagina_actual+1):null}>»</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    </div>`
    //var main = document.getElementById('main-contenido');
    //empty(main).appendChild(el);
    if($("#tab_listar_usuarios_2").length){  

        $('#tab_listar_usuarios_2').remove()
        $('#id_tab_listar_usuarios_2').parents('li').remove()

        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    }else{
        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    } 
    $("#id_tab_listar_usuarios_2").click()
}


function CerrarTab(){
    $('#tab_listar_usuarios_2').remove()
    $('#id_tab_listar_usuarios_2').parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show'); 
}

function EliminarUsuario(_escritura, usuario){
    
    var btnEliminar = document.getElementById('btnEliminar')
    btnEliminar.addEventListener('click', function Eliminar(ev) {
        run_waitMe($('#main-contenido'), 1, "ios","Eliminando usuario...");
        var Cod_Usuarios = usuario.Cod_Usuarios
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                Cod_Usuarios,
            })
        }
        fetch(URL+'/usuarios_api/eliminar_usuario', parametros)
            .then(req => req.json())
            .then(res => {
                
                if (res.respuesta == 'ok') {
                    ListarUsuarios(_escritura)
                    this.removeEventListener('click', Eliminar)
                }
                else{

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

function ListarUsuarios(escritura, NumeroPagina) {
    run_waitMe($('#main-contenido'), 1, "ios");
    var _escritura=escritura;
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            TamanoPagina: '20',
            NumeroPagina: NumeroPagina||'0',
            ScripOrden: ' ORDER BY Cod_Usuarios asc',
            ScripWhere: ''
        })
    }
    fetch(URL+'/usuarios_api/get_usuarios', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var paginas = parseInt(res.data.num_filas[0].NroFilas)

                paginas = parseInt(paginas / 20) + (paginas % 20 != 0 ? 1 : 0)

                var _perfiles = res.data.perfiles
                var _estados = res.data.estados

                Ver(res.data.usuarios, paginas, NumeroPagina||0, _escritura, _estados, _perfiles)
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


export {ListarUsuarios}