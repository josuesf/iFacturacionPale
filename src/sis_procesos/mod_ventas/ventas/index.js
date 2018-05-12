var empty = require('empty-element');
var yo = require('yo-yo');
import { URL } from '../../../constantes_entorno/constantes'

var cantidad_tabs = 1

function VerNuevaVenta() {
    cantidad_tabs++
    var tab = yo`
        <li class=""><a href="#tab_${cantidad_tabs}" data-toggle="tab" aria-expanded="false" id="id_${cantidad_tabs}">Ventas</a></li>
     `

    var tabContent = yo`
        <div class="tab-pane" id="tab_${cantidad_tabs}">
            The European languages are members of the same family. Their separate existence is a myth.
            For science, music, sport, etc, Europe uses the same vocabulary. The languages only differ
            in their grammar, their pronunciation and their most common words. Everyone realizes why a
            new common language would be desirable: one could refuse to pay expensive translators. To
            achieve this, it would be necessary to have uniform grammar, pronunciation and more common
            words. If several languages coalesce, the grammar of the resulting language is more simple
            and regular than that of the individual languages.
        </div>`
    
    $("#tabs").append(tab)
    $("#tabs_contents").append(tabContent)
    $("#id_"+cantidad_tabs).click()
    //var tabContent_element = document.getElementById('tabs_contents')
    //tabContent_element.appendChild()
    //empty(tabContent_element).appendChild(tabContent);
}
 

function NuevaVenta() {
    VerNuevaVenta()
}

export { NuevaVenta }