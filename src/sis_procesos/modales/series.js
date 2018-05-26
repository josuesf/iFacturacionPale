var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../constantes_entorno/constantes'

var aCantidad = 0
var NroDias = 60
var aStock

function VerAsignarSeries(_Series,fecha,Stock,Cantidad){ 
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
                            <button class="btn btn-success btn-sm btn-block" onclick=${()=>GenerarSeries()}>Generar Series</button>
                        </div>
                    </div>
                    <p></p>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="table-responsive">
                                <table id="tablaSeries" class="table table-bordered table-hover">
                                    <thead>
                                        <th>Series</th>
                                        <th>Vencimiento</th>
                                        <th>Observaciones</th>
                                    </thead>
                                    <tbody id="tablaBodySeries">
    
                                        ${_Series.length==0? yo`
                                        <tr>
                                            <td class="Serie"><input class="form-control" value=""></td>
                                            <td class="Fecha"><input class="form-control" type="date" value="${fecha}"></td>
                                            <td class="Observacion"><input class="form-control" type="text"></td>
                                        </tr>
                                        `:_Series.map(e=>yo`
                                        <tr>
                                            <td class="Serie"><input class="form-control" value="${e.Serie}"></td>
                                            <td class="Fecha"><input class="form-control" type="date" value="${e.Fecha}"></td>
                                            <td class="Observacion"><input class="form-control" type="text" value="${e.Observacion}"></td>
                                        </tr>
                                        `)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer text-center"> 
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-info" id="btnAceptar" onclick=${()=>AceptarAsignarSerie()}>Aceptar</button>
                </div>
            </div>
        </div>`

    var modal_proceso = document.getElementById('modal-otros-procesos');
    empty(modal_proceso).appendChild(el);
    $('#modal-otros-procesos').modal()   
}

function GenerarSeries(){
    
}

function AceptarAsignarSerie(){
    var arraySeries = []
    if(EsValido()){
        $('#tablaBodySeries tr').each(function () {
            var data = {}
            data['Serie'] = $(this).find("td.Serie").find('input').val()
            data['Fecha'] = $(this).find("td.Fecha").find('input').val()
            data['Observacion'] = $(this).find("td.Observacion").find('input').val()
            arraySeries.push(data)
            $('#modal-otros-procesos').modal('hide')
            global.arraySeries = arraySeries
        }) 
    }else{
        toastr.error('Debe de ingresar todas las series antes de salir de esta ventana','Error',{timeOut: 5000})
    }
}   

function EsValido(){
    var _EsValido = false
    $('#tablaBodySeries tr').each(function () {
        if($(this).find("td.Serie").find('input').val().trim()==""){
            return false
        }else{
            _EsValido = true
        }
    })
    return _EsValido
}

function AsignarSeriesModal(Cod_Almacen, Id_Producto,Cantidad,NroDias,_Series,fecha,Stock){ 
    H5_loading.show()
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            Id_Producto,
            Cod_Almacen
        })
    }
    fetch(URL+'/series_api/get_variables_series', parametros)
    .then(req => req.json())
    .then(res => {
        if (res.respuesta == 'ok') {
            Date.prototype.addDays = function(days) {
                var dat = new Date(this.valueOf());
                dat.setDate(dat.getDate() + days);
                return dat;
              }
            const _fecha = new Date()
            _fecha.addDays(NroDias)
            const mes = _fecha.getMonth() + 1
            const dia = _fecha.getDate()
            var fecha_now = _fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)
            VerAsignarSeries(_Series,fecha_now,Stock,Cantidad)
            H5_loading.hide()
        }
    })

    //VerAsignarSeries(CodAlmacen, IdProducto,Cantidad,NroDias)
}

export {  AsignarSeriesModal }