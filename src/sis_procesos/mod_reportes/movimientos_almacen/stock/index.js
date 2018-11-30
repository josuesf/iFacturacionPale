var empty = require('empty-element');
var yo = require('yo-yo'); 

import { URL, URL_REPORT } from '../../../../constantes_entorno/constantes'
import { BuscarCliente, BuscarProducto } from '../../../modales' 
import { MesActual } from '../../../../../utility/tools' 
var cantidad_tabs = 1
var arrayValidacion = [null,'null','',undefined]
global.variablesReporteStock = {}
var IdTabSeleccionado = null

function Ver(variables,CodLibro) {

    global.objCliente = ''
    global.objProducto = ''
    //cantidad_tabs++
    const idTabReporteStock = `ReporteStock_${cantidad_tabs}`
    IdTabSeleccionado=idTabReporteStock
    global.variablesReporteStock[idTabReporteStock]={idTab:idTabReporteStock,flag_cliente:false,flag_producto:false,excel:null, dataBase64:[]}
    
    var tab = yo`
    <li class="" onclick=${()=>TabSeleccionado(idTabReporteStock)}><a href="#tab_${idTabReporteStock}" data-toggle="tab" aria-expanded="false" id="id_${idTabReporteStock}">REPORTE DE STOCK <a style="padding-left: 10px;"  onclick=${()=>CerrarTabReporteStock(idTabReporteStock)} class="btn"><i class="fa fa-close text-danger"></i></a></a></li>`


    var el = yo`
        <div class="tab-pane" id="tab_${idTabReporteStock}">
            <div class="panel">
            <div class="modal"> 
                <div id="dialogo_docker_${idTabReporteStock}">
                    
                </div> 
           </div> 
                <div class="panel-body">
                    <div class="row">
                        <div class="col-md-4">
                             <div class="row">
                                <div class="form-group"> 
                                    <label>Seleccione un tipo de reporte</label>
                                    <select id="Cod_Opcion_${idTabReporteStock}" class="form-control"> 
                                        <option style="text-transform:uppercase" value="01">Stock Fisico</option> 
                                        <option style="text-transform:uppercase" value="02">Stock Fisico Valorizado</option> 
                                        <option style="text-transform:uppercase" value="03">Stock Total Fisico Valorizado</option> 
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="panel-group" id="accordion3_${idTabReporteStock}">
                                    <div class="card panel expanded">
                                        <div class="card-head card-head-sm collapsed" data-toggle="collapse" data-parent="#accordion3_${idTabReporteStock}" data-target="#accordion3-2_${idTabReporteStock}" aria-expanded="false">
                                            <header><i class="fa fa-filter"></i> Filtro de Fechas</header>
                                            <div class="tools">
                                                <a class="btn btn-icon-toggle"><i class="fa fa-angle-down"></i></a>
                                            </div>
                                        </div>
                                        <div id="accordion3-2_${idTabReporteStock}" class="collapse in" aria-expanded="true">
                                            <div class="card-body">	
                                                <form class="form">
                                                    <div class="row" id="divFiltroFechas_${idTabReporteStock}">
                                                    </div>
                                                </form>
                                            </div> 
                                        </div>
                                    </div><!--end .panel -->
                                    <div class="card panel">
                                        <div class="card-head card-head-sm" data-toggle="collapse" data-parent="#accordion3_${idTabReporteStock}" data-target="#accordion3-1_${idTabReporteStock}" aria-expanded="true">
                                            <header><i class="fa fa-filter"></i> Filtro de Oficinas y Cuentas</header>
                                            <div class="tools">
                                                <a class="btn btn-icon-toggle"><i class="fa fa-angle-down"></i></a>
                                            </div>
                                        </div>
                                        <div id="accordion3-1_${idTabReporteStock}" class="collapse" aria-expanded="true" style="">
                                            <div class="card-body">						
                                                <form class="form">
                                                    <div class="form-group">
                                                        <select id="Cod_Sucursal_${idTabReporteStock}" class="form-control" onchange=${()=>CambioSucursalReporte(idTabReporteStock)}>
                                                            <option value="">Seleccione Sucursal</option>
                                                            ${variables.sucursales.map(m=>
                                                                yo`<option value=${m.Cod_Sucursal}>${m.Nom_Sucursal}</option>`
                                                            )}
                                                        </select>
                                                        <label>Sucursal</label>
                                                    </div>
                                                    <div class="form-group">
                                                        <select id="Cod_Caja_${idTabReporteStock}" class="form-control">
                                                            
                                                        </select>
                                                        <label>Caja</label>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <div class="form-group">
                                                                <select id="Cod_Moneda_${idTabReporteStock}" class="form-control">
                                                                    <option value="">Seleccione moneda</option>
                                                                    ${variables.monedas.map(m=>
                                                                        yo`<option value=${m.Cod_Moneda}>${m.Nom_Moneda}</option>`
                                                                    )}
                                                                </select>
                                                                <label>Moneda</label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </form>
                                            </div> 
                                        </div>
                                    </div><!--end .panel -->
                                    <div class="card panel">
                                        <div class="card-head card-head-sm collapsed" data-toggle="collapse" data-parent="#accordion3_${idTabReporteStock}" data-target="#accordion3-3_${idTabReporteStock}" aria-expanded="false">
                                            <header><i class="fa fa-filter"></i> Filtro Stock y Activo </header>
                                            <div class="tools">
                                                <a class="btn btn-icon-toggle"><i class="fa fa-angle-down"></i></a>
                                            </div>
                                        </div>
                                        <div id="accordion3-3_${idTabReporteStock}" class="collapse" aria-expanded="false">
                                            <div class="card-body">	
                                                <form class="form">	
                                                    <div class="form-group">
                                                            <div class="checkbox checkbox-styled">
                                                                <label>
                                                                    <input type="checkbox" id="pro_ser_activos" checked="checked">
                                                                    <span>Productos y/o Servicios Activos</span>
                                                                </label>
                                                            </div>
                                                            <div class="checkbox checkbox-styled">
                                                                <label>
                                                                    <input type="checkbox" id="pro_ser_stock_0">
                                                                    <span>Incluir Producto y/o Servicio con Stock 0</span>
                                                                </label>
                                                            </div>
                                                            <div class="checkbox checkbox-styled">
                                                                <label>
                                                                    <input type="checkbox" id="pro_ser_sobregir">
                                                                    <span>Productos y/o Servicios que tengan Sobregirados</span>
                                                                </label>
                                                            </div>
                                                       
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div><!--end .panel -->
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-xs-12">
                                    <button type="button" class="btn btn-primary btn-block" onclick=${()=>GenerarReporte(idTabReporteStock,CodLibro,true,'Excel')}><i class="fa fa-file-o"></i> Ver vista previa Excel del documento</button>
                                </div>
                            </div> 
                          
                            <br>
                            <div class="row">
                                <div class="col-xs-12">
                                    <button type="button" class="btn btn-danger btn-block" onclick=${()=>GenerarReporte(idTabReporteStock,CodLibro,true,'PDF')}><i class="fa fa-file-pdf-o"></i> Ver vista previa PDF del documento</button>
                                </div>
                            </div> 
                            <br>
                            <div class="row">
                                <div class="col-xs-12">
                                    <button type="button" class="btn btn-info btn-block hidden" id="btnAbrirNavegador_${idTabReporteStock}" onclick=${()=>AbrirReporte(idTabReporteStock,CodLibro)}><i class="fa fa-eye"></i> Abrir documento en otra pestaña</button>
                                </div>
                            </div> 
                            <br>
                            <div class="row">
                                <div class="col-xs-12">
                                    <button type="button" class="btn btn-success btn-block hidden" id="btnEnviarCorreo_${idTabReporteStock}" onclick=${()=>AbrirDialogoEnviarMensaje(idTabReporteStock,CodLibro)} ><i class="fa fa-envelope"></i> Enviar por correo</button>
                                </div>
                            </div> 
                        </div>
                        <div class="col-md-8"> 
                            <br>
                            <div class="row">
                                <div class="col-xs-12">
                                    <div id="divExcel_${idTabReporteStock}" class="text-center hidden" style="height: 600px;" >
                            
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>`

    if($("#tab_"+idTabReporteStock).length){   
        $('#tab_'+idTabReporteStock).remove()
        $('#id_'+idTabReporteStock).parents('li').remove()

        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    }else{
        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    } 
    $("#id_"+idTabReporteStock).click() 

    $('#modal-superior').off('hidden.bs.modal').on('hidden.bs.modal', function () {
        if(global.objProducto!=''){
            $("#Producto_"+IdTabSeleccionado).val(global.objProducto.Nom_Producto)
            $("#Producto_"+IdTabSeleccionado).attr("data-id",global.objProducto.Id_Producto)
            global.variablesReporteStock[IdTabSeleccionado].flag_producto = true 
        }

        if(global.objCliente!=''){
            $("#Cliente_"+IdTabSeleccionado).val(global.objCliente.Cliente)
            $("#Cliente_"+IdTabSeleccionado).attr("data-id",global.objCliente.Id_ClienteProveedor)
            global.variablesReporteStock[IdTabSeleccionado].flag_cliente = true
        }
    })
    CambioOpcionesFecha(idTabReporteStock)

}

function LlenarCajas(cajas,idTab){
    $("#Cod_Caja_"+idTab).html('')
    var html = '<option value="">Seleccione Caja</option>'
    for(var i=0; i<cajas.length; i++){
        html = html+'<option value="'+cajas[i].Cod_Caja+'">'+cajas[i].Des_Caja+'</option>'
    }
    $("#Cod_Caja_"+idTab).html(html) 
}
function CambioOpcionesFecha(idTab){
    let el = yo`
    <div>
        <div class="row">
            <div class="col-md-12">
                <div class="form-group"> 
                    <input type="date" class="form-control" id="FechaInicio_${idTab}" value="${MesActual('')}">
                    <label>A la fecha:</label>
                </div>
            </div>
        </div>
    </div>
    `
    let contenedor = document.getElementById('divFiltroFechas_'+idTab);
    empty(contenedor).appendChild(el); 

}

function CambioSucursalReporte(idTab){
    var Cod_Sucursal = $("#Cod_Sucursal_"+idTab).val()
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Cod_Sucursal
        })
    }
    fetch(URL + '/cajas_api/get_caja_by_sucursal', parametros)
        .then(req => req.json())
        .then(res => { 
            if(res.respuesta=='ok'){
                LlenarCajas(res.data.cajas,idTab)
            }else{
                $("#Cod_Caja_"+idTab).html('')
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos',{timeOut: 5000}) 
            }
        }).catch(function (e) {
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000}) 
        });
}


function TabSeleccionado(idTab){
    global.objCliente = ''
    global.objProducto = ''
    IdTabSeleccionado = idTab 
}

function CerrarTabReporteStock(idTab){ 
    $('#tab_'+idTab).remove()
    $('#id_'+idTab).parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show');
    delete global.variablesReporteStock[idTab]
    IdTabSeleccionado = null
}

function AbrirReporte(idTab,Cod_Libro){
   
    if(global.variablesReporteStock[idTab].excel){
        if(global.variablesReporteStock[idTab].excel!=null){
            var tabOrWindow = window.open(global.variablesReporteStock[idTab].excel, '_blank');
            tabOrWindow.focus();
        }else{
            if(global.variablesReporteStock[idTab].pdf!=null){
                let pdfWindow = window.open("")
                pdfWindow.document.write("<iframe width='100%' height='100%' src='"+global.variablesReporteStock[idTab].pdf.replace('data:null','data:application/pdf')+"'></iframe>")
            }else{
                toastr.error('No se puede abrir el documento','Error',{timeOut: 5000}) 
            } 
        }
    }else{
        if(global.variablesReporteStock[idTab].pdf){
            if(global.variablesReporteStock[idTab].pdf!=null){ 
                let pdfWindow = window.open("")
                pdfWindow.document.write("<iframe width='100%' height='100%' src='"+global.variablesReporteStock[idTab].pdf.replace('data:null','data:application/pdf')+"'></iframe>")
            }else{
                toastr.error('No se puede abrir el documento','Error',{timeOut: 5000}) 
            }
        }else{
            toastr.error('No se puede abrir el documento','Error',{timeOut: 5000}) 
        }
    }
} 

function AbrirDialogoEnviarMensaje(idTab,Cod_Libro){
    var el = yo`
        <div class="row" id="dialogo_${idTab}">
            <div class="col-sm-12 col-md-12 col-lg-12">
                <div class="alert alert-callout alert-danger hidden" id="divError_${idTab}">
                    <p id="textError_${idTab}"> </p>
                </div>
            </div>
            <div class="col-sm-12 col-md-12 col-lg-12">
                <form class="form" id="formCompose">
                    <div class="form-group floating-label">
                        <input type="email" class="form-control dirty" id="email_${idTab}">
                        <label>Para</label>
                    </div>
                    <div class="form-group floating-label">
                        <input type="text" class="form-control dirty" id="asunto_${idTab}" value="Reporte ${$("#Cod_Opcion_"+idTab+" option:selected").text()}">
                        <label>Asunto</label>
                    </div>
                    <div class="form-group floating-label">
                        <textarea type="text" class="form-control dirty" id="mensaje_${idTab}">Se le adjunta el formato pdf y excel del reporte ${$("#Cod_Opcion_"+idTab+" option:selected").text()}</textarea>
                        <label>Mensaje</label>
                    </div>
                    <div class="form-group">
                    </div>
                </form>
            </div>
            <div class="col-sm-12 col-md-12 col-lg-12"> 
                <em class="text-caption">Archivos para enviar:</em>
            </div>
            <div class="col-sm-12 col-md-12 col-lg-12" id="listReportes_${idTab}">
            </div> 

        </div>`
    var container = document.getElementById('dialogo_docker_'+idTab)
    empty(container).appendChild(el);

    $("#dialogo_docker_"+idTab).dockmodal({
        id: idTab,
        initialState: "docked",
        title: "Mensaje Nuevo",
        buttons: [
            {
                html: "<i class='md md-send'></i> Enviar",
                buttonClass: "btn btn-sm btn-primary ink-reaction",
                click: function (e, dialog) {  
                    run_waitMe($('#dialogo_docker_'+idTab), 1, "ios","Enviando correo espere un momento....");

                    const parametros = {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        credentials: 'same-origin',
                        body: JSON.stringify({
                            email:$("#email_"+idTab).val(),
                            subject:$("#asunto_"+idTab).val(),
                            message:$("#mensaje_"+idTab).val(),
                            arregloAttachment:global.variablesReporteStock[idTab].dataBase64
                        })
                        
                    }
                    fetch(URL + '/empresa_api/send_email_report', parametros)
                        .then(req => req.json())
                        .then(res => { 
                            if(res.respuesta=='ok'){
                                dialog.dockmodal("close");
                                global.variablesReporteStock[idTab].dataBase64=[] 
                                toastr.success('Se envio correctamente el mensaje','Confirmacion',{timeOut: 5000})
                            }else{
                                $("#divError_"+idTab).removeClass("hidden")
                                if(res.detalle_error.code=='EENVELOPE'){
                                    $("#textError_"+idTab).text("Necesita un email de destinatario")
                                }else{
                                    $("#textError_"+idTab).text(res.detalle_error.command)
                                }
                                $("#divError_"+idTab).focus()
                            }
                            $('#dialogo_docker_'+idTab).waitMe('hide');
                        }).catch(function (e) {
                            $("#divError_"+idTab).removeClass("hidden")
                            $("#textError_"+idTab).text(e)
                            $('#dialogo_docker_'+idTab).waitMe('hide');
                        });
                }
            }
        ]
    }); 
    GenerarReporteEmail(idTab,Cod_Libro,false)
}
function LlenarReportesCorreo(idTab,tituloReporte){
    var el = yo`<ul class="list divider-full-bleed" id="listReportes_${idTab}">
            ${global.variablesReporteStock[idTab].dataBase64.map((e,index) => 
                     yo`<li class="tile">
                            <a class="tile-content ink-reaction">
                                <div class="tile-icon">
                                    <i class=${e.tipo=="Excel"?"fa fa-file-excel-o":"fa fa-file-pdf-o"}></i> 
                                </div>
                                <div class="tile-text">
                                    ${tituloReporte} ${e.tipo=="Excel"?"(EXCEL)":"(PDF)"}
                                    <div class="progress progress-hairline">
                                        <div class="progress-bar progress-bar-primary-dark" style="width:100%"></div>
                                    </div>
                                </div>
                            </a>
                            <a class="btn btn-flat ink-reaction" onclick=${()=>EliminarReporteCorreo(idTab,e,tituloReporte)}>
                                <i class="md md-delete"></i>
                            </a>
                        </li>`
            )}
            </ul>`
        var container = document.getElementById('listReportes_'+idTab)
        empty(container).appendChild(el);
}

function EliminarReporteCorreo(idTab,reporte,titulo){
    for (var i in global.variablesReporteStock[idTab].dataBase64) { 
        if (global.variablesReporteStock[idTab].dataBase64[i].tipo == reporte.tipo) {
            global.variablesReporteStock[idTab].dataBase64.splice(i, 1)
            break 
        }
    } 
    LlenarReportesCorreo(idTab,titulo) 
}

function GenerarReporteEmail(idTab,Cod_Libro,flag_preview){
    global.variablesReporteStock[idTab].dataBase64=[]
    run_waitMe($('#dialogo_docker_'+idTab), 1, "ios","Subiendo reporte para su envio....");
    switch($("#Cod_Opcion_"+idTab).val()){
        case '01': 
            ReporteGeneralEmail(idTab,Cod_Libro,"ReporteStockFisico_Excel",null,flag_preview,function(flag,result){ 
                if(flag){
                    ReporteGeneralEmail(idTab,Cod_Libro,"ReporteStockFisico_PDF",null,flag_preview,function(flag,result){
                        if(flag){
                            LlenarReportesCorreo(idTab,$("#Cod_Opcion_"+idTab+" option:selected").text())
                            $('#dialogo_docker_'+idTab).waitMe('hide')
                        }else
                        {
                            $('#dialogo_docker_'+idTab).waitMe('hide')
                        }
                    })
                }else{
                    $('#dialogo_docker_'+idTab).waitMe('hide')
                }
            })
            break
        case '02':
            ReporteGeneralEmail(idTab,Cod_Libro,"ReporteStockFisicoValorizado_Excel",null,flag_preview,function(flag,result){ 
                if(flag){
                    ReporteGeneralEmail(idTab,Cod_Libro,"ReporteStockFisicoValorizado_PDF",null,flag_preview,function(flag,result){
                        if(flag){
                            LlenarReportesCorreo(idTab,$("#Cod_Opcion_"+idTab+" option:selected").text())
                            $('#dialogo_docker_'+idTab).waitMe('hide')
                        }else{
                            $('#dialogo_docker_'+idTab).waitMe('hide')
                        }
                    })
                }else{
                    $('#dialogo_docker_'+idTab).waitMe('hide')
                }
            })
            break
        case '02':
        ReporteGeneralEmail(idTab,Cod_Libro,"ReporteStockTotalFisicoValorizado_Excel",null,flag_preview,function(flag,result){ 
            if(flag){
                ReporteGeneralEmail(idTab,Cod_Libro,"ReporteStockTotalFisicoValorizado_PDF",null,flag_preview,function(flag,result){
                    if(flag){
                        LlenarReportesCorreo(idTab,$("#Cod_Opcion_"+idTab+" option:selected").text())
                        $('#dialogo_docker_'+idTab).waitMe('hide');
                    }else{
                        $('#dialogo_docker_'+idTab).waitMe('hide');
                    }
                })
            }else{
                $('#dialogo_docker_'+idTab).waitMe('hide');
            }
        })
        break
    }
}

function ReporteGeneralEmail(idTab,Cod_Libro,TipoReporte,ParametroOrden,flag_preview,callback){
    var Cod_UnidadMedida = null
    var Cod_Almacen = null
    var Cod_Moneda = arrayValidacion.includes($("#Cod_Moneda_"+idTab).val())?null:$("#Cod_Moneda_"+idTab).val()
    var Cod_Categoria_producto = null
    var Cod_Marca = null
    var Flag_Activos="0"
    var Flag_IncluirCero="0"
    var Flag_SoloNegativos="0"
    if ($('#pro_ser_activos').is(':checked')){
        Flag_Activos= '1'
    }
    else
    {
        Flag_Activos= '0'
    }
    if ($('#pro_ser_stock_0').is(':checked')){
        Flag_IncluirCero= '1'
    }
    else
    {
        Flag_IncluirCero= '0'
    }
    if ($('#pro_ser_sobregir').is(':checked')){
        Flag_SoloNegativos= '1'
    }
    else
    {
        Flag_SoloNegativos= '0'
    }
    var Cod_Caja = arrayValidacion.includes($("#Cod_Caja_"+idTab).val())?null:$("#Cod_Caja_"+idTab).val()
    var FechaLimite = arrayValidacion.includes($("#FechaInicio_"+idTab).val())?null:$("#FechaInicio_"+idTab).val()
    let arregloFechaLimite= FechaLimite.split('T')[0]
    FechaLimite= arregloFechaLimite
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Cod_UnidadMedida,
            Cod_Almacen,
            Cod_Moneda,
            Cod_Categoria_producto,
            Cod_Marca,
            Flag_Activos,
            Flag_IncluirCero,
            Flag_SoloNegativos,
            Cod_Caja,
            FechaLimite
        })
    }
    fetch(URL + '/reporte_api/reporte_stock', parametros)
        .then(req => req.json())
        .then(res => { 
            if(res.respuesta=='ok'){
                if(res.data.detalles.length>0){ 
                    jsreport.serverUrl = URL_REPORT;  
                    var request = {
                        data:{
                            'FLAG_PREVIEW':flag_preview,
                            'COD_LIBRO':Cod_Libro,
                            'COD_TIPO_DOCUMENTO':TipoReporte,
                            "EMPRESA": res.empresa.Nom_Comercial,
                            "RUC": res.empresa.RUC,
                            "DIRECCION":res.empresa.Direccion,
                            "TIPO_REPORTE":"REPORTE CUENTAS POR COBRAR Y POR PAGAR",
                            "FECHA_SIS":MesActual(''),
                            "USUARIO":res.turno.Cod_UsuarioReg,
                            "IMPUESTO":res.empresa.Por_Impuesto,
                            "FILTRO": `Stock Calculado al : ${MesActual('')}`,
                            DETALLES:res.data.detalles.sort(function (a, b) {
                                if(ParametroOrden)
                                {
                                    var detA = a[ParametroOrden] 
                                    var detB = b[ParametroOrden] 
                                    if (detA < detB) 
                                        {
                                            return -1;
                                        }
                                    if (detA > detB)
                                        {
                                            return 1;
                                        } 
                                    return 0;
                                }
                                else
                                {
                                    return 0;
                                }
                            })
                        }
                    }
                    jsreport.renderAsync(request).then(function(res) {
                        let TR = TipoReporte.split('_')[TipoReporte.split('_').length-1]  
                        if(TR=='Excel')
                            global.variablesReporteStock[idTab].dataBase64.push({filename: TipoReporte+'.xlsx',content:res.toDataURI().replace("data:null;base64, ",""),encoding: 'base64',tipo:TR})                          
                        else
                            global.variablesReporteStock[idTab].dataBase64.push({filename: TipoReporte+'.pdf',content:res.toDataURI().replace("data:null;base64, ",""),encoding: 'base64',tipo:TR})                          
                        callback(true,"ok")
                    }).catch(function (e) {
                        console.log(e) 
                        callback(false,e)
                    });
                }else{
                    callback(true,"no existe datos para el reporte")
                }
            }else{
                callback(false,'Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+res.detalle_error)
            } 
        }).catch(function (e) {
            console.log(e);
            callback(false,'Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e)
        });
}
function ReporteGeneral(idTab,Cod_Libro,TipoReporte,ParametroOrden,flag_preview,Tipo){
    $("#btnAbrirNavegador_"+idTab).addClass("hidden")
    $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
    $("#divExcel_"+idTab).removeClass("hidden")
    $("#divExcel_"+idTab).html('<div style="margin-top:100px">'+ 
       '<br/><br/>'+
       '<i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i><br/><br/>'+
       '<label>Cargando vista previa....</label>'+
    '</div>') 
    var Cod_UnidadMedida = null
    var Cod_Almacen = null
    var Cod_Moneda = arrayValidacion.includes($("#Cod_Moneda_"+idTab).val())?null:$("#Cod_Moneda_"+idTab).val()
    var Cod_Categoria_producto = null
    var Cod_Marca = null
    var Flag_Activos="0"
    var Flag_IncluirCero="0"
    var Flag_SoloNegativos="0"
    if ($('#pro_ser_activos').is(':checked')){
        Flag_Activos= '1'
    }
    else
    {
        Flag_Activos= '0'
    }
    if ($('#pro_ser_stock_0').is(':checked')){
        Flag_IncluirCero= '1'
    }
    else
    {
        Flag_IncluirCero= '0'
    }
    if ($('#pro_ser_sobregir').is(':checked')){
        Flag_SoloNegativos= '1'
    }
    else
    {
        Flag_SoloNegativos= '0'
    }
    var Cod_Caja = arrayValidacion.includes($("#Cod_Caja_"+idTab).val())?null:$("#Cod_Caja_"+idTab).val()
    var FechaLimite = arrayValidacion.includes($("#FechaInicio_"+idTab).val())?null:$("#FechaInicio_"+idTab).val()
    let arregloFechaLimite= FechaLimite.split('T')[0]
    FechaLimite= arregloFechaLimite
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Cod_UnidadMedida,
            Cod_Almacen,
            Cod_Moneda,
            Cod_Categoria_producto,
            Cod_Marca,
            Flag_Activos,
            Flag_IncluirCero,
            Flag_SoloNegativos,
            Cod_Caja,
            FechaLimite
        })
    }
    fetch(URL + '/reporte_api/reporte_stock', parametros)
        .then(req => req.json())
        .then(res => {
            if(res.respuesta=='ok'){
                if(res.data.detalles.length>0){ 
                    jsreport.serverUrl = URL_REPORT;  
                    var request = {
                        data:{
                            'FLAG_PREVIEW':flag_preview,
                            'COD_LIBRO':Cod_Libro,
                            'COD_TIPO_DOCUMENTO':TipoReporte,
                            "EMPRESA": res.empresa.Nom_Comercial,
                            "RUC": res.empresa.RUC,
                            "DIRECCION":res.empresa.Direccion,
                            "TIPO_REPORTE":"REPORTE CUENTAS POR COBRAR Y POR PAGAR",
                            "FECHA_SIS":MesActual(''),
                            "USUARIO":res.turno.Cod_UsuarioReg,
                            "IMPUESTO":res.empresa.Por_Impuesto,
                            "FILTRO": `Stock Calculado al : ${MesActual('')}`,
                            DETALLES:res.data.detalles.sort(function (a, b) {
                                if(ParametroOrden)
                                {
                                    var detA = a[ParametroOrden] 
                                    var detB = b[ParametroOrden] 
                                    if (detA < detB) 
                                        {
                                            return -1;
                                        }
                                    if (detA > detB)
                                        {
                                            return 1;
                                        } 
                                    return 0;
                                }
                                else
                                {
                                    return 0;
                                }
                            })
                        }
                    }
                    jsreport.renderAsync(request).then(function(res) {  
                        switch(Tipo){
                            case 'Excel':
                                var html = $(res.toString())  
                                if(html[1]){  
                                    $('#divExcel_'+idTab).html(html[1]) 
                                    $("#btnAbrirNavegador_"+idTab).removeClass("hidden") 
                                    $("#btnEnviarCorreo_"+idTab).removeClass("hidden")
                                    global.variablesReporteStock[idTab].excel = html[1].src
                                }else{
                                    $('#divExcel_'+idTab).html(res.toString())
                                    global.variablesReporteStock[idTab].excel = null
                                }
                                break
                            case 'PDF':
                                $('#divExcel_'+idTab).html('<iframe src="'+res.toDataURI().replace("data:null","data:application/pdf;base64")+'" height="100%" width="100%"></iframe>') 
                                $("#btnEnviarCorreo_"+idTab).removeClass("hidden") 
                                $("#btnAbrirNavegador_"+idTab).removeClass("hidden")
                                global.variablesReporteStock[idTab].excel = null
                                global.variablesReporteStock[idTab].pdf = res.toDataURI()
                                break
                        }    
                    }).catch(function (e) { 
                        console.log(e)
                       $("#btnAbrirNavegador_"+idTab).addClass("hidden")
                       $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
                       $("#divExcel_"+idTab).addClass("hidden")
                       global.variablesReporteStock[idTab].excel = null
                       global.variablesReporteStock[idTab].pdf = null
                       toastr.error('Hubo un error al generar el documento. Tipo error : '+e.statusText,'Error',{timeOut: 5000}) 
                    });
                }else{
                    toastr.warning("No existen datos para mostrar",'Error',{timeOut: 5000})
                    $("#btnAbrirNavegador_"+idTab).addClass("hidden")
                    $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
                    $("#divExcel_"+idTab).addClass("hidden")
                    global.variablesReporteStock[idTab].excel = null
                    global.variablesReporteStock[idTab].pdf = null
                }
            }else{
                toastr.warning("No existen datos para mostrar",'Error',{timeOut: 5000})
                $("#btnAbrirNavegador_"+idTab).addClass("hidden")
                $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
                $("#divExcel_"+idTab).addClass("hidden")
                global.variablesReporteStock[idTab].excel = null
                global.variablesReporteStock[idTab].pdf = null
            } 
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $("#btnAbrirNavegador_"+idTab).addClass("hidden")
            $("#btnEnviarCorreo_"+idTab).addClass("hidden") 
            $("#divExcel_"+idTab).addClass("hidden")
            global.variablesReporteStock[idTab].excel = null
            global.variablesReporteStock[idTab].pdf = null
        });
}

function GenerarReporte(idTab,Cod_Libro,flag_preview,Tipo){
    switch($("#Cod_Opcion_"+idTab).val()){
        case '01':
            ReporteGeneral(idTab,Cod_Libro,"ReporteStockFisico_"+Tipo,"",flag_preview,Tipo)
            break
        case '02':
            ReporteGeneral(idTab,Cod_Libro,"ReporteStockFisicoValorizado_"+Tipo,"",flag_preview,Tipo)
            break
        case '03':
            ReporteGeneral(idTab,Cod_Libro,"ReporteStockTotalFisicoValorizado_"+Tipo,"",flag_preview,Tipo)
            break
    }
}

function ReporteStock(CodLibro) { 
    run_waitMe($('#main-contenido'), 1, "ios")
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        })
    }
    fetch(URL + '/reporte_api/get_variables_reporte_comprobante', parametros)
        .then(req => req.json())
        .then(res => { 
            var variables = res.data 
            if (res.respuesta == 'ok') {
                Ver(variables,CodLibro)
            }else{
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+res.detalle_error,'Error',{timeOut: 5000})
            }
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
}

export { ReporteStock }