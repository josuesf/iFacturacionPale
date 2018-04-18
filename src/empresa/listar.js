var empty = require('empty-element');
var yo = require('yo-yo');
import {URL} from '../constantes_entorno/constantes'


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
              <h4 class="modal-title">¿Esta seguro que desea guardar esta informacion?</h4>
            </div>
            <div class="modal-body">
              <p>Continuar de todas maneras?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline pull-left" data-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-outline" id="btnEliminar" data-dismiss="modal">Si, Guardar</button>
            </div>
          </div>
          <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
      </div>
            <h1>
                Empresa
                <small>Control de empresa</small>
            </h1>
            <ol class="breadcrumb">
                <li>
                    <a href="#">
                        <i class="fa fa-cog"></i> Configuracion</a>
                </li>
                <li class="active">Empresa</li>
            </ol>
        </section>
        <section class="content">
            <div class="box">
                <div class="box-header">
                    <h3 class="box-title">Datos de Empresa</h3>
                </div>
                <!-- /.box-header -->
                <div class="box-body">
                    
                </div>
            </div>
        </section>
    </div>`
    var main = document.getElementById('main-contenido');
    empty(main).appendChild(el);
}

function GuardarEmpresa(_escritura, usuario){
    
    var btnEliminar = document.getElementById('btnEliminar')
    btnEliminar.addEventListener('click', function Eliminar(ev) {
        H5_loading.show();
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
        fetch(URL+'/usuarios_api/eliminar_usuario', parametros)
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
                H5_loading.hide()
            })
    })
}

function ListarEmpresa(escritura) {
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

                Ver(res.data.usuarios, paginas, _escritura, _estados, _perfiles)
            }
            else
                Ver([])
            H5_loading.hide()
        })
}


export {ListarEmpresa}