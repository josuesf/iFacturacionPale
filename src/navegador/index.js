var yo  =  require('yo-yo')
var empty = require('empty-element');

var el = yo`<div id="sidebar"><div class="sidebar-header">
<h5>Palerp</h5>
</div>

<!-- Sidebar Links -->
<ul class="list-unstyled components">
<li class="active"><a href="#">Inicio</a></li>
<li><a href="#">Comercial</a></li>

<li><!-- Link with dropdown items -->
    <a href="#homeSubmenu" class="nav-link dropdown-toggle" data-toggle="collapse" aria-expanded="false">Contabilidad</a>
    <ul class="collapse list-unstyled" id="homeSubmenu">
        <li><a href="#">Page</a></li>
        <li><a href="#">Page</a></li>
        <li><a href="#">Page</a></li>
    </ul>

<li><a href="#">Logistica</a></li>
<li><a href="#">Activos Fijos</a></li>
<li><a href="#">Planillas</a></li>
<li><a href="#">Configuracion</a></li>
</ul></div>`;

module.exports = function navegador (ctx, next) {
    var container = document.getElementById('nav-content')
    empty(container).appendChild(el);
    next();
  }