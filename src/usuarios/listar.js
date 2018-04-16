var empty = require('empty-element');
var yo = require('yo-yo');
var NuevoUsuario = require('./agregar.js')

function Controles(escritura) {
    var controles = yo`<div><button class="btn btn-xs btn-success">Editar</button>
    <button class="btn btn-xs btn-danger">Borrar</button></div>`
    if (escritura)
        return controles
    else
        return yo`<div></div>`
}

function Ver(usuarios, paginas, _escritura, _estados, _perfiles) {
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
                Usuarios
                <small>Control usuarios</small>
            </h1>
            <ol class="breadcrumb">
                <li>
                    <a href="#">
                        <i class="fa fa-cog"></i> Configuracion</a>
                </li>
                <li class="active">Usuarios</li>
            </ol>
        </section>
        <section class="content">
            <div class="box">
                <div class="box-header">
                    <h3 class="box-title">Lista de Usuarios</h3>
                    ${_escritura ? yo`<a onclick=${()=>NuevoUsuario(_escritura, _estados, _perfiles)} class="btn btn-info pull-right">
                        <i class="fa fa-plus"></i> Nuevo Usuario</a>`: yo``}
                </div>
                <!-- /.box-header -->
                <div class="box-body">
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

function EliminarUsuario(_escritura, usuario){
    var btnEliminar = document.getElementById('btnEliminar')
    btnEliminar.addEventListener('click', function Eliminar(ev) {
        var Cod_Usuarios = usuario.Cod_Usuarios
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Cod_Usuarios,
            })
        }
        fetch('/usuarios_api/eliminar_usuario', parametros)
            .then(req => req.json())
            .then(res => {
                if (res.respuesta == 'ok') {
                    Listar(_escritura)
                    this.removeEventListener('click', Eliminar)
                }
                else{

                    console.log('Error')
                    this.removeEventListener('click', Eliminar)
                }
            })
    })
}

function Listar(escritura) {
    $(".fakeloader").fakeLoader({
        timeToHide:2000,
        spinner:"spinner6",
        bgColor:"#333"
    });
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
            ScripOrden: ' ORDER BY Cod_Usuarios asc',
            ScripWhere: ''
        })
    }
    fetch('/usuarios_api/get_usuarios', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var paginas = parseInt(res.data.num_filas[0].NroFilas)

                paginas = parseInt(paginas / 20) + (paginas % 20 != 0 ? 1 : 0)

                var _perfiles = res.data.perfiles
                var _estados = res.data.estados

                Ver(res.data.usuarios, paginas, _escritura, _estados, _perfiles)
            }
            else
                Ver([])
        })
}


export {Listar}