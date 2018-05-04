var yo = require('yo-yo')
var empty = require('empty-element');
import {URL} from '../../constantes_entorno/constantes'
function Ver(movimientos,saldos) {
    var el = yo`
        <div>
            <section class="content-header">
                <div class="modal modal-danger fade" id="modal-danger" style="display: none;">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                                <h4 class="modal-title">¿Esta seguro que desea eliminar este cliente/proveedor?</h4>
                            </div>
                            <div class="modal-body">
                                <p>Al eliminar el cliente no podra recuperarlo. Desea continuar de todas maneras?</p>
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
                <div class="modal fade" id="modal-proceso">
                    
                </div>
                <h1>
                    Movimientos de Caja
                    <small>Movimientos</small>
                </h1>
                <ol class="breadcrumb">
                    <li>
                        <a href="#">
                            <i class="fa fa-cog"></i> Movimientos de Caja</a>
                    </li>
                </ol>
            </section>
            <section class="content">
                <div class="box">
                    <div class="box-header">
                        <h3 class="box-title">Movimientos de Caja</h3>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body">
                        <div class="table-responsive">
                        <table id="example1" class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>E</th>
                                    <th>Fecha/Hora</th>
                                    <th>D</th>
                                    <th>Documento</th>
                                    <th>Cliente/Proveedor</th>
                                    <th>Descripcion</th>
                                    <th>Plan</th>
                                    <th>Cantidad</th>
                                    <th>PU</th>
                                    <th>Ingreso</th>
                                    <th>Egreso</th>
                                </tr>
                            </thead>
                            <tbody>
                            ${movimientos.map(u => yo`
                            <tr>
                                <td>${u.ID}</td>
                                <td>${u.Fecha_Reg.split('.')[0]}</td>
                                <td>${u.ID}</td>
                                <td>${u.Documento}</td>
                                <td>${u.Cliente}</td>
                                <td>${u.Movimiento}</td>
                                <td>${u.Cod_Manguera}</td>
                                <td>${u.Cantidad}</td>
                                <td>${u.PrecioUnitario}</td>
                                <td>${u.Ingreso}</td>
                                <td>${u.Egreso}</td>

                            </tr>`)}
                            </tbody>

                        </table>
                        </div>
                    </div>
                </div>
            </section>
        </div>`;
    var footer_element = yo`
        <div class="row">
            <div class="col-sm-7"></div>
            <div class="col-sm-5">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Moneda</th>
                            <th>Saldo Inicial</th>
                            <th>Ingresos</th>
                            <th>Egresos</th>
                            <th>Saldo Final</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${saldos.map(s=>yo`
                            <tr>
                                <td>${s.Moneda}</td>
                                <td>${s.SaldoInicial}</td>
                                <td>${s.Ingresos}</td>
                                <td>${s.Egresos}</td>
                                <td>${s.SaldoFinal}</td>
                            </tr>
                        `)}
                    </tbody>
                </table>
            </div>
        </div>`;
    var container = document.getElementById('main-contenido')
    empty(container).appendChild(el);
    var footer = document.getElementById('content_footer')
    empty(footer).appendChild(footer_element);
}
module.exports = function movimientos_caja(ctx, next) {
    H5_loading.show();
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        })
    }
    fetch(URL+'/movimientos_caja_api/get_movimientos', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {

                Ver(res.data.movimientos,res.data.saldos)
            }
            else
                Ver([])
            H5_loading.hide()
        })
    next();
}