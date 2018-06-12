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
                        <div class="col-md-4 col-md-offset-2"> 
                            <button class="btn btn-success btn-sm btn-block" onclick=${()=>VerGenerarSeries(_Series,fecha,Stock,Cantidad)}>Generar Series</button>
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

function VerGenerarSeries(_Series,fecha,Stock,Cantidad){ 
    var el = yo`
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button> 
                    <h4 class="modal-title"><strong>Generar Series</strong></h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-sm-12"> 
                            <label class="col-sm-5 col-form-label">Serie Inicial</label>
                            <div class="col-sm-6">
                                <input type="text" class="form-control" id="SerieInicial">
                            </div>
                        </div>
                    </div> 
                    <div class="row">
                        <div class="col-sm-12"> 
                            <div class="col-sm-5"> 
                                <div class="radio">
                                    <label>
                                        <input type="radio" id="optionsGenerarSerie" name="optionsGenerarSerie" checked="checked" value="Cantidad" onchange="${()=>CambioGenerarSerie()}">Cantidad
                                    </label>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <input type="number" class="form-control" id="Cantidad">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12"> 
                            <div class="col-sm-5"> 
                                <div class="radio">
                                    <label>
                                        <input type="radio" id="optionsGenerarSerie" name="optionsGenerarSerie" value="SerieFinal" onchange="${()=>CambioGenerarSerie()}">Serie Final
                                    </label>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <input type="text" class="form-control" id="SerieFinal" onkeypress="${()=>CambioSerieFinal()}" disabled>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12"> 
                            <div class="col-md-6 col-md-offset-3"> 

                                <div class="form-group row">
                                    <label class="col-sm-1 col-form-label">a</label>
                                    <div class="col-sm-7">
                                    <input type="number" id="Dias" value="30" class="form-control-plaintext">
                                    </div>
                                    <label class="col-sm-2 col-form-label"> Dia(s)</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer text-center"> 
                        <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-info" id="btnAceptar" onclick=${()=>AceptarGenerarSerie()}>Aceptar</button>
                    </div>
                </div>              
            </div>
        </div>`

    var modal_proceso = document.getElementById('modal-superior');
    empty(modal_proceso).appendChild(el);
    $('#modal-superior').modal()   
}


function CambioGenerarSerie(){
    if($("input[name=optionsGenerarSerie]:checked").val()=="Cantidad"){
        $("#SerieFinal").attr("disabled",true)
        $("#Cantidad").attr("disabled",false)
        $("#Cantidad").val("")
        $("#SerieFinal").val("")
    }else{
        $("#SerieFinal").attr("disabled",false)
        $("#Cantidad").val("")
        $("#SerieFinal").val("")
    }
}

function CambioGenerarSerie(){
    try{
        $("#Cantidad").val(parseInt($("#SerieFinal").val())-parseInt($("#SerieInicial").val()))
    }catch(e){
        $("#Cantidad").val("0")
    }
}

function NumeroCeros(pCantidad){
    switch (pCantidad)
    {
        case 1:
            return "0";
        case 2:
            return "00";
        case 3:
            return "000";
        case 4:
            return "0000";
        case 5:
            return "00000";
        case 6:
            return "000000";
        case 7:
            return "0000000";
        case 8:
            return "00000000";
        case 9:
            return "000000000";
        case 10:
            return "0000000000";
        case 11:
            return "00000000000";
        case 12:
            return "000000000000";
        case 13:
            return "0000000000000";
        case 14:
            return "00000000000000";
        case 15:
            return "000000000000000";
        case 16:
            return "0000000000000000";
        case 17:
            return "00000000000000000";
        case 18:
            return "000000000000000000"; 
        default:
            return "";

    }
}

function AceptarGenerarSerie(){
    var pSerieInicial = "";
    var pPreFijo = "";
    var pNumero = "";
    pSerieInicial = $("#SerieInicial").val()
    pPreFijo = ExtraerTextoIzquierda(pSerieInicial)
    pNumero = ExtraerNumeroDerecha(pSerieInicial)
    /*$('#tablaBodySeries tr').each(function () {
        //pPreFijo + (Int64.Parse(pNumero) + j).ToString(NumeroCeros(pNumero.Length));
        $(this).find("td.Serie").find('input').val(pPreFijo +NumeroCeros(pNumero.length)+(parseInt(pNumero)+1))
        Date.prototype.addDays = function(days) {
            var dat = new Date(this.valueOf());
            dat.setDate(dat.getDate() + days);
            return dat;
          }
        const _fecha = new Date()
        _fecha.addDays(parseInt($("#Dias").val()))
        const mes = _fecha.getMonth() + 1
        const dia = _fecha.getDate()
        var fecha_now = _fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)

        $(this).find("td.Fecha").find('input').val(fecha_now)
        
    })*/

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

function ExtraerTextoIzquierda(pSerie){
    try{
        var _Serie = parseInt(pSerie);
        return "";
    }catch(e){
        return pSerie.substring(0, 1) + ExtraerTextoIzquierda(pSerie.substring(1, pSerie.Length - 1));
    }
}

function ExtraerNumeroDerecha(pSerie){
    try{
        var _Serie = parseInt(pSerie);
        return pSerie;
    }catch(e){
        return ExtraerNumeroDerecha(pSerie.substring(1, pSerie.Length - 1));
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