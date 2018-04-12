var yo = require('yo-yo');
var empty = require('empty-element');

var el = yo`<div>
    <div class="pull-right hidden-xs">
      <b>Version</b> 2.4.0
    </div>
    <strong>Copyright &copy; 2014-2016 <a href="https://adminlte.io">Almsaeed Studio</a>.</strong> All rights
    reserved.
</div>`

module.exports = function footer (ctx, next) {
  var container = document.getElementById('footer-container')
  empty(container).appendChild(el);
  next();
}
