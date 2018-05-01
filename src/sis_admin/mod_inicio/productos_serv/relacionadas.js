var empty = require('empty-element')
var yo = require('yo-yo')


import { URL } from '../../../constantes_entorno/constantes'

function Ver(variables, paginas, pagina_actual, _escritura){
    var el = yo`
    <div>
                <div class="box-header">
                    <h3 class="box-title">Lista de Elementos Relacionados</h3>
                    ${_escritura ? yo`
                    <a class="btn btn-info pull-right">
                        <i class="fa fa-plus"></i> Nuevo</a>`: yo``}
                </div>
                <!-- /.box-header -->
                <div class="box-body">
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
                    <div class="box-footer clearfix">
                        <ul class="pagination pagination-sm no-margin pull-right">
                            <li>
                                <a href="#" onclick=${()=>(pagina_actual>0)?tabRelacionadas(variables, _escritura,pagina_actual-1):null}>«</a>
                            </li>
                            ${((new Array(paginas)).fill(0)).map((p, i) => yo`
                            <li class=${pagina_actual==i? 'active': ''}>
                                <a href="#" onclick=${()=>tabRelacionadas(variables, _escritura,i)} >${i + 1}</a>
                            </li>`)}
    
                            <li>
                                <a href="#" onclick=${()=>(pagina_actual+1
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