var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../../constantes_entorno/constantes'
import { NuevoCliente, BuscarCliente , AbrirModalObs , BuscarProducto } from '../../modales'
import { AsignarSeriesModal } from '../../modales/series'
import { BuscarCuentasPendientes } from '../../modales/cuentas'
import { ConvertirCadena } from '../../../../utility/tools'

var listaFormaPago = []
var obs_xml = null
var aSaldo = 0
var contador = 0
var contadorPercepcion = 0
var idFilaSeleccionadaSerie = 0

function VerCuentas(variables,fecha_actual,CodLibro) {
    global.objCliente = ''
    global.objProducto = ''
    global.arraySeries = ''
    contador = 0
    contadorPercepcion = 0
    var el = yo`
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
                <h4 class="modal-title"><b>${CodLibro=='08'?'CUENTAS POR PAGAR':'CUENTAS POR COBRAR'}</b></h4>
            </div>
            <div class="modal-body" id="modal_form_ingreso">
                <div class="modal fade" id="modal_observaciones">
                    <div class="modal-dialog modal-sm" > 
                        <div class="modal-content" id="modal_obs_body"></div>
                    </div> 
                </div>
                <div class="row">
                    <div class="callout callout-danger hidden" id="modal_error_ingreso">
                        <p>Es necesario llenar todos los campos requeridos y el Importe mayor a cero</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-8">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h4> Cliente/Proveedor </h4>
                            </div>
                            <div class="panel-body">
                                <div class="row">
                                    <div class="col-md-4" id="divCodTipoDoc">
                                        <div class="form-group">
                                            <select id="Cod_TipoDoc" class="form-control input-sm">
                                                ${variables.dataDocumentos.map(e=>yo`<option style="text-transform:uppercase" value="${e.Cod_TipoDoc}">${e.Nom_TipoDoc}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-8" id="divNroDocumento">
                                        <div class="input-fromr">
                                            <input type="text" id="Nro_Documento" onblur="${() => BuscarClienteDoc(CodLibro)}" class="form-control input-sm required">
                                        </div>
                                    </div>
                               
                                </div>
                                <div class="row">
                                    <div class="col-md-12" id="divCliente">
                                        <div class="form-group">
                                            <label> Señor(es) : </label>
                                            <input type="text" id="Cliente" class="form-control input-sm required" data-id=null>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12" id="divDireccion">
                                        <div class="form-group">
                                            <label> Direccion : </label>
                                            <input type="text" id="Direccion" class="form-control input-sm required">
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div class="box-footer">
                                
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="panel panel-default" style="pointer-events:none;">
                            <div class="panel-heading text-center">
                                <div class="row">
                                    <h4 class="box-title" id="Ruc_Empresa"><strong> R.U.C. ${variables.empresa.RUC}</strong></h4>
                                </div>
                                <div class="row">
                                    <div class="col-sm-12">
                                        <div class="form-group">
                                            <select id="Cod_TipoComprobante" class="form-control selectPalerp">
                                                ${variables.dataComprobante.map(e=>yo`<option style="text-transform:uppercase" value="${e.Cod_TipoComprobante}">${e.Nom_TipoComprobante}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                </div> 
                                
                                <div class="row">
                                    <div class="col-md-5" id="divSerie">
                                        <div class="form-group">
 
                                            <select class="form-control input-sm" id="Serie">
                                                ${variables.dataComprobante.map(e=>yo`<option style="text-transform:uppercase" value="${e.Serie}">${e.Serie}</option>`)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-7" id="divNumero">
                                        <div class="form-group">
                                            <input type="text" class="form-control input-sm required" id="Numero" value="00000000${variables.dataMov[0].Numero}">
                                        </div>
                                    </div>
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-12">
                        <div class="panel panel-default">
                            <div class="panel-body">
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="col-sm-4" id="divContado">
                                                    <div class="radio">
                                                        <label>
                                                            <input type="radio" value="contado" id="optCredito" name="optCredito"  checked> Contado
                                                        </label>
                                                    </div>
                                                </div>
                                                 
                                                <div class="col-sm-8" id="divOperacion">
                                                    <label id="lbCuentaCajaBanco">#Operacion</label>
                                                    <div class="form-group">
                                                        <select class="form-control input-sm" id="Cod_CuentaBancaria"> 
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-4" id="divFormasPago">
                                                <div class="form-group">
                                                    <select class="form-control input-sm" id="Cod_FormaPago" onchange="${()=>CambioFormasPago(CodLibro)}"> 
                                                        ${variables.dataFormasPago.map(e=>yo`<option style="text-transform:uppercase" value="${e.Cod_FormaPago}">${e.Nom_FormaPago}</option>`)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-8" id="divCuentaCajaBancos">
                                                <div class="form-group">
                                                    <select class="form-control input-sm" id="Cuenta_CajaBancos"> 
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="row">
                                            <div class="col-sm-4" id="divMoneda">
                                                <div class="form-group">
                                                    <b>Moneda: </b>
                                                    <select id="Cod_Moneda" class="form-control input-sm">
                                                        ${variables.dataMonedas.map(e=>yo`<option style="text-transform:uppercase" value="${e.Cod_Moneda}">${e.Nom_Moneda}</option>`)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-sm-3" id="divTC">
                                                <div class="form-group">
                                                    <b>T/C: </b>
                                                    <input class="form-control input-sm" type="number" id="Tipo_Cambio" value="1.00">
                                                </div>
                                            </div>
                                            <div class="col-sm-5" id="divFecha">
                                                <div class="form-group">
                                                    <b>Fecha: </b>
                                                    <input type="date" class="form-control input-sm" id="Fecha" value="${fecha_actual}">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-12" id="divPlantilla" style="display:none">
                                                <div class="form-group">
                                                    <b>Plantilla: </b>
                                                    <select id="Cod_Plantilla" id="" class="form-control input-sm">
                                                      
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-4 col-md-4">
                                        <div class="panel panel-default">
                                            <div class="panel-body">
                                                <div class="row">
                                                    <div class="col-md-8 col-sm-8">
                                                        <div class="checkbox">
                                                            <label> 
                                                                <input type="checkbox" id="optFechas" checked> Todo 
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-4 col-sm-4">
                                                        <button class="btn btn-info" type="button">Ver</button>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-6 col-md-6">
                                                        <div class="form-group">
                                                            <b>Desde: </b>
                                                            <input type="date" id="Fecha" value="2018-06-06" class="form-control input-sm">
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6 col-md-6">
                                                        <div class="form-group">
                                                            <b>Hasta: </b>
                                                            <input type="date" id="Fecha" value="2018-06-06" class="form-control input-sm">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-4 col-md-4">
                                        <div class="panel panel-default">
                                            <div class="panel-body">
                                                <div class="row">
                                                    <div class="col-md-8 col-sm-8">
                                                        <div class="checkbox">
                                                            <label> 
                                                                <input type="checkbox" id="optFechas" checked> Todo 
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-4 col-sm-4">
                                                        <button class="btn btn-info" type="button">Ver</button>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-6 col-sm-6">
                                                        <div class="radio">
                                                            <label> 
                                                                <input type="radio" name="optRadios" id="optRadios" value="PorVencer"> Por vencer 
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6 col-sm-6">
                                                        <div class="radio">
                                                            <label> 
                                                                <input type="radio" name="optRadios" id="optRadios" value="Vencidos"> Vencidos 
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-4 col-md-4">
                                        <div class="panel panel-default">
                                            <div class="panel-body">
                                                <div class="row">
                                                    <div class="col-md-4 col-sm-4">
                                                        <div class="checkbox">
                                                            <label> 
                                                                <input type="checkbox" id="optFechas" checked> Todo 
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-8 col-sm-8">
                                                        <div class="checkbox">
                                                            <label> 
                                                                <input type="checkbox"> Solo Documentos Formales 
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-sm-8 col-md-8">
                                                        <div class="form-group"> 
                                                            <select class="form-control input-sm"></select>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-4 col-md-4">
                                                        <button class="btn btn-info" type="button">Ver</button>
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
                <div class="row">
                    <div class="col-sm-12">
                        <div class="panel panel-default">
                            <div class="panel-body">
                               
                            </div>
                            <div class="panel-footer">
                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="form-group row">
                                            <label class="col-sm-4 col-form-label">Comentarios:</label>
                                            <div class="col-sm-8">
                                                <input type="text" id="comentarios" class="form-control-plaintext input-sm form-control">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-8">

                                        <div class="form-group row">
                                            <label class="col-sm-1 col-form-label">Total</label>
                                            <div class="col-sm-10"> 
                                                <div class="col-sm-4">
                                                    <input type="number" class="form-control">
                                                </div>
                                                <div class="col-sm-4">
                                                    <input type="number" class="form-control">
                                                </div>
                                                <div class="col-sm-4">
                                                    <input type="number" class="form-control">
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
    
            <div class="modal-footer">
                <button class="btn btn-primary">${CodLibro=='08'?'Pagar':'Cobrar'}</button>
                <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>`
    var ingreso = document.getElementById('modal-proceso')
    empty(ingreso).appendChild(el)
    $('#modal-proceso').modal()  
    CambioFormasPago(CodLibro)
    if(global.objCliente =='')
        BuscarCuentasPendientes(CodLibro,0,'1753-01-01 00:00:00','9999-12-31 23:59:59.997')
    else{
        $("#Cod_TipoDocumento").val(global.objCliente.Cod_TipoDocumento)
        $("#Cliente").val(global.objCliente.Nom_Cliente)
        $("#Nro_Documento").val(global.objCliente.Doc_Cliente)
        $("#Cliente").attr("data-id",global.objCliente.Id_Cliente)
        $("#Cod_Moneda").val(global.objCliente.Cod_Moneda)
        CargarLicitacionesCliente(global.objCliente.Id_Cliente)
        BuscarPorFecha()
    }

    
    $('#modal-otros-procesos').on('hidden.bs.modal', function () { 
        if(global.objCliente!='' && global.arraySeries){ 
            $("#Cod_TipoDocumento").val(global.objCliente.Cod_TipoDocumento)
            $("#Cliente").val(global.objCliente.Nom_Cliente)
            $("#Nro_Documento").val(global.objCliente.Doc_Cliente)
            $("#Cliente").attr("data-id",global.objCliente.Id_Cliente)
            $("#Cod_Moneda").val(global.objCliente.Cod_Moneda)
            CargarLicitacionesCliente(global.objCliente.Id_Cliente)
            BuscarPorFecha()
        }
    }) 
}

function LlenarCuentaBancaria(cuentas){
    var html = ''
    for(var i=0; i<cuentas.length; i++){
        html = html+'<option value="'+cuentas[i].Cod_CuentaBancaria+'">'+cuentas[i].Des_CuentaBancaria+'</option>'
    }
     
    $("#Cod_CuentaBancaria").html('')
    $("#Cod_CuentaBancaria").html(html) 
}

function LlenarCuentaBancaria_(cuentas){
    var html = ''
    for(var i=0; i<cuentas.length; i++){
        html = html+'<option value="'+cuentas[i].NroCuenta_Bancaria+'">'+cuentas[i].CuentaBancaria+'</option>'
    }
     
    $("#Cod_CuentaBancaria").html('')
    $("#Cod_CuentaBancaria").html(html) 
}

function BuscarPorFecha(){
     
    /*

    try
            {
                dgvComprobanteD.Rows.Clear();
                DataTable dtXFormalizar = (cbTodoVencimiento.Checked ? aComprobante_pago.TraerCuentasPorPagarCobrar(int.Parse(tbNomCliente.Tag.ToString()),
                    aComprobante_pago.CodLibro,
                    (cbTodoFechas.Checked ? new DateTime(1753, 1, 1) : dtpFechaInicio.Value),
                    (cbTodoFechas.Checked ? DateTime.MaxValue : dtpFechaFinal.Value),
                    cbCodMoneda.SelectedValue.ToString(),
                    (cbTodoLicitacion.Checked ? null : cbCodLicitacion.SelectedValue.ToString())) :
                    aComprobante_pago.TraerCuentasPorPagarCobrar(int.Parse(tbNomCliente.Tag.ToString()),
                    aComprobante_pago.CodLibro,
                    (cbTodoFechas.Checked ? new DateTime(1753, 1, 1) : dtpFechaInicio.Value),
                    (cbTodoFechas.Checked ? DateTime.MaxValue : dtpFechaFinal.Value),
                    cbCodMoneda.SelectedValue.ToString(),
                    rbPorVencer.Checked,
                    (cbTodoLicitacion.Checked ? null : cbCodLicitacion.SelectedValue.ToString())));
                foreach (DataRow fila in dtXFormalizar.Rows)
                {
                    dgvComprobanteD.Rows.Add(fila[0], fila[1], fila[2], fila[3], fila[4], fila[5], 0.00, fila[5]);
                }
            }
            catch
            {
                KryptonMessageBox.Show("Debe de Selecionar un Cliente Proveedor", Principal.aTitulo, MessageBoxButtons.OK, MessageBoxIcon.Error);
            }

    */
}

function CambioFormasPago(CodLibro){
    if($("#Cod_FormaPago").val()!=null && $("#Cod_FormaPago").val()!=""){
        var flagDisplay="none"
        if($("#Cod_FormaPago").val()!="008")
            flagDisplay = "block"
        
        $("#divOperacion").css("display",flagDisplay)
        $("#Cod_CuentaBancaria").css("display",flagDisplay)
        $("#divCuentaCajaBancos").css("display",flagDisplay)

        if($("#divOperacion").css("display")=="block"){
            switch ($("#Cod_FormaPago").val()) {
                case "007":
                    if(CodLibro=="08"){
                        $("#lbCuentaCajaBanco").text("# de Cheque: ")
                        TraerCuentaBancariaPorSucursal()
                    }else{
                        toastr.error('No Existe la Operacion de CHEQUE para ventas.\nSe debe de Depositar el Cheque eh ingresarlo como Deposito en Cuenta.','Error',{timeOut: 5000})
                        $("#Cod_FormaPago").val(null)
                    }
                    break 
                case "011":
                    $("#Cod_CuentaBancaria").css("display","block")
                    $("#lbCuentaCajaBanco").text("# de Operacion")
                    if(CodLibro=="08"){
                        TraerCuentasBancariasXIdClienteProveedor()
                    }else{
                        TraerCuentaBancariaPorSucursal()
                    }
                    break
                case "001":
                    $("#lbCuentaCajaBanco").text("# de Letra: ")
                    break
                case "005":
                    $("#lbCuentaCajaBanco").text("# de Tarjeta VISA: ")
                    break
                case "006":
                    $("#lbCuentaCajaBanco").text("# de Tarjeta MASTER CARD: ")
                    break
                case "004":
                    $("#lbCuentaCajaBanco").text("# de Orden de Pago: ")
                    break
                case "003":
                    $("#Cod_CuentaBancaria").css("display","block")
                    $("#lbCuentaCajaBanco").text("Seleccione Transferencia: ")
                    TraerCuentaBancariaPorSucursal()
                    break
                case "008":
                    $("#divOperacion").css("display","none")
                    $("#Cod_CuentaBancaria").css("display","none")
                    $("#divCuentaCajaBancos").css("display","none")
                    break
                case "998":
                    $("#lbCuentaCajaBanco").text("Selecione Pago Adelantado: ")
                    TraerSaldoPagoAdelantado()
                    break
                default:
                    $("#lbCuentaCajaBanco").text("# de Operación: ")
                    break
            }
        }
    }
}
 

function TraerSaldoPagoAdelantado(){
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Id_ClienteProveedor:global.objCliente.Id_ClienteProveedor
        })
    }
    fetch(URL + '/compras_api/get_pago_adelantado', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var pagos_adelantados = res.data.pagos_adelantados
                if (pagos_adelantados.length>0){
                    LlenarPagosAdelantados(pagos_adelantados)
                }else{
                    $("#lbCuentaCajaBanco").text("No tienen Ningun Adelanto para Selecionar.")
                    $("#Cuenta_CajaBancos").html('')
                    $("#divCuentaCajaBancos").css("display","none")
                } 
            } 
        })
}

function TraerCuentasBancariasXIdClienteProveedor(){
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Id_ClienteProveedor:global.objCliente.Id_ClienteProveedor
        })
    }
    fetch(URL + '/cuentas_bancarias_api/get_cuenta_by_id_cliente', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var cuentas = res.data.cuentas
                LlenarCuentaBancaria_(cuentas)
            } 
        })
}


function TraerCuentaBancariaPorSucursal(){
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        })
    }
    fetch(URL + '/cuentas_bancarias_api/get_cuenta_by_sucursal', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var cuentas = res.data.cuentas
                LlenarCuentaBancaria(cuentas)
            } 
        })
}

function BuscarClienteDoc(CodLibro) {
    var Nro_Documento = document.getElementById('Nro_Documento').value
    var Cod_TipoDocumento = document.getElementById('Cod_TipoDoc').value
    var Cod_TipoCliente = CodLibro == "08" ? "001" : "002"
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
                    CargarLicitacionesCliente(global.objCliente.Id_ClienteProveedor)
                }
            }
            H5_loading.hide()
        })
}


function CargarLicitacionesCliente(Id_ClienteProveedor){
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Id_ClienteProveedor
        })
    }
    fetch(URL + '/clientes_api/get_licitaciones_by_cliente', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var licitaciones = res.data.licitaciones 
                if(licitaciones.length>0){
                    $("#divCodigoLicitacion").css("display","block")
                    $("#divLicitacion").css("display","block")
                    $("#optLicitacion").attr("checked",true)
                    LlenarLicitaciones(licitaciones)
                }else{
                    $("#divCodigoLicitacion").css("display","none")
                    $("#divLicitacion").css("display","none")
                    $("#optLicitacion").attr("checked",false)   
                }
            } 
        })
}
 
function Cuentas(Cod_Libro) {
    H5_loading.show(); 
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
            Cod_TipoComprobante :'RE',
            Id_Cliente: 0,
            Cod_Libro,
            FechaInicio:  '1753-01-01 00:00:00',
            FechaFin:  '9999-12-31 23:59:59.997',
        })
    }
    fetch(URL + '/recibo_iegreso_api/get_variables_cuentas_cobrar_pagar', parametros)
        .then(req => req.json())
        .then(res => {
            var variables = res.data
            const parametros = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                })
            }
            fetch(URL + '/cajas_api/get_empresa', parametros)
                .then(req => req.json())
                .then(res => {
                    var data_empresa = res.empresa
                    variables['empresa'] = data_empresa
                    VerCuentas(variables,fecha_format,Cod_Libro)
                    H5_loading.hide()
    
                })

        }) 
}

export { Cuentas }