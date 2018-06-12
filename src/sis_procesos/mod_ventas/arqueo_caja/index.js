var empty = require('empty-element');
var yo = require('yo-yo');

import { URL } from '../../../constantes_entorno/constantes'
import { refrescar_movimientos } from '../../movimientos_caja'

var aCargarEfectivo = null


function Ver(fecha_hora,caja_actual,turno_actual,arqueo,resumenpen,resumenusd) {
    var el = yo`
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h4 class="modal-title"><strong>Arqueo de Caja</strong></h4>
                </div>
                <div class="modal-body"  id="modal_form"> 
                    <div class="row">
                        <div id="modal_error" class="callout callout-danger hidden">
                            <p> Es necesario llenar los campos marcados con rojo</p>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-sm-12">
                            <div class="box box-primary">
                                <div class="box-header with-border">
                                    <div class="col-md-4">
                                        <h3 class="box-title">Turno : ${turno_actual.Des_Turno}</h3>
                                    </div>
                                    <div class="col-md-8 text-right">
                                        <h3 class="box-title">Nro : 0000${arqueo.Numero}</h3>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label for="Cajero">Responsable</label>
                                                <input type="text" class="form-control" id="Cajero" disabled>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label for="Cod_Caja">Caja</label>
                                                <input type="text" class="form-control" id="Cod_Caja" value="${caja_actual.Des_Caja}" disabled>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label for="FechaHora">Fecha y Hora</label>
                                                <input type="date" class="form-control" id="FechaHora" value=${fecha_hora}>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> 
                    <div class="row">
                        <div class="col-sm-6">
                            <label></label>
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox" id="optEnvio" name="optEnvio"> Envio de Efectivo
                                </label>
                            </div>
                        </div>
                        ${arqueo.FlagCerrado?
                            yo`
                            <div class="col-sm-6">
                                <h2 class="text-red" id="laFlagCerrado"> ARQUEADO </h2>
                            </div>
                            `:yo``
                        }
                    </div>
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="box box-primary">
                                <div class="box-header with-border">
                                    <h3 class="box-title">Arqueo de Caja</h3>
                                </div>
                                <div class="box-body">
                                    <div class="row">
                                        <div class="col-md-5">
                                            <div class="nav-tabs-custom">
                                                <ul class="nav nav-tabs" id="tabsArqueoCaja">
                                                    <li class="active"><a href="#tabSoles" data-toggle="tab" id="tSoles" aria-expanded="true" onclick="${()=>CalcularSumaTotalSoles(resumenpen)}">Soles S/</a></li>
                                                    <li><a href="#tabDolares" data-toggle="tab" id="tDolares" aria-expanded="true" onclick="${()=>CalcularSumaTotalDolares(resumenusd)}">Dolares $</a></li>
                                                </ul>
                                                <div class="tab-content">
                                                    <div class="tab-pane active" id="tabSoles">
                                                        <div class="row">
                                                            <div class="box box-default">
                                                                <div class="box-body">
                                                                    <form id="formSumaTotalSoles">
                                                                        <div class="table-responsive">
                                                                            <table class="table table-bordered table-striped">
                                                                                <tbody> 
                                                                                    ${resumenpen.map(u => yo`
                                                                                    <tr name="filaSumaSoles">
                                                                                        <td><input class="form-control" type="text" value="${u.Nom_FormaPago}" name="tipo" disabled></td>
                                                                                        <td><input class="form-control" type="number" value="${u.Monto}" name="Monto" disabled></td> 
                                                                                    </tr>`)}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                                <div class="box-footer">
                                                                    <div class="row">
                                                                        <div class="col-md-12">
                                                                            <div class="col-md-6">
                                                                                <div class="form-group">
                                                                                    <label id="laSaldoTotalSoles"></label>
                                                                                    <input type="number" class="form-control required" id="SaldoTotalSoles" value="0.00" disabled>
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-md-6">
                                                                                <div class="form-group">
                                                                                    <label id="laDiferenciaSoles"></label>
                                                                                    <input type="number" class="form-control required" id="DiferenciaSoles"  disabled>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        
                                                        </div>
                                                    </div>
                                                    <div class="tab-pane" id="tabDolares">
                                                        <div class="row">
                                                            <div class="box box-default">
                                                                <div class="box-body">
                                                                    <form id="formSumaTotalDolares">
                                                                        <div class="table-responsive">
                                                                            <table class="table table-bordered table-striped">
                                                                                <tbody> 
                                                                                    ${resumenusd.map(u => yo`
                                                                                    <tr  name="filaSumaDolares">
                                                                                        <td><input  class="form-control" type="text" value="${u.Nom_FormaPago}" name="tipo" disabled></td>
                                                                                        <td><input  class="form-control" type="number" value="${u.Monto}" name="Monto" disabled></td>
                                                                                    </tr>`)}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                                <div class="box-footer">
                                                                    <div class="row">
                                                                        <div class="col-md-12">
                                                                            <div class="col-md-6">
                                                                                <div class="form-group">
                                                                                    <label id="laSaldoTotalDolares"></label>
                                                                                    <input type="number" class="form-control required" id="SaldoTotalDolares" value="0.00" disabled>
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-md-6">
                                                                                <div class="form-group">
                                                                                    <label id="laDiferenciaDolares"></label>
                                                                                    <input type="number" class="form-control required" id="DiferenciaDolares" disabled>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-7">
                                           
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <div class="nav-tabs-custom">
                                                        <ul class="nav nav-tabs" id="tabsArqueoCaja">
                                                            <li class="active"><a href="#tabSolesBilletes" id="tbSoles" data-toggle="tab" aria-expanded="true" onclick="${()=>CalcularSumaTotalSoles(resumenpen)}">Soles S/</a></li>
                                                            <li ><a href="#tabDolaresBilletes" id="tbDolares" data-toggle="tab" aria-expanded="true" onclick="${()=>CalcularSumaTotalDolares(resumenusd)}">Dolares $</a></li>
                                                        </ul>
                                                        <div class="tab-content">
                                                            <div class="tab-pane active" id="tabSolesBilletes">
                                                                <div class="row">
                                                                    <div class="box box-default">
                                                                    
                                                                        <div class="box-body">
                                                                            <div class="row">
                                                                                <div class="col-md-6">
                                                                                    <div class="form-group">
                                                                                        <label id="laCantidadBilletesSoles">Total en Soles S/</label>
                                                                                        <input class="form-control" type="number" id="CantidadBilletesSoles" value="0.00" onkeyup=${()=>CambioBilletesSoles()}>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="col-md-6">
                                                                                    <a href="javascript:void(0)" onclick=${()=>DistribuirSoles()}>Distribuir Automaticamente</a>
                                                                                </div>
                                                                            </div>
                                                                            <form id="formBilletesSoles">
                                                                                <div class="table-responsive" id="divTablaSoles">
                                                                                    <table class="table table-bordered table-striped" id="tablaSoles">
                                                                                        <thead>
                                                                                            <tr>
                                                                                                <th>Codigo</th>
                                                                                                <th>Billete</th>
                                                                                                <th>Cantidad</th>
                                                                                                <th>Total</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody> 
                                                                                        
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </form>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="tab-pane" id="tabDolaresBilletes">
                                                                <div class="box box-default">
                                                                    <div class="box-body">
                                                                        <div class="row">
                                                                            <div class="col-md-6">
                                                                                <div class="form-group">
                                                                                    <label id="laCantidadBilletesDolares">Total en Dolares USD</label>
                                                                                    <input class="form-control" type="number" id="CantidadBilletesDolares" value="0.00" onkeyup=${()=>CambioBilletesDolares()}>
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-md-6">
                                                                                <a href="javascript:void(0)" onclick=${()=>DistribuirDolares()}>Distribuir Automaticamente</a>
                                                                            </div>
                                                                        </div>

                                                                        <form id="formBilletesDolares">
                                                                            <div class="table-responsive" id="divTablaDolares">
                                                                                <table class="table table-bordered table-striped" id="tablaDolares">
                                                                                    <thead>
                                                                                        <tr>
                                                                                            <th>Billete</th>
                                                                                            <th>Cantidad</th>
                                                                                            <th>Total</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody> 
                                                                                    
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer text-center"> 
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                    ${!arqueo.FlagCerrado?
                        yo` <button type="button" class="btn btn-info" id="btnGuardar" onclick="${()=>ArquearCaja()}">Arquear</button>`:``
                    } 
                </div>
            </div>
        </div>`

    var modal_proceso = document.getElementById('modal-proceso');
    empty(modal_proceso).appendChild(el);
    $('#modal-proceso').modal()
    $('#Cajero').val($('#nick').text())
    CalcularSumaTotalSoles(resumenpen)
    CalcularSumaTotalDolares(resumenusd)
    CargarBilletes(arqueo)
}

function CargarModalConfirmacionArqueo(){
    var el = yo`
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
                <h4 class="modal-title"> Confirmacion </h4>
            </div>
            <div class="modal-body">
                <p>Esta Seguro que desea Arquear su Caja?</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="btnConfirmacion" onclick=${()=>AceptarConfirmacion()}>Aceptar</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>`


    var modal_proceso = document.getElementById('modal-alerta');
    empty(modal_proceso).appendChild(el);
    $('#modal-alerta').modal()
}

function LlenarTabla(billetes){
    var elsoles = yo`<table class="table table-bordered table-striped" id="tablaSoles">
        <thead>
            <tr>
                <th class="hidden">Codigo</th>
                <th>Billete</th>
                <th class="hidden">Valor</th>
                <th>Cantidad</th> 
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            ${billetes.map(u => 
                u.Cod_Moneda=="PEN"?
                    yo`
                    <tr id="${u.Cod_Billete}">
                        <td class="hidden"><input class="form-control" type="text" value="${u.Cod_Billete}" name="Cod_Billete"></td>
                        <td name="Nom_Billete" class="Nom_Billete"> ${u.Nom_Billete}</td>
                        <td class="hidden Valor"><input class="form-control" type="text" value="${u.Valor_Billete}" name="Valor_Billete"></td>
                        <td name="Cantidad" class="Cantidad"><input class="form-control" type="number" value="0.00" name="Cantidad" onkeypress=${()=>CambioCantidadSoles(u.Cod_Billete)}></td>
                        <td name="Total" class="Total"><input class="form-control" type="number" value="0.00" name="Total"></td>
                    </tr>`:yo``
                )}
            
        </tbody>

    </table>`
    
    var eldolares = yo`<table class="table table-bordered table-striped" id="tablaDolares">
        <thead>
            <tr>
                <th class="hidden">Codigo</th>
                <th>Billete</th>
                <th class="hidden">Valor</th>
                <th>Cantidad</th> 
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            ${billetes.map(u => 
                u.Cod_Moneda=="USD"?
                    yo`
                    <tr id="${u.Cod_Billete}">
                        <td class="hidden"><input class="form-control" type="text" value="${u.Cod_Billete}" name="Cod_Billete"></td>
                        <td name="Nom_Billete" class="Nom_Billete"> ${u.Nom_Billete} </td>
                        <td class="hidden Valor"><input class="form-control" type="text" value="${u.Valor_Billete}" name="Valor_Billete"></td>
                        <td name="Cantidad" class="Cantidad"><input class="form-control" type="number" value="0.00" name="Cantidad" onkeypress=${()=>CambioCantidadDolares(u.Cod_Billete)}></td>
                        <td name="Total" class="Total"><input class="form-control" type="number" value="0.00" name="Total"></td>
                    </tr>`:yo``
                )}
            
        </tbody>

    </table>`

    empty(document.getElementById('divTablaSoles')).appendChild(elsoles);
    empty(document.getElementById('divTablaDolares')).appendChild(eldolares);
    if(aCargarEfectivo){
        if(parseFloat($("#SaldoTotalSoles").val())>0){
            $("#laCantidadBilletesSoles").text("Total en Soles S/")
            $("#CantidadBilletesSoles").val($("#SaldoTotalSoles").val())
        }else{
            toastr.error('No puede realizar aun el Cierre verifique no tenga saldo final Menor a Cero y vuelta a intentarlo.\n\n','Error',{timeOut: 5000})
        }

        if(parseFloat($("#SaldoTotalDolares").val())>0){
            $("#laCantidadBilletesDolares").text("Total en Dolares USD")
            $("#CantidadBilletesDolares").val($("#SaldoTotalDolares").val())
        }else{
            toastr.error('No puede realizar aun el Cierre verifique no tenga saldo final Menor a Cero y vuelta a intentarlo.\n\n','Error',{timeOut: 5000})
        }
    }
}

function CambioBilletesSoles(){
    $("#DiferenciaSoles").val(parseFloat($("#CantidadBilletesSoles").val())-parseFloat($("#SaldoTotalSoles").val()))
}

function CambioBilletesDolares(){
    $("#DiferenciaDolares").val(parseFloat($("#CantidadBilletesDolares").val())-parseFloat($("#SaldoTotalDolares").val()))
}

function CambioCantidadSoles(idInput){
    var total = 0
    $("tr#"+idInput).find("td.Total").find("input").val(parseFloat($("tr#"+idInput).find("td.Valor").find("input").val())*parseFloat($("tr#"+idInput).find("td.Cantidad").find("input").val()))   
    $('#tablaSoles > tbody  > tr').each(function(){
        total = total + parseFloat($(this).find("td.Total").find("input").val())
    })
    $("#CantidadBilletesSoles").val(total)
    $("#DiferenciaSoles").val(parseFloat($("#CantidadBilletesSoles").val())-parseFloat($("#SaldoTotalSoles").val()))

}

function CambioCantidadDolares(idInput){
    var total = 0
    $("tr#"+idInput).find("td.Total").find("input").val(parseFloat($("tr#"+idInput).find("td.Valor").find("input").val())*parseFloat($("tr#"+idInput).find("td.Cantidad").find("input").val()))
    $('#tablaDolares > tbody  > tr').each(function(){
        total = total + parseFloat($(this).find("td.Total").find("input").val())
    })
    $("#CantidadBilletesDolares").val(total)
    $("#DiferenciaDolares").val(parseFloat($("#CantidadBilletesDolares").val())-parseFloat($("#SaldoTotalDolares").val()))
}
 

function CalcularSumaTotalSoles(resumen){
    var suma = 0
    for(var i=0;i<resumen.length;i++){
        if(resumen[i].FlagEfectivo=="1"){
            suma+=parseFloat(resumen[i].Monto)
        }
    }
    $("#laSaldoTotalSoles").text("SALDO : S/")
    $("#SaldoTotalSoles").val(suma)
    $("#laDiferenciaSoles").text("DIFERENCIA : S/")
    $("#DiferenciaSoles").val(-1*suma)
    //$("#tSoles").click()
    //$("#tbSoles").click()
}
 
function CalcularSumaTotalDolares(resumen){
    var suma = 0
    for(var i=0;i<resumen.length;i++){
        if(resumen[i].FlagEfectivo=="1"){
            suma+=parseFloat(resumen[i].Monto)
        }
    }
    $("#laSaldoTotalDolares").text("SALDO : USD ")
    $("#SaldoTotalDolares").val(suma)
    $("#laDiferenciaDolares").text("DIFERENCIA : USD ")
    $("#DiferenciaDolares").val(-1*suma)
    //$("#tDolares").click()
    //$("#tbDolares").click()
}

function DistribuirSoles(){
    var pSumaTotal = 0
    var pDiferencia = $("#CantidadBilletesSoles").val()
    $('#tablaSoles > tbody  > tr').each(function(){
        if(pDiferencia!=0){
            $(this).find("td.Cantidad").find("input").val(Math.trunc(pDiferencia/parseFloat($(this).find("td.Valor").find("input").val())))
            pSumaTotal+=parseFloat($(this).find("td.Valor").find("input").val())*parseFloat($(this).find("td.Cantidad").find("input").val())
            $(this).find("td.Total").find("input").val(parseFloat($(this).find("td.Valor").find("input").val())*parseFloat($(this).find("td.Cantidad").find("input").val()))
            if(pSumaTotal==parseFloat($("#CantidadBilletesSoles").val()))
                return false
            else
                pDiferencia = parseFloat($("#CantidadBilletesSoles").val()) - pSumaTotal
        }
    })
}

function DistribuirDolares(){
    var pSumaTotal = 0
    var pDiferencia = $("#CantidadBilletesDolares").val()
    $('#tablaDolares > tbody  > tr').each(function(){
        if(pDiferencia!=0){
            $(this).find("td.Cantidad").find("input").val(Math.trunc(pDiferencia/parseFloat($(this).find("td.Valor").find("input").val())))
            pSumaTotal+=parseFloat($(this).find("td.Valor").find("input").val())*parseFloat($(this).find("td.Cantidad").find("input").val())
            $(this).find("td.Total").find("input").val(parseFloat($(this).find("td.Valor").find("input").val())*parseFloat($(this).find("td.Cantidad").find("input").val()))
            if(pSumaTotal==parseFloat($("#CantidadBilletesDolares").val()))
                return false
            else
                pDiferencia = parseFloat($("#CantidadBilletesDolares").val()) - pSumaTotal
        }
    })
}

function CargarBilletes(arqueo){
    if(!arqueo.FlagCerrado){

        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
            })
        }
        fetch(URL + '/cajas_api/get_billetes', parametros)
            .then(req => req.json())
            .then(res => {
                //console.log("billetes")
                //console.log(res)
                LlenarTabla(res.data.billetes)
            })

    }else{

        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
            })
        }
        fetch(URL + '/cajas_api/get_detalle_arqueo', parametros)
            .then(req => req.json())
            .then(res => {
                //console.log("billetes1")
                //console.log(res)
                 LlenarTabla(res.data.billetes)
            })

    }
}

function esValido(){
    if(parseFloat($("#DiferenciaSoles").val())>-1){
        if(parseFloat($("#DiferenciaDolares").val())>-1){
            return true
        }else{
            toastr.error('La Diferencia en Dolares debe ser Mayor a -1.00','Error',{timeOut: 5000})
        }
    }else{
        toastr.error('La Diferencia en Soles debe ser Mayor a -1.00','Error',{timeOut: 5000})
    }
    return false
}

function ArquearCaja(){
    if(esValido()){
        CargarModalConfirmacionArqueo()
    }
    //AceptarConfirmacion()
}

function AceptarConfirmacion(){
    H5_loading.show();
    var Fecha = $("#FechaHora").val()
    var dataFormTS = $("#formSumaTotalSoles").serializeArray()
    var dataFormTD = $("#formSumaTotalDolares").serializeArray() 
    var dataBS = $("#formBilletesSoles").serializeArray()
    var dataBD = $("#formBilletesDolares").serializeArray()
    var totalBilletesSoles = $("#CantidadBilletesSoles").val()
    var totalBilletesDolares = $("#CantidadBilletesDolares").val()
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            Fecha, 
            dataFormTS,
            dataFormTD,
            totalBilletesSoles,
            totalBilletesDolares,
            dataBS,
            dataBD
        })
    }
    fetch(URL + '/cajas_api/guardar_arqueo', parametros)
        .then(req => req.json())
        .then(res => {
             console.log(res)
             $('#modal-alerta').modal('hide')
             H5_loading.hide();
        })
}

function NuevoArqueoCaja(pCargarEfectivo) {
    H5_loading.show();
    aCargarEfectivo = true
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

        })

}



export { NuevoArqueoCaja }