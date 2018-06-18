var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../../constantes_entorno/constantes'
import { refrescar_movimientos } from '../../movimientos_caja'

function Ver() {
    var el = yo`
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
                <h4 class="modal-title"><strong>Nueva Habitación</strong></h4>
            </div>
            <div class="modal-body" id="modal_form_habitacion">
                <div class="row">
                    <div id="modal_error_habitacion" class="callout callout-danger hidden">
                        <p> Es necesario llenar los campos marcados con rojo</p>
                    </div>
                </div>
                <div class="row"> 
                    <div class="col-sm-12">
                        <div class="form-group">
                            <label id="laCod_Habitacion">Codigo Habitación</label>
                            <input type="text" class="form-control required" id="Cod_Habitacion">
                        </div>
                    </div> 
                    <div class="col-sm-12">
                        <div class="form-group">
                            <label id="laCapacidad">Capacidad</label>
                            <input type="number" class="form-control required" id="Capacidad" value="1">
                        </div>
                    </div>  
                    <div class="col-sm-12"> 
                        <div class="form-group">
                            <label id="laCod_Tipo_Habitacion">Tipo Habitación</label>
                            <select class="form-control required" id="Cod_Tipo_Habitacion">
                                <option value="TH001">Doble</option>
                                <option value="TH002">Simple</option>
                                <option value="TH003">Matrimonial</option>
                            </select>
                        </div> 
                    </div>                                    
                    <div class="col-sm-12"> 
                        <div class="form-group">
                            <label id="laDescripcion">Descripción</label>
                            <input class="form-control" id="Descripcion">
                        </div> 
                    </div>
                    <div class="col-sm-12">
                        <div class="form-group">
                            <label id="laCod_Torre">Torre</label>
                            <select class="form-control" id="Cod_Torre">
                                <option value="TO001">Primera</option>
                                <option value="TO002">Segunda</option>
                            </select>
                        </div> 
                    </div>
                    <div class="col-sm-12"> 
                        <div class="form-group">
                            <label id="laCod_Piso">Piso</label>
                            <select class="form-control" id="Cod_Piso">
                                <option value="PI001">Primer</option>
                                <option value="PI002">Segundo</option>
                                <option value="PI003">Tercer</option>
                            </select>
                        </div> 
                    </div>   
                    <div class="col-sm-12"> 
                        <div class="form-group">
                            <label id="laObservaciones">Observaciones</label>
                            <textarea class="form-control" id="Observaciones">
                            </textarea>
                        </div> 
                    </div>
                    <div class="col-sm-12">
                        <div class="form-group">
                            <label>Escoja los detalles de la habitación</label>
                            <select class="form-control select-multiple select2" data-placeholder="Seleccione los especificaciones de la habitacion" name="detalles[]" multiple="multiple" style="width:100%">
                                <option value="WIFI">Wifi</option>
                                <option value="DC">Ducha Caliente</option>
                                <option value="J">Jacuzzi</option>
                            </select>
                        </div>
                    </div>  
                    
                </div>

                
            </div>
            <div class="modal-footer text-center"> 
                <button type="button" class="btn btn-success" onclick=${()=>GuardarHabitacion()}>Guardar</button>  
                <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button> 
            </div>
        </div>
    </div>`

    var modal_proceso = document.getElementById('modal-proceso');
    empty(modal_proceso).appendChild(el);
    $('#modal-proceso').modal()
    $('.select-multiple').select2();
}
 
function GuardarHabitacion(){
    console.log($(".select-multiple").val())

    if (ValidacionCampos("modal_error_habitacion","modal_form_habitacion")){

        var Cliente = txtBuscarCliente
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Cliente
            })
        }
        fetch(URL+'/reservas_api/guardar_habitacion', parametros)
        .then(req => req.json())
        .then(res => {
            console.log(res)
            if (res.respuesta == 'ok') {
                var clientes = res.data.cliente
                if(clientes.length > 0)
                    AgregarTabla(clientes)
                else  
                    empty(document.getElementById('contenedorTablaClientes'));
            }
            else
                empty(document.getElementById('contenedorTablaClientes'));
        })


    }
}

function NuevaHabitacion() {
    H5_loading.show()
    Ver()
    H5_loading.hide()
    /*const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        })
    }
    fetch(URL + '/recepciones_api/get_variables_recepcion_transferencia', parametros)
        .then(req => req.json())
        .then(res => {
            var variables = res.data
            console.log(variables)
            if (res.respuesta == 'ok') {
                
                Ver(variables)
            }
            else { 
                
            }
            H5_loading.hide()
        })*/
}



export { NuevaHabitacion }