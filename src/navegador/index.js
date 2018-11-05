var yo = require('yo-yo')
var empty = require('empty-element');
import { URL } from '../constantes_entorno/constantes'
 
function Ver() { 
    var el =yo` <ul id="main-menu" class="gui-controls">
                    <li class="gui-folder not-active">
                        <a>
                            <div class="gui-icon"><i class="md md-shopping-cart"></i></div>
                            <span class="title"> Ventas <span class="badge style-accent"><i class="md md-lock"></i> BLOQUEADO</span></span>
                        </a> 
                        
                    </li>
                    <li class="gui-folder not-active">
                        <a>
                            <div class="gui-icon"><i class="fa fa-cart-arrow-down"></i></div>
                            <span class="title"> Compras <span class="badge style-accent"><i class="md md-lock"></i> BLOQUEADO</span></span>
                        </a> 
                        
                    </li>
                    <li class="gui-folder not-active">
                        <a>
                            <div class="gui-icon"><i class="fa fa-circle-o"></i></div>
                            <span class="title"> Almacen <span class="badge style-accent"><i class="md md-lock"></i> BLOQUEADO</span></span>
                        </a> 
                        
                    </li>
                    <li class="gui-folder not-active">
                        <a>
                            <div class="gui-icon"><i class="fa fa-cogs"></i></div>
                            <span class="title"> Administracion <span class="badge style-accent"><i class="md md-lock"></i> BLOQUEADO</span></span>
                        </a> 
                        
                    </li>
                    <li class="gui-folder not-active">
                        <a>
                            <div class="gui-icon"><i class="fa fa-bar-chart-o"></i></div>
                            <span class="title"> Reportes <span class="badge style-accent"><i class="md md-lock"></i> BLOQUEADO</span></span>
                        </a> 
                    </li>
                    <li>
                        <a>
                            <div class="gui-icon"><i class="md md-search"></i></div>
                            <span class="title"> Consultas </span>
                        </a>
                    </li> 
                </ul>`;
    
    var container = document.getElementById('nav-container')
    empty(container).appendChild(el);
    
    $.getScript("/assets/js/core/cache/63d0445130d69b2868a8d28c93309746.js", function( data, textStatus, jqxhr ) {
    });

}

module.exports = function navegador(ctx, next) {
    Ver()
}