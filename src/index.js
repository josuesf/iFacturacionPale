require('babel-polyfill');
var page = require('page');
var navegador = require('./navegador')
import {ENV_WEB} from './constantes_entorno/constantes'

if (!ENV_WEB)
    navegador()
else {
    require('./homepage');
    page();
}
