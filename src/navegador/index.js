var yo  =  require('yo-yo')
var empty = require('empty-element');

import {Listar} from '../usuarios/listar'

<<<<<<< HEAD
=======

>>>>>>> 817e062dbff23230c327653e290c7222d48a5952
var el = yo`
<ul class="sidebar-menu" data-widget="tree">
    <li class="header">Mantenimientos</li>
    <li class="treeview">
        <a href="#">
            <i class="fa fa-cog"></i> <span>Configuracion</span>
            <span class="pull-right-container">
            <i class="fa fa-angle-left pull-right"></i>
            </span>
        </a>
        <ul class="treeview-menu">
            <li class=""><a href="" onclick=${()=>Listar(true)}><i class="fa fa-circle-o"></i> Usuarios</a></li>
        </ul>
    </li>
</ul>`;


module.exports = function navegador (ctx, next) {
    console.log()
    var container = document.getElementById('nav-container')
    empty(container).appendChild(el);
    next();
}