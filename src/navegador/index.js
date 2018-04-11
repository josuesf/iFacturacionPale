var yo  =  require('yo-yo')
var empty = require('empty-element');

var el = yo`<div id="sidebar"><div class="sidebar-header">
<h3>Collapsible Sidebar</div>
</div>

<!-- Sidebar Links -->
<ul class="list-unstyled components">
<li class="active"><a href="#">Home</a></li>
<li><a href="#">About</a></li>

<li><!-- Link with dropdown items -->
    <a href="#homeSubmenu" data-toggle="collapse" aria-expanded="false">Pages</a>
    <ul class="collapse list-unstyled" id="homeSubmenu">
        <li><a href="#">Page</a></li>
        <li><a href="#">Page</a></li>
        <li><a href="#">Page</a></li>
    </ul>

<li><a href="#">Portfolio</a></li>
<li><a href="#">Contact</a></li>
</ul></div>`;

module.exports = function navegador (ctx, next) {
    var container = document.getElementById('nav-content')
    empty(container).appendChild(el);
    next();
  }