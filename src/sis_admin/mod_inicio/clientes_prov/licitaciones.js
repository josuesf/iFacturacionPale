var empty = require('empty-element');
var yo = require('yo-yo');
import {URL} from '../../../constantes_entorno/constantes'

function Ver(_escritura,contactos,Id_ClienteProveedor){
    var el = yo`
        <div class="table-responsive">
            <div class="modal modal-danger fade" id="modal-danger-licitaciones" style="display: none;">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                            <h4 class="modal-title">¿Esta seguro que desea eliminar esta licitacion?</h4>
                        </div>
                        <div class="modal-body">
                            <p>Al eliminar esta licitacion no podra recuperarlo. Desea continuar de todas maneras?</p>
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
                            <h4 class="modal-title">Agregar o Editar Licitacion</h4>
                        </div>
                        <div class="modal-body">
                            <div class="panel">
                                <div class="panel-heading">
                                </div>
                                <div class="panel-body" id="form_modal">
                                    
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div class="panel-heading">
                <a class="btn btn-info pull-right" data-toggle="modal" data-target="#modal-nuevo">
                <i class="fa fa-plus"></i> Agregar Licitacion</a>
            </div>
            <div class="col-md-12">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Licitacion</th>
                            <th>Descripcion</th>
                            <th>Nro</th>
                            <th>Inicia</th>
                            <th>Factura</th>
                            <th>Tipo</th>
                            <th>Comprobante</th>
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

function Licitaciones(_escritura,cliente){
    Ver(_escritura,cliente)
}

export {Licitaciones}