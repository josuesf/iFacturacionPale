var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../../constantes_entorno/constantes'
import { refrescar_movimientos } from '../../movimientos_caja'
import { LibroReservas, CargarResources } from '../../mod_reservas/reservas'

const fecha = new Date()
const mes = fecha.getMonth() + 1
const dia = fecha.getDate()
var fecha_actual = fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)

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
                    <div id="modal_error_habitacion" class="alert alert-callout alert-danger hidden">
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
                            <label id="laCapacidad">Capacidad Camas</label>
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
    //console.log($(".select-multiple").val())

    if (ValidacionCampos("modal_error_habitacion","modal_form_habitacion")){
        run_waitMe($('#modal-proceso'), 1, "ios","Registrando habitacion....");
        var Cod_Habitacion = $("#Cod_Habitacion").val()
        var Des_Habitacion = $("#Descripcion").val()
        var Id_Producto = -1
        var Cod_EstadoHabitacion = "LIMPIO"
        var Sobre_Booking = 0
        var Cod_Torre= $("#Cod_Torre").val()
        var Cod_Piso = $("#Cod_Piso").val()
        var Flag_Activo = "ACTIVO"
        var Cod_Tipo = $("#Cod_Tipo_Habitacion").val()
        var Capacidad = parseInt($("#Capacidad").val())
        var Obs_Habitacion = $("#Observaciones").val().toString().trim()
        var Fecha = fecha_actual
        var Detalles = $(".select-multiple").val()
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Cod_Habitacion,
                Des_Habitacion,
                Id_Producto,
                Cod_EstadoHabitacion,
                Sobre_Booking,
                Cod_Torre,
                Cod_Piso,
                Flag_Activo,
                Cod_Tipo,
                Capacidad,
                Obs_Habitacion,
                Fecha,
                Detalles
            })
        }
        //console.log(parametros)
        fetch(URL+'/reservas_api/guardar_habitacion', parametros)
        .then(req => req.json())
        .then(res => {
            $('#modal-proceso').modal('hide')  
            if(res.respuesta=="ok"){
                LibroReservas()
            }else{
                toastr.error('No se pudo registrar correctamente la habitacion','Error',{timeOut: 5000})
            }
            $('#modal-proceso').waitMe('hide');
            
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#modal-proceso').waitMe('hide');
        });



    }
}

function NuevaHabitacion() {
    run_waitMe($('#main-contenido'), 1, "ios");
    Ver()
    $('#main-contenido').waitMe('hide');
}



export { NuevaHabitacion }