var yo = require('yo-yo')
var empty = require('empty-element');


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
var el = yo`
<ul class="nav navbar-nav">
    <li class="dropdown">
        <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-object-group"></i> Mantenimientos <span class="caret"></span></a>
        <ul class="dropdown-menu" role="menu">
            <li class=""><a href="#" onclick=${() => ListarProductosServ(true)}><i class="fa fa-circle-o"></i> Productos y servicios</a></li>
            <li class=""><a href="#" onclick=${() => ListarClientes(true)}><i class="fa fa-circle-o"></i> Cliente/Proveedor</a></li>
        </ul>
    </li>
    <li class="dropdown">
        <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-circle-o"></i> Contabilidad <span class="caret"></span></a>
        <ul class="dropdown-menu" role="menu">
            <li class=""><a href="#" onclick=${() => ListarCuentasBancarias(true)}><i class="fa fa-circle-o"></i> Cuentas Bancarias</a></li>
        </ul>
    </li>
 

    <li class="dropdown">
        <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-puzzle-piece"></i> Logística <span class="caret"></span></a>
        <ul class="dropdown-menu" role="menu">
            <li class=""><a href="#" onclick=${() => ListarCategorias(true)}><i class="fa fa-circle-o"></i> Categorias</a></li>
            <li class=""><a href="#" onclick=${() => ListarTurnos(true)}><i class="fa fa-circle-o"></i> Turnos de Atencion</a></li>
            <li class=""><a href="#" onclick=${() => ListarAlmacenes(true)}><i class="fa fa-circle-o"></i> Almacenes</a></li>
            <li class=""><a href="#" onclick=${() => ListarConceptos(true)}><i class="fa fa-circle-o"></i> Conceptos</a></li>
        </ul>
    </li>

    <li class="dropdown">
        <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-cog"></i> Configuración <span class="caret"></span></a>
        <ul class="dropdown-menu" role="menu">
            <li class=""><a href="#" onclick=${() => ListarEmpresa(true)}><i class="fa fa-circle-o"></i> Empresa</a></li>
            <li class=""><a href="#" onclick=${() => ListarUsuarios(true)}><i class="fa fa-circle-o"></i> Usuarios</a></li>
            <li class=""><a href="#" onclick=${() => ListarCajas(true)}><i class="fa fa-circle-o"></i> Cajas</a></li>
            <li class=""><a href="#" onclick=${() => ListarModulos(true)}><i class="fa fa-circle-o"></i> Modulos</a></li>
            <li class=""><a href="#" onclick=${() => ListarSucursales(true)}><i class="fa fa-circle-o"></i> Sucursales</a></li>
            <li class=""><a href="#" onclick=${() => ListarPerfiles(true)}><i class="fa fa-circle-o"></i> Perfiles</a></li>
            <li class=""><a href="#" onclick=${() => ListarParametros(true)}><i class="fa fa-circle-o"></i> Parametros</a></li>
        </ul>
    </li>
    
</ul>`;

module.exports = function navegador(ctx, next) {
    var container = document.getElementById('navbar-collapse')
    empty(container).appendChild(el);
    // next();
}