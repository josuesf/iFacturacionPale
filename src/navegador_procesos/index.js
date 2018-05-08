var yo = require('yo-yo')
var empty = require('empty-element');

//Views CompraVenta
import { NuevoCompraVentaME } from '../sis_procesos/mod_ventas/recibo_compra_venta_me'
//Views Envio Efectivo
import { NuevoEnvioEfectivo } from '../sis_procesos/mod_ventas/transferencias'

import { NuevoIngreso } from '../sis_procesos/mod_ventas/recibo_ingreso'
var el = yo`
<ul class="sidebar-menu" data-widget="tree">
    <li class="header">Ventas</li>
    <li class="treeview">
        <a href="#">
            <i class="fa fa-home"></i> <span>Movimientos de caja</span>
            <span class="pull-right-container">
            <i class="fa fa-angle-left pull-right"></i>
            </span>
        </a>
        <ul class="treeview-menu">
            <li class=""><a  onclick=${() => NuevoCompraVentaME(true)}><i class="fa fa-circle-o"></i> Compra y Venta de Moneda Extranjera</a></li>
            <li class=""><a  onclick=${() => NuevoEnvioEfectivo(true)}><i class="fa fa-circle-o"></i> Envio Efectivo</a></li> 
            <li class=""><a  onclick=${() => NuevoIngreso()}><i class="fa fa-circle-o"></i> Recibo de Ingresos</a></li>
            
        </ul>
    </li>
    
</ul>`;

module.exports = function navegador(ctx, next) {
    var container = document.getElementById('nav-container')
    empty(container).appendChild(el);
    
}