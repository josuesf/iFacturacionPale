var yo = require('yo-yo')
var empty = require('empty-element');
import { URL,URL_REPORT,NOMBRES_DOC } from '../../../constantes_entorno/constantes' 
import { ConvertirCadena,RUCValido } from '../../../../utility/tools' 

function Ver(){
    var el = yo`
            <div>
                <div class="content-header" id="sectionModals">
                    <div id="modal_detalle" class="modal fade" style="z-index: 999999;"> 
        
                    </div>
                </div>

                <section class="content">
                    <div class="row">
                        <div class="col-md-12"> 
                            <div class="card">
                                <div  class="card-head">
                                    <ul class="nav nav-tabs" id="tabs">
                                        <li class="active"><a href="#tabConsulta_1" id="idConsulta_1" data-toggle="tab" aria-expanded="true">Consulta tus comprobantes</a></li>
                                    </ul>
                                </div>
                                <div class="tab-content" id="tabs_contents" style="padding: 10px;">
                                    <div class="tab-pane active" id="tabConsulta_1">

                                        <div class="card-body">
                                            <div class="row">
                                                <div class="form">
                                                    <div class="col-md-12">
                                                        <div class="col-md-2">
                                                            <div class="form-group">
                                                                <label for="ct_fecha">DE FECHA</label>
                                                                <input type="date" class="form-control" id="ct_fecha1" min="1995-01-01" onblur="${()=> ValidarFecha('ct_fecha1')}">
                                                                
                                                            </div>
                                                        </div>
                                                        <div class="col-md-2">
                                                            <div class="form-group">
                                                                <label for="ct_fecha">A FECHA</label>
                                                                <input type="date" class="form-control" id="ct_fecha2" min="1995-01-01" onblur="${()=> ValidarFecha('ct_fecha2')}">
                                                            </div>
                                                        </div>  
                                                        <div class="col-md-2">
                                                            <div class="form-group">
                                                                <label for="ct_ruc_cliente">RUC CLIENTE</label>
                                                                <input type="number" class="form-control" id="ct_ruc_cliente" onblur=${()=>ValidarRUC()}>
                                                            </div>
                                                        </div> 
                                                        
                                                        <div class="col-md-2">
                                                            <div class="form-group">
                                                                <label for="ct_por_fecha">DOCUMENTO</label>
                                                                <select name="ct_tipo_doc" id="ct_tipo_doc" class="form-control" required>
                                                                <option value="01">FACTURA</option>
                                                                <option value="03">BOLETA DE VENTA</option>
                                                                <option value="07">NOTA DE CREDITO</option>
                                                                <option value="08">NOTA DE DEBITO</option>
                                                                <option value="09">GUIA DE REMISION</option>
                                                            </select>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-1">
                                                            <div class="form-group">
                                                                <label for="ct_anio">SERIE</label>
                                                                <input type="text" class="form-control" id="ct_serie_doc" maxlength="4" >
                                                            </div>
                                                        </div> 
                                                        <div class="col-md-1">
                                                            <div class="form-group">
                                                                <label for="ct_anio">NUMERO</label>
                                                                <input type="text" class="form-control" id="ct_numero_doc" maxlength="8" onkeypress="${()=> valida_num(event)}">
                                                            </div>
                                                        </div> 
                                                        <div class="col-md-2">
                                                            <div class="form-group">
                                                                <button class="btn btn-primary" type="button"  onclick=${()=>BuscarComprobantes()}><i class="fa fa-search"></i> BUSCAR</button>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                </div>
                                            </div>
                
                                            <div class="table-responsive">
                                                <form id="formTabla_cambios">
                                                    <table id="example1" class="table table-bordered table-striped">
                                                        <thead>
                                                            <tr>
                                                                <th>TIPO</th>
                                                                <th>SERIE</th>
                                                                <th>NUMERO</th>
                                                                <th>RUC, DNI, ETC.</th>
                                                                <th>DENOMINACION</th>
                                                                <th>MONTO</th>
                                                                <th>FECHA</th>
                                                                <th>OPCIONES</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody id="content_table_cambio">
                                                            <tr>
                                                                <td>BOLETA</td>
                                                                <td>F006</td>
                                                                <td>00000050</td>
                                                                <td>46354320</td>
                                                                <td>JUAN PEREZ</td>
                                                                <td>1200 S/.</td>
                                                                <td>12/12/2018</td>
                                                                <td>
                                                                        <span class="btn btn-xs btn-danger" onclick=${()=>VerInfoItem()}> PDF </span>
                                                                        <span class="btn btn-xs btn-success"> XML </span>
                                                                        <span class="btn btn-xs btn-info"> CDR </span>
                                                                        <span class="btn btn-xs btn-warning"><i class="fa fa-print"></i></span>
                                                                        <span class="btn btn-xs btn-primary"><i class="fa fa-envelope"></i></span>
                                                                </td>
                                                            </tr>
                                                        
                                                        </tbody>
                                                    </table>
                                                </form>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            <div>` 

    var container = document.getElementById('main-contenido')
    empty(container).appendChild(el);
}

function ValidarRUC(){
    RUCValido($("#ct_ruc_cliente").val(),function(flag){
        if(!flag){
            $('#ct_ruc_cliente').siblings('label').addClass('text-danger')
            $('#ct_ruc_cliente').focus()
        }else{
            $('#ct_ruc_cliente').siblings('label').removeClass('text-danger')
        }
    })
}
 
function ValidarFecha(id){
    var Fecha_aux = document.getElementById(id).value.split("-")
    var Fecha1 = new Date(parseInt(Fecha_aux[0]),parseInt(Fecha_aux[1]-1),parseInt(Fecha_aux[2]))
    var Limite = new Date(2000,1,1)
    var Hoy = new Date()
    if (isNaN(Fecha1)){
        $('#'+id).val('')
	}else{
		if (Fecha1 > Hoy || Fecha1 <Limite){
            $('#'+id).val('')
        }
    }
}

function VerInfoItem(){
    var detalles = `DATA DEL ITEM CLIQUEADO !`
    CrearPopUp('INFORMACION DEL COMPROBANTE',detalles)
}

function CrearPopUp(titulo,contenido){ 
    var el = yo`
        <div class="modal-dialog">
            <div class="modal-content modal-lg">
                <div class="modal-header text-center">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button> 
                    <h4 class="modal-title"><strong>${titulo}</strong></h4>
                </div>
                <div class="modal-body text-center">
                    ${contenido}
                </div>
                <div class="modal-footer">
                    <div class="btn-toolbar pull-right">
                        <div class="btn-group">
                            <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button> 
                        </div>
                    </div>
                </div>
            </div>
            <!-- /.modal-content -->
        </div>`


    var modal_proceso = document.getElementById('modal_detalle');
    empty(modal_proceso).appendChild(el);
    $('#modal_detalle').modal()
}

module.exports = function consulta_movimientos(ctx, next) {
    /*run_waitMe($('#base'), 1, "ios");
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        })
    }
    fetch(URL+'/movimientos_caja_api/get_movimientos', parametros)
        .then(req => req.json())
        .then(res => { 
            if (res.respuesta == 'ok') {
                Ver(res.data.movimientos,function(flag){
                    $('#base').waitMe('hide');
                })
            }
            else{
                
                toastr.error('Ocurrio un error. Actualice la pagina e intentelo nuevamente','Error',{timeOut: 5000})
                $('#base').waitMe('hide');
            }
            
        }).catch(function (e) {
            console.log(e);
            
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos. Inténtelo nuevamente refrescando la pantalla','Error',{timeOut: 5000})
            $('#base').waitMe('hide');
        });*/ 
    Ver()
    next();
} 