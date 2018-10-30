var tableToJson = require("table-to-json")
var empty = require('empty-element');
var yo = require('yo-yo');
import { URL, URL_REPORT } from '../../../constantes_entorno/constantes'
function Ver_limpio(fecha)
{
    var tab = yo`
    <li class=""><a href="#tab_listar_conceptos_2" data-toggle="tab" aria-expanded="false" id="id_tab_listar_conceptos_2">Tipo de cambio Monetario<a style="padding-left: 10px;" class="btn" onclick=${()=>CerrarTab()}><i class="fa fa-close text-danger"></i></a></a></li>`
    var el = yo`
    <div class="tab-pane" id="tab_listar_conceptos_2">
        <section class="content-header">
        <div class="modal modal-danger fade" id="modal-danger-conceptos" style="display: none;">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span></button>
              <h4 class="modal-title">¿Esta seguro que desea eliminar este concepto?</h4>
            </div>
            <div class="modal-body">
              <p>Al eliminar el concepto no podra recuperarlo. Desea continuar de todas maneras?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-success" id="btnEliminar" data-dismiss="modal">Si,Eliminar</button>
            </div>
          </div>
          <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
      </div>
         
        </section>
        <section class="content">
            <div class="card">
                <div class="card-head">
                    <header>Cambio Monetario</header>
                </div> 
                <div class="card-body">

                <div class="row">
                <div class="form">
                   <div class="col-md-12">
                        <div class="col-md-2">
                            <div class="form-group">
                                <label for="ct_moneda">MONEDA</label>
                                <select class="form-control" id="ct_moneda">
                                    <option>DOLARES</option>
                                </select>
                            </div>
                        </div>

                        <div class="col-md-1">
                            <div class="form-group">
                                <label for="ct_anio">AÑO</label>
                                <input type="text" class="form-control" id="ct_anio" value="${fecha ? fecha[0].anio : ''}">
                            </div>
                        </div> 
                        <div class="col-md-1">
                            <div class="form-group">
                                <label for="ct_mes">MES</label>
                                <input type="text" class="form-control" id="ct_mes" value="${fecha ? fecha[0].mes : ''}">
                            </div>
                        </div> 
                        <div class="col-md-3">
                            <div class="form-group">
                            <label for="ct_fecha">POR DIA</label>
                            <input type="date" class="form-control" id="ct_fecha" value="${fecha ? fecha[0].anio+'-'+fecha[0].mes+'-'+fecha[0].dia : ''}">
                            </div>
                        </div> 
                        <div class="col-md-2">
                            <div class="form-group">
                                  <button class="btn ink-reaction btn-raised btn-primary" type="button"  onclick=${()=>BuscarCambioData()}><i class="fa fa-search"></i> BUSCAR</button>
                            </div>
                        </div> 
                        <div class="col-md-3">
                            <div class="form-group">
                                  <button class="btn ink-reaction btn-raised btn-primary" type="button"  onclick=${()=>ExtraerCambioSunat()}><i class="fa fa-download"></i> EXTRAER DE SUNAT</button>
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
                                <th>MONEDA</th>
                                <th>AÑO</th>
                                <th>MES</th>
                                <th>DIA</th>
                                <th>COMPRA</th>
                                <th>VENTA</th>
                            </tr>
                        </thead>
                        <tbody id="content_table_cambio">
                            <tr>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
                    </div>
                </div>
            </div>

        </section>
    </div>`
    //var main = document.getElementById('main-contenido');
    //empty(main).appendChild(el);
    if($("#tab_listar_conceptos_2").length){  

        $('#tab_listar_conceptos_2').remove()
        $('#id_tab_listar_conceptos_2').parents('li').remove()

        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    }else{
        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    } 
    $("#id_tab_listar_conceptos_2").click()
}
function Ver(cambios,fecha) {

    var tab = yo`
    <li class=""><a href="#tab_listar_conceptos_2" data-toggle="tab" aria-expanded="false" id="id_tab_listar_conceptos_2">Tipo de cambio Monetario<a style="padding-left: 10px;" class="btn" onclick=${()=>CerrarTab()}><i class="fa fa-close text-danger"></i></a></a></li>`
    var el = yo`
    <div class="tab-pane" id="tab_listar_conceptos_2">
        <section class="content-header">
        <div class="modal modal-danger fade" id="modal-danger-conceptos" style="display: none;">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span></button>
              <h4 class="modal-title">¿Esta seguro que desea eliminar este concepto?</h4>
            </div>
            <div class="modal-body">
              <p>Al eliminar el concepto no podra recuperarlo. Desea continuar de todas maneras?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-success" id="btnEliminar" data-dismiss="modal">Si,Eliminar</button>
            </div>
          </div>
          <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
      </div>
         
        </section>
        <section class="content">
            <div class="card">
                <div class="card-head">
                    <header>Cambio Monetario</header>
                </div> 
                <div class="card-body">

                <div class="row">
                <div class="form">
                   <div class="col-md-12">
                        <div class="col-md-2">
                            <div class="form-group">
                                <label for="ct_moneda">MONEDA</label>
                                <select class="form-control" id="ct_moneda">
                                    <option>DOLARES</option>
                                </select>
                            </div>
                        </div>

                        <div class="col-md-1">
                            <div class="form-group">
                                <label for="ct_anio">AÑO</label>
                                <input type="text" class="form-control" id="ct_anio" value="${fecha ? fecha[0].anio : ''}">
                            </div>
                        </div> 
                        <div class="col-md-1">
                            <div class="form-group">
                                <label for="ct_mes">MES</label>
                                <input type="text" class="form-control" id="ct_mes" value="${fecha ? fecha[0].mes : ''}">
                            </div>
                        </div> 
                        <div class="col-md-3">
                            <div class="form-group">
                            <label for="ct_fecha">POR DIA</label>
                            <input type="date" class="form-control" id="ct_fecha" value="${fecha ? fecha[0].anio+'-'+fecha[0].mes+'-'+fecha[0].dia : ''}">
                            </div>
                        </div> 
                        <div class="col-md-2">
                            <div class="form-group">
                                  <button class="btn ink-reaction btn-raised btn-primary" type="button"  onclick=${()=>BuscarCambioData()}><i class="fa fa-search"></i> BUSCAR</button>
                            </div>
                        </div> 
                        <div class="col-md-3">
                            <div class="form-group">
                                  <button class="btn ink-reaction btn-raised btn-primary" type="button"  onclick=${()=>ExtraerCambioSunat()}><i class="fa fa-download"></i> EXTRAER DE SUNAT</button>
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
                                <th>MONEDA</th>
                                <th>AÑO</th>
                                <th>MES</th>
                                <th>DIA</th>
                                <th>COMPRA</th>
                                <th>VENTA</th>
                                ${cambios[0].Id_TipoCambio ? yo`<th>ACCIONES</th>` : yo``}
                            </tr>
                        </thead>
                        <tbody id="content_table_cambio">
                            ${cambios.map(u => yo`
                            <tr id = "editable_fila_${u.Id_TipoCambio}">
                                <td>DOLARES</td>
                                <td>${u.anio }</td>
                                <td>${u.mes}</td>
                                <td>${u.dias}</td>
                                <td id="editable-compra_${u.Id_TipoCambio}">${u.compra}</td>
                                <td id="editable-venta_${u.Id_TipoCambio}">${u.venta}</td>
                                ${u.Id_TipoCambio ? yo`<td><span id="iditable_buton_${u.Id_TipoCambio}" class="btn btn-xs btn-success" onclick="${()=>Editar_fila_cambio(u.Id_TipoCambio)}"><i class="fa fa-edit"></i></span></td>` : yo``}
                            </tr>`)}
                        </tbody>
                    </table>
                </form>
                    </div>
                </div>
                <div class="col-md-12">
                    <div class="form-group" style="float:right">
                        ${cambios[0].Id_TipoCambio ? yo`<button class="btn ink-reaction btn-raised btn-primary" type="button"  onclick=${()=>Actualizar_cambios()}><i class="fa fa-floppy-o"></i> Grabar Datos</button>` : yo`<button class="btn ink-reaction btn-raised btn-primary" type="button"  onclick=${()=>GuardarCambioSunat()}><i class="fa fa-floppy-o"></i> Grabar Datos</button>`}

                    </div>
                </div> 

            </div>

        </section>
    </div>`
    //var main = document.getElementById('main-contenido');
    //empty(main).appendChild(el);
    if($("#tab_listar_conceptos_2").length){  

        $('#tab_listar_conceptos_2').remove()
        $('#id_tab_listar_conceptos_2').parents('li').remove()

        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    }else{
        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    } 
    $("#id_tab_listar_conceptos_2").click()
}

function CerrarTab(){
    $('#tab_listar_conceptos_2').remove()
    $('#id_tab_listar_conceptos_2').parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show'); 
}
function Editar_fila_cambio(Id_TipoCambio)
{
    $(".inabilitado").attr("disabled", false)
    var input1= $(".editando-compra").val()
    var input2= $(".editando-venta").val()
    $('#'+$(".editando-compra").parent().attr("id")).html(input1)
    $('#'+$(".editando-venta").parent().attr("id")).html(input2)
    var data1= $("#editable-compra_"+Id_TipoCambio).html()  
    var data2= $("#editable-venta_"+Id_TipoCambio).html()
    $("#iditable_buton_"+Id_TipoCambio).attr("disabled", true)
    $("#iditable_buton_"+Id_TipoCambio).addClass('inabilitado')
    $("#editable-compra_"+Id_TipoCambio).html('<input type="text" id="in_editable-compra_'+Id_TipoCambio+'" value="'+data1+'">')
    $("#in_editable-compra_"+Id_TipoCambio).addClass('editando-compra')
    $("#editable-venta_"+Id_TipoCambio).html('<input type="text" id="in_editable-venta_'+Id_TipoCambio+'" value="'+data2+'">')
    $("#in_editable-venta_"+Id_TipoCambio).addClass('editando-venta')
    $("#editable-compra_"+Id_TipoCambio).focus()
}
function Actualizar_cambios()
{
    $(".inabilitado").attr("disabled", false)
    var input1= $(".editando-compra").val()
    var input2= $(".editando-venta").val()
    $('#'+$(".editando-compra").parent().attr("id")).html(input1)
    $('#'+$(".editando-venta").parent().attr("id")).html(input2)
    var table = $('#example1').tableToJSON()
    var mes = Number($("#ct_mes").val())
    var anio = Number($("#ct_anio").val())
    var fecha_val =$("#ct_fecha").val()
    if(fecha_val != '')
    {
       run_waitMe($('#main-contenido'), 1, "ios");
       var fecha = new Date(fecha_val)
       var dia = fecha.getDate() + 1
       mes = fecha.getMonth() + 1
       anio = fecha.getFullYear()
       const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            table  
        })
    
    }
    fetch(URL+'/cambio_monetario_api/guardar_cambios', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') 
            {
                toastr.success('Datos registrados!','Los datos se registraron satisfactoriamente',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            }
            else
               {
                  
                toastr.error('Datos no registrados','No se pudo registrar los datos, error de red',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
               }
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        })
    }
    else
    {
        if(mes != '' && anio != '' && anio <= new Date().getFullYear() && anio >1994 && mes <= 12)
        {
            run_waitMe($('#main-contenido'), 1, "ios");
            const parametros = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    table
                })
            }
            fetch(URL+'/cambio_monetario_api/guardar_cambios', parametros)
                .then(req => req.json())
                .then(res => {
                    if (res.respuesta == 'ok') 
                    {
                        toastr.success('Datos registrados!','Los datos se registraron satisfactoriamente',{timeOut: 5000})
                        $('#main-contenido').waitMe('hide');
                    }
                    else
                    {
                   
                        toastr.error('Datos no registrados','No se pudo registrar los datos, error de red',{timeOut: 5000})
                        $('#main-contenido').waitMe('hide');
                    }
                }).catch(function (e) {
                    console.log(e);
                    toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                    $('#main-contenido').waitMe('hide');
                })
        }
        else
        {
            toastr.error('Datos no registrados','No se pudo registrar los datos, error de red',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        }
    } 
}
function BuscarCambioData()
{
    var mes = Number($("#ct_mes").val())
    var anio = Number($("#ct_anio").val())
    var fecha_val =$("#ct_fecha").val() 
    var cambios =[]
    if(fecha_val != '')
    {
       run_waitMe($('#main-contenido'), 1, "ios");
       var fecha = new Date(fecha_val)
       var dia = fecha.getDate() + 1
       mes = fecha.getMonth() + 1
       anio = fecha.getFullYear()
       var fecha_data = [{dia:dia,mes:mes,anio:anio}]
       const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Dia: dia,
            Mes: mes,
            Anio: anio
            
        })
    }
    fetch(URL+'/cambio_monetario_api/buscar_cambios', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok' && res.data.cambios.length > 0) 
            {
                res.data.cambios[0]['dias']= dia
                res.data.cambios[0]['mes']= mes
                res.data.cambios[0]['anio']= anio
                res.data.cambios[0]['compra']= res.data.cambios[0].SunatCompra
                res.data.cambios[0]['venta']= res.data.cambios[0].SunatVenta
                Ver(res.data.cambios,fecha_data)
                $('#main-contenido').waitMe('hide');
            }
            else
               {
                toastr.warning('Datos no encontrados','No hay datos para mostar!',{timeOut: 5000})
                Ver_limpio(fecha_data)
                $('#main-contenido').waitMe('hide');
               }
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
    }
    else
    {
        if(mes != '' && anio != '' && anio <= new Date().getFullYear() && anio >1994 && mes <= 12)
        {
            run_waitMe($('#main-contenido'), 1, "ios");
            fecha_data = [{dia:'',mes:mes,anio:anio}]
            const parametros = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Dia: '',
                    Mes: mes,
                    Anio: anio
                    
                })
            }
            fetch(URL+'/cambio_monetario_api/buscar_cambios', parametros)
                .then(req => req.json())
                .then(res => {
                    if (res.respuesta == 'ok' && res.data.cambios.length > 1) 
                    {
                        for (var i = 0; i < res.data.cambios.length; i++) 
                        {
                            var fecha = new Date(res.data.cambios[i]['FechaHora'])
                            res.data.cambios[i]['dias']= fecha.getDate() + 1
                            res.data.cambios[i]['mes']= fecha.getMonth() + 1
                            res.data.cambios[i]['anio']= fecha.getFullYear()
                            res.data.cambios[i]['compra']= res.data.cambios[i].SunatCompra
                            res.data.cambios[i]['venta']= res.data.cambios[i].SunatVenta
                        }
                        Ver(res.data.cambios,fecha_data)
                        $('#main-contenido').waitMe('hide');
                    }
                    else
                    {

                        toastr.warning('Datos no encontrados','No hay datos para mostar!',{timeOut: 5000})
                        Ver_limpio(fecha_data)
                        $('#main-contenido').waitMe('hide');
                    }
                }).catch(function (e) {
                    console.log(e);
                    toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                    $('#main-contenido').waitMe('hide');
                });
        }
        else
        {
            toastr.warning('Datos no encontrados','No hay datos para mostar!',{timeOut: 5000})
            Ver_limpio(fecha_data)
            $('#main-contenido').waitMe('hide');
        }
    } 
}
function ExtraerCambioSunat()
{
    var mes = Number($("#ct_mes").val())
    var anio = Number($("#ct_anio").val())
    var fecha_val =$("#ct_fecha").val() 
    if(fecha_val != '')
    {
       run_waitMe($('#main-contenido'), 1, "ios");
       var fecha = new Date(fecha_val)
       var dia = fecha.getDate() + 1
       mes = fecha.getMonth() + 1
       anio = fecha.getFullYear()
       var fecha_data = [{dia:dia,mes:mes,anio:anio}]
       const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Dia: dia,
            Mes: mes,
            Anio: anio
            
        })
    }
    fetch(URL+'/cambio_monetario_api/extraer_cambio', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta.length > 0) 
            {
                res.respuesta[0].dias = dia
                res.respuesta[0]['mes']= mes
                res.respuesta[0]['anio']= anio
                Ver(res.respuesta,fecha_data)
                $('#main-contenido').waitMe('hide');
            }
            else
               {
                toastr.warning('Datos no encontrados','No hay datos para mostar!',{timeOut: 5000})
                Ver_limpio(fecha_data)
                  $('#main-contenido').waitMe('hide');
               }
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
    }
    else
    {
        if(mes != '' && anio != '' && anio <= new Date().getFullYear() && anio >1994 && mes <= 12)
        {
            run_waitMe($('#main-contenido'), 1, "ios");
            fecha_data = [{dia:'',mes:mes,anio:anio}]
            const parametros = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Dia: '',
                    Mes: mes,
                    Anio: anio
                    
                })
            }
            fetch(URL+'/cambio_monetario_api/extraer_cambio', parametros)
                .then(req => req.json())
                .then(res => {
                    if (res.respuesta.length > 1) 
                    {
                        for (var i = 0; i < res.respuesta.length; i++) 
                        {
                            res.respuesta[i]['mes']= mes
                            res.respuesta[i]['anio']= anio
                        }
                        Ver(res.respuesta,fecha_data)
                        $('#main-contenido').waitMe('hide');
                    }
                    else
                    {
                        toastr.warning('Datos no encontrados','No hay datos para mostar!',{timeOut: 5000})
                        Ver_limpio(fecha_data)
                        $('#main-contenido').waitMe('hide');
                    }
                }).catch(function (e) {
                    console.log(e);
                    toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                    $('#main-contenido').waitMe('hide');
                });
        }
        else
        {
        toastr.warning('Datos no encontrados','No hay datos para mostar!',{timeOut: 5000})
        Ver_limpio(fecha_data)
         $('#main-contenido').waitMe('hide');
        }
    } 
}
function GuardarCambioSunat()
{

    var table = $('#example1').tableToJSON()
    var mes = Number($("#ct_mes").val())
    var anio = Number($("#ct_anio").val())
    var fecha_val =$("#ct_fecha").val()
    if(fecha_val != '')
    {
       run_waitMe($('#main-contenido'), 1, "ios");
       var fecha = new Date(fecha_val)
       var dia = fecha.getDate() + 1
       mes = fecha.getMonth() + 1
       anio = fecha.getFullYear()
       const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            table  
        })
    
    }
    fetch(URL+'/cambio_monetario_api/guardar_cambios', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') 
            {
                toastr.success('Datos registrados!','Los datos se registraron satisfactoriamente',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            }
            else
               {
                  toastr.error('Datos no registrados','No se pudo registrar los datos, error de red',{timeOut: 5000})
                  $('#main-contenido').waitMe('hide');
               }
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
    }
    else
    {
        if(mes != '' && anio != '' && anio <= new Date().getFullYear() && anio >1994 && mes <= 12)
        {
            run_waitMe($('#main-contenido'), 1, "ios");
            const parametros = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    table
                })
            }
            fetch(URL+'/cambio_monetario_api/guardar_cambios', parametros)
                .then(req => req.json())
                .then(res => {
                    if (res.respuesta == 'ok') 
                    {
                        toastr.success('Datos registrados!','Los datos se registraron satisfactoriamente',{timeOut: 5000})
                        $('#main-contenido').waitMe('hide');
                    }
                    else
                    {
                        toastr.error('Datos no registrados','No se pudo registrar los datos, error de red',{timeOut: 5000})
                        $('#main-contenido').waitMe('hide');
                    }
                }).catch(function (e) {
                    console.log(e);
                    toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                    $('#main-contenido').waitMe('hide');
                });
        }
        else
        {
            toastr.error('Datos no registrados','No se pudo registrar los datos, error de red',{timeOut: 5000})
         $('#main-contenido').waitMe('hide');
        }
    } 
}
function ListarMesTipoCambio(escritura,anio,mes)
{
        run_waitMe($('#main-contenido'), 1, "ios");
        var htmlData
        $("#editable-compra").click(
            htmlData = $(this).html()
         )
         $("#editable-compra").html('<input type="text" id="eeeeee" value="'+htmlData+'">')
        var Fecha = new Date()
        var fecha_data = [{dia:'',mes:Fecha.getMonth() + 1,anio:Fecha.getFullYear()}]
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Anio:anio||Fecha.getFullYear(),
                Mes: mes||Fecha.getMonth()+1
            })
        }
        fetch(URL+'/cambio_monetario_api/get_cambios', parametros)
            .then(req => req.json())
            .then(res => { 
                if (res.data.cambios.length > 0) {
                    for (var i = 0; i < res.data.cambios.length; i++) 
                    {
                        var fecha = new Date(res.data.cambios[i]['FechaHora'])
                        res.data.cambios[i]['dias']= fecha.getDate() + 1
                        res.data.cambios[i]['mes']= fecha.getMonth() + 1
                        res.data.cambios[i]['anio']= fecha.getFullYear()
                        res.data.cambios[i]['compra']= res.data.cambios[i].SunatCompra
                        res.data.cambios[i]['venta']= res.data.cambios[i].SunatVenta
                    }
                    Ver(res.data.cambios,fecha_data)
                    $('#main-contenido').waitMe('hide');
                }
                else
                    Ver_limpio(fecha_data)
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
}
export {ListarMesTipoCambio}