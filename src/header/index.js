var yo = require('yo-yo');
var empty = require('empty-element');

var el = yo`<div class="pos-f-t">
    <nav class="navbar navbar-dark bg-dark">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>
        <div class="float-left">
            <div class="row justify-content-end text-white">
                <div class="col">
                    Nombre de Usuario
                </div>
                <div class="col">
                    <img src="https://scontent.flim5-3.fna.fbcdn.net/v/t1.0-9/22688495_1570753256315987_747197238207117949_n.jpg?_nc_cat=0&oh=9741eb12275aa78b1775ab729dff9660&oe=5B6684AB" width="50" height="50" alt="..." class="rounded-circle">
                </div>
            </div>
        </div>
    </nav>
</div>
`;

module.exports = function header (ctx, next) {
  var container = document.getElementById('header-container')
  empty(container).appendChild(el);
  next();
}