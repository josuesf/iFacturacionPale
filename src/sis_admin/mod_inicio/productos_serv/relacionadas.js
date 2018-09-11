var empty = require('empty-element')
var yo = require('yo-yo')


import { URL } from '../../../constantes_entorno/constantes'

function Ver(variables, paginas, pagina_actual, _escritura){
    var el = yo`
    <div class="card">
        <div class="card-head">
            <header>Lista de Elementos Relacionados</header>
            <div class="tools">
                <div class="btn-group">
                ${_escritura ? yo`
                <a class="btn btn-info pull-right" data-toggle="modal" data-target="#modal-nuevo-general" onclick="${() => AgregarElementosRelacionados(variables, _escritura, producto)}">
                    <i class="fa fa-plus"></i> Nuevo</a>`: yo``}
                </div>
            </div>
        </div> 
        <div class="card-body">
            <div class="table-responsive">
                <table id="example1" class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Producto Relacionado</th>
                            <th>Tipo</th>
                            <th>UM</th>
                            <th>Cantidad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                    </tbody>

                </table>
            </div>
            <div class="card-actionbar">
                <ul class="pagination pagination-sm no-margin pull-right">
                    <li>
                        <a href="javascript:void(0);" onclick=${()=>(pagina_actual>0)?tabRelacionadas(variables, _escritura,pagina_actual-1):null}>«</a>
                    </li>
                    ${((new Array(paginas)).fill(0)).map((p, i) => yo`
                    <li class=${pagina_actual==i? 'active': ''}>
                        <a href="javascript:void(0);" onclick=${()=>tabRelacionadas(variables, _escritura,i)} >${i + 1}</a>
                    </li>`)}

                    <li>
                        <a href="javascript:void(0);" onclick=${()=>(pagina_actual+1
                            <paginas)?tabRelacionadas(variables, _escritura,pagina_actual+1):null}>»</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>`


    var main = document.getElementById('tab_general');
    empty(main).appendChild(el);
}


function tabRelacionadas(variables, _escritura, pagina_actual){
    Ver(variables, 1, 0, _escritura)
}

export { tabRelacionadas }