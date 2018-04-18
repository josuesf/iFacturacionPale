var yo = require('yo-yo')
var empty = require('empty-element');


import { ListarUsuarios } from '../usuarios/listar'
import { ListarCajas } from '../cajas/listar'
import { ListarModulos } from '../modulos/listar'
import { ListarSucursales } from '../sucursales/listar'
import { ListarPerfiles } from '../perfiles/listar'
import { ListarParametros } from '../parametros/listar';

var el = yo`
<ul class="sidebar-menu" data-widget="tree">
    <li class="header">Mantenimientos</li>
    <li class="treeview">
        <a href="#"W>
            <i class="fa fa-cog"></i> <span>Configuracion</span>
            <span class="pull-right-container">
            <i class="fa fa-angle-left pull-right"></i>
            </span>
        </a>
        <ul class="treeview-menu">
            <li class=""><a href="" onclick=${() => ListarUsuarios(true)}><i class="fa fa-circle-o"></i> Usuarios</a></li>
            <li class=""><a href="" onclick=${() => ListarCajas(true)}><i class="fa fa-circle-o"></i> Cajas</a></li>
            <li class=""><a href="" onclick=${() => ListarModulos(true)}><i class="fa fa-circle-o"></i> Modulos</a></li>
            <li class=""><a href="" onclick=${() => ListarSucursales(true)}><i class="fa fa-circle-o"></i> Sucursales</a></li>
            <li class=""><a href="" onclick=${() => ListarPerfiles(true)}><i class="fa fa-circle-o"></i> Perfiles</a></li>
            <li class=""><a href="" onclick=${() => ListarParametros(true)}><i class="fa fa-circle-o"></i> Parametros</a></li>
        </ul>
    </li>
</ul>`;

module.exports = function navegador(ctx, next) {
    console.log()
    var container = document.getElementById('nav-container')
    empty(container).appendChild(el);
    next();
}