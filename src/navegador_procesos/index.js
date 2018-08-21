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
            yo`<ul class="nav navbar-nav">
                
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-refresh"></i> Movimientos de caja <span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <li class=""><a  href="javascript:void(0)" onclick=${() => NuevoIngreso()}>Recibo de Ingresos</a></li>
                        <li class=""><a  href="javascript:void(0)" onclick=${() => NuevoEgreso()}> Recibo de Egresos</a></li>
                        <li class=""><a  href="javascript:void(0)" onclick=${() => NuevoCompraVentaME(true)}> Compra y Venta de Dolares</a></li>
                        <li class=""><a  href="javascript:void(0)" onclick=${() => NuevoEnvioEfectivo(true)}> Envio Efectivo</a></li> 
                        <li class=""><a href="javascript:void(0);" onclick=${() => NuevaRecepcion()}> <span>Recepcion de Efectivo</span></a></li>
                    </ul>
                </li>

                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-opencart"></i> Ventas<span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <li class=""><a href="javascript:void(0);" onclick=${() => NuevaVenta()}><span> Nueva Venta</span></a></li>
                    </ul>
                </li>

                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-shopping-basket"></i> Compras<span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <li>
                            <a href="javascript:void(0);" onclick=${() => ComprobantePago('08')}>
                                <span>Facturas Recibidas</span>
                            </a>
                        </li>
                    </ul>
                </li>

                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-industry"></i> Almacen<span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <li class=""><a href="javascript:void(0);" onclick=${() => EntradasSalidas('NE')}><i class="fa fa-arrow-circle-down"></i> <span> Registro de Entradas</span></a></li>
                        <li class=""><a href="javascript:void(0);" onclick=${() => EntradasSalidas('NS')}><i class="fa fa-arrow-circle-up"></i> <span> Registro de Salidas</span></a></li>
                    </ul>
                </li>

                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-cogs"></i> Administracion<span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <li><a href="javascript:void(0);" onclick=${() => Cuentas('14')}><span> Cuentas por Cobrar</span></a></li>
                        <li><a href="javascript:void(0);" onclick=${() => Cuentas('08')}><span> Cuentas por Pagar</span></a></li>
                    </ul>
                </li>

                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-laptop"></i> Sistema<span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <li><a href="javascript:void(0);" onclick=${() => NuevoArqueoCaja()}><i class="fa fa-circle-o"></i> <span> Arqueo de Caja</span></a></li>  
                    </ul>
                </li>
 
            </ul>`
            :yo`
            <ul class="nav navbar-nav">
                
                <li class="dropdown not-active">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Movimientos de caja <span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <li class=""><a  href="javascript:void(0)"><i class="fa fa-circle-o"></i> Recibo de Ingresos</a></li>
                        <li class=""><a  href="javascript:void(0)"><i class="fa fa-circle-o"></i> Recibo de Egresos</a></li>
                        <li class=""><a  href="javascript:void(0)"><i class="fa fa-circle-o"></i> Compra y Venta de Dolares</a></li>
                        <li class=""><a  href="javascript:void(0)"><i class="fa fa-circle-o"></i> Envio Efectivo</a></li> 
                        <li class=""><a href="javascript:void(0);"><i class="fa fa-circle-o"></i> <span>Recepcion de Efectivo</span></a></li>
                    </ul>
                </li>

                <li class="dropdown not-active">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Ventas<span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <li class=""><a href="javascript:void(0);"><i class="fa fa-cart-plus"></i> <span> Nueva Venta</span></a></li>
                        <li class=""><a href="javascript:void(0);"><i class="fa fa-shopping-basket"></i> <span> Venta Simple</span></a></li>
                        <li class=""><a href="javascript:void(0);"><i class="fa fa-opencart"></i> <span> Venta Completa</span></a></li>
                    </ul>
                </li>

                <li class="dropdown not-active">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Compras<span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <li>
                            <a href="javascript:void(0);">
                                <i class="fa fa-circle-o"></i> <span>Facturas Recibidas</span>
                            </a>
                        </li>
                    </ul>
                </li>

                <li class="dropdown not-active">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Almacen<span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <li class=""><a href="javascript:void(0);"><i class="fa fa-arrow-circle-down"></i> <span> Registro de Entradas</span></a></li>
                        <li class=""><a href="javascript:void(0);"><i class="fa fa-arrow-circle-up"></i> <span> Registro de Salidas</span></a></li>
                    </ul>
                </li>

                <li class="dropdown not-active">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Administracion<span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <li><a href="javascript:void(0);"><span> Cuentas por Cobrar</span></a></li>
                        <li><a href="javascript:void(0);"><span> Cuentas por Pagar</span></a></li>
                    </ul>
                </li>

                <li class="dropdown not-active">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Administracion<span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <li><a href="javascript:void(0);"><i class="fa fa-circle-o"></i> <span> Arqueo de Caja</span></a></li>  
                    </ul>
                </li>
 
            </ul>
            `}`;
    var container = document.getElementById('navbar-collapse')
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