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
            <li class="header">TABLE OF CONTENTS</li>
            <li>
                <a href="/docs/2.4/installation"><i class="fa fa-microchip"></i> <span>Installation</span></a>
            </li>
            <li>
                <a href="/docs/2.4/dependencies"><i class="fa fa-handshake-o"></i>
                    <span>Dependencies & plugins</span></a></li>
            <li>
                <a href="/docs/2.4/layout"><i class="fa fa-files-o"></i> <span>Layout</span></a></li>
            <li class="treeview ">
                <a href="#"><i class="fa fa-th"></i> <span>Components</span>
                    <span class="pull-right-container">
                        <i class="fa fa-angle-left pull-right"></i>
                    </span>
                </a>
                <ul class="treeview-menu">
                    <li>
                        <a href="/docs/2.4/main-header"><i class="fa fa-circle-o"></i> Main Header</a>
                    </li>
                    <li>
                        <a href="/docs/2.4/sidebar"><i class="fa fa-circle-o"></i> Sidebar</a>
                    </li>
                    <li>
                        <a href="/docs/2.4/control-sidebar"><i class="fa fa-circle-o"></i> Control Sidebar</a>
                    </li>
                    <li>
                        <a href="/docs/2.4/boxes"><i class="fa fa-circle-o"></i> Box</a>
                    </li>
                    <li>
                        <a href="/docs/2.4/info-box"><i class="fa fa-circle-o"></i> Info Box</a>
                    </li>
                    <li>
                        <a href="/docs/2.4/direct-chat"><i class="fa fa-circle-o"></i> Direct Chat</a>
                    </li>
                </ul>
            </li>
            <li class="treeview active">
                <a href="#"><i class="fa fa-code"></i> <span>JavaScript</span>
                    <span class="pull-right-container">
                        <i class="fa fa-angle-left pull-right"></i>
                    </span>
                </a>
                <ul class="treeview-menu">
                    <li>
                        <a href="/docs/2.4/js-layout"><i class="fa fa-circle-o"></i> Layout</a>
                    </li>
                    <li>
                        <a href="/docs/2.4/js-push-menu"><i class="fa fa-circle-o"></i> Push Menu</a>
                    </li>
                    <li>
                        <a href="/docs/2.4/js-tree"><i class="fa fa-circle-o"></i> Tree</a>
                    </li>
                    <li>
                        <a href="/docs/2.4/js-control-sidebar"><i class="fa fa-circle-o"></i> Control Sidebar</a>
                    </li>
                    <li class="active">
                        <a href="/docs/2.4/js-box-widget"><i class="fa fa-circle-o"></i> Box Widget</a>
                    </li>
                    <li>
                        <a href="/docs/2.4/js-box-refresh"><i class="fa fa-circle-o"></i> Box Refresh</a>
                    </li>
                    <li>
                        <a href="/docs/2.4/js-todo-list"><i class="fa fa-circle-o"></i> Todo List</a>
                    </li>
                </ul>
            </li>
            <li>
                <a href="/docs/2.4/browser-support"><i class="fa fa-chrome"></i><span>Browser Support</span></a>
            </li>
            <li>
                <a href="/docs/2.4/upgrade-guide"><i class="fa fa-hand-o-up"></i><span>Upgrade Guide</span></a>
            </li>
            <li>
                <a href="/docs/2.4/implementations"><i class="fa fa-bookmark-o"></i><span>Implementations</span></a>
            </li>
            <li>
                <a href="/docs/2.4/faq"><i class="fa fa-question-circle-o"></i> <span>FAQ</span></a>
            </li>
            <li>
                <a href="/docs/2.4/license"><i class="fa fa-file-text-o"></i> <span>License</span></a>
            </li>
        </ul>
            
            `
            :yo`
             
            `}`;
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
        toastr.error('La conexion esta muy lenta. Inténtelo nuevamente refrescando la pantalla','Error',{timeOut: 5000})
    });
  
}