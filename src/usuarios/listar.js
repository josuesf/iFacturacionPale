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

function Ver(usuarios, paginas, escritura, _estados, _perfiles) {
    var el = yo`
    <div>
        <section class="content-header">
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
                    ${escritura ? yo`<a onclick=${()=>NuevoUsuario(escritura, _estados, _perfiles)} class="btn btn-info pull-right">
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
                                    ${escritura ? yo`<button class="btn btn-xs btn-success" onclick="${()=>NuevoUsuario(escritura, _estados, _perfiles, u)}"><i class="fa fa-edit"></i></button>` : yo``}
                                    ${escritura ? yo`<button class="btn btn-xs btn-danger"><i class="fa fa-trash"></i></button>` : yo``}
                                    
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

module.exports = function Listar(escritura) {
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

                Ver(res.data.usuarios, paginas, escritura, _estados, _perfiles)
            }
            else
                Ver([])
        })
}


