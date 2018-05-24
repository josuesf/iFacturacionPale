var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../constantes_entorno/constantes'

var aCantidad = 0
var NroDias = 60
var aStock

function AsignarSeries(){ 
    var el = yo`
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button> 
                    <h4 class="modal-title"><strong>Series</strong></h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                        </div>
                        <div class="col-md-6">
                            <div class="col-md-6">
                                <button class="btn btn-success btn-sm">Generar Series</button>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="table-responsive">
                            <table id="tablaSeries" class="table table-bordered table-hover">
                                <thead>
                                    <th>Series</th>
                                    <th>Vencimiento</th>
                                    <th>Observaciones</th>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="modal-footer text-center"> 
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-info" id="btnAceptar" onclick="${()=>AplicarPercepcion(CodLibro,variables)}">Aceptar</button>
                </div>
            </div>
        </div>`

    var modal_proceso = document.getElementById('modal-otros-procesos');
    empty(modal_proceso).appendChild(el);
    $('#modal-otros-procesos').modal()   
}

export {  AsignarSeries }