var empty = require('empty-element');
var yo = require('yo-yo');

import {ListarTurnos} from './listar';
import {URL} from '../../../constantes_entorno/constantes'

function Ver(_escritura, turno){

    var tab = yo`
    <li class=""><a href="#tab_crear_turno_2" data-toggle="tab" aria-expanded="false" id="id_tab_crear_turno_2">Turno<a style="padding-left: 10px;" class="btn" onclick=${()=>CerrarTab()}><i class="fa fa-close text-danger"></i></a></a></li>`

    var el = yo`
    <div class="tab-pane" id="tab_crear_turno_2">
        
        <section class="content">
            <div class="card">
                <div class="card-head">
                    <header>
                        <a onclick=${()=>ListarTurnos(_escritura)}
                        class="btn btn-xs btn-icon-toggle">
                            <i class="fa fa-arrow-left"></i></a>
                            ${turno?'Editar':'Nuevo'} Turno
                    </header>
                </div> 
                <div class="card-body">
                    <div class="panel">
                        
                        <!-- form start -->
                        <form role="form">
                            <div class="panel-body">
                                <div class="row">
                                    <div class="alert alert-callout alert-danger hidden" id="divErrors">
                                        <p>Es necesario llenar todos los campos requeridos marcados con rojo</p>
                                    </div>
                                </div>
                                <div class="row">
                                    ${turno? yo``:yo`
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Cod_Turno">Codigo de Turno</label>
                                            <input type="text" style="text-transform:uppercase" class="form-control required" id="Cod_Turno" placeholder="Codigo turno" >
                                        </div>
                                    </div>`}
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="Des_Turno">Concepto</label>
                                            <input type="text" style="text-transform:uppercase" class="form-control required" id="Des_Turno" placeholder="Concepto" value="${turno?turno.Des_Turno:''}">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-3">
                                        <div class="form-group">
                                            <label>Fecha inicio:</label>
                            
                                            <div class="input-group date">
                                                <div class="input-group-addon">
                                                    <i class="fa fa-calendar"></i>
                                                </div>
                                                <input type="text" class="form-control pull-right required" id="Fecha_Inicio" value="${turno?getFechaHora(turno.Fecha_Inicio,true,false):''}">
                                            </div>
                                            <!-- /.input group -->
                                        </div>
                                    
                                    </div>
                                    <div class="col-sm-3">
                                        <div class="bootstrap-timepicker">
                                            <div class="form-group">
                                                <label>Hora inicio:</label>

                                                <div class="input-group">
                                                    <input type="text" class="form-control timepicker required" id="Hora_Inicio" value="${turno?getFechaHora(turno.Fecha_Inicio,false,true):''}">

                                                    <div class="input-group-addon">
                                                        <i class="fa fa-clock-o"></i>
                                                    </div>
                                                </div>
                                            <!-- /.input group -->
                                            </div>
                                            <!-- /.form group -->
                                        </div>
                                    </div>
                                    <div class="col-sm-3">
                                        <div class="form-group">
                                            <label>Fecha finaliza:</label>
                            
                                            <div class="input-group date">
                                                <div class="input-group-addon">
                                                    <i class="fa fa-calendar"></i>
                                                </div>
                                                <input type="text" class="form-control pull-right required" id="Fecha_Fin"  value="${turno?getFechaHora(turno.Fecha_Fin,true,false):''}">
                                            </div>
                                            <!-- /.input group -->
                                        </div>
                                    </div>
                                    <div class="col-sm-3">
                                        <div class="bootstrap-timepicker">
                                            <div class="form-group">
                                                <label>Hora finaliza:</label>

                                                <div class="input-group">
                                                    <input type="text" class="form-control timepicker required" id="Hora_Fin"  value="${turno?getFechaHora(turno.Fecha_Fin,false,true):''}">

                                                    <div class="input-group-addon">
                                                        <i class="fa fa-clock-o"></i>
                                                    </div>
                                                </div>
                                            <!-- /.input group -->
                                            </div>
                                            <!-- /.form group -->
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="checkbox checkbox-inline checkbox-styled">
                                            <label>
                                            <input type="checkbox" id="Flag_Cerrado" ${turno?turno.Flag_Cerrado?'checked':'':''}><span> Cerrado?</span>
                                            </label>
                                        </div>  
                                        <p class="help-block">Cuando el turno esta cerrado no se puede realizar ningun movimiento</p>
                                    </div>
                                </div>
                                
                            </div> 
                
                            
                        </form>
                        <div class="card-actionbar">
                                <button onclick="${() => Guardar(_escritura, turno)}" class="btn btn-primary">Guardar</button>
                            </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
    `
    //var main = document.getElementById('main-contenido');
   //empty(main).appendChild(el);
    if($("#tab_crear_turno_2").length){  

        $('#tab_crear_turno_2').remove()
        $('#id_tab_crear_turno_2').parents('li').remove()

        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    }else{
        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    } 
    $("#id_tab_crear_turno_2").click()
}

function CerrarTab(){
    $('#tab_crear_turno_2').remove()
    $('#id_tab_crear_turno_2').parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show'); 
}

function getFechaHora(str, flagfecha, flaghora){
    var spl = str.split('T')
    var fecha = spl[0].split('-')
    var hora = spl[1].split(':')
    var fechastr = fecha[2]+'/'+fecha[1]+'/'+fecha[0]
    var horastr = hora[0]+':'+hora[1]
    var res = flagfecha?fechastr+(flaghora?' '+horastr:''):flaghora?horastr:''
    return res
}

function toFechaSQL(fecha, hora){
    var feSpl = fecha.split('/')
    var horaSQL = hora+':00'

    var fechaSQL = feSpl[2] + '-' + feSpl[1] + '-' + feSpl[0] + ' '
    var res = fechaSQL + horaSQL

    return res;

}

function Guardar(_escritura, turno){
    if(ValidacionCampos()){
        var Cod_Turno = turno?turno.Cod_Turno:document.getElementById('Cod_Turno').value.toUpperCase()
        var Des_Turno = document.getElementById('Des_Turno').value.toUpperCase()
        var Fecha_Inicio =  toFechaSQL(document.getElementById('Fecha_Inicio').value,document.getElementById('Hora_Inicio').value)
        var Fecha_Fin = toFechaSQL(document.getElementById('Fecha_Fin').value,document.getElementById('Hora_Fin').value)
        var Flag_Cerrado = document.getElementById('Flag_Cerrado').checked?'1':'0'
        var Cod_Usuario = 'ADMINISTRADOR'.toUpperCase()
        run_waitMe($('#main-contenido'), 1, "ios","Guardando...");
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                Cod_Turno,
                Des_Turno,
                Fecha_Inicio,
                Fecha_Fin,
                Flag_Cerrado,
                Cod_Usuario
            })
        }
        fetch(URL+'/turnos_api/guardar_turno', parametros)
            .then(req => req.json())
            .then(res => {
                if(res.respuesta == 'ok'){
                    ListarTurnos(_escritura)
                }else{
                    NuevoTurno(_escritura, turno)
                }
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
    }

}

function NuevoTurno(_escritura, turno){
    Ver(_escritura, turno)
    $.fn.datepicker.dates['es'] = {
        days: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
        daysShort: ["Dom", "Lun", "Mar", "Mir", "Jue", "Vie", "Sab"],
        daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
        months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiember", "Octubre", "Noviember", "Diciember"],
        monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        today: "Today",
        clear: "Clear",
        format: "dd/mm/yyyy",
        titleFormat: "MM yyyy", /* Leverages same syntax as 'format' */
        weekStart: 0
    };
    $('#Fecha_Inicio').datepicker({
        autoclose: true,
        language: 'es'
    })
      $('#Fecha_Fin').datepicker({
        autoclose: true,
        language: 'es'
      })
      
        $('.timepicker').timepicker({
            showInputs: false,
            showMeridian: false,
          })

}

export { NuevoTurno }