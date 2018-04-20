var empty = require('empty-element');
var yo = require('yo-yo');
import { NuevoConcepto } from './agregar.js'

import { URL } from '../../../constantes_entorno/constantes'


function Ver(conceptos, paginas, pagina_actual, _escritura, tipos_conceptos) {
    var el = yo`
    <div>
        <section class="content-header">
        <div class="modal modal-danger fade" id="modal-danger" style="display: none;">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span></button>
              <h4 class="modal-title">¿Esta seguro que desea eliminar este concepto?</h4>
            </div>
            <div class="modal-body">
              <p>Al eliminar el concepto no podra recuperarlo. Desea continuar de todas maneras?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline pull-left" data-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-outline" id="btnEliminar" data-dismiss="modal">Si,Eliminar</button>
            </div>
          </div>
          <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
      </div>
            <h1>
                Conceptos
                <small>Control conceptos</small>
            </h1>
            <ol class="breadcrumb">
                <li>
                    <a href="#">
                        <i class="fa fa-cog"></i> Configuracion</a>
                </li>
                <li class="active">Conceptos</li>
            </ol>
        </section>
        <section class="content">
            <div class="box">
                <div class="box-header">
                    <h3 class="box-title">Lista de Conceptos</h3>
                    ${_escritura ? yo`<a onclick=${() => NuevoConcepto(_escritura, tipos_conceptos)} class="btn btn-info pull-right">
                        <i class="fa fa-plus"></i> Nuevo Concepto</a>`: yo``}
                </div>
                <!-- /.box-header -->
                <div class="box-body">
                    <div class="table-responsive">
                    <table id="example1" class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Codigo</th>
                                <th>Concepto</th>
                                <th>Clase</th>
                                <th>Activo?</th>
                                <th>Usuario</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${conceptos.map(u => yo`
                            <tr>
                                <td>${u.Id_Concepto}</td>
                                <td>${u.Des_Concepto}</td>
                                <td>${u.Nom_TipoConcepto}</td>
                                <td>${u.Flag_Activo ? 'Si' : 'No'}</td>
                                <td>${u.Cod_UsuarioReg}</td>
                                <td>${getFechaHora(u.Fecha_Reg, true, false)}</td>
                                <td>
                                    ${_escritura ? yo`<button class="btn btn-xs btn-success" onclick="${() => NuevoConcepto(_escritura, tipos_conceptos, u)}"><i class="fa fa-edit"></i></button>` : yo``}
                                    ${_escritura ? yo`<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger" onclick="${() => Eliminar(_escritura, u)}"><i class="fa fa-trash"></i></button>` : yo``}
                                    
                                </td>
                            </tr>`)}
                        </tbody>
    
                    </table>
                    </div>
                    <div class="box-footer clearfix">
                        <ul class="pagination pagination-sm no-margin pull-right">
                            <li>
                                <a href="#" onclick=${() => (pagina_actual > 0) ? ListarConceptos(_escritura, pagina_actual - 1) : null}>«</a>
                            </li>
                            ${((new Array(paginas)).fill(0)).map((p, i) => yo`<li class=${pagina_actual == i ? 'active' : ''}>
                            <a href="#" onclick=${() => ListarConceptos(_escritura, i)} >${i + 1}</a>
                            </li>`)}
                        
                            <li>
                                <a href="#" onclick=${() => (pagina_actual + 1 < paginas) ? ListarConceptos(_escritura, pagina_actual + 1) : null}>»</a>
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
function getFechaHora(str, flagfecha, flaghora){
    var spl = str.split('T')
    var fecha = spl[0].split('-')
    var hora = spl[1].split(':')
    var fechastr = fecha[2]+'/'+fecha[1]+'/'+fecha[0]
    var horastr = hora[0]+':'+hora[1]
    return flagfecha?fechastr+(flaghora?' '+horastr:''):flaghora?horastr:''
}

function Eliminar(_escritura, concepto) {

    var btnEliminar = document.getElementById('btnEliminar')
    btnEliminar.addEventListener('click', function Eliminar(ev) {
        H5_loading.show();
        var Id_Concepto = concepto.Id_Concepto
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Id_Concepto,
            })
        }
        fetch(URL + '/conceptos_api/eliminar_concepto', parametros)
            .then(req => req.json())
            .then(res => {

                if (res.respuesta == 'ok') {
                    ListarConceptos(_escritura)
                    this.removeEventListener('click', Eliminar)
                }
                else {
                    console.log('Error')
                    this.removeEventListener('click', Eliminar)
                }
                H5_loading.hide()
            })
    })
}

function ListarConceptos(escritura, NumeroPagina) {
    H5_loading.show();
    var _escritura = escritura;
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            TamanoPagina: '20',
            NumeroPagina: NumeroPagina || '0',
            ScripOrden: ' ORDER BY Id_Concepto asc',
            ScripWhere: ''
        })
    }
    fetch(URL + '/conceptos_api/get_conceptos', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var paginas = parseInt(res.data.num_filas[0].NroFilas)

                paginas = parseInt(paginas / 20) + (paginas % 20 != 0 ? 1 : 0)

                var tipos_conceptos = res.data.tipos_conceptos

                Ver(res.data.conceptos, paginas, NumeroPagina || 0, _escritura, tipos_conceptos)
            }
            else
                Ver([])
            H5_loading.hide()
        })
}

export { ListarConceptos }