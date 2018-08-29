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


import { NuevaRecepcion } from '../sis_procesos/mod_compras/recepcion_efectivo'
import { ComprobantePago } from '../sis_procesos/mod_compras/comprobante_pago'
import { EntradasSalidas } from '../sis_procesos/mod_almacen/entradas_salidas'
import { Cuentas } from '../sis_procesos/mod_administracion/cuentas_pagar_compra'
import { LibroReservas } from '../sis_procesos/mod_reservas/reservas'
import { NuevaHabitacion } from '../sis_procesos/mod_reservas/habitaciones'

function Ver(Flag_Cerrado) { 
   
    var el = yo`
        ${!Flag_Cerrado?
            yo` 
            <ul id="main-menu" class="gui-controls"> 

                <li class="gui-folder expanded">
                    <a>
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
                        <li><a href="javascript:void(0)" onclick=${() => EntradasSalidas('NS')}><span class="title"> Registro de Entradas</span></a></li>
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
            </ul>`
            :yo`
        <ul class="sidebar-menu" data-widget="tree"> 
             
            <li class="treeview" class="not-active">
                <a href="#"><i class="fa fa-th"></i> <span>Movimientos de Caja</span>
                    <span class="pull-right-container">
                        <i class="fa fa-angle-left pull-right"></i>
                    </span>
                </a>
                <ul class="treeview-menu">
                    <li>
                        <a href="javascript:void(0)"><i class="fa fa-circle-o"></i> Recibo de Ingreso</a>
                    </li>
                    <li>
                        <a href="javascript:void(0)"><i class="fa fa-circle-o"></i> Recibo de Egreso</a>
                    </li>
                    <li>
                        <a href="javascript:void(0)"><i class="fa fa-circle-o"></i> Compra y Venta de Dolares</a>
                    </li>
                    <li>
                        <a href="javascript:void(0)"><i class="fa fa-circle-o"></i> Envio Efectivo</a>
                    </li>
                    <li>
                        <a href="javascript:void(0);"><i class="fa fa-circle-o"></i> Recepcion de Efectivo</a>
                    </li>
                </ul>
            </li>
            <li class="treeview" class="not-active">
                <a href="javascript:void(0);"><i class="fa fa-opencart"></i> <span> Ventas</span>
                    <span class="pull-right-container">
                        <i class="fa fa-angle-left pull-right"></i>
                    </span>
                </a>
                <ul class="treeview-menu">
                    <li>
                        <a href="javascript:void(0);"><i class="fa fa-circle-o"></i> Nueva Venta</a>
                    </li>
                </ul>
            </li>
            <li class="treeview" class="not-active">
                <a href="javascript:void(0);"><i class="fa fa-shopping-basket"></i> <span> Compras</span>
                    <span class="pull-right-container">
                        <i class="fa fa-angle-left pull-right"></i>
                    </span>
                </a>
                <ul class="treeview-menu">
                    <li>
                        <a href="javascript:void(0);"><i class="fa fa-circle-o"></i> Facturas Recibidas</a>
                    </li>
                </ul>
            </li>
            
            <li class="treeview" class="not-active">
                <a href="javascript:void(0);"><i class="fa fa-industry"></i> <span> Almacen</span>
                    <span class="pull-right-container">
                        <i class="fa fa-angle-left pull-right"></i>
                    </span>
                </a>
                <ul class="treeview-menu">
                    <li>
                        <a href="javascript:void(0);"><i class="fa fa-circle-o"></i><span> Registro de Entradas</span></a> 
                    </li>
                    <li>
                        <a href="javascript:void(0);"><i class="fa fa-circle-o"></i><span> Registro de Salidas</span></a> 
                    </li>
                </ul>
            </li>

            <li class="treeview" class="not-active">
                <a href="javascript:void(0);"><i class="fa fa-cogs"></i> <span> Administracion</span>
                    <span class="pull-right-container">
                        <i class="fa fa-angle-left pull-right"></i>
                    </span>
                </a>
                <ul class="treeview-menu">
                    <li>
                        <a href="javascript:void(0);"><i class="fa fa-circle-o"></i><span> Cuentas por Cobrar</span></a>
                    </li>
                    <li>
                        <a href="javascript:void(0);"><i class="fa fa-circle-o"></i><span> Cuentas por Pagar</span></a>
                    </li>
                </ul>
            </li>

            <li class="treeview" class="not-active">
                <a href="javascript:void(0);"><i class="fa fa-laptop"></i> <span> Sistema</span>
                    <span class="pull-right-container">
                        <i class="fa fa-angle-left pull-right"></i>
                    </span>
                </a>
                <ul class="treeview-menu">
                    <li>
                        <a href="javascript:void(0);"><i class="fa fa-circle-o"></i> <span> Arqueo de Caja</span></a>
                    </li>
                </ul>
            </li>
 

        </ul>`}`;
    var container = document.getElementById('nav-container')
    empty(container).appendChild(el);
    
    $.getScript("/assets/js/core/cache/63d0445130d69b2868a8d28c93309746.js", function( data, textStatus, jqxhr ) {
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