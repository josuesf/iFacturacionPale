var empty = require('empty-element');
var yo = require('yo-yo');

import { URL } from '../../../constantes_entorno/constantes'
import { refrescar_movimientos } from '../../movimientos_caja' 
import { NuevoCliente, BuscarCliente } from '../../modales'

var dp = null
var nav = null
var _MS_PER_DAY = 1000 * 60 * 60 * 24;
 
function Ver() { 
    if ($("ul#tabs").find("li > a#idReservas").length<=0){
        var tab = yo`
        <li class=""><a href="#tabReservas" data-toggle="tab" aria-expanded="false" id="idReservas">Front Desk</a></li>`

        var tabContent = yo`
            <div class="tab-pane" id="tabReservas">
                <div class="row">
                    <div class="col-md-12">
                        <div class="box box-primary">
                            <div class="box-header">
                                <div class="row">
                                    
                                    <div class="col-md-9 col-sm-9">
                                        <div class="btn-group pull-right divAcciones" data-toggle="buttons">
                                            <label class="btn btn-primary btn-sm">
                                            <input type="radio" name="options" id="option1" onchange=${()=>MostrarPorDias(1)}> Mostrar un solo dia
                                            </label>
                                            <label class="btn btn-primary btn-sm">
                                            <input type="radio" name="options" id="option2" onchange=${()=>MostrarPorDias(3)}> Mostrar 3 dias
                                            </label>
                                            <label class="btn btn-primary btn-sm">
                                            <input type="radio" name="options" id="option3" onchange=${()=>MostrarPorDias(7)}> Mostrar semana
                                            </label>
                                            <label class="btn btn-primary btn-sm">
                                            <input type="radio" name="options" id="option3" onchange=${()=>MostrarPorDias(15)}> Mostrar 15 dias
                                            </label>
                                            <label class="btn btn-primary btn-sm">
                                            <input type="radio" name="options" id="option3" onchange=${()=>MostrarMes()}> Mostrar Mes
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col-md-3 col-sm-3">
                                        <div class="input-group divBuscar">
                                            <input type="txtBuscarReserva" class="form-control input-sm">
                                            <div class="input-group-btn">
                                                <button type="button" class="btn btn-primary btn-sm">Buscar</button>
                                            </div> 
                                        </div> 
                                    </div>
                                </div>
                                
                            </div>
                            <div class="box-body">  
                                <div class="row"> 
                                    <div class="col-sm-1 divNav" >
                                        <div id="nav"></div>
                                    </div>
                                    <div class="col-sm-10 divDP">
                                        <div id="dp"></div>
                                    </div>  
                                </div>
                            </div>
                        
                        </div>
                    </div>
                </div>
            </div>`
        
        $("#tabs").append(tab)
        $("#tabs_contents").append(tabContent)
        $("#idReservas").click()


        nav = new DayPilot.Navigator("nav");
        nav.locale = "es-es";
        nav.selectMode = "day";
        nav.showMonths = 1;
        nav.skipMonths = 1;
        nav.onTimeRangeSelected = function(args) {
            dp.startDate = args.day.value
            dp.days = nav.startDate.daysInMonth()
            dp.update();
        };
        nav.init(); 
        dp = new DayPilot.Scheduler("dp")
        dp.locale = "es-es";
        dp.timeRangeSelectingStartEndEnabled = true
        dp.eventMovingStartEndFormat = "MMMM d, yyyy";
        dp.startDate = nav.selectionDay.value
        dp.days = nav.startDate.daysInMonth() 
        dp.cellDuration = 1440
        dp.treeEnabled = true
        dp.treePreventParentUsage = true

        if ($(window).width() < 1350) {  
            dp.cellWidthSpec = 'Fixed'; 
        }else{
            dp.cellWidthSpec = 'Auto';
        }  
        
        dp.eventDeleteHandling = "Update"
        dp.timeHeaders = [
            { groupBy: "Month", format: "MMMM yyyy" },
            { groupBy: "Day", format: "d" }
        ]
    
        dp.eventHeight = 60
        dp.bubble = new DayPilot.Bubble({})
    
        dp.rowHeaderColumns = [
            {title: "Habitacion", width: 70},
            {title: "Capacidad", width: 70},
            {title: "Estado", width: 70}
        ];
    
        dp.separators = [
            { location: new DayPilot.Date(), color: "red" }
        ]
    
        dp.contextMenuResource = new DayPilot.Menu({items: [
            {text:'Open', onclick:function() { var e = this.source; var command = this.item.command; console.log(e); }}
        ]})

        dp.contextMenu = new DayPilot.Menu({items: [
            {text:"Check out", onClick: function(args) { 
                    console.log(args.source)
                    //dp.events.edit(args.source); 
                } 
            },
            {text:"Eliminar", onClick: function(args) { 
                    //dp.events.remove(args.source); 
                } 
            },
    
        ]})
    
        dp.onEventClick = function(args) {
            /*var modal = new DayPilot.Modal();
            modal.closed = function() {
                // reload all events
                var data = this.result;
                if (data && data.result === "OK") {
                    cargarEvents();
                }
            };
            modal.showUrl("edit.php?id=" + args.e.id());*/
        }
    
        dp.onTimeRangeSelected = function (args) {
            RegistroReserva(args)
            /*var modal = new DayPilot.Modal();
            modal.closed = function() {
                dp.clearSelection();
    
                // reload all events
                var data = this.result;
                if (data && data.result === "OK") {
                    cargarEvents();
                }
            };
            modal.showUrl("new.php?start=" + args.start + "&end=" + args.end + "&resource=" + args.resource);*/
    
        }
    
    
        dp.onBeforeResHeaderRender = function(args) {
            var beds = function(count) {
                return count + " cama" + (count > 1 ? "s" : "");
            };
    
            args.resource.columns[0].html = args.resource.capacity==undefined?"":beds(args.resource.capacity);
            args.resource.columns[1].html = args.resource.status; 
            switch (args.resource.status) {
                case "SUCIO":
                    args.resource.cssClass = "status_dirty";
                    break
                case "POR LIMPIAR":
                    args.resource.cssClass = "status_cleanup";
                    break
                case "LIMPIO":
                    args.resource.cssClass = "status_clean";
                    break
            }
    
            args.resource.areas = [{
                        top:3,
                        right:4,
                        height:14,
                        width:14,
                        action:"JavaScript",
                        js: function(r) {
                            /*var modal = new DayPilot.Modal();
                            modal.onClosed = function(args) {
                                cargarResources();
                            };
                            modal.showUrl("room_edit.php?id=" + r.id);*/
                        },
                        v:"Hover",
                        css:"icon icon-edit",
                    }];
        }
    
        dp.onBeforeEventRender = function(args) {
            var start = new DayPilot.Date(args.e.start);
            var end = new DayPilot.Date(args.e.end);
    
            var today = DayPilot.Date.today();
            var now = new DayPilot.Date();

            args.e.cssClass = 'text-white'
            args.e.html ="<span style='color:white;font-weight: bold;'>"+ args.e.text + " (" + start.toString("M/d/yyyy") + " - " + end.toString("M/d/yyyy") + ")" + "</span>";
            args.e.barHidden = true
            switch (args.e.status) {
                case "New":
                    var in2days = today.addDays(1);
    
                    if (start < in2days) { 
                        args.e.backColor = '#cc0000'
                        args.e.toolTip = 'Expired (not confirmed in time)'
                    }
                    else {
                        args.e.backColor = '#e69138'
                        args.e.toolTip = 'New';
                    }
                    break;
                case "Confirmed":
                    var arrivalDeadline = today.addHours(18);
    
                    if (start < today || (start.getDatePart() === today.getDatePart() && now > arrivalDeadline)) { // must arrive before 6 pm
                        args.e.backColor = '#cc0000'
                        args.e.toolTip = 'Late arrival'
                    }
                    else {
                        args.e.backColor = '#6aa84f'
                        args.e.toolTip = "Confirmed"
                    }
                    break;
                case 'Arrived': // arrived
                    var checkoutDeadline = today.addHours(10);
    
                    if (end < today || (end.getDatePart() === today.getDatePart() && now > checkoutDeadline)) { // must checkout before 10 am
                        args.e.backColor = '#cc0000';  // red
                        args.e.toolTip = "Late checkout";
                    }
                    else
                    {
                        args.e.backColor = "#3c78d8";  // blue
                        args.e.toolTip = "Arrived";
                    }
                    break;
                case 'CheckedOut': // checked out
                    args.e.backColor = "#1b1c1d";
                    args.e.toolTip = "Checked out";
                    break;
                default:
                    args.e.toolTip = "Unexpected state";
                    break;
            }
    
            args.e.html = args.e.html + "<br /><span style='color:white'>" + args.e.toolTip + "</span>";
    
            var paid = args.e.paid;
            var paidColor = "white";
     
            args.e.areas = [
                { bottom: 10, right: 4, html: "<div style='color:" + paidColor + "; font-size: 8pt;'>Paid: " + paid + "%</div>", v: "Visible"},
                { left: 4, bottom: 8, right: 4, height: 2, html: "<div style='background-color:" + paidColor + "; height: 100%; width:" + paid + "%'></div>", v: "Visible" }
            ]
    
        }
    
        dp.init()
         
    }else{
        $("#idReservas").click()
        AjustarTamanio()
    }
     

    $(window).resize(function(){
        AjustarTamanio()
    });

    
    CargarResources()
    CargarEvents()
 
   
    /*var dp = new DayPilot.Scheduler("dp");

    dp.startDate = "2018-01-01";
    dp.days = 365;
    dp.scale = "Day";
    dp.timeHeaders = [
        { groupBy: "Month", format: "MMM yyyy" },
        { groupBy: "Cell", format: "d" }
    ];

    dp.eventHeight = 30;

    dp.contextMenu = new DayPilot.Menu({items: [
        {text:"Editar", onClick: function(args) { 
                console.log(args.source)
                //dp.events.edit(args.source); 
            } 
        },
        {text:"Eliminar", onClick: function(args) { 
                //dp.events.remove(args.source); 
            } 
        },

    ]});

    dp.treeEnabled = true;
    dp.treePreventParentUsage = true;
    
    dp.resources = [
                 { name: "standard", id: "G1", expanded: true, children:[
                         { name : "Room 1", id : "A" },
                         { name : "Room 2", id : "B" },
                         { name : "Room 3", id : "C" },
                         { name : "Room 4", id : "D" }
                         ]
                 },
                 { name: "doble cama", id: "G2", expanded: true, children:[
                         { name : "Person 1", id : "E" },
                         { name : "Person 2", id : "F" },
                         { name : "Person 3", id : "G" },
                         { name : "Person 4", id : "H" }
                         ]
                 },
                 { name: "simple", id: "G3", expanded: false, children:[
                         { name : "Tool 1", id : "I" },
                         { name : "Tool 2", id : "J" },
                         { name : "Tool 3", id : "K" },
                         { name : "Tool 4", id : "L" }
                         ]
                 },

                ];

    dp.heightSpec = "Max";
    dp.height = 500;

    dp.events.list = [];

    for (var i = 0; i < 12; i++) {
        var duration = Math.floor(Math.random() * 6) + 1; // 1 to 6
        var durationDays = Math.floor(Math.random() * 6) + 1; // 1 to 6
        var start = Math.floor(Math.random() * 6) + 2; // 2 to 7

        var e = {
            start: new DayPilot.Date("2018-05-05T00:00:00").addDays(start),
            end: new DayPilot.Date("2018-05-05T12:00:00").addDays(start).addDays(durationDays).addHours(duration),
            id: DayPilot.guid(),
            resource: String.fromCharCode(65+i),
            text: "Event " + (i + 1),
            bubbleHtml: "Event " + (i + 1),
            barColor: barColor(i),
            barBackColor: barBackColor(i)
        };

        dp.events.list.push(e);
    }

    dp.eventMovingStartEndEnabled = true;
    dp.eventResizingStartEndEnabled = true;
    dp.timeRangeSelectingStartEndEnabled = true;

    // event moving
    dp.onEventMoved = function (args) {
        dp.message("Moved: " + args.e.text());
    };

    dp.onEventMoving = function(args) {
        if (args.e.resource() === "A" && args.resource === "B") {  // don't allow moving from A to B
            args.left.enabled = false;
            args.right.html = "You can't move an event from Room 1 to Room 2";

            args.allowed = false;
        }
        else if (args.resource === "B") {  // must start on a working day, maximum length one day
            while (args.start.getDayOfWeek() == 0 || args.start.getDayOfWeek() == 6) {
                args.start = args.start.addDays(1);
            }
            args.end = args.start.addDays(1);  // fixed duration
            args.left.enabled = false;
            args.right.html = "Events in Room 2 must start on a workday and are limited to 1 day.";
        }

        if (args.resource === "C") {
            var except = args.e.data;
            var events = dp.rows.find(args.resource).events.all();

            var start = args.start;
            var end = args.end;
            var overlaps = events.some(function(item) {
                return item.data !== except && DayPilot.Util.overlaps(item.start(), item.end(), start, end);
            });

            while (overlaps) {
                start = start.addDays(1);
                end = end.addDays(1);

                overlaps = events.some(function(item) {
                    return item.data !== except && DayPilot.Util.overlaps(item.start(), item.end(), start, end);
                });
            }

            if (args.start !== start) {
                args.start = start;
                args.end = end;

                args.left.enabled = false;
                args.right.html = "Start automatically moved to " + args.start.toString("d MMMM, yyyy");
            }

        }

    };

    // event resizing
    dp.onEventResized = function (args) {
        dp.message("Resized: " + args.e.text());
    };

    // event creating
    dp.onTimeRangeSelected = function (args) {
        
        ModalRegistroReserva(args)

        DayPilot.Modal.prompt("New event name:", "New Event").then(function(modal) {
             
            dp.clearSelection();
            var name = modal.result;
            if (!name) return;
            var e = new DayPilot.Event({
                start: args.start,
                end: args.end,
                id: DayPilot.guid(),
                resource: args.resource,
                text: name
            });
            dp.events.add(e);
            dp.message("Created");
        }); 
    };

    dp.onEventMove = function(args) {
        if (args.ctrl) {
            var newEvent = new DayPilot.Event({
                start: args.newStart,
                end: args.newEnd,
                text: "Copy of " + args.e.text(),
                resource: args.newResource,
                id: DayPilot.guid()  // generate random id
            });
            dp.events.add(newEvent);

            // notify the server about the action here

            args.preventDefault(); // prevent the default action - moving event to the new location
        }
    };

    dp.init();

    dp.scrollTo("2018-01-01");*/

}


function VerRegistroReserva(variables) {
    global.objCliente = ''
    var el = yo`
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h4 class="modal-title"><strong>Nueva Reserva</strong></h4>
                </div>
                <div class="modal-body" id="modal_form">
                    <div class="row">
                        <div id="modal_error" class="callout callout-danger hidden">
                            <p> Es necesario llenar los campos marcados con rojo</p>
                        </div>
                    </div>
                    <div class="row"> 
                        <div class="col-sm-6">
                            <div class="box">
                                <div class="box-header">
                                    <h4>Datos de la Reserva</h4>
                                </div>
                                <div class="box-body">
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <div class="form-group">
                                                <label id="laDuracion">Duracion : ${new DayPilot.Date(variables.args.start.value).toString("dddd d MMMM yyyy", "es-es")} - ${new DayPilot.Date(variables.args.end.value).toString("dddd d MMMM yyyy", "es-es")}</label> 
                                            </div>
                                        </div>
                                    </div>
                                   
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <select id="Cod_TipoDoc" class="form-control input-sm">
                                                    ${variables.documentos.map(e=>
                                                        (e.Cod_TipoDoc==1 || e.Cod_TipoDoc == 7)?
                                                            yo`<option style="text-transform:uppercase" value="${e.Cod_TipoDoc}">${e.Nom_TipoDoc}</option>`
                                                        :
                                                            yo``
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-8">
                                            <div class="form-group"> 
                                                <input type="text" id="Nro_Documento" class="form-control input-sm required" onblur="${() => BuscarClienteDoc()}">
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-12">
                                            <div class="form-group">
                                                <label id="laCliente">Cliente</label>
                                                <div class="input-group input-group-sm">
                                                    <div class="input-group-btn">
                                                        <button type="button" class="btn btn-success" id="AgregarCliente"  onclick=${()=>NuevoCliente(variables.documentos)}>
                                                            <i class="fa fa-plus"></i>
                                                        </button>
                                                    </div>
                                                    <input type="text" id="Cliente" class="form-control required" data-id=null>
                                                    <div class="input-group-btn">
                                                        <button type="button" class="btn btn-info" id="BuscarCliente"  onclick=${()=>BuscarCliente("Cliente","Nro_Documento","001")}>
                                                            <i class="fa fa-search"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <div class="form-group">
                                                <label id="laNacionalidad">Nacionalidad</label>
                                                <select class="form-control" id="Nacionalidad">
                                                    ${variables.paises.map(e=> 
                                                        yo`<option style="text-transform:uppercase" value="${e.Cod_Pais}">${e.Nom_Pais}</option>`
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                    </div> 
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <div class="form-group">
                                                <label id="laTelefono">Telefono</label>
                                                <input type="text" class="form-control" id="Telefono">
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <div class="form-group">
                                                <label id="laEmail">Email</label>
                                                <input type="email" class="form-control" id="Email">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <div class="form-group">
                                                <label id="laDes_Reserva">Descripcion Reserva</label>
                                                <textarea type="text" class="form-control" id="Des_Reserva">
                                                </textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-4">
                                            <div class="form-group">
                                                <label id="laNroAdultos">Nro Adultos</label>
                                                <input type="number" class="form-control" id="NroAdultos">
                                            </div>
                                        </div>
                                        <div class="col-sm-4">
                                            <div class="form-group">
                                                <label id="laNroNinios">Nro Niños</label>
                                                <input type="number" class="form-control" id="NroNinios">
                                            </div>
                                        </div>
                                        <div class="col-sm-4">
                                            <div class="form-group">
                                                <label id="laNroInfantes">Nro Infantes</label>
                                                <input type="number" class="form-control" id="NroInfantes">
                                            </div>
                                        </div>
                                    </div>
                                     
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="box">
                                <div class="box-header">
                                    <h4>Datos de la Habitacion</h4>
                                </div>
                                <div class="box-body">
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <div class="form-group">
                                                <label id="laTipoHabitacion">Tipo de Habitacion : ${variables.datos_habitacion.tipo_habitacion}</label>
                                            </div>
                                        </div>
                                    </div>  
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <div class="form-group">
                                                <label id="laTarifa">Tarifa</label>
                                                <select class="form-control" id="Tarifa" onchange=${()=>CambioTarifa()}>
                                                    ${variables.datos_habitacion.tarifas.map(e=>yo`<option style="text-transform:uppercase" value="${e.Cod_Tarifa}">${e.Des_Tarifa}</option>`)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>                                   
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <div class="form-group">
                                                <label id="laCantidad">Cantidad</label>
                                                <select class="form-control" id="Cantidad" onchange=${()=>CambioCantidad(variables.datos_habitacion.precio)}>
                                                    ${Array(variables.datos_habitacion.cantidad).fill(null).map((u, i) => 
                                                        yo`<option value="${i+1}">${i+1}</option>`
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                    </div> 
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <div class="form-group">
                                                <label>Moneda: </label>
                                                <select id="Cod_Moneda" class="form-control input-sm">
                                                    ${variables.monedas.map(e=>yo`<option style="text-transform:uppercase" value="${e.Cod_Moneda}">${e.Nom_Moneda}</option>`)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <div class="form-group">
                                                <label id="laPrecio">Precio</label>
                                                <input type="number" class="form-control" id="Precio" value=${variables.datos_habitacion.precio}>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-12 text-right">
                                            <a href="javascript:void(0);" style="font-style: oblique;border-right: 1px solid;padding-right: 5px;padding-left: 5px;font-size: medium;">Unica Persona</a>                      
                                            <a href="javascript:void(0);" style="font-style: oblique;border-right: 1px solid;padding-right: 5px;padding-left: 5px;font-size: medium;">Grupo</a>                      
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12 text-right">
                              <a href="javascript:void(0);" style="font-style: oblique;border-right: 1px solid;padding-right: 5px;padding-left: 5px;font-size: medium;">Unica Persona</a>                      
                              <a href="javascript:void(0);" style="font-style: oblique;border-right: 1px solid;padding-right: 5px;padding-left: 5px;font-size: medium;">Grupo</a>                      
                        </div>
                    </div>
                </div>
                <div class="modal-footer text-center"> 
                    <button type="button" class="btn btn-success" onclick=${()=>ConfirmarReserva(variables)}>Reservar</button> 
                    <button type="button" class="btn btn-warning">Reservar temporalmente</button> 
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button> 
                </div>
            </div>
        </div>`

    var modal_proceso = document.getElementById('modal-proceso');
    empty(modal_proceso).appendChild(el);
    $('#modal-proceso').modal()
    $('#modal-proceso').on('hidden.bs.modal', function () {
        dp.clearSelection();
    })  

    $('#modal-superior').on('hidden.bs.modal', function () {

        if(global.objCliente !='' && global.objCliente){
            $("#Cod_TipoDocumento").val(global.objCliente.Cod_TipoDocumento)
            $("#Cliente").val(global.objCliente.Cliente)
            $("#Nro_Documento").val(global.objCliente.Nro_Documento)
            $("#Cliente").attr("data-id",global.objCliente.Id_ClienteProveedor)
        }
    })
}

function BuscarClienteDoc() {
    var Nro_Documento = document.getElementById('Nro_Documento').value
    var Cod_TipoDocumento = document.getElementById('Cod_TipoDoc').value
    var Cod_TipoCliente =  "001"
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Nro_Documento, Cod_TipoDocumento,Cod_TipoCliente
        })
    }
    fetch(URL + '/clientes_api/get_cliente_by_documento', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok' && res.data.cliente.length > 0) {
                global.objCliente = res.data.cliente[0]

                if(global.objCliente !='' && global.objCliente){
                    $("#Cod_TipoDocumento").val(global.objCliente.Cod_TipoDocumento)
                    $("#Cliente").val(global.objCliente.Cliente)
                    $("#Nro_Documento").val(global.objCliente.Nro_Documento)
                    $("#Cliente").attr("data-id",global.objCliente.Id_ClienteProveedor)
                     
                } 

            }
            H5_loading.hide()
        })
}

function CambioCantidad(precio){
    try{
    $("#Precio").val(parseFloat($("#Precio").val())*parseInt($("#Cantidad").val()))
    }catch(e){
        $("#Precio").val(precio)
    }
}

 
 
function dateDiffInDays(a, b) { 
  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

function ConfirmarReserva(variables){
    console.log(variables)
    var Cod_Reserva = "R0001"
    var Cod_Habitacion = variables.args.resource
    var Id_Huesped = parseInt($("#Cliente").attr("data-id"))
    var Cod_TipoHuesped = null
    var Item = 0
    var Cod_Tarifa = $("#Tarifa").val()
    var Monto = $("#Precio").val()
    var Des_Reserva = $("#Des_Reserva").val()
    var Cod_Moneda = $("#Cod_Moneda").val()
    var Cod_TipoReserva = "TR0001"
    //new DayPilot.Date(variables.args.start.value).toString("dddd d MMMM yyyy", "es-es")} - ${new DayPilot.Date(variables.args.end.value).toString("dddd d MMMM yyyy", "es-es")
    //var fecha_format = fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)
    var Fecha_Inicio = new DayPilot.Date(variables.args.start.value).toString("yyyy-mm-d", "es-es")
    var Fecha_Fin = new DayPilot.Date(variables.args.end.value).toString("yyyy-mm-d", "es-es")
    var Cod_EstadoReserva = "RESERVADO"
    var Nro_Adultos = $("#NroAdultos").val()
    var Nro_ninos = $("#NroNinios").val()
    var Nro_infantes = $("#NroInfantes").val()
    var CheckIn = null
    var CheckedOut = null
    var timeDiff = Math.abs(newDa.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    var Duracion = dateDiffInDays(new Date(Fecha_Fin), new Date(Fecha_Inicio));
    var Preferencias = null
	var ExtraCamas = 0
	var Proposito = null
	var Cod_Recurso = "CR001"
	var Cod_TipoRecurso = "CTR001" 
	var Cod_TipoLlegada = null
	var Detalle_Llegada = null
	var FechaHora_Llegada = null
	var Cod_TipoPartida = null
	var Detalle_Partida = null
	var FechaHora_Partida = null
	var Numero_Tarjeta = null
	var Cod_TipoTarjeta = null
	var Fecha_Vencimiento = null
	var CVC = null
	var Cod_EntidadFinanciera = null
	var Nro_Deposito = null 
	var Fecha_Cancelacion = null
	var Motivo_Cancelacion = null
	var Obs_Reserva = null
	var Cod_Grupo = null
	
    /*

    @Cod_Reserva varchar(32),
	@Cod_Habitacion varchar(32),
	@Id_Huesped int,
	@Cod_TipoHuesped varchar(32),
	@Item int,
	@Cod_Tarifa varchar(32),
	@Monto numeric(38,2),
	@Des_Reserva varchar(500),
	@Cod_Moneda varchar(32),
	@Cod_TipoReserva varchar(32),
	@Fecha_Inicio datetime,
	@Fecha_Fin datetime,
	@Cod_EstadoReserva varchar(32),
	@Nro_Adultos int,
	@Nro_ninos int,
	@Nro_infantes int,
	@CheckIn datetime,
	@CheckOut datetime,
	@Duracion int,
	@Preferencias varchar(1024),
	@ExtraCamas int,
	@Proposito varchar(1024),
	@Cod_Recurso varchar(32),
	@Cod_TipoRecurso varchar(32), 
	@Cod_TipoLlegada varchar(32),
	@Detalle_Llegada varchar(500),
	@FechaHora_Llegada datetime,
	@Cod_TipoPartida varchar(30),
	@Detalle_Partida varchar(500),
	@FechaHora_Partida datetime,
	@Numero_Tarjeta varchar(32),
	@Cod_TipoTarjeta varchar(32),
	@Fecha_Vencimiento datetime,
	@CVC varchar(32),
	@Cod_EntidadFinanciera varchar(32),
	@Nro_Deposito varchar(64), 
	@Fecha_Cancelacion datetime,
	@Motivo_Cancelacion varchar(512),
	@Obs_Reserva varchar(1024),
	@Cod_Grupo varchar(32) NULL,
	@Cod_UsuarioReg varchar(32),
	@Fecha_Reg datetime

    */

    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            Cod_Reserva,
            Cod_Habitacion,
            Id_Huesped,
            Cod_TipoHuesped = null
            Item = 0
            Cod_Tarifa = $("#Tarifa").val()
            Monto = $("#Precio").val()
            Des_Reserva = $("#Des_Reserva").val()
            Cod_Moneda = $("#Cod_Moneda").val()
            Cod_TipoReserva = "TR0001"
            //new DayPilot.Date(variables.args.start.value).toString("dddd d MMMM yyyy", "es-es")} - ${new DayPilot.Date(variables.args.end.value).toString("dddd d MMMM yyyy", "es-es")
            //var fecha_format = fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)
            var Fecha_Inicio = new DayPilot.Date(variables.args.start.value).toString("yyyy-mm-d", "es-es")
            var Fecha_Fin = new DayPilot.Date(variables.args.end.value).toString("yyyy-mm-d", "es-es")
            var Cod_EstadoReserva = "RESERVADO"
            var Nro_Adultos = $("#NroAdultos").val()
            var Nro_ninos = $("#NroNinios").val()
            var Nro_infantes = $("#NroInfantes").val()
            var CheckIn = null
            var CheckedOut = null
            var timeDiff = Math.abs(newDa.getTime() - date1.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
            var Duracion = dateDiffInDays(new Date(Fecha_Fin), new Date(Fecha_Inicio));
            var Preferencias = null
            var ExtraCamas = 0
            var Proposito = null
            var Cod_Recurso = "CR001"
            var Cod_TipoRecurso = "CTR001" 
            var Cod_TipoLlegada = null
            var Detalle_Llegada = null
            var FechaHora_Llegada = null
            var Cod_TipoPartida = null
            var Detalle_Partida = null
            var FechaHora_Partida = null
            var Numero_Tarjeta = null
            var Cod_TipoTarjeta = null
            var Fecha_Vencimiento = null
            var CVC = null
            var Cod_EntidadFinanciera = null
            var Nro_Deposito = null 
            var Fecha_Cancelacion = null
            var Motivo_Cancelacion = null
            var Obs_Reserva = null
            var Cod_Grupo = null
            
        })
    }
    fetch(URL + '/reservas_api/guardar_reserva', parametros)
        .then(req => req.json())
        .then(res => { 
            console.log(res)
        })
}

function RegistroReserva(args){ 
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
        })
    }
    fetch(URL + '/reservas_api/get_variables_reserva', parametros)
        .then(req => req.json())
        .then(res => { 
            var variables = res.data
            var datos_habitacion = {
                tipo_habitacion: "DOBLE",
                cantidad : 2,
                precio : 12,
                tarifas: [
                    {   
                        Cod_Tarifa:'TA0001',
                        Des_Tarifa:'Premium'
                    },
                    {   
                        Cod_Tarifa:'TA0002',
                        Des_Tarifa:'Clasica'
                    },
                    {   
                        Cod_Tarifa:'TA0003',
                        Des_Tarifa:'VIP'
                    }
                ]
            }
           
            variables['args'] = args
            variables['datos_habitacion'] = datos_habitacion
            VerRegistroReserva(variables)
        })
}

function CargarResources() {

    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
        })
    }
    fetch(URL + '/reservas_api/get_habitaciones', parametros)
        .then(req => req.json())
        .then(res => {
            DataHabitaciones(res.data.habitaciones,function(list){
                dp.resources = [
                    { name: list[0].tipo, id: list[0].Cod_Tipo, expanded: true,eventHeight:25, children:list[0].list},
                    { name: list[1].tipo, id: list[1].Cod_Tipo, expanded: true,eventHeight:25, children:list[1].list},
                    { name: list[2].tipo, id: list[2].Cod_Tipo, expanded: true,eventHeight:25, children:list[2].list},
                ]
                dp.update()
            })
           
        })
 
}
 
function CargarEvents() {
    var start = dp.visibleStart();
    var end = dp.visibleEnd();

    var data = [{
        id : '1',
        text : 'PRUEBA DE HABITACION',
        start : '2018-06-01',
        end : '2018-06-12',
        resource : 'AHHHHH',
        bubbleHtml : "Reservation details: <br/>",
        status : 'New',
        paid : '40',
    }]  
    dp.events.list = data;
    dp.update();    
}


function MostrarPorDias(dia){
    dp.startDate = nav.selectionDay.value
    dp.days = dia  
    dp.update()
}

function MostrarMes(){
    dp.startDate = nav.selectionDay.value
    dp.days = nav.startDate.daysInMonth()  
    dp.update()
}

function AjustarTamanio(){
    if ($(window).width() < 1350) {  
        dp.cellWidthSpec = 'Fixed'; 
    }else{
        dp.cellWidthSpec = 'Auto';
    }    
} 

function DataHabitaciones(data,callback){
    //console.log(data)
    var listTipos = []
    var listS = []
    var listM = []
    var listD = []
    for(var i = 0; i < data.length; i++) {
        var obj = data[i] 
        if(obj.Cod_Tipo == "TH002")
            listS.push({
                id:obj.Cod_Habitacion,
                name : obj.Cod_Habitacion + " " + obj.Des_Habitacion,
                capacity:obj.Capacidad,
                status: obj.Cod_EstadoHabitacion
            })
        else{
            if(obj.Cod_Tipo == "TH001"){
                listD.push({
                    id:obj.Cod_Habitacion,
                    name : obj.Cod_Habitacion + " " + obj.Des_Habitacion,
                    capacity:obj.Capacidad,
                    status: obj.Cod_EstadoHabitacion
                })
            }else{
                listM.push({
                    id:obj.Cod_Habitacion,
                    name : obj.Cod_Habitacion + " " + obj.Des_Habitacion,
                    capacity:obj.Capacidad,
                    status: obj.Cod_EstadoHabitacion
                })
            }
        }
        
    }
    listTipos.push({tipo:'Simple',Cod_Tipo:'TH002',list:listS})
    listTipos.push({tipo:'Doble',Cod_Tipo:'TH001',list:listD})
    listTipos.push({tipo:'Matrimonial',Cod_Tipo:'TH003',list:listM})
    callback(listTipos)
}

function LibroReservas(pCargarEfectivo) {
    H5_loading.show();
    Ver()
    H5_loading.hide();
    
    /*aCargarEfectivo = true
    const fecha = new Date()
    const mes = fecha.getMonth() + 1
    const dia = fecha.getDate() 
    var fecha_format = fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
        })
    }
    fetch(URL + '/cajas_api/get_caja_actual', parametros)
        .then(req => req.json())
        .then(res => {
            var caja = res.caja
            var turno = res.turno
            var arqueo = res.arqueo
            
            fetch(URL + '/cajas_api/arqueo_caja', parametros)
            .then(req => req.json())
            .then(res => { 
                Ver(fecha_format,caja,turno,arqueo,res.data.resumenpen,res.data.resumenusd)
                H5_loading.hide();
            })

        })*/

}



export { LibroReservas }