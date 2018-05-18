var yo = require('yo-yo')
var empty = require('empty-element');

//Views CompraVenta
import { NuevoCompraVentaME } from '../sis_procesos/mod_ventas/recibo_compra_venta_me'
//Views Envio Efectivo
import { NuevoEnvioEfectivo } from '../sis_procesos/mod_ventas/transferencias'

import { NuevoIngreso } from '../sis_procesos/mod_ventas/recibo_ingreso'
import { NuevoEgreso } from '../sis_procesos/mod_ventas/recibo_egreso'
import { NuevaVenta } from '../sis_procesos/mod_ventas/ventas'


import { NuevaRecepcion } from '../sis_procesos/mod_compras/recepcion_efectivo'
import { ComprobantePago } from '../sis_procesos/mod_compras/comprobante_pago'


var el = yo`
<ul class="sidebar-menu" data-widget="tree">
    <li class="header">Ventas</li>
    <li class="treeview">
        <a href="javascript:void(0);">
            <i class="fa fa-home"></i> <span>Movimientos de caja</span>
            <span class="pull-right-container">
            <i class="fa fa-angle-left pull-right"></i>
            </span>
        </a>
        <ul class="treeview-menu">
            <li class=""><a  href="javascript:void(0)" onclick=${() => NuevoCompraVentaME(true)}><i class="fa fa-circle-o"></i> Compra y Venta de Dolares</a></li>
            <li class=""><a  href="javascript:void(0)" onclick=${() => NuevoEnvioEfectivo(true)}><i class="fa fa-circle-o"></i> Envio Efectivo</a></li> 
            <li class=""><a  href="javascript:void(0)" onclick=${() => NuevoIngreso()}><i class="fa fa-circle-o"></i> Recibo de Ingresos</a></li>
            <li class=""><a  href="javascript:void(0)" onclick=${() => NuevoEgreso()}><i class="fa fa-circle-o"></i> Recibo de Egresos</a></li>
            
        </ul>
    </li>
    <li class="treeview">
        <a href="javascript:void(0);" onclick=${() => NuevaVenta(true)}>
            <i class="fa fa-cart-plus"></i> <span> Nueva Venta</span>
        </a>
    </li>
    <li class="header">Compras</li>
    <li class="treeview">
        <a href="javascript:void(0);" onclick=${()=>NuevaRecepcion()}>
            <i class="fa fa-arrow-circle-down"></i> <span>Recepcion de Transferencias</span>   
        </a>
    </li>
    <li class="treeview">
        <a href="javascript:void(0);" onclick=${()=>ComprobantePago('08')}>
            <i class="fa fa-circle-o"></i> <span>Facturas Recibidas</span>
        </a>
    </li>
</ul>`;

module.exports = function navegador(ctx, next) {
    var container = document.getElementById('nav-container')
    empty(container).appendChild(el);
    
}