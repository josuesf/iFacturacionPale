var empty = require('empty-element');
var yo = require('yo-yo');
import {URL} from '../../../constantes_entorno/constantes'

function Ver(_escritura,establecimientos,Id_ClienteProveedor){
    var el = yo`
        <div class="table-responsive">
            <div class="modal modal-danger fade" id="modal-danger" style="display: none;">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                            <h4 class="modal-title">¿Esta seguro que desea eliminar este establecimiento?</h4>
                        </div>
                        <div class="modal-body">
                            <p>Al eliminar este establecimiento no podra recuperarlo. Desea continuar de todas maneras?</p>
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
            <div class="modal modal-default fade" id="modal-abrir" style="display: none;">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                            <h4 class="modal-title">Agregar o Editar Establecimiento</h4>
                        </div>
                        <div class="modal-body">
                            <div class="box box-primary">
                                <div class="box-header with-border">
                                </div>
                                <div class="box-body" id="form_modal">
                                    
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div class="box-header">
                <a class="btn btn-info pull-right" data-toggle="modal" data-target="#modal-nuevo">
                <i class="fa fa-plus"></i> Agregar Establecimiento</a>
            </div>
            <div class="col-md-12">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Codigo</th>
                            <th>Establecimiento</th>
                            <th>Tipo</th>
                            <th>Direccion</th>
                            <th>Telefono</th>
                            <th>Obs</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        </div>
    `
    var main = document.getElementById('tab_current');
    empty(main).appendChild(el);
}

function Establecimientos(_escritura,cliente){
    Ver(_escritura,cliente)
}

export {Establecimientos}