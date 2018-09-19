var yo = require('yo-yo')
var empty = require('empty-element');
import { URL } from '../constantes_entorno/constantes'

//Views CompraVenta
import { NuevoCompraVentaME } from '../sis_procesos/mod_ventas/recibo_compra_venta_me'
//Views Envio Efectivo
import { NuevoEnvioEfectivo } from '../sis_procesos/mod_ventas/transferencias'

import { NuevoIngreso } from '../sis_procesos/mod_ventas/recibo_ingreso'
import { NuevoEgreso } from '../sis_procesos/mod_ventas/recibo_egreso'
import { NuevaVenta } from '../sis_procesos/mod_ventas/ventas'
import { NuevoArqueoCaja } from '../sis_procesos/mod_ventas/arqueo_caja'
import { refrescar_movimientos } from '../sis_procesos/movimientos_caja'


import { NuevaRecepcion } from '../sis_procesos/mod_compras/recepcion_efectivo'
import { ComprobantePago } from '../sis_procesos/mod_compras/comprobante_pago'
import { EntradasSalidas } from '../sis_procesos/mod_almacen/entradas_salidas'
import { Cuentas } from '../sis_procesos/mod_administracion/cuentas_pagar_compra'
import { LibroReservas } from '../sis_procesos/mod_reservas/reservas'
import { NuevaHabitacion } from '../sis_procesos/mod_reservas/habitaciones'


// administracion

import { ListarUsuarios } from '../sis_admin/mod_configuracion/usuarios/listar'
import { ListarCajas } from '../sis_admin/mod_configuracion/cajas/listar'
import { ListarModulos } from '../sis_admin/mod_configuracion/modulos/listar'
import { ListarSucursales } from '../sis_admin/mod_configuracion/sucursales/listar'
import { ListarPerfiles } from '../sis_admin/mod_configuracion/perfiles/listar'
import { ListarParametros } from '../sis_admin/mod_configuracion/parametros/listar';
import { ListarEmpresa } from '../sis_admin/mod_configuracion/empresa/listar'

//views de logistica
import { ListarCategorias } from '../sis_admin/mod_logistica/categorias/listar'
import { ListarTurnos } from '../sis_admin/mod_logistica/turnos/listar'
import { ListarAlmacenes } from '../sis_admin/mod_logistica/almacenes/listar'
import { ListarConceptos } from '../sis_admin/mod_logistica/conceptos/listar'

//views de inicio
import { ListarProductosServ } from '../sis_admin/mod_inicio/productos_serv/listar'
//Views Inicio
import { ListarClientes } from '../sis_admin/mod_inicio/clientes_prov/listar'
//View Contabilidad
import {ListarCuentasBancarias} from '../sis_admin/mod_contabilidad/cuentas_bancarias/listar'



function Ver(Flag_Cerrado) { 
   
    var el = yo`
        ${!Flag_Cerrado?
            yo` 
            <ul id="main-menu" class="gui-controls"> 

                <li class="gui-folder expanded">
                    <a href="javascript:void(0)">
                        <div class="gui-icon"><i class="fa fa-th"></i></div>
                        <span class="title">Movimientos de Caja</span>
                    </a> 
                    <ul>
                        <li><a href="javascript:void(0)" onclick=${() => NuevoIngreso()}><span class="title">Recibo de Ingreso</span></a></li>

                        <li><a href="javascript:void(0)" onclick=${() => NuevoEgreso()}><span class="title">Recibo de Egreso</span></a></li>

                        <li><a href="javascript:void(0)" onclick=${() => NuevoCompraVentaME(true)}><span class="title">Compra y Venta de Dolares</span></a></li>

                        <li><a href="javascript:void(0)" onclick=${() => NuevoEnvioEfectivo(true)}><span class="title"> Envio Efectivo</span></a></li>

                        <li><a href="javascript:void(0);" onclick=${() => NuevaRecepcion()}><span class="title"> Recepcion de Efectivo</span></a></li>

                    </ul> 
                </li>

                <li class="gui-folder">
                    <a>
                        <div class="gui-icon"><i class="md md-shopping-cart"></i></div>
                        <span class="title"> Ventas</span>
                    </a> 
                    <ul>
                        <li><a href="javascript:void(0)" onclick=${() => NuevaVenta()}><span class="title">Nueva Venta</span></a></li>
                    </ul> 
                </li>

                <li class="gui-folder">
                    <a>
                        <div class="gui-icon"><i class="fa fa-cart-arrow-down"></i></div>
                        <span class="title"> Compras</span>
                    </a> 
                    <ul>
                        <li><a href="javascript:void(0)" onclick=${() => ComprobantePago('08')}><span class="title">Facturas recibidas</span></a></li>
                    </ul> 
                </li>

                <li class="gui-folder">
                    <a>
                        <div class="gui-icon"><i class="fa fa-circle-o"></i></div>
                        <span class="title"> Almacen</span>
                    </a> 
                    <ul>
                        <li><a href="javascript:void(0)" onclick=${() => EntradasSalidas('NE')}><span class="title"> Registro de Entradas</span></a></li>
                        <li><a href="javascript:void(0)" onclick=${() => EntradasSalidas('NS')}><span class="title"> Registro de Salidas</span></a></li>
                    </ul> 
                </li>

                <li class="gui-folder">
                    <a>
                        <div class="gui-icon"><i class="fa fa-cogs"></i></div>
                        <span class="title"> Administracion</span>
                    </a> 
                    <ul>
                        <li><a href="javascript:void(0)" onclick=${() => Cuentas('14')}><span class="title"> Cuentas por Cobrar</span></a></li>
                        <li><a href="javascript:void(0)" onclick=${() => Cuentas('08')}><span class="title"> Cuentas por Pagar</span></a></li>
                    </ul> 
                </li>

                <li class="gui-folder">
                    <a>
                        <div class="gui-icon"><i class="fa fa-laptop"></i></div>
                        <span class="title"> Sistema</span>
                    </a> 
                    <ul>
                        <li><a href="javascript:void(0)" onclick=${() => NuevoArqueoCaja()}><span class="title"> Arqueo de Caja</span></a></li> 
                    </ul> 
                </li>

                <li class="gui-folder">
                    <a>
                        <div class="gui-icon"><i class="fa fa-cog"></i></div>
                        <span class="title"> Extras</span>
                    </a> 

                    <ul>

                        <li class="gui-folder">
                            <a> 
                                <span class="title">Mantenimientos</span>
                            </a> 
                            <ul>
                                <li>
                                    <a href="javascript:void(0)" onclick=${() => ListarProductosServ(true)}><span class="title"> Productos y servicios</span></a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)" onclick=${() => ListarClientes(true)}><span class="title"> Cliente/Proveedor</span></a>
                                </li>
                            </ul>
                        </li>

                        <li class="gui-folder">
                            <a> 
                                <span class="title">Contabilidad</span>
                            </a> 
                            <ul>
                                <li>
                                    <a href="javascript:void(0)" onclick=${() => ListarCuentasBancarias(true)}><span class="title"> Cuentas Bancarias</span></a>
                                </li>
                            </ul>
                        </li>

                        <li class="gui-folder">
                            <a> 
                                <span class="title">Logistica</span>
                            </a> 
                            <ul>
                                <li>
                                    <a href="javascript:void(0)" onclick=${() => ListarCategorias(true)}><span class="title"> Categoria</span></a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)" onclick=${() => ListarTurnos(true)}><span class="title"> Turnos de Atencion</span></a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)" onclick=${() => ListarAlmacenes(true)}><span class="title"> Almacenes</span></a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)" onclick=${() => ListarConceptos(true)}><span class="title"> Conceptos</span></a>
                                </li>
                                
                            </ul>
                        </li>

                        
                        <li class="gui-folder">
                            <a> 
                                <span class="title">Configuracion</span>
                            </a> 
                            <ul>
                                <li>
                                    <a href="javascript:void(0)" onclick=${() => ListarEmpresa(true)}><span class="title"> Empresa</span></a>
                                </li>
                                
                                <li>
                                    <a href="javascript:void(0)" onclick=${() => ListarSucursales(true)}><span class="title"> Sucursales</span></a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)" onclick=${() => ListarUsuarios(true)}><span class="title"> Usuarios</span></a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)" onclick=${() => ListarPerfiles(true)}><span class="title"> Perfiles</span></a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)" onclick=${() => ListarCajas(true)}><span class="title"> Cajas</span></a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)" onclick=${() => ListarParametros(true)}><span class="title"> Parametros</span></a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)" onclick=${() => ListarModulos(true)}><span class="title"> Modulos</span></a>
                                </li>
                                
                            </ul>
                        </li>
        

                    </ul> 
                    
                </li>

            </ul>`
            :yo`
            <ul id="main-menu" class="gui-controls"> 

            <li class="gui-folder expanded not-active">
                <a>
                    <div class="gui-icon"><i class="fa fa-th"></i></div>
                    <span class="title">Movimientos de Caja</span>
                </a> 
                <ul>
                    <li><a href="javascript:void(0)"><span class="title">Recibo de Ingreso</span></a></li>

                    <li><a href="javascript:void(0)"><span class="title">Recibo de Egreso</span></a></li>

                    <li><a href="javascript:void(0)"><span class="title">Compra y Venta de Dolares</span></a></li>

                    <li><a href="javascript:void(0)"><span class="title"> Envio Efectivo</span></a></li>

                    <li><a href="javascript:void(0);"><span class="title"> Recepcion de Efectivo</span></a></li>

                </ul> 
            </li>

            <li class="gui-folder not-active">
                <a>
                    <div class="gui-icon"><i class="md md-shopping-cart"></i></div>
                    <span class="title"> Ventas</span>
                </a> 
                <ul>
                    <li><a href="javascript:void(0)"><span class="title">Nueva Venta</span></a></li>
                </ul> 
            </li>

            <li class="gui-folder not-active">
                <a>
                    <div class="gui-icon"><i class="fa fa-cart-arrow-down"></i></div>
                    <span class="title"> Compras</span>
                </a> 
                <ul>
                    <li><a href="javascript:void(0)"><span class="title">Facturas recibidas</span></a></li>
                </ul> 
            </li>

            <li class="gui-folder not-active">
                <a>
                    <div class="gui-icon"><i class="fa fa-circle-o"></i></div>
                    <span class="title"> Almacen</span>
                </a> 
                <ul>
                    <li><a href="javascript:void(0)"><span class="title"> Registro de Entradas</span></a></li>
                    <li><a href="javascript:void(0)"><span class="title"> Registro de Entradas</span></a></li>
                </ul> 
            </li>

            <li class="gui-folder not-active">
                <a>
                    <div class="gui-icon"><i class="fa fa-cogs"></i></div>
                    <span class="title"> Administracion</span>
                </a> 
                <ul>
                    <li><a href="javascript:void(0)"><span class="title"> Cuentas por Cobrar</span></a></li>
                    <li><a href="javascript:void(0)"><span class="title"> Cuentas por Pagar</span></a></li>
                </ul> 
            </li>

            <li class="gui-folder not-active">
                <a>
                    <div class="gui-icon"><i class="fa fa-laptop"></i></div>
                    <span class="title"> Sistema</span>
                </a> 
                <ul>
                    <li><a href="javascript:void(0)"><span class="title"> Arqueo de Caja</span></a></li> 
                </ul> 
            </li>


            <li class="gui-folder not-active">
                <a>
                    <div class="gui-icon"><i class="fa fa-cog"></i></div>
                    <span class="title"> Configuracion</span>
                </a> 

                <ul>

                    <li class="gui-folder">
                        <a> 
                            <span class="title">Mantenimientos</span>
                        </a> 
                        <ul>
                            <li>
                                <a href="javascript:void(0)"><span class="title"> Productos y servicios</span></a>
                            </li>
                            <li>
                                <a href="javascript:void(0)"><span class="title"> Cliente/Proveedor</span></a>
                            </li>
                        </ul>
                    </li>

                    <li class="gui-folder">
                        <a> 
                            <span class="title">Contabilidad</span>
                        </a> 
                        <ul>
                            <li>
                                <a href="javascript:void(0)"><span class="title"> Cuentas Bancarias</span></a>
                            </li>
                        </ul>
                    </li>

                    <li class="gui-folder">
                        <a> 
                            <span class="title">Logistica</span>
                        </a> 
                        <ul>
                            <li>
                                <a href="javascript:void(0)"><span class="title"> Categoria</span></a>
                            </li>
                            <li>
                                <a href="javascript:void(0)"><span class="title"> Turnos de Atencion</span></a>
                            </li>
                            <li>
                                <a href="javascript:void(0)"><span class="title"> Almacenes</span></a>
                            </li>
                            <li>
                                <a href="javascript:void(0)"><span class="title"> Conceptos</span></a>
                            </li>
                            
                        </ul>
                    </li>

                    <li class="gui-folder">
                        <a> 
                            <span class="title">Configuracion</span>
                        </a> 
                        <ul>
                            <li>
                                <a href="javascript:void(0)"><span class="title"> Empresa</span></a>
                            </li>
                            
                            <li>
                                <a href="javascript:void(0)"><span class="title"> Sucursales</span></a>
                            </li>
                            <li>
                                <a href="javascript:void(0)"><span class="title"> Usuarios</span></a>
                            </li>
                            <li>
                                <a href="javascript:void(0)"><span class="title"> Perfiles</span></a>
                            </li>
                            <li>
                                <a href="javascript:void(0)"><span class="title"> Cajas</span></a>
                            </li>
                            <li>
                                <a href="javascript:void(0)"><span class="title"> Parametros</span></a>
                            </li>
                            <li>
                                <a href="javascript:void(0)"><span class="title"> Modulos</span></a>
                            </li>
                            
                        </ul>
                    </li>

                </ul> 
                
            </li>

        </ul>
            `}`;
    var container = document.getElementById('nav-container')
    empty(container).appendChild(el);
    
    $.getScript("/assets/js/core/cache/63d0445130d69b2868a8d28c93309746.js", function( data, textStatus, jqxhr ) {
    });

    $(document).ready(function(){
        $("#btnCambiarTurno").click(function(){
            AbrirModalCambiarTurno()
        })
    })  
}

function AbrirModalCambiarTurno(){

    const fecha = new Date()
    var anio = fecha.getFullYear() 

    var el = yo`
    <div class="modal-dialog modal-sm">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
                <h4 class="modal-title">Seleccione el turno </h4>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="alert alert-callout alert-danger" id="divErrorCambioTurno" style="display: none;">
                        <p id="textErrorCambioTurno" class="text-danger"></p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-group">
                        <label for="Gestion">Gestion</label>
                            <input type="number" id="Gestion" value=${anio} class="form-control" onkeyup=${()=>TraerPeriodos()} onchange=${()=>TraerPeriodos()}>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-group" id="divPeriodos">
                        <label for="Periodo">Periodo</label>
                            <select id="Periodo" class="form-control" onchange=${()=>TraerTurnos()}>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-group" id="divTurnos">
                        <label for="Turno">Turno</label>
                            <select id="Turno" class="form-control">
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="btnCambiarTurno" onclick=${()=>CambiarTurnoSistema()}>Cambiar</button>
            </div>
        </div>
    </div>`
    var modal_proceso = document.getElementById('modal-alerta');
    empty(modal_proceso).appendChild(el);
    $('#modal-alerta').modal()
    TraerPeriodos()
}

function LlenarPeriodo(periodos,idSelect){
    var el = yo`
        ${periodos.map(e => yo`
             <option value="${e.Cod_Periodo}">${e.Nom_Periodo}</option>
        `)}`   
    $("#"+idSelect).html('')
    $("#"+idSelect).html(el) 
    const fecha = new Date()
    const mes = fecha.getMonth() + 1 
    var periodo = fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes)
    $("#"+idSelect).val(periodo) 
}

function LlenarTurnos(turnos,idSelect){
    var el = yo`
        ${turnos.map(e => yo`
             <option value="${e.Cod_Turno}">${e.Des_Turno}</option>
        `)}`   
    $("#"+idSelect).html('')
    $("#"+idSelect).html(el)
    $("#"+idSelect+" option:last").attr("selected", "selected") 
}


function TraerPeriodos(){
    run_waitMe($('#divPeriodos'), 1, "ios","");
    var Gestion = $("#Gestion").val()  
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            Gestion
        })
    }
    fetch(URL + '/empresa_api/get_periodos_by_gestion', parametros)
        .then(req => req.json())
        .then(res => {
            LlenarPeriodo(res.data.periodos,'Periodo')
            TraerTurnos()
            $('#divPeriodos').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            $("#divErrorCambioTurno").css("display","block")
            $("#textErrorCambioTurno").text('Ocurrio un error en la conexion o al momento de cargar los datos. Inténtelo nuevamente refrescando la pantalla') 
            $('#divPeriodos').waitMe('hide');
          //toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos. Inténtelo nuevamente refrescando la pantalla','Error',{timeOut: 5000})
        });
}

function TraerTurnos(){
    run_waitMe($('#divTurnos'), 1, "ios","");
    var Cod_Periodo = $("#Periodo").val()
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            Cod_Periodo
        })
    }
    fetch(URL + '/empresa_api/get_turnos_by_periodo', parametros)
        .then(req => req.json())
        .then(res => { 
            LlenarTurnos(res.data.turnos,'Turno')
            $('#divTurnos').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            $('#divTurnos').waitMe('hide');
            $("#divErrorCambioTurno").css("display","block")
            $("#textErrorCambioTurno").text('Ocurrio un error en la conexion o al momento de cargar los datos. Inténtelo nuevamente refrescando la pantalla') 
            
            //toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos. Inténtelo nuevamente refrescando la pantalla','Error',{timeOut: 5000})
        });
}

function CambiarTurnoSistema(){
    run_waitMe($('#modal-alerta'), 1, "ios","Cambiando turno...");
    var Turno = $("#Turno").val()
    var Gestion = $("#Gestion").val()
    var Periodo = $("#Periodo").val()
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            Gestion,
            Periodo,
            Turno
        })
    }
    fetch(URL+'/turnos_api/cambiar_turno_sistema', parametros)
    .then(req => req.json())
    .then(res => { 
       if(res.respuesta=='ok'){
        location.reload();
       }else{
           $("#divErrorCambioTurno").css("display","block")
           $("#textErrorCambioTurno").text(res.data) 
       }
       $('#modal-alerta').waitMe('hide');
    }).catch(function (e) {
        console.log(e);
        $("#divErrorCambioTurno").css("display","block")
        $("#textErrorCambioTurno").text('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e)
        $('#modal-alerta').waitMe('hide');
    });
}

module.exports = function navegador(ctx, next) {
    
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
        })
    }
    fetch(URL+'/cajas_api/get_arqueo', parametros)
    .then(req => req.json())
    .then(res => { 
        Ver(res.arqueo[0].Flag_Cerrado)
    }).catch(function (e) {
        console.log(e);
        //toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
    });
  
}