var empty = require('empty-element');
var yo = require('yo-yo');

import { URL } from '../../../constantes_entorno/constantes'
import { refrescar_movimientos } from '../../movimientos_caja' 

var dp = null
 
function Ver() {
    
    console.log($("ul#tabs").find("li > a#idReservas").length)
    if ($("ul#tabs").find("li > a#idReservas").length<=0){
        var tab = yo`
        <li class=""><a href="#tabReservas" data-toggle="tab" aria-expanded="false" id="idReservas">Reservas</a></li>`

        var tabContent = yo`
            <div class="tab-pane" id="tabReservas">
                <div class="row">
                    <div class="col-md-12">
                        <div class="box">
                            <div class="box-header">
                                <h4>Libro de Reservas</h4>
                            </div>
                            <div class="box-body">
                                <div class="row">
                                    <div class="col-sm-12">
                                        <div id="nav"></div>
                                    </div>
                                </div>
                                <div class="row"> 
                                    <div class="col-sm-12">
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
    }else{
        $("#idReservas").click()
    }

    dp = new DayPilot.Scheduler("dp")
    
    dp.locale = "es-es";
    dp.allowEventOverlap = false
    dp.days = dp.startDate.daysInMonth()
    loadTimeline(DayPilot.Date.today().firstDayOfMonth())

    dp.eventDeleteHandling = "Update"
    dp.timeHeaders = [
        { groupBy: "Month", format: "MMMM yyyy" },
        { groupBy: "Day", format: "d" }
    ]

    dp.eventHeight = 60
    dp.bubble = new DayPilot.Bubble({})

    dp.rowHeaderColumns = [
        {title: "Habitacion", width: 80},
        {title: "Capacidad", width: 80},
        {title: "Estado", width: 80}
    ];

    dp.separators = [
        { location: new DayPilot.Date(), color: "red" }
    ]

    dp.onBeforeResHeaderRender = function(args) {
        var beds = function(count) {
            return count + " bed" + (count > 1 ? "s" : "");
        };

        args.resource.columns[0].html = beds(args.resource.capacity);
        args.resource.columns[1].html = args.resource.status;
        switch (args.resource.status) {
            case "Dirty":
                args.resource.cssClass = "status_dirty";
                break;
            case "Cleanup":
                args.resource.cssClass = "status_cleanup";
                break;
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
                            loadResources();
                        };
                        modal.showUrl("room_edit.php?id=" + r.id);*/
                    },
                    v:"Hover",
                    css:"icon icon-edit",
                }];
    };

    dp.onBeforeEventRender = function(args) {
        var start = new DayPilot.Date(args.e.start);
        var end = new DayPilot.Date(args.e.end);

        var today = DayPilot.Date.today();
        var now = new DayPilot.Date();

        args.e.html = args.e.text + " (" + start.toString("M/d/yyyy") + " - " + end.toString("M/d/yyyy") + ")";

        switch (args.e.status) {
            case "New":
                var in2days = today.addDays(1);

                if (start < in2days) {
                    args.e.barColor = 'red';
                    args.e.toolTip = 'Expired (not confirmed in time)';
                }
                else {
                    args.e.barColor = 'orange';
                    args.e.toolTip = 'New';
                }
                break;
            case "Confirmed":
                var arrivalDeadline = today.addHours(18);

                if (start < today || (start.getDatePart() === today.getDatePart() && now > arrivalDeadline)) { // must arrive before 6 pm
                    args.e.barColor = "#f41616";  // red
                    args.e.toolTip = 'Late arrival';
                }
                else {
                    args.e.barColor = "green";
                    args.e.toolTip = "Confirmed";
                }
                break;
            case 'Arrived': // arrived
                var checkoutDeadline = today.addHours(10);

                if (end < today || (end.getDatePart() === today.getDatePart() && now > checkoutDeadline)) { // must checkout before 10 am
                    args.e.barColor = "#f41616";  // red
                    args.e.toolTip = "Late checkout";
                }
                else
                {
                    args.e.barColor = "#1691f4";  // blue
                    args.e.toolTip = "Arrived";
                }
                break;
            case 'CheckedOut': // checked out
                args.e.barColor = "gray";
                args.e.toolTip = "Checked out";
                break;
            default:
                args.e.toolTip = "Unexpected state";
                break;
        }

        args.e.html = args.e.html + "<br /><span style='color:gray'>" + args.e.toolTip + "</span>";

        var paid = args.e.paid;
        var paidColor = "#aaaaaa";

        args.e.areas = [
            { bottom: 10, right: 4, html: "<div style='color:" + paidColor + "; font-size: 8pt;'>Paid: " + paid + "%</div>", v: "Visible"},
            { left: 4, bottom: 8, right: 4, height: 2, html: "<div style='background-color:" + paidColor + "; height: 100%; width:" + paid + "%'></div>", v: "Visible" }
        ];

    };


    dp.init();

    loadResources();
    loadEvents();

   
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



function ModalRegistroReserva(args) {
    var el = yo`
        <div class="modal-dialog modal-full">
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
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="Cod_TipoDocumento">Tipo de documento *</label>
                                <select id="Cod_TipoDocumento"  class="form-control required">
                                    
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="Cod_TipoDocumento">Tipo de documento *</label>
                                <select id="Cod_TipoDocumento"  class="form-control required">
                                    
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="Cod_TipoDocumento">Tipo de documento *</label>
                                <select id="Cod_TipoDocumento"  class="form-control required">
                                    
                                </select>
                            </div>
                        </div>
                        
                    </div>
  
                     
                </div>
                <div class="modal-footer text-center"> 
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button> 
                </div>
            </div>
        </div>`

    var modal_proceso = document.getElementById('modal-superior');
    empty(modal_proceso).appendChild(el);
    $('#modal-superior').modal()
}

function loadResources() {

    var data = [{
        id : '1',
        name : 'PRUEBA DE HABITACION',
        capacity : '20',
        status : 'Dirty'
    }]
 
    dp.resources = data;
    dp.update(); 
}

function loadTimeline(date) {
    dp.scale = "Manual";
    dp.timeline = [];
    var start = date.getDatePart().addHours(12);

    for (var i = 0; i < dp.days; i++) {
        dp.timeline.push({start: start.addDays(i), end: start.addDays(i+1)});
    }
    dp.update();
}

function loadEvents() {
    var start = dp.visibleStart();
    var end = dp.visibleEnd();

    var data = [{
        id : '1',
        text : 'PRUEBA DE HABITACION',
        start : '2018-06-01',
        end : '2018-06-12',
        resource : '1',
        bubbleHtml : "Reservation details: <br/>",
        status : 'New',
        paid : '90%',
    }]  
    dp.events.list = data;
    dp.update(); 
    
}



function barColor(i) {
    var colors = ["#3c78d8", "#6aa84f", "#f1c232", "#cc0000"];
    return colors[i % 4];
}
function barBackColor(i) {
    var colors = ["#a4c2f4", "#b6d7a8", "#ffe599", "#ea9999"];
    return colors[i % 4];
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