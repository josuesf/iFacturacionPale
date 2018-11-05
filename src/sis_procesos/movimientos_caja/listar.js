var yo = require('yo-yo')
var empty = require('empty-element');
import { URL,URL_REPORT,NOMBRES_DOC } from '../../constantes_entorno/constantes'
import { CargarPDFModal } from '../modales/pdf'
import { ConvertirCadena } from '../../../utility/tools' 


function Ver(movimientos,callback) {
    var el = yo`
        <div>
          
            <section class="content">
                <div class="row">
                    <div class="col-md-12"> 
                        <div class="card">
                            <div  class="card-head">
                                <ul class="nav nav-tabs" id="tabs">
                                    <li class="active"><a href="#tab_1" id="id_1" data-toggle="tab" aria-expanded="true">Consultas de movimientos</a></li>
                                </ul>
                            </div>
                            <div class="tab-content" id="tabs_contents" style="padding: 10px;">
                                <div class="tab-pane active" id="tab_1">
                                    
                                    <div class="box box-primary">
                                       
                                        <div class="box-body">
                                            <div class="table-responsive">
                                            <table id="tablaMovimientos" class="table table-hover">
                                                <thead>
                                                    <tr> 
                                                        <th>Fecha Emision</th> 
                                                        <th>Documento</th>
                                                        <th>Cliente/Proveedor</th>
                                                        <th>Ingreso</th>
                                                        <th>Egreso</th>
                                                        <th>Usuario</th>
                                                        <th>Estado</th>
                                                        <th>Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                ${movimientos.map(u => yo`
                                                <tr>
                                                    <td>${u.FechaEmision.toString().split('T')[0]}</td> 
                                                    <td>${u.Documento}</td>
                                                    <td>${u.Cliente}</td>
                                                    <td><span class="badge style-success">${u.SimboloIng} ${u.Ingreso}</span></td>
                                                    <td><span class="badge style-danger">${u.SimboloEgr} ${u.Egreso}</span></td>
                                                    <td>${u.Cod_UsuarioReg}</td>
                                                    <td><span class="badge style-primary">${u.Estado}</span></td>
                                                    <td> 
                                                        <div class="btn-group">
                                                            <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            Elegir una accion <span class="caret"></span>
                                                            </button>
                                                            <ul class="dropdown-menu">
                                                                <li><a href="javascript:void(0)"><i class="fa fa-times-circle"></i> Anular</a></li>
                                                                <li><a href="javascript:void(0)"><i class="fa fa-print"></i> Reimprimir</a></li> 
                                                                <li><a href="javascript:void(0)"><i class="fa fa-calendar"></i> Cambiar Turno</a></li>
                                                                <li><a href="javascript:void(0)"><i class="fa fa-close"></i> Eliminar</a></li>
                                                            </ul>
                                                        </div>
                                                    </td>
                                                </tr>`)}
                                                </tbody>
                    
                                            </table>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>`;
    
    var container = document.getElementById('main-contenido')
    empty(container).appendChild(el); 
}
 
module.exports = function consulta_movimientos(ctx, next) {
    run_waitMe($('#base'), 1, "ios");
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
        });
    next();
} 