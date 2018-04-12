var yo = require('yo-yo')

module.exports = function (usuarios) {
    var el = yo`<div>
    <section class="content-header">
    <h1>
    Usuarios
    <small>Control usuarios</small>
    </h1>
    <ol class="breadcrumb">
    <li><a href="#"><i class="fa fa-cog"></i> Configuracion</a></li>
    <li class="active">Usuarios</li>
    </ol>
    </section>
    <section class="content">
    <div class="box">
    <div class="box-header">
    <h3 class="box-title">Lista de Usuarios</h3>
    </div>
    <!-- /.box-header -->
    <div class="box-body">
    <table id="example1" class="table table-bordered table-striped">
        <thead>
        <tr>
        <th>Codigo</th>
        <th>Pregunta</th>
        <th>Perfil</th>
        <th>Conectada</th>
        </tr>
        </thead>
        <tbody>
            ${usuarios.map(u=>yo`<tr>
            <td>${u.Cod_Usuarios}</td>
            <td>${u.Pregunta}</td>
            <td>${u.Cod_Perfil}</td>
            <td>${u.Cod_Estado}</td></tr>`)}
        </tbody>
        
    </table>
    <div class="box-footer clearfix">
        <ul class="pagination pagination-sm no-margin pull-right">
                    <li><a href="#">«</a></li>
                    <li><a href="#">1</a></li>
                    <li><a href="#">2</a></li>
                    <li><a href="#">3</a></li>
                    <li><a href="#">»</a></li>
                </ul>
        </div>
    </div>
    </div>
    </section>
    </div>`

    return el;
}
