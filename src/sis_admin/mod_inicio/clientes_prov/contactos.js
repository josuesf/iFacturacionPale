var empty = require('empty-element');
var yo = require('yo-yo');
import {URL} from '../../../constantes_entorno/constantes'

function Ver(_escritura,cliente){
    var el = yo`
        <div class="table-responsive">
            <div class="box-header">
                <a class="btn btn-info pull-right" data-toggle="modal" data-target="#modal-nuevo">
                <i class="fa fa-plus"></i> Agregar Contacto</a>
            </div>
            <div class="col-md-12">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Principal</th>
                            <th>Entidad Financiera</th>
                            <th>Nro Cuenta</th>
                            <th>Cuenta</th>
                            <th>Cuenta Privada</th>
                            <th>Observaciones</th>
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

function Contactos(_escritura,cliente){
    Ver(_escritura,cliente)
}

export {Contactos}