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
            <ul class="sidebar-menu" data-widget="tree"> 
             
            <li class="treeview active">
                <a href="#"><i class="fa fa-th"></i> <span>Movimientos de Caja</span>
                    <span class="pull-right-container">
                        <i class="fa fa-angle-left pull-right"></i>
                    </span>
                </a>
                <ul class="treeview-menu">
                    <li>
                        <a href="javascript:void(0)" onclick=${() => NuevoIngreso()}><i class="fa fa-circle-o"></i> Recibo de Ingreso</a>
                    </li>
                    <li>
                        <a href="javascript:void(0)" onclick=${() => NuevoEgreso()}><i class="fa fa-circle-o"></i> Recibo de Egreso</a>
                    </li>
                    <li>
                        <a href="javascript:void(0)" onclick=${() => NuevoCompraVentaME(true)}><i class="fa fa-circle-o"></i> Compra y Venta de Dolares</a>
                    </li>
                    <li>
                        <a href="javascript:void(0)" onclick=${() => NuevoEnvioEfectivo(true)}><i class="fa fa-circle-o"></i> Envio Efectivo</a>
                    </li>
                    <li>
                        <a href="javascript:void(0);" onclick=${() => NuevaRecepcion()}><i class="fa fa-circle-o"></i> Recepcion de Efectivo</a>
                    </li>
                </ul>
            </li>
            <li class="treeview">
                <a href="javascript:void(0);"><i class="fa fa-opencart"></i> <span> Ventas</span>
                    <span class="pull-right-container">
                        <i class="fa fa-angle-left pull-right"></i>
                    </span>
                </a>
                <ul class="treeview-menu">
                    <li>
                        <a href="javascript:void(0);" onclick=${() => NuevaVenta()}><i class="fa fa-circle-o"></i> Nueva Venta</a>
                    </li>
                </ul>
            </li>
            <li class="treeview">
                <a href="javascript:void(0);"><i class="fa fa-shopping-basket"></i> <span> Compras</span>
                    <span class="pull-right-container">
                        <i class="fa fa-angle-left pull-right"></i>
                    </span>
                </a>
                <ul class="treeview-menu">
                    <li>
                        <a href="javascript:void(0);" onclick=${() => ComprobantePago('08')}><i class="fa fa-circle-o"></i> Facturas Recibidas</a>
                    </li>
                </ul>
            </li>
            
            <li class="treeview">
                <a href="javascript:void(0);"><i class="fa fa-industry"></i> <span> Almacen</span>
                    <span class="pull-right-container">
                        <i class="fa fa-angle-left pull-right"></i>
                    </span>
                </a>
                <ul class="treeview-menu">
                    <li>
                        <a href="javascript:void(0);" onclick=${() => EntradasSalidas('NE')}><i class="fa fa-circle-o"></i><span> Registro de Entradas</span></a> 
                    </li>
                    <li>
                        <a href="javascript:void(0);" onclick=${() => EntradasSalidas('NS')}><i class="fa fa-circle-o"></i><span> Registro de Salidas</span></a> 
                    </li>
                </ul>
            </li>

            <li class="treeview">
                <a href="javascript:void(0);"><i class="fa fa-cogs"></i> <span> Administracion</span>
                    <span class="pull-right-container">
                        <i class="fa fa-angle-left pull-right"></i>
                    </span>
                </a>
                <ul class="treeview-menu">
                    <li>
                        <a href="javascript:void(0);" onclick=${() => Cuentas('14')}><i class="fa fa-circle-o"></i><span> Cuentas por Cobrar</span></a>
                    </li>
                    <li>
                        <a href="javascript:void(0);" onclick=${() => Cuentas('08')}><i class="fa fa-circle-o"></i><span> Cuentas por Pagar</span></a>
                    </li>
                </ul>
            </li>

            <li class="treeview">
                <a href="javascript:void(0);"><i class="fa fa-laptop"></i> <span> Sistema</span>
                    <span class="pull-right-container">
                        <i class="fa fa-angle-left pull-right"></i>
                    </span>
                </a>
                <ul class="treeview-menu">
                    <li>
                        <a href="javascript:void(0);" onclick=${() => NuevoArqueoCaja()}><i class="fa fa-circle-o"></i> <span> Arqueo de Caja</span></a>
                    </li>
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
        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
    });
  
}