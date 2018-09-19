var empty = require('empty-element');
var yo = require('yo-yo');

import { NuevaCuentaBancaria } from './agregar'
import {URL} from '../../../constantes_entorno/constantes'

function Ver(variables, paginas, pagina_actual, _escritura){

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

function ListarCuentasBancarias(escritura,NumeroPagina) {
    run_waitMe($('#main-contenido'), 1, "ios");
    var _escritura=escritura;
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            TamanoPagina: '20',
            NumeroPagina: NumeroPagina||'0',
            ScripOrden: ' ORDER BY Cod_CuentaBancaria asc',
            ScripWhere: ''
        })
    }
    fetch(URL+'/cuentas_bancarias_api/get_cuentas', parametros)
        .then(req => req.json())
        .then(res => {
            if (res.respuesta == 'ok') {
                var paginas = parseInt(res.data.num_filas[0].NroFilas)
                paginas = parseInt(paginas / 20) + (paginas % 20 != 0 ? 1 : 0)
                Ver(res.data, paginas,NumeroPagina||0, _escritura)
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