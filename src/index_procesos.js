require('babel-polyfill');
var page = require('page');
var navegador = require('./navegador_procesos')
import {ENV_WEB} from './constantes_entorno/constantes'

if (!ENV_WEB)
    navegador()
else {
    require('./home_procesos');
    page();
}
