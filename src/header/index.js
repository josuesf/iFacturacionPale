var yo = require('yo-yo');
var empty = require('empty-element');

var el = yo`<div class="pos-f-t">
                <nav class="navbar" style="background-color:#352b48">
                    <button class="navbar-toggler" id="sidebarCollapse" type="button">
                    <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="float-left">
                        <div class="row justify-content-end text-white">
                            <div class="col">
                                <div class="dropdown">
                                    <button class=" btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Josue Gay <img src="https://scontent.flim5-3.fna.fbcdn.net/v/t1.0-9/22688495_1570753256315987_747197238207117949_n.jpg?_nc_cat=0&oh=9741eb12275aa78b1775ab729dff9660&oe=5B6684AB" width="30" height="30" alt="..." class="rounded-circle">
                                    </button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <a class="dropdown-item" href="#">Action</a>
                                        <a class="dropdown-item" href="#">Another action</a>
                                        <a class="dropdown-item" href="#">Something else here</a>
                                    </div>
                                </div>
                                
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