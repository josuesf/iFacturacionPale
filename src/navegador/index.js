var yo = require('yo-yo')
var empty = require('empty-element');
import { URL } from '../constantes_entorno/constantes'


import { ListarUsuarios } from '../sis_admin/mod_configuracion/usuarios/listar'
import { ListarCajas } from '../sis_admin/mod_configuracion/cajas/listar'
import { ListarModulos } from '../sis_admin/mod_configuracion/modulos/listar'
import { ListarSucursales } from '../sis_admin/mod_configuracion/sucursales/listar'
import { ListarPerfiles } from '../sis_admin/mod_configuracion/perfiles/listar'
import { ListarParametros } from '../sis_admin/mod_configuracion/parametros/listar';
import { ListarEmpresa } from '../sis_admin/mod_configuracion/empresa/listar'

//views de logistica
import { ListarCategorias } from '../sis_admin/mod_logistica/categorias/listar'
import { ListarTurnos } from '../sis_admin/mod_logistica/turnos/listar'
import { ListarAlmacenes } from '../sis_admin/mod_logistica/almacenes/listar'
import { ListarConceptos } from '../sis_admin/mod_logistica/conceptos/listar'

//views de inicio
import { ListarProductosServ } from '../sis_admin/mod_inicio/productos_serv/listar'
//Views Inicio
import { ListarClientes } from '../sis_admin/mod_inicio/clientes_prov/listar'
//View Contabilidad
import {ListarCuentasBancarias} from '../sis_admin/mod_contabilidad/cuentas_bancarias/listar'

function Ver(Flag_Cerrado) { 
    var el = yo`

        <ul id="main-menu" class="gui-controls"> 

            <li class="gui-folder expanded">
                <a>
                    <div class="gui-icon"><i class="fa fa-circle-o"></i></div>
                    <span class="title">Mantenimientos</span>
                </a> 
                <ul>
                    <li>
                        <a href="javascript:void(0)" onclick=${() => ListarProductosServ(true)}><span class="title"> Productos y servicios</span></a>
                    </li>
                    <li>
                        <a href="javascript:void(0)" onclick=${() => ListarClientes(true)}><span class="title"> Cliente/Proveedor</span></a>
                    </li>
                </ul>
            </li>

            <li class="gui-folder">
                <a>
                    <div class="gui-icon"><i class="fa fa-circle-o"></i></div>
                    <span class="title">Contabilidad</span>
                </a> 
                <ul>
                    <li>
                        <a href="javascript:void(0)" onclick=${() => ListarCuentasBancarias(true)}><span class="title"> Cuentas Bancarias</span></a>
                    </li>
                </ul>
            </li>

            <li class="gui-folder">
                <a>
                    <div class="gui-icon"><i class="fa fa-circle-o"></i></div>
                    <span class="title">Logistica</span>
                </a> 
                <ul>
                    <li>
                        <a href="javascript:void(0)" onclick=${() => ListarCategorias(true)}><span class="title"> Categoria</span></a>
                    </li>
                    <li>
                        <a href="javascript:void(0)" onclick=${() => ListarTurnos(true)}><span class="title"> Turnos de Atencion</span></a>
                    </li>
                    <li>
                        <a href="javascript:void(0)" onclick=${() => ListarAlmacenes(true)}><span class="title"> Almacenes</span></a>
                    </li>
                    <li>
                        <a href="javascript:void(0)" onclick=${() => ListarConceptos(true)}><span class="title"> Conceptos</span></a>
                    </li>
                    
                </ul>
            </li>

            <li class="gui-folder">
                <a>
                    <div class="gui-icon"><i class="fa fa-circle-o"></i></div>
                    <span class="title">Configuracion</span>
                </a> 
                <ul>
                    <li>
                        <a href="javascript:void(0)" onclick=${() => ListarEmpresa(true)}><span class="title"> Empresa</span></a>
                    </li>
                    
                    <li>
                        <a href="javascript:void(0)" onclick=${() => ListarSucursales(true)}><span class="title"> Sucursales</span></a>
                    </li>
                    <li>
                        <a href="javascript:void(0)" onclick=${() => ListarUsuarios(true)}><span class="title"> Usuarios</span></a>
                    </li>
                    <li>
                        <a href="javascript:void(0)" onclick=${() => ListarPerfiles(true)}><span class="title"> Perfiles</span></a>
                    </li>
                    <li>
                        <a href="javascript:void(0)" onclick=${() => ListarCajas(true)}><span class="title"> Cajas</span></a>
                    </li>
                    <li>
                        <a href="javascript:void(0)" onclick=${() => ListarParametros(true)}><span class="title"> Parametros</span></a>
                    </li>
                    <li>
                        <a href="javascript:void(0)" onclick=${() => ListarModulos(true)}><span class="title"> Modulos</span></a>
                    </li>
                    
                </ul>
            </li>
    
        </ul>`;
    
    var container = document.getElementById('nav-container')
    empty(container).appendChild(el);
    
    $.getScript("/assets/js/core/cache/63d0445130d69b2868a8d28c93309746.js", function( data, textStatus, jqxhr ) {
    });

}

module.exports = function navegador(ctx, next) {
    /*var container = document.getElementById('nav-container')
    empty(container).appendChild(el);
    $.getScript("/assets/js/core/cache/63d0445130d69b2868a8d28c93309746.js", function( data, textStatus, jqxhr ) {
    });*/

    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
        })
    }
    fetch(URL+'/cajas_api/get_arqueo', parametros)
    .then(req => req.json())
    .then(res => { 
        console.log("get arqueo de caja")
        Ver(res.arqueo[0].Flag_Cerrado)
    }).catch(function (e) {
        console.log(e);
        //toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
    });

    // next();
}