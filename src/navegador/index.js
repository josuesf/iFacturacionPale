var yo  =  require('yo-yo')
var empty = require('empty-element');

var el = yo`<ul class="sidebar-menu" data-widget="tree">
<li class="header">MAIN NAVIGATION</li>
<li class="active treeview">
  <a href="#">
    <i class="fa fa-dashboard"></i> <span>Dashboard</span>
    <span class="pull-right-container">
      <i class="fa fa-angle-left pull-right"></i>
    </span>
  </a>
  <ul class="treeview-menu">
    <li class="active"><a href="index.html"><i class="fa fa-circle-o"></i> Dashboard v1</a></li>
    <li><a href="index2.html"><i class="fa fa-circle-o"></i> Dashboard v2</a></li>
  </ul>
</li>

</ul>`;

module.exports = function navegador (ctx, next) {
    var container = document.getElementById('nav-container')
    empty(container).appendChild(el);
    next();
  }