var empty = require('empty-element');
var yo = require('yo-yo');
import { NuevoConcepto } from './agregar.js'

import { URL } from '../../../constantes_entorno/constantes'


function Ver(conceptos, paginas, pagina_actual, _escritura, tipos_conceptos) {

    var tab = yo`
    <li class=""><a href="#tab_listar_conceptos_2" data-toggle="tab" aria-expanded="false" id="id_tab_listar_conceptos_2">Conceptos<a style="padding-left: 10px;" class="btn" onclick=${()=>CerrarTab()}><i class="fa fa-close text-danger"></i></a></a></li>`

    var el = yo`
    <div class="tab-pane" id="tab_listar_conceptos_2">
        <section class="content-header">
        <div class="modal modal-danger fade" id="modal-danger-conceptos" style="display: none;">
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
                    <header>Lista de Conceptos</header>
                    <div class="tools">
                        <div class="btn-group">
                        ${_escritura ? yo`<a onclick=${() => NuevoConcepto(_escritura, tipos_conceptos)} class="btn btn-info pull-right">
                            <i class="fa fa-plus"></i> Nuevo Concepto</a>`: yo``}
                        </div>
                    </div>
                </div> 
                <div class="card-body">
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
                                    ${_escritura ? yo`<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger-conceptos" onclick="${() => Eliminar(_escritura, u)}"><i class="fa fa-trash"></i></button>` : yo``}
                                    
                                </td>
                            </tr>`)}
                        </tbody>
    
                    </table>
                    </div>
                    <div class="card-actionbar">
                        <ul class="pagination pagination-sm no-margin pull-right">
                            <li>
                                <a href="javascript:void(0);" onclick=${() => (pagina_actual > 0) ? ListarConceptos(_escritura, pagina_actual - 1) : null}>«</a>
                            </li>
                            ${((new Array(paginas)).fill(0)).map((p, i) => yo`<li class=${pagina_actual == i ? 'active' : ''}>
                            <a href="javascript:void(0);" onclick=${() => ListarConceptos(_escritura, i)} >${i + 1}</a>
                            </li>`)}
                        
                            <li>
                                <a href="javascript:void(0);" onclick=${() => (pagina_actual + 1 < paginas) ? ListarConceptos(_escritura, pagina_actual + 1) : null}>»</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    </div>`
    //var main = document.getElementById('main-contenido');
    //empty(main).appendChild(el);
    if($("#tab_listar_conceptos_2").length){  

        $('#tab_listar_conceptos_2').remove()
        $('#id_tab_listar_conceptos_2').parents('li').remove()

        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    }else{
        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    } 
    $("#id_tab_listar_conceptos_2").click()
}

function CerrarTab(){
    $('#tab_listar_conceptos_2').remove()
    $('#id_tab_listar_conceptos_2').parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show'); 
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
        run_waitMe($('#main-contenido'), 1, "ios","Eliminando...");
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
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
    })
}

function ListarConceptos(escritura, NumeroPagina) {
    run_waitMe($('#main-contenido'), 1, "ios");
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
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
}

export { ListarConceptos }