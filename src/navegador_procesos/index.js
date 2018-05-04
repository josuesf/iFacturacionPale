var yo = require('yo-yo')
var empty = require('empty-element');

//Views CompraVenta
import { NuevoCompraVentaDolar } from '../sis_procesos/mod_ventas/mod_compra_venta_moneda_extranjera/agregar'

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
            <li class=""><a href="#" onclick=${() => console.log('hola')}><i class="fa fa-circle-o"></i> Recibo de Ingresos</a></li>
            <li class=""><a  onclick=${() => NuevoCompraVentaDolar(true)}><i class="fa fa-circle-o"></i> Compra y Venta de Dolar</a></li>
            <li class=""><a  onclick=${() => NuevoIngreso()}><i class="fa fa-circle-o"></i> Recibo de Ingresos</a></li>
            <li class=""><a href="#" onclick=${() => console.log('hola')}><i class="fa fa-circle-o"></i> Recibo de Egresos</a></li>
        </ul>
    </li>
    
</ul>`;

module.exports = function navegador(ctx, next) {
    var container = document.getElementById('nav-container')
    empty(container).appendChild(el);
    
}