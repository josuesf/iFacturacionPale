var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../constantes_entorno/constantes'
import { LimpiarVariablesGlobales } from '../../../utility/tools'

function VerBuscarCuentasPendientes(CodLibro,cuentas){ 
    LimpiarVariablesGlobales()
    var el = yo`
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button> 
                    <h4 class="modal-title"><strong>Buscar Pendientes</strong></h4>
                </div>
                <div class="modal-body">
                    
                    <div class="row">
                        <div class="col-sm-12 col-md-12">
                            <div class="table-responsive" id="contenedorTablaClientesCuentas"> 
                            </div>
                        </div>
                    </div>
                                  
                </div>
                <div class="modal-footer text-center"> 
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button> 
                </div>
            </div>
        </div>`

    var modal_proceso = document.getElementById('modal-otros-procesos');
    empty(modal_proceso).appendChild(el);
    $('#modal-otros-procesos').modal()   
    AgregarTabla(cuentas,CodLibro)
}

function AgregarTabla(cuentas,CodLibro){ 
 
    var el = yo`<table id="example" class="table table-bordered table-striped">
    <thead>
        <tr>
            <th>Doc</th>
            <th>Cliente</th>
            <th>Emision</th>
            <th>Vencimiento</th>
            <th>Documento</th> 
            <th>Moneda</th> 
            <th>Faltante</th>
            <th>Opciones</th>
        </tr>
    </thead>
    <tbody>
        ${cuentas.map(c => yo`
        <tr> 
            <td>${c.Doc_Cliente}</td>
            <td>${c.Nom_Cliente}</td> 
            <td>${c.FechaEmision}</td> 
            <td>${c.FechaVencimiento}</td> 
            <td>${c.Documento}</td> 
            <td>${c.Moneda}</td> 
            <td>${c.TotalFaltante}</td>  
            <td><button class="btn btn-xs btn-primary" data-dismiss="modal" onclick="${()=>SeleccionarCuenta(c)}"><i class="fa fa-check"></i> Elegir</button></td>
        </tr>`)}
    </tbody>

</table>`
    empty(document.getElementById('contenedorTablaClientesCuentas')).appendChild(el);

    $('#example').DataTable({
        "lengthChange": false,
        "oLanguage": {
            "sSearch": "Buscar:"
        }
    });

    $("#example_filter").find("input").keyup(function(){
    })
}

function SeleccionarCuenta(cuenta){
    global.objCliente = cuenta
}
 

function BuscarCuentasPendientes(Cod_Libro,Id_Cliente,FechaInicio,FechaFin){ 
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Id_Cliente,
            Cod_Libro,
            FechaInicio,
            FechaFin,
        })
    }
    fetch(URL+'/recibo_iegreso_api/get_cuentas_by_cobrar_pagar', parametros)
    .then(req => req.json())
    .then(res => {
        if (res.respuesta == 'ok') {
            var cuentas = res.data.cuentas
            VerBuscarCuentasPendientes(Cod_Libro,cuentas)
        }
    }).catch(function (e) {
        console.log(e);
        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
    });
    //VerBuscarCuentasPendientes(CodLibro)
}

export {  BuscarCuentasPendientes }