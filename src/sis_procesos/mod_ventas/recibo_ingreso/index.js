var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../../constantes_entorno/constantes'


function CargarFormulario() {
    var el = yo`
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
                <h4 class="modal-title">Recibo de Ingreso</h4>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-8">
                        <div class="row form-group">
                            <div class="col-sm-2">
                                <select id="" class="form-control"></select>
                            </div>
                            <div class="col-sm-3">
                                <input type="text" class="form-control">
                            </div>
                            <div class="col-sm-3">
                                <button class="btn btn-default">Mas Detalles</button>
                            </div>
                        </div>
                        <div class="row form-group">
                            <div class="col-sm-1">
                                <button class="btn btn-default">+</button>
                            </div>
                            <div class="col-sm-5">
                                <input type="text" class="form-control">
                            </div>
                            <div class="col-sm-1">
                                <button class="btn btn-default">+</button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">

                    </div>
                </div>
            </div>
    
            <div class="modal-footer">
                <button onclick="${() => GuardarCajaAlmacen(_escritura, tipo_almacenes, almacen)}" class="btn btn-primary"  data-dismiss="modal">Guardar</button>
                <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>`

    var ingreso = document.getElementById('modal-proceso')
    empty(ingreso).appendChild(el)
    $('#modal-proceso').modal()
}

function NuevoIngreso() {
    CargarFormulario()
}

export { NuevoIngreso }