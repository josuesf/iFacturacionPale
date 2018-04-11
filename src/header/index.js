var yo = require('yo-yo');
var empty = require('empty-element');

var el = yo`<nav class="navbar navbar-expand-sm navbar-light bg-faded">
<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#nav-content" aria-controls="nav-content" aria-expanded="false" aria-label="Toggle navigation">
<span class="navbar-toggler-icon"></span>
</button>

<!-- Brand -->
<a class="navbar-brand" href="#">Logo</a>

<!-- Links -->
<div class="collapse navbar-collapse justify-content-end" id="nav-content">   
<ul class="navbar-nav">
<li class="nav-item">
<a class="nav-link" href="#">Link 1</a>
</li>
<li class="nav-item">
<a class="nav-link" href="#">Link 2</a>
</li>
<li class="nav-item">
<a class="nav-link" href="#">Link 3</a>
</li>
</ul>
</nav>`;

module.exports = function header (ctx, next) {
  var container = document.getElementById('header-container')
  empty(container).appendChild(el);
  next();
}