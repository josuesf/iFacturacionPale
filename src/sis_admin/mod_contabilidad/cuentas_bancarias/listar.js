var empty = require('empty-element');
var yo = require('yo-yo');

import { NuevaCuentaBancaria } from './agregar'
import {URL} from '../../../constantes_entorno/constantes'

function Ver(variables, paginas, pagina_actual, _escritura,tamanio_pagina){

    var tab = yo`
    <li class=""><a href="#tab_listar_cuentas_bancarias_2" data-toggle="tab" aria-expanded="false" id="id_tab_listar_cuentas_bancarias_2">Cuentas Bancarias<a style="padding-left: 10px;" class="btn" onclick=${()=>CerrarTab()}><i class="fa fa-close text-danger"></i></a></a></li>`

    var el = yo`
    <div class="tab-pane" id="tab_listar_cuentas_bancarias_2">
        <section class="content-header">
        <div class="modal modal-danger fade" id="modal-danger-cuentas-banc" style="display: none;">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span></button>
              <h4 class="modal-title">¿Esta seguro que desea eliminar este elemento?</h4>
            </div>
            <div class="modal-body">
              <p>Al eliminar este elemento no podra recuperarlo. Desea continuar de todas maneras?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-success" id="btnEliminar" data-dismiss="modal">Si, Eliminar</button>
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
                    <header>Lista de Cuentas</header>
                    <div class="tools">
                        <div class="btn-group">
                        ${_escritura ? yo`<a onclick=${()=>NuevaCuentaBancaria(_escritura, variables)} class="btn btn-info pull-right">
                            <i class="fa fa-plus"></i> Nuevo</a>`: yo``}
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form">
                                <div class="form-group floating-label">
                                    <div class="input-group">
                                        <div class="input-group-content">
                                            <input type="text" class="form-control dirty" id="parametro_busqueda_cuenta_bancaria" onkeypress=${()=>BuscarParametroCuentasBancarias(event)}>
                                            <label for="parametro_busqueda_cuenta_bancaria">Ingrese parametro de busqueda</label>
                                        </div>
                                        <div class="input-group-btn">
                                            <button class="btn ink-reaction btn-raised btn-primary" type="button"  onclick=${()=>BuscarParametroCuentasBancarias()}><i class="fa fa-search"></i> Buscar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-2 col-md-offset-4">
                            <div class="form">
                                <div class="form-group floating-label">
                                    <div class="input-group">
                                        <div class="input-group-btn">
                                            <label class="control-label">Mostrar</label>
                                        </div>
                                        <div class="input-group-content">
                                            <select id="nro_registros_cuentas_bancarias" onchange=${()=>CambioTamanioPagina()} class="form-control input-sm">
                                                <option style="text-transform:uppercase" ${tamanio_pagina?tamanio_pagina=='10'?'selected':'':''} value="10">10</option>
                                                <option style="text-transform:uppercase" ${tamanio_pagina?tamanio_pagina=='25'?'selected':'':''} value="25">25</option>
                                                <option style="text-transform:uppercase" ${tamanio_pagina?tamanio_pagina=='50'?'selected':'':''} value="50">50</option>
                                                <option style="text-transform:uppercase" ${tamanio_pagina?tamanio_pagina=='100'?'selected':'':''} value="100">100</option>
                                            </select>
                                        </div>
                                        <div class="input-group-btn">
                                            <label class="control-label">Registros</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div class="table-responsive">
                    <table id="example1" class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Cuenta</th>
                                <th>Banco</th>
                                <th>Descripcion</th>
                                <th>Cuenta Contable</th>
                                <th>Moneda</th>
                                <th>Saldo</th>
                                <th>Activo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${variables.cuentas.map(u => yo`
                            <tr>
                                <td>${u.Cod_CuentaBancaria}</td>
                                <td>${u.Nom_EntidadFinanciera}</td>
                                <td>${u.Des_CuentaBancaria}</td>
                                <td>${u.Cod_CuentaContable}</td>
                                <td>${u.Nom_Moneda}</td>
                                <td>${u.Saldo_Disponible}</td>
                                <td>${u.Flag_Activo?"Si":"No"}</td>
                                <td>
                                    ${_escritura ? yo`<button class="btn btn-xs btn-success" onclick="${()=>NuevaCuentaBancaria(_escritura, variables, u)}"><i class="fa fa-edit"></i></button>` : yo``}
                                    ${_escritura ? yo`<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger-cuentas-banc" onclick="${()=>Eliminar(_escritura, u)}"><i class="fa fa-trash"></i></button>` : yo``}
                                    
                                </td>
                            </tr>`)}
                        </tbody>
    
                    </table>
                    </div>
                    <div class="card-actionbar">
                        <ul class="pagination pagination-sm no-margin pull-right">
                            <li>
                                <a href="javascript:void(0);" onclick=${()=>(pagina_actual>0)?ListarProductosServ(_escritura,pagina_actual-1):null}>«</a>
                            </li>
                            ${((new Array(paginas)).fill(0)).map((p, i) => yo`<li class=${pagina_actual==i?'active':''}>
                            <a href="javascript:void(0);" onclick=${()=>ListarProductosServ(_escritura,i)} >${i + 1}</a>
                            </li>`)}
                        
                            <li>
                                <a href="javascript:void(0);" onclick=${()=>(pagina_actual+1<paginas)?ListarProductosServ(_escritura,pagina_actual+1):null}>»</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    </div>`
    //var main = document.getElementById('main-contenido');
    //empty(main).appendChild(el);
    if($("#tab_listar_cuentas_bancarias_2").length){  

        $('#tab_listar_cuentas_bancarias_2').remove()
        $('#id_tab_listar_cuentas_bancarias_2').parents('li').remove()

        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    }else{
        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    } 
    $("#id_tab_listar_cuentas_bancarias_2").click()
}

function CambioTamanioPagina(){ 
    ListarCuentasBancarias(true,null,null,null,$("#nro_registros_cuentas_bancarias").val())
}

function CerrarTab(){
    $('#tab_listar_cuentas_bancarias_2').remove()
    $('#id_tab_listar_cuentas_bancarias_2').parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show'); 
}

function Eliminar(_escritura, cuenta){
    var btnEliminar = document.getElementById('btnEliminar')
    btnEliminar.addEventListener('click', function del(ev){
        var Cod_CuentaBancaria = cuenta.Cod_CuentaBancaria
        run_waitMe($('#main-contenido'), 1, "ios","Eliminando cuenta bancaria...");
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Cod_CuentaBancaria
            })
        }
        fetch(URL+'/cuentas_bancarias_api/eliminar_cuenta', parametros)
            .then(req => req.json())
            .then(res => {
                ListarCuentasBancarias(_escritura,0)
                this.removeEventListener('click', del)
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
    })
}

function BuscarParametroCuentasBancarias(event){
    if(event){
        if(event.which == 13) { 
            var parametro = $("#parametro_busqueda_cuenta_bancaria").val()
            var scriptOrden= " ORDER BY Cod_CuentaBancaria asc"
            var scripWhere = "WHERE Cod_CuentaBancaria like '%"+parametro+"%' or Des_CuentaBancaria like '%"+parametro+"%' or Cod_CuentaContable like '%"+parametro+"%'"
            ListarCuentasBancarias(true,'0',scriptOrden,scripWhere)
        }
    }else{
        var parametro = $("#parametro_busqueda_cuenta_bancaria").val()
        var scriptOrden= " ORDER BY Cod_CuentaBancaria asc"
        var scripWhere = "WHERE Cod_CuentaBancaria like '%"+parametro+"%' or Des_CuentaBancaria like '%"+parametro+"%' or Cod_CuentaContable like '%"+parametro+"%'"
        ListarCuentasBancarias(true,'0',scriptOrden,scripWhere)
    }
}

function ListarCuentasBancarias(escritura,NumeroPagina,ScripOrden,ScripWhere,TamanioPagina) {
    run_waitMe($('#main-contenido'), 1, "ios");
    var _escritura=escritura;
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            TamanoPagina: TamanioPagina?TamanioPagina:'10',
            NumeroPagina: NumeroPagina||'0',
            ScripOrden: ScripOrden||' ORDER BY Cod_CuentaBancaria asc',
            ScripWhere: ScripWhere||''  
        })
    }
    fetch(URL+'/cuentas_bancarias_api/get_cuentas', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var paginas = parseInt(res.data.num_filas[0].NroFilas)
                paginas = parseInt(paginas / (TamanioPagina?parseInt(TamanioPagina):10)) + (paginas % (TamanioPagina?parseInt(TamanioPagina):10) != 0 ? 1 : 0)
                Ver(res.data, paginas,NumeroPagina||0, _escritura,TamanioPagina)
            }
            else
                Ver([])
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
}

export {ListarCuentasBancarias}