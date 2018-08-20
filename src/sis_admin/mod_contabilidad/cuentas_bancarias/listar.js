var empty = require('empty-element');
var yo = require('yo-yo');

import { NuevaCuentaBancaria } from './agregar'
import {URL} from '../../../constantes_entorno/constantes'

function Ver(variables, paginas, pagina_actual, _escritura){
    var el = yo`
    <div>
        <section class="content-header">
        <div class="modal modal-danger fade" id="modal-danger" style="display: none;">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span></button>
              <h4 class="modal-title">¿Esta seguro que desea eliminar este elemento?</h4>
            </div>
            <div class="modal-body">
              <p>Al eliminar este elemento no podra recuperarlo. Desea continuar de todas maneras?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline pull-left" data-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-outline" id="btnEliminar" data-dismiss="modal">Si, Eliminar</button>
            </div>
          </div>
          <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
      </div>
            <h1>
                Cuentas Bancarias
                <small>Control cuentas bancarias</small>
            </h1>
            <ol class="breadcrumb">
                <li>
                    <a href="#">
                        <i class="fa fa-cog"></i> Contabilidad</a>
                </li>
                <li class="active">Cuentas Bancarias</li>
            </ol>
        </section>
        <section class="content">
            <div class="box">
                <div class="box-header">
                    <h3 class="box-title">Lista de Cuentas</h3>
                    ${_escritura ? yo`<a onclick=${()=>NuevaCuentaBancaria(_escritura, variables)} class="btn btn-info pull-right">
                        <i class="fa fa-plus"></i> Nuevo</a>`: yo``}
                </div>
                <!-- /.box-header -->
                <div class="box-body">
                    <div class="table-responsive">
                    <table id="example1" class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Cuenta</th>
                                <th>Banco</th>
                                <th>Descripcion</th>
                                <th>Cuenta Contable</th>
                                <th>Moneda</th>
                                <th>Saldo</th>
                                <th>Activo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${variables.cuentas.map(u => yo`
                            <tr>
                                <td>${u.Cod_CuentaBancaria}</td>
                                <td>${u.Nom_EntidadFinanciera}</td>
                                <td>${u.Des_CuentaBancaria}</td>
                                <td>${u.Cod_CuentaContable}</td>
                                <td>${u.Nom_Moneda}</td>
                                <td>${u.Saldo_Disponible}</td>
                                <td>${u.Flag_Activo?"Si":"No"}</td>
                                <td>
                                    ${_escritura ? yo`<button class="btn btn-xs btn-success" onclick="${()=>NuevaCuentaBancaria(_escritura, variables, u)}"><i class="fa fa-edit"></i></button>` : yo``}
                                    ${_escritura ? yo`<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger" onclick="${()=>Eliminar(_escritura, u)}"><i class="fa fa-trash"></i></button>` : yo``}
                                    
                                </td>
                            </tr>`)}
                        </tbody>
    
                    </table>
                    </div>
                    <div class="box-footer clearfix">
                        <ul class="pagination pagination-sm no-margin pull-right">
                            <li>
                                <a href="#" onclick=${()=>(pagina_actual>0)?ListarProductosServ(_escritura,pagina_actual-1):null}>«</a>
                            </li>
                            ${((new Array(paginas)).fill(0)).map((p, i) => yo`<li class=${pagina_actual==i?'active':''}>
                            <a href="#" onclick=${()=>ListarProductosServ(_escritura,i)} >${i + 1}</a>
                            </li>`)}
                        
                            <li>
                                <a href="#" onclick=${()=>(pagina_actual+1<paginas)?ListarProductosServ(_escritura,pagina_actual+1):null}>»</a>
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

function Eliminar(_escritura, cuenta){
    var btnEliminar = document.getElementById('btnEliminar')
    btnEliminar.addEventListener('click', function del(ev){
        var Cod_CuentaBancaria = cuenta.Cod_CuentaBancaria
        run_waitMe($('#main-contenido'), 1, "ios","Eliminando cuenta bancaria...");
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Cod_CuentaBancaria
            })
        }
        fetch(URL+'/cuentas_bancarias_api/eliminar_cuenta', parametros)
            .then(req => req.json())
            .then(res => {
                ListarCuentasBancarias(_escritura,0)
                this.removeEventListener('click', del)
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('La conexion esta muy lenta. Inténtelo nuevamente refrescando la pantalla','Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
    })
}

function ListarCuentasBancarias(escritura,NumeroPagina) {
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
            ScripOrden: ' ORDER BY Cod_CuentaBancaria asc',
            ScripWhere: ''
        })
    }
    fetch(URL+'/cuentas_bancarias_api/get_cuentas', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var paginas = parseInt(res.data.num_filas[0].NroFilas)
                paginas = parseInt(paginas / 20) + (paginas % 20 != 0 ? 1 : 0)
                Ver(res.data, paginas,NumeroPagina||0, _escritura)
            }
            else
                Ver([])
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('La conexion esta muy lenta. Inténtelo nuevamente refrescando la pantalla','Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
}

export {ListarCuentasBancarias}