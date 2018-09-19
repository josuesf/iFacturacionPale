var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../../constantes_entorno/constantes'


function Ver(empresa, _escritura) {

    var tab = yo`
    <li class=""><a href="#tab_listar_empresas_2" data-toggle="tab" aria-expanded="false" id="id_tab_listar_empresas_2">Empresas<a style="padding-left: 10px;" class="btn" onclick=${()=>CerrarTab()}><i class="fa fa-close text-danger"></i></a></a></li>`

    var el = yo`
    <div class="tab-pane" id="tab_listar_empresas_2">
        <section class="content-header">
        <div class="modal modal-danger fade" id="modal-danger-empresa" style="display: none;">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span></button>
              <h4 class="modal-title">¿Esta seguro que desea guardar esta informacion?</h4>
            </div>
            <div class="modal-body">
              <p>Continuar de todas maneras?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-success" id="btnEliminar" data-dismiss="modal">Si, Guardar</button>
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
                    <header>Datos de Empresa</header>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="Cod_Empresa">RUC Empresa</label>
                                <input type="number" class="form-control" id="Cod_Empresa" placeholder="Ingrese RUC" value="${empresa ? empresa.Cod_Empresa : ''}" >
                                <div class="form-control-line"></div>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="RazonSocial">Razon Social</label>
                                <input type="text" style="text-transform:uppercase" class="form-control" id="RazonSocial" placeholder="Ingrese Razon Social" value="${empresa ? empresa.RazonSocial : ''}">
                                <div class="form-control-line"></div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="Nom_Comercial">Nombre Comercial</label>
                                <input type="text" class="form-control" id="Nom_Comercial" placeholder="Ingrese Nombre Comercial" value="${empresa ? empresa.Nom_Comercial : ''}" >
                                <div class="form-control-line"></div>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="Direccion">Direccion Fiscal</label>
                                <textarea type="text" style="text-transform:uppercase" class="form-control" id="Direccion" placeholder="Ingrese Direccion Fiscal">${empresa ? empresa.Direccion : ''}</textarea>
                                <div class="form-control-line"></div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="Telefonos">Telefono(s)</label>
                                <input type="text" class="form-control" id="Telefonos" value="${empresa ? empresa.Telefonos : ''}">
                                <div class="form-control-line"></div>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="Web">Pagina Web</label>
                                <input type="text" class="form-control" id="Web" value="${empresa ? empresa.Web : ''}">
                                <div class="form-control-line"></div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="Version">Version</label>
                                <input type="text" class="form-control" id="Version" value="${empresa ? empresa.Version : ''}">
                                <div class="form-control-line"></div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="nav-tabs-custom">
                                <ul class="nav nav-tabs">
                                    <li class="active">
                                        <a href="#tab_1" data-toggle="tab" aria-expanded="true">
                                            <i class="fa fa-file"></i> Impuestos</a>
                                    </li>
                                </ul>
                                <div class="tab-content">
                                    <div class="tab-pane active" id="tab_1">
                                        <div class="row">
                                            <div class="col-sm-6">
                                                <div class="form-group">
                                                    <label for="Des_Impuesto">Descripcion del Impuesto</label>
                                                    <input type="text" class="form-control" id="Des_Impuesto" value="${empresa ? empresa.Des_Impuesto : ''}">
                                                    <div class="form-control-line"></div>
                                                </div>
                                            </div>
                                            <div class="col-sm-6">
                                                <div class="form-group">
                                                    <label for="Por_Impuesto">Porcentaje del Impuesto</label>
                                                    <input type="number" class="form-control" id="Por_Impuesto" value="${empresa ? empresa.Por_Impuesto.toFixed(2) : ''}">
                                                    <div class="form-control-line"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- /.tab-content -->
                            </div>
                        </div>
                    
                    </div>
                </div>
            </div>
        </section>
    </div>`
    //var main = document.getElementById('main-contenido');
    //empty(main).appendChild(el);
    if($("#tab_listar_empresas_2").length){  

        $('#tab_listar_empresas_2').remove()
        $('#id_tab_listar_empresas_2').parents('li').remove()

        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    }else{
        $("#tabs").append(tab) 
        $("#tabs_contents").append(el)
    } 
    $("#id_tab_listar_empresas_2").click()
}

function CerrarTab(){
    $('#tab_listar_empresas_2').remove()
    $('#id_tab_listar_empresas_2').parents('li').remove()
    var tabFirst = $('#tabs a:first'); 
    tabFirst.tab('show'); 
}


function GuardarEmpresa(_escritura, usuario) {

    var btnEliminar = document.getElementById('btnEliminar')
    btnEliminar.addEventListener('click', function Eliminar(ev) {
        run_waitMe($('#main-contenido'), 1, "ios","Eliminando empresa...");
        var Cod_Usuarios = usuario.Cod_Usuarios
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Cod_Usuarios,
            })
        }
        fetch(URL + '/usuarios_api/eliminar_usuario', parametros)
            .then(req => req.json())
            .then(res => {

                if (res.respuesta == 'ok') {
                    Listar(_escritura)
                    this.removeEventListener('click', Eliminar)
                }
                else {

                    console.log('Error')
                    this.removeEventListener('click', Eliminar)
                }
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                $('#main-contenido').waitMe('hide');
            });
    })
}

function ListarEmpresa(escritura) {
    run_waitMe($('#main-contenido'), 1, "ios");
    var _escritura = escritura;
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
    }
    fetch(URL + '/empresa_api/get_unica_empresa', parametros)
        .then(req => req.json())
        .then(res => {

            if (res.respuesta == 'ok') {
                const parametros2 = {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        Cod_Empresa: res.data.empresa[0].Cod_Empresa
                    })
                }
                fetch(URL + '/empresa_api/get_empresa', parametros2)
                    .then(req => req.json())
                    .then(res => {
                        if (res.respuesta == 'ok') {
                            Ver(res.data.empresa_actual[0],_escritura)
                        }
                        else
                            Ver(undefined)
                        $('#main-contenido').waitMe('hide');
                    }).catch(function (e) {
                        console.log(e);
                        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
                        $('#main-contenido').waitMe('hide');
                    });
            }
            else
                Ver(undefined)
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
            $('#main-contenido').waitMe('hide');
        });
}


export { ListarEmpresa }