var empty = require('empty-element');
var yo = require('yo-yo');
import { BuscarCliente } from './index'
import { URL } from '../../constantes_entorno/constantes'
import { LimpiarVariablesGlobales } from '../../../utility/tools'

function VerBuscarComprobatePago(CodLibro,tipos_comprobantes){ 
    LimpiarVariablesGlobales()
    var el = yo`
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button> 
                    <h4 class="modal-title"><strong>Buscar Comprobante de Pago</strong></h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-sm-12">
                            <label>RUC o Razon Social</label>
                            <div class="input-group">
                                <input type="text" class="form-control" value="" id="txtBusquedaModalComprobantePago" data-id=null>
                                <div class="input-group-btn">
                                    <button type="button" class="btn btn-success" onclick="${()=>BuscarCliente("txtBusquedaModalComprobantePago",null,null)}"><i class="fa fa-search"></i> Buscar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class=row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label>Comprobante</label>
                                <select id="TipoComprobante"  class="form-control">
                                    ${tipos_comprobantes.map(e=>yo`<option value="${e.Cod_TipoComprobante}">${e.Nom_TipoComprobante}</option>`)}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label>Serie</label>
                                <input type="text"  class="form-control required" id="SerieModalBusquedaComprobante">
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label>Numero</label>
                                <input type="text"  class="form-control required" id="NumeroModalBusquedaComprobante">
                            </div>
                        </div>
                    </div>                    
                </div>
                <div class="modal-footer text-center"> 
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-info" id="btnAceptar" onclick="${()=>AceptarComprobante(CodLibro)}">Aceptar</button>
                </div>
            </div>
        </div>`

    var modal_proceso = document.getElementById('modal-otros-procesos');
    empty(modal_proceso).appendChild(el);
    $('#modal-otros-procesos').modal()   

    $('#modal-superior').on('hidden.bs.modal', function () {

        if(global.objCliente !=''){ 
            $("#txtBusquedaModalComprobantePago").val(global.objCliente.Cliente) 
            $("#txtBusquedaModalComprobantePago").attr("data-id",global.objCliente.Id_ClienteProveedor)
        }
       
    })

}

function BuscarComprobantePago(CodLibro){

    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            CodLibro
        })
    }
    fetch(URL+'/comprobantes_pago_api/get_tipos_comprobantes', parametros)
    .then(req => req.json())
    .then(res => {
        if (res.respuesta == 'ok') {
            var tipos_comprobantes = res.data.tipos_comprobantes 
            VerBuscarComprobatePago(CodLibro,tipos_comprobantes)
        }
    }).catch(function (e) {
        console.log(e);
        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
    });
}

function AceptarComprobante(CodLibro){
    if(CodLibro=="08"){
        var Id_Cliente = $("#txtBusquedaModalComprobantePago").attr("data-id")
        var Cod_TipoComprobante = $("#TipoComprobante").val()
        var Serie = $("#SerieModalBusquedaComprobante").val()
        var Numero = $("#NumeroModalBusquedaComprobante").val()
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                Id_Cliente,
                Cod_TipoComprobante,
                Serie,
                Numero
            })
        }
        fetch(URL+'/comprobantes_pago_api/get_comprobante_by_cliente', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                if(res.data.length>0){
                    global.objComprobantePagoDetalle = {
                        Cod_TipoComprobante : Cod_TipoComprobante,
                        Serie : Serie,
                        Numero : Numero
                    }
                    global.objComprobantePago = res.data.comprobante[0]
                }else{
                    toastr.error('No existe Comprobante','Error',{timeOut: 5000})
                    $("#NumeroModalBusquedaComprobante").val("")
                    $("#NumeroModalBusquedaComprobante").focus()
                }
            }
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
        });

    }else{

        var Cod_TipoComprobante = $("#TipoComprobante").val()
        var Serie = $("#SerieModalBusquedaComprobante").val()
        var Numero = $("#NumeroModalBusquedaComprobante").val()
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                Cod_TipoComprobante,
                Serie,
                Numero,
                DocCliente : $("#txtBusquedaModalComprobantePago").val()
            })
        }
        fetch(URL+'/comprobantes_pago_api/get_comprobante_by_tipo', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                if(res.data.length>0){
                    global.objComprobantePagoDetalle = {
                        Cod_TipoComprobante : Cod_TipoComprobante,
                        Serie : Serie,
                        Numero : Numero,
                        DocCliente : $("#txtBusquedaModalComprobantePago").val()                        
                    }
                    global.objComprobantePago = res.data.comprobante[0]
                }else{
                    toastr.error('No existe Comprobante','Error',{timeOut: 5000})
                    $("#NumeroModalBusquedaComprobante").val("")
                    $("#NumeroModalBusquedaComprobante").focus()
                }
            }
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
        });

    }
}

export {  BuscarComprobantePago }